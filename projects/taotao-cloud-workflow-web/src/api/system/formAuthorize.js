import request from '@/utils/request'

// 获取列表权限列表
export function getFormAuthorizeList(moduleId, data) {
  return request({
    url: `/api/system/ModuleForm/${moduleId}/Fields`,
    method: 'GET',
    data
  })
}

// 添加字段
export function createForm(data) {
  return request({
    url: `/api/system/ModuleForm`,
    method: 'POST',
    data
  })
}

// 批量添加字段
export function batchCreateForm(data) {
  return request({
    url: `/api/system/ModuleForm/Actions/Batch`,
    method: 'POST',
    data
  })
}

// 更新字段
export function updateForm(data) {
  return request({
    url: `/api/system/ModuleForm/${data.id}`,
    method: 'PUT',
    data
  })
}

// 获取字段信息
export function getFormInfo(id) {
  return request({
    url: `/api/system/ModuleForm/${id}`,
    method: 'GET'
  })
}

// 删除字段
export function delForm(id) {
  return request({
    url: `/api/system/ModuleForm/${id}`,
    method: 'DELETE'
  })
}

// 更新字段状态
export function updateFormState(id) {
  return request({
    url: `/api/system/ModuleForm/${id}/Actions/State`,
    method: 'PUT'
  })
}