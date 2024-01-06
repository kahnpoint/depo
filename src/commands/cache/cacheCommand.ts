import { Command } from "cliffy-command";
import { cache } from "./cache.ts";

// cache modules
export const cacheCommand = new Command()
  .alias("c")
  .description("Cache src/mod.ts, src/deps.ts, and src/deps_dev.ts")
  .action(async (options, ...args) => {
    cache();
  });
