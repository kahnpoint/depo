import { install } from "./install.ts";
import { DENO_JSON } from "../meta/deno.json.ts";

// update a module in deno.json
export function update(module: string) {
  let moduleName = module;
  if (module.slice(1).includes("@")) {
    moduleName = module.slice(0, module.slice(1).indexOf("@", 0) + 1);
  }

  // get module url from deno.json
  const moduleUrl = DENO_JSON["imports"][moduleName];

  // get source from original module url
  let source: string;
  if (moduleUrl.startsWith("https://esm.sh/gh/")) {
    source = "github";
  } else if ((moduleUrl.startsWith("https://deno.land/x/"))) {
    source = "deno";
  } else {
    source = "node";
  }

  // handle url flags as a string
  const flags = moduleUrl.slice(moduleUrl.indexOf("?") + 1);

  // install the module
  install(source, module, flags);
}
