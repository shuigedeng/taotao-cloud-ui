import request from '@/utils/request'

// 获取组织/公司列表
export const getOrganizeList = (data) => {
  return request({
    url: '/api/permission/Organize',
    method: 'GET',
    data
  })
}

// 获取组织/公司下拉框列表
export const getOrganizeSelector = (id) => {
  return request({
    url: '/api/permission/Organize/Selector/' + (!!id ? id : 0),
    method: 'GET'
  })
}

// 获取组织/公司树形
export const getOrganizeTree = () => {
  return request({
    url: '/api/permission/Organize/Tree',
    method: 'GET'
  })
}

// 新建组织/公司
export const createOrganize = (data) => {
  return request({
    url: '/api/permission/Organize',
    method: 'POST',
    data
  })
}

// 修改组织/公司
export const updateOrganize = (data) => {
  return request({
    url: `/api/permission/Organize/${data.id}`,
    method: 'PUT',
    data
  })
}

// 获取组织/公司信息
export const getOrganizeInfo = (id) => {
  return request({
    url: `/api/permission/Organize/${id}`,
    method: 'GET'
  })
}

// 删除组织/公司
export const delOrganize = (id) => {
  return request({
    url: `/api/permission/Organize/${id}`,
    method: 'DELETE'
  })
}

// 更新组织/公司状态
export const updateOrganizeState = (id) => {
  return request({
    url: `/api/permission/Organize/${id}/Actions/State`,
    method: 'PUT'
  })
}
// 获取分级管理
export const getOrganizeTrator = (organizeId) => {
  return request({
    url: `/api/permission/organizeAdminIsTrator/${organizeId}`,
    method: 'get'
  })
}
// 更新分级管理
export const setOrganizeTrator = (data) => {
  return request({
    url: `/api/permission/organizeAdminIsTrator/${data.organizeId}`,
    method: 'PUT',
    data
  })
}
// 导出用户信息
export const getUserExcel = (companyId) => {
  return request({
    url: `/api/permission/Users/ExportUserExcel?companyId=${companyId}&type=2`,
    method: 'get'
  })
}
// 查询当前用户是否是角色(发布公告）
export const isReleaseMessage = () => {
  return request({
    url: `/api/yiqing/riskdata/isReleaseMessage`,
    method: 'get'
  })
}
