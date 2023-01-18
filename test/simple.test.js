import * as t from "https://deno.land/std/testing/asserts.ts";
//import * as t from "https://deno.land/std@0.83.0/testing/asserts.ts";
//import * as t from "https://deno.land/std@0.173.0/testing/asserts.ts";

import { execRuby } from "../execRuby.js";

Deno.test("calc", async () => {
  t.assertEquals(await execRuby("1+1"), 2);
});
Deno.test("minus", async () => {
  t.assertEquals(await execRuby("-1"), -1);
});
Deno.test("func", async () => {
  let param1 = null;
  const funcs = { func: (a) => param1 = a };
  t.assertEquals(await execRuby("func(15)", { funcs }), 15);
  t.assertEquals(param1, 15);
  t.assertEquals(await execRuby("func 5", { funcs }), 5);
  t.assertEquals(param1, 5);
});
Deno.test("func param2", async () => {
  let param1 = null;
  let param2 = null;
  const funcs = { func: (a, b) => (param1 = a, param2 = b) };
  t.assertEquals(await execRuby("func(1, 2)", { funcs }), 2);
  t.assertEquals(param1, 1);
  t.assertEquals(param2, 2);
  t.assertEquals(await execRuby("func 3, 4", { funcs }), 4);
  t.assertEquals(param1, 3);
  t.assertEquals(param2, 4);
});
Deno.test("func err", async () => {
  let param1 = null;
  let param2 = null;
  const funcs = { func: (a, b) => (param1 = a, param2 = b) };
  //t.assertThrowsAsync(async () => { throw new Error() }); // deprecated
  //t.assertRejects(async () => { throw new Error() });
  t.assertRejects(async () => await execRuby("func 1 2", { funcs }));
});
