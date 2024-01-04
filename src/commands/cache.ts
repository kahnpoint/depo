import { run } from "../utils/run.ts";

// cache modules
export function cache() {
  run("deno", { args: ["cache", "src/main.ts", "src/deps.ts"] });
  console.log("✅ Cached modules");
}
