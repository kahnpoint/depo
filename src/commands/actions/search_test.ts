import { printSearchResults } from "./search.ts";

// const library = "lodash"
const library = "react"
await printSearchResults("deno", library, 1);
await printSearchResults("node", library, 1);
await printSearchResults("github", library, 1);