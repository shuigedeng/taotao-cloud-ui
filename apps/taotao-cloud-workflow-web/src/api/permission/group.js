import request from '@/utils/request'

// 获取分组列表
export const getGroupList = (data) => {
  return request({
    url: '/api/permission/Group',
    method: 'GET',
    data
  })
}

// 获取分组下拉框列表
export const getGroupSelector = () => {
  return request({
    url: '/api/permission/Group/Selector',
    method: 'GET'
  })
}

// 新建分组
export const createGroup = (data) => {
  return request({
    url: '/api/permission/Group',
    method: 'POST',
    data
  })
}

// 修改分组
export const updateGroup = (data) => {
  return request({
    url: `/api/permission/Group/${data.id}`,
    method: 'PUT',
    data
  })
}

// 获取分组信息
export const getGroupInfo = (id) => {
  return request({
    url: `/api/permission/Group/${id}`,
    method: 'GET'
  })
}

// 删除分组
export const delGroup = (id) => {
  return request({
    url: `/api/permission/Group/${id}`,
    method: 'DELETE'
  })
}