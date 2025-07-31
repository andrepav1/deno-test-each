import { it } from "../mod.ts";
import { assertEquals } from "jsr:@std/assert";

// Vitest-style it.each() API examples
it.each([1, 2, 3, 4])("should be positive number: %d", (n) => {
  assertEquals(n > 0, true);
});

it.each([
  [1, 2, 3],
  [2, 3, 5],
  [3, 4, 7],
])("addition: %d + %d = %d", ([a, b, expected]) => {
  assertEquals(a + b, expected);
});

it.each([
  { input: "hello", expected: 5 },
  { input: "world", expected: 5 },
  { input: "", expected: 0 },
])("string length test: %j", ({ input, expected }) => {
  assertEquals(input.length, expected);
});

it.each(["a", "aa", "aaa"])("string should have length > 0: %s", (str) => {
  assertEquals(str.length > 0, true);
});

it.each([0, -1, -5])("should handle negative/zero: %d", (n) => {
  assertEquals(n <= 0, true);
});
