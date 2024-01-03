import { run } from "../utils/run.ts";

export function cache() {
  run("deno", { args: ["cache", "src/main.ts", "src/deps.ts"] });
  console.log("✅ Cached modules");
}
