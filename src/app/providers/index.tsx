import { FC } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface IProviders {
    readonly children: JSX.Element
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // 항상 fresh한 데이터 요청
      gcTime: 0, // 캐시 사용하지 않음 (previously cacheTime)
      retry: 1,
      refetchOnMount: true, // 컴포넌트 마운트마다 새로운 데이터 요청
      refetchOnWindowFocus: true, // 윈도우 포커스시 새로운 데이터 요청
    },
  },
})

export const Providers: FC<IProviders> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
