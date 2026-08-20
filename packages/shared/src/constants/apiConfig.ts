// 替换为实际的后端 API 地址
export const API_BASE_URL = 'http://58.221.250.47:9443/api/app';
// export const API_BASE_URL = 'http://172.168.8.69:8002/api/app';
// export const API_BASE_URL = 'http://172.168.8.69:8002/api/app';

// 请求超时时间（毫秒）
export const API_TIMEOUT = 60_000;

// 失败重试次数
export const API_RETRY_COUNT = 3;

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
