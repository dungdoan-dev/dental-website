import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { optimizeUploadedImage } from "./optimize-image";

test("uploads are resized, encoded as WebP, stripped of metadata and never enlarged", async () => {
  const input = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: "#0878b5" } }).jpeg().withMetadata().toBuffer();
  const output = await optimizeUploadedImage(input);
  const info = await sharp(output).metadata();
  assert.equal(info.format, "webp");
  assert.equal(info.width, 2560);
  assert.equal(info.height, 1280);
  assert.equal(info.exif, undefined);
  const small = await optimizeUploadedImage(await sharp({ create: { width: 80, height: 40, channels: 4, background: "#0000" } }).png().toBuffer());
  assert.equal((await sharp(small).metadata()).width, 80);
  await assert.rejects(optimizeUploadedImage(Buffer.from("not an image")));
});
