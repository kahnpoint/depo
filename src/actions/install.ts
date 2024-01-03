import { DEPO_JSON } from "../depo.json.ts";
import { run } from "../utils/utils.ts";
import { Command } from "cliffy-command";
import { sourceEnum } from "../sources/sources.ts";
import { DENO_JSON } from "../deno.json.ts";

export const installCommand = new Command()
  .type("source", sourceEnum)
  .description("Install a library from a source.")
  .arguments("<library:string> [source:source]")
  .group("arguments")
  /*
    --as <string>
        import a library as a different name
        "preact/compat" --as "react"
    */
  .option("--as <string>", "Import a library as a different name")
  /*
    --alias <string>
        manually alias a library
        "preact/compat" --alias "react"
        "https://esm.sh/swr?alias=react:preact/compat";
    */
  .option("--alias <string[]>", "Manually alias a library's dependencies")
  /*
    --deps <string>
        manually specify dependencies
        swr --deps "react@17.0.2"
        "https://esm.sh/swr?deps=react@17.0.2"
    */
  .option("--deps <string[]>", "Manually specify dependencies")
  /*
    --exports <string>
        only install specific exports
        "https://esm.sh/tslib?exports=__await,__rest"
    */
  .option("--exports <string[]>", "Only install specific exports")
  /*
    --external <string>
        do not rewrite the import specifiers of the specified dependencies
            "https://esm.sh/preact-render-to-string@5.2.0?external=preact,react"
    */
  .option(
    "--external <string[]>",
    "Do not rewrite the import specifiers of the specified dependencies",
  )
  /*
    --target <string>
        specify the target environment
        available targets are: es2015 - es2022, esnext, deno, and denonext.
        "https://esm.sh/react?target=es2020"
    */
  .option("--target <string>", "Specify the target environment")
  /*
    --conditions <string>
        esbuild - controls how the exports field in library.json is interpreted
        [https://esbuild.github.io/api/#conditions]
        "https://esm.sh/foo?conditions=custom1,custom2"
    */
  .option(
    "--conditions <string[]>",
    "Controls how the exports field in library.json is interpreted",
  )
  /*
    --deno-std <string>
        use a specific version of deno std
        "https://esm.sh/postcss?deno-std=0.128.0";
    */
  .option("--deno-std <string>", "Use a specific version of deno std")
  /*
    --pin <string>
        pin the esm.sh version
        "https://esm.sh/v135/react-dom";
        "https://esm.sh/react-dom?pin=v135";
    */
  .option("--pin <string>", "Pin the esm.sh version")
  .group("flags")
  /*
    --bundle-deps
        bundle dependencies into a single js file
        "https://esm.sh/swr?bundle-deps"
    */
  .option("--bundle-deps", "Bundle dependencies into a single js file")
  /*
    --no-bundle
        don't bundle any dependencies
        "https://esm.sh/swr?no-bundle"
    */
  .option("--no-bundle", "Don't bundle any dependencies")
  /*
    --dev
        use the dev version of the library
        "https://esm.sh/react?dev"
    */
  .option("--dev", "Use the dev version of the library")
  /*
    --keep-names
        esbuild - keep original names, even in minified code
        [https://esbuild.github.io/api/#keep-names]
    */
  .option("--keep-names", "Keep original names, even in minified code")
  /*
    --ignore-annotations
        esbuild - ignore side-effect annotations
        [https://esbuild.github.io/api/#ignore-annotations]
    */
  .option("--ignore-annotations", "Ignore side-effect annotations")
  /*
    --worker
        load the library as a web worker
        "https://esm.sh/monaco-editor/esm/vs/editor/editor.worker?worker"
    */
  .option("--worker", "Load the library as a web worker")
  /*
    --module
        import wasm modules in JS directly
        "https://esm.sh/@dqbd/tiktoken@1.0.3/tiktoken_bg.wasm?module"
    */
  .option("--module", "Import wasm modules into JS directly")
  /*
    --raw
        do not transform the library into an ES module
        "https://esm.sh/react?raw"
    */
  .option("--raw", "Do not transform the library into an ES module")
  /*
    --no-dts
        ignore the types from the X-TypeScript-Types header
        "https://esm.sh/lodash/unescape?no-dts"
    */
  .option("--no-dts", "Ignore the types from the X-TypeScript-Types header")
  .action(async (options, source, library) => {
    //await initRepo(name, options.yes);
    console.log(options, source, library);
  });

const unstableDenoStd = new Set([
  "archive",
  "console",
  "datetime",
  "dotenv",
  "encoding",
  "flags",
  "front_matter",
  "html",
  "http",
  "log",
  "msgpack",
  "path",
  "regexp",
  "semver",
  "streams",
  "ulid",
  "url",
  "webgpu",
]);

const stableDenoStd = new Set([
  "assert",
  "async",
  "bytes",
  "collections",
  "csv",
  "fmt",
  "fs",
  "json",
  "jsonc",
  "media_types",
  "testing",
  "toml",
  "uuid",
  "yaml",
]);

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

function install(source: string, pkg: string, flags: Record<string, any>) {
  console.log("installing", source, pkg, flags);

  // use an alias if specified
  let aliasedPkg: string = flags.as ?? pkg;

  // only take before the @, ignoring an @ if it starts with it
  // like worst case scenario:
  // @babel/core@^5.0.0
  if (aliasedPkg.startsWith("@")) {
    aliasedPkg = aliasedPkg.slice(0, aliasedPkg.indexOf("@", 1)).slice(1);
  } else if (aliasedPkg.includes("@")) {
    aliasedPkg = aliasedPkg.slice(0, aliasedPkg.indexOf("@", 0));
  }

  // check if a standard library library is being installed
  if (unstableDenoStd.has(aliasedPkg) || stableDenoStd.has(aliasedPkg)) {
    DENO_JSON["imports"][aliasedPkg] =
      `https://deno.land/std@${DEPO_JSON.std.version}/${aliasedPkg}/mod.ts` +
      buildQueryParameters(flags);
    Deno.writeTextFileSync("deno.json", JSON.stringify(DENO_JSON, null, 2));
  } else {
    switch (source) {
      case "node": {
        DENO_JSON["imports"][aliasedPkg] =
          `https://esm.sh/${DEPO_JSON.esm.version}/${pkg}` +
          buildQueryParameters(flags);
        Deno.writeTextFileSync("deno.json", JSON.stringify(DENO_JSON, null, 2));
        break;
      }
      case "github": {
        aliasedPkg = aliasedPkg.split("/")[1];
        DENO_JSON["imports"][aliasedPkg] = `https://esm.sh/gh/${pkg}` +
          buildQueryParameters(flags);
        Deno.writeTextFileSync("deno.json", JSON.stringify(DENO_JSON, null, 2));
        break;
      }
      default: { // deno
        if (aliasedPkg.includes("/")) {
          aliasedPkg = aliasedPkg.slice(0, aliasedPkg.indexOf("/"));
        }

        DENO_JSON["imports"][aliasedPkg] = `https://deno.land/x/${pkg}` +
          buildQueryParameters(flags);
        Deno.writeTextFileSync("deno.json", JSON.stringify(DENO_JSON, null, 2));
        break;
      }
    }
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
  run("deno", { args: ["cache", "src/deps.ts"] });
}
