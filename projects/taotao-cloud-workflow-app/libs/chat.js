import Vue from 'vue'
import define from '@/utils/define'
import store from '@/store'

const Socket = {
	contime: 0,
	ws: null,
	initSocket() {
		try {
			Socket.ws = uni.connectSocket({
				url: define.webSocketUrl,
				success() {
					// console.log("websocket连接成功")
				},
			});
			store.state.chat.socket = Socket.ws

			uni.onSocketOpen(res => {
				const token = uni.getStorageSync('token') || ''
				Socket.contime = 0
				const msg = JSON.stringify({
					method: "OnConnection",
					token,
					mobileDevice: true
				});
				Socket.sendMsg(msg)
			});

			uni.onSocketError(res => {
				store.state.chat.socket = null
				setTimeout(() => {
					Socket.contime += 1
					if (Socket.contime <= 10) {
						if (Socket.contime >= 3) {
							uni.showToast({
								title: 'IM通讯正在连接:' + '连接第' + Socket.contime + '次！稍后...',
								icon: 'none'
							})
						}
						Socket.reConnect();
					} else {
						uni.showToast({
							title: 'IM通讯连接失败，联系服务器管理员',
							icon: 'none'
						})
					}
				}, 10)
			});

			uni.onSocketClose(res => {
				store.state.chat.socket = null
			});

			uni.onSocketMessage(res => {
				const data = JSON.parse(res.data)

				switch (data.method) {
					case "initMessage": //初始化
						const msgInfo = {
							noticeText: data.noticeDefaultText,
							messageText: data.messageDefaultText,
							messageCount: data.unreadMessageCount,
							noticeCount: data.unreadNoticeCount,
							noticeDate: data.noticeDefaultTime || 0,
							messageDate: data.messageDefaultTime || 0,
							count: data.unreadNoticeCount + data.unreadMessageCount
						}
						let badgeNum = data.unreadMessageCount + data.unreadNoticeCount
						for (let i = 0; i < data.unreadNums.length; i++) {
							badgeNum = badgeNum + data.unreadNums[i].unreadNum
						}
						store.commit('chat/SET_BADGE_NUM', badgeNum)
						store.commit('chat/SET_MSGINFO', msgInfo)
						break;
					case "Online": //在线用户

						break;
					case "Offline": //离线用户

						break;
					case "sendMessage": //发送消息
						store.dispatch('chat/sendMessage', data)
						break;
					case "receiveMessage": //接收消息
						store.dispatch('chat/receiveMessage', data)
						break;
					case "messageList": //消息列表
						store.dispatch('chat/getMessageList', data)
						break;
					case "messagePush": //消息推送
						store.dispatch('chat/messagePush', data)
						break;
					case "closeSocket": //断开websocket连接
						uni.closeSocket()
						break;
					case "logout":
						uni.showToast({
							title: data.msg || '登录已过期',
							icon: 'none',
							complete: () => {
								setTimeout(() => {
									store.dispatch('user/resetToken').then(() => {
										uni.closeSocket()
										uni.reLaunch({
											url: '/pages/login/index'
										})
									})
								}, 1500)
							}
						})
						break;
					default:
						break;
				}
			});
		} catch (e) {}
	},
	sendMsg(msg) {
		uni.sendSocketMessage({
			data: msg,
			fail: (e) => {
				Socket.reConnect()
			}
		})
	},
	//重连
	reConnect() {
		Socket.initSocket()
	},
};

export default Socket
