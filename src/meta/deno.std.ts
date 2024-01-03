// lists of modules in deno std

export const unstableDenoStd = new Set([
  "archive",
  "console",
  "datetime",
  "dotenv",
  "encoding",
  "flags",
  "front_matter",
  "html",
  "http",
  "log",
  "msgpack",
  "path",
  "regexp",
  "semver",
  "streams",
  "ulid",
  "url",
  "webgpu",
]);

export const stableDenoStd = new Set([
  "assert",
  "async",
  "bytes",
  "collections",
  "csv",
  "fmt",
  "fs",
  "json",
  "jsonc",
  "media_types",
  "testing",
  "toml",
  "uuid",
  "yaml",
]);

export function isDenoStd(module: string) {
  return unstableDenoStd.has(module) || stableDenoStd.has(module);
}
