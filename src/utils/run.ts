/*
a wrapper for Deno.Command that either returns the output 
or throws an error if anything is written to stderr.
*/

export async function run(command : string | URL, options: Deno.CommandOptions = {}){
    
    const td = new TextDecoder()
    
    try{
        const output = await new Deno.Command(command, options).output();
        const err = td.decode(output.stderr).trim();
        const out = td.decode(output.stdout).trim();
        if (err){
            throw new Error(err);
        }
        if (out){
            return out;
        }
    } catch (e){
        throw new Error(e);
    }
}