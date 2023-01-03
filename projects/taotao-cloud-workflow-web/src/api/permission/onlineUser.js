import request from '@/utils/request'

// 获取在线用户列表
export const getOnlineUser = (data) => {
  return request({
    url: '/api/system/OnlineUser',
    method: 'GET',
    data
  })
}
// 批量强制下线
export const batchDelOnlineUser = (ids) => {
  return request({
    url: '/api/system/OnlineUser',
    method: 'DELETE',
    data: { ids }
  })
}
// 强制下线
export const deleteOnlineUser = (id) => {
  return request({
    url: `/api/system/OnlineUser/${id}`,
    method: 'DELETE'
  })
}