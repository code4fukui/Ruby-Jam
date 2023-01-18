import * as t from "https://deno.land/std/testing/asserts.ts";
import { execRuby } from "../execRuby.js";

let debug = true;
debug = false;

Deno.test("calc or", async () => {
  t.assertEquals(await execRuby(`
    a = 1
    b = 2
    a or b
  `, { debug }), 1);
});

Deno.test("calc or2", async () => {
  t.assertEquals(await execRuby(`
    a = 0
    b = 2
    a or b
  `, { debug }), 2);
});

Deno.test("calc and", async () => {
  t.assertEquals(await execRuby(`
    a = 1
    b = 2
    a and b
  `, { debug }), 2);
});
