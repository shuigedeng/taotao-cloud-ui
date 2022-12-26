<template>
	<view class="guide-v">
		<view class="status-bar">
			<view class="top-view"></view>
		</view>
		<view class="content">
			<swiper class="swiper" @change="onChange">
				<swiper-item>
					<view class="swiper-item">
						<view class="swiper-item-img">
							<image class="itemImg" :src="guide1" mode="aspectFit"></image>
						</view>
						<view class="swiper-item-text">
							<view class="swiper-item-title">可视化流程</view>
							<view class="swiper-item-content">流程节点可视化配置，实现自动流转</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view class="swiper-item-img">
							<image class="itemImg" :src="guide2" mode="aspectFit"></image>
						</view>
						<view class="swiper-item-text">
							<view class="swiper-item-title">可视化视图</view>
							<view class="swiper-item-content">数据的增删改查皆可自由设定给不同角色</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view class="swiper-item-img">
							<image class="itemImg" :src="guide3" mode="aspectFit"></image>
						</view>
						<view class="swiper-item-text">
							<view class="swiper-item-title">低代码可视化</view>
							<view class="swiper-item-content">通过可视化方式，无需或少量编写代码完成应用</view>
						</view>
						<view class="swiper-item-btn" @click="setLaunchFlag()">立即体验</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="jump-over" @click="setLaunchFlag()">跳过</view>
			<view class="bannerDots" v-if="currenTab!=3">
				<view class="banner-dot" v-for="(item,index) in bannerDot" :key="index"
					:class="{'active':index===currenTab}">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	export default {
		data() {
			return {
				bannerDot: [0, 1, 2],
				currenTab: 0,
				guide1: resources.guide.guide1,
				guide2: resources.guide.guide2,
				guide3: resources.guide.guide3
			}
		},
		methods: {
			setLaunchFlag() {
				uni.setStorageSync('launchFlag', true)
				uni.reLaunch({
					url: '/pages/login/index'
				})
			},
			onChange(e) {
				this.currenTab = e.detail.current
			},
		}
	}
</script>
<style lang="scss">
	page {
		width: 100%;
		height: 100%;
	}

	.guide-v {
		width: 100%;
		height: 100%;

		.status-bar {
			height: var(--status-bar-height);
			width: 100%;
			background-color: #FFFFFF;

			.top-view {
				height: var(--status-bar-height);
				width: 100%;
				position: fixed;
				background-color: #FFFFFF;
				top: 0;
				z-index: 999;
			}
		}

		.content {
			width: 100%;
			height: 100%;
			background-size: 100% auto;
			padding: 0;
			touch-action: none;
			position: fixed;
		}

		.swiper {
			width: 100%;
			height: 100% !important;
			background: #FFFFFF;
		}

		.itemImg {
			width: 500rpx;
			height: 519rpx;
		}

		.swiper-item {
			width: 100%;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding-top: 260rpx;
		}

		.swiper-item-img {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 56rpx;
		}

		.swiper-item-text {
			.swiper-item-title {
				line-height: 130rpx;
				font-size: 87rpx;
				color: $u-type-primary;
				font-weight: 500;
			}

			.swiper-item-content {
				font-size: 28rpx;
				color: #666666;
			}
		}

		.bannerDots {
			width: 100%;
			height: 16rpx;
			display: flex;
			position: fixed;
			bottom: 8%;
			z-index: 99;
			left: 50%;
			transform: translate(-50%);
			align-items: center;
			justify-content: center;

			.banner-dot {
				width: 16rpx;
				height: 16rpx;
				border-radius: 50%;
				background: #CACACA;
				margin: 0 10rpx;

				&.active {
					width: 40rpx;
					height: 16rpx;
					background: $u-type-primary;
					border-radius: 8rpx;
				}
			}
		}

		.jump-over {
			position: absolute;
			z-index: 999;
			right: 46rpx;
			top: 86rpx;
			width: 128rpx;
			height: 54rpx;
			line-height: 54rpx;
			color: #fff;
			border-radius: 27rpx;
			text-align: center;
			font-size: 32rpx;
			background: rgba(123, 123, 123, 0.42);
		}

		.swiper-item-btn {
			margin-top: 80rpx;
			width: 278rpx;
			border: 1rpx solid #2979ff;
			opacity: 1;
			border-radius: 28rpx;
			line-height: 54rpx;
			color: #2979ff;
			font-size: 32rpx;
			z-index: 100;
		}
	}
</style>
