import { EnumType } from "cliffy-command";

export const DEFAULT_SOURCE = "node";

export const sourceListBase = [
  "deno",
  "node",
  "github",
];

export const sourceMapAliases: Record<string, string> = {
  "d": "deno",
  "npm": "node",
  "n": "node",
  "g": "github",
  "gh": "github",
};

export const sourceListAliases = Object.keys(sourceMapAliases);

export function dealiasSource(source: string | undefined): string | undefined {
  return sourceMapAliases[source || ""] || source;
}

export function isSource(source: string | undefined): boolean {
  return sourceListFull.includes(dealiasSource(source) || "");
}

export const sourceListFull = sourceListBase.concat(sourceListAliases).sort();

export const sourceEnum = new EnumType(sourceListFull);
