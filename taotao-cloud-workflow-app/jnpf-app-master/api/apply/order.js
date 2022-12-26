import request from '@/utils/request'

// 删除订单
export function Delete(id) {
	return request({
		url: `/api/extend/CrmOrder/${id}`,
		method: 'DELETE'
	})
}
// 获取订单列表
export function getOrderList(data, options) {
	return request({
		url: `/api/extend/CrmOrder`,
		method: 'get',
		data,
		options
	})
}
// 新建订单信息
export function Create(data) {
	return request({
		url: `/api/extend/CrmOrder`,
		method: 'post',
		data
	})
}
// 更新订单信息
export function Update(data) {
	return request({
		url: `/api/extend/CrmOrder/${data.id}`,
		method: 'put',
		data
	})
}
// 获取订单信息
export function Info(id) {
	return request({
		url: `/api/extend/CrmOrder/${id}`,
		method: 'get'
	})
}
// 获取商品列表
export function getGoodsList(data) {
	return request({
		url: `/api/extend/CrmOrder/Goods`,
		method: 'get',
		data,
		options: {
			load: false
		}
	})
}
// 获取客户列表
export function getCustomerList(keyword) {
	return request({
		url: `/api/extend/CrmOrder/Customer`,
		method: 'get',
		data: {
			keyword: keyword || ''
		},
		options: {
			load: false
		}
	})
}
