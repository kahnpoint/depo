import { Source } from "./Source.ts";
/*
sources
    d (deno) (default)
        #esm> "https://deno.land/x/deno_lodash/mod.ts"
    n (node) 
        #esm> "https://esm.sh/react@18.2.0"
    gh (github)
        #esm> "https://esm.sh/gh/microsoft/tslib@2.5.0"

searchUrls
    node: https://www.npmjs.com/search?q=
    deno: https://deno.land/x?query=
    github: https://github.com/search?type=repositories&q=
*/          

export const sources: Record<string, Source> = {
    'deno': new Source({
        name: 'Deno',
        shortcut: 'd',
        description: 'deno.land',
        defaultUrl: 'https://deno.land/x/',
        searchUrl: 'https://deno.land/x?query='
    }),
    'node': new Source({
        name: 'Node',
        shortcut: 'n',
        description: 'npm',
        defaultUrl: 'https://www.npmjs.com/',
        searchUrl: 'https://www.npmjs.com/search?q='
    }),
    'github': new Source({
        name: 'GitHub',
        shortcut: 'gh',
        description: 'github',
        defaultUrl: 'https://github.com/',
        searchUrl: 'https://github.com/search?type=repositories&q='
    }),
}