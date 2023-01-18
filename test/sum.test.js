import * as t from "https://deno.land/std/testing/asserts.ts";
import { execRuby } from "../execRuby.js";

let debug = true;
debug = false;

Deno.test("func with 2 params", async () => {
  t.assertEquals(await execRuby(`
  s = 0
  s + 1
  `), 1);
});

Deno.test("func with 2 params", async () => {
  t.assertEquals(await execRuby(`
  s=0
  for i in 1..10
   p i
   s=s+i
  end
  p s
  s
  `), 55);
});

