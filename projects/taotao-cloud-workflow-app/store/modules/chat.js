const state = {
	socket: null,
	badgeNum: 0,
	msgInfo: {},
	formUserId: '',
};
const mutations = {
	SET_BADGE_NUM(state, badgeNum) {
		state.badgeNum = badgeNum
	},
	ADD_BADGE_NUM(state, num) {
		state.badgeNum += num
	},
	REDUCE_BADGE_NUM(state, num) {
		let badgeNum = state.badgeNum - num
		if (badgeNum < 0) badgeNum = 0
		state.badgeNum = badgeNum
	},
	SET_MSGINFO(state, msgInfo) {
		state.msgInfo = msgInfo
	},
	SET_MSGINFO_NUM(state, type) {
		if (type === '1') {
			state.msgInfo.noticeCount -= 1
		} else {
			state.msgInfo.messageCount -= 1
		}
		let badgeNum = state.badgeNum - 1
		if (badgeNum < 0) badgeNum = 0
		state.badgeNum = badgeNum
	},
	SET_FORMUSERID(state, formUserId) {
		state.formUserId = formUserId
	},
};
const actions = {
	sendMessage({
		state,
		commit
	}, data) {
		const item = {
			account: data.toAccount,
			headIcon: data.toHeadIcon,
			id: data.toUserId,
			latestDate: data.latestDate,
			latestMessage: data.toMessage,
			messageType: data.messageType,
			realName: data.toRealName,
			unreadMessage: 0
		}
		const addItem = {
			sendUserId: data.UserId,
			contentType: data.messageType,
			content: data.toMessage,
			sendTime: data.dateTime,
			method: data.method
		}
		uni.$emit('addMsg', addItem)
		uni.$emit('updateList', item)
	},
	receiveMessage({
		state,
		commit
	}, data) {
		if (state.formUserId === data.formUserId) {
			data.unreadMessage = 0
			const item = {
				sendUserId: data.formUserId,
				contentType: data.messageType,
				content: data.formMessage,
				sendTime: data.dateTime,
				method: data.method
			}
			uni.$emit('addMsg', item)
		} else {
			data.unreadMessage = 1
			commit('ADD_BADGE_NUM', 1)
		}
		data.id = data.formUserId
		data.latestMessage = data.formMessage
		uni.$emit('updateList', data)
	},
	getMessageList({
		state,
		commit
	}, data) {
		uni.$emit('getMessageList', data)
	},
	messagePush({
		state,
		commit
	}, data) {
		if (data.messageType == "1") {
			state.msgInfo.noticeCount += data.unreadNoticeCount;
			state.msgInfo.noticeText = data.title;
			state.msgInfo.noticeDate = new Date().getTime();
		} else {
			state.msgInfo.messageCount += data.unreadNoticeCount;
			state.msgInfo.messageText = data.title;
			state.msgInfo.messageDate = new Date().getTime();
		}
		commit('ADD_BADGE_NUM', data.unreadNoticeCount || 1)
	}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}
