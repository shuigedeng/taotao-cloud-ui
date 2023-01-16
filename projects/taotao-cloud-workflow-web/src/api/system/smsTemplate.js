import request from '@/utils/request'

// 获取列表
export function getList(data) {
  return request({
    url: '/api/system/SmsTemplate',
    method: 'get',
    data
  })
}
// 获取详情
export function getInfo(id) {
  return request({
    url: `/api/system/SmsTemplate/${id}`,
    method: 'get'
  })
}
// 删除
export function Delete(id) {
  return request({
    url: `/api/system/SmsTemplate/${id}`,
    method: 'DELETE'
  })
}
// 修改
export function Update(data) {
  return request({
    url: `/api/system/SmsTemplate/${data.id}`,
    method: 'PUT',
    data
  })
}
// 新建
export function Create(data) {
  return request({
    url: '/api/system/SmsTemplate',
    method: 'post',
    data
  })
}
// 获取模板参数
export function getTemplate(data) {
  return request({
    url: `/api/system/SmsTemplate/getTemplate`,
    method: 'POST',
    data
  })
}
// 获取指定短信模板参数
export function getTemplateParams(id) {
  return request({
    url: `/api/system/SmsTemplate/getTemplate/${id}`,
    method: 'get'
  })
}
// 获取下拉框列表
export function getSelector(data) {
  return request({
    url: '/api/system/SmsTemplate/Selector',
    method: 'GET',
    data
  })
}
// 更新状态
export function setState(id) {
  return request({
    url: `/api/system/SmsTemplate/${id}/Actions/State`,
    method: 'PUT'
  })
}
// 发送测试短信
export function testSent(data) {
  return request({
    url: `/api/system/SmsTemplate/testSent`,
    method: 'post',
    data
  })
}