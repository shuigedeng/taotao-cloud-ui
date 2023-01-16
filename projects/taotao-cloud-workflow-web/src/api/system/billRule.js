import request from '@/utils/request'

// 获取单据规则列表(带分页)
export function getBillRuleList(data) {
  return request({
    url: '/api/system/BillRule',
    method: 'GET',
    data
  })
}

// 获取单据规则下拉框
export function getBillRuleSelector() {
  return request({
    url: '/api/system/BillRule/Selector',
    method: 'GET'
  })
}

// 添加单据规则
export function createBillRule(data) {
  return request({
    url: '/api/system/BillRule',
    method: 'POST',
    data
  })
}

// 修改单据规则
export function updateBillRule(data) {
  return request({
    url: `/api/system/BillRule/${data.id}`,
    method: 'PUT',
    data
  })
}

// 获取单据规则信息
export function getBillRuleInfo(id) {
  return request({
    url: `/api/system/BillRule/${id}`,
    method: 'GET'
  })
}

// 删除单据规则
export function delBillRule(id) {
  return request({
    url: `/api/system/BillRule/${id}`,
    method: 'DELETE'
  })
}

// 更新单据规则状态
export function updateBillRuleState(id) {
  return request({
    url: `/api/system/BillRule/${id}/Actions/State`,
    method: 'PUT'
  })
}

export function BillNumber(enCode) {
  return request({
    url: `/api/system/BillRule/BillNumber/${enCode}`,
    method: 'GET'
  })
}
// 导出
export function exportTpl(id) {
  return request({
    url: `/api/system/BillRule/${id}/Action/Export`,
    method: 'get'
  })
}