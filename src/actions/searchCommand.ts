import { Command } from "cliffy-command";
import { sourceEnum, sourceListBase, dealiasSource } from "../sources/sources.ts";
import { printSearchResults } from "./search.ts";

export const searchCommand = new Command()
  .alias("s")
  .type("source", sourceEnum)
  .description("Search Deno.land, NPM, or Github for libraries.")
  .arguments("[source:string:source] [library:string] [count:integer]")
  .action(async (options, source: string | undefined, library, count) => {
    source = dealiasSource(source);
    
    if (sourceListBase.includes(source)) {
      // source is a source
      if (library === undefined) {
        console.log("Required : %c[library]", "color: yellow");
        return;
      }
    } else {
      // source is a package
      library = source;
      source = undefined;
    }

    //console.log("search command called", options, library, source, count)
    if (source === undefined) {
      for (const source of sourceListBase) {
        await printSearchResults(source, library, count || 1);
      }
    } else {
      // search a specific source
      await printSearchResults(source, library, count || 3);
    }
    console.log();
  });