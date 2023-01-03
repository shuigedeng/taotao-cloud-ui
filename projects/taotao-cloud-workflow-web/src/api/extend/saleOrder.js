import request from '@/utils/request'

// 获取客户类别
export function getCustomer(keyword) {
  return request({
    url: `/api/extend/saleOrder/Customer`,
    method: 'get',
    data: { keyword }
  })
}
// 获取分类
export function getProductClassify() {
  return request({
    url: `/api/extend/saleOrder/Classify`,
    method: 'get'
  })
}
// 商品列表
export function getGoodsList(data) {
  return request({
    url: `/api/extend/saleOrder/Goods`,
    method: 'get',
    data
  })
}
// 商品列表(通过type)
export function GoodsList(type) {
  return request({
    url: `/api/extend/saleOrder/Goods/getGoodList?type=${type}`,
    method: 'get'
  })
}
// 订单列表
export function getOrderList(data) {
  return request({
    url: `/api/extend/saleOrder/Product`,
    method: 'get',
    data
  })
}
// 订单详情
export function orderInfo(id) {
  return request({
    url: `/api/extend/saleOrder/Product/${id}`,
    method: 'get'
  })
}
// 新建订单
export function createOrder(data) {
  return request({
    url: `/api/extend/saleOrder/Product`,
    method: 'post',
    data
  })
}
// 编辑订单
export function updateOrder(data) {
  return request({
    url: `/api/extend/saleOrder/Product/${data.id}`,
    method: 'put',
    data
  })
}
// 新建订单
export function delOrder(id) {
  return request({
    url: `/api/extend/saleOrder/Product/${id}`,
    method: 'delete'
  })
}
// 获取销售明细
export function getProductEntry(id) {
  return request({
    url: `/api/extend/saleOrder/Product/ProductEntry/${id}`,
    method: 'get'
  })
}
// 产品下拉
export function getGoodsSelector(keyword) {
  return request({
    url: `/api/extend/saleOrder/Goods/Selector`,
    method: 'get',
    data: { keyword }
  })
}