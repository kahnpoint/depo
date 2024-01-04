// the default deno.json file
export const DEFAULT_DENO_JSON: Record<string, Record<string, any>> = {
  "tasks": {
    "main": "deno run src/main.ts",
    "dev": "deno run --watch src/main.ts",
    "build": `deno compile --output ./${Deno.cwd().split("/")[-1]} src/main.ts`,
  },
  "imports": {
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
