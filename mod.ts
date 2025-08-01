/**
 * Parameterized testing utilities for Deno - Vitest-compatible API
 *
 * @example
 * ```typescript
 * import { it } from "./mod.ts";
 * import { assertEquals } from "jsr:@std/assert";
 *
 * // Vitest-style API
 * it.each([1, 2, 3, 4])("should be positive: %d", (n) => {
 *   assertEquals(n > 0, true);
 * });
 *
 * it.each([
 *   [1, 2, 3],
 *   [2, 3, 5],
 *   [3, 4, 7]
 * ])("adds %d + %d = %d", ([a, b, expected]) => {
 *   assertEquals(a + b, expected);
 * });
 * ```
 */

/**
 * Vitest-compatible it.each() API for parameterized testing
 */
export const it: {
  each<T>(cases: readonly T[]): (
    name: string,
    testFn: (value: T, index: number) => void | Promise<void>,
  ) => void;
  each<T>(
    cases: readonly T[],
    onlyIndex: number,
  ): (
    name: string,
    testFn: (value: T, index: number) => void | Promise<void>,
  ) => void;
  each<T>(
    cases: readonly T[],
    filter: (value: T, index: number) => boolean,
  ): (
    name: string,
    testFn: (value: T, index: number) => void | Promise<void>,
  ) => void;
} = {
  /**
   * Run a test function with multiple input cases using Vitest-style API
   */
  each<T>(
    cases: readonly T[],
    filterOrIndex?: number | ((value: T, index: number) => boolean),
  ) {
    return (
      name: string,
      testFn: (value: T, index: number) => void | Promise<void>,
    ) => {
      cases.forEach((testCase, index) => {
        const shouldRun = filterOrIndex === undefined ||
          (typeof filterOrIndex === "number"
            ? index === filterOrIndex
            : filterOrIndex(testCase, index));

        if (!shouldRun) return;

        const caseName = formatTestName(name, testCase, index);

        Deno.test({
          name: caseName,
          fn: () => testFn(testCase, index),
        });
      });
    };
  },
};

/**
 * Format test name with case interpolation
 */
function formatTestName<T>(
  template: string,
  testCase: T,
  index: number,
): string {
  if (
    template.includes("%s") || template.includes("%d") ||
    template.includes("%j") || template.includes("$")
  ) {
    return interpolateTemplate(template, testCase);
  }

  // If no placeholders, append case info
  const caseStr = Array.isArray(testCase)
    ? `[${testCase.join(", ")}]`
    : typeof testCase === "object" && testCase !== null
    ? JSON.stringify(testCase)
    : String(testCase);

  return `${template} (case ${index}: ${caseStr})`;
}

/**
 * Get nested property value from object using dot notation
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => {
    return current?.[prop];
  }, obj);
}

/**
 * Interpolate template string with test case values
 */
function interpolateTemplate<T>(template: string, testCase: T): string {
  let result = template;

  // Handle $propertyName syntax for object property access
  if (typeof testCase === "object" && testCase !== null && !Array.isArray(testCase)) {
    result = result.replace(/\$([a-zA-Z_][\w-]*(?:\.[a-zA-Z_][\w-]*)*)/g, (match, propertyPath) => {
      try {
        const value = getNestedProperty(testCase, propertyPath);
        return value !== undefined ? String(value) : match;
      } catch {
        return match;
      }
    });
  }

  if (Array.isArray(testCase)) {
    let caseIndex = 0;

    // Replace %s, %d, %j placeholders
    result = result.replace(/%[sdj]/g, (match) => {
      if (caseIndex >= testCase.length) return match;

      const value = testCase[caseIndex++];
      switch (match) {
        case "%s":
          return String(value);
        case "%d":
          return String(Number(value));
        case "%j":
          return JSON.stringify(value);
        default:
          return match;
      }
    });

    return result;
  }

  // For non-array cases, replace first placeholder
  const value = testCase;
  result = result.replace(/%[sdj]/, (match) => {
    switch (match) {
      case "%s":
        return String(value);
      case "%d":
        return String(Number(value));
      case "%j":
        return JSON.stringify(value);
      default:
        return match;
    }
  });

  return result;
}
