import request from '@/utils/request'

// 获取IM对话列表
export function getIMReply() {
	return request({
		url: '/api/message/imreply',
		options: {
			load: false
		}
	})
}
//获取消息列表
export function getMessageList(data, options) {
	return request({
		url: '/api/message',
		data,
		options: {
			load: false
		}
	})
}
//消息详情
export function getMessageDetail(id) {
	return request({
		url: `/api/message/ReadInfo/${id}`
	})
}
// 判断是否有查看消息详情权限(消息通知用)
export function checkInfo(taskOperatorId) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/${taskOperatorId}/Info`,
		method: 'get'
	})
}
