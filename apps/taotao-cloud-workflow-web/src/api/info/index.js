import request from "@/utils/request";

// 获取首页信息
export function getInfo(data) {
  return request({
    url: "/api/panel/info",
    method: "get",
    data,
  });
}

// 无流程位置变动页面
export function getPageList(data) {
  return request({
    url: "/api/noFlowPositionChange/page",
    method: "get",
    data,
  });
}

// 是否是issuper

export function isSuper(data) {
  return request({
    url: "/api/yiqing/riskdata/isSuper",
    method: "get",
    data,
  });
}

// 导出
export function ExportData(data) {
  return request({
    url: `/api/noFlowPositionChange/export`,
    method: "get",
    data
  });
}
// 修改预警状态 

export function changeStatus(data) {
  return request({
    url: `/api/noFlowPositionChange/status`,
    method: "post",
    data
  });
}

// 获取备注选项

export function DictionaryData(id) {
  return request({
    url: `/api/system/DictionaryData/${id}`,
    method: "get",
  });
}

// 修改备注

export function changeRemark(data) {
  return request({
    url: `/api/noFlowPositionChange/remark`,
    method: "post",
    data
  });
}

// 获取数据字典树

export function DictionaryType(id) {
  return request({
    url: `/api/system/DictionaryType`,
    method: "get",
  });
}

