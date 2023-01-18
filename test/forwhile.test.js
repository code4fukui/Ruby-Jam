import * as t from "https://deno.land/std/testing/asserts.ts";
//import * as t from "https://deno.land/std@0.83.0/testing/asserts.ts";
//import * as t from "https://deno.land/std@0.173.0/testing/asserts.ts";

import { execRuby } from "../execRuby.js";

Deno.test("if", async () => {
  t.assertEquals(await execRuby(`if 0
  p 1
end
p 2
`), undefined);
});

/*
Deno.test("while", async () => {
  t.assertEquals(await execRuby(`while true
end
`), undefined);
});
*/

Deno.test("for null block", async () => {
  t.assertEquals(await execRuby(`for i in 1..3
end
`), undefined);
});

Deno.test("for", async () => {
  t.assertEquals(await execRuby(`for i in 1..3
  p i
end
`), undefined);
});

Deno.test("for", async () => {
  t.assertEquals(await execRuby(`for i in 1..10
  p i
  if i == 5
    break
  end
end
`), undefined);
});
