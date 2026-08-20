// ─── 登录 ────────────────────────────────────────────────────────────────────

export interface LoginParams {
  username: string;
  password: string;
  [key: string]: unknown;
}

export interface LoginResult {
  token: string;
  refreshToken?: string;
  [key: string]: unknown;
}

// ─── 用户 ────────────────────────────────────────────────────────────────────

export interface UserInfo {
  id: string;
  name: string;
  realStatus?: number; // 1-未实名 2-实名中 3-已实名 4-实名失败
  [key: string]: unknown;
}

// ─── 字典 ────────────────────────────────────────────────────────────────────

export interface DictItem {
  dictLabel: string;
  dictValue: string | number;
  children?: DictItem[];
  [key: string]: unknown;
}

// ─── 菜单 ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  name: string;
  path?: string;
  children?: MenuItem[];
  [key: string]: unknown;
}

// ─── 分页 ────────────────────────────────────────────────────────────────────

export interface PaginatedParams {
  pageNumber: number;
  pageSize: number;
  [key: string]: unknown;
}

// ─── 版本 ────────────────────────────────────────────────────────────────────

export interface AppVersion {
  versionCode: number;
  versionName: string;
  downloadUrl?: string;
  [key: string]: unknown;
}

// ─── 用户状态 ─────────────────────────────────────────────────────────────────

export interface UserStatus {
  id: string;
  status: number;
  [key: string]: unknown;
}

// ─── 上传 ────────────────────────────────────────────────────────────────────

export interface UploadResult {
  fileId: string;
  fileUrl: string;
  [key: string]: unknown;
}

// ─── 企业 ────────────────────────────────────────────────────────────────────

export interface CompanySelectItem {
  id?: string | number;
  companyName?: string;
  licenseNumber?: string;
  [key: string]: unknown;
}
