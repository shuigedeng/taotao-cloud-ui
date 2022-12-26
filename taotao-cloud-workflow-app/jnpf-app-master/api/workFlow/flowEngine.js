import request from '@/utils/request'
// 获取流程引擎列表
export function FlowEngineList(data) {
	return request({
		url: `/api/workflow/Engine/FlowEngine`,
		method: 'get',
		data
	})
}
// 获取流程引擎信息
export function FlowEngineInfo(id) {
	return request({
		url: `/api/workflow/Engine/FlowEngine/${id}`,
		method: 'get'
	})
}

//获取流程引擎分页
export function FlowEnginePageList(data) {
	return request({
		url: `/api/workflow/Engine/FlowEngine/PageListAll`,
		method: 'get',
		data,
		options: {
			load: false
		}
	})
}


// 列表ListAll
export function FlowEngineListAll() {
	return request({
		url: `/api/workflow/Engine/FlowEngine/ListAll`,
		method: 'get'
	})
}
// 流程引擎下拉框
export function FlowEngineSelector(type) {
	return request({
		url: `/api/workflow/Engine/FlowEngine/Selector`,
		method: 'get',
		data: {
			type
		}
	})
}
// 获取流程评论列表
export function getCommentList(data) {
	return request({
		url: `/api/workflow/Engine/FlowComment`,
		method: 'get',
		data
	})
}
// 新建流程评论
export function createComment(data) {
	return request({
		url: `/api/workflow/Engine/FlowComment`,
		method: 'post',
		data
	})
}
// 删除流程评论
export function delComment(id) {
	return request({
		url: `/api/workflow/Engine/FlowComment/${id}`,
		method: 'delete'
	})
}
