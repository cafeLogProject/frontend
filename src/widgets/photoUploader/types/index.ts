export interface UploadedImage {
  id: string;
  file?: File;
  previewUrl: string;
  uploadedUrl?: string;
  isUploading?: boolean;
}

export interface PhotoUploaderConfig {
  maxCount: number;
  maxSize: number;
  maxDimension: number;
  quality: number;
  allowedTypes: string[];
}
