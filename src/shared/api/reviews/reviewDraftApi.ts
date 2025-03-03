import {
  DraftReviewResponse,
  CreateDraftReviewRequest,
  UpdateDraftReviewRequest,
  ShowUserDraftReviewResponse,
} from "./types";
import { useApiQuery, useApiMutation } from "@shared/api/hooks/useQuery";
import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { ApiError } from "@shared/api/hooks/useApi";
import { apiInstance } from "../base";

export const useReviewDraftApi = () => {
  const queryClient = useQueryClient();

  // 초안 생성
  const createDraftMutation = useApiMutation<
    DraftReviewResponse,
    CreateDraftReviewRequest
  >("/api/reviews/draft", "post", 'toast', {}, "알 수 없는 오류로 인해 생성 실패했습니다");

  // 초안 수정
  const updateDraftMutation = useApiMutation<
    DraftReviewResponse,
    UpdateDraftReviewRequest & { id: number }
  >("/api/reviews/draft/:id", "patch", 'toast',
    { urlTransform: ({ id }) => `/api/reviews/draft/${id}`,
    onMutate: async (variables) => {
      // 이전 상태 백업
      const previousDraft = queryClient.getQueryData<DraftReviewResponse>(['draftReview', variables.id]);
      
      // Ensure previousDraft exists before spreading
      if (previousDraft) {
        // 낙관적 업데이트
        queryClient.setQueryData(['draftReview', variables.id], {
          ...previousDraft,
          ...variables
        });
      }
      
      return { previousDraft };
    },
    onError: (err, variables, context) => {
      if (context?.previousDraft) {
        // 에러시 롤백
        queryClient.setQueryData(['draftReview', variables.id], context.previousDraft);
      }
    }
  },
  "알 수 없는 오류로 인해 저장 실패했습니다"
);

  // 초안 삭제
  const deleteDraftMutation = useApiMutation<void, void>(
    "/api/reviews/draft",
    "delete",
    'toast',
    {},
    "알 수 없는 오류로 인해 삭제 실패했습니다"
  );

  const fetchDraftReview = async (
    draftId: number | null
  ): Promise<ShowUserDraftReviewResponse> => {
    if (!draftId) {
      throw new Error("Draft ID is required");
    }

    try {
      const response = await apiInstance.get<ShowUserDraftReviewResponse>(
        `/api/reviews/draft/${draftId}`
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch draft review:", error);
      throw new Error("Failed to fetch draft review");
    }
  };

  // 특정 초안 조회
  const useDraftReview = (
    draftId: number | null,
    options?: Partial<UseQueryOptions<ShowUserDraftReviewResponse, ApiError>>
  ) => {
    return useQuery<ShowUserDraftReviewResponse, ApiError>({
      queryKey: ["draftReview", draftId],
      queryFn: () => fetchDraftReview(draftId),
      throwOnError: true,
      ...options,
      enabled: draftId !== null && options?.enabled !== false,
    });
  };

  // 사용자의 모든 초안 조회
  const useUserDraftReviews = (
    cafeId?: number | null,
    options?: Partial<UseQueryOptions<ShowUserDraftReviewResponse[], ApiError>>
  ) => {
    return useQuery<ShowUserDraftReviewResponse[], ApiError>({
      queryKey: ["reviewDrafts", "user", cafeId],
      queryFn: async () => {
        const queryString = cafeId ? `?cafeId=${cafeId}` : "";
        const response = await apiInstance.get<ShowUserDraftReviewResponse[]>(
          `/api/reviews/draft/all${queryString}`
        );
        return response;
      },
      throwOnError: true,
      ...options,
      enabled: options?.enabled !== false,
    });
  };

  // 초안 생성 함수
  const createDraft = async (
    request: CreateDraftReviewRequest,
    options?: {
      onSuccess?: (response: DraftReviewResponse) => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      const response = await createDraftMutation.mutateAsync(request);
      // await queryClient.invalidateQueries({ queryKey: ["reviewDrafts"] });
      options?.onSuccess?.(response);
      return response;
    } catch (error) {
      console.error("리뷰 초안 생성 중 오류 발생:", error);
      options?.onError?.(error);
      throw error;
    }
  };

  // 초안 수정 함수
  const updateDraft = async (
    draftId: number,
    request: UpdateDraftReviewRequest,
    options?: {
      onSuccess?: (response: DraftReviewResponse) => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      // Convert request payload to match backend format
      const payload = {
        content: request.content,
        rating: request.rating,
        visitDate: request.visitDate,
        tagIds: request.tagIds,
      };

      const response = await updateDraftMutation.mutateAsync({
        ...payload,
        id: draftId,
      });
      // await queryClient.invalidateQueries({ queryKey: ["reviewDrafts"] });
      options?.onSuccess?.(response);
      return response;
    } catch (error) {
      console.error("리뷰 초안 수정 중 오류 발생:", error);
      options?.onError?.(error);
      throw error;
    }
  };

  // 초안 삭제 함수
  const deleteDraft = async (
    draftId: number,
    options?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      await deleteDraftMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: ["reviewDrafts"] });
      options?.onSuccess?.();
    } catch (error) {
      console.error("리뷰 초안 삭제 중 오류 발생:", error);
      options?.onError?.(error);
      throw error;
    }
  };

  return {
    // Mutations
    createDraft,
    updateDraft,
    deleteDraft,

    // Queries
    useDraftReview,
    useUserDraftReviews,

    // Mutation states
    isCreating: createDraftMutation.isPending,
    isUpdating: updateDraftMutation.isPending,
    isDeleting: deleteDraftMutation.isPending,

    // Errors
    createError: createDraftMutation.error,
    updateError: updateDraftMutation.error,
    deleteError: deleteDraftMutation.error,
  };
};
