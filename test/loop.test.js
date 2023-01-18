import * as t from "https://deno.land/std/testing/asserts.ts";

import { execRuby } from "../execRuby.js";

/*
Deno.test("loop", async () => {
  t.assertEquals(await execRuby(`loop do
  p 1
end
`), undefined);
});
*/
Deno.test("loop", async () => {
  t.assertEquals(await execRuby(`loop do
  break
end
`), undefined);
});
