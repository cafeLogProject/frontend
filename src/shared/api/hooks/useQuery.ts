import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions, type QueryKey } from '@tanstack/react-query'
import { apiInstance } from '@shared/api/base'
import type { AxiosError } from 'axios'

export type ApiError = {
  message: string
  status?: number
  data?: any
}

export const useApiQuery = <TData>(
  queryKey: QueryKey,
  endpoint: string,
  options?: UseQueryOptions<TData, ApiError>
) => {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn: async () => {
      const response = await apiInstance.get<TData>(endpoint)
      return response
    },
    ...options,
  })
}

export const useApiMutation = <TData, TVariables>(
  url: string,
  method: string,
  options?: {
    urlTransform?: (variables: TVariables) => string;
    onMutate?: (variables: TVariables) => Promise<any>;
    onError?: (error: any, variables: TVariables, context: any) => void;
  }
) => {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const transformedUrl = options?.urlTransform 
        ? options.urlTransform(variables) 
        : url;
      const response = await apiInstance[method]<TData>(transformedUrl, variables)
      return response
    },
  });
};
