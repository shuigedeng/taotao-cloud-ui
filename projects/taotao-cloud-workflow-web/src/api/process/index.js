import request from "@/utils/request";

// 离开流程》列表
export function getLeavePageList(data) {
  return request({
    url: "/api/shuigedengFlowTask/leave/page",
    method: "get",
    data,
  });
}

// 离开流程》导出
export function leaveExportData(data) {
  return request({
    url: "/api/shuigedengFlowTask/leave/export",
    method: "get",
    data,
  });
}

// 返回流程》列表
export function getReturnPageList(data) {
    return request({
      url: "/api/shuigedengFlowTask/return/page",
      method: "get",
      data,
    });
  }

  // 返回流程》导出
  export function returnExportData(data) {
    return request({
      url: "/api/shuigedengFlowTask/return/export",
      method: "get",
      data,
    });
  }
