import { DEPO_JSON } from "./depo.json.ts";

// the default deno.json file
export const DEFAULT_DENO_JSON: Record<string, Record<string, any>> = {
  "tasks": {
    // run the mod.ts file once 
    "mod": "deno run -A --unstable src/mod.ts",
    // watch the mod.ts file and run it on change
    "dev": "deno cache deps.ts && NODE_ENV='development' deno run -A --unstable --watch src/mod.ts",
    // compile the mod.ts file to a binary
    "build": `deno compile -A --output ${DEPO_JSON.module.name} src/mod.ts`,
  },
  "imports": {
    "@/": "./src/",
    "deps": DEPO_JSON.deno.deps.location,
  },
  //"lint": {},
  //"fmt": {},
};

// DENO_JSON is either the project's deno.json file or the default one
export let DENO_JSON: typeof DEFAULT_DENO_JSON;
try {
  DENO_JSON = JSON.parse(await Deno.readTextFile("deno.json"));
} catch {
  DENO_JSON = DEFAULT_DENO_JSON;
}
