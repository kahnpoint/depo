import {initRepo} from "./init.ts"

Deno.test("init repo", async () => {
    try{
    Deno.removeSync('./test', {recursive: true});
    } catch (e) {
        null
    }
    await initRepo("test", true);
})