import { FollowResponse,
	UserFollowRequest,
	UserFollowResponse,
} from "./types";
import { useApiQuery, useApiMutation, useApiInfiniteQuery } from "@shared/api/hooks/useQuery";
import {
	useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiInstance } from "../base";

export const useFollowApi = () => {
	const queryClient = useQueryClient();

	// 특정 유저 팔로우
	const useFollow = useApiMutation<
		FollowResponse, 
		{id : number}
	>( "/api/follow/:id", 
		"post", 
		'toast', 
		{urlTransform: ({ id }) => `/api/follow/${id}`,
		onMutate: async ( variables ) => {
      // 이전 상태 백업
			const previousFollow = queryClient.getQueryData<FollowResponse>(['follow', variables.id]);
      
			// Ensure previousFollow exists before spreading
			if (previousFollow) {
        // 낙관적 업데이트
				queryClient.setQueryData(['follow', variables.id], {
          ...previousFollow,
				});
			}
      
			return { previousFollow };
		},
		onError: (err, variables, context) => {
      if (context?.previousFollow) {
        // 에러시 롤백
				queryClient.setQueryData(['follow', variables.id], context.previousFollow);
			}
		}},
    "알 수 없는 오류로 인해 팔로우 실패했습니다",
	);

	// 특정 유저 언팔로우
	const useUnfollow = useApiMutation<
		FollowResponse, 
		{id : number}
	>( 
    "/api/follow/:id", 
    "delete", 
    'toast', 
    { urlTransform: ({ id }) => `/api/follow/${id}`,
		onMutate: async ( variables ) => {
      // 이전 상태 백업
			const previousFollow = queryClient.getQueryData<FollowResponse>(['follow', variables.id]);
      
			// Ensure previousFollow exists before spreading
			if (previousFollow) {
        // 낙관적 업데이트
				queryClient.setQueryData(['follow', variables.id], {
          ...previousFollow,
				});
			}
      
			return { previousFollow };
		},
		onError: (err, variables, context) => {
      if (context?.previousFollow) {
        // 에러시 롤백
				queryClient.setQueryData(['follow', variables.id], context.previousFollow);
			}
		}},
    "알 수 없는 오류로 인해 언팔로우 실패했습니다",
	);

	// // 팔로워 리스트 조회 (useQuery 버전)
	// const useFollowerList = (userId: number, params: UserFollowRequest = {
	// 	limit : 10
	// }) => {
	// 	if (!userId) {
	// 		console.log("useFollowerList 오류 : userId 존재x");
	// 	}
	// 	const endpoint = params.cursor ? `/api/users/${userId}/follower?limit=${params.limit}&cursor=${params.cursor}` 
	// 		: `/api/users/${userId}/follower?limit=${params.limit}`;
	// 	return useApiQuery<UserFollowResponse[]>(["follower", userId, params], endpoint);
	// };

	// 팔로워 리스트 조회 (cursor 기반 무한스크롤)
	const useInfiniteFollowerList = (userId: number, params: UserFollowRequest = {
		limit : 10
	}) => {
		if (!userId) {
			console.log("useFollowerList 오류 : userId 존재x");
		}
		return useApiInfiniteQuery<UserFollowResponse[]>(
			['follower', userId, params],
			`/api/users/${userId}/follower?limit=${params.limit}`,	//cursor 파라미터값은 useApiInfiniteQuery에서 자동설정됨
			(lastPage: UserFollowResponse[]) => {
				return (!lastPage || lastPage.length === 0) ? null : (lastPage.at(-1)?.followId ?? null);
			},
		);
	};

	// 팔로잉 리스트 조회 (cursor 기반 무한스크롤)
	const useInfiniteFollowingList = (userId: number, params: UserFollowRequest = {
		limit : 10
	}) => {
		if (!userId) {
			console.log("useFollowerList 오류 : userId 존재x");
		}
		return useApiInfiniteQuery<UserFollowResponse[]>(
			['following', userId, params],
			`/api/users/${userId}/following?limit=${params.limit}`,	//cursor 파라미터값은 useApiInfiniteQuery에서 자동설정됨
			(lastPage: UserFollowResponse[]) => {
				return (!lastPage || lastPage.length === 0) ? null : (lastPage.at(-1)?.followId ?? null);
			}
		);
	};

	// 팔로워 리스트 조회 (cursor 기반 무한스크롤) (초기 실행시 쿼리 자동 실행하지 않도록 설정)
	const useLazyInfiniteFollowerList = (userId: number, params: UserFollowRequest = {
		limit : 10
	}) => {
		if (!userId) {
			console.log("useFollowerList 오류 : userId 존재x");
		}

		return useInfiniteQuery<UserFollowResponse[]>({
			queryKey : ['follower', userId, params],
			queryFn: async ({ pageParam = null}) => {
				const url = `/api/users/${userId}/follower?limit=${params.limit}`;
				return pageParam 
					? await apiInstance.get<UserFollowResponse[]>(`${url}&cursor=${pageParam}`) 
					: await apiInstance.get<UserFollowResponse[]>(`${url}`);
			},
			getNextPageParam : (lastPage: UserFollowResponse[]) => {
				return (!lastPage || lastPage.length === 0) ? null : (lastPage.at(-1)?.followId ?? null);
			},
			throwOnError: true,
			initialPageParam: null,
			enabled: false, // 쿼리를 자동 실행하지 않도록 설정
		});
	}

		// 팔로잉 리스트 조회 (cursor 기반 무한스크롤) (초기 실행시 쿼리 자동 실행하지 않도록 설정)
		const useLazyInfiniteFollowingList = (userId: number, params: UserFollowRequest = {
			limit : 10
		}) => {
			if (!userId) {
				console.log("useFollowerList 오류 : userId 존재x");
			}
	
			return useInfiniteQuery<UserFollowResponse[]>({
				queryKey : ['following', userId, params],
				queryFn: async ({ pageParam = null}) => {
					const url = `/api/users/${userId}/following?limit=${params.limit}`;
					return pageParam 
						? await apiInstance.get<UserFollowResponse[]>(`${url}&cursor=${pageParam}`) 
						: await apiInstance.get<UserFollowResponse[]>(`${url}`);
				},
				getNextPageParam : (lastPage: UserFollowResponse[]) => {
					return (!lastPage || lastPage.length === 0) ? null : (lastPage.at(-1)?.followId ?? null);
				},
				throwOnError: true,
				initialPageParam: null,
				enabled: false, // 쿼리를 자동 실행하지 않도록 설정 
			});
		}

	return {
		useFollow,
		useUnfollow,
		useInfiniteFollowerList,
		useInfiniteFollowingList,
		useLazyInfiniteFollowerList,
		useLazyInfiniteFollowingList
	};
}