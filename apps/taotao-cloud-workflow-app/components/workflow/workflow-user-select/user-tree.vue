<template>
	<view class="u-select">
		<u-popup :maskCloseAble="maskCloseAble" mode="right" :popup="false" v-model="value" length="auto"
			:safeAreaInsetBottom="safeAreaInsetBottom" @close="close" :z-index="uZIndex" width="100%">
			<view class="u-select">
				<view class="u-select__body u-select__body__treeSelect">
					<view class="u-flex u-select-head">
						<text class="icon-ym icon-ym-report-icon-preview-pagePre backIcon"
							@tap="getResult('cancel')"></text>
						<view class="title">
							选择用户
						</view>
					</view>
					<view class="treeSelect-search">
						<u-search placeholder="请输入关键词搜索" v-model="keyword" height="72" :show-action="false"
							@change="search(swiperCurrent)" bg-color="#f0f2f6" shape="square">
						</u-search>
					</view>
					<view class="alreadySelect">
						<view class="alreadySelect__box u-flex-col">
							<view class="alreadySelect_hd u-flex">
								<view>已选</view>
								<view v-if="multiple" @click="setCheckAll" style="color: #2979ff;">清空列表
								</view>
							</view>
							<view class="select__box u-flex-col">
								<scroll-view scroll-y="true" style="max-height: 150rpx;">
									<view class="u-flex select__list">
										<u-tag closeable @close="delSelect(index)" v-for="(list,index) in selectList"
											:key="index" :text="list.fullName" class="u-selectTag" />
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
					<!-- tabs切换 -->
					<view class="search-box_sticky u-userSelect_sticky">
						<!-- #ifdef MP-WEIXIN -->
						<u-tabs-swiper activeColor="#1890ff" ref="tabs" :list="tabsList" :current="current"
							@change="change" :is-scroll="false" :show-bar="false"></u-tabs-swiper>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<u-tabs-swiper activeColor="#1890ff" ref="tabs" :list="tabsList" :current="current"
							@change="change" :is-scroll="false"></u-tabs-swiper>
						<!-- #endif -->
					</view>
					<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
						class="swiper-box">

						<swiper-item class="swiper-item">
							<view class="tree-box">
								<scroll-view :scroll-y="true" style="height: 100%">
									<ly-tree ref="tree" :node-key="realProps.value" :expand-on-click-node="true"
										:tree-data="options0" check-on-click-node :show-checkbox="false"
										:default-expand-all="false" :highlight-current="true"
										@node-click="handleNodeClick" :props="realProps" :show-node-icon="true"
										:show-radio="false" :load="loadNode" lazy />
								</scroll-view>
							</view>
						</swiper-item>

						<swiper-item class="swiper-item">
							<view class="tree-box">
								<scroll-view :scroll-y="true" style="height: 100%">
									<ly-tree ref="tree" :node-key="realProps.value" :expand-on-click-node="true"
										check-on-click-node :show-checkbox="false" :default-expand-all="false"
										:highlight-current="true" @node-click="handleNodeClick" :props="realProps"
										:show-node-icon="true" :show-radio="false" :tree-data="options" />
								</scroll-view>
							</view>
						</swiper-item>
						<swiper-item class="swiper-item">
							<view class="tree-box">
								<scroll-view :scroll-y="true" style="height: 100%">
									<ly-tree ref="tree" :node-key="realProps.value" :expand-on-click-node="true"
										check-on-click-node :show-checkbox="false" :default-expand-all="false"
										:highlight-current="true" @node-click="handleNodeClick" :props="realProps"
										:show-node-icon="true" :show-radio="false" :tree-data="options" />
								</scroll-view>
							</view>
						</swiper-item>
					</swiper>
					<!-- 底部按钮 -->
					<view class="flowBefore-actions">
						<template>
							<u-button class="buttom-btn" @click="getResult('cancel')">
								{{'取消'}}
							</u-button>
							<u-button class="buttom-btn" type="primary" @click.stop="getResult('confirm')">
								{{'确定'}}
							</u-button>
						</template>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	/**
	 * tree-select 树形选择器
	 * @property {Boolean} v-model 布尔值变量，用于控制选择器的弹出与收起
	 * @property {Boolean} safe-area-inset-bottom 是否开启底部安全区适配(默认false)
	 * @property {String} cancel-color 取消按钮的颜色（默认#606266）
	 * @property {String} confirm-color 确认按钮的颜色(默认#2979ff)
	 * @property {String} confirm-text 确认按钮的文字
	 * @property {String} cancel-text 取消按钮的文字
	 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭Picker(默认true)
	 * @property {String Number} z-index 弹出时的z-index值(默认10075)
	 * @event {Function} confirm 点击确定按钮，返回当前选择的值
	 */
	const defaultProps = {
		label: 'fullName',
		value: 'id',
		icon: 'icon',
		children: 'children'
	}
	import {
		getUserSelectorNew,
		getSubordinates,
		getOrganization
	} from '@/api/common.js'
	import LyTree from '@/components/ly-tree/ly-tree.vue'
	export default {
		name: "tree-select",
		components: {
			LyTree
		},
		props: {

			selectedData: {
				type: Array,
				default () {
					return [];
				}
			},
			// 是否显示边框
			border: {
				type: Boolean,
				default: true
			},
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},
			// "取消"按钮的颜色
			cancelColor: {
				type: String,
				default: '#606266'
			},
			// "确定"按钮的颜色
			confirmColor: {
				type: String,
				default: '#2979ff'
			},
			// 弹出的z-index值
			zIndex: {
				type: [String, Number],
				default: 0
			},
			safeAreaInsetBottom: {
				type: Boolean,
				default: false
			},
			// 是否允许通过点击遮罩关闭Picker
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			props: {
				type: Object,
				default: () => ({
					label: 'fullName',
					value: 'id',
					icon: 'icon',
					children: 'children',
					isLeaf: 'isLeaf'
				})
			},
			//多选
			multiple: {
				type: Boolean,
				default: false
			},
			// 顶部标题
			title: {
				type: String,
				default: ''
			},
			// 取消按钮的文字
			cancelText: {
				type: String,
				default: '取消'
			},
			// 确认按钮的文字
			confirmText: {
				type: String,
				default: '确认'
			}
		},
		data() {
			return {
				moving: false,
				selectList: [],
				keyword: '',
				tabsList: [{
						name: '全部数据'
					},
					{
						name: '当前组织'
					},
					{
						name: '我的下属'
					}
				],
				current: 0,
				swiperCurrent: 0,
				options: [],
				options0: [],
			};
		},
		watch: {
			// 在select弹起的时候，重新初始化所有数据
			value: {
				immediate: true,
				handler(val) {
					if (val) setTimeout(() => this.init(), 10);
				}
			},
		},
		computed: {
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
			},
			realProps() {
				return {
					...defaultProps,
					...this.props
				}
			}
		},
		methods: {
			init() {
				this.selectList = JSON.parse(JSON.stringify(this.selectedData))
			},
			loadNode(node, resolve) {
				if (node.level === 0) {
					getUserSelectorNew(node.level).then(res => {
						resolve(res.data.list)
					})
				} else {
					getUserSelectorNew(node.data.id).then(res => {
						const data = res.data.list
						resolve(data)
					})
				}
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				this.keyword = ''
				if (this.swiperCurrent !== 0) this.handOff(this.swiperCurrent)
			},
			handOff(swiperCurrent) {
				let method;
				switch (swiperCurrent) {
					case 1:
						method = getOrganization;
						break;
					case 2:
						method = getSubordinates;
						break;
				}
				method(this.keyword).then(res => {
					this.options = res.data
				})
			},
			search(index) {
				if (index !== 0) this.handOff(index)
				getUserSelectorNew(0, this.keyword).then(res => {
					this.options0 = res.data.list
				})
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				if (this.swiperCurrent !== 0) this.handOff(this.swiperCurrent)
			},
			handleNodeClick(obj) {
				if (this.swiperCurrent === 0 && obj.data.type !== 'user') return
				if (!this.multiple) {
					this.selectList = []
				}
				var isExist = false;
				for (var i = 0; i < this.selectList.length; i++) {
					if (this.selectList[i].id == obj.data.id) {
						isExist = true;
						break;
					}
				}!isExist && this.selectList.push(obj.data);
			},
			delSelect(index) {
				this.selectList.splice(index, 1);
			},
			setCheckAll() {
				this.selectList = [];
				this.$refs.tree.setCheckAll(false);
			},

			// 点击确定或者取消
			getResult(event = null) {
				// #ifdef MP-WEIXIN
				if (this.moving) return;
				// #endif
				this.keyword = '';
				if (event === 'cancel') return this.close();
				// if(this.selectList.length === 0) return this.$u.toast('还未选择人员！')
				this.$emit(event, this.selectList);
				this.close();
			},
			// 标识滑动开始，只有微信小程序才有这样的事件
			pickstart() {
				// #ifdef MP-WEIXIN
				this.moving = true;
				// #endif
			},
			// 标识滑动结束
			pickend() {
				// #ifdef MP-WEIXIN
				this.moving = false;
				// #endif
			},
			filterNode(value, data) {
				if (!value) return true;
				// #ifndef MP
				return data[this.realProps.label].indexOf(value) !== -1;
				// #endif
				// #ifdef MP
				return this.label.indexOf(value) !== -1;
				// #endif
			},
			close() {
				this.$emit('input', false);
			}
		}
	};
