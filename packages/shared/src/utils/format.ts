/**
 * 格式化工具函数集合
 * 纯函数，无副作用，可直接单元测试
 */

// ─── 日期 ─────────────────────────────────────────────────────────────────────

/**
 * 格式化日期为本地字符串
 * @example formatDate('2024-01-05') => '2024年01月05日'
 */
export function formatDate(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return '无效日期';
  }
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化为日期+时间
 * @example formatDateTime('2024-01-05T14:30:00') => '2024年01月05日 14:30'
 */
export function formatDateTime(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return '无效日期';
  }
  const datePart = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${datePart} ${hours}:${minutes}`;
}

/**
 * 相对时间（几分钟前、几小时前）
 * @example formatRelativeTime(Date.now() - 60000) => '1分钟前'
 */
export function formatRelativeTime(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return '无效日期';
  }

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return '刚刚';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  return formatDate(date);
}

// ─── 金额 ─────────────────────────────────────────────────────────────────────

/**
 * 格式化人民币金额
 * @example formatCurrency(1234.5) => '¥1,234.50'
 */
export function formatCurrency(
  amount: number,
  currency = '¥',
  decimals = 2,
): string {
  if (!isFinite(amount)) {
    return `${currency}0.00`;
  }
  const formatted = Math.abs(amount)
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return amount < 0 ? `-${currency}${formatted}` : `${currency}${formatted}`;
}

/**
 * 大数字缩略显示
 * @example formatCompactNumber(12345) => '1.2万'
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_0000_0000) {
    return `${(num / 1_0000_0000).toFixed(1)}亿`;
  }
  if (num >= 1_0000) {
    return `${(num / 1_0000).toFixed(1)}万`;
  }
  return String(num);
}

// ─── 手机号 / 身份证 ──────────────────────────────────────────────────────────

/**
 * 手机号脱敏
 * @example maskPhone('13800138000') => '138****8000'
 */
export function maskPhone(phone: string): string {
  if (!/^\d{11}$/.test(phone)) {
    return phone;
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 格式化手机号（添加空格）
 * @example formatPhone('13800138000') => '138 0013 8000'
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 11) {
    return phone;
  }
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
}

/**
 * 身份证号脱敏
 * @example maskIdCard('110101199001011234') => '110101********1234'
 */
export function maskIdCard(idCard: string): string {
  if (idCard.length !== 18) {
    return idCard;
  }
  return idCard.replace(/^(.{6})(.{8})(.{4})$/, '$1********$3');
}

// ─── 字符串 ───────────────────────────────────────────────────────────────────

/**
 * 截断超长字符串并添加省略号
 * @example truncate('这是一段很长的文字', 5) => '这是一段很...'
 */
export function truncate(
  str: string,
  maxLength: number,
  ellipsis = '...',
): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + ellipsis;
}

/**
 * 首字母大写
 * @example capitalize('hello world') => 'Hello world'
 */
export function capitalize(str: string): string {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 文件大小格式化
 * @example formatFileSize(1536) => '1.5 KB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 ** 3) {
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  }
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}
