/*
  currently depo supports pulling modules from 3 sources:
  - deno.land
  - npm
  - github
*/
import { EnumType } from "cliffy-command";

export const DEFAULT_SOURCE = "npm";

// the strings to use for switch functions
export const sourceListBase = [
  "deno",
  "npm",
  "github",
];

// shortcuts for the base source names
export const sourceMapAliases: Record<string, string> = {
  "d": "deno",
  "node": "npm",
  "n": "npm",
  "g": "github",
  "gh": "github",
};
export const sourceListAliases = Object.keys(sourceMapAliases);

// turn any alias into the full source name
export function dealiasSource(source: string | undefined): string | undefined {
  return sourceMapAliases[source || ""] || source;
}

// check if a source is valid
export function isSource(source: string | undefined): boolean {
  return sourceListFull.includes(dealiasSource(source) || "");
}

// the full list of sources
export const sourceListFull = sourceListBase.concat(sourceListAliases).sort();

// the source enum for cliffy autocomplete
export const sourceEnum = new EnumType(sourceListFull);
