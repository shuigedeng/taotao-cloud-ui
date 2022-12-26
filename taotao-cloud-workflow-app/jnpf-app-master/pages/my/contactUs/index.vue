<template>
	<view class="contacts-v" v-show="show">
		<view class="contactusBanner">
			<image :src="contactus" mode="widthFix"></image>
		</view>
		<view class="contactus u-m-t-30 u-flex-col">
			<view class="u-flex items u-m-b-20" v-for="(item,index) in list" @click="Jump(index)" :key="index">
				<view :class="item.bcg" style="" class="items-iconBox u-m-r-50 u-padding-15">
					<u-icon :name="item.icon" color="#ffffff" size="54"></u-icon>
				</view>
				<view class="u-flex-col u-flex-1">
					<text>{{item.name}}</text>
					<text>{{item.title}}</text>
				</view>
				<view>
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>
			<view class="serviceTime u-flex-col u-p-l-32 u-p-b-20 u-p-t-20">
				<text class="u-font-xl" type='title'>服务时间</text>
				<text class="textSize"><text style="color: #303133;">工作日：</text>{{workingHours}}</text>
				<text class="textSize"><text style="color: #303133;">节假日：</text>{{holidayWorkingHours}}</text>
			</view>
		</view>
		<view class="copyright">{{copyright}}</view>
		<u-popup v-model="showPopup" mode="center">
			<view class="center-box">
				<image class="image" :src="wechat_qrcode" :data-path="wechat_qrcode" @longpress="saveImage" />
			</view>
		</u-popup>
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	export default {
		data() {
			return {
				contactus: resources.banner.contactus,
				wechat_qrcode: resources.common.wechat_qrcode,
				holidayWorkingHours: '9:30-12:00 ，13:30-17:30',
				workingHours: '8:30-12:00 ，13:00-20:00',
				tell: '400-6868-969',
				url: 'https://www.jnpfsoft.com',
				showPopup: false,
				list: [{
						name: '微信公众号',
						title: '扫码关注官网微信公众号',
						icon: 'weixin-fill',
						bcg: 'u-type-success-bg'
					},
					{
						name: '服务热线',
						title: '400-6868-969',
						icon: 'kefu-ermai',
						bcg: 'u-type-warning-bg'
					},
					{
						name: '官方网站',
						title: 'www.jnpfsoft.com',
						icon: 'ie',
						bcg: 'u-type-primary-bg'
					}
				],
				copyright: 'Copyright © 2022 引迈信息技术有限公司出品',
				show: false
			}
		},
		onLoad() {
			uni.showLoading({
				title: '加载中'
			});
			this.copyright = uni.getStorageSync('copyright') || 'Copyright © 2022 引迈信息技术有限公司出品'
			setTimeout(() => {
				uni.hideLoading()
				this.show = true
			}, 800)

		},
		methods: {
			Jump(index) {
				switch (index) {
					case 0:
						this.showPopup = true
						break;
					case 1:
						uni.makePhoneCall({
							phoneNumber: this.tell,
						})
						break;
					case 2:
						// #ifdef APP-PLUS
						plus.runtime.openURL(this.url);
						// #endif
						// #ifndef APP-PLUS
						uni.navigateTo({
							url: '/pages/apply/externalLink/index?fullName=福建引迈信息技术有限公司&url=' + encodeURIComponent(
								this.url)
						})
						// #endif
						break;
				}
			},
			saveImage(e) {
				// #ifdef APP-PLUS
				uni.getImageInfo({
					src: e.currentTarget.dataset.path,
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.path,
							success: function() {
								helper.msg('保存成功', 'success');
							}
						});
					}
				});
				// #endif
			},
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		background-color: #f0f2f6;
	}

	.contacts-v {
		width: 100%;

		.contactusBanner {
			width: 100%;

			image {
				width: 100%;
			}
		}

		.contactus {
			margin: 0 16rpx;

			.items {
				padding: 20rpx 32rpx;
				background-color: #FFFFFF;
				justify-content: start;
				border-radius: 22rpx;

				.items-iconBox {
					border-radius: 50%;
					height: 88rpx;
					width: 88rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.serviceTime {
				background-color: #FFFFFF;
				border-radius: 22rpx;
			}
		}

		.center-box {
			width: 420rpx;
			height: 420rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.textSize {
			height: 66rpx;
			line-height: 66rpx;
			color: #9A9A9A;
		}

		text[type="title"] {
			height: 86rpx;
			line-height: 86rpx;
			font-weight: 700;
		}
	}
</style>
