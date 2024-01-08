import { Command } from "cliffy-command";
import { cache } from "./cache.ts";
import { buildDeps } from "./buildDeps.ts";

// cache module(s) from deps.ts
export const cacheCommand = new Command()
  .alias("c")
  .description("Rebuild and cache deps.ts")
  .action(async (options, ...args) => {
    await cache()
  });
