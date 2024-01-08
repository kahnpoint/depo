import * as fs from "fs";
import { debounce } from "async";
import { DEPO_JSON } from "@/meta/depo.json.ts";
import { splitFilenameAndExtension, splitFolderPathAndFile } from "./utils.ts";
import { parseFileForAutoMod } from "./babel.ts";
import _ from 'lodash';

const debounceFunction = debounce((event: Deno.FsEvent) => {
  console.log(event);
}, 200);

const src_dir = Deno.cwd() + "/workbooks/input/";
const watcher = Deno.watchFs(src_dir);


// this function creates a blank mod.ts file in a folder
async function createModTs(path: string) {
  const pathData = await Deno.stat(path);
  
  if (pathData.isDirectory) {
    //create mod.ts file
    Deno.writeTextFile(path + '/mod.ts', DEPO_JSON.depo.generation.warning);
  } else if (pathData.isFile){
    // ignore mod.ts
    if (path.endsWith("/mod.ts")) {
      return;
    }
  }
  
}


const inputFolder = "./workbooks/input/";
let output = [];
//const outputFolder = "./workbooks/output/";

const folderContents = Deno.readDirSync(inputFolder);
//console.log(...folderContents);

const catalogedFiletypes = new Set(["ts", "js", "tsx", "jsx"]);


output.push(DEPO_JSON.depo.generation.warning);

for await (const dirEntry of folderContents) {
  output.push("");
  
  if (dirEntry.isFile) {
  
    const [filename, extension] = splitFilenameAndExtension(dirEntry.name);
    
    if (filename === "mod") {
      // skip the mod file
      continue;
    } 
    
    if (catalogedFiletypes.has(extension)){
      
      output.push("// " + filename);
      //console.log("// " + dirEntry.name);
      //console.log(inputFolder + dirEntry.name) 
      output = output.concat(parseFileForAutoMod(inputFolder + dirEntry.name))
      
    } else {
      null
    }
    
  } else if (dirEntry.isDirectory){
    // do nothing
    null
  } 
}

console.log(output.join("\n"));

Deno.writeTextFile(inputFolder + "mod.ts", output.join("\n"));


    

// main watcher loop
for await (const event of watcher) {
  debounceFunction(switchEvent(event));

}

function switchEvent(event: Deno.FsEvent){
  for (const path of event.paths) {
    //const [ folder, file ] = splitFolderPathAndFile(path);
    
    switch (event.kind) {
      case "create":
        createFunction(path);
        break;
      case "access": {
        //modifyFunction(path);
        // console.log(">>>> access", path);
      }break;
      case "modify":{
        modifyFunction(path);
      }break;
      case "remove":{
        console.log(">>>> remove", path);
      }break;
      default:{
        console.log("default event", event);
      }break;
    }
  }
}

function modifyFunction(path: string) {
  console.log(">>>> modify", path);
  if (path.endsWith("mod.ts")) {
    return;
  }
  
  const [folder, file] = splitFolderPathAndFile(path);
  
  console.log(path)
  buildModTs(folder);

}

function buildModTs(folder: string) {
  // read existing mod.ts file
  let existingModTs = Deno.readTextFileSync(folder + "/mod.ts") ?? "";; 
  
  // add warning if it doesn't exist
  if (!existingModTs.includes(DEPO_JSON.depo.generation.warning)) {
    existingModTs += "/n" + DEPO_JSON.depo.generation.warning;
  }
  
  // split mod ts into before and after the auto mod warning section
  const [beforeWarning, afterWarning] = existingModTs.split(DEPO_JSON.depo.generation.warning);
  
  console.log(folder)
  console.log(listFiles(folder));
  
}


function createFunction(path: string) {
  console.log(">>>> create", path);
        setTimeout(() => {
          createModTs(path);
        }, 100);
}

// 


function listFiles(folder: string) {
  const files = Deno.readDirSync(folder);
  for (const file of files) {
    if (file.isDirectory) {
      listFiles(folder + "/" + file.name);
    }
  }
}
