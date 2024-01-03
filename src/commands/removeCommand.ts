import { Command } from "cliffy-command";
import { remove } from "./remove.ts";

export const removeCommand = new Command()
  .alias("r")
  .description("Remove (uninstall) module(s)")
  .arguments("<modules...:string>")
  .action(async (options, ...args) => {
    for (const module of args) {
      await remove(module);
    }
  });
