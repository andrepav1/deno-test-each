import { it } from "../mod.ts";
import { assertEquals } from "jsr:@std/assert";

// Test basic property interpolation
it.each([
  { name: "positive case", value: 5 },
  { name: "negative case", value: -3 },
  { name: "zero case", value: 0 }
])("Testing $name with value $value", ({ name, value }) => {
  assertEquals(typeof name, "string");
  assertEquals(typeof value, "number");
});

// Test nested property access
it.each([
  { user: { profile: { name: "Alice" } }, id: 1 },
  { user: { profile: { name: "Bob" } }, id: 2 }
])("User $user.profile.name has id $id", ({ user, id }) => {
  assertEquals(user.profile.name.length > 0, true);
  assertEquals(typeof id, "number");
});

// Test mixed $property and %j syntax
it.each([
  { name: "test1", data: { count: 10 } },
  { name: "test2", data: { count: 20 } }
])("Case $name with data %j", ({ name, data }) => {
  assertEquals(name.startsWith("test"), true);
  assertEquals(data.count > 0, true);
});

// Test property that doesn't exist (should keep $missing unchanged)
it.each([
  { name: "exists", value: 42 }
])("Property $name exists but $missing does not", ({ name, value }) => {
  assertEquals(name, "exists");
  assertEquals(value, 42);
});

// Test deeply nested properties
it.each([
  { 
    deep: { 
      level: { 
        nested: { 
          prop: "found it" 
        } 
      } 
    },
    simple: "value"
  }
])("Deep property: $deep.level.nested.prop, simple: $simple", ({ deep, simple }) => {
  assertEquals(deep.level.nested.prop, "found it");
  assertEquals(simple, "value");
});

// Test property interpolation with special characters
it.each([
  { "test-name": "kebab case", "test_name": "snake case" }
])("Kebab: $test-name, Snake: $test_name", (obj) => {
  assertEquals(obj["test-name"], "kebab case");
  assertEquals(obj["test_name"], "snake case");
});

// Test property interpolation with numbers and booleans
it.each([
  { count: 42, active: true, rate: 3.14 }
])("Count: $count, Active: $active, Rate: $rate", ({ count, active, rate }) => {
  assertEquals(count, 42);
  assertEquals(active, true);
  assertEquals(rate, 3.14);
});

// Test arrays (should not trigger property interpolation, should use existing logic)
it.each([
  [1, 2, 3],
  [4, 5, 6]
])("Array test: %j", (arr) => {
  assertEquals(Array.isArray(arr), true);
  assertEquals(arr.length, 3);
});