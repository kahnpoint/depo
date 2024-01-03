export const DEPO_JSON = {
    "depo": {
        "version": await Deno.readTextFile('VERSION')
    },
    "std": {
      "version": "0.210.0"  
    },
    "esm": {
        "version": await Deno.readTextFile('VERSION_ESM')
    }
}