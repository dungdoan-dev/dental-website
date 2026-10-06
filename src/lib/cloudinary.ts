export type CloudinaryConfig = {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
};

export function getCloudinaryConfig(): CloudinaryConfig {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}
