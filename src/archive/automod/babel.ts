import * as babel from '@babel/standalone'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import types from '@babel/types'
import { splitFilenameAndExtension, splitFolderPathAndFile } from "./utils.ts"
import { DEPO_JSON } from "@/meta/depo.json.ts";

// comments to manually include or ignore an export
const includeComment = "depo-am-include"
const ignoreComment = "depo-am-ignore"

// this function returns a list of the import and export lines
export function parseFileForAutoMod(filepath: string) {

  // read in the preexisting file
  const decoder = new TextDecoder("utf-8");
  let rawText
  try{
    rawText= decoder.decode(Deno.readFileSync(filepath));
  } catch {
    rawText = ""
  }
  
  
  // split the full filepath into the folder and file
  const [folder, file] = splitFolderPathAndFile(filepath);
  // split the file into filename and extension
  const [ filename, filetype ] = splitFilenameAndExtension(file);
  
  // these variables represent the final outputs of the file
  const importSet = new Set();
  const exportSet = new Set();
  const outputTextList = [];

  // parse the file into an AST
  const ast = parser.parse(rawText, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'], // enable JSX and TypeScript plugins
  });

  // figure out if an export is named or default and handle it
  function handleExport(exportName: string, exportType: "named" | "default", filename: string){
       
    // add the export to the import and export sets
    switch(exportType){
      case "named":
        importSet.add(exportName)
        exportSet.add(exportName)
        break;
      case "default":
        exportName = exportName === 'anonymous' ? filename : exportName   
        outputTextList.push(`import ${exportName} from './${file}'`)
        exportSet.add(exportName)
        break;
    }  
  }

  // Traverse the AST
  traverse(ast, {
    
    // named exports
    ExportNamedDeclaration(path) {
      
      // get the declaration (what is being exported by the export statement)
      const declaration = path.node.declaration;

      // the final list of variable names to be exported
      let exportNames = [];
      
      // add the declaration(s) to the exportNames list
      if (declaration) {
        if (types.isVariableDeclaration(declaration)) {
          declaration.declarations.forEach((decl) => {
            exportNames.push(decl.id.name);
          });
        } else if (types.isFunctionDeclaration(declaration)) {
          exportNames.push(declaration.id.name);
        } else if (types.isClassDeclaration(declaration)) {
          exportNames.push(declaration.id.name);
        }
      } else if (path.node.specifiers && path.node.specifiers.length > 0) {
        path.node.specifiers.forEach((specifier) => {
          exportNames.push(specifier.exported.name);
        });
      }
      
      // next, we need to find out if the exports should be included in the mod file
      
      // whether to include the variable list in exports
      let depoAutoModInclude = false;
            
      // get the leading comments
      const leadingComments = path.node.leadingComments;
      
      // test if the leading comments include the include or ignore comment
      leadingComments?.forEach((comment) => {
        if (comment.value.includes(includeComment)) {
          depoAutoModInclude = true;
        } else if (comment.value.includes(ignoreComment)) {
          depoAutoModInclude = false;
          return;
        } 
      })
      
      // iterate through the variable names and add them to the import and export sets
      for (const variableName of exportNames) {
        if (depoAutoModInclude || variableName === filename) {
          handleExport(variableName, "named", filename)
        }
      }
           
      
    },
    
    // default exports
    ExportDefaultDeclaration(path) {
      if (path.node.declaration) {
        let name = '';
        if (types.isIdentifier(path.node.declaration)) {
          name = path.node.declaration.name;
        } else if (types.isFunctionDeclaration(path.node.declaration) || types.isClassDeclaration(path.node.declaration)) {
          name = path.node.declaration.id ? path.node.declaration.id.name : 'anonymous';
        }
        handleExport(name, "default", filename)
      }
    },
    
    // export all
    ExportAllDeclaration(path) { 
      const declaration = path.node.declaration;
      const leadingComments = path.node.leadingComments;
      let depoAutoModInclude = false;
      leadingComments?.forEach((comment) => {
        if (comment.value.includes(includeComment)) {
          depoAutoModInclude = true;
        } else if (comment.value.includes(ignoreComment)) {
          depoAutoModInclude = false;
          return;
        }
      })
      
      if (filename === path.node.source?.value) {
        console.log(filename, "filename === path.node.source?.value")
        depoAutoModInclude = true;
      }
      
      if (!depoAutoModInclude) return;
            
      const [allFolder, allFile] = splitFolderPathAndFile(path.node.source.value)
      const [allFilename, allFiletype] = splitFilenameAndExtension(allFile)
      
      outputTextList.push(`import * as ${allFilename} from '${path.node.source.value}'`)
      exportSet.add(allFilename)
    },
     
  });

  // build the final output 
  outputTextList.push(`import { ${[...importSet].join(', ')} } from './${file}'`)
  outputTextList.push(`export { ${[...exportSet].join(', ')} }`);
  return outputTextList
}