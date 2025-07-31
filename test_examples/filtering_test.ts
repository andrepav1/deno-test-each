import { it } from "../mod.ts";
import { assertEquals } from "jsr:@std/assert";

// Test basic functionality (all cases)
it.each([1, 2, 3, 4])("all cases: %d", (n) => {
  assertEquals(n > 0, true);
});

// Test index filtering (only run case at index 2)
it.each([10, 20, 30, 40], 2)("only index 2: %d", (n, index) => {
  assertEquals(n, 30);
  assertEquals(index, 2);
});

// Test predicate filtering (only values > 2)
it.each([1, 2, 3, 4], (v) => v > 2)("only values > 2: %d", (n) => {
  assertEquals(n > 2, true);
});

// Test predicate with index access
it.each([10, 20, 30, 40], (v, i) => i === 1 || v > 35)(
  "index 1 OR value > 35: %d",
  (n, index) => {
    // Should run for index 1 (value 20) OR values > 35 (value 40 at index 3)
    const isValid = (index === 1 && n === 20) || (n > 35);
    assertEquals(isValid, true);
  },
);

// Test with duplicate values
it.each([1, 2, 2, 3], 1)("duplicates - only index 1: %d", (n, index) => {
  assertEquals(n, 2);
  assertEquals(index, 1);
});
