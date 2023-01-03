import {
	logout,
	getCurrentUser
} from '@/api/common.js'
const state = {
	token: "",
	userInfo: {}
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_USERINFO: (state, userInfo) => {
		state.userInfo = userInfo
	},
}

const actions = {
	getCurrentUser({
		commit
	}) {
		return new Promise((resolve, reject) => {
			getCurrentUser().then(res => {
				const userInfo = res.data.userInfo || {}
				const permissionList = res.data.permissionList || []
				const sysConfigInfo = res.data.sysConfigInfo || {}
				const sysVersion = sysConfigInfo.sysVersion || ''
				const copyright = sysConfigInfo.copyright || ''
				commit('SET_USERINFO', userInfo)
				uni.setStorageSync('sysVersion', sysVersion)
				uni.setStorageSync('permissionList', permissionList)
				uni.setStorageSync('sysConfigInfo', sysConfigInfo)
				uni.setStorageSync('copyright', copyright)
				uni.setStorageSync('userInfo', userInfo)
				resolve(userInfo)
			}).catch(error => {
				reject(error)
			})
		})
	},
	logout({
		commit,
		dispatch
	}) {
		return new Promise((resolve, reject) => {
			logout().then(() => {
				commit('SET_TOKEN', '')
				commit('SET_USERINFO', {})
				dispatch('resetToken')
				resolve()
			}).catch(error => {
				reject(error)
			})
		})
	},
	// remove token
	resetToken({
		commit
	}) {
		return new Promise(resolve => {
			uni.removeStorageSync('token')
			uni.removeStorageSync('userInfo')
			uni.removeStorageSync('permissionList')
			resolve()
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
