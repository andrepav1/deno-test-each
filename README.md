# deno-test-each

Vitest-compatible parameterized testing for Deno. Run the same test with
multiple inputs using the familiar `it.each()` syntax.

## Features

- 🚀 **Zero dependencies** - Built for Deno's standard library
- 📝 **TypeScript support** - Full type safety and IntelliSense
- 🎯 **Vitest-compatible** - Familiar `it.each()` API
- 🔧 **Template interpolation** - `%s`, `%d`, `%j` placeholders
- 📊 **Clear test output** - Descriptive test names for each case

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

### Advanced Options

```typescript
it.each([1, 2, 3])("positive test: %d", (n) => {
  assertEquals(n > 0, true);
}, {
  ignore: false,
  only: false,
  permissions: { read: true },
});
```

## API Reference

### `it.each<T>(cases)(name, testFn, options?)`

**Parameters:**

- `cases: readonly T[]` - Array of test cases
- `name: string` - Test name template with optional placeholders
- `testFn: (value: T, index: number) => void | Promise<void>` - Test function
- `options?: TestEachOptions` - Additional test options

### `TestEachOptions`

```typescript
interface TestEachOptions {
  ignore?: boolean; // Skip this test
  only?: boolean; // Run only this test
  permissions?: Deno.TestDefinition["permissions"];
  sanitizeOps?: boolean;
  sanitizeResources?: boolean;
}
```

## License

MIT
