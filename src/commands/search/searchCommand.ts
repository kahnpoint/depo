import { Command } from "cliffy-command";
import {
  dealiasSource,
  isSource,
  sourceEnum,
  sourceListBase,
} from "@/sources/sources.ts";
import { printSearchResults } from "./search.ts";

export const searchCommand = new Command()
  .alias("s")
  .type("source", sourceEnum)
  .description("Search Deno.land, NPM, or Github.")
  .arguments("[source:string:source] [library:string] [count:integer]")
  .action(async (options, ...args) => { // source: string | undefined, library, count
    // check for no arguments
    if (args.length === 0) {
      console.log("Required : %c[library]", "color: yellow");
      return;
    }

    let source;
    if (isSource(args[0])) {
      // source is a source
      source = args.shift();
    } else {
      // source is a package
      source = undefined;
    }
    source = dealiasSource(source as string);
    const library = args.shift() as string;
    const count = args.shift() as number;

    // print the results
    if (source === undefined) {
      // search all sources
      for (const source of sourceListBase) {
        await printSearchResults(source, library, count || 1);
      }
    } else {
      // search a specific source
      await printSearchResults(source, library, count || 3);
    }
    console.log();
  });
