<template>
	<view class="apply-v">
		<view class="search-box_sticky search-box">
			<u-search placeholder="请输入关键词搜索" v-model="keyword" height="72" :show-action="false" @change="search"
				bg-color="#f0f2f6" shape="square">
			</u-search>
		</view>
		<view class="banner">
			<u-swiper :list="bannerList" height="300"></u-swiper>
		</view>
		<view class="notice-bar">
			<u-notice-bar :list="['你好朋友，感谢使用JNPF快速开发平台新版本']" type="none"></u-notice-bar>
		</view>
		<mescroll-body ref="mescrollRef" @down="downCallback" :bottombar="false" :down="downOption" :sticky="false"
			@up="upCallback" :up="upOption" @init="mescrollInit">
			<view class="workFlow-list">
				<view class="part">
					<view class="caption">常用应用</view>
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
				<view class="part" v-for="(item,i) in menuList" :key="i"
					v-if="!!item.children && item.children.length > 0">
					<view class="caption u-line-1">
						{{item.fullName}}
					</view>
					<view class="u-flex u-flex-wrap">
						<view class="item u-flex-col u-col-center" v-for="(child,ii) in item.children" :key="ii"
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
		getMenuList,
		getUsualList
	} from '@/api/apply/apply.js'
	import chat from '@/libs/chat.js'
	import resources from '@/libs/resources.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js"
	import IndexMixin from './mixin.js'
	export default {
		mixins: [MescrollMixin, IndexMixin],
		data() {
			return {
				bannerList: [{
						image: resources.banner.home1Url,
					},
					{
						image: resources.banner.home2Url,
					},
					{
						image: resources.banner.home3Url
					}
				],
				usualList: [],
				menuList: [],
				downOption: {
					use: true,
					auto: true
				},
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
			};
		},
		computed: {
			baseURL() {
				return this.define.comUploadUrl
			},
			token() {
				return this.$store.getters.token
			},
			report() {
				return this.define.report
			}
		},
		onLoad() {
			if (!this.$store.state.chat.socket) chat.initSocket()
			this.$store.dispatch('user/getCurrentUser')
			uni.$on('updateUsualList', data => {
				this.getUsualList()
			})
			uni.$on('refresh', () => {
				this.menuList = [];
				this.current = 0
				this.mescroll.resetUpScroll();
			})
		},
		onUnload() {
			uni.$off('updateUsualList')
		},
		methods: {
			search() {
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(() => {
					this.list = [];
					// this.mescroll.triggerDownScroll()
					this.mescroll.resetUpScroll();
				}, 300)
			},
			getUsualList() {
				getUsualList(2).then(res => {
					this.usualList = res.data.list.map(o => {
						const objectData = o.objectData ? JSON.parse(o.objectData) : {}
						return {
							...o,
							...objectData
						}
					})
				})
			},
			upCallback(keyword) {
				this.getUsualList()
				let query = {
					keyword: this.keyword
				}
				getMenuList(query).then(res => {
					let list = res.data.list || []
					this.mescroll.endSuccess(list.length);
					for (let i = 0; i < list.length; i++) {
						let children = list[i].children
						if (Array.isArray(children) && children.length) {
							for (let j = 0; j < children.length; j++) {
								let iconBackground = '',
									moduleId = ''
								if (children[j].propertyJson) {
									let propertyJson = JSON.parse(children[j].propertyJson)
									iconBackground = propertyJson.iconBackgroundColor || ''
									moduleId = propertyJson.moduleId || ''
								}
								this.$set(children[j], 'iconBackground', iconBackground)
								this.$set(children[j], 'moduleId', moduleId)
							}
						}
					}
					this.menuList = list
					this.mescroll.endSuccess(list.length, false);
					this.$store.dispatch('user/getCurrentUser')
				}).catch(() => {
					this.mescroll.endSuccess(0);
					this.mescroll.endErr();
				})
			},
			moreApp() {
				uni.navigateTo({
					url: '/pages/workFlow/allApp/index?type=2'
				})
			},
			handelClick(item) {
				if (item.type == 2) {
					uni.navigateTo({
						url: item.urlAddress +
							'?menuId=' + item.id,
						fail: (err) => {
							this.$u.toast("暂无此页面")
						}
					})
					return
				}
				if (item.type == 3) {
					if (!item.moduleId) {
						this.$u.toast("暂无此页面")
						return
					}
					uni.navigateTo({
						url: '/pages/apply/dynamicModel/index?id=' + item.moduleId + '&fullName=' + item.fullName +
							'&menuId=' + item.id,
						fail: (err) => {
							this.$u.toast("暂无此页面")
						}
					})
					return
				}
				if (item.type == 7 || item.type == 5) {
					let url = encodeURIComponent(item.urlAddress) +
						'&fullName=' + item.fullName
					if (item.type == 5) {
						url = encodeURIComponent(
							`${this.report}/preview.html?id=${item.moduleId}&token=${this.token}&page=1&from=menu`)
					}

					if (!item.urlAddress && item.type == 7) {
						this.$u.toast("暂无此页面")
						return
					}
					uni.navigateTo({
						url: '/pages/apply/externalLink/index?url=' + url,
						fail: (err) => {
							this.$u.toast("暂无此页面")
						}
					})





					// // #ifdef APP-PLUS
					// plus.runtime.openURL(item.urlAddress);
					// // #endif
					// // #ifndef APP-PLUS
					// uni.navigateTo({
					// 	url: '/pages/apply/externalLink/index?url=' + url,
					// 	fail: (err) => {
					// 		this.$u.toast("暂无此页面")
					// 	}
					// })
					// // #endif
					return
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.apply-v {
		.search-box {
			height: 112rpx;
			width: 100%;
			padding: 20rpx 20rpx;
			z-index: 10000;
			background: #fff;
		}

		.banner {
			padding: 0rpx 20rpx 20rpx;
			background-color: #fff;

			.u-indicator-item-round.u-indicator-item-round-active {
				background-color: $u-type-primary;
			}
		}

		.notice-bar {
			margin: 20rpx 20rpx 0;
			background: #fff;
			border-radius: 8rpx;
			z-index: 99;
		}

		.workFlow-list {
			padding: 20rpx 20rpx 0;

			.part {
				background: #fff;
				border-radius: 8rpx;
				margin-bottom: 20rpx;

				.caption {
					padding: 0 32rpx;
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
