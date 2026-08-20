import request from "@/utils/request";

// 获取消息中心列表
export function getMessageList(data) {
  return request({
    url: `/api/message`,
    method: "GET",
    data
  });
}
// 全部已读
export function MessageAllRead() {
  return request({
    url: "/api/message/Actions/ReadAll",
    method: "POST"
  });
}
// 查看消息内容
export function ReadInfo(id) {
  return request({
    url: `/api/message/ReadInfo/${id}`,
    method: "get"
  });
}
// 删除消息
export function MessageDeleteRecord(data) {
  return request({
    url: `/api/message/Record`,
    method: "DELETE",
    data
  });
}
// 获取系统公告列表
export function getNoticeList(data) {
  return request({
    url: "/api/message/Notice",
    method: "GET",
    data
  });
}
// 添加公告
export function createNotice(data) {
  return request({
    url: "/api/message",
    method: "POST",
    data
  });
}
// 修改公告
export function updateNotice(data) {
  return request({
    url: `/api/message/${data.id}`,
    method: "PUT",
    data
  });
}
// 获取/查看系统公告信息
export function getNoticeInfo(id) {
  return request({
    url: `/api/message/${id}`,
    method: "GET"
  });
}
// 删除公告
export function delNotice(id) {
  return request({
    url: `/api/message/${id}`,
    method: "DELETE"
  });
}
// 解绑公告
export function unbindNotice(data) {
  return request({
    url: `/api/banner/del/msgId`,
    method: "POST",
    data
  });
}
// 发布公告
export function releaseNotice(id) {
  return request({
    url: `/api/message/${id}/Actions/Release`,
    method: "PUT"
  });
}
// 获取IM对话列表
export function getIMReply() {
  return request({
    url: "/api/message/imreply",
    method: "GET"
  });
}
// 未读列表
export function notReadList(data) {
  return request({
    url: `/api/message/notRead`,
    method: "GET",
    data
  });
}
// 未读详情
export function notReadInfo(data) {
  return request({
    url: `/api/message/notRead/info`,
    method: "GET",
    data
  });
}
// 未读导出
export function exportData(data) {
  return request({
    url: `/api/message/notRead/exportData`,
    method: "GET",
    data
  });
}
