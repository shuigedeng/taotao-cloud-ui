import request from '@/utils/request'

// 获取系统日志信息
export function getLogList(id, data) {
  return request({
    url: `/api/system/Log/${id}`,
    method: 'GET',
    data
  })
}
// 删除或批量删除日志
export function delLog(data) {
  return request({
    url: '/api/system/Log',
    method: 'DELETE',
    data
  })
}
// 一键清空
export function batchDelLog(type) {
  return request({
    url: `/api/system/Log/${type}`,
    method: 'DELETE'
  })
}