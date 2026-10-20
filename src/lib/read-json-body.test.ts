import { test } from "node:test";
import assert from "node:assert/strict";
import { readJsonBody, RequestBodyTooLargeError } from "./read-json-body";

test("JSON body size is enforced even without content-length", async () => {
  assert.deepEqual(await readJsonBody(new Request("https://example.test", { method: "POST", body: '{"a":1}' })), { a: 1 });
  await assert.rejects(readJsonBody(new Request("https://example.test", { method: "POST", body: " ".repeat(20000) })), RequestBodyTooLargeError);
  await assert.rejects(readJsonBody(new Request("https://example.test", { method: "POST", body: "bad JSON" })), SyntaxError);
});
