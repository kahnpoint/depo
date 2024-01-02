import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { run } from "./utils/utils.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});
