import { Command } from "cliffy-command";
import {
  dealiasSource,
  DEFAULT_SOURCE,
  isSource,
  sourceEnum,
} from "../sources/sources.ts";
import { install } from "./install.ts";
import { isDenoStd } from "../meta/deno.std.ts";

export const installCommand = new Command()
  .alias("i")
  .type("source", sourceEnum)
  .description("Install module(s) from a source.")
  .arguments("[source:string:source] [modules...:string]")
  .group("arguments")
  /*
    --as <string>
        import a module as a different name
        "preact/compat" --as "react"
    */
  .option("--as <string>", "Import a module as a different name")
  /*
    --alias <string>
        manually alias a module
        "preact/compat" --alias "react"
        "https://esm.sh/swr?alias=react:preact/compat";
    */
  .option("--alias <string[]>", "Manually alias a module's dependencies")
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
        esbuild - controls how the exports field in module.json is interpreted
        [https://esbuild.github.io/api/#conditions]
        "https://esm.sh/foo?conditions=custom1,custom2"
    */
  .option(
    "--conditions <string[]>",
    "Controls how the exports field in module.json is interpreted",
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
    -_dev
        use the dev version of the module
        "https://esm.sh/react?dev"
    */
  .option("-_dev", "Use the dev version of the module")
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
        load the module as a web worker
        "https://esm.sh/monaco-editor/esm/vs/editor/editor.worker?worker"
    */
  .option("--worker", "Load the module as a web worker")
  /*
    --module
        import wasm modules in JS directly
        "https://esm.sh/@dqbd/tiktoken@1.0.3/tiktoken_bg.wasm?module"
    */
  .option("--module", "Import wasm modules into JS directly")
  /*
    --raw
        do not transform the module into an ES module
        "https://esm.sh/react?raw"
    */
  .option("--raw", "Do not transform the module into an ES module")
  /*
    --no-dts
        ignore the types from the X-TypeScript-Types header
        "https://esm.sh/lodash/unescape?no-dts"
    */
  .option("--no-dts", "Ignore the types from the X-TypeScript-Types header")
  .action(async (options, ...args) => {
    // esm.sh and cliffy handle negated flags differently
    function fixNegatedFlags(
      options: Record<string, any>,
      flagsToFix = ["bundle", "dts"],
    ) {
      for (const flag of flagsToFix) {
        if (options[flag] == false) {
          options[`no-${flag}`] = true;
        }
        delete options[flag];
      }
      return options;
    }
    let optionsFixed = fixNegatedFlags(options);

    // esm.sh expects comma separated lists
    const listArgs = ["alias", "deps", "exports", "external", "conditions"];
    function fixListArgs(options: Record<string, any>, listArgs: string[]) {
      for (const arg of listArgs) {
        if (options[arg]) {
          options[arg] = options[arg].join(",");
        }
      }
      return options;
    }
    optionsFixed = fixListArgs(optionsFixed, listArgs);

    // check for empty args
    if (args.length == 0) {
      console.log("Required: %c[modules]", "color: yellow");
      return;
    }

    let source;
    if (isSource(args[0])) {
      // source is a source
      if (args.length == 1) {
        console.log("Required: %c[modules]", "color: yellow");
        return;
      }
      source = args.shift();
    } else {
      // source is a package
      source = DEFAULT_SOURCE;
    }
    source = dealiasSource(source);

    // check for empty args
    if (args.length == 0) {
      console.log("Required: %c[modules]", "color: yellow");
      return;
    }

    // install each module
    for (const module of args) {
      if (isDenoStd(module || "")) {
        console.log(`⬇️  deno:${module}`);
      } else {
        console.log(`⬇️  ${source}:${module}`);
      }
      await install(source || DEFAULT_SOURCE, module!, optionsFixed);
    }
  });
