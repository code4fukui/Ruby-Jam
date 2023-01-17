import * as t from "https://deno.land/std/testing/asserts.ts";
import { execRuby } from "../execRuby.js";

let debug = true;
debug = false;

Deno.test("procedure with 2 params", async () => {
  t.assertEquals(await execRuby(`
    def out(n, m)
      p "out " + n + ", " + m
    end
    out 1, 2
  `, { debug }), undefined);
});

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
