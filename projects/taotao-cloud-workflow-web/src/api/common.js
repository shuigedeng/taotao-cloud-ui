import request from '@/utils/request'

// 获取下载文件链接
export function getDownloadUrl(type, fileName) {
  return request({
    url: `/api/file/Download/${type}/${fileName}`,
    method: 'get'
  })
}
// 预览文件
export function PreviewFile(data) {
  return request({
    url: `/api/file/Uploader/Preview`,
    method: 'get',
    data
  })
}
// 获取列设置
export const getColumnsByModuleId = (moduleId) => {
  return request({
    url: `/api/permission/Authority/GetColumnsByModuleId/${moduleId}`,
    method: 'GET'
  })
}
// 设置列设置
export const setColumnsByModuleId = (data) => {
  return request({
    url: `/api/permission/Authority/SetColumnsByModuleId`,
    method: 'PUT',
    data
  })
}