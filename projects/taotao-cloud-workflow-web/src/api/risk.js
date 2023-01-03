import request from "@/utils/request";

// 列表
export const getList = data => {
  return request({
    url: "/api/yiqing/riskdata/reportedPage",
    method: "GET",
    data
  });
};
// 未上报列表
export const getunList = data => {
  return request({
    url: "/api/yiqing/riskdata/notReportedPage",
    method: "GET",
    data
  });
};
// 导出
export function exportData(data) {
  return request({
    url: `/api/yiqing/riskdata/reportedPage/exportData`,
    method: "get",
    data
  });
}
// 未上报导出
export function unexportData(data) {
  return request({
    url: `/api/yiqing/riskdata/notReportedPage/exportData`,
    method: "get",
    data
  });
}
