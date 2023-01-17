import * as t from "https://deno.land/std/testing/asserts.ts";
import { execRuby } from "../execRuby.js";

Deno.test("func minus", async () => {
  let param1 = null;
  const funcs = { func: (a) => param1 = a };
  t.assertEquals(await execRuby("func(-15)", { funcs }), "-15");
  t.assertEquals(param1, "-15");
  t.assertEquals(await execRuby("func -5", { funcs }), "-5");
  t.assertEquals(param1, "-5");
});
