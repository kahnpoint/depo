import { Command } from "cliffy-command";
import { initRepo } from "./init.ts";

// initialize repo with Depo
export const initCommand = new Command()
  .description("Initialize repo with Depo.")
  .arguments("[name:string]")
  .option("-y, --yes", "Approve all prompts")
  .option("-f, --force", "Overwrite existing files (not recommended)")
  .action(async (options, name, ...args) => {
    await initRepo({
      name: name ?? "",
      forceOverwrite: options.force ?? false,
      confirmAll: options.yes ?? false,
      //confirmAll: true,
    });
  });