</script>

<style scoped lang="scss">
	@import "@/uview-ui/libs/css/style.components.scss";

	.u-select {
		height: 100% !important;

		.u-select__body__treeSelect {
			height: 100% !important;
			display: flex;
			flex-direction: column;

			.swiper-box {
				height: 100%;
				padding-bottom: 96rpx;
			}


			.alreadySelect {
				width: 100%;
				padding: 0 44rpx 0;

				.alreadySelect__box {
					.alreadySelect_hd {
						width: 100%;
						height: 60rpx;
						justify-content: space-between;
					}

					.select__box {
						width: 100%;
						justify-content: center;
						border-bottom: 1rpx solid #c0c4cc;

						.select__list {
							justify-content: flex-start;
							flex-wrap: wrap;
							padding-top: 10rpx;

							.u-selectTag {
								margin-bottom: 10rpx;
								margin-left: 10rpx;
							}

							.u-size-default {
								padding: 6rpx 12rpx;
							}
						}
					}
				}
			}


			// .alreadySelect {
			// 	width: 100%;

			// 	.alreadySelect__box {

			// 		.alreadySelect_hd {
			// 			display: flex;
			// 			flex-direction: row;
			// 			justify-content: space-between;
			// 			margin: 0 40rpx;
			// 		}

			// 		.select__box {
			// 			margin: 0 40rpx 40rpx;
			// 			border: 1rpx solid #f4f6f8;
			// 			display: flex;
			// 			flex-direction: row;
			// 			flex-wrap: wrap;
			// 			justify-content: flex-start;
			// 			box-shadow: 0px 4px 6px #f4f6f8;

			// 			.alreadySelect__content {
			// 				.u-size-default {
			// 					margin-left: 10rpx;
			// 					padding: 10rpx;
			// 				}
			// 			}
			// 		}
			// 	}
			// }

			.flowBefore-actions {
				background-color: #fff;
				position: fixed;
				bottom: 0;
				display: flex;
				width: 100%;
				height: 88rpx;
				box-shadow: 0 -2rpx 8rpx #e1e5ec;
				z-index: 999999;

				.buttom-btn {
					width: 100%;
					/* #ifndef MP */
					height: 88rpx !important;
					line-height: 88rpx !important;
					border-radius: 0 !important;

					&::after {
						border: none !important;
					}

					/* #endif */
					/* #ifdef MP */
					.u-btn {
						width: 100%;
						height: 88rpx !important;
						line-height: 88rpx !important;
						border-radius: 0 !important;

						&::after {
							border: none !important;
						}
					}

					/* #endif */
				}
			}
		}

		&__action {
			position: relative;
			line-height: $u-form-item-height;
			height: $u-form-item-height;

			&__icon {
				position: absolute;
				right: 20rpx;
				top: 50%;
				transition: transform .4s;
				transform: translateY(-50%);
				z-index: 1;

				&--reverse {
					transform: rotate(-180deg) translateY(50%);
				}
			}
		}

		&__hader {
			&__title {
				color: $u-content-color;
			}
		}

		&--border {
			border-radius: 6rpx;
			border-radius: 4px;
			border: 1px solid $u-form-item-border-color;
		}

		&__header {
			@include vue-flex;
			align-items: center;
			justify-content: space-between;
			height: 80rpx;
			padding: 0 40rpx;
		}

		&__body {
			width: 100%;
			height: 500rpx;
			overflow: hidden;
			background-color: #fff;

			&__picker-view {
				height: 100%;
				box-sizing: border-box;

				&__item {
					@include vue-flex;
					align-items: center;
					justify-content: center;
					font-size: 32rpx;
					color: $u-main-color;
					padding: 0 8rpx;
				}
			}
		}
	}
</style>
