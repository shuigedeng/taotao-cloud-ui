import request from "@/utils/request";

// 导出
export function ExportData(data) {
  return request({
    url: `/api/employeeExceptionsReport/noReport/export`,
    method: "get",
    data,
  });
}
// 列表
export function getPageList(data) {
  return request({
    url: "/api/employeeExceptionsReport/noReport/page",
    method: "get",
    data,
  });
}
