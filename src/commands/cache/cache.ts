import {DEPO_JSON} from "@/meta/depo.json.ts"
import { buildDeps } from "@/commands/cache/buildDeps.ts"

export async function cache() {
  //console.log(`%c⚒️  Building ${DEPO_JSON.deno.deps.location}`, `color: brown`)
  buildDeps()
  console.log(`%c💵 Caching ${DEPO_JSON.deno.deps.location}`, `color: green`)
  await new Deno.Command("deno", { args: ["cache", DEPO_JSON.deno.deps.location] })
  
}
