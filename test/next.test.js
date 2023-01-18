import * as t from "https://deno.land/std/testing/asserts.ts";
//import * as t from "https://deno.land/std@0.83.0/testing/asserts.ts";
//import * as t from "https://deno.land/std@0.173.0/testing/asserts.ts";

import { execRuby } from "../execRuby.js";

Deno.test("next in while", async () => {
  t.assertEquals(await execRuby(`n = 0
s = 0
while n < 10
  n = n + 1
  if n % 2 == 0
    next
  end
  s = s + 1
end
s
`), 5);
});

Deno.test("next in for", async () => {
  t.assertEquals(await execRuby(`
s = 0
for n in 0..9
  n = n + 1
  if n % 2 == 0
    next
  end
  s = s + 1
end
s
`), 5);
});

Deno.test("next in until", async () => {
  t.assertEquals(await execRuby(`
s = 0
n = 0
until n == 10
  n = n + 1
  if n % 2 == 0
    next
  end
  s = s + 1
end
s
`), 5);
});

Deno.test("next in loop", async () => {
  t.assertEquals(await execRuby(`
s = 0
n = 0
loop do
  if n == 10
    break
  end
  n = n + 1
  if n % 2 == 0
    next
  end
  s = s + 1
end
s
`), 5);
});
