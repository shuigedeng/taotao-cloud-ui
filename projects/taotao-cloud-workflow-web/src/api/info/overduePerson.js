import request from "@/utils/request";

// 列表
export function getPageList(data) {
  return request({
    url: "/api/noReturnStaff/page",
    method: "get",
    data,
  });
}

// 导出
export function ExportData(data) {
  return request({
    url: "/api/noReturnStaff/export",
    method: "get",
    data
  });
}

// 修改状态 

export function changeStatus(data) {
  return request({
    url: `/api/noReturnStaff/status`,
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
    url: `/api/noReturnStaff/remark`,
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
