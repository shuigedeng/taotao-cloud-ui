import request from '@/utils/request'
// 获取列表表单配置JSON
export function getConfigData(modelId) {
	return request({
		url: `/api/visualdev/OnlineDev/${modelId}/Config`,
		method: 'GET'
	})
}
// 获取数据列表
export function getModelList(modelId, data, options) {
	return request({
		url: `/api/visualdev/OnlineDev/${modelId}/List`,
		method: 'POST',
		data,
		options: {
			load: false
		}
	})
}
// 添加数据
export function createModel(modelId, data) {
	return request({
		url: `/api/visualdev/OnlineDev/${modelId}`,
		method: 'POST',
		data
	})
}
// 修改数据
export function updateModel(modelId, data) {
	return request({
		url: `/api/visualdev/OnlineDev/${modelId}/${data.id}`,
		method: 'PUT',
		data
	})
}
// 获取数据信息
export function getModelInfo(modelId, id) {
	return request({
		url: `/api/visualdev/OnlineDev/${modelId}/${id}`,
		method: 'GET'
	})
}
// 删除数据
export function deteleModel(modelId, id) {
	return request({
		url: `/api/visualdev/OnlineDev/${modelId}/${id}`,
		method: 'DELETE'
	})
}
