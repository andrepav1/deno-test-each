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

// Edge cases - empty array (should run no tests)
it.each([])("empty array: %d", () => {
  assertEquals(false, true, "Should never run");
});

// Edge cases - single item
it.each([42])("single item: %d", (n) => {
  assertEquals(n, 42);
});

// Edge cases - falsy values 
it.each([null, undefined, 0, "", false])("falsy values: %s", (value) => {
  assertEquals(value === null || value === undefined || value === 0 || value === "" || value === false, true);
});

// Edge cases - no placeholders in template
it.each([1, 2])("no placeholders in name", (n) => {
  assertEquals(n > 0, true);
});

// Edge cases - multiple same placeholders
it.each([5])("repeated %d and %d", (n) => {
  assertEquals(n, 5);
});

// Edge cases - deep nested objects
it.each([{ level1: { level2: { value: "deep" } } }])("nested: %j", (obj) => {
  assertEquals(obj.level1.level2.value, "deep");
});

// Edge cases - mixed array types
it.each([[1, "str", true, null]])("mixed types: %j", ([num, str, bool, nil]) => {
  assertEquals(num, 1);
  assertEquals(str, "str");
  assertEquals(bool, true);
  assertEquals(nil, null);
});

// Edge cases - duplicate values
it.each([1, 1, 1])("duplicates: %d", (n) => {
  assertEquals(n, 1);
});

// Edge cases - special characters and unicode
it.each(["🚀", "café", "test!@#"])("special chars: %s", (str) => {
  assertEquals(str.length > 0, true);
});

// Edge cases - large numbers
it.each([Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER])("large numbers: %d", (n) => {
  assertEquals(typeof n, "number");
});
