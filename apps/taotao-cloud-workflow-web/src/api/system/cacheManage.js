import request from '@/utils/request'

export function CacheManageClear(name) {
  return request({
    url: `/api/system/CacheManage/${name}`,
    method: 'delete',
  })
}
export function CacheManageClearAll() {
  return request({
    url: '/api/system/CacheManage/Actions/ClearAll',
    method: 'post',
  })
}
export function CacheManageInfo(name) {
  return request({
    url: `/api/system/CacheManage/${name}`,
    method: 'get',
  })
}
export function CacheManageList(data) {
  return request({
    url: '/api/system/CacheManage',
    method: 'get',
    data
  })
}
