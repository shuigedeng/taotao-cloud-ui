<template>
	<view class="workFlow-v">
		<view class="search-box_sticky">
			<view class="head-tabs u-flex u-row-around">
				<view class="head-tabs-item" @click="openPage('/pages/workFlow/flowLaunch/index')">
					<text class="icon-ym icon-ym-flowLaunch-app u-m-r-4 icon-style" />
					<text>我发起的</text>
				</view>
				<view class="head-tabs-item" @click="openPage('/pages/workFlow/flowTodo/index')">
					<text class="icon-ym icon-ym-flowTodo-app u-m-r-4 icon-style" />
					<text>待办事宜</text>
				</view>
				<view class="head-tabs-item" @click="openPage('/pages/workFlow/flowDone/index')">
					<text class="icon-ym icon-ym-flowDone-app u-m-r-4 icon-style" />
					<text>已办事宜</text>
				</view>
				<view class="head-tabs-item" @click="openPage('/pages/workFlow/flowCopy/index')">
					<text class="icon-ym icon-ym-flowCopy-app u-m-r-4 icon-style" />
					<text>抄送我的</text>
				</view>
			</view>
			<view class="search-box">
				<u-search placeholder="请输入关键词搜索" v-model="keyword" height="72" :show-action="false" @change="search"
					bg-color="#f0f2f6" shape="square">
				</u-search>
			</view>
			<u-tabs :list="categoryList" :current="current" @change="change" :is-scroll='true' name="fullName">
			</u-tabs>
		</view>
		<mescroll-body ref="mescrollRef" @down="downCallback" :down="downOption" :sticky="false" @up="upCallback"
			:up="upOption" :bottombar="false" style="min-height: 100%;" @init="mescrollInit">
			<view class="workFlow-list">
				<view class="part">
					<view class="caption">常用表单</view>
					<view class="u-flex u-flex-wrap">
						<view class="item u-flex-col u-col-center" v-for="(item,i) in usualList" :key="i"
							@click="handelClick(item)">
							<text class="u-font-40 item-icon" :class="item.icon"
								:style="{'background':item.iconBackground||'#008cff'}" />
							<text class="u-font-24 u-line-1 item-text">{{item.fullName}}</text>
						</view>
						<view class="item u-flex-col u-col-center" @click="moreApp">
							<text class="u-font-40 item-icon more">+</text>
							<text class="u-font-24 u-line-1 item-text">添加</text>
						</view>
					</view>
				</view>
				<view class="part">
					<view class="caption u-line-1" v-if="list.length >= 1">{{current === 0 ? "全部流程" : fullName}}</view>
					<view class="u-flex u-flex-wrap">
						<view class="item u-flex-col u-col-center" v-for="(child,ii) in list" :key="ii"
							@click="handelClick(child)">
							<text class="u-font-40 item-icon" :class="child.icon"
								:style="{'background':child.iconBackground||'#008cff'}" />
							<text class="u-font-24 u-line-1 item-text">{{child.fullName}}</text>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		FlowEngineListAll,
		FlowEnginePageList
	} from '@/api/workFlow/flowEngine'
	import {
		getUsualList
	} from '@/api/apply/apply.js'
	import resources from '@/libs/resources.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import IndexMixin from './mixin.js'
	export default {
		mixins: [MescrollMixin, IndexMixin],
		data() {
			return {
				usualList: [],
				downOption: {
					use: true,
					auto: true
				},
				className: '',
				upOption: {
					page: {
						num: 0,
						size: 50,
						time: null
					},
					empty: {
						use: true,
						icon: resources.message.nodata,
						tip: "暂无数据",
						fixed: false,
						top: "560rpx",
					},
					textNoMore: '没有更多数据',
				},
				keyword: '',
				category: '',
				current: 0,
				categoryList: [{
					fullName: '全部流程'
				}],
				list: [],
				fullName: '',
				loading: false
			}
		},
		onLoad() {
			uni.$on('updateUsualList', data => {
				this.getUsualList()
			})
			this.getPaymentMethodOptions()
			uni.$on('refresh', () => {
				this.list = [];
				this.current = 0
				this.mescroll.resetUpScroll();
			})
		},
		onUnload() {
			uni.$off('updateUsualList')
		},
		methods: {
			openPage(path) {
				if (!path) return
				uni.navigateTo({
					url: path
				})
			},
			upCallback(page) {
				this.$nextTick(() => {
					this.getUsualList()
				})
				let query = {
					currentPage: page.num,
					pageSize: page.size,
					keyword: this.keyword,
					category: this.category == 0 ? '' : this.category
				}
				this.loading = false
				FlowEnginePageList(query, {
					load: page.num == 1
				}).then(res => {
					let resData = res.data.list || [];
					this.mescroll.endSuccess(resData.length);
					if (page.num == 1) this.list = [];
					const list = resData.map(o => ({
						show: false,
						...o
					}));
					this.list = this.list.concat(list);
					this.loading = true
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

			change(index) {
				this.current = index;
				this.fullName = this.categoryList[index].fullName
				this.category = !this.categoryList[index].enCode ? '' : this.categoryList[index].enCode
				this.list = [];
				this.mescroll.resetUpScroll()
			},
			//获取常用
			getUsualList() {
				getUsualList(1).then(res => {
					this.usualList = res.data.list.map(o => {
						const objectData = o.objectData ? JSON.parse(o.objectData) : {}
						return {
							...o,
							...objectData
						}
					})
				})
			},
			getPaymentMethodOptions() {
				this.$store.dispatch('base/getDictionaryData', {
					sort: 'WorkFlowCategory'
				}).then(res => {
					res.forEach(i => {
						this.categoryList.push(i)
					})
				})
			},
			moreApp() {
				uni.navigateTo({
					url: '/pages/workFlow/allApp/index?categoryList=' + encodeURIComponent(JSON.stringify(this
						.categoryList))
				})
			},
			handelClick(item) {
				const config = {
					id: '',
					enCode: item.enCode,
					flowId: item.id,
					formType: item.formType,
					opType: '-1',
					taskNodeId: '',
					fullName: item.fullName
				}
				uni.navigateTo({
					url: '/pages/workFlow/flowBefore/index?config=' + encodeURIComponent(JSON.stringify(config))
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.workFlow-v {
		.search-box_sticky {
			margin-bottom: 20rpx;

			.search-box {
				padding: 20rpx
			}
		}

		.head-tabs {
			width: 100%;
			padding: 0 32rpx;
			height: 132rpx;

			.head-tabs-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #666666;
				line-height: 40rpx;

				.icon-style {
					font-size: 48rpx;
					color: #606266;
					margin-bottom: 24rpx;
				}
			}
		}

		.workFlow-list {
			padding: 0rpx 20rpx 0;

			.part {
				background: #fff;
				border-radius: 8rpx;
				margin-bottom: 20rpx;

				.caption {
					padding-left: 32rpx;
					font-size: 36rpx;
					line-height: 100rpx;
					font-weight: bold;
				}

				.item {
					margin-bottom: 32rpx;
					width: 25%;

					.item-icon {
						width: 88rpx;
						height: 88rpx;
						margin-bottom: 8rpx;
						line-height: 88rpx;
						text-align: center;
						border-radius: 20rpx;
						color: #fff;
						font-size: 56rpx;

						&.more {
							background: #ECECEC;
							color: #666666;
							font-size: 50rpx;
						}
					}

					.item-text {
						width: 100%;
						text-align: center;
						padding: 0 16rpx;
					}
				}
			}
		}
	}
</style>
