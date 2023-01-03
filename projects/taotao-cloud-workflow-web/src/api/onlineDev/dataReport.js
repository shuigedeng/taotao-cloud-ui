import { reportServer } from '@/utils/define'
import request from '@/utils/request'

// 获取报表列表
export const getDataReportList = data => {
  return request({
    url: reportServer + '/api/datareport/Data',
    method: 'GET',
    data
  })
}
// 获取报表下拉列表
export const getDataReportSelector = () => {
  return request({
    url: reportServer + '/api/datareport/Data/Selector',
    method: 'GET'
  })
}
// 删除报表
export const delDataReport = id => {
  return request({
    url: `${reportServer}/api/datareport/Data/${id}`,
    method: 'delete'
  })
}
// 复制报表
export const copyDataReport = id => {
  return request({
    url: `${reportServer}/api/datareport/Data/Copy/${id}`,
    method: 'post'
  })
}