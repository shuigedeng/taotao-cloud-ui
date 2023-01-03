<template>
	<view class="workflow-file">
		<view class="workflow-file-box">
			<view>
				<lsj-upload ref="lsjUpload" v-model="percent" width="140rpx" height="100%" childId="upload" :size="10"
					:option="option" @callback="onCallback" v-if="!disabled">
					<!-- #ifndef MP -->
					<u-button size="mini" :disabled='deletable'>上传附件</u-button>
					<!-- #endif -->
				</lsj-upload>
				<view v-else>
					<u-button size="mini" disabled>上传附件</u-button>
				</view>
			</view>
			<view v-for='(item,index) in fileList' :key="index" class="workflow-file-item u-type-primary u-flex u-line-1"
				@tap='downLoad(item)'>
				<view class="workflow-file-item-txt u-line-1">{{item.name}}</view>
				<view class="closeBox u-flex-col" @click.stop="delFile(index)" v-if="!deletable">
					<text class="icon-ym icon-ym-nav-close closeTxt u-flex"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDownloadUrl
	} from '@/api/common'
	export default {
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				type: Array,
				default: () => ([])
			},
			disabled: {
				type: Boolean,
				default: false
			},
			limit: {
				type: Number,
				default: 9
			},
			fileSize: {
				type: Number,
				default: 5
			},
			sizeUnit: {
				type: String,
				default: 'MB'
			},
			accept: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				tabIndex: 0,
				percent: '',
				fileList: [],
				type: 'annexpic',
				uploadHeaders: {
					Authorization: this.token
				},
				token: '',
				option: {},
				deletable: false,
			}
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			},
			comUploadUrl() {
				return this.define.comUploadUrl
			},
		},
		watch: {
			value: {
				handler(val) {
					this.fileList = val;
				}
			}
		},
		created() {
			this.token = uni.getStorageSync('token')
			this.fileList = this.value;
			this.deletable = this.disabled
			// 初始化参数并创建上传DOM
			this.option = {
				// #ifdef APP-PLUS
				cuWebview: this.$mp.page.$getAppWebview(), // app必传 
				// #endif
				url: this.baseURL + '/api/file/Uploader/annex', //替换为你的接口地址
				name: 'file', // 附件key
				size: this.fileSize, // 附件上传大小上限(M)，默认10M
				debug: false,
				//根据你接口需求自定义请求头
				header: { //根据你接口需求自定义
					'Authorization': this.token,
					'uid': '27682',
					'client': 'app',
					'accountid': 'DPOA9487'
				}
				//根据你接口需求自定义body参数
			};
		},
		methods: {
			//文件上传
			onCallback(e) {
				let res = JSON.parse(JSON.stringify(e))
				let responseText = JSON.parse(res.responseText)
				if (responseText.code !== 200) return this.$u.toast('上传失败')
				if (this.fileList.length == this.limit) return this.$u.toast('最多只能上传' + this.limit + '个文件')
				this.fileList.push({
					name: res.fileName,
					fileId: responseText.data.name,
					url: responseText.data.url
				})
				this.$emit('input', this.fileList)
			},
			downLoad(item) {
				// #ifdef MP
				this.previewFile(item)
				// #endif
				// #ifndef MP
				getDownloadUrl('annex', item.fileId).then(res => {
					const fileUrl = this.baseURL + res.data.url;
					// #ifdef H5
					window.location.href = fileUrl;
					// #endif
					// #ifdef APP-PLUS
					this.downloadFile(res.data.url);
					// #endif
				})
				// #endif
			},
			previewFile(item) {
				uni.downloadFile({
					url: this.baseURL + item.url,
					success: (res) => {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: encodeURI(filePath),
							success: (res) => {
								console.log('打开文档成功');
							}
						});
					}
				});
			},


			downloadFile(url) {
				uni.downloadFile({
					url: this.baseURL + url,
					success: res => {
						if (res.statusCode === 200) {
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: red => {
									uni.showToast({
										icon: 'none',
										mask: true,
										title: '文件已保存：' + red.savedFilePath, //保存路径
										duration: 3000,
									});
									setTimeout(() => {
										uni.openDocument({
											filePath: red.savedFilePath,
											success: ress => {},
											fail(err) {}
										});
									}, 20000)
								}
							});
						}
					}
				});
			},
			delFile(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除该文件？',
					success: res => {
						if (res.confirm) {
							this.fileList.splice(index, 1)
							this.$emit('input', this.fileList)
							this.fileList.length >= this.fileCount ? this.deletable = true : this.deletable =
								false
						} else if (res.cancel) {}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.workflow-file {
		width: 100%;

		.workflow-file-box {
			.workflow-file-item {
				justify-content: space-between;
				flex-direction: row;

				.workflow-file-item-txt {
					width: 230rpx;
					flex: auto;
				}

				.closeBox {
					height: 60rpx;
					align-items: flex-end;
					justify-content: space-evenly;
					flex: 0.2;

					.closeTxt {
						width: 34rpx;
						height: 34rpx;
						border-radius: 50%;
						background-color: #909194;
						color: #FFFFFF;
						font-size: 22rpx;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}
</style>
