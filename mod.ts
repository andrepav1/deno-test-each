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

export interface TestEachOptions {
  /** Whether to ignore this test */
  ignore?: boolean;
  /** Whether to run only this test */
  only?: boolean;
  /** Test permissions */
  permissions?: Deno.TestDefinition["permissions"];
  /** Test sanitizer options */
  sanitizeOps?: boolean;
  sanitizeResources?: boolean;
}

/**
 * Vitest-compatible it.each() API for parameterized testing
 */
export const it: {
  each<T>(cases: readonly T[]): (
    name: string,
    testFn: (value: T, index: number) => void | Promise<void>,
    options?: TestEachOptions,
  ) => void;
} = {
  /**
   * Run a test function with multiple input cases using Vitest-style API
   */
  each<T>(cases: readonly T[]) {
    return (
      name: string,
      testFn: (value: T, index: number) => void | Promise<void>,
      options?: TestEachOptions,
    ) => {
      cases.forEach((testCase, index) => {
        const caseName = formatTestName(name, testCase, index);

        Deno.test({
          name: caseName,
          ignore: options?.ignore,
          only: options?.only,
          permissions: options?.permissions,
          sanitizeOps: options?.sanitizeOps,
          sanitizeResources: options?.sanitizeResources,
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
    template.includes("%j")
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
 * Interpolate template string with test case values
 */
function interpolateTemplate<T>(template: string, testCase: T): string {
  if (Array.isArray(testCase)) {
    let result = template;
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
  return template.replace(/%[sdj]/, (match) => {
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
}
