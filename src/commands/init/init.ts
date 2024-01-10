import { run } from "@/utils/utils.ts";
import { DEFAULT_DEPO_JSON, DEPO_JSON } from "@/meta/depo.json.ts";
import { DEFAULT_DENO_JSON, DENO_JSON } from "@/meta/deno.json.ts";
import { existsSync } from "fs";
import { printIntroHeader } from "./printIntroHeader.ts";
import { getRedirectUrl } from "@/utils/getRedirectUrl.ts";

interface InitOptions {
  name: string;
  confirmAll: boolean;
  forceOverwrite: boolean;
}

export async function initRepo(options: InitOptions) {
  // print the depo, esm, and deno versions
  printIntroHeader();

  // forward the options to the FileFolderBuilder
  const builder = new FileFolderBuilder(options);

  //create new repo if a name is provided
  try {
    if (options.name) {
      Deno.mkdirSync(options.name, {});
      Deno.chdir(options.name);
      DEPO_JSON.module.name = options.name;
    } else {
      DEPO_JSON.module.name = DEFAULT_DEPO_JSON.module.name;
    }
  } catch (e) {
    if (options.name) {
      console.log(`%cFolder "${options.name}" already exists`, `color: orange`);
    }
  }

  // create src folder if it doesn't exist
  builder.initFolder({
    name: "src",
    path: "src",
  });

  // create deno.json if it doesn't exist
  builder.initFile({
    name: "deno.json",
    path: "deno.json",
    content: DENO_JSON,
  });

  // update std version if depo.json does not exist
  if (!existsSync("depo.json")) {
    const stdVersion =
      (await getRedirectUrl("https://deno.land/std")).split("@")[1] ??
        DEFAULT_DEPO_JSON.deno.std.version;
    DEPO_JSON.deno.std.version = stdVersion;
  }

  // create new depo.json if it doesn't exist
  builder.initFile({
    name: "depo.json",
    path: "depo.json",
    content: DEPO_JSON,
  });

  // create deps.ts
  let DEP_CONTENT;
  try {
    DEP_CONTENT = DEPO_JSON.depo.generation.warning;
  } catch {
    DEP_CONTENT = DEFAULT_DENO_JSON.depo.generation.warning;
  }

  builder.initFile({
    name: "deps.ts",
    path: "deps.ts",
    content: DEP_CONTENT,
  });

  /*
  // create deps_dev.ts
  builder.initFile({
    name: "deps_dev.ts",
    path: "deps_dev.ts",
    content: DEP_CONTENT,
  });
  */

  // create mod.ts if it doesn't exist
  const MAIN_TS = `export function add(a: number, b: number): number {
    return a + b;
}
    
// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
    console.log("Add 2 + 3 =", add(2, 3));
}`;
  builder.initFile({
    ...options,
    name: "main.ts",
    path: "src/main.ts",
    content: MAIN_TS,
  });

  // create mod_test.ts if it doesn't exist
  const MAIN_TEST_TS =
    `import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { add } from "./mod.ts";
    
Deno.test(function addTest() {
    assertEquals(add(2, 3), 5);
});`;
  builder.initFile({
    name: "main_test.ts",
    path: "src/main_test.ts",
    content: MAIN_TEST_TS,
  });

  // create readme.md if it doesn't exist
  const README = `# ${DEPO_JSON.module.name || options.name}`;
  builder.initFile({
    name: "Readme",
    path: "readme.md",
    content: README,
  });

  // initialize git repo
  let GIT_INIT_CONFIRM;
  if (existsSync(".git")) {
    GIT_INIT_CONFIRM = [
      `%cInitialize git repo? (%c.git/ already exists)`,
      `color: white`,
      `color: orange`,
    ];
  } else {
    GIT_INIT_CONFIRM = [`%cInitialize git repo?`, `color: white`];
  }

  if ((options.confirmAll || confirm(...GIT_INIT_CONFIRM))) {
    // initialize git repo
    await run("git", { args: ["init"], error: false });

    // add deno fmt precommit hook
    const DEFAULT_PRECOMMIT_HOOK = `#!/bin/bash

# Run deno fmt on staged files
files=$(git diff --cached --name-only --diff-filter=ACM "*.ts" "*.js" "*.jsx" "*.tsx" "*.json" "*.jsonc")

if [[ -n "$files" ]]; then
    echo "Running deno fmt on staged files:"
    echo "$files"
    deno fmt -- "$files"
    git add $files
fi`;
    builder.initFile({
      ...options,
      name: "Pre-commit Hook",
      path: ".git/hooks/pre-commit",
      content: DEFAULT_PRECOMMIT_HOOK,
    });

    // create .gitignore
    const DEFAULT_GITIGNORE = ``;
    builder.initFile({
      name: "GitIgnore",
      path: ".gitignore",
      content: DEFAULT_GITIGNORE,
    });
  }

  // optionally create vs code folder
  builder.initFolder({
    name: "VSCode",
    path: ".vscode",
  });
  // create vscode settings.json
  const VSCODE_SETTINGS = `{
"deno.enable": true,
"deno.lint": true,
"deno.unstable": true,
"files.associations": {
  /* give vento files html syntax highlighting
      and tailwindcss intellisense support */
  "*.vto": "html"
}
}`;
  builder.initFile({
    name: "VSCode Settings",
    path: ".vscode/settings.json",
    content: VSCODE_SETTINGS,
  });

  // complete
  console.log(`%cDone!`, `color: green`);
  if (options.name) {
    console.log(
      `%cRun %c"cd ${options.name}" %cto enter the project folder`,
      `color: white`,
      `color: grey`,
      `color: white`,
    );
  }
}

// Settings for the FileFolderBuilder
interface InitFileOptions {
  name: string;
  path: string;
  content?: string | object;
  quiet?: boolean;
  folder?: boolean;
}

class FileFolderBuilder {
  constructor(private options: InitOptions) {}

  initFile(options: InitFileOptions) {
    if (this.options.confirmAll || confirm(`Create ${options.name}?`)) {
      const initFileType = options.folder ? " folder" : "";
      try {
        if (options.folder) {
          if (existsSync(options.path)) {
            throw new Error("Folder already exists");
          }
          Deno.mkdirSync(options.path, { recursive: true });
        } else {
          // set content to "" if it's undefined
          if (typeof options.content === "undefined") {
            options.content = "";
          }

          // stringify content if it's an object
          if (typeof options.content === "object") {
            options.content = JSON.stringify(options.content, null, 2);
          }

          // write file
          Deno.writeTextFileSync(options.path, options.content, {
            createNew: !this.options.forceOverwrite,
          });
        }
        // if (!options.quiet) {
        //   console.log(
        //     `✅ %c${options.name} (${options.path}) created`,
        //     `color: green`,
        //   );
        // }
        if (options.name === options.path) {
          console.log(
            `✅ %c${options.name}${initFileType} created`,
            `color: green`,
          );
        } else {
          console.log(
            `✅ %c${options.name}${initFileType} (%c${options.path}%c) created`,
            `color: green`,
            `color: white`,
            `color: green`,
          );
        }
      } catch (e) {
        if (!options.quiet) {
          if (options.name === options.path) {
            console.log(
              `⚠️  %c${options.name}${initFileType} already exists`,
              `color: orange`,
            );
          } else {
            console.log(
              `⚠️  %c${options.name}${initFileType} (%c${options.path}%c) already exists`,
              `color: orange`,
              `color: white`,
              `color: orange`,
            );
          }
        }
      }
    }
  }

  initFolder(options: InitFileOptions) {
    return this.initFile({ ...options, folder: true });
  }
}
