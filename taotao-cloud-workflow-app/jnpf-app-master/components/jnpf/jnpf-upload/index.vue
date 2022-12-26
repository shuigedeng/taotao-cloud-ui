<template>
	<view class="jnpf-upload">
		<template v-if="fileList.length">
			<view class="u-list-item u-preview-wrap" v-for="(item, index) in fileList" :key="index">
				<view v-if="!disabled" class="u-delete-icon" @tap.stop="deleteItem(index)">
					<u-icon class="u-icon" name="close" size="20" color="#ffffff"></u-icon>
				</view>
				<image class="u-preview-image" :src="baseURL+item.url" mode="aspectFill"
					@tap.stop="doPreviewImage(baseURL+item.url)"></image>
			</view>
		</template>
		<u-upload width="150" height="150" :action="comUploadUrl+type" :header="uploadHeaders"
			@on-list-change="onListChange" :max-size="fileSize*1024*1024" :max-count="realLimit"
			:show-upload-list="false" :show-progress="false" :deletable="deletable" @on-success="onSuccess"
			@on-error="handleError" ref="uUpload" :file-list="lists" :disabled='disabled'>
		</u-upload>
	</view>
</template>

<script>
	const units = {
		KB: 1024,
		MB: 1024 * 1024,
		GB: 1024 * 1024 * 1024
	}
	export default {
		name: 'jnpf-upload',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				type: Array,
				default: () => []
			},
			type: {
				type: String,
				default: 'annexpic'
			},
			limit: {
				type: Number,
				default: 99
			},
			sizeUnit: {
				type: String,
				default: 'MB'
			},
			fileSize: {
				type: Number,
				default: 2
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				fileList: [],
				realLimit: 0,
				deletable: true,
				uploadHeaders: {
					Authorization: this.$store.getters.token
				},
				lists: []
			}
		},
		watch: {
			limit(val) {
				this.realLimit = val
			},
			value: {
				immediate: true,
				handler(val) {
					this.fileList = val
				}
			}
		},
		created() {
			this.uploadHeaders.Authorization = uni.getStorageSync('token')
			this.$nextTick(function() {
				this.lists = this.fileList
			})
			if (this.disabled) {
				this.realLimit = this.fileList.length
				this.deletable = false
			} else {
				this.realLimit = this.limit
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
		methods: {
			onSuccess(data, index, lists, name) {
				if (data.code == 200) {
					this.fileList.push({
						name: lists[index].file.name,
						fileId: data.data.name,
						url: data.data.url
					})
					this.$emit('input', this.fileList)
				} else {
					lists.splice(index, 1)
					this.$u.toast(data.msg)
				}
			},
			handleError(res, index, lists, name) {
				lists.splice(index, 1)
			},
			deleteItem(index) {
				uni.showModal({
					title: '提示',
					content: '您确定要删除此项吗？',
					success: res => {
						if (res.confirm) {
							this.$refs.uUpload.remove(index);
							this.fileList.splice(index, 1)
							this.$emit('input', this.fileList)
							uni.showToast({
								title: '移除成功',
								icon: 'none'
							});
						}
					}
				});
			},
			onListChange(lists) {
				this.lists = lists;
			},
			doPreviewImage(url) {
				const images = this.fileList.map(item => this.baseURL + item.url);
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
			}
		}
	}
</script>
<style lang="scss" scoped>
	.jnpf-upload {
		display: flex;
		flex-wrap: wrap;
		align-items: center;

		.u-preview-wrap {
			width: 150rpx;
			height: 150rpx;
			border: 1px solid #ebecee;
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
				width: 44rpx;
				height: 44rpx;
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
</style>
