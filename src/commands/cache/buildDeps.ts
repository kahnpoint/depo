import { DENO_JSON } from "@/meta/deno.json.ts";
import { DEPO_JSON } from "@/meta/depo.json.ts";
import { run } from "@/utils/run.ts";

export async function buildDeps(cache=true){
  
  const allExportNames = new Set<string>()
  
  // read deps.ts
  let originalDeps 
  try{
    originalDeps = Deno.readTextFileSync("deps.ts");
  } catch {
    originalDeps = ""
  }
  
  if (!(originalDeps.includes(DEPO_JSON.depo.generation.warning))){
    originalDeps += DEPO_JSON.depo.generation.warning
  }
  
  // split the originaldeps into before and after the generation warning
  const [before, after] = originalDeps.split(DEPO_JSON.depo.generation.warning);
  
  const outputTextList = [before + DEPO_JSON.depo.generation.warning]
  
  for (const [key, value] of Object.entries(DENO_JSON.imports)) {
    const includeImportStarts = ["http://", "https://", "npm:"]
    if (includeImportStarts.some((start) => value.startsWith(start))){
      const charsToReplace = ["/", "@", "#", "?", "&", "=", ":", ".", "-"]
      let importName = key
      
      if (importName.endsWith("/")){
        continue
      }
      
      for (const char of charsToReplace){  
        importName = importName.replaceAll(char, "_")
      }
      if (importName.startsWith("_")){
        importName = importName.slice(1)
      }
      
      outputTextList.push(`import * as ${importName} from '${key}'`)
      allExportNames.add(importName)
    }
  }
  
  outputTextList.push("")
  
  outputTextList.push(`export {${Array.from(allExportNames).join(", ")}};`)
   
  Deno.writeTextFileSync("deps.ts", outputTextList.join("\n"))
  
  return outputTextList.join("\n")
  
}
