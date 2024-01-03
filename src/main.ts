import { Command } from "cliffy-command";
import { DEPO_JSON } from "./meta/depo.json.ts";
import * as commands from "./commands/commands.ts";
import { printIntroHeader } from "./commands/init.ts";

// Main command entrypoint
await new Command()
  .name("depo")
  .version(DEPO_JSON.depo.version)
  .description("Command line framework for Deno")
  .globalOption("-d, --debug", "Enable debug output.")
  .action((options, ...args) => {
    printIntroHeader();
    console.log("Welcome to Depo! Type 'depo -h' for help.");
  })
  // setup
  .command("init", commands.initCommand)
  // package management
  .command("install", commands.installCommand)
  .command("update", commands.updateCommand)
  .command("remove", commands.removeCommand)
  // miscellaneous
  .command("cache", commands.cacheCommand)
  .command("search", commands.searchCommand)
  .parse(Deno.args);
