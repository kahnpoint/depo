/*
depo action source package
*/
import { printSearchResults } from "./actions/search.ts";
import { sources } from "./sources/sources.ts";

const action = Deno.args[0];
const source = Deno.args[1];
const args = Deno.args.slice(2);

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
        
    }
    
}