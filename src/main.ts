import { Command } from "cliffy-command";
import { DEPO_JSON } from "./depo.json.ts";
import { initCommand, searchCommand, installCommand } from "./actions/actions.ts";

// Main command entrypoint
await new Command()
  .name("depo")
  .version(DEPO_JSON.depo.version)
  .description("Command line framework for Deno")
  .globalOption("-d, --debug", "Enable debug output.")
  .action((options, ...args) => {
    console.log(
      `%c🚚 Depo %c${DEPO_JSON.depo.version} %c🦕 Deno %c${Deno.version.deno}`,
      "color: blue; font-weight: bold",
      "color: white",
      "color: green; font-weight: bold",
      "color: white",
    );
  })
  // setup
  .command("init", initCommand)
  // package management
  .command("install", installCommand)
  // miscellaneous
  .command("search", searchCommand)
  .parse(Deno.args);
