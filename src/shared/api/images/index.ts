/**
 * 일반, 드래프트 모두에서 사용되는 이미지 API.
 * 공통적으로 사용하기에는 코드가 좋지 않습니다.
 * 추후에 리팩토링이 필요합니다.
 */

import { useCallback, useMemo } from "react";
import { useApi } from "@shared/api/hooks/useApi";
import { API_URL } from "../base";
import type {
  ImageApiResponse,
  ImageUploadResponse,
  ImageDeleteResponse,
} from "./types";

const BASE_URL = `${API_URL}/api/images/draftReview`;

export const useReviewImageApi = (draftReviewId?: number) => {
  const { post, remove } = useApi<ImageApiResponse>();

  const upload = useCallback(
    async (file: File): Promise<string> => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await post<ImageUploadResponse>(
          `${BASE_URL}/${draftReviewId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.imageId;
      } catch (error) {
        throw new Error("Failed to upload image: " + error);
      }
    },
    [post, draftReviewId]
  );

  const removeImage = useCallback(
    async (imageId: string): Promise<void> => {
      await remove(
        `${BASE_URL}?draftReviewId=${draftReviewId}&imageId=${imageId}`
      );
    },
    [remove, draftReviewId]
  );

  const getUrl = useCallback(
    (imageId: string): string => {
      return `${BASE_URL}?draftReviewId=${draftReviewId}&imageId=${imageId}`;
    },
    [draftReviewId]
  );

  // 일반 리뷰의 이미지인 경우
  const getImageUrl = (imageId: string) => {
    return `${API_URL}/api/images/review/${imageId}`;
  };

  // draft 상태일 때의 이미지 URL(아직 사용되지 않음)
  const getDraftImageUrl = (imageId: string) => {
    return `${API_URL}/api/images/draftReview?draftReviewId=${draftReviewId}&imageId=${imageId}`;
  };

  return useMemo(
    () => ({
      upload,
      remove: removeImage,
      getUrl,
      getImageUrl,
      getDraftImageUrl
    }),
    [upload, removeImage, getUrl, getImageUrl, getDraftImageUrl]
  );
};
