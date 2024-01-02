import { DEPO_JSON as DEFAULT_DEPO_JSON } from "./depo.json.ts";

const DEPO_JSON = JSON.parse(await Deno.readTextFile("./depo.json")) 
                  ?? DEFAULT_DEPO_JSON;

const FALLBACK_ESM_VERSION = "v135";
const ESM_VERSION = Deno.env.get("ESM_VERSION") 
                    ?? DEPO_JSON.esm.version 
                    ?? FALLBACK_ESM_VERSION;


/*
depo <action> <source> <package>

actions
    help (h)
        depo h 
    version (v)
        depo v  
        #> depo v0.1.0
    install (i)
        depo i react
    remove (r)
        depo r react
    update (u)
        depo u react
    search (s)
        depo s react
        depo s npm react
        depo s npm react 5
    settings [unimplemented]
        --cdn = esm | skypack 
    tokens [unimplemented]
        (auth token management)
    upgrade 
        upgrade depo 
*/

/*
sources
    n (node) (default)
        #esm> "https://esm.sh/react@18.2.0"
    d (deno)
        #esm> "https://deno.land/x/deno_lodash/mod.ts"
    gh (github)
        #esm> "https://esm.sh/gh/microsoft/tslib@2.5.0"
*/          

/*
packages
    can install multiple packages at once

    if there is one package, check for flags
    
    args
                        
        --alias <string>
            use a different alias
            "preact/compat" --alias "react"
            "https://esm.sh/swr?alias=react:preact/compat";
        
        --deps <string> 
            manually specify dependencies
            swr --deps "react@17.0.2"
            "https://esm.sh/swr?deps=react@17.0.2"
        
        --exports <string>
            only install specific exports
            "https://esm.sh/tslib?exports=__await,__rest"
        
        --external <string>
            do not rewrite the import specifiers of the specified dependencies
                "https://esm.sh/preact-render-to-string@5.2.0?external=preact,react"
            
        --target <string> 
            specify the target environment
            available targets are: es2015 - es2022, esnext, deno, and denonext.
            "https://esm.sh/react?target=es2020"
        
        --conditions <string>
            esbuild - controls how the exports field in package.json is interpreted
            [https://esbuild.github.io/api/#conditions]
            "https://esm.sh/foo?conditions=custom1,custom2"
        
        --deno-std <string>
            use a specific version of deno std
            "https://esm.sh/postcss?deno-std=0.128.0";
        
        --pin <string>
            pin the version of a package
            "https://esm.sh/v135/react-dom";
            "https://esm.sh/react-dom?pin=v135";
        
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

//const action = Deno.args[0];
//const source = Deno.args[1];
//const args = Deno.args.slice(2);

/*
class depoSource {
    source: string;
    constructor(source : string){
        this.source = source;
    }
    async install(package : string){
    }
    async uninstall(package : string){
    }
    async update(package : string){
    }
}




switch (action){
}

*/

//import { parse } from "https://deno.land/std/flags/mod.ts";

// const flags = parse(Deno.args, {
//   //boolean: ["help", "color"],
//   string: ["as"],
//   //default: { color: true },
//   //negatable: ["color"],
// });

//console.log(Deno.args)
//console.log(flags)


/*
const food = Deno.args[1];
console.log(`Hello ${name}, I like ${food}!`);
console.log(Deno.args);


console.log("Wants help?", flags.help);
console.log("Version:", flags.version);
console.log("Wants color?:", flags.color);

console.log("Other:", flags._);



*/
