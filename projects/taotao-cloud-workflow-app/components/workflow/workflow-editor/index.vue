<template>
	<view class="workflow-editor">
		<view class='toolbar' @tap="format">
			<view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold">
			</view>
			<view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic">
			</view>
			<view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian"
				data-name="underline"></view>
			<view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian" data-name="strike">
			</view>
			<view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi" data-name="align"
				data-value="left"></view>
			<view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi"
				data-name="align" data-value="center"></view>
			<view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi" data-name="align"
				data-value="right"></view>
			<view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi"
				data-name="align" data-value="justify"></view>
			<view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont icon-line-height"
				data-name="lineHeight" data-value="2"></view>
			<view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont icon-Character-Spacing"
				data-name="letterSpacing" data-value="2em"></view>
			<view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont icon-722bianjiqi_duanqianju"
				data-name="marginTop" data-value="20px"></view>
			<view :class="formats.previewarginBottom ? 'ql-active' : ''" class="iconfont icon-723bianjiqi_duanhouju"
				data-name="marginBottom" data-value="20px"></view>
			<view class="iconfont icon-clearedformat" @tap="removeFormat"></view>
			<view :class="formats.fontFamily ? 'ql-active' : ''" class="iconfont icon-font" data-name="fontFamily"
				data-value="Pacifico"></view>
			<view :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize"
				data-name="fontSize" data-value="24px"></view>

			<view :class="formats.color === '#0000ff' ? 'ql-active' : ''" class="iconfont icon-text_color"
				data-name="color" data-value="#0000ff"></view>
			<view :class="formats.backgroundColor === '#00ff00' ? 'ql-active' : ''" class="iconfont icon-fontbgcolor"
				data-name="backgroundColor" data-value="#00ff00"></view>

			<view class="iconfont icon-date" @tap="insertDate"></view>
			<view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
			<view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie"
				data-name="list" data-value="ordered"></view>
			<view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie"
				data-name="list" data-value="bullet"></view>
			<view class="iconfont icon-undo" @tap="undo"></view>
			<view class="iconfont icon-redo" @tap="redo"></view>

			<view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
			<view class="iconfont icon-indent" data-name="indent" data-value="+1"></view>
			<view class="iconfont icon-fengexian" @tap="insertDivider"></view>
			<!-- <view class="iconfont icon-charutupian" @tap="insertImage"></view> -->
			<view :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont icon-format-header-1"
				data-name="header" :data-value="1"></view>
			<view :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont icon-zitixiabiao"
				data-name="script" data-value="sub"></view>
			<view :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont icon-zitishangbiao"
				data-name="script" data-value="super"></view>
			<view class="iconfont icon-shanchu" @tap="clear"></view>
			<view :class="formats.direction === 'rtl' ? 'ql-active' : ''" class="iconfont icon-direction-rtl"
				data-name="direction" data-value="rtl"></view>
		</view>
		<view class="editor-wrapper">
			<editor id="editor" class="ql-container" :placeholder="placeholder" showImgSize showImgToolbar showImgResize
				@statuschange="onStatusChange" :read-only="disabled" @ready="onEditorReady" @blur="getValue">
			</editor>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'workflow-editor',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: '请输入'
			},
			disabled: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				innerValue: '',
				readOnly: false,
				formats: {}
			}
		},
		watch: {
			value(newVal, oldVal) {
				if (oldVal) return
				this.editorCtx.setContents({
					html: newVal
				})
			}
		},
		onLoad() {
			uni.loadFontFace({
				family: 'Pacifico',
				source: 'url("https://sungd.github.io/Pacifico.ttf")'
			})
		},
		methods: {
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				// #ifdef APP-PLUS || H5 ||MP-WEIXIN
				uni.createSelectorQuery().in(this).select('#editor').context((res) => {
					this.editorCtx = res.context
					this.editorCtx.setContents({
						html: this.value
					})
				}).exec()
				// #endif
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				
				this.editorCtx.format(name, value)
			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success")
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			insertImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.editorCtx.insertImage({
							src: res.tempFilePaths[0],
							alt: '图像',
							success: function() {
								console.log('insert image success')
							}
						})
					}
				})
			},
			getValue(e) {
				this.$emit('input', e.detail.html)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./editor-icon.css";

	.workflow-editor {
		background-color: #fff;

		.iconfont {
			display: inline-block;
			width: 80rpx;
			height: 80rpx;
			cursor: pointer;
			font-size: 20px;
			line-height: 80rpx;
			text-align: center;
		}

		.toolbar {
			height: 240rpx;
			background: #f5f5f5;
			overflow-y: auto;
			box-sizing: border-box;
			border-bottom: 0;
			font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
		}

		.ql-container {
			box-sizing: border-box;
			padding: 20rpx;
			width: 100%;
			height: 400rpx;
			margin-top: 20rpx;
			font-size: 30rpx;
			line-height: 1.5;
		}

		.ql-active {
			color: #06c;
		}
	}
</style>
