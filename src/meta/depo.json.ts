export const DEFAULT_DEPO_JSON: Record<string, Record<string, any>> = {
  "depo": {
    "version": await Deno.readTextFile("VERSION"),
  },
  "std": {
    "version": "0.210.0",
  },
  "esm": {
    "version": "v135",
  },
};

export let DEPO_JSON: typeof DEFAULT_DEPO_JSON;
try {
  DEPO_JSON = JSON.parse(await Deno.readTextFile("./depo.json"));
} catch {
  DEPO_JSON = DEFAULT_DEPO_JSON;
}
