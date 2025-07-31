/**
 * Parameterized testing utilities for Deno
 * 
 * @example
 * ```typescript
 * import { testEach, test } from "./mod.ts";
 * import { assertEquals } from "jsr:@std/assert";
 * 
 * // Function-based API
 * testEach([1, 2, 3, 4], (n) => {
 *   assertEquals(n > 0, true);
 * }, "should be positive");
 * 
 * // Object-based API
 * test.each([
 *   [1, 2, 3],
 *   [2, 3, 5],
 *   [3, 4, 7]
 * ])("adds %d + %d = %d", (a, b, expected) => {
 *   assertEquals(a + b, expected);
 * });
 * ```
 */

export interface TestEachOptions {
  /** Custom name template. Use %s for string interpolation of case values */
  name?: string;
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
 * Run a test function with multiple input cases
 */
export function testEach<T>(
  cases: readonly T[],
  testFn: (value: T, index: number) => void | Promise<void>,
  nameOrOptions?: string | TestEachOptions
): void {
  const options = typeof nameOrOptions === "string" 
    ? { name: nameOrOptions } 
    : nameOrOptions || {};
  
  const baseName = options.name || "test case";
  
  cases.forEach((testCase, index) => {
    const caseName = formatTestName(baseName, testCase, index);
    
    Deno.test({
      name: caseName,
      ignore: options.ignore,
      only: options.only,
      permissions: options.permissions,
      sanitizeOps: options.sanitizeOps,
      sanitizeResources: options.sanitizeResources,
      fn: () => testFn(testCase, index)
    });
  });
}

/**
 * Object-based API similar to Jest's test.each
 */
export const test: {
  each<T>(cases: readonly T[]): (
    nameOrTestFn: string | ((value: T, index: number) => void | Promise<void>),
    testFn?: (value: T, index: number) => void | Promise<void>,
    options?: Omit<TestEachOptions, "name">
  ) => void;
} = {
  /**
   * Run a test function with multiple input cases using fluent API
   */
  each<T>(cases: readonly T[]) {
    return (
      nameOrTestFn: string | ((value: T, index: number) => void | Promise<void>),
      testFn?: (value: T, index: number) => void | Promise<void>,
      options?: Omit<TestEachOptions, "name">
    ) => {
      if (typeof nameOrTestFn === "function") {
        // test.each(cases)(testFn, options)
        testEach(cases, nameOrTestFn, options);
      } else {
        // test.each(cases)(name, testFn, options)
        if (!testFn) {
          throw new Error("Test function is required when name is provided");
        }
        testEach(cases, testFn, { ...options, name: nameOrTestFn });
      }
    };
  }
};

/**
 * Format test name with case interpolation
 */
function formatTestName<T>(template: string, testCase: T, index: number): string {
  if (template.includes("%s") || template.includes("%d") || template.includes("%j")) {
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
        case "%s": return String(value);
        case "%d": return String(Number(value));
        case "%j": return JSON.stringify(value);
        default: return match;
      }
    });
    
    return result;
  }
  
  // For non-array cases, replace first placeholder
  const value = testCase;
  return template.replace(/%[sdj]/, (match) => {
    switch (match) {
      case "%s": return String(value);
      case "%d": return String(Number(value));
      case "%j": return JSON.stringify(value);
      default: return match;
    }
  });
}