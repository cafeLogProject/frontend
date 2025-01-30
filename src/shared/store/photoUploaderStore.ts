import { create } from "zustand";
import {
  UploadedImage,
  PhotoUploaderConfig,
} from "@widgets/photoUploader/types";
import { DEFAULT_CONFIG } from "@widgets/photoUploader/lib/constants";
import { validateFile } from "@widgets/photoUploader/lib/validation";
import { resizeImage } from "@widgets/photoUploader/lib/imageProcessing";

interface AddImagesResult {
  error: string | null;
  newImages: UploadedImage[];
}

export interface PhotoUploaderStore {
  images: UploadedImage[];
  config: PhotoUploaderConfig;
  addImages: (files: File[]) => Promise<AddImagesResult>;
  removeImage: (id: string) => Promise<void>;
  setConfig: (config: Partial<PhotoUploaderConfig>) => void;
  cleanup: () => void;
  loadInitialImages: (imageIds: string[]) => void; // New method
}

export function createPhotoUploaderStore({
  upload,
  remove,
  getUrl,
}: {
  upload: (file: File) => Promise<string>;
  remove: (imageId: string) => Promise<void>;
  getUrl: (imageId: string) => string;
}) {
  return create<PhotoUploaderStore>((set, get) => ({
    images: [],
    config: DEFAULT_CONFIG,

    addImages: async (files: File[]): Promise<AddImagesResult> => {
      const { images, config } = get();

      if (images.length + files.length > config.maxCount) {
        return {
          error: `최대 ${config.maxCount}장까지만 업로드 가능합니다.`,
          newImages: [],
        };
      }

      try {
        // 임시 이미지 추가 (로딩 상태)
        const tempImages = files.map(file => ({
          id: `temp_${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
          isUploading: true
        }));
        
        const currentImages = [...images, ...tempImages];
        set({ images: currentImages });

        // 파일 처리 및 업로드
        const processedFiles = await Promise.all(
          files.map(async (file, index) => {
            const error = validateFile(file, config);
            if (error) throw new Error(error);

            const resized = await resizeImage(file, config.maxDimension, config.quality);
            const processedFile = new File([resized], file.name, { type: "image/jpeg" });
            const imageId = await upload(processedFile);
            
            // 해당 임시 이미지를 찾아서 업데이트
            const tempImage = tempImages[index];
            const updatedImages = currentImages.map(img => 
              img.id === tempImage.id ? {
                id: imageId,
                file: processedFile,
                previewUrl: tempImage.previewUrl,
                uploadedUrl: getUrl(imageId),
                isUploading: false
              } : img
            );
            
            set({ images: updatedImages });
            return updatedImages.find(img => img.id === imageId)!;
          })
        );

        return { error: null, newImages: processedFiles };
      } catch (error) {
        // 에러 발생 시 원래 상태로 복구
        set({ images });
        return {
          error: error instanceof Error ? error.message : "업로드 실패",
          newImages: [],
        };
      }
    },

    removeImage: async (id) => {
      const { images } = get();
      const imageToRemove = images.find((img) => img.id === id);
      if (!imageToRemove) return;

      if (imageToRemove.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      await remove(id);

      set((state) => ({
        images: state.images.filter((img) => img.id !== id),
      }));
    },

    setConfig: (newConfig) => {
      set((state) => ({
        config: { ...state.config, ...newConfig },
      }));
    },

    cleanup: () => {
      const { images } = get();
      images.forEach((image) => {
        if (image.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
      set({ images: [] });
    },

    loadInitialImages: (imageIds: string[]) => {
      const initialImages = imageIds.map((id) => ({
        id,
        previewUrl: getUrl(id),
        uploadedUrl: getUrl(id),
        file: null as any,
      }));
      set({ images: initialImages });
    },
  }));
}
