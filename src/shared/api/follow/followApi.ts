import { FollowRes } from "./types";
import { useApiQuery, useApiMutation } from "@shared/api/hooks/useQuery";
import { useQueryClient } from "@tanstack/react-query";

export const useFollowApi = () => {
	const queryClient = useQueryClient();

	// 특정 유저 팔로우
	const useFollow = useApiMutation<
		FollowRes, 
		{id : number}
	>( "/api/follow/:id", "post", {
		urlTransform: ({ id }) => `/api/follow/${id}`,
		onMutate: async ({ id }) => {
			// 이전 상태 백업
			const previousFollow = queryClient.getQueryData<FollowRes>(['follow', id]);

			// Ensure previousFollow exists before spreading
			if (previousFollow) {
				// 낙관적 업데이트
				queryClient.setQueryData(['follow', id], {
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
	};
}