/*
depo action source package
*/
import { printSearchResults, initRepo } from "./actions/actions.ts"; 
import { sources } from "./sources/sources.ts";
import { flags as depoFlags } from "./packages/flags/flags.ts";
import {args as depoArgs } from "./packages/args/args.ts";
import { install } from "./actions/install.ts";

const action = Deno.args[0];
let source, args;
// check for the node alias
if (Deno.args[1] == "npm"){
    source = "node";
    args = Deno.args.slice(2);
// see if the first arg is a source
} else if (Deno.args[1] in sources){
    source = Deno.args[1];
    args = Deno.args.slice(2);
// default to node
}else{
    source = "node";
    args = Deno.args.slice(1);
}

import { parse } from "https://deno.land/std/flags/mod.ts";

 const flags = parse(Deno.args, {
   boolean: Object.keys(depoFlags).concat(["y", "yes"]),
   string: Object.keys(depoArgs),
 });

switch (action) { 
    case "search": {
        const resultCount = parseInt(args[1]) ?? 3;
        
        //if (source in sources) {
        await printSearchResults(source, args[0], resultCount);
        //}else{
            
        //}
        break;
        
    }
    case "init" : {
        
        // check if autoapproved
        if (flags.y || flags.yes){
            initRepo(source, true);
        } else {
            initRepo(source, false);
        }
        break;
    }
    case "test": {
        console.log(flags);
        break;
    }
    case "install": {
        
        install(source, args[0], flags);
        
        // cache deps
        // await run("deno", {args: ["cache", "src/main.ts"]})
        
        break;
    }
    
}