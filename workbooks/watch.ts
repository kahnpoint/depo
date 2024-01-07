// let watcher = Deno.watchFs("./");

// for await (const event of watcher) {
//   console.log(">>>> event", event);

//   watcher.close();
// }
import * as fs from "fs";
import { debounce } from "async";

const log = debounce((event: Deno.FsEvent) => {
  console.log(event);
}, 200);


let src_dir = Deno.cwd() + "/src";
let watcher = Deno.watchFs(src_dir);

async function createModTs(path: string) {
  const pathData = await Deno.stat(path);
  
  if (pathData.isDirectory) {
    //create mod.ts file
    Deno.writeTextFile(path + '/mod.ts', ``);
  } else if (pathData.isFile){
    // ignore mod.ts
    if (path.endsWith("/mod.ts")) {
      return;
    }
  }
  
}


// main watcher loop
for await (const event of watcher) {
  log(event);
  
  for (const path of event.paths) {
    const { folder, file } = splitFolderPathAndFile(path);
    //
    
    //console.log(folder, file);
    
    listFiles(folder);
    switch (event.kind) {
      case "create":
        createFunction(path);
        break;
      case "modify":
        console.log(">>>> modify", path);
        break;
      case "remove":
        console.log(">>>> remove", path);
        break;
    }
  }
}

function createFunction(path: string) {
  console.log(">>>> create", path);
        setTimeout(() => {
          createModTs(path);
        }, 100);
}

// 
function splitFolderPathAndFile(path: string) {
  const pathArray = path.split("/");
  const file = pathArray.pop();
  const folder = pathArray.join("/");
  return { folder, file };
}

function listFiles(folder: string) {
  const files = Deno.readDirSync(folder);
  for (const file of files) {
    if (file.isDirectory) {
      null
    } else {
      console.log(`${folder}/${file.name}`);
    }
  }
}