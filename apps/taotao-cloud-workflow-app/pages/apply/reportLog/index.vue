<template>
	<view class="reportLog-v">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :sticky="true"
			:down="downOption" :up="upOption" :bottombar="false">
			<view class="search-box_sticky">
				<u-tabs :list="tabsList" :current="current" @change="change" :is-scroll='false'>
				</u-tabs>
				<view class="search-box">
					<u-search placeholder="请输入关键词搜索" v-model="keyword" height="72" :show-action="false" @change="search"
						bg-color="#f0f2f6" shape="square">
					</u-search>
				</view>
			</view>
			<view class="log-list" v-for="(item, index) in list" :key="index">
				<u-swipe-action :index="index" :show="item.show" @click="handleClick" @open="open" :options="options"
					@content-click="goDetail(item.id)">
					<view class="log-list-txt u-flex-col">
						<view class="u-font-30 u-flex u-m-b-10 log-title">
							<text class="title u-line-1">{{item.title}}</text>
							<text>{{item.creatorTime | date('mm-dd')}}</text>
						</view>
						<text class="u-m-t-10">{{userInfo.userName}}/{{userInfo.userAccount}}</text>
					</view>
				</u-swipe-action>
			</view>
		</mescroll-body>
		<view class="com-addBtn" @click="goDetail()">
			<u-icon name="plus" size="60" color="#fff" />
		</view>
	</view>
</template>

<script>
	import {
		getSendList,
		getReceiveList,
		delLog
	} from '@/api/apply/reportLog.js'
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
				current: 0,
				tabsList: [{
						name: '我发出的'
					},
					{
						name: '我收到的'
					}
				],
				keyword: '',
				list: [],
				userInfo: {},
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo') || {}
			uni.$on('refresh', () => {
				this.list = [];
				this.current = 0
				this.mescroll.resetUpScroll();
			})
		},
		onUnload() {
			uni.$off('refresh')
		},
		methods: {
			upCallback(page) {
				let query = {
					currentPage: page.num,
					pageSize: page.size,
					keyword: this.keyword
				}
				const method = this.current ? getReceiveList : getSendList
				method(query, {
					load: page.num == 1
				}).then(res => {
					this.mescroll.endSuccess(res.data.list.length);
					if (page.num == 1) this.list = [];
					const list = res.data.list.map(o => ({
						show: false,
						...o
					}));
					this.list = this.list.concat(list);
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
			open(index) {
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			handleClick(index, index1) {
				const item = this.list[index]
				delLog(item.id).then(res => {
					this.$u.toast(res.msg)
					this.list.splice(index, 1)
					if (!this.list.length) this.mescroll.resetUpScroll()
				})
			},
			goDetail(id) {
				const url = './form?type=' + this.current + (id ? '&id=' + id : '')
				uni.navigateTo({
					url: url
				})
			},
			change(index) {
				this.current = index;
				this.mescroll.resetUpScroll()
			},
			search() {
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(() => {
					this.list = [];
					this.mescroll.resetUpScroll();
				}, 300)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.reportLog-v {

		.log-list {
			width: 100%;
			margin-bottom: 20rpx;
			color: #9a9a9a;

			.log-list-txt {
				padding: 16rpx 32rpx;

				.log-title {
					justify-content: space-between;

					.title {
						color: #333333;
						width: 500rpx;
					}
				}
			}
		}
	}
</style>
