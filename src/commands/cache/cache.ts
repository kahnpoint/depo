import { run } from "@/utils/run.ts";
import { DEPO_JSON } from "@/meta/depo.json.ts";

// cache modules
export function cache() {
  for (const fileToCache of DEPO_JSON.depo.cacheable) {
    try {
      run("deno", { args: ["cache", fileToCache], log: false });
    } catch (e) {
      null;
    }
  }
  console.log("✅ Cached modules");
}
