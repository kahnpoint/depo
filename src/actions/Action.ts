/*
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
            node: https://www.npmjs.com/search?q=
            deno: https://deno.land/x?query=
            github: https://github.com/search?type=repositories&q=
    settings [unimplemented]
        --cdn = esm | skypack 
    tokens [unimplemented]
        (auth token management)
    upgrade 
        upgrade depo 
*/

export class Action{
    name: string;
    shortcut: string | null;
    description: string;
    examples: string[];
    
    constructor(name: string, shortcut: string | null, description: string, examples : string[] = []){
        this.name = name;
        this.shortcut = shortcut;
        this.description = description;
        this.examples = examples;
    }
}