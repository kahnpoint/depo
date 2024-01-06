import { DEPO_JSON } from "@/meta/depo.json.ts";

// print the depo, esm, and deno versions
export function printIntroHeader() {
  console.log(
    `%c🚚 Depo %c${DEPO_JSON.depo.version} - %c☁️  ESM %c${DEPO_JSON.esm.version} - %c🦕 Deno %cv${Deno.version.deno}`,
    "color: blue; font-weight: bold",
    "color: white",
    "color: orange; font-weight: bold",
    "color: white",
    "color: green; font-weight: bold",
    "color: white",
  );
}
