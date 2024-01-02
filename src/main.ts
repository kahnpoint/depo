/*
depo action source package
*/
import { printSearchResults, initRepo } from "./actions/actions.ts"; 
import { sources } from "./sources/sources.ts";
import { flags as depoFlags } from "./packages/flags/flags.ts";
import {args as depoArgs } from "./packages/args/args.ts";

const action = Deno.args[0];
const source = Deno.args[1];
const args = Deno.args.slice(2);

import { parse } from "https://deno.land/std/flags/mod.ts";

 const flags = parse(Deno.args, {
   boolean: Object.keys(depoFlags).concat(["y", "yes"]),
   string: Object.keys(depoArgs),
 });

switch (action) { 
    case "search": {
        const resultCount = parseInt(args[1]) ?? 3;
        
        if (source in sources) {
            await printSearchResults(source, args[0], resultCount);
        }else{
            // source is actually a package name
            for (const sourceEntry in sources) {
                await printSearchResults(sourceEntry, source, 1);
            }
        }
        break;
        
    }
    case "init" : {
        
        // check if autoapproved
        if (flags.y || flags.yes){
            initRepo(source, true);
        } else {
            initRepo(source, false);
        }
        
    }
}