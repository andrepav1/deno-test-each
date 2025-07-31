# deno-test-each

Parameterized testing utilities for Deno. Run the same test with multiple inputs easily.

## Features

- 🚀 **Zero dependencies** - Built for Deno's standard library
- 📝 **TypeScript support** - Full type safety and IntelliSense
- 🎯 **Flexible APIs** - Function-based and object-based patterns
- 🔧 **Template interpolation** - Jest-like `%s`, `%d`, `%j` placeholders
- 📊 **Clear test output** - Descriptive test names for each case

## Installation

### Deno
```typescript
import { testEach, test } from "https://deno.land/x/deno_test_each/mod.ts";
```

### Node.js/npm
```bash
npm install deno-test-each
```

```typescript
import { testEach, test } from "deno-test-each";
```

## Usage

### Function-based API

```typescript
import { testEach } from "deno-test-each";
import { assertEquals } from "jsr:@std/assert";

// Simple cases
testEach([1, 2, 3, 4], (n) => {
  assertEquals(n > 0, true);
}, "should be positive");

// Array destructuring
testEach([
  [1, 2, 3],
  [2, 3, 5],
  [3, 4, 7]
], ([a, b, expected]) => {
  assertEquals(a + b, expected);
}, "addition: %d + %d = %d");

// Object cases
testEach([
  { input: "hello", expected: 5 },
  { input: "world", expected: 5 },
  { input: "", expected: 0 }
], ({ input, expected }) => {
  assertEquals(input.length, expected);
}, "string length test");
```

### Object-based API (Jest-like)

```typescript
import { test } from "deno-test-each";
import { assertEquals } from "jsr:@std/assert";

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
```

### Template Interpolation

Use Jest-like placeholders in your test names:

- `%s` - String representation
- `%d` - Number representation  
- `%j` - JSON representation

```typescript
testEach([
  ["hello", "world"],
  ["foo", "bar"]
], ([a, b]) => {
  assertEquals(a.length + b.length > 0, true);
}, "concatenating %s and %s");
```

### Advanced Options

```typescript
testEach([1, 2, 3], (n) => {
  assertEquals(n > 0, true);
}, {
  name: "positive number test: %d",
  ignore: false,
  only: false,
  permissions: { read: true },
  sanitizeOps: true,
  sanitizeResources: true
});
```

## API Reference

### `testEach<T>(cases, testFn, options?)`

Run a test function with multiple input cases.

**Parameters:**
- `cases: readonly T[]` - Array of test cases
- `testFn: (value: T, index: number) => void | Promise<void>` - Test function
- `options?: string | TestEachOptions` - Test name or options object

### `test.each<T>(cases)(name, testFn, options?)`

Fluent API for parameterized testing.

**Parameters:**
- `cases: readonly T[]` - Array of test cases
- `name: string` - Test name template
- `testFn: (value: T, index: number) => void | Promise<void>` - Test function
- `options?: TestEachOptions` - Additional test options

### `TestEachOptions`

```typescript
interface TestEachOptions {
  name?: string;           // Custom name template
  ignore?: boolean;        // Skip this test
  only?: boolean;          // Run only this test
  permissions?: Deno.TestDefinition["permissions"];
  sanitizeOps?: boolean;
  sanitizeResources?: boolean;
}
```

## Why deno-test-each?

Deno doesn't have built-in parameterized testing. This library fills that gap by:

1. **Generating individual test cases** - Each input creates a separate `Deno.test()` call
2. **Providing clear test names** - See exactly which case failed
3. **Supporting async tests** - Works with promises and async functions
4. **Maintaining type safety** - Full TypeScript support

## Development

```bash
# Run tests
deno test

# Run tests in watch mode  
deno task dev

# Build for npm
deno task build

# Test examples
deno test test_examples/
```

## License

MIT