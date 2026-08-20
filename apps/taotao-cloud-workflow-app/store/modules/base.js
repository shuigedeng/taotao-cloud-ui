import {
	getDictionaryDataAll,
	getOrganizeSelector,
	getDepartmentSelector,
	getPositionSelector,
	getUserSelector,
	getUserAll
} from '@/api/common.js'

const state = {
	dictionaryList: [],
	organizeTree: [],
	departmentTree: [],
	positionTree: [],
	userTree: [],
	userList: [],
	relationData: {}
}

const mutations = {
	SET_DICTIONARY_LIST: (state, dictionaryList) => {
		state.dictionaryList = dictionaryList
	},
	SET_ORGANIZE_TREE: (state, organizeTree) => {
		state.organizeTree = organizeTree
	},
	SET_DEPARTMENT_LIST: (state, departmentTree) => {
		state.departmentTree = departmentTree
	},
	SET_POSITION_TREE: (state, positionTree) => {
		state.positionTree = positionTree
	},
	SET_USER_TREE: (state, userTree) => {
		state.userTree = userTree
	},
	SET_USER_LIST: (state, userList) => {
		state.userList = userList
	},
	UPDATE_RELATION_DATA(state, val) {
		state.relationData = val
	},
}

const actions = {
	getDictionaryDataAll({
		commit
	}) {
		return new Promise((resolve, reject) => {
			getDictionaryDataAll().then(res => {
				commit('SET_DICTIONARY_LIST', res.data.list)
				resolve(res.data.list)
			}).catch(error => {
				reject(error)
			})
		})
	},
	getDictionaryData({
		state,
		dispatch
	}, info) {
		return new Promise(async resolve => {
			let list = [],
				data = [],
				json = []
			if (!state.dictionaryList.length) {
				list = await dispatch('getDictionaryDataAll')
			} else {
				list = state.dictionaryList
			}
			if (info.sort) {
				data = list.filter(o => o.enCode === info.sort)[0]
				if (!info.id) {
					json = data.dictionaryList
				} else {
					let rowData = [];
					if (!data.isTree) {
						rowData = data.dictionaryList.fliter(o => o.id == info.id)
					} else {
						const findData = list => {
							for (let i = 0; i < list.length; i++) {
								const e = list[i];
								if (e.id == info.id) {
									rowData[0] = e
									break
								}
								if (e.children && e.children.length) {
									findData(e.children)
								}
							}
						}
						findData(data.dictionaryList)
					}
					if (rowData.length) {
						json = rowData[0]
					} else {
						json = {
							id: "",
							fullName: ""
						};
					}
				}
			}
			resolve(json)
		})
	},
	getOrganizeTree({
		state,
		commit
	}) {
		return new Promise((resolve, reject) => {
			if (!state.organizeTree.length) {
				getOrganizeSelector().then(res => {
					commit('SET_ORGANIZE_TREE', res.data.list)
					resolve(res.data.list)
				}).catch(error => {
					reject(error)
				})
			} else {
				resolve(state.organizeTree)
			}
		})
	},
	getDepartmentTree({
		state,
		commit
	}) {
		return new Promise((resolve, reject) => {
			if (!state.departmentTree.length) {
				getDepartmentSelector().then(res => {
					commit('SET_DEPARTMENT_LIST', res.data.list)
					resolve(res.data.list)
				}).catch(error => {
					reject(error)
				})
			} else {
				resolve(state.departmentTree)
			}
		})
	},
	getPositionTree({
		state,
		commit
	}) {
		return new Promise((resolve, reject) => {
			if (!state.positionTree.length) {
				getPositionSelector().then(res => {
					commit('SET_POSITION_TREE', res.data.list)
					resolve(res.data.list)
				}).catch(error => {
					reject(error)
				})
			} else {
				resolve(state.positionTree)
			}
		})
	},
	getUserTree({
		state,
		commit
	}) {
		return new Promise((resolve, reject) => {
			if (!state.userTree.length) {
				getUserSelector().then(res => {
					commit('SET_USER_TREE', res.data.list)
					resolve(res.data.list)
				}).catch(error => {
					reject(error)
				})
			} else {
				resolve(state.userTree)
			}
		})
	},
	getUserList({
		state,
		commit
	}) {
		return new Promise((resolve, reject) => {
			if (!state.userList.length) {
				getUserAll().then(res => {
					commit('SET_USER_LIST', res.data.list)
					resolve(res.data.list)
				}).catch(error => {
					reject(error)
				})
			} else {
				resolve(state.userList)
			}
		})
	},
	getUserInfo({
		state,
		dispatch
	}, id) {
		return new Promise(async resolve => {
			let list = []
			if (!state.userList.length) {
				list = await dispatch('getUserList')
			} else {
				list = state.userList
			}
			let item = list.filter(o => o.id === id)[0]
			resolve(item || {})
		})
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
