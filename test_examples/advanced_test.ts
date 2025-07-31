import { it } from "../mod.ts";
import { assertEquals } from "jsr:@std/assert";

// Test basic functionality
it.each([1, 2, 3])("basic test: %d", (n) => {
  assertEquals(n > 0, true);
});

// Test async functionality
it.each([100, 200, 300])("async test: %d ms", async (ms) => {
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 1));
  const elapsed = Date.now() - start;
  assertEquals(elapsed >= 1, true);
});
