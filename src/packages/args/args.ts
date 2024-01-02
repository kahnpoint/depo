import { Arg } from "./Arg.ts";
/*
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
*/

// export const args: Record<string, Arg> = {
//     "alias": new Arg("alias", null, "use a different alias", "depo i preact/compat --alias react"),
//     "deps": new Arg("deps", null, "manually specify dependencies", "depo i swr --deps react@17.0.2"),
//     "exports": new Arg("exports", null, "only install specific exports", "depo i tslib --exports __await,__rest"),
//     "external": new Arg("external", null, "do not rewrite the import specifiers of the specified dependencies", "depo i preact-render-to-string --external preact,react"),
//     "target": new Arg("target", null, "specify the target environment", "depo i react --target es2020"),
//     "conditions": new Arg("conditions", null, "esbuild - controls how the exports field in package.json is interpreted", "depo i foo --conditions custom1,custom2"),
//     "std": new Arg("std", "deno-std", "use a specific version of deno std", "depo i postcss --std 0.128.0"),
//     "pin": new Arg("pin", null, "pin the version of a package", "depo i react-dom --pin v135 "),
// }

export const args: Record<string, Arg> = {
    "alias": new Arg({
        name: "alias",
        description: "use a different alias",
        usage: "depo i preact/compat --alias react",
    }),
    "deps": new Arg({
        name: "deps",
        description: "manually specify dependencies",
        usage: "depo i swr --deps react@17.0.2",
    }),
    "exports": new Arg({
        name: "exports",
        description: "only install specific exports",
        usage: "depo i tslib --exports __await,__rest",
    }),
    "external": new Arg({
        name: "external",
        description: "do not rewrite the import specifiers of the specified dependencies",
        usage: "depo i preact-render-to-string --external preact,react",
    }),
    "target": new Arg({
        name: "target",
        description: "specify the target environment",
        usage: "depo i react --target es2020",
    }),
    "conditions": new Arg({
        name: "conditions",
        description: "esbuild - controls how the exports field in package.json is interpreted",
        usage: "depo i foo --conditions custom1,custom2",
    }),
    "std": new Arg({
        name: "std",
        esmTag: "deno-std",
        description: "use a specific version of deno std",
        usage: "depo i postcss --std 0.128.0",
    }),
    "pin": new Arg({
        name: "pin",
        description: "pin the version of a package",
        usage: "depo i react-dom --pin v135 ",
    }), 
    }