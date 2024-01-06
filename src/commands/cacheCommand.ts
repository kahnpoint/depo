import { Command } from "cliffy-command";
import { cache } from "./cache.ts";

// cache modules
export const cacheCommand = new Command()
  .alias("c")
  .description("Cache src/mod.ts and src/deps.ts")
  .action(async (options, ...args) => {
    cache();
  });
