import { run } from "../utils/utils.ts";
import { DEPO_JSON } from "../depo.json.ts";

export async function initRepo(repoName: string|null = null, approveAll: boolean = false){
    // intro header
    console.log(`%c🦕 Deno %c${Deno.version.deno} %c🚚 Depo %c${DEPO_JSON.depo.version}`, 
        "color: green; font-weight: bold", 
        "color: white", 
        "color: blue; font-weight: bold", 
        "color: white")
    
    // create new repo if it has a name
    try{
        if (repoName != null) {
            Deno.mkdirSync(repoName, {});
            Deno.chdir(repoName);
        }
    } catch (e) {
        return Error("folder already exists");
    }
    
    // create src folder
    Deno.mkdirSync('src');
    
    // create deno.json
    const DENO_JSON = {
        "tasks": {
            "main": "deno run src/main.ts",
            "dev": "deno run --watch src/main.ts"
        },
        "imports":{},
        "lint":{},
        "fmt": {},
        
    }
    Deno.writeTextFileSync('deno.json', JSON.stringify(DENO_JSON, null, 4), {createNew: true});
    
    // create main.ts
    const MAIN_TS = `export function add(a: number, b: number): number {
    return a + b;
}
    
// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
    console.log("Add 2 + 3 =", add(2, 3));
}`
    Deno.writeTextFileSync('src/main.ts', MAIN_TS);
    
    // create main_test.ts
    const MAIN_TEST_TS = `import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { add } from "./main.ts";
    
Deno.test(function addTest() {
    assertEquals(add(2, 3), 5);
});`
    Deno.writeTextFileSync('src/main_test.ts', MAIN_TEST_TS, {createNew: true});
    
    // create new depo.json
    Deno.writeTextFileSync('depo.json', JSON.stringify(DEPO_JSON, null, 4), {createNew: true});
    
    // optionally initialize git repo
    if (approveAll || confirm("Initialize Git repo?")){
        await run("git", {args: ["init"], error: false});
        
        const GITIGNORE = ``
        Deno.writeTextFileSync('.gitignore', GITIGNORE, {createNew: true});
        
        const README = `# ${repoName ?? Deno.cwd().split('/').pop() ?? 'My Repo'}`
        Deno.writeTextFileSync('readme.md', README, {createNew: true});
        
        console.log("✅ Git repo initialized")
    }
    
    // optionally create vs code folder
    if (approveAll || confirm("Create .vscode folder?")){
        Deno.mkdirSync('.vscode');
        const VSCODE_SETTINGS = {
            "deno.enable": true,
            "deno.lint": true,
            "deno.unstable": true
        }
        Deno.writeTextFileSync('.vscode/settings.json', JSON.stringify(VSCODE_SETTINGS, null, 4), {createNew: true});
        
        console.log("✅ .vscode folder created")
    }
}

