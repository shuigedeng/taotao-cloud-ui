import type { ApiResponse } from '../types/common.types'

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  params?: Record<string, unknown>
  noLoading?: boolean
  signal?: AbortSignal
  onUploadProgress?: (progressEvent: any) => void
}

export interface HttpClient {
  get<T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>>
  post<T>(path: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>
  put<T>(path: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>
  delete<T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>>
}
