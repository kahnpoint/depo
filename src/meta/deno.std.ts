// lists of modules in deno std

export const unstableDenoStd = new Set([
  "archive",
  "console",
  "crypto",
  "cli",
  "data_structures",
  "datetime",
  "dotenv",
  "encoding",
  "expect",
  "flags",
  "front_matter",
  "html",
  "http",
  "ini",
  "io",
  "log",
  "msgpack",
  "net",
  "path",
  "permissions",
  "regexp",
  "semver",
  "streams",
  "text",
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
