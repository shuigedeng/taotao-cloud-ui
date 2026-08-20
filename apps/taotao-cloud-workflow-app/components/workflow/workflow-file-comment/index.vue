<template>
	<view ref="lsjFile" class="lsj-file" :style="[getStyles]">
		<!-- #ifdef APP-PLUS -->
		<view>
			<slot>
				<view class="defview" :style="[getStyles]">附件上传</view>
			</slot>
		</view>
		<!-- #endif -->

		<!-- #ifdef H5 -->
		<view ref="hFile" class="hFile" :style="[getStyles]">
			<slot>
				<view class="defview" :style="[getStyles]">附件上传</view>
			</slot>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<view class="hFile" :style="[getStyles]" @click="wxChooseFile">
			<slot>
				<view class="defview" :style="[getStyles]">附件上传</view>
			</slot>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			option: {
				type: Object,
				required: true
			},
			width: {
				type: String,
				default: '100%'
			},
			height: {
				type: String,
				default: '80rpx'
			},
			size: {
				type: Number,
				default: 10
			},
			// #ifdef APP-NVUE
			position: {
				type: String,
				default: 'absolute'
			},
			// #endif
			// #ifndef APP-NVUE
			position: {
				type: String,
				default: 'static'
			},
			// #endif
			childId: {
				type: String,
				default: 'lsjUpload'
			},
			manual: {
				type: Boolean,
				default: false
			},
			top: {
				type: [String, Number],
				default: ''
			},
			left: {
				type: [String, Number],
				default: ''
			},
			bottom: {
				type: [String, Number],
				default: ''
			},
			right: {
				type: [String, Number],
				default: ''
			}
		},
		data() {
			this.xmlRequest = ''
			this.wxParam = {}
			this.wv = {}
			return {
				fileDom: '',
				disabled: false,
				param: {},
				currCreate: false
			}
		},
		computed: {
			getStyles() {
				let styles = {
					width: this.width,
					height: this.height
				}
				if (this.position == 'absolute') {
					styles['top'] = this.top
					styles['bottom'] = this.bottom
					styles['left'] = this.left
					styles['right'] = this.right
					styles['position'] = 'fixed'
				}

				return styles
			}
		},
		watch: {
			option: {
				immediate: true,
				handler(param) {
					this.param = param
					if (param.url) {
						setTimeout(() => {
							this.show()
						}, 500)
					} else {
						this.hide()
					}
				}
			}
		},
		mounted() {
			this._manual = this.manual
		},
		updated() {
			if (this.isShow) {
				this.show()
			}
		},
		methods: {
			submit(data) {
				this._manual && this.wv.evalJS(`vm.submit('${JSON.stringify(data)}')`)
			},
			show() {
				// #ifdef APP-PLUS
				if (this.isShow) {
					this.getDomStyles(styles => {
						this.wv.setStyle(styles)
					})
					return
				}
				// #endif
				this.refresh()
			},
			hide() {
				// #ifdef APP-PLUS
				if (plus.webview.getWebviewById(this.childId)) {
					// #ifndef APP-NVUE
					this.wv.removeFromParent()
					// #endif
					plus.webview.close(this.childId, 'none', 0)
				}
				// #endif
				// #ifdef H5
				if (this.fileDom) {
					this.$refs.hFile.$el.removeChild(this.fileDom)
					this.fileDom = ''
				}
				// #endif
				// #ifdef MP-WEIXIN
				this.disabled = true
				// #endif

				this.isShow = false
			},
			refresh() {
				let param = this.param
				if (!param.url) {
					console.error('url为必传参数')
					return
				}

				// #ifdef APP-PLUS
				if (!param.cuWebview) {
					console.error('cuWebview为必传参数')
					return
				}
				this.hide()

				this.getDomStyles(styles => {
					this.createAppFile(styles, param)
				})
				// #endif

				// #ifdef MP-WEIXIN

				this.wxParam = param
				this.disabled = false
				// #endif

				// #ifdef H5

				this.createH5File(param)
				// #endif

				this.isShow = true
			},
			getDomStyles(callback) {
				// #ifndef APP-NVUE
				let view = uni
					.createSelectorQuery()
					.in(this)
					.select('.lsj-file')
				view.fields({
						size: true,
						rect: true
					},
					({
						height,
						width,
						top,
						left,
						right,
						bottom
					}) => {
						uni.createSelectorQuery()
							.selectViewport()
							.scrollOffset(({
								scrollTop
							}) => {
								return callback({
									top: parseInt(top) + parseInt(scrollTop) + 'px',
									left: parseInt(left) + 'px',
									width: parseInt(width) + 'px',
									height: parseInt(height) + 'px'
								})
							})
							.exec()
					}
				).exec()
				// #endif
				// #ifdef APP-NVUE
				const dom = weex.requireModule('dom')
				dom.getComponentRect(this.$refs.lsjFile, ({
					size: {
						height,
						width,
						top,
						left,
						right,
						bottom
					}
				}) => {
					return callback({
						top: parseInt(top) + 'px',
						left: parseInt(left) + 'px',
						width: parseInt(width) + 'px',
						height: parseInt(height) + 'px',
						right: parseInt(right) + 'px',
						bottom: parseInt(bottom) + 'px'
					})
				})
				// #endif
			},
			toast(title = '', {
				duration = 2000,
				icon = 'none'
			} = {}) {
				uni.showToast({
					title,
					duration,
					icon
				})
			},
			getRequest(url) {
				let theRequest = new Object()
				let index = url.indexOf('?')
				if (index != -1) {
					let str = url.substring(index + 1)
					let strs = str.split('&')
					for (let i = 0; i < strs.length; i++) {
						theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
					}
				}
				return theRequest
			},
			wxChooseFile() {
				// #ifdef MP-WEIXIN
				if (this.disabled) {
					return
				}
				wx.chooseMessageFile({
					count: 1,
					type: 'file',
					success: ({
						tempFiles
					}) => {
						this.handleWXUpload(tempFiles[0])
					},
					fail: () => {
						this.$emit('callback', {
							success: false,
							status: -100,
							msg: '文件选择失败'
						})
					}
				})
				// #endif
			},
			handleWXUpload(file) {
				let {
					debug = false, url, name = 'file', header = {}, formData = {}
				} = this.wxParam
				if (!url) {
					console.error('url为必传参数')
					return
				}
				if (file.size > 1024 * 1024 * Math.abs(this.size)) {
					this.toast(`附件大小请勿超过${this.size}M`)
					return
				}

				formData['fileName'] = file.name
				let opt = {
					url,
					name,
					header,
					formData,
					filePath: file.path
				}
				debug &&
					console.log(`
				上传接口地址:${url}\n
				附件key:${name}\n 
				附件名称:${file.name}\n 
				附件大小:${file.size}\n
				请求头:${JSON.stringify(header)}\n
				参数:${JSON.stringify(formData)}
				`)

				opt['fail'] = ({
					errMsg = ''
				}) => {
					this.disabled = false
					console.error('--ERROR--：' + errMsg)
					this.$emit('callback', {
						success: false,
						status: 500,
						msg: '上传失败'
					})
				}
				opt['success'] = res => {
					this.disabled = false
					if (res.statusCode == 200) {

						this.$emit('callback', {
							success: true,
							fileName: file.name,
							responseText: res.data,
							status: res.statusCode,
							msg: '上传成功'
						})
						return
					}

					this.$emit('callback', {
						success: false,
						status: res.statusCode,
						msg: '上传失败'
					})
				}
				this.disabled = true
				this.xmlRequest = uni.uploadFile(opt)
				this.xmlRequest &&
					this.xmlRequest.onProgressUpdate(({
						progress = 0
					}) => {
						if (progress <= 100) {
							this.$emit('input', progress)
							this.$forceUpdate()
						}
					})
			},
			createH5File(param) {
				this.hide();
				if (!this.fileDom) {
					this.fileDom = document.createElement('input');
				}
				this.fileDom.type = 'file'
				this.fileDom.value = ''
				this.fileDom.style.height = this.height
				this.fileDom.style.width = this.width
				this.fileDom.style.position = 'absolute'
				this.fileDom.style.top = 0
				this.fileDom.style.left = 0
				this.fileDom.style.right = 0
				this.fileDom.style.bottom = 0
				this.fileDom.style.opacity = 0
				this.fileDom.style.zIndex = 999
				this.$refs.hFile.$el.appendChild(this.fileDom)
				this.fileDom.onchange = event => {
					let file = event.target.files[0]
					if (file) {
						// 限制文件小于10M,可自行修改
						if (file.size > 1024 * 1024 * Math.abs(this.size)) {
							this.toast(`附件大小请勿超过${this.size}M`)
							return
						}
						this.uploadH5(file, param)
					}
				}
			},
			createAppFile(rect = {}, {
				cuWebview,
				...param
			}) {
				param.size = this.size
				param.manual = this._manual
				let wvPath = '/uni_modules/lsj-upload/hybrid/html/uploadFile.html'
				let styles = {
					position: this.position,
					background: 'transparent'
				}

				// #ifdef APP-NVUE
				styles.position = 'absolute'
				// #endif

				styles = Object.assign(rect, styles)

				let wv = plus.webview.create(wvPath, this.childId, styles, param || {})
				wv.loadURL(wvPath)
				cuWebview.append(wv)
				this.wv = wv
				wv.overrideUrlLoading({
					mode: 'reject'
				}, e => {
					let {
						retype,
						percent = '',
						msg = '',
						fileName = '',
						responseText = '{}',
						success = false,
						status = 0,
						files = []
					} = this.getRequest(
						e.url
					)
					switch (retype) {
						case 'change':
							files = unescape(files)
							try {
								files = JSON.parse(files)
							} catch (e) {
								return console.error('出错了，请检查代码')
							}
							this.$emit('change', files)
							break
						case 'percent':
							percent = unescape(percent)
							this.$emit('input', percent)
							this.$forceUpdate()
							break
						case 'complete':
							msg = unescape(msg)
							fileName = unescape(fileName)
							responseText = unescape(responseText)
							this.$emit('callback', {
								success,
								fileName,
								status,
								responseText,
								msg
							})
							break
						default:
							break
					}
				})
			},
			uploadH5(file, {
				debug = false,
				url,
				name = 'file',
				method = 'POST',
				header = {},
				formData: data = {}
			}) {
				if (!url) {

					return
				}
				data['fileName'] = file.name
				debug &&
					console.log(`
				上传接口地址:${url}\n
				附件key:${name}\n 
				附件名称:${file.name}\n 
				附件大小:${file.size}\n
				请求头:${JSON.stringify(header)}\n
				参数:${JSON.stringify(data)}
				`)

				let formData = new FormData()
				for (let keys in data) {
					formData.append(keys, data[keys])
				}
				formData.append(name, file)
				this.xmlRequest = new XMLHttpRequest()
				this.xmlRequest.open(method, url, true)
				for (let keys in header) {
					this.xmlRequest.setRequestHeader(keys, header[keys])
				}

				this.xmlRequest.upload.addEventListener(
					'progress',
					event => {
						if (event.lengthComputable) {
							let percent = Math.ceil((event.loaded * 100) / event.total)
							if (percent <= 100) {
								this.$emit('input', percent)
								this.$forceUpdate()
							}
						}
					},
					false
				)
				this.xmlRequest.ontimeout = () => {
					this.disabled = false
					this.fileDom.value = ''

					this.$emit('callback', {
						success: false,
						status: 408,
						msg: '请求超时'
					})
				}

				this.xmlRequest.onreadystatechange = ev => {
					if (this.xmlRequest.readyState == 4) {
						this.disabled = false
						this.fileDom.value = ''
						if (this.xmlRequest.status == 200) {
							debug && console.log('上传完成：' + this.xmlRequest.responseText)
							this.$emit('callback', {
								success: true,
								fileName: file.name,
								responseText: this.xmlRequest.responseText,
								status: this.xmlRequest.status,
								msg: '上传成功'
							})
							return
						} else if (this.xmlRequest.status == 0) {
							console.error('status = 0 :请检查请求头Content-Type与服务端是否匹配，服务端已正确开启跨域，并且nginx未拦截阻止请求')
						}
						console.error('--ERROR--：status = ' + this.xmlRequest.status)
						this.$emit('callback', {
							success: false,
							status: this.xmlRequest.status,
							msg: '上传失败'
						})
					}
				}
				this.disabled = true
				this.xmlRequest.send(formData)
			}
		}
	}
</script>

<style scoped>
	.lsj-file {
		display: inline-block;
	}

	.defview {
		background-color: #007aff;
		color: #fff;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}

	.hFile {
		position: relative;
	}
</style>
