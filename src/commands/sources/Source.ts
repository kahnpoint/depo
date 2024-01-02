/*
sources
    n (node) (default)
        #esm> "https://esm.sh/react@18.2.0"
    d (deno)
        #esm> "https://deno.land/x/deno_lodash/mod.ts"
    gh (github)
        #esm> "https://esm.sh/gh/microsoft/tslib@2.5.0"
*/          

interface iSource {
    name: string
    shortcut: string
    description: string
    defaultUrl: string
    searchUrl: string
}

export class Source implements iSource{
    name: string;
    shortcut: string;
    description: string;
    defaultUrl: string;
    searchUrl: string;
    constructor(options : iSource){
        this.name = options.name;
        this.shortcut = options.shortcut;
        this.description = options.description;
        this.defaultUrl = options.defaultUrl;
        this.searchUrl = options.searchUrl;
    }
}