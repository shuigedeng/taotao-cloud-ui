<template>
	<view class="launch-v">
		<!-- #ifdef APP-PLUS -->
		<view class="launch-box">
			<view class="title">全新模式 为你而来</view>
			<view class="version">VERSION3.2</view>
			<view class="launch-img">
				<image :src="startup" mode="widthFix"></image>
			</view>
			<view class="copyright">Copyright © 2022 滔滔信息技术有限公司出品</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	export default {
		data() {
			return {
				startup: resources.startup.main
			}
		},
		onLoad() {
			if(uni.getStorageSync('isUpdate'))return
			const launchFlag = uni.getStorageSync('launchFlag');
			const token = uni.getStorageSync("token") || '';
			if (launchFlag) {
				if (token) {
					uni.switchTab({
						url: '/pages/index/apply'
					})
				} else {
					uni.redirectTo({
						url: '/pages/login/index'
					})
				}
			} else {
				// #ifdef APP-PLUS
				uni.redirectTo({
					url: '/pages/launch/policy'
				})
				// #endif
				// #ifndef APP-PLUS
				if (token) {
					uni.switchTab({
						url: '/pages/index/apply'
					})
				} else {
					uni.redirectTo({
						url: '/pages/login/index'
					})
				}
				// #endif
			}
		},
	}
</script>

<style lang="scss">
	.launch-v {
		.launch-box {
			padding-top: 170rpx;

			.title {
				font-size: 50rpx;
				line-height: 70rpx;
				color: #5098FA;
				text-align: center;
				margin-bottom: 10rpx;
			}

			.version {
				width: 250rpx;
				margin: 0 auto;
				text-align: center;
				height: 50rpx;
				border: 1px solid #5098FA;
				border-radius: 25rpx;
				line-height: 48rpx;
				color: #5098FA;
				letter-spacing: 2rpx;
			}

			.launch-img {
				margin: 0 auto;
				width: 680rpx;

				image {
					width: 100%;
				}
			}

			.copyright {
				position: fixed;
				bottom: 120rpx;
				right: 0;
				left: 0;
				text-align: center;
				color: #999999;
				font-size: 24rpx;
			}
		}
	}
</style>
