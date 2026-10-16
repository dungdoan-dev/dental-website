import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { parseValidItems } from "./parse-list";

test("parseValidItems keeps valid records and skips only the invalid one", () => {
  const schema = z.object({ id: z.string(), name: z.string().min(1) });
  const original = console.error;
  console.error = () => {};
  try {
    const result = parseValidItems(schema, [{ id: "a", name: "A" }, { id: "b", name: "" }, { id: "c", name: "C" }], "test");
    assert.deepEqual(result.map((item) => item.id), ["a", "c"]);
  } finally {
    console.error = original;
  }
});
