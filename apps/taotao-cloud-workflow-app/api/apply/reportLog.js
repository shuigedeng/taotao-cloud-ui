import request from '@/utils/request'
//获取我发出的日志
export function getSendList(data, options) {
	return request({
		url: `/api/extend/WorkLog/Send`,
		method: 'GET',
		data,
		options
	})
}
//获取收到的日志
export function getReceiveList(data, options) {
	return request({
		url: `/api/extend/WorkLog/Receive`,
		method: 'GET',
		data,
		options
	})
}
//日志info
export function getLogInfo(id) {
	return request({
		url: `/api/extend/WorkLog/${id}`,
		method: 'GET',
	})
}
//日志保存
export function createLog(data) {
	return request({
		url: `/api/extend/WorkLog`,
		method: 'POST',
		data
	})
}
//日志修改
export function updateLog(data) {
	return request({
		url: `/api/extend/WorkLog/${data.id}`,
		method: 'PUT',
		data
	})
}
//日志删除
export function delLog(id) {
	return request({
		url: `/api/extend/WorkLog/${id}`,
		method: 'DELETE'
	})
}
