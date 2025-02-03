import { useApi, type ApiError } from '@shared/api/hooks/useApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoriteCafeInfo, ToggleFavoriteRequest, ToggleFavoriteResponse } from './types';

export const useFavoriteApi = () => {
  const { get, post } = useApi<FavoriteCafeInfo[]>();
  const queryClient = useQueryClient();

  // 즐겨찾기한 카페 목록 조회 쿼리
  const favoritesCafesQuery = useQuery({
    queryKey: ['favorites', 'cafes'],
    queryFn: async () => {
      const response = await get('/api/my/cafes?scraped=true', {}, {
        onError: (error: ApiError) => {
          console.error('즐겨찾기 목록 조회 실패:', error.message);
        }
      });
      return response;
    },
  });

  // 즐겨찾기 토글 mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (request: ToggleFavoriteRequest) => {
      const response = await post<ToggleFavoriteResponse>(
        '/api/cafes/scraps',
        request,
        {},
        {
          onError: (error: ApiError) => {
            console.error('즐겨찾기 토글 실패:', error.message);
          }
        }
      );
      return response;
    },
    // 낙관적 업데이트
    onMutate: async (newFavorite) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', 'cafes'] });
      const previousFavorites = queryClient.getQueryData<FavoriteCafeInfo[]>(['favorites', 'cafes']);

      queryClient.setQueryData<FavoriteCafeInfo[]>(
        ['favorites', 'cafes'],
        (old = []) => {
          if (newFavorite.isScrap) {
            const cafeExists = old.some(cafe => cafe.cafeId === newFavorite.cafeId);
            if (!cafeExists) {
              return [...old];
            }
            return old;
          } else {
            return old.filter(cafe => cafe.cafeId !== newFavorite.cafeId);
          }
        }
      );

      return { previousFavorites };
    },
    onError: (_, __, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', 'cafes'], context.previousFavorites);
        queryClient.invalidateQueries({ queryKey: ['favorites', 'cafes'] });
      }
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ['favorites', 'cafes'] });
    // },
  });

  const toggleFavorite = async (
    request: ToggleFavoriteRequest,
    options?: {
      onSuccess?: (response: ToggleFavoriteResponse) => void;
      onError?: (error: ApiError) => void;
    }
  ) => {
    try {
      const response = await toggleFavoriteMutation.mutateAsync(request);
      options?.onSuccess?.(response);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      options?.onError?.(apiError);
      throw apiError;
    }
  };

  return {
    favorites: favoritesCafesQuery.data || [],
    isLoading: favoritesCafesQuery.isLoading,
    error: favoritesCafesQuery.error,
    toggleFavorite,
    isToggling: toggleFavoriteMutation.isPending
  };
};