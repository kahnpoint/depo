import { Command } from "cliffy-command";
import { remove } from "./remove.ts";
import { cache } from "@/commands/cache/cache.ts";

// remove module(s) from deno.json
export const removeCommand = new Command()
  .alias("r")
  .alias("rm")
  .description("Remove (uninstall) module(s)")
  .arguments("<modules...:string>")
  .action(async (options, ...args) => {
    for (const module of args) {
      await remove(module);
    }
    //await cache();
  });
