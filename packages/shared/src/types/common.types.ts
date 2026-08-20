// ─── API 通用响应结构 ──────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  code: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// ─── 用户 ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── 通用工具类型 ──────────────────────────────────────────────────────────────

/** 将对象所有字段变为可选（深度） */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** 提取 Promise 的返回类型 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/** 键值对 */
export type KeyValue<V = string> = Record<string, V>;

/** 带 id 的列表项 */
export interface Identifiable {
  id: string;
}

/** 请求状态 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
}
