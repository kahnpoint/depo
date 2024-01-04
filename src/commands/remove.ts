import { DENO_JSON } from "../meta/deno.json.ts";

// remove a module from deno.json
export function remove(module: string) {
  delete DENO_JSON["imports"][module];
  Deno.writeTextFileSync("deno.json", JSON.stringify(DENO_JSON, null, 2));
}
