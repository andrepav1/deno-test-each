# deno-test-each

Vitest-compatible parameterized testing for Deno. Run the same test with
multiple inputs using the familiar `it.each()` syntax.

## Features

- 🚀 **Zero dependencies** - Built for Deno's standard library
- 📝 **TypeScript support** - Full type safety and IntelliSense
- 🎯 **Vitest-compatible** - Familiar `it.each()` API
- 🔧 **Template interpolation** - `%s`, `%d`, `%j` placeholders
- 📊 **Clear test output** - Descriptive test names for each case
- 🎛️ **Case filtering** - Run specific cases by index or predicate

## Installation

### Deno/JSR

```bash
deno add @andrea/deno-test-each
```

```typescript
import { it } from "@andrea/deno-test-each";
```

### Node.js/NPM

```bash
npm install deno-test-each
```

```typescript
import { it } from "deno-test-each";
```

## Usage

### Basic Examples

```typescript
import { it } from "deno-test-each";
import { assertEquals } from "jsr:@std/assert";

// Simple values
it.each([1, 2, 3, 4])("should be positive: %d", (n) => {
  assertEquals(n > 0, true);
});

// Array destructuring
it.each([
  [1, 2, 3],
  [2, 3, 5],
  [3, 4, 7],
])("adds %d + %d = %d", ([a, b, expected]) => {
  assertEquals(a + b, expected);
});

// Object cases
it.each([
  { input: "hello", expected: 5 },
  { input: "world", expected: 5 },
  { input: "", expected: 0 },
])("string length: %j", ({ input, expected }) => {
  assertEquals(input.length, expected);
});
```

### Template Interpolation

Use placeholders in test names:

- `%s` - String representation
- `%d` - Number representation
- `%j` - JSON representation

### Filtering Cases

Run only specific cases from your test array:

```typescript
// Run all cases (default)
it.each([1, 2, 3, 4])("test: %d", (n) => {
  assertEquals(n > 0, true);
});

// Run only case at specific index
it.each([1, 2, 3, 4], 2)("test: %d", (n, index) => {
  // Only runs for case at index 2 (value: 3)
  assertEquals(n, 3);
});

// Run only cases matching predicate
it.each([1, 2, 3, 4], (value) => value > 2)("test: %d", (n) => {
  // Only runs for values 3 and 4
  assertEquals(n > 2, true);
});

// Predicate with index access
it.each([1, 2, 3, 4], (value, index) => index === 1 || value > 3)(
  "test: %d",
  (n) => {
    // Runs for index 1 (value: 2) OR values > 3 (value: 4)
  },
);
```

## API Reference

### `it.each<T>(cases)(name, testFn)`

Run all test cases.

**Parameters:**

- `cases: readonly T[]` - Array of test cases
- `name: string` - Test name template with optional placeholders
- `testFn: (value: T, index: number) => void | Promise<void>` - Test function

### `it.each<T>(cases, index)(name, testFn)`

Run only the test case at specific index.

**Parameters:**

- `cases: readonly T[]` - Array of test cases
- `index: number` - Index of case to run
- `name: string` - Test name template
- `testFn: (value: T, index: number) => void | Promise<void>` - Test function

### `it.each<T>(cases, filter)(name, testFn)`

Run only test cases matching the filter predicate.

**Parameters:**

- `cases: readonly T[]` - Array of test cases
- `filter: (value: T, index: number) => boolean` - Filter predicate
- `name: string` - Test name template
- `testFn: (value: T, index: number) => void | Promise<void>` - Test function

## License

MIT
