<template>
	<view class="allApp-v">
		<mescroll-uni ref="mescrollRef" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption"
			:bottombar="false" :sticky="false">
			<view>
				<view class="usualList">
					<view class=" caption u-m-b-20">常用流程<text class="tip">最多只能添加11个</text></view>
					<view class="u-flex u-flex-wrap">
						<view class="item u-flex-col u-col-center" v-for="(item,i) in usualList" :key="i">
							<text class="u-font-40 item-icon" :class="item.icon"
								:style="{'background':item.iconBackground||'#008cff'}" />
							<text class="u-font-24 u-line-1 item-text">{{item.fullName}}</text>
						</view>
					</view>
				</view>
				<view class="caption">全部流程</view>
				<view class="tabs_box">
					<u-sticky>
						<view class="sticky">
							<u-tabs :list="categoryList" :current="current" @change="change" name='fullName'
								inactive-color="#999999">
							</u-tabs>
						</view>
					</u-sticky>
				</view>
				<view class="allList">
					<view v-for="(item,i) in allList" :key="i">
						<view class="u-flex childList-item u-p-b-28">
							<text class="u-font-40 item-icon" :class="item.icon"
								:style="{'background':item.iconBackground||'#008cff'}" />
							<text class="u-font-32 item-text u-m-l-28 u-m-r-28 u-line-2">{{item.fullName}}</text>
							<view class="btnBox">
								<u-button :custom-style="customStyle" @click="handelAdd(item)" v-if="!item.isData">添加
								</u-button>
								<u-button :custom-style="customStyle" type="error" @click="handelDel(item)" v-else>
									移除
								</u-button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		getFlowList,
		getDataList,
		getUsualList,
		addUsual,
		delUsual
	} from '@/api/apply/apply.js'
	import resources from '@/libs/resources.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		props: {
			categoryList: {
				type: Array,
				default () {
					return [];
				}
			},
		},
		data() {
			return {
				usualList: [],
				current: 0,
				customStyle: {
					width: "128rpx",
					fontSize: "24rpx",
					height: '60rpx'
				},
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
						fixed: false,
						top: "560rpx",
					},
					textNoMore: '没有更多数据',
				},
				category: '',
				allList: [],
				type: '1',
				loading: false,
				fullName: '',
			}
		},
		methods: {
			init() {
				this.getUsualList()
			},
			getUsualList() {
				getUsualList(this.type).then(res => {
					this.usualList = res.data.list.map(o => {
						const objectData = o.objectData ? JSON.parse(o.objectData) : {}
						return {
							...o,
							...objectData
						}
					})
				})
			},
			upCallback(page) {
				let query = {
					currentPage: page.num,
					pageSize: page.size,
					category: this.category == 0 ? '' : this.category
				}
				this.loading = false
				getFlowList(query, {
					load: page.num == 1
				}).then(res => {
					this.mescroll.endSuccess(res.data.list.length);
					if (page.num == 1) this.allList = [];
					const list = res.data.list || [];
					this.allList = this.allList.concat(list);
				}).catch(() => {
					this.mescroll.endSuccess(0);
					this.mescroll.endErr();
				})
			},
			handelAdd(item) {
				if (this.usualList.length >= 11) {
					uni.showToast({
						title: '最多只能添加11个常用流程',
						icon: 'none'
					})
					return
				}
				const query = {
					objectType: this.type,
					objectId: item.id,
					objectData: JSON.stringify(item)
				}
				addUsual(query).then(res => {
					this.usualList.push(item)
					item.isData = true
					uni.$emit('updateUsualList')
					uni.showToast({
						title: res.msg
					})
				})
			},
			handelDel(item) {
				delUsual(item.id).then(res => {
					this.usualList = this.usualList.filter(o => o.id !== item.id)
					item.isData = false
					uni.$emit('updateUsualList')
					uni.showToast({
						title: res.msg
					})
				})
			},
			change(index) {
				this.current = index;
				this.category = !this.categoryList[index].enCode ? '' : this.categoryList[index].enCode
				this.allList = [];
				this.mescroll.resetUpScroll()
			}
		}
	}
</script>

<style lang="scss">
	.allApp-v {


		.caption {
			font-size: 36rpx;
			line-height: 80rpx;
			padding: 0 32rpx;

			.tip {
				margin-left: 20rpx;
				font-size: 24rpx;
				color: #999;
			}
		}

		.tabs_box {
			width: 100%;

			//#ifdef MP-WEIXIN
			.sticky {
				width: 750rpx;
				height: 120rpx;
				color: #fff;
				padding-right: 32rpx;
			}

			//#endif
		}

		.usualList {
			margin-bottom: 20rpx;

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
				}

				.item-text {
					width: 100%;
					text-align: center;
					padding: 0 16rpx;
				}
			}
		}

		.allList {
			padding: 0 32rpx;
			margin-top: 20rpx;

			.childList-item {
				align-items: center;

				.item-text {
					width: calc(100% - 216rpx);
				}

				.item-icon {
					width: 88rpx;
					height: 88rpx;
					line-height: 88rpx;
					text-align: center;
					border-radius: 20rpx;
					color: #FFFFFF;
					flex-shrink: 0;
					font-size: 56rpx;
				}
			}
		}
	}
</style>
