import { FollowRes } from "./types";
import { useApiQuery, useApiMutation } from "@shared/api/hooks/useQuery";
import {
  useQueryClient,
} from "@tanstack/react-query";

export const useFollowApi = () => {
	const queryClient = useQueryClient();

	// 특정 유저 팔로우
	const useFollow = useApiMutation<
		FollowRes, 
		{id : number}
	>( "/api/follow/:id", "post", {
		urlTransform: ({ id }) => `/api/follow/${id}`,
		onMutate: async ( variables ) => {
			// 이전 상태 백업
			const previousFollow = queryClient.getQueryData<FollowRes>(['follow', variables.id]);

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
		FollowRes, 
		{id : number}
	>( "/api/follow/:id", "delete", {
		urlTransform: ({ id }) => `/api/follow/${id}`,
		onMutate: async ( variables ) => {
			// 이전 상태 백업
			const previousFollow = queryClient.getQueryData<FollowRes>(['follow', variables.id]);

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

	return {
		useFollow,
		useUnfollow,
	};
}