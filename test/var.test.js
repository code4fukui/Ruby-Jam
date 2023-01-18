import * as t from "https://deno.land/std/testing/asserts.ts";
import { execRuby } from "../execRuby.js";

let debug = true;
debug = false;

Deno.test("var", async () => {
  t.assertEquals(await execRuby(`
  a = 3
  `, { debug }), 3);
});

Deno.test("var", async () => {
  t.assertEquals(await execRuby(`
  a = 3
  a = a + 1
  a
  `, { debug }), 4);
});

Deno.test("float", async () => {
  t.assertEquals(await execRuby(`
  a = 3
  a = a + 0.1
  a
  `, { debug }), 3.1);
});

Deno.test("boolean true", async () => {
  t.assertEquals(await execRuby(`
  a = true
  a
  `, { debug }), true);
});

Deno.test("boolean false", async () => {
  t.assertEquals(await execRuby(`
  a = false
  a
  `, { debug }), false);
});
/*
Deno.test("local var", async () => {
  t.assertEquals(await execRuby(`
    n = 3
    p n
    def led(n)
      p "led " + n
    end
    def out(n, m)
      p "out " + n + ", " + m
    end
    led 1
    n
  `, { debug }), "3");
});

Deno.test("global var", async () => {
  t.assertEquals(await execRuby(`
    $n = 3
    def led(n)
      p "led " + n + ", " + $n
    end
    led 1
    $n
  `, { debug }), "3");
});
*/
