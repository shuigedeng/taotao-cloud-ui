import request from '@/utils/request'

// 获取开关数据
export function smsSwitch() {
    return request({
        url: '/api/config/smsSwitch',
        method: 'GET',
    })
}


// 添加或更新开关
export function addOrUpdate(data) {
    return request({
        url: '/api/config/smsSwitch/addOrUpdate',
        method: 'POST',
        data
    })
}

// 自定义短信接口
export function sendUsers(data) {
    return request({
        url: '/api/sms/send/users',
        method: 'POST',
        data
    })
}