<template xlang="wxml" minapp="mpvue">
	<view class="tki-barcode">
		<!-- #ifndef MP-ALIPAY -->
		<canvas class="tki-barcode-canvas" :canvas-id="cid" :style="{width:canvasWidth+'px',height:canvasHeight+'px'}" />
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<canvas :id="cid" :width="canvasWidth" :height="canvasHeight" class="tki-barcode-canvas" />
		<!-- #endif -->
		<image v-show="show" :src="result" :style="{width:canvasWidth+'px',height:canvasHeight+'px'}" />
	</view>
</template>

<script>
// const barcode = require('./barcode.js');
import barCode from "./barcode.js"
const opations = {
	// format: "CODE128",//选择要使用的条形码类型 微信支持的条码类型有 code128\code39\ena13\ean8\upc\itf14\
	width: 4,//设置条之间的宽度
	height: 120,//高度
	displayValue: true,//是否在条形码下方显示文字
	// text: "1234567890",//覆盖显示的文本
	textAlign: "center",//设置文本的水平对齐方式
	textPosition: "bottom",//设置文本的垂直位置
	textMargin: 0,//设置条形码和文本之间的间距
	fontSize: 24,//设置文本的大小
	fontColor: "#000000",//设置文本的颜色
	lineColor: "#000000",//设置条形码的颜色
	background: "#FFFFFF",//设置条形码的背景色
	margin: 0,//设置条形码周围的空白边距
	marginTop: undefined,//设置条形码周围的上边距
	marginBottom: undefined,//设置条形码周围的下边距
	marginLeft: undefined,//设置条形码周围的左边距
	marginRight: undefined,//设置条形码周围的右边距
}
export default {
	name: "tkiBarcode",
	props: {
		show: {
			type: Boolean,
			default: true
		},
		cid: {
			type: String,
			default: 'tki-barcode-canvas'
		},
		unit: {
			type: String,
			default: 'upx'
		},
		val: {
			type: String,
			default: ''
		},
		format: {
			type: String,
			default: 'CODE128'
		},
		opations: {
			type: Object,
			default: function () {
				return {}
			}
		},
		onval: {
			type: Boolean,
			default: false
		},
		loadMake: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			result: '',
			canvasWidth: 0,
			canvasHeight: 0,
			defaultOpations: Object.assign({}, opations)
		}
	},
	onUnload: function () {
	},
	methods: {
		_makeCode() {
			let that = this
			// 合并参数
			Object.assign(this.defaultOpations, this.opations)
			if (that.unit == "upx") {
				if (that.defaultOpations.width) {
					that.defaultOpations.width = uni.upx2px(that.defaultOpations.width)
				}
				if (that.defaultOpations.height) {
					that.defaultOpations.height = uni.upx2px(that.defaultOpations.height)
				}
				if (that.defaultOpations.fontSize) {
					that.defaultOpations.fontSize = uni.upx2px(that.defaultOpations.fontSize)
				}
			}
			if (that._empty(that.defaultOpations.text)) {
				that.defaultOpations.text = that.val
			}
			if (that._empty(that.defaultOpations.format)) {
				that.defaultOpations.format = that.format
			}
			// console.log(JSON.stringify(that.defaultOpations))
			new barCode(that, that.cid, that.defaultOpations,
				function (res) { // 生成条形码款高回调
					that.canvasWidth = res.width
					that.canvasHeight = res.height
				},
				function (res) { // 生成条形码的回调
					// 返回值
					that._result(res)
					// 重置默认参数
					that.defaultOpations = opations
				},
			);
		},
		_clearCode() {
			this._result('')
		},
		_saveCode() {
			let that = this;
			if (this.result != "") {
				uni.saveImageToPhotosAlbum({
					filePath: that.result,
					success: function () {
						uni.showToast({
							title: '条形码保存成功',
							icon: 'success',
							duration: 2000
						});
					}
				});
			}
		},
		_result(res) {
			this.result = res;
			this.$emit('result', res)
		},
		_empty(v) {
			let tp = typeof v,
				rt = false;
			if (tp == "number" && String(v) == "") {
				rt = true
			} else if (tp == "undefined") {
				rt = true
			} else if (tp == "object") {
				if (JSON.stringify(v) == "{}" || JSON.stringify(v) == "[]" || v == null) rt = true
			} else if (tp == "string") {
				if (v == "" || v == "undefined" || v == "null" || v == "{}" || v == "[]") rt = true
			} else if (tp == "function") {
				rt = false
			}
			return rt
		}
	},
	watch: {
		val(n, o) {
			if (this.onval) {
				if (n != o && !this._empty(n)) {
					setTimeout(() => {
						this._makeCode()
					}, 0);
				}
			}
		},
		opations: {
			handler(n,o){
				if (this.onval) {
					if (!this._empty(n)) {
						setTimeout(() => {
							this._makeCode()
						}, 0);
					}
				}
			},
			deep: true
		}
	},
	mounted: function () {
		if (this.loadMake) {
			if (!this._empty(this.val)) {
				setTimeout(() => {
					this._makeCode()
				}, 0);
			}
		}
	},
}
</script>
<style>
.tki-barcode {
	position: relative;
}
.tki-barcode-canvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}
</style>
