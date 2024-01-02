import { Flag } from "./Flag.ts";
/*
flags

--help, -h
    display help (can be used anywhere)

--bundle-deps 
    bundle dependencies into a single js file
    "https://esm.sh/swr?bundle-deps"

--no-bundle 
    don't bundle any dependencies
    "https://esm.sh/swr?no-bundle"
    
--dev 
    use the dev version of the package 
    "https://esm.sh/react?dev"

--keep-names
    esbuild - keep original names, even in minified code
    [https://esbuild.github.io/api/#keep-names]

--ignore-annotations
    esbuild - ignore side-effect annotations
    [https://esbuild.github.io/api/#ignore-annotations]

--worker 
    load the package as a web worker
    "https://esm.sh/monaco-editor/esm/vs/editor/editor.worker?worker"

--module 
    import wasm modules in JS directly
    "https://esm.sh/@dqbd/tiktoken@1.0.3/tiktoken_bg.wasm?module"
    
--raw
    do not transform the package into an ES module
    "https://esm.sh/react?raw"
    
--no-dts 
    ignore the types from the X-TypeScript-Types header
    "https://esm.sh/lodash/unescape?no-dts"
*/

// export const flags: Record<string, Flag> = {
//     "bundle-deps": new Flag({"bundle-deps", null, "bundle dependencies into a single js file"),
//     "no-bundle": new Flag("no-bundle", null, "don't bundle any dependencies"),
//     "dev": new Flag("dev", null, "use the dev version of the package"),
//     "keep-names": new Flag("keep-names", null, "esbuild - keep original names, even in minified code"),
//     "ignore-annotations": new Flag("ignore-annotations", null, "esbuild - ignore side-effect annotations"),
//     "worker": new Flag("worker", null, "load the package as a web worker"),
//     "module": new Flag("module", null, "import wasm modules in JS directly"),
//     "raw": new Flag("raw", null, "do not transform the package into an ES module"),
//     "no-dts": new Flag("no-dts", null, "ignore the types from the X-TypeScript-Types header"),
// }

export const flags: Record<string, Flag> = {
    "help": new Flag({
        name: "help",
        shortcut: "h",
        description: "display help (can be used anywhere)"
    }),
    "bundle-deps": new Flag({
        name: "bundle-deps",
        description: "bundle dependencies into a single js file"
    }),
    "no-bundle": new Flag({
        name: "no-bundle",
        description: "don't bundle any dependencies"
    }),
    "dev": new Flag({
        name: "dev",
        description: "use the dev version of the package"
    }),
    "keep-names": new Flag({
        name: "keep-names",
        description: "esbuild - keep original names, even in minified code"
    }),
    "ignore-annotations": new Flag({
        name: "ignore-annotations",
        description: "esbuild - ignore side-effect annotations"
    }),
    "worker": new Flag({
        name: "worker",
        description: "load the package as a web worker"
    }),
    "module": new Flag({
        name: "module",
        description: "import wasm modules in JS directly"
    }),
    "raw": new Flag({
        name: "raw",
        description: "do not transform the package into an ES module"
    }),
    "no-dts": new Flag({
        name: "no-dts",
        description: "ignore the types from the X-TypeScript-Types header"
    }),
}