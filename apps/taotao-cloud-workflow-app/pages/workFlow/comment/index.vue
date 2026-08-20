<template>
	<view class="comment-v">
		<view class="comment_inner">
			<view class="text_box">
				<u-input :type="textarea.type" v-model="dataForm.text" placeholder="请输入评论内容!" :height='textarea.height'
					:border='textarea.border' :maxlength="textarea.maxlength" :auto-height="textarea.autoHeight" />
			</view>
			<view class="box">
				<scroll-view :scroll-y="true" style="height: 550rpx;" class="scroll_view">
					<view class="comment-area">
						<view class="img_box">
							<view class="u-preview-wrap" v-for="(item, index) in dataForm.imgList" :key="index">
								<view class="u-delete-icon" @tap.stop="deleteItem(index)">
									<u-icon class="u-icon" name="close" size="20" color="#ffffff"></u-icon>
								</view>
								<image class="u-preview-image" :src="baseURL+item.url" mode="aspectFill"
									@tap.stop="doPreviewImage(baseURL+item.url)"></image>
							</view>
						</view>

						<view v-for='(item,index) in dataForm.file' :key="index"
							class="workflow-file-item u-type-primary u-flex u-line-1" @tap='downLoad(item)'>
							<view class="workflow-file-item-txt u-line-1">{{item.name}}</view>
							<!-- #ifndef MP-WEIXIN -->
							<view class="closeBox u-flex-col" @click.stop="delFile(index)">
								<text class="icon-ym icon-ym-nav-close closeTxt u-flex"></text>
							</view>
							<!-- #endif -->
						</view>
					</view>
				</scroll-view>
				<view class="btn_box">
					<u-upload :custom-btn="true" :action="comUploadUrl+type" :header="uploadHeaders" ref="uUpload"
						:max-size="5*1024*1024" :max-count="9" :show-upload-list="false" :show-progress="false"
						@on-success="onSuccess">
						<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
							<view class="ym-custom ym-custom-image img_icon"></view>
						</view>
					</u-upload>
					<workflow-file-comment ref="lsjUpload" width="100px" height="80rpx" childId="upload" :size="10"
						:option="option" v-model="percent" @callback="onCallback">
						<view class="icon-ym icon-ym-h5 file_icon" size="mini">
						</view>
					</workflow-file-comment>
				</view>
			</view>
		</view>
		<view class="flowBefore-actions">
			<u-button class="buttom-btn" type="primary" @click="handleClick">发送</u-button>
		</view>
	</view>
</template>

