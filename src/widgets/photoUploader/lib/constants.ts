import { PhotoUploaderConfig } from "../types";

export const DEFAULT_CONFIG: PhotoUploaderConfig = {
  maxCount: 3,
  maxSize: 10 * 1024 * 1024, // 10MB로 조정
  maxDimension: 1920, // 최대 해상도
  quality: 0.8, // JPEG 압축률
  allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
};
