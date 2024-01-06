/*
a wrapper for Deno.Command that either returns the output
or throws an error if anything is written to stderr.
*/

interface RunOptions extends Deno.CommandOptions {
  error?: boolean; // throw error if anything is written to stderr
  log?: boolean; // log the command that is being run
}

export async function run(
  command: string | URL,
  options: RunOptions = { error: true, log: true },
) {
  const td = new TextDecoder();

  try {
    const output = await new Deno.Command(command, options).output();
    const out = td.decode(output.stdout).trim();
    const err = td.decode(output.stderr).trim();
    if (options.log) {
      console.log(`%c${out}`, "color: green");
      console.log(`%c${err}`, "color: red");
    }

    if (options.error && err) {
      throw new Error(err);
    }
    if (out) {
      return out;
    }
  } catch (e) {
    throw new Error(e);
  }
}
