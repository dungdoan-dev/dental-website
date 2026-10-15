import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeArticleContent, sanitizeArticleHtml } from "./article-content";

test("sanitizeArticleHtml strips scripts, event handlers and foreign images", () => {
  const html = sanitizeArticleHtml(
    '<p onclick="steal()">Hi<script>alert(1)</script></p>'
    + '<a href="javascript:alert(1)">x</a>'
    + '<img src="https://evil.example/x.png" onerror="alert(1)">'
    + '<img src="/images/ok.png" onerror="alert(1)">',
  );
  assert.doesNotMatch(html, /script|onclick|onerror|javascript:|evil\.example/i);
  assert.match(html, /<img src="\/images\/ok\.png" alt="" loading="lazy" \/>/);
});

test("sanitizeArticleHtml adds unique heading ids", () => {
  const html = sanitizeArticleHtml("<h2>Răng sứ</h2><h2>Răng sứ</h2>");
  assert.match(html, /<h2 id="rang-su">/);
  assert.match(html, /<h2 id="rang-su-2">/);
});

test("sanitizeArticleContent sanitizes rich HTML before it is stored", () => {
  assert.doesNotMatch(sanitizeArticleContent("<p>a</p><script>alert(1)</script>"), /script/);
});
