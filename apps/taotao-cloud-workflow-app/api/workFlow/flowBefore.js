import request from '@/utils/request'

// 获取待我审核
export function FlowBeforeList(category, data, options) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/List/${category}`,
		method: 'get',
		data,
		options: {
			load: false
		}
	})
}
// 获取待我审批信息
export function FlowBeforeInfo(id, data) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/${id}`,
		method: 'get',
		data
	})
}
// 待我审核审核
export function Audit(id, data) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/Audit/${id}`,
		method: 'post',
		data
	})
}
// 待我审核驳回
export function Reject(id, data) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/Reject/${id}`,
		method: 'post',
		data
	})
}
// 撤回审核
export function Recall(id, data) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/Recall/${id}`,
		method: 'post',
		data
	})
}
// 待我审核转审
export function Transfer(id, data) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/Transfer/${id}`,
		method: 'post',
		data
	})
}
// 审批汇总
export function getRecordList(id, data) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/RecordList/${id}`,
		method: 'get',
		data
	})
}
// 待我审核保存草稿
export function SaveAudit(id, data) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/SaveAudit/${id}`,
		method: 'post',
		data
	})
}
// 判断是否有候选人
export function Candidates(id, data) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/Candidates/${id}`,
		method: 'post',
		data
	})
}
// 获取候选人列表（分页）
export function CandidateUser(id, data) {
	return request({
		url: `/api/workflow/Engine/FlowBefore/CandidateUser/${id}`,
		method: 'post',
		data
	})
}
