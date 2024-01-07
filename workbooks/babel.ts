import * as babel from '@babel/standalone'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import types from '@babel/types'

// Parse the code
const code = `

export default function Test() {}

const a = 1;
const b = 2;

export { a };

// depo-am-include
export { b };   

// depo-am-include
export const c = 4;

`;
const raw_filename = 'bar.js'
const filename = raw_filename.split('.').slice(0, -1).join('.')
const filetype = raw_filename.split('.').pop()
console.log(filename, filetype)

const importSet = new Set();
const exportSet = new Set();
const outputTextList = [];

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'], // enable JSX and TypeScript plugins
});

function testExport(exportName: string, exportType: "named" | "default"){
  switch(exportType){
    case "named":
      importSet.add(exportName)
      exportSet.add(exportName)
      break;
    case "default":
      exportName = exportName === 'anonymous' ? filename : exportName   
      outputTextList.push(`import ${exportName} from './${filename}'`)
      exportSet.add(exportName)
      break;
  }  
}

// Traverse the AST
traverse(ast, {
  ExportNamedDeclaration(path) {
    const declaration = path.node.declaration;
    const leadingComments = path.node.leadingComments;
    let depoAutoModNotInclude = true;
    leadingComments?.forEach((comment) => {
      console.log("leading-comment", comment.value);
      if (comment.value.includes("depo-am-include")) {
        depoAutoModNotInclude = false;
        return;
      }
    })
    if (depoAutoModNotInclude) return;
    if (declaration) {
      if (types.isVariableDeclaration(declaration)) {
        declaration.declarations.forEach((decl) => {
          console.log(`Named export: ${decl.id.name}`);
          testExport(decl.id.name, "named")
        });
      } else if (types.isFunctionDeclaration(declaration)) {
        console.log(`Named export: ${declaration.id.name}`);
        testExport(declaration.id.name, "named")
      } else if (types.isClassDeclaration(declaration)) {
        console.log(`Named export: ${declaration.id.name}`);
        testExport(declaration.id.name, "named")
      }
    } else if (path.node.specifiers && path.node.specifiers.length > 0) {
      path.node.specifiers.forEach((specifier) => {
        console.log(`Named export: ${specifier.exported.name}`);
        testExport(specifier.exported.name, "named")
      });
    }
  },
  ExportDefaultDeclaration(path) {
    if (path.node.declaration) {
      let name = '';
      if (types.isIdentifier(path.node.declaration)) {
        name = path.node.declaration.name;
      } else if (types.isFunctionDeclaration(path.node.declaration) || types.isClassDeclaration(path.node.declaration)) {
        name = path.node.declaration.id ? path.node.declaration.id.name : 'anonymous';
      }
      console.log(`Default export: ${name}`);
      testExport(name, "default")
    }
  },
  ExportAllDeclaration(path) {
    console.log(`Export all from: ${path.node.source.value}`);
  },
});

outputTextList.push(`import { ${[...importSet].join(', ')} } from './${filename}'`)
outputTextList.push(`export { ${[...exportSet].join(', ')} } from './${filename}'`);
console.log(outputTextList.join('\n'))