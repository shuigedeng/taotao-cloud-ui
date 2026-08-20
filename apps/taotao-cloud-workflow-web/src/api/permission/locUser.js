import request from "@/utils/request";

// 获取定位用户列表
export const getList = data => {
  return request({
    url: "/api/yiqing/user/page",
    method: "GET",
    data
  });
};