<script>
	import {
		getDownloadUrl
	} from '@/api/common'
	export default {
		data() {
			return {
				dataForm: {
					text: '',
					file: [],
					imgList: [],
				},
				type: 'annexpic',
				deletable: true,
				uploadHeaders: {
					Authorization: this.token
				},
				token: '',
				option: {},
				tabIndex: 0,
				percent: '',
				list: [],
				textarea: {
					type: 'textarea',
					border: true,
					height: 440,
					autoHeight: false,
					maxlength: 660
				}

			};
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			},
			comUploadUrl() {
				return this.define.comUploadUrl
			},
		},
		onReady() {
			// 初始化参数并创建上传DOM
			this.option = {
				// #ifdef APP-PLUS
				cuWebview: this.$mp.page.$getAppWebview(), // app必传 
				// #endif
				url: this.baseURL + '/api/file/Uploader/annex', //替换为你的接口地址
				name: 'file', // 附件key
				size: 10, // 附件上传大小上限(M)，默认10M
				debug: true,
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
			handleClick() {
				const query = {
					text: this.dataForm.text,
					file: JSON.stringify(this.dataForm.file),
					image: JSON.stringify(this.dataForm.imgList)
				}
				uni.$emit('comment', query);
				uni.navigateBack();
			},
			//文件上传
			onCallback(e) {
				let res = JSON.parse(JSON.stringify(e))
				let responseText = JSON.parse(res.responseText)
				if (responseText.code !== 200) return this.$u.toast('上传失败')
				this.dataForm.file.push({
					name: res.fileName,
					fileId: responseText.data.name,
					url: responseText.data.url
				})
			},
			//文件下载
			downLoad(item) {
				// #ifdef MP
				uni.navigateTo({
					url: `/pages/workFlow/filePreview/index?fileId=${item.fileId}&name=${item.name}`
				})
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
			//文件删除
			delFile(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除该文件？',
					success: res => {
						if (res.confirm) {
							this.dataForm.file.splice(index, 1)
						} else if (res.cancel) {}
					}
				});
			},
			downloadFile(url) {
				uni.downloadFile({
					url: this.baseURL + url,
					success: res => {
						if (res.statusCode === 200) {
							const filePath = res.tempFilePath;
							uni.openDocument({
								filePath: escape(filePath),
								success: ress => {},
								fail(err) {}
							});
						}
					}
				});
			},
			onSuccess(data, index, lists, name) {
				if (data.code == 200) {
					this.dataForm.imgList.push({
						name: lists[index].file.name,
						fileId: data.data.name,
						url: data.data.url
					})
					// this.$emit('input', this.fileList)
				} else {
					lists.splice(index, 1)
					this.$u.toast(data.msg)
				}
			},
			doPreviewImage(url) {
				const images = this.dataForm.imgList.map(item => this.baseURL + item.url);
				uni.previewImage({
					urls: images,
					current: url,
					success: () => {},
					fail: () => {
						uni.showToast({
							title: '预览图片失败',
							icon: 'none'
						});
					}
				});
			},
			deleteItem(index) {
				uni.showModal({
					title: '提示',
					content: '您确定要删除此项吗？',
					success: res => {
						if (res.confirm) {
							this.$refs.uUpload.remove(index);
							this.dataForm.imgList.splice(index, 1)
							// this.$emit('input', this.fileList)
							uni.showToast({
								title: '移除成功',
								icon: 'none'
							});
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.comment-v {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		// .flowBefore-actions{
		// 	width: 90%;
		// 	left: 50%;
		// 	transform: translateX(-50%);
		// 	bottom: 20rpx;
		// 	.buttom-btn{
		// 		border-radius: 10rpx;
		// 	}
		// }

		.uni-textarea-compute {
			height: 470rpx !important;
		}

		.comment_inner {
			display: flex;
			flex-direction: column;
			background-color: #FFFFFF;
			height: 100%;
			padding: 0 30rpx;

			.text_box {
				flex: 0.35;
				// .input_textarea{
				// 	height: 470rpx !important;

				// }
			}

			.box {
				width: 100%;
				display: flex;
				flex-direction: column;
				position: fixed;
				bottom: 110rpx;

				.scroll_view {
					.comment-area {
						height: 550rpx;
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						justify-content: flex-end;
						margin-bottom: 28rpx;

						.img_box {
							width: 100%;
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;

							.u-preview-wrap {
								width: 110rpx;
								height: 110rpx;
								overflow: hidden;
								margin: 10rpx;
								background: rgb(244, 245, 246);
								position: relative;
								border-radius: 10rpx;
								/* #ifndef APP-NVUE */
								display: flex;
								/* #endif */
								align-items: center;
								justify-content: center;

								.u-preview-image {
									display: block;
									width: 100%;
									height: 100%;
									border-radius: 10rpx;
								}

								.u-delete-icon {
									position: absolute;
									top: 10rpx;
									right: 10rpx;
									z-index: 10;
									background-color: $u-type-error;
									border-radius: 100rpx;
									width: 34rpx;
									height: 34rpx;
									/* #ifndef APP-NVUE */
									display: flex;
									/* #endif */
									align-items: center;
									justify-content: center;
								}

								.u-icon {
									/* #ifndef APP-NVUE */
									display: flex;
									/* #endif */
									align-items: center;
									justify-content: center;
								}
							}
						}

						.workflow-file-item {
							width: 100%;
							justify-content: space-between;
							flex-direction: row;

							.workflow-file-item-txt {
								flex: 1;
							}

							.closeBox {
								height: 60rpx;
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


				.btn_box {
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: flex-start;

					.slot-btn {
						.img_icon {
							width: 80rpx;
							height: 80rpx;
							text-align: center;
							line-height: 80rpx;

							&:before {
								content: "\e987";
								font-size: 60rpx;
								color: #666666;
							}
						}
					}

					.file_icon {
						width: 80rpx;
						height: 80rpx;
						text-align: center;
						line-height: 80rpx;

						&:before {
							font-size: 60rpx;
							color: #666666;
						}
					}
				}
			}
		}
	}
</style>
