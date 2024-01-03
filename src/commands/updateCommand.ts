import { Command } from "cliffy-command";
import { update } from "./update.ts";

export const updateCommand = new Command()
  .alias("u")
  .alias("up")
  .alias("upgrade")
  .description("Upgrade Modules")
  .arguments("<modules...:string>")
  .action(async (options, ...args) => {
    for (const module of args) {
      await update(module);
    }
  });
