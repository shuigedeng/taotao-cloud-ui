<template>
	<view class="im-v">
		<view @click="hideDrawer">
			<mescroll-body ref="mescrollRef" bottom="50%" @init="mescrollInit" :down="downOption" @down="downCallback"
				:up="upOption">
				<!-- 无更多消息 -->
				<view v-if="isEnd" class="msg-end">没有更多消息了</view>

				<view class="msg-list">
					<!-- 消息列表 (必须配置id,以便定位) -->
					<view class="msg-list-item" v-for="(msg,index) in msgList" :key="index" :id="'msg'+msg.id">
						<view class="my" v-if="userInfo.userId === msg.sendUserId">
							<!-- 左-消息 -->
							<view class="content">
								<!-- 文字消息 -->
								<view v-if="msg.contentType==='text'" class="msg-text">
									<block v-for="(item,i) in msg.msgContent" :key="i">
										<text class="msg-text-txt" v-if="item.type=='text'">{{item.content}}</text>
										<image class="msg-text-emoji" :src="item.content" v-if="item.type=='emjio'" />
									</block>
								</view>
								<!-- 图片消息 -->
								<view v-if="msg.contentType=='image'" class="msg-img"
									@click="showPic(msg.msgContent.path)">
									<image lazy-load="true" :src="msg.msgContent.path"
										:style="{'width': msg.msgContent.width+'px','height': msg.msgContent.height+'px'}">
									</image>
								</view>
								<!-- 语言消息 -->
								<view v-if="msg.contentType==='voice'" class="msg-text msg-voice"
									@click="playVoice(msg)" :class="playMsgid == msg.id?'play':''">
									<view class="length">{{msg.msgContent.length}}</view>
									<view class="icon my-voice"></view>
								</view>
							</view>
							<!-- 右-头像 -->
							<view class="avatar">
								<u-avatar :src="baseURL+userInfo.headIcon" size="80"></u-avatar>
							</view>
						</view>
						<!-- 收到的消息 -->
						<view class="other" v-else>
							<!-- 左-头像 -->
							<view class="avatar">
								<u-avatar :src="baseURL+headIcon" size="80"></u-avatar>
							</view>
							<!-- 右-消息 -->
							<view class="content">
								<!-- 文字消息 -->
								<view v-if="msg.contentType ==='text'" class="msg-text">
									<block v-for="(item,i) in msg.msgContent" :key="i">
										<text class="msg-text-txt" v-if="item.type=='text'">{{item.content}}</text>
										<image class="msg-text-emoji" :src="item.content" v-if="item.type=='emjio'" />
									</block>
								</view>
								<!-- 图片消息 -->
								<view v-if="msg.contentType=='image'" class="msg-img"
									@click="showPic(msg.msgContent.path)">
									<image lazy-load="true" :src="msg.msgContent.path"
										:style="{'width': msg.msgContent.width+'px','height': msg.msgContent.height+'px'}">
									</image>
								</view>
								<!-- 语音消息 -->
								<view v-if="msg.contentType==='voice'" class="msg-text msg-voice"
									@click="playVoice(msg)" :class="playMsgid == msg.id?'play':''">
									<view class="icon other-voice"></view>
									<view class="length">{{msg.msgContent.length}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</mescroll-body>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer u-border-top" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<swiper class="emoji-swiper" indicator-dots="true" duration="150" v-show="showEmoji">
				<swiper-item v-for="(page,pid) in emojiTree" :key="pid">
					<view v-for="(em,eid) in page" :key="eid" @click="addEmoji(em)" class="emoji-item">
						<image mode="widthFix" :src="getEmojiUrl(em.url)" class="emoji-item-img"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="more-layer" v-show="showMore">
				<view class="list">
					<view class="box" @click="chooseImage('album')">
						<text class="icon tupian2"></text>
					</view>
					<!-- #ifndef H5 -->
					<view class="box" @click="chooseImage('camera')">
						<text class="icon paizhao"></text>
					</view>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- #ifdef H5 -->
			<view class="input-box-icon icon biaoqing" @click="chooseEmoji"></view>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<view class="input-box-icon icon" :class="isVoice?'jianpan':'yuyin'" @click="switchVoice"></view>
			<!-- #endif -->
			<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin"
				@touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
			<view class="text-mode" v-if="!isVoice">
				<view class="input-area">
					<textarea auto-height :cursor-spacing="8" maxlength="500" v-model="textMsg" @focus="textareaFocus"
						:focus="textFocus" />
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="input-box-icon icon biaoqing" @click="chooseEmoji"></view>
			<!-- #endif -->
			<view class="input-box-icon icon add" @click="openMore"></view>
			<view class="send-btn" @click="sendText" v-if="!isVoice">发送</view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''">
				<view class="icon luyin2"></view>
			</view>
			<view class="cancel" :class="willStop?'':'hidden'">
				<view class="icon chehui"></view>
			</view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
	</view>
</template>

<script>
	import chat from '@/libs/chat.js'
	import {
		emojiList,
		emojiTree
	} from '@/pages/message/emoji/emoji.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		mapGetters
	} from 'vuex'

	export default {
		mixins: [MescrollMixin],
		name: 'im',
		data() {
			return {
				formUserId: '',
				headIcon: '',
				name: '',
				downOption: {
					auto: true,
				},
				upOption: {
					use: false,
					toTop: {
						src: ''
					}
				},
				currentPage: 1,
				pageSize: 30,
				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER: uni.getRecorderManager(),
				// #endif
				//播放语音相关参数
				// #ifndef MP-ALIPAY
				AUDIO: uni.createInnerAudioContext(),
				// #endif
				playMsgid: null,
				popupLayerClass: '',
				textFocus: false,
				showMore: false,
				showEmoji: false,
				emojiList,
				emojiTree,
				msgList: [],
				isEnd: false,
				isVoice: false,
				voiceTis: '按住 说话',
				recordTis: "手指上滑 取消发送",
				recording: false,
				willStop: false,
				initPoint: {
					identifier: 0,
					Y: 0
				},
				recordTimer: null,
				recordLength: 0,
				textMsg: '',
				msgImageList: []
			}
		},
		computed: {
			...mapGetters(['userInfo']),
			baseURL() {
				return this.define.baseURL
			}
		},
		watch: {},
		onLoad(option) {
			this.formUserId = option.formUserId;
			this.headIcon = option.headIcon;
			this.name = option.name;
			uni.$on('getMessageList', data => {
				this.getMessageList(data)
			})
			uni.$on('addMsg', data => {
				this.addMsg(data)
			})
			this.$store.commit('chat/SET_FORMUSERID', this.formUserId)
			const updateReadMessage = {
				method: "UpdateReadMessage",
				formUserId: this.formUserId,
				token: uni.getStorageSync('token')
			}
			chat.sendMsg(JSON.stringify(updateReadMessage))
			uni.setNavigationBarTitle({
				title: option.name
			});
			//语音自然播放结束
			// #ifndef MP-ALIPAY
			this.AUDIO.onEnded((res) => {
				this.playMsgid = null;
			});
			// #endif
			// #ifndef H5 || MP-ALIPAY
			//录音开始事件
			this.RECORDER.onStart((e) => {
				this.recordBegin(e);
			});
			//录音结束事件
			this.RECORDER.onStop((e) => {
				this.recordEnd(e);
			});
			// #endif
		},
		onUnload() {
			uni.$off('getMessageList')
			uni.$off('addMsg')
			this.$store.commit('chat/SET_FORMUSERID', '')
			// #ifndef MP-ALIPAY
			this.AUDIO.stop();
			// #endif
		},
		methods: {
			getMessageList(data) {
				let msgImageList = []
				const list = data.list.map(o => {
					if (o.contentType === 'image') {
						if (o.content) {
							let content = {}
							if (typeof(o.content) === 'string') {
								content = JSON.parse(o.content)
							} else {
								content = o.content
							}
							msgImageList.push(this.baseURL + content.path)
						}
					}
					return this.dealMsg(o)
				})
				this.msgImageList = [...msgImageList, ...this.msgImageList]
				let topMsg = this.msgList[0]
				this.msgList = [...list, ...this.msgList]
				if (data.list.length < data.pagination.pageSize) {
					this.mescroll.lockDownScroll(true)
					this.isEnd = true
				}
				this.$nextTick(() => {
					if (this.currentPage <= 2) {
						this.mescroll.scrollTo(99999, 0)
					} else if (topMsg) {
						let view = uni.createSelectorQuery().select('#msg' + topMsg.id);
						view.boundingClientRect(v => {
							this.mescroll.scrollTo(v.top - 100, 0)
						}).exec();
					}
				})
			},
			downCallback() {
				const messageList = {
					method: "MessageList",
					toUserId: this.formUserId,
					formUserId: this.userInfo.userId,
					token: uni.getStorageSync('token'),
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					sord: "desc"
				}
				chat.sendMsg(JSON.stringify(messageList))
				this.currentPage++;
				this.mescroll.endSuccess();
			},
			discard() {
				return;
			},
			switchVoice() {
				this.hideDrawer();
				this.isVoice = !this.isVoice;
			},
			openMore() {
				if (this.showMore) return this.hideDrawer()
				this.showMore = true;
				this.showEmoji = false;
				this.openDrawer();
			},
			openDrawer() {
				this.isVoice = false;
				this.popupLayerClass = 'showLayer';
			},
			hideDrawer() {
				this.popupLayerClass = '';
				setTimeout(() => {
					this.showMore = false;
					this.showEmoji = false;
				}, 150);
			},
			textareaFocus() {
				this.hideDrawer();
			},
			chooseEmoji() {
				if (this.showEmoji) return this.hideDrawer()
				this.showMore = false;
				this.showEmoji = true;
				this.openDrawer();
			},
			addEmoji(em) {
				this.textMsg += em.alt;
			},
			getEmojiUrl(url) {
				return require('@/pages/message/emoji/' + url)
			},
			chooseImage(type) {
				uni.chooseImage({
					// #ifdef H5
					count: 1,
					// #endif
					sourceType: [type],
					sizeType: ['original', 'compressed'],
					success: res => {
						this.hideDrawer();
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							uni.uploadFile({
								url: this.define.comUploadUrl + 'IM',
								filePath: res.tempFilePaths[i],
								name: 'file',
								header: {
									Authorization: uni.getStorageSync('token') || ''
								},
								success: (uploadFileRes) => {
									const response = uploadFileRes.data ? JSON.parse(uploadFileRes
										.data) : {}
									if (uploadFileRes.statusCode !== 200) return this.$u.toast(
										response.msg)
									if (!response.data || !response.data.name) return
									const name = response.data.name
									uni.getImageInfo({
										src: res.tempFilePaths[i],
										success: (image) => {
											// #ifdef MP-WEIXIN
											wx.getFileSystemManager().readFile({
												filePath: image.path,
												encoding: "base64",
												success: (data) => {
													let msg = {
														name,
														width: image
															.width,
														height: image
															.height,
													};
													this.sendMessage(msg,
														'image');
												},
											});
											// #endif
											// #ifdef APP-PLUS
											let path = plus.io
												.convertLocalFileSystemURL(image.path);
											let fileReader = new plus.io.FileReader();
											fileReader.readAsDataURL(path);
											fileReader.onloadend = (evt) => {
												let msg = {
													name,
													width: image.width,
													height: image.height,
												};
												this.sendMessage(msg, 'image');
											}
											// #endif
											// #ifdef H5
											let file = document.getElementsByTagName(
												"input")[0].files[0];
											let reader = new FileReader();
											reader.readAsDataURL(file);
											reader.onload = (e) => {
												let msg = {
													name,
													width: image.width,
													height: image.height,
												};
												this.sendMessage(msg, 'image');
											}
											// #endif
										}
									});
								}
							});
						}
					}
				});
			},
			addMsg(data) {
				if (data.method === 'receiveMessage') {
					const updateReadMessage = {
						method: "UpdateReadMessage",
						formUserId: this.formUserId,
						token: uni.getStorageSync('token')
					}
					chat.sendMsg(JSON.stringify(updateReadMessage))
				}
				data.id = this.$u.guid()
				if (data.contentType === "text") {
					data.msgContent = this.replaceEmoji(data.content)
				}
				if (data.contentType === "image") {
					this.msgImageList.push(this.baseURL + data.content.path)
					data.msgContent = this.setPicSize(data.content)
					data.msgContent.path = this.baseURL + data.content.path
				}
				if (data.contentType === "voice") {
					data.msgContent = data.content
				}
				this.msgList.push(data)
				this.$nextTick(() => {
					this.mescroll.scrollTo(99999, 0)
				})
			},
			dealMsg(item) {
				if (item.contentType === "text") {
					item.msgContent = this.replaceEmoji(item.content)
				}
				if (item.contentType === "image") {
					item.msgContent = this.setPicSize(JSON.parse(item.content))
					item.msgContent.path = this.baseURL + item.msgContent.path
				}
				if (item.contentType === "voice") {
					item.msgContent = JSON.parse(item.content)
				}
				return item
			},
			sendText() {
				if (!this.textMsg) return
				this.hideDrawer()
				this.sendMessage(this.textMsg, 'text')
				this.textMsg = ''
				// this.textFocus = true
			},
			sendMessage(content, type) {
				const messageObj = {
					method: "SendMessage",
					token: uni.getStorageSync('token'),
					toUserId: this.formUserId,
					messageType: type,
					messageContent: content
				}
				chat.sendMsg(JSON.stringify(messageObj))
			},
			voiceBegin(e) { // 录音开始
				this.RECORDER.stop();
				if (e.touches.length > 1) {
					return;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({
					format: "mp3"
				}); //录音开始,
			},
			recordBegin(e) { //录音开始UI效果
				this.recording = true;
				this.voiceTis = '松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(() => {
					this.recordLength++;
				}, 1000)
			},
			voiceCancel() { // 录音被打断
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true; //不发送录音
				this.RECORDER.stop(); //录音结束
			},
			voiceIng(e) { // 录音中(判断是否触发上滑取消发送)
				if (!this.recording) return
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				} else {
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			voiceEnd(e) { // 结束录音
				if (!this.recording) return
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop(); //录音结束
			},
			recordEnd(e) { //录音结束(回调文件)
				if (!this.willStop) {
					let min = parseInt(this.recordLength / 60);
					let sec = this.recordLength % 60;
					min = min < 10 ? '0' + min : min;
					sec = sec < 10 ? '0' + sec : sec;
					if (sec < '01') {
						this.willStop = true;
						this.$u.toast('说话时间太短');
						return
					}
					uni.uploadFile({
						url: this.define.comUploadUrl + 'IM',
						filePath: e.tempFilePath,
						name: 'file',
						header: {
							Authorization: uni.getStorageSync('token') || ''
						},
						success: (uploadFileRes) => {
							const response = uploadFileRes.data ? JSON.parse(uploadFileRes
								.data) : {}
							if (uploadFileRes.statusCode !== 200) return this.$u.toast(response.msg)
							if (!response.data || !response.data.name) return
							const name = response.data.name
							let msg = {
								name,
								length: min + ':' + sec
							};
							this.sendMessage(msg, 'voice')
						}
					})
				} else {
					// console.log('取消发送录音');
				}
				this.willStop = false;
			},
			setPicSize(content) { //处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
				let maxH = uni.upx2px(350); //350是定义消息图片最大高度
				if (content.width > maxW || content.height > maxH) {
					let scale = content.width / content.height;
					content.width = scale > 1 ? maxW : maxH * scale;
					content.height = scale > 1 ? maxW / scale : maxH;
				}
				return content;
			},
			replaceEmoji(str) { //替换表情符号为图片
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, item => 'workflowworkflow' + item + 'workflowworkflow');
				let strArr = replacedStr.split(/workflowworkflowworkflowworkflow|workflowworkflow/g)
				strArr = strArr.filter(o => o)
				let contentList = []
				for (let i = 0; i < strArr.length; i++) {
					let item = {
						content: strArr[i],
						type: 'emjio'
					}
					if (/\[([^(\]|\[)]*)\]/.test(strArr[i])) {
						let content = ''
						for (let j = 0; j < this.emojiList.length; j++) {
							let row = this.emojiList[j];
							if (row.alt == strArr[i]) {
								content = this.getEmojiUrl(row.url)
								break
							}
						}
						item = {
							content: content,
							type: 'emjio'
						}
					} else {
						item = {
							content: strArr[i],
							type: 'text'
						}
					}
					contentList.push(item)
				}
				return contentList
			},
			showPic(path) { // 预览图片
				uni.previewImage({
					indicator: "none",
					current: path,
					urls: this.msgImageList
				});
			},
			playVoice(msg) { // 播放语音
				this.AUDIO.stop();
				this.AUDIO.src = this.baseURL + msg.msgContent.path;
				if (this.playMsgid != null && this.playMsgid == msg.id) {
					this.$nextTick(() => {
						this.AUDIO.stop();
					});
					this.playMsgid = null;
				} else {
					this.$nextTick(() => {
						this.AUDIO.play();
					});
					this.playMsgid = msg.id;
				}
			},
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
