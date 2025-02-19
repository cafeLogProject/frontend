import { FollowResponse,
	UserFollowRequest,
	UserFollowResponse,
} from "./types";
import { useApiQuery, useApiMutation } from "@shared/api/hooks/useQuery";
import {
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

	// 팔로워 리스트 조회
	const useFollowerList = (userId: number, params: UserFollowRequest = {
		limit : 10
	}) => {
		if (!userId) {
			console.log("useFollowerList 오류 : userId 존재x");
		}
		const endpoint = params.cursor ? `/api/users/${userId}/follower?limit=${params.limit}&cursor=${params.cursor}` 
			: `/api/users/${userId}/follower?limit=${params.limit}`;
		return useApiQuery<UserFollowResponse[]>(["follower", userId, params], endpoint);
	};

	// 팔로잉 리스트 조회
	const useFollowingList = (userId: number, params: UserFollowRequest = {
		limit : 10
	}) => {
		if (!userId) {
			console.log("useFollowerList 오류 : userId 존재x");
		}
		const endpoint = params.cursor ? `/api/users/${userId}/following?limit=${params.limit}&cursor=${params.cursor}` 
			: `/api/users/${userId}/following?limit=${params.limit}`;
		return useApiQuery<UserFollowResponse[]>(["following", userId, params], endpoint);
	};

	return {
		useFollow,
		useUnfollow,
		useFollowerList,
		useFollowingList,
	};
}