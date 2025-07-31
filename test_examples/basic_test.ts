import { testEach, test } from "../mod.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert";

// Function-based API examples
testEach([1, 2, 3, 4], (n) => {
  assertEquals(n > 0, true);
}, "should be positive number");

testEach([
  [1, 2, 3],
  [2, 3, 5],
  [3, 4, 7]
], ([a, b, expected]) => {
  assertEquals(a + b, expected);
}, "addition: %d + %d = %d");

testEach([
  { input: "hello", expected: 5 },
  { input: "world", expected: 5 },
  { input: "", expected: 0 }
], ({ input, expected }) => {
  assertEquals(input.length, expected);
}, "string length test");

// Object-based API examples
test.each([1, 2, 3, 4])("number %d should be positive", (n) => {
  assertEquals(n > 0, true);
});

test.each([
  [1, 2, 3],
  [5, 5, 10],
  [10, 15, 25]
])("adds %d + %d = %d", ([a, b, expected]) => {
  assertEquals(a + b, expected);
});

test.each(["a", "aa", "aaa"])(
  "string length test", 
  (str) => {
    assertEquals(str.length > 0, true);
  }
);

// Error cases
test.each([0, -1, -5])("should handle negative/zero: %d", (n) => {
  assertEquals(n <= 0, true);
});