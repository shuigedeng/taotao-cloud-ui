import request from '@/utils/request'

// 获取按钮权限列表
export function getButtonAuthorizeList(moduleId, data) {
  return request({
    url: `/api/system/ModuleButton/${moduleId}/List`,
    method: 'GET',
    data
  })
}

// 获取按钮权限下拉列表
export function getButtonAuthorizeSelector(moduleId) {
  return request({
    url: `/api/system/ModuleButton/${moduleId}/Selector`,
    method: 'GET'
  })
}

// 添加按钮
export function createButton(data) {
  return request({
    url: `/api/system/ModuleButton`,
    method: 'POST',
    data
  })
}

// 更新按钮
export function updateButton(data) {
  return request({
    url: `/api/system/ModuleButton/${data.id}`,
    method: 'PUT',
    data
  })
}

// 获取按钮信息
export function getButtonInfo(id) {
  return request({
    url: `/api/system/ModuleButton/${id}`,
    method: 'GET'
  })
}


// 删除按钮
export function delButton(id) {
  return request({
    url: `/api/system/ModuleButton/${id}`,
    method: 'DELETE'
  })
}

// 更新按钮状态
export function updateButtonState(id) {
  return request({
    url: `/api/system/ModuleButton/${id}/Actions/State`,
    method: 'PUT'
  })
}

