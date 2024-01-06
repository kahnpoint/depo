import { DEPO_JSON } from "./depo.json.ts";

// the default deno.json file
export const DEFAULT_DENO_JSON: Record<string, Record<string, any>> = {
  "tasks": {
    "mod": "deno run src/mod.ts",
    "dev": "deno run --watch src/mod.ts",
    "build": `deno compile --output ${DEPO_JSON.module.name} src/mod.ts`,
  },
  "imports": {
    "@/": "./src/",
    "deps": "./src/deps.ts",
  },
  "lint": {},
  "fmt": {},
};

// DENO_JSON is either the project's deno.json file or the default one
export let DENO_JSON: typeof DEFAULT_DENO_JSON;
try {
  DENO_JSON = JSON.parse(await Deno.readTextFile("deno.json"));
} catch {
  DENO_JSON = DEFAULT_DENO_JSON;
}
