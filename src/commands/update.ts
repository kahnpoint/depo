import { remove } from "./remove.ts";
import { install } from "./install.ts";
import { DENO_JSON } from "../meta/deno.json.ts";

export function update(module: string) {
  let moduleName = module;
  if (module.slice(1).includes("@")) {
    moduleName = module.slice(0, module.slice(1).indexOf("@", 0) + 1);
  }

  const moduleUrl = DENO_JSON["imports"][moduleName];

  let source: string;
  if (moduleUrl.startsWith("https://esm.sh/gh/")) {
    source = "github";
  } else if ((moduleUrl.startsWith("https://deno.land/x/"))) {
    source = "deno";
  } else {
    source = "node";
  }

  const flags = moduleUrl.slice(moduleUrl.indexOf("?") + 1);

  install(source, module, flags);
}
