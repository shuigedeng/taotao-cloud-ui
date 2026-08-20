<template>
	<view class="u-select">
		<u-popup :maskCloseAble="maskCloseAble" mode="bottom" :popup="false" v-model="value" length="auto"
			:safeAreaInsetBottom="safeAreaInsetBottom" @close="close" :z-index="uZIndex">
			<view class="u-select">
				<view class="u-select__header" @touchmove.stop.prevent="">
					<view class="u-select__header__cancel u-select__header__btn" :style="{ color: cancelColor }"
						hover-class="u-hover-class" :hover-stay-time="150" @tap="getResult('cancel')">
						{{cancelText}}
					</view>
					<view class="u-select__header__title">
						{{title}}
					</view>
					<view class="u-select__header__confirm u-select__header__btn"
						:style="{ color: moving ? cancelColor : confirmColor }" hover-class="u-hover-class"
						:hover-stay-time="150" @touchmove.stop="" @tap.stop="getResult('confirm')">
						{{confirmText}}
					</view>
				</view>
				<view class="u-select__body u-select__body__treeSelect">
					<view class="treeSelect-search">
						<u-input v-model="filterText" placeholder="输入关键字进行过滤" class="u-border-bottom"></u-input>
					</view>
					<view class="tree-box">
						<scroll-view :scroll-y="true" style="height: 100%">
							<ly-tree ref="tree" :node-key="realProps.value" :tree-data="options" :props="realProps"
								:show-node-icon="true" :filter-node-method="filterNode" child-visible-for-filter-node
								check-on-click-node :expand-on-click-node="false" default-expand-all
								:show-radio="!multiple" :show-checkbox="multiple" />
						</scroll-view>
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
	import LyTree from '@/components/ly-tree/ly-tree.vue'
	export default {
		name: "tree-select",
		components: {
			LyTree
		},
		props: {
			options: {
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
			defaultValue: {
				type: Array,
				default: () => []
			},
			props: {
				type: Object,
				default: () => ({
					label: 'fullName',
					value: 'id',
					icon: 'icon',
					children: 'children'
				})
			},
			// 只能选择最后一层的数值
			lastLevel: {
				type: Boolean,
				default: false
			},
			// 只能选择最后一层的数值时，需要根据lastLevelKey来判断是否最后一层
			lastLevelKey: {
				type: String,
				default: "hasChildren"
			},
			lastLevelValue: {
				default: false
			},
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
				filterText: '',
				moving: false
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
			filterText(val) {
				this.$refs.tree.filter(val);
			}
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
			init() {
				this.filterText = ''
				this.setSelectValue();
			},
			// 获取默认选中的值
			setSelectValue() {
				this.$nextTick(() => {
					this.$refs.tree.setCheckedKeys(this.defaultValue)
				})
			},
			close() {
				this.$emit('input', false);
			},
			// 点击确定或者取消
			getResult(event = null) {
				// #ifdef MP-WEIXIN
				if (this.moving) return;
				// #endif
				if (event) {
					let selectValue = this.$refs.tree.getCheckedNodes()
					if (this.lastLevel) {
						selectValue = selectValue.filter(o => o[this.lastLevelKey] == this.lastLevelValue)
					}
					if (event === 'confirm' && !selectValue.length) return
					this.$emit(event, selectValue);
				}
				this.close();
			}
		}
	};
</script>

<style scoped lang="scss">
	@import "@/uview-ui/libs/css/style.components.scss";

	.u-select {

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
