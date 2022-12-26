<template>
	<view class="index-v">
		<mescroll-body ref="mescrollRef" @down="downCallback" :sticky="true" :up="upOption" :bottombar="false">
			<view class="replyList">
				<view class="reply-item u-border-bottom u-flex" @click="openPage('/pages/message/message/index?type=')">
					<view class="reply-item-img reply-item-icon u-flex u-row-center">
						<text class="icon-ym icon-ym-xitong" />
					</view>
					<view class="reply-item-txt u-flex-1">
						<view class="reply-item-cell reply-item-title u-flex u-row-between">
							<text class="title">站内消息</text>
							<text
								class="u-font-24">{{msgInfo.messageText?$u.timeFormat(msgInfo.messageDate, 'mm-dd hh:MM'):''}}</text>
						</view>
						<view class="reply-item-cell u-flex u-row-between">
							<text
								class="reply-item-txt-msg u-line-1">{{msgInfo.messageText == "" ? "暂无数据" : msgInfo.messageText}}</text>
							<u-badge type="error" :count="msgInfo.messageCount" :absolute="false"
								v-if="msgInfo.messageCount" />
						</view>
					</view>
				</view>
				<view class="reply-item u-border-bottom u-flex" v-for="(item,i) in list" :key="i" @click="toIm(item)">
					<view class="reply-item-img">
						<u-avatar :src="baseURL+item.headIcon" mode="square" size="96" />
					</view>
					<view class="reply-item-txt u-flex-1">
						<view class="reply-item-cell reply-item-title u-flex u-row-between">
							<text class="title">{{item.realName}}/{{item.account}}</text>
							<text class="u-font-24">{{item.latestDate|timeFrom}}</text>
						</view>
						<view class="reply-item-cell u-flex u-row-between">
							<text
								class="reply-item-txt-msg u-line-1">{{getMsgText(item.latestMessage,item.messageType)}}</text>
							<u-badge type="error" :count="item.unreadMessage" :absolute="false" />
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import IndexMixin from './mixin.js'
	import {
		mapGetters
	} from "vuex"
	import {
		getIMReply
	} from '@/api/message.js'
	export default {
		mixins: [MescrollMixin, IndexMixin],
		data() {
			return {
				keyword: '',
				list: [],
				upOption: {
					use: false
				}
			}
		},
		watch: {
			badgeNum(val) {
				this.setTabBarBadge()
			}
		},
		computed: {
			...mapGetters(['msgInfo']),
			baseURL() {
				return this.define.baseURL
			},
			report() {
				return this.define.report
			},
			token() {
				return this.$store.getters.token
			},
		},
		onLoad() {
			uni.showLoading({
				title: '加载中'
			})
			uni.$on('updateList', data => {
				this.updateReply(data)
			})
			uni.$on('updateMsgNum', id => {
				this.updateMsgNum(id)
			})
		},
		onUnload() {
			uni.$off('updateList')
			uni.$off('updateMsgNum')
		},
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				uni.scanCode({
					success: res => {
						if (this.isJSON(res.result)) {
							const result = JSON.parse(res.result)
							if (result.t === 'ADP') {
								uni.navigateTo({
									url: '/pages/apply/dynamicModel/index?isPreview=1&id=' + result
										.id,
									fail: (err) => {
										this.$u.toast("暂无此页面")
									}
								})
							}
							if (result.t === 'DFD') {
								let config = JSON.stringify(result)
								uni.navigateTo({
									url: '/pages/apply/dynamicModel/scanForm?config=' + config,
									fail: (err) => {
										this.$u.toast("暂无此页面")
									}
								})
							}
							if (result.t === 'report') {
								let url =
									`${this.report}/preview.html?id=${result.id}&token=${this.token}&page=1&from=menu`
								uni.navigateTo({
									url: '/pages/apply/externalLink/index?url=' + encodeURIComponent(
										url),
									fail: (err) => {
										this.$u.toast("暂无")
									}
								})
							}
						} else {
							uni.navigateTo({
								url: '/pages/my/scanResult/index?result=' + res.result,
								fail: (err) => {
									this.$u.toast("暂无此页面")
								}
							})
						}
					}
				});
			};
		},
		methods: {
			isJSON(str) {
				try {
					var obj = JSON.parse(str);
					if (typeof obj == 'object' && obj) {
						return true;
					} else {
						return false;
					}
				} catch (e) {
					return false;
				}
			},
			downCallback(page) {
				getIMReply().then(res => {
					this.list = res.data.list || [];
					this.mescroll.endSuccess(res.data.list.length, false);
					uni.hideLoading()
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
			search() {
				return
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(() => {
					this.list = [];
					this.mescroll.resetUpScroll();
				}, 300)
			},
			updateReply(data) {
				let boo = false
				const len = this.list.length
				for (let i = 0; i < len; i++) {
					if (data.id === this.list[i].id) {
						this.list[i].unreadMessage += data.unreadMessage
						this.list[i].latestMessage = data.latestMessage
						this.list[i].messageType = data.messageType
						this.list[i].latestDate = data.latestDate
						boo = true
						break
					}
				}
				if (boo) return
				data.unreadMessage = data.unreadMessage
				this.list.unshift(data)
			},
			updateMsgNum(id) {
				const len = this.list.length
				for (let i = 0; i < len; i++) {
					if (id === this.list[i].id) {
						const num = this.list[i].unreadMessage
						this.$store.commit('chat/REDUCE_BADGE_NUM', num)
						this.list[i].unreadMessage = 0
						break
					}
				}
			},
			getMsgText(text, type) {
				let message = ''
				switch (type) {
					case 'voice':
						message = '[语音]'
						break;
					case 'image':
						message = '[图片]'
						break;
					default:
						message = text
						break;
				}
				return message
			},
			openPage(path) {
				if (!path) return
				uni.navigateTo({
					url: path
				})
			},
			toIm(item) {
				const name = item.realName + '/' + item.account
				if (item.unreadMessage) {
					this.$store.commit('chat/REDUCE_BADGE_NUM', item.unreadMessage)
					item.unreadMessage = 0
				}
				uni.navigateTo({
					url: '/pages/message/im/index?name=' + name + '&formUserId=' + item.id + '&headIcon=' + item
						.headIcon
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.index-v {

		.replyList {
			padding: 0 32rpx;
			background-color: #fff;

			.reply-item {
				height: 132rpx;

				.reply-item-img {
					width: 96rpx;
					height: 96rpx;
					border-radius: 16rpx;
					overflow: hidden;
					margin-right: 16rpx;
					flex-shrink: 0;
				}

				.reply-item-icon {
					background-color: #3B87F7;

					.icon-ym {
						color: #fff;
						font-size: 50rpx;
					}
				}

				.reply-item-txt {

					.reply-item-cell {
						height: 40rpx;
						color: #C6C6C6;
						font-size: 28rpx;

						&.reply-item-title {
							height: 44rpx;
							margin-bottom: 4px;

							.title {
								font-size: 32rpx;
								color: #000000;
							}
						}

						.reply-item-txt-msg {
							width: 480rpx;
						}
					}
				}
			}
		}
	}
</style>
