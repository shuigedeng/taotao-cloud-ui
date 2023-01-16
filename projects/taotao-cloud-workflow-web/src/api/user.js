import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/oauth/Login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

// 获取当前用户信息
export function getInfo() {
  return request({
    url: '/api/oauth/CurrentUser',
    method: 'get',
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/api/oauth/Logout',
    method: 'get'
  })
}

// 锁屏解锁登录
export function unlock(data) {
  return request({
    url: '/api/oauth/LockScreen',
    method: 'post',
    data
  })
}

// 获取默认配置
export function getConfig(account) {
  return request({
    url: `/api/oauth/getConfig/${account}`,
    method: 'get'
  })
}