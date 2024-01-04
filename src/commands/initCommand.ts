import { Command } from "cliffy-command";
import { initRepo } from "./init.ts";

// initialize repo with Depo
export const initCommand = new Command()
  .description("Initialize repo with Depo.")
  .arguments("[name:string]")
  .option("-y, --yes", "Approve all prompts")
  .action(async (options, name, ...args) => {
    await initRepo(name, options.yes);
  });
