#!/usr/bin/env -S deno run -A

/**
 * Build script for npm publishing
 * Creates a Node.js compatible package with TypeScript definitions
 */

import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // Deno namespace shimming for Node.js
    deno: "dev",
  },
  compilerOptions: {
    lib: ["ES2022", "DOM"],
    target: "ES2022",
  },
  package: {
    name: "deno-test-each",
    version: Deno.args[0] || "0.1.0",
    description:
      "Parameterized testing utilities for Deno - run the same test with multiple inputs",
    license: "MIT",
    author: "Andrea",
    repository: {
      type: "git",
      url: "git+https://github.com/andrepav1/deno-test-each.git",
    },
    bugs: {
      url: "https://github.com/andrepav1/deno-test-each/issues",
    },
    homepage: "https://github.com/andrepav1/deno-test-each#readme",
    keywords: [
      "deno",
      "testing",
      "parameterized",
      "test-each",
      "unit-testing",
      "typescript",
    ],
    engines: {
      node: ">=16.0.0",
    },
    devDependencies: {
      "@types/node": "^20.0.0",
    },
  },
  postBuild() {
    // copy additional files
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});

console.log("✅ Build completed! Package ready in ./npm/");
console.log("📦 To publish: cd npm && npm publish");
