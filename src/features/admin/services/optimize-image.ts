import sharp from "sharp";

export async function optimizeUploadedImage(input: Buffer): Promise<Buffer> {
  return sharp(input, { limitInputPixels: 40_000_000, failOn: "warning" })
    .rotate()
    .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();
}
