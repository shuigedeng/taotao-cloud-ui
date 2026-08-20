import request from '@/utils/request'

// 获取任务调度列表
export function TimeTaskList(data) {
  return request({
    url: '/api/scheduletask',
    method: 'get',
    data
  })
}
// 启动任务调度
export function TimeTaskEnable(id) {
  return request({
    url: `/api/scheduletask/${id}/Actions/Enable`,
    method: 'put',
  })
}
// 停止任务调度
export function TimeTaskStop(id) {
  return request({
    url: `/api/scheduletask/${id}/Actions/Stop`,
    method: 'put',
  })
}
// 删除任务
export function TimeTaskDelete(id) {
  return request({
    url: `/api/scheduletask/${id}`,
    method: 'DELETE',
  })
}
//  获取任务调度信息
export function TimeTaskInfo(id) {
  return request({
    url: `/api/scheduletask/Info/${id}`,
    method: 'get',
  })
}
// 获取任务调度日志列表
export function TimeTaskTaskLogList(id, data) {
  return request({
    url: `/api/scheduletask/${id}/TaskLog`,
    method: 'get',
    data
  })
}
// 新建任务调度
export function TimeTaskCreate(data) {
  return request({
    url: '/api/scheduletask',
    method: 'post',
    data
  })
}
// 修改任务调度
export function TimeTaskUpdate(data) {
  return request({
    url: `/api/scheduletask/${data.id}`,
    method: 'PUT',
    data
  })
}
// 获取本地任务下拉列表
export function getTaskMethods() {
  return request({
    url: `/api/scheduletask/TaskMethods`,
    method: 'get'
  })
}