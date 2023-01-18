import * as t from "https://deno.land/std/testing/asserts.ts";
import { execRuby } from "../execRuby.js";

let debug = true;
debug = false;

Deno.test("calc int", async () => {
  t.assertEquals(await execRuby(`
    a = 3
    b = 5
    a * b
  `, { debug }), 15);
});

Deno.test("calc float", async () => {
  t.assertEquals(await execRuby(`
    a = 1.5
    b = 3
    a * b
  `, { debug }), 4.5);
});

Deno.test("calc str", async () => {
  t.assertEquals(await execRuby(`
    a = "abc"
    b = 3
    a + b
  `, { debug }), "abc3");
});

Deno.test("calc str2", async () => {
  t.assertEquals(await execRuby(`
    a = "abc"
    b = 3
    b + a
  `, { debug }), "3abc");
});

Deno.test("calc !", async () => {
  t.assertEquals(await execRuby(`
    a = 3
    !a
  `, { debug }), false);
});
