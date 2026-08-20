<template>
	<view class="messageDetail-v u-p-l-32 u-p-r-32">
		<view class="u-flex-col u-p-t-10 u-p-b-10 u-border-bottom">
			<text class="u-m-b-10 u-font-32 txt">{{info.title}}</text>
			<text class="releaseUser u-m-t-10 u-font-24 u-p-b-10">{{info.creatorUser}}</text>
		</view>
		<view class="messageDetail-content u-p-t-20 u-p-b-20">
			<u-parse :html="info.bodyText" selectable :tag-style="style"></u-parse>
		</view>
		<view class="file-box">
			<view class="file-list u-flex" v-for="(item,index) in fileList" :key="index">
				<view class="file-list-l">
					<u-icon name="attach" color="#969799"></u-icon>
					<text class="fileName">{{item.name}}</text>
				</view>
				<u-icon name="download" color="#969799" @click="openFile(item)"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getMessageDetail
	} from '@/api/message.js'
	import {
		getDownloadUrl
	} from '@/api/common'
	export default {
		data() {
			return {
				info: {},
				style: {
					ul: 'padding:0',
					li: 'list-style-type:none,padding:0'
				},
				fileList: []
			}
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			}
		},
		onLoad(option) {
			this.initDetail(option.id)
		},
		methods: {
			initDetail(id) {
				getMessageDetail(id).then(res => {
					this.info = res.data;
					this.fileList = JSON.parse(this.info.files)
				})
			},
			openFile(item) {
				getDownloadUrl('annex', item.fileId).then(res => {
					// #ifdef H5
					window.location.href = this.baseURL + res.data.url;
					// #endif
					// #ifndef H5
					uni.downloadFile({
						url: this.baseURL + res.data.url,
						success: function(res) {
							var filePath = res.tempFilePath;
							uni.openDocument({
								filePath: encodeURI(filePath),
								showMenu: true,
								success: function(res) {

								}
							});
						}
					});
					// #endif
				})
			}
		}
	}
</script>

<style lang="scss">
	.messageDetail-v {
		padding-bottom: 80rpx;

		.txt {
			font-weight: 700;
		}

		.messageDetail-content {
			border-bottom: 1px solid #dcdfe6;
		}

		.releaseUser {
			color: #9A9A9A;
		}

		.file-box {
			.file-list {
				margin-top: 20rpx;
				justify-content: space-between;

				.file-list-l {
					.fileName {
						margin-left: 10rpx;
					}
				}
			}
		}
	}
</style>
