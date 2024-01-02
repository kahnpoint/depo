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

interface iArg {
    name: string
    esmTag?: string | null
    description: string
    usage: string
}

export class Arg implements iArg{
    name: string;
    esmTag: string; // the tag to use in the esm.sh url
    description: string;
    usage: string;
    constructor(options : iArg){
        this.name = options.name;
        this.esmTag = options.esmTag ?? options.name;
        this.description = options.description;
        this.usage = options.usage;
    }
}