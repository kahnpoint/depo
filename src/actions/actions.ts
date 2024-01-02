import {Action} from './Action.ts'
/*
actions
    init 
        depo init
    help (h)
        depo h 
    version (v)
        depo v
    install (i)
        depo i react
    remove (r)
        depo r react
    update (u)
        depo u react
    search (s) [unimplemented]
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

export const actions: Record<string, Action> = {
    //"help": new Action('help', 'h', 'display help'),
    "init": new Action('init', null, 'initialize repo with depo'),
    "version": new Action('version', 'v', 'display version'),
    "install": new Action('install', 'i', 'install a package'),
    "remove": new Action('remove', 'r', 'remove a package'),
    "update": new Action('update', 'u', 'update a package'),
    "search": new Action('search', 's', 'search for a package'),
    //"settings": new Action('settings', null, 'manage settings'),
    //"tokens": new Action('tokens', null, 'manage tokens'),
    "upgrade": new Action('upgrade', null, 'upgrade depo')
}