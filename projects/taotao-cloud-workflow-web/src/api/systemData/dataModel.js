import request from '@/utils/request'

// 获取数据库表列表
export function DataModelList(id, data) {
  return request({
    url: `/api/system/DataModel/${id}/Tables`,
    method: 'get',
    data
  })
}
// 添加数据表
export function DataModelCreate(linkId, data) {
  return request({
    url: `/api/system/DataModel/${linkId}/Table`,
    method: 'post',
    data
  })
}
// 预览数据库表
export function DataModelData(linkId, table, data) {
  return request({
    url: `/api/system/DataModel/${linkId}/Table/${table}/Preview`,
    method: 'get',
    data
  })
}
// 删除数据表
export function DataModelDelete(linkId, id) {
  return request({
    url: `/api/system/DataModel/${linkId}/Table/${id}`,
    method: 'delete',
  })
}
// 获取数据库表字段列表
export function DataModelFieldList(linkId, table, type) {
  return request({
    url: `/api/system/DataModel/${linkId}/Tables/${table}/Fields?type=${type}`,
    method: 'get'
  })
}
//  获取数据表
export function DataModelInfo(linkId, id) {
  return request({
    url: `/api/system/DataModel/${linkId}/Table/${id}`,
    method: 'get',
  })
}
// 修改数据表
export function DataModelUpdate(linkId, data) {
  return request({
    url: `/api/system/DataModel/${linkId}/Table`,
    method: 'put',
    data
  })
}
// 导出
export function exportTpl(linkId, id) {
  return request({
    url: `/api/system/DataModel/${linkId}/Table/${id}/Action/Export`,
    method: 'get'
  })
}