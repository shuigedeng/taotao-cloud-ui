import request from '@/utils/request'

// 更新当前用户头像
export function UpdateAvatar(name) {
  return request({
    url: `/api/permission/Users/Current/Avatar/${name}`,
    method: 'PUT'
  })
}
// 获取当前用户个人资料
export function UserSettingInfo() {
  return request({
    url: '/api/permission/Users/Current/BaseInfo',
    method: 'GET'
  })
}
// 更新当前用户个人资料
export function UpdateUser(data) {
  return request({
    url: '/api/permission/Users/Current/BaseInfo',
    method: 'PUT',
    data
  })
}
// 修改当前用户密码
export function UpdatePassword(data) {
  return request({
    url: '/api/permission/Users/Current/Actions/ModifyPassword',
    method: 'POST',
    data
  })
}
// 更新当前用户系统主题
export function UpdateTheme(data) {
  return request({
    url: '/api/permission/Users/Current/SystemTheme',
    method: 'PUT',
    data
  })
}
// 更新当前用户系统语言配置
export function UpdateLanguage(data) {
  return request({
    url: `/api/permission/Users/Current/SystemLanguage`,
    method: 'PUT',
    data
  })
}
// 获取我的下属
export function getSubordinate(id) {
  return request({
    url: `/api/permission/Users/Current/Subordinate/${id?id:'0'}`,
    method: 'GET'
  })
}
// 获取当前用户系统权限
export function AuthorizeList() {
  return request({
    url: '/api/permission/Users/Current/Authorize',
    method: 'GET'
  })
}
// 获取系统日志
export function LogList(data) {
  return request({
    url: `/api/permission/Users/Current/SystemLog`,
    method: 'GET',
    data
  })
}
// 获取当前用户所有组织
export function getUserOrganizes(data) {
  return request({
    url: `/api/permission/Users/Current/getUserOrganizes`,
    method: 'GET',
    data
  })
}
// 获取当前用户所有岗位
export function getUserPositions(data) {
  return request({
    url: `/api/permission/Users/Current/getUserPositions`,
    method: 'GET',
    data
  })
}
// 获取当前用户所有角色
export function getUserRoles(data) {
  return request({
    url: `/api/permission/Users/Current/getUserRoles`,
    method: 'GET',
    data
  })
}
// 设置主要组织、主要岗位
export function setMajor(data) {
  return request({
    url: `/api/permission/Users/Current/major`,
    method: 'put',
    data
  })
}