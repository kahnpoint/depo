import { Command } from "cliffy-command";
// environment variables
import { DEPO_JSON } from "./depo.json.ts";

import { initCommand, searchCommand } from "./actions/actions.ts";

const foo = new Command()
  .option("-f, --foo", "Foo option.")
  .arguments("<value:string>")
  .action((options, ...args) => {
    console.log("Foo command called.", options, args);
  });

await new Command()
  // Main command.
  .name("depo")
  .version("0.1.0")
  .description("Command line framework for Deno")
  .globalOption("-d, --debug", "Enable debug output.")
  .action((options, ...args) => {
    console.log("Main command called.");
  })
  // Child command 1.
  .command("init", initCommand)
  .command("search", searchCommand)
  // Child command 2.
  .command("bar", "Bar sub-command.")
  .option("-b, --bar", "Bar option.")
  .arguments("<input:string> [output:string]")
  .action((options, input, output, ...args) => {
    console.log("Bar command called.", options, input, output, args);
  })
  .parse(Deno.args);
