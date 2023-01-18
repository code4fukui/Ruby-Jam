import * as t from "https://deno.land/std/testing/asserts.ts";
import { execRuby } from "../execRuby.js";

let debug = true;
debug = false;

Deno.test("func with 2 params", async () => {
  t.assertEquals(await execRuby(`
    def add(n, m)
      return n + m
    end
    add 1, 2
  `, { debug }), 3);
});
