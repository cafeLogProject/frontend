import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions, type QueryKey, useInfiniteQuery, UseSuspenseQueryOptions, useSuspenseQuery } from '@tanstack/react-query'
// import { useMutation, useSuspenseQuery, type UseMutationOptions, type UseSuspenseQueryOptions, type QueryKey } from '@tanstack/react-query'
import { apiInstance } from '@shared/api/base'
import type { AxiosError } from 'axios'
import { UseApiOptions } from './useApi'
import Toast from '@/shared/ui/toast/Toast'
import { toast } from 'react-toastify'
import { showErrorToast } from '@/shared/ui/toast/CustomToast'

export type ApiError = {
  message: string
  status?: number
  data?: any
}

export const useApiQuery = <TData, ApiError>(
  queryKey: QueryKey,
  endpoint: string | (() => string),
  options?: UseQueryOptions<TData, ApiError>,
) => {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn: async () => {
      const url = typeof endpoint === "function" ? endpoint() : endpoint;
      const response = await apiInstance.get<TData>(url);
      return response
    },
    throwOnError: true,
    ...options,
  })
}

export const useApiSuspenseQuery = <TData>(
  queryKey: QueryKey,
  endpoint: string | (() => string),
  options?: UseSuspenseQueryOptions<TData, ApiError>
) => {
  return useSuspenseQuery<TData, ApiError>({
    queryKey,
    queryFn: async () => {
      const url = typeof endpoint === "function" ? endpoint() : endpoint;
      const response = await apiInstance.get<TData>(url);
      return response
    },
    ...options,
  })
}

export const useApiMutation = <TData, TVariables>(
  url: string,
  method: string,
  errorHandling: 'toast' | 'fallback', 
  options?: {
    urlTransform?: (variables: TVariables) => string;
    onMutate?: (variables: TVariables) => Promise<any>;
    onError?: (error: any, variables: TVariables, context: any) => void;
  },
  toastErrorMsg?: string,
) => {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const transformedUrl = options?.urlTransform 
        ? options.urlTransform(variables) 
        : url;
      const response = await apiInstance[method]<TData>(transformedUrl, variables)
      return response
    },
    onError: (error, variables, context) => {
      if (errorHandling === 'toast') {
        showErrorToast(toastErrorMsg);
      } else {
        throw error;  // 에러 바운더리로 넘김
      }
      options?.onError?.(error, variables, context)  // options.onError가 있다면 실행
    }
  });
};


export const useApiInfiniteQuery = <TData>(
  queryKey: QueryKey,
  endpoint: string | (() => string),
  getNextPageParam: (lastPage: any, allPages: any) => number | null
) => {
  return useInfiniteQuery<TData>({
    queryKey,
    queryFn: async ({ pageParam = null}) => {
      const url = typeof endpoint === "function" ? endpoint() : endpoint;
      const response =  pageParam 
        ? await apiInstance.get<TData>(`${url}&cursor=${pageParam}`) 
        : await apiInstance.get<TData>(`${url}`);
      return response;
    },
    throwOnError: true,
    getNextPageParam,
    initialPageParam: null,
  });
};