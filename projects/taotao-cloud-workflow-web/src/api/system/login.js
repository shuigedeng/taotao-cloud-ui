import request from "@/utils/request";

// 登录查询列表
export const getList = data => {
  return request({
    url: "/api/permission/Users/login/page",
    method: "GET",
    data
  });
};
