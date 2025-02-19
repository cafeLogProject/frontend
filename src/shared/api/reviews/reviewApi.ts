import { useCallback } from "react";
import { useApiQuery, useApiMutation } from "@shared/api/hooks/useQuery";
import {
  useQueryClient, QueryClient
} from "@tanstack/react-query";
import type {
  ReviewRequest,
  ReviewResponse,
  ShowCafeReviewRequest,
  ShowReviewResponse,
  ShowReviewListRequest,
  ShowUserReviewRequest,
  ShowMyReviewRequest
} from "./types";

export const useReviewApi = () => {
  const queryClient = useQueryClient();

  const createReviewMutation = useApiMutation<
    ReviewResponse,
    ReviewRequest & { draftId: number }
  >("/api/reviews/:draftId", "post", {
    urlTransform: (request) => `/api/reviews/${request.draftId}`,
  });

  const createReview = async (
    request: ReviewRequest & { draftId: number },
    options?: {
      onSuccess?: (response: ReviewResponse) => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      const response = await createReviewMutation.mutateAsync(request);
      // 리뷰 작성 성공 시 reviews 관련 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      options?.onSuccess?.(response);
      return response;
    } catch (error) {
      console.error("리뷰 작성 중 오류 발생:", error);
      options?.onError?.(error);
      throw error;
    }
  };

  const deleteReviewMutation = useApiMutation<void, number>(
    "/api/reviews/:reviewId",
    "delete",
    {
      urlTransform: (reviewId) => `/api/reviews/${reviewId}`,
    }
  );

  const deleteReview = async (
    reviewId: number,
    options?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      options?.onSuccess?.();
    } catch (error) {
      console.error("리뷰 삭제 중 오류 발생:", error);
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

  const useReviewList = (
    params: ShowReviewListRequest = {
      sort: "NEW",
      limit: 10,
      timestamp: "3000-01-01T00:00:00",
    }
  ) => {
    const validatedParams = {
      sort: params.sort,
      timestamp: params.timestamp?.endsWith("Z")
        ? params.timestamp.slice(0, -1)
        : params.timestamp || "3000-01-01T00:00:00",
      limit: Math.min(Math.max(params.limit || 10, 1), 20),
      ...(params.tagIds?.length ? { tagIds: params.tagIds.slice(0, 5) } : {}),
      ...(params.rating
        ? { rating: Math.min(Math.max(params.rating, 1), 5) }
        : {}),
    };

    const cleanParams = Object.fromEntries(
      Object.entries(validatedParams).filter(([_, value]) => value != null)
    );

    return useApiQuery<ShowReviewResponse[]>(
      ["reviews", "list", validatedParams],
      `/api/reviews/list?${new URLSearchParams(cleanParams as any).toString()}`
    );
  };

  const useUserReviews = (params: ShowUserReviewRequest = { limit: 10 }) => {
    const validatedParams = {
      userId : params.userId,
      limit: Math.min(Math.max(params.limit || 10, 1), 20),
      ...(params.timestamp
        ? {
            timestamp: params.timestamp?.endsWith("Z")
              ? params.timestamp.slice(0, -1)
              : params.timestamp,
          }
        : {}),
    };

    const cleanParams = Object.fromEntries(
      Object.entries(validatedParams).filter(([_, value]) => value != null)
    );

    return useApiQuery<ShowReviewResponse[]>(
      ["reviews", "user", validatedParams],
      `/api/reviews/user?${new URLSearchParams(cleanParams as any).toString()}`
    );
  };

  const useMyReviews = (params: ShowMyReviewRequest = { limit: 10 }) => {
    const validatedParams = {
      limit: Math.min(Math.max(params.limit || 10, 1), 20),
      ...(params.timestamp
        ? {
            timestamp: params.timestamp?.endsWith("Z")
              ? params.timestamp.slice(0, -1)
              : params.timestamp,
          }
        : {}),
    };

    const cleanParams = Object.fromEntries(
      Object.entries(validatedParams).filter(([_, value]) => value != null)
    );

    return useApiQuery<ShowReviewResponse[]>(
      ["reviews", "my", validatedParams],
      `/api/reviews/my?${new URLSearchParams(cleanParams as any).toString()}`
    );
  };

  const useFollowingReviews = (params: ShowUserReviewRequest = { limit: 10 }) => {
    const validatedParams = {
      limit: Math.min(Math.max(params.limit || 10, 1), 20),
      ...(params.timestamp
        ? {
            timestamp: params.timestamp?.endsWith("Z")
              ? params.timestamp.slice(0, -1)
              : params.timestamp,
          }
        : {}),
    };

    const cleanParams = Object.fromEntries(
      Object.entries(validatedParams).filter(([_, value]) => value != null)
    );

    return useApiQuery<ShowReviewResponse[]>(
      ["reviews", "following", validatedParams],
      `/api/reviews/follow?${new URLSearchParams(cleanParams as any).toString()}`
    );
  };

  /**
   * 이하 레거시 호환을 위한 코드
   */
  const getCafeReviews = useCallback(
    async (
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
    },
    []
  );

  const getReviewList = useCallback(
    async (params: ShowReviewListRequest = { sort: "NEW", limit: 10 }) => {
      try {
        const query = useReviewList(params);
        const response = await query.refetch();
        return response.data || [];
      } catch (error) {
        console.error("리뷰 목록 조회 중 오류 발생:", error);
        throw error;
      }
    },
    []
  );

  const getUserReviews = useCallback(
    async (params: ShowUserReviewRequest = { limit: 10 }) => {
      try {
        const query = useUserReviews(params);
        const response = await query.refetch();
        return response.data || [];
      } catch (error) {
        console.error("내 리뷰 목록 조회 중 오류 발생:", error);
        throw error;
      }
    },
    []
  );

  const getMyReviews = useCallback(
    async (params: ShowMyReviewRequest = { limit: 10 }) => {
      try {
        const query = useMyReviews(params);
        const response = await query.refetch();
        return response.data || [];
      } catch (error) {
        console.error("내 리뷰 목록 조회 중 오류 발생:", error);
        throw error;
      }
    },
    []
  );

  return {
    createReview,
    createReviewMutation,

    useCafeReviews,
    useReviewList,
    useUserReviews,
    useMyReviews,
    useFollowingReviews,

    getCafeReviews,
    getReviewList,
    getUserReviews,
    getMyReviews,

    deleteReview,
    deleteReviewMutation,

    isLoading: createReviewMutation.isPending,
    error: createReviewMutation.error,
  };
};
