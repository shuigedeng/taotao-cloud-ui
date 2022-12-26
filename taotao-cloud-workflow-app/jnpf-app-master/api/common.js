import request from '@/utils/request'


//app版本升级
export function versionUpgrade(appName) {
	return request({
		url: `/api/file/AppStartInfo/${appName}`,
	})
}
export function getAppVersion() {
	return request({
		url: `/api/app/Version`
	})
}

// 获取数据字典数据
export function getDictionaryDataAll() {
	return request({
		url: '/api/system/DictionaryData/All',
		options: {
			load: false
		}
	})
}
// 获取字典数据下拉框列表
export function getDictionaryDataSelector(dictionaryTypeId) {
	return request({
		url: `/api/system/DictionaryData/${dictionaryTypeId}/Data/Selector`,
		options: {
			load: false
		}
	})
}

// 获取关联表单数据详情
export function getDataChange(modelId, id) {
	return request({
		url: `/api/visualdev/OnlineDev/${modelId}/${id}/DataChange`,
		method: 'GET'
	})
}
// 获取关联表单弹窗列表
export function getRelationSelect(id, data, options) {
	return request({
		url: `/api/visualdev/Base/${id}/FieldDataSelect`,
		data,
		options: {
			load: false
		}
	})
}
// 获取弹窗选择远端接口数据
export function getPopSelect(id, data, options) {
	return request({
		url: `/api/system/DataInterface/${id}/Action/List`,
		data,
		options: {
			load: false
		}
	})
}

// 获取弹窗选择单条接口数据
export function getDataInterfaceDataInfo(id, data) {
	return request({
		url: `/api/system/DataInterface/${id}/Action/Info`,
		method: 'GET',
		data,
		options: {
			load: false
		}
	})
}
// 获取组织/公司下拉框列表
export function getOrganizeSelector() {
	return request({
		url: '/api/permission/Organize/Selector/0',
		options: {
			load: false
		}
	})
}
// 获取部门下拉框列表(公司+部门)
export function getDepartmentSelector() {
	return request({
		url: '/api/permission/Organize/Department/Selector/0',
		options: {
			load: false
		}
	})
}
// 获取岗位下拉列表（公司+部门+岗位）
export function getPositionSelector() {
	return request({
		url: '/api/permission/Position/Selector',
		options: {
			load: false
		}
	})
}
// 获取用户下拉框列表(公司+部门+用户)
export function getUserSelector() {
	return request({
		url: '/api/permission/Users/Selector',
		options: {
			load: false
		}
	})
}

// 获取用户下拉框列表(用户选择加载)
export function getUserSelectorNew(organizeId, keyword) {
	return request({
		url: `/api/permission/Users/ImUser/Selector/${organizeId}`,
		method: 'POST',
		data: {
			keyword
		},
		options: {
			load: false
		}
	})
}
// 获取用户基本信息
export const getUserInfoList = userId => {
	return request({
		url: '/api/permission/Users/getUserList',
		method: 'post',
		data: {
			userId
		}
	})
}

// 获取我的下属
export const getSubordinates = (keyword) => {
	return request({
		url: '/api/permission/Users/getSubordinates',
		method: 'post',
		data: {
			keyword
		}
	})
}
// 获取当前组织用户
export const getOrganization = (keyword) => {
	return request({
		url: '/api/permission/Users/getOrganization',
		method: 'get',
		data: {
			keyword,
			organizeId: '0'
		}
	})
}


//获取用户详情
export function getUesrDetail(id) {
	return request({
		url: '/api/app/User/' + id,
		method: 'GET'
	})
}

// 获取所有用户列表
export function getUserAll() {
	return request({
		url: '/api/permission/Users/All',
		options: {
			load: false
		}
	})
}
// 获取通讯录用户列表(分页)
export function getImUser(data, options) {
	return request({
		url: '/api/permission/Users/ImUser',
		data,
		options: {
			load: false
		}
	})
}
// 获取接口数据
export function getDataInterfaceRes(id) {
	return request({
		url: `/api/system/DataInterface/${id}/Actions/Response`,
		options: {
			load: false
		}
	})
}

// 用户登录
export function login(data) {
	return request({
		url: '/api/oauth/Login',
		method: 'post',
		data,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	})
}

//获取验证码
export function clickSms(account) {
	return request({
		url: 'https://app.jnpfsoft.com/api/Saas/Tenant/SmsCode/' + account,
		method: 'GET',
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	})
}
//验证码登录
export function loginSms(data) {
	return request({
		url: 'https://app.jnpfsoft.com/api/Saas/Tenant/LoginSms',
		method: 'POST',
		data,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	})
}
// 退出登录
export function logout() {
	return request({
		url: '/api/oauth/Logout'
	})
}

// 获取当前用户信息
export function getCurrentUser() {
	return request({
		url: '/api/oauth/CurrentUser?type=' + 'app',
		options: {
			load: false
		}
	})
}

// 用户登录测试
export function login2(data) {
	return request({
		url: '/api/oauth',
		method: 'GET',
		data,
		options: {
			load: false
		}
	})
}

export function getBillNumber(enCode) {
	return request({
		url: `/api/system/BillRule/BillNumber/${enCode}`,
		method: 'GET',
		options: {
			load: false
		}
	})
}

// 获取下载文件链接
export function getDownloadUrl(type, fileId) {
	return request({
		url: `/api/file/Download/${type}/${fileId}`,
		method: 'GET'
	})
}
// 修改当前用户密码
export function updatePassword(data) {
	return request({
		url: '/api/permission/Users/Current/Actions/ModifyPassword',
		method: 'POST',
		data
	})
}
// 获取我的下属
export function getSubordinate(id) {
	return request({
		url: `/api/permission/Users/Current/Subordinate/${id?id:'0'}`,
		method: 'GET'
	})
}
// 获取默认配置
export function getConfig(account) {
	return request({
		url: `/api/oauth/getConfig/${account}`,
		method: 'get'
	})
}
// 获取行政区划下拉框数据
export function getProvinceSelector(id) {
	return request({
		url: `/api/system/Area/${id}/Selector/0`,
		method: 'GET'
	})
}
// 获取行政区划下拉框数据
export function getProvinceSelectorInfoList(idsList) {
	return request({
		url: `/api/system/Area/GetAreaByIds`,
		method: 'post',
		data: {
			idsList
		}
	})
}
// 设置主要组织、主要岗位
export function setMajor(data) {
	return request({
		url: `/api/permission/Users/Current/major`,
		method: 'put',
		data
	})
}
// 获取当前用户所有组织
export function getUserOrganizes(data) {
	return request({
		url: `/api/permission/Users/Current/getUserOrganizes`,
		method: 'GET',
		data
	})
}
// 获取当前用户所有岗位
export function getUserPositions(data) {
	return request({
		url: `/api/permission/Users/Current/getUserPositions`,
		method: 'GET',
		data
	})
}
// 获取当前用户个人资料
export function UserSettingInfo() {
	return request({
		url: '/api/permission/Users/Current/BaseInfo',
		method: 'GET'
	})
}
// 更新当前用户个人资料
export function UpdateUser(data) {
	return request({
		url: '/api/permission/Users/Current/BaseInfo',
		method: 'PUT',
		data
	})
}
// 更新当前用户头像
export function UpdateAvatar(name) {
	return request({
		url: `/api/permission/Users/Current/Avatar/${name}`,
		method: 'PUT'
	})
}
