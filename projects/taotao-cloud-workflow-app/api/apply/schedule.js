import request from '@/utils/request'
/* 获取日程初始值 */
export function getScheduleList(data) {
	return request({
		url: `/api/extend/Schedule/AppList`,
		method: 'GET',
		data
	})
}
//日程info
export function getScheduleInfo(id) {
	return request({
		url: `/api/extend/Schedule/${id}`,
		method: 'GET',
	})
}
//日程保存
export function create(data) {
	return request({
		url: `/api/extend/Schedule`,
		method: 'POST',
		data
	})
}
//日程修改
export function update(data) {
	return request({
		url: `/api/extend/Schedule/${data.id}`,
		method: 'PUT',
		data
	})
}
//日程删除
export function delSchedule(id) {
	return request({
		url: `/api/extend/Schedule/${id}`,
		method: 'Delete',
	})
}
