import request from '@/utils/request'

// 获取列表
export function getList(data) {
  return request({
    url: '/api/system/MessageTemplate',
    method: 'get',
    data
  })
}
// 获取详情
export function getInfo(id) {
  return request({
    url: `/api/system/MessageTemplate/${id}`,
    method: 'get'
  })
}
// 删除
export function Delete(id) {
  return request({
    url: `/api/system/MessageTemplate/${id}`,
    method: 'DELETE'
  })
}
// 修改
export function Update(data) {
  return request({
    url: `/api/system/MessageTemplate/${data.id}`,
    method: 'PUT',
    data
  })
}
// 新建
export function Create(data) {
  return request({
    url: '/api/system/MessageTemplate',
    method: 'post',
    data
  })
}
// 获取消息模板参数
export function getTemplateParams(id) {
  return request({
    url: `/api/system/MessageTemplate/getTemplate/${id}`,
    method: 'get'
  })
}
// 获取下拉框列表
export function getSelector(data) {
  return request({
    url: '/api/system/MessageTemplate/Selector',
    method: 'GET',
    data
  })
}
// 更新状态
export function setState(id) {
  return request({
    url: `/api/system/MessageTemplate/${id}/Actions/State`,
    method: 'PUT'
  })
}