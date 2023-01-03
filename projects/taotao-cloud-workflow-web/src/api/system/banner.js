import request from '@/utils/request'

// 获取所有banner数据
export function getBannerList(data) {
    return request({
        url: '/api/banner/list',
        method: 'GET',
        data
    })
}


// 添加或更新banner
export function addOrUpdateBanner(data) {
    return request({
        url: '/api/banner/addOrUpdate',
        method: 'POST',
        data
    })
}

// 删除banner
export function delBanner(data) {
    return request({
        url: '/api/banner/del',
        method: 'POST',
        data
    })
}