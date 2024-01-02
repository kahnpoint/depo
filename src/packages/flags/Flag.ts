/*
flags
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

interface iFlag {
    name: string
    shortcut?: string
    esmTag?: string
    description: string
}

export class Flag implements iFlag{
    name: string;
    shortcut?: string;
    esmTag: string; // the tag to use in the esm.sh url
    description: string;
    constructor(options : iFlag){
        this.name = options.name;
        this.shortcut = options.shortcut;
        this.esmTag = options.esmTag ?? options.name;
        this.description = options.description;
    }
}