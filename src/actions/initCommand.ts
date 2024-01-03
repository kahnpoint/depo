import { Command } from "cliffy-command";
import { initRepo } from "./init.ts";

export const initCommand = new Command()
  .description("Initialize repo with depo.")
  .arguments("[name:string]")
  .option("-y, --yes", "Approve all prompts")
  .action(async (options, name, ...args) => {
    await initRepo(name, options.yes);
  });
