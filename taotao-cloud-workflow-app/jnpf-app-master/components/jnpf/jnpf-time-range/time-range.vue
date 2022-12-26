<template>
	<u-popup :maskCloseAble="maskCloseAble" mode="bottom" :popup="false" v-model="value" length="auto"
		:safeAreaInsetBottom="safeAreaInsetBottom" @close="close" :z-index="uZIndex">
		<view class="u-datetime-picker">
			<view class="u-picker-header" @touchmove.stop.prevent="">
				<view class="u-btn-picker u-btn-picker--tips" :style="{ color: cancelColor }" hover-class="u-opacity"
					:hover-stay-time="150" @tap="getResult('cancel')">{{cancelText}}</view>
				<view class="u-picker__title">{{ title }}</view>
				<view class="u-btn-picker u-btn-picker--primary" :style="{ color: moving ? cancelColor : confirmColor }"
					hover-class="u-opacity" :hover-stay-time="150" @touchmove.stop="" @tap.stop="getResult('confirm')">
					{{confirmText}}
				</view>
			</view>
			<view class="u-picker-body">
				<picker-view :value="valueArr" @change="change" class="u-picker-view" @pickstart="pickstart"
					@pickend="pickend">
					<picker-view-column v-if="!reset">
						<view class="u-column-item" v-for="(item, index) in hours" :key="index">
							{{ item }}
							<text class="u-text" v-if="showTimeTag">时</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset">
						<view class="u-column-item" v-for="(item, index) in minutes" :key="index">
							{{ item }}
							<text class="u-text" v-if="showTimeTag">分</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset">
						<view class="u-column-item" v-for="(item, index) in seconds" :key="index">
							{{ item }}
							<text class="u-text" v-if="showTimeTag">秒</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset">
						<view class="u-column-item">-</view>
					</picker-view-column>
					<picker-view-column v-if="!reset">
						<view class="u-column-item" v-for="(item, index) in hours" :key="index">
							{{ item }}
							<text class="u-text" v-if="showTimeTag">时</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset">
						<view class="u-column-item" v-for="(item, index) in minutes" :key="index">
							{{ item }}
							<text class="u-text" v-if="showTimeTag">分</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset">
						<view class="u-column-item" v-for="(item, index) in seconds" :key="index">
							{{ item }}
							<text class="u-text" v-if="showTimeTag">秒</text>
						</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	/**
	 * time-range弹出选择器
	 * @property {String Number} start-year 可选的开始年份（默认1950）
	 * @property {String Number} end-year 可选的结束年份（默认2050）
	 * @property {Boolean} safe-area-inset-bottom 是否开启底部安全区适配（默认false）
	 * @property {Boolean} show-time-tag 时间模式时，是否显示后面的年月日中文提示
	 * @property {String} cancel-color 取消按钮的颜色（默认#606266）
	 * @property {String} confirm-color 确认按钮的颜色（默认#2979ff）
	 * @property {String} default-time 默认选中的时间
	 * @property {String} confirm-text 确认按钮的文字
	 * @property {String} cancel-text 取消按钮的文字
	 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭Picker（默认true）
	 * @property {String Number} z-index 弹出时的z-index值（默认1075）
	 * @property {Array} default-selector 数组形式，其中每一项表示选择了range对应项中的第几个
	 * @event {Function} confirm 点击确定按钮，返回当前选择的值
	 * @event {Function} cancel 点击取消按钮，返回当前选择的值
	 */
	export default {
		name: 'u-picker',
		props: {
			// 年份开始时间
			startYear: {
				type: [String, Number],
				default: 1950
			},
			// 年份结束时间
			endYear: {
				type: [String, Number],
				default: 2050
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
			// 默认显示的时间
			defaultTime: {
				type: Array,
				default: () => []
			},
			// 时间模式时，是否显示后面的年月日中文提示
			showTimeTag: {
				type: Boolean,
				default: true
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
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},
			// 弹出的z-index值
			zIndex: {
				type: [String, Number],
				default: 0
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
				hours: [],
				minutes: [],
				seconds: [],
				hour: 0,
				minute: 0,
				second: 0,
				reset: false,
				startDate: '',
				endDate: '',
				valueArr: [0, 0, 0, 0, 0, 0, 0],
				moving: false // 列是否还在滑动中，微信小程序如果在滑动中就点确定，结果可能不准确
			};
		},
		mounted() {
			this.init();
		},
		computed: {
			propsChange() {
				// 引用这几个变量，是为了监听其变化
				return `${this.defaultTime}`;
			},
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
			}
		},
		watch: {
			propsChange() {
				this.reset = true;
				setTimeout(() => this.init(), 10);
			},
			// 微信和QQ小程序由于一些奇怪的原因(故同时对所有平台均初始化一遍)，需要重新初始化才能显示正确的值
			value(n) {
				if (n) {
					this.reset = true;
					setTimeout(() => this.init(), 10);
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
			// 小于10前面补0，用于月份，日期，时分秒等
			formatNumber(num) {
				return +num < 10 ? '0' + num : String(num);
			},
			// 生成递进的数组
			generateArray: function(start, end) {
				// 转为数值格式，否则用户给end-year等传递字符串值时，下面的end+1会导致字符串拼接，而不是相加
				start = Number(start);
				end = Number(end);
				end = end > start ? end : start;
				// 生成数组，获取其中的索引，并剪出来
				let list = [...Array(end + 1).keys()].slice(start)
				list = list.map(o => this.formatNumber(o))
				return list;
			},
			getIndex: function(arr, val) {
				let index = arr.indexOf(val);
				// 如果index为-1(即找不到index值)，~(-1)=-(-1)-1=0，导致条件不成立
				return ~index ? index : 0;
			},
			//日期时间处理
			initTimeValue() {
				if (this.defaultTime.length === 2) {
					const arr1 = this.defaultTime[0].split(':')
					const arr2 = this.defaultTime[1].split(':')
					this.valueArr[0] = this.getIndex(this.hours, arr1[0])
					this.valueArr[1] = this.getIndex(this.minutes, arr1[1])
					this.valueArr[2] = this.getIndex(this.seconds, arr1[2])
					this.valueArr[4] = this.getIndex(this.hours, arr2[0])
					this.valueArr[5] = this.getIndex(this.minutes, arr2[1])
					this.valueArr[6] = this.getIndex(this.seconds, arr2[2])
				} else {
					const time = new Date()
					const currHour = this.formatNumber(time.getHours())
					const currMinute = this.formatNumber(time.getMinutes())
					const currSecond = this.formatNumber(time.getSeconds())
					this.valueArr[0] = this.getIndex(this.hours, currHour)
					this.valueArr[4] = this.getIndex(this.hours, currHour)
					this.valueArr[1] = this.getIndex(this.minutes, currMinute)
					this.valueArr[5] = this.getIndex(this.minutes, currMinute)
					this.valueArr[2] = this.getIndex(this.seconds, currSecond)
					this.valueArr[6] = this.getIndex(this.seconds, currSecond)
				}
			},
			init() {
				this.valueArr = [0, 0, 0, 0, 0, 0, 0];
				this.reset = false;
				this.hours = this.generateArray(0, 23);
				this.minutes = this.generateArray(0, 59);
				this.seconds = this.generateArray(0, 59);
				this.initTimeValue();
				this.$forceUpdate();
			},
			close() {
				this.$emit('input', false);
			},
			// 用户更改picker的列选项
			change(e) {
				this.valueArr = e.detail.value;
			},
			// 用户点击确定按钮
			getResult(event = null) {
				// #ifdef MP-WEIXIN
				if (this.moving) return;
				// #endif
				const valueArr = this.valueArr.map(o => this.formatNumber(o))
				const item1 = `${valueArr[0]}:${valueArr[1]}:${valueArr[2]}`
				const item2 = `${valueArr[4]}:${valueArr[5]}:${valueArr[6]}`
				const result = [item1, item2]
				if (event) this.$emit(event, result);
				this.close();
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import "@/uview-ui/libs/css/style.components.scss";

	.u-datetime-picker {
		position: relative;
		z-index: 999;
	}

	.u-picker-view {
		height: 100%;
		box-sizing: border-box;
	}

	.u-picker-header {
		width: 100%;
		height: 90rpx;
		padding: 0 40rpx;
		@include vue-flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		font-size: 30rpx;
		background: #fff;
		position: relative;
	}

	.u-picker-header::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.u-picker__title {
		color: $u-content-color;
	}

	.u-picker-body {
		width: 100%;
		height: 500rpx;
		overflow: hidden;
		background-color: #fff;
	}

	.u-column-item {
		@include vue-flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: $u-main-color;
		padding: 0 8rpx;
	}

	.u-text {
		font-size: 24rpx;
		padding-left: 8rpx;
	}

	.u-btn-picker {
		padding: 16rpx;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;
	}

	.u-opacity {
		opacity: 0.5;
	}

	.u-btn-picker--primary {
		color: $u-type-primary;
	}

	.u-btn-picker--tips {
		color: $u-tips-color;
	}
</style>
