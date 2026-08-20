import request from '@/utils/request'

// 获取菜单列表
export const getMenuList = (data) => {
  return request({
    url: '/api/system/Menu',
    method: 'GET',
    data
  })
}

// 获取上级菜单下拉框
export const getMenuSelector = (data, id) => {
  return request({
    url: '/api/system/Menu/Selector/' + (!!id ? id : 0),
    method: 'GET',
    data
  })
}
// 获取菜单列表（下拉框）
export const getSelectorAll = data => {
  return request({
    url: '/api/system/Menu/Selector/All',
    method: 'GET',
    data
  })
}

// 添加菜单
export const createMenu = (data) => {
  return request({
    url: '/api/system/Menu',
    method: 'POST',
    data
  })
}

// 修改菜单
export const updateMenu = (data) => {
  return request({
    url: `/api/system/Menu/${data.id}`,
    method: 'PUT',
    data
  })
}

// 获取菜单信息
export const getMenuInfo = (id) => {
  return request({
    url: `/api/system/Menu/${id}`,
    method: 'GET'
  })
}

// 删除菜单
export const delMenu = (id) => {
  return request({
    url: `/api/system/Menu/${id}`,
    method: 'DELETE'
  })
}

// 更新菜单状态
export const updateMenuState = (id) => {
  return request({
    url: `/api/system/Menu/${id}/Actions/State`,
    method: 'PUT'
  })
}

//获取菜单分类
export const getMenuType = () => {
  return request({
    url: `/api/system/DictionaryData/e3ca5fe13c484a74bf0a4ea69eec1afd/Data/Selector`,
    method: 'GET'
  })
}

// 导出系统菜单数据
export const exportMenu = id => {
  return request({
    url: `/api/system/Menu/${id}/Action/Export`,
    method: 'GET'
  })
}