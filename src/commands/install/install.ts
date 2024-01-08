import { DEPO_JSON } from "@/meta/depo.json.ts";
import { DENO_JSON } from "@/meta/deno.json.ts";
import { stableDenoStd, unstableDenoStd } from "@/meta/deno.std.ts";
import { DEFAULT_SOURCE } from "@/sources/sources.ts";
import { getRedirectUrl } from "@/utils/getRedirectUrl.ts";

interface InstallOptions {
  // the source of the module
  // node, github, or deno
  source: string;

  // the name of the module
  pkg: string;

  // the flags to add to the url
  flags: Record<string, any> | string;
}

export async function install(options: InstallOptions) {
  // check if the module is ""
  if (!options.pkg) {
    console.log("Required: %c[modules]", "color: yellow");
    return;
  }

  // check if the flags are a string (from the update command)
  let stringFlags = "";
  if (typeof options.flags === "string") {
    stringFlags = options.flags;
    options.flags = {};
  }

  // if the options.pkg is a url or starts with npm:, just add it to deno.json
  if (
    options.pkg.startsWith("http://") || options.pkg.startsWith("https://") ||
    options.pkg.startsWith("npm:")
  ) {
    DENO_JSON["imports"][options.pkg] = options.pkg +
      buildQueryParameters(options.flags);
    Deno.writeTextFileSync("deno.json", JSON.stringify(DENO_JSON, null, 2));
    return;
  }

  // use an alias if specified
  let aliasedPkg: string = options.flags.as ?? options.pkg;

  // only take before the @, ignoring an @ if it starts with it
  // like worst case scenario:
  // @babel/core@^5.0.0
  if (aliasedPkg.slice(1).includes("@")) {
    aliasedPkg = aliasedPkg.slice(0, aliasedPkg.slice(1).indexOf("@", 0) + 1);
  }

  // check if a standard module module is being installed
  if (unstableDenoStd.has(aliasedPkg) || stableDenoStd.has(aliasedPkg)) {
    DENO_JSON["imports"][aliasedPkg] =
      `https://deno.land/std@${DEPO_JSON.deno.std.version}/${aliasedPkg}/mod.ts` +
      buildQueryParameters(options.flags);
    Deno.writeTextFileSync("deno.json", JSON.stringify(DENO_JSON, null, 2));
  } else {
    options.source = options.source || DEFAULT_SOURCE;
    switch (options.source) {
      case "npm": {
        DENO_JSON["imports"][aliasedPkg] = await getRedirectUrl(
              `https://esm.sh/${DEPO_JSON.esm.version}/${options.pkg}`,
            ) +
            buildQueryParameters(options.flags) || stringFlags || "";
        break;
      }
      case "github": {
        aliasedPkg = aliasedPkg.split("/")[1];
        DENO_JSON["imports"][aliasedPkg] = `https://esm.sh/gh/${options.pkg}` +
            buildQueryParameters(options.flags) || stringFlags || "";
        break;
      }
      case "deno": {
        if (aliasedPkg.includes("/")) {
          aliasedPkg = aliasedPkg.slice(0, aliasedPkg.indexOf("/"));
        }
        DENO_JSON["imports"][aliasedPkg] =
          `https://deno.land/x/${options.pkg}` +
            buildQueryParameters(options.flags) || stringFlags || "";
        break;
      }
    }
    Deno.writeTextFileSync("deno.json", JSON.stringify(DENO_JSON, null, 2));
  }

  // generate deps.ts
  /*
  let DEPS_JSON = ["// This file is auto-generated by Depo", ""];
  let exports = [];

  for (const [key, value] of Object.entries(DENO_JSON["imports"])) {
    if (key === "deps") {
      continue;
    }
    const modifiedKey = key.replaceAll("/", "__").replaceAll("-", "_")
      .replaceAll("@", "");
    console.log(modifiedKey, value);
    DEPS_JSON.push(`import * as ${modifiedKey} from "${value}";`);
    exports.push(`${modifiedKey}`);
  }

  DEPS_JSON.push("");
  DEPS_JSON.push(`export { ${exports.join(", ")} };`);

  Deno.writeTextFileSync("src/deps.ts", DEPS_JSON.join("\n"));
  */
  // cache deps
  // run("deno", { args: ["cache", "src/deps.ts"] });
}

// add the options.flags to the esm.sh url
function buildQueryParameters(flags: Record<string, any>) {
  let query = "?";
  for (const key in flags) {
    const value = flags[key];
    if (value === true) {
      query += `${key}&`;
    } else if (typeof value === "string" && key !== "as") {
      query += `${key}=${value}&`;
    }
  }
  return query.slice(0, -1);
}

