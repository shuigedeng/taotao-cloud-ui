<template>
	<view class="message-v">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :sticky="true"
			:down="downOption" :up="upOption" :bottombar="false">
			<view class="search-box search-box_sticky">
				<u-search placeholder="请输入关键词搜索" v-model="keyword" height="72" :show-action="false" @change="search"
					bg-color="#f0f2f6" shape="square">
				</u-search>
			</view>
			<view class="message-list">
				<view class="u-flex message-item u-border-bottom " v-for="(item, i) in list" :key="i"
					@click="detail(item)">
					<view class="message-item-img message-item-icon u-flex u-row-center">
						<text class="icon-ym icon-ym-xitong" />
					</view>
					<view class="message-item-txt">
						<view class="message-item-title u-flex">
							<text class="redDot" v-if="!item.isRead"></text>
							<text class="title u-line-1">{{item.title}}</text>
						</view>
						<view class="u-flex u-row-between message-item-cell">
							<text>{{item.creatorUser}}</text>
							<text class="u-font-24">{{item.lastModifyTime|date('mm-dd hh:MM')}}</text>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		getMessageList,
		getMessageDetail,
		checkInfo
	} from '@/api/message.js'
	import resources from '@/libs/resources.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				downOption: {
					use: true,
					auto: true
				},
				upOption: {
					page: {
						num: 0,
						size: 20,
						time: null
					},
					empty: {
						use: true,
						icon: resources.message.nodata,
						tip: "暂无数据",
						fixed: true,
						top: "300rpx",
					},
					textNoMore: '没有更多数据',
				},
				keyword: '',
				list: [],
			}
		},
		onLoad(option) {
			// this.type = option.type || '1'
			// const title = this.type != '1' ? '系统消息' : '通知公告'
			// uni.setNavigationBarTitle({
			// 	title: title
			// });
		},
		methods: {
			upCallback(page) {
				let query = {
					currentPage: page.num,
					pageSize: page.size,
					keyword: this.keyword,
					type: ''
				}
				getMessageList(query, {
					load: page.num == 1
				}).then(res => {
					this.mescroll.endSuccess(res.data.list.length);
					if (page.num == 1) this.list = [];
					const list = res.data.list;
					this.list = this.list.concat(list);
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
			search() {
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(() => {
					this.list = [];
					this.mescroll.resetUpScroll();
				}, 300)
			},
			detail(item) {
				if (item.type == '1') {
					if (!item.isRead) {
						item.isRead = 1
						this.$store.commit('chat/SET_MSGINFO_NUM', item.type)
					}
					uni.navigateTo({
						url: '/pages/message/messageDetail/index?id=' + item.id
					});
				} else {
					getMessageDetail(item.id).then(res => {
						if (!item.isRead) {
							item.isRead = 1
							this.$store.commit('chat/SET_MSGINFO_NUM', item.type)
						}
						let bodyText = res.data.bodyText ? JSON.parse(res.data.bodyText) : {}
						let url = '';
						let config = {
							id: bodyText.processId,
							enCode: bodyText.enCode,
							flowId: bodyText.flowId,
							formType: bodyText.formType,
							opType: bodyText.type == 1 ? 0 : bodyText.type == 2 ? 1 : bodyText.type,
							taskNodeId: bodyText.taskNodeId,
							taskId: bodyText.taskOperatorId,
							hideCancelBtn: true,
							fullName: res.data.title,
							status: bodyText.status
						}
						url = '/pages/workFlow/flowBefore/index?config=' + encodeURIComponent(JSON
							.stringify(config))
						if (bodyText.type == 2) {
							checkInfo(bodyText.taskOperatorId).then(res => {
								uni.navigateTo({
									url: url
								});
							}).catch((err) => {})
						} else {
							uni.navigateTo({
								url: url
							});
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.message-v {
		.message-list {
			padding: 0 32rpx;
			background-color: #fff;

			.message-item {
				height: 132rpx;

				.message-item-img {
					width: 96rpx;
					height: 96rpx;
					overflow: hidden;
					margin-right: 16rpx;
					flex-shrink: 0;
					border-radius: 50%;
					background-color: #3B87F7;

					.icon-ym {
						color: #fff;
						font-size: 50rpx;
					}
				}

				.message-item-txt {
					width: calc(100% - 112rpx);

					.message-item-title {
						line-height: 46rpx;
						margin-bottom: 6rpx;

						.redDot {
							height: 16rpx;
							width: 16rpx;
							border-radius: 50%;
							background: #FE5146;
							display: inline-block;
							margin-right: 6rpx;
							flex-shrink: 0;
						}

						.title {
							font-size: 32rpx;
						}
					}

					.message-item-cell {
						color: #C6C6C6;
						font-size: 28rpx;
					}
				}
			}
		}
	}
</style>
