import { useCallback } from "react";
import { useApiQuery, useApiMutation } from "@shared/api/hooks/useQuery";
import type {
  ReviewRequest,
  ReviewResponse,
  ShowCafeReviewRequest,
  ShowReviewResponse,
  ShowReviewListRequest,
  ShowUserReviewRequest,
} from "./types";

export const useReviewApi = () => {
  const createReviewMutation = useApiMutation<ReviewResponse, ReviewRequest>(
    "/api/reviews",
    "post"
  );

  const createReview = async (
    request: ReviewRequest,
    options?: {
      onSuccess?: (response: ReviewResponse) => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      const response = await createReviewMutation.mutateAsync(request);
      options?.onSuccess?.(response);
      return response;
    } catch (error) {
      console.error("리뷰 작성 중 오류 발생:", error);
      options?.onError?.(error);
      throw error;
    }
  };

  const useCafeReviews = (cafeId: number, params: ShowCafeReviewRequest) => {
    return useApiQuery<ShowReviewResponse[]>(
      ["reviews", "cafe", cafeId, params],
      `/api/reviews/cafe/${cafeId}?${new URLSearchParams(params as any).toString()}`
    );
  };

  const useReviewList = (params: ShowReviewListRequest = { sort: "NEW", limit: 10 }) => {
    return useApiQuery<ShowReviewResponse[]>(
      ["reviews", "list", params],
      `/api/reviews/list?${new URLSearchParams(params as any).toString()}`
    );
  };

  const useMyReviews = (params: ShowUserReviewRequest = { limit: 10 }) => {
    return useApiQuery<ShowReviewResponse[]>(
      ["reviews", "my", params],
      `/api/reviews/my?${new URLSearchParams(params as any).toString()}`
    );
  };

  /**
   * 이하 레거시 호환을 위한 코드
   */
  const getCafeReviews = useCallback(async (
    cafeId: number,
    params: ShowCafeReviewRequest,
    options?: {
      onSuccess?: (response: ShowReviewResponse[]) => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      const query = useCafeReviews(cafeId, params);
      const response = await query.refetch();
      options?.onSuccess?.(response.data || []);
      return response.data || [];
    } catch (error) {
      console.error("카페 리뷰 조회 중 오류 발생:", error);
      options?.onError?.(error);
      throw error;
    }
  }, []);

  const getReviewList = useCallback(async (
    params: ShowReviewListRequest = { sort: "NEW", limit: 10 }
  ) => {
    try {
      const query = useReviewList(params);
      const response = await query.refetch();
      return response.data || [];
    } catch (error) {
      console.error("리뷰 목록 조회 중 오류 발생:", error);
      throw error;
    }
  }, []);

  const getMyReviews = useCallback(async (
    params: ShowUserReviewRequest = { limit: 10 }
  ) => {
    try {
      const query = useMyReviews(params);
      const response = await query.refetch();
      return response.data || [];
    } catch (error) {
      console.error("내 리뷰 목록 조회 중 오류 발생:", error);
      throw error;
    }
  }, []);

  return {
    createReview,
    createReviewMutation,

    useCafeReviews,
    useReviewList,
    useMyReviews,

    getCafeReviews,
    getReviewList,
    getMyReviews,

    isLoading: createReviewMutation.isPending,
    error: createReviewMutation.error
  };
};
