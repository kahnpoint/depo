import { Command } from "cliffy-command";
import { cache } from "./cache.ts";

// cache modules
export const cacheCommand = new Command()
  .alias("c")
  .description("Cache src/main.ts and src/deps.ts")
  .action(async (options, ...args) => {
    cache();
  });
