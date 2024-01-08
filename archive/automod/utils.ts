
// splits a file (mod.ts) into a filename (mod) and extension (ts)
export function splitFilenameAndExtension(fullFilename: string) {
  const filenameArray = fullFilename.split(".");
  const filename = filenameArray.slice(0,-1).join(".") ?? "";
  const extension = filenameArray.pop() ?? "";
  return [filename, extension];
}

// splits a path (./src/mod.ts) into a folder (./src) and file (mod.ts)
export function splitFolderPathAndFile(path: string) {
  const pathArray = path.split("/");
  const filename = pathArray.pop() ?? "";
  const folder = pathArray.join("/") ?? "";
  return [ folder, filename ];
}