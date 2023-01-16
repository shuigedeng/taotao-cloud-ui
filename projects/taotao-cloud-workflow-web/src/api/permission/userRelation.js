import request from '@/utils/request'

// 获取岗位/角色成员列表
export const getUserRelationList = (objectId) => {
  return request({
    url: `/api/permission/UserRelation/${objectId}`,
    method: 'GET'
  })
}


// 添加/更新岗位或角色成员
export const createUserRelation = (data) => {
  return request({
    url: `/api/permission/UserRelation/${data.objectId}`,
    method: 'POST',
    data
  })
}
