import { FollowResponse,
	UserFollowRequest,
	UserFollowResponse,
} from "./types";
import { useApiQuery, useApiMutation, useApiInfiniteQuery } from "@shared/api/hooks/useQuery";
import {
	useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useFollowApi = () => {
	const queryClient = useQueryClient();

	// 특정 유저 팔로우
	const useFollow = useApiMutation<
		FollowResponse, 
		{id : number}
	>( "/api/follow/:id", "post", {
		urlTransform: ({ id }) => `/api/follow/${id}`,
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
		}
	});

	// 특정 유저 언팔로우
	const useUnfollow = useApiMutation<
		FollowResponse, 
		{id : number}
	>( "/api/follow/:id", "delete", {
		urlTransform: ({ id }) => `/api/follow/${id}`,
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
		}
	});

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
	const useFollowerList = (userId: number, params: UserFollowRequest = {
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
			}
		);
	};

	// 팔로잉 리스트 조회 (cursor 기반 무한스크롤)
	const useFollowingList = (userId: number, params: UserFollowRequest = {
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

	return {
		useFollow,
		useUnfollow,
		useFollowerList,
		useFollowingList,
	};
}