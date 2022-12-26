<template>
	<view class="settings-v">
		<u-cell-group>
			<!-- #ifdef APP-PLUS -->
			<u-cell-item title="用户协议" @click='openPage(agreement)'></u-cell-item>
			<u-cell-item title="隐私政策" @click='openPage(policy)'></u-cell-item>
			<!-- #endif -->
			<u-cell-item title="修改密码" @click="modifyPsd('/pages/my/modifyPsd/index')"></u-cell-item>
			<u-cell-item title="联系我们" @click="modifyPsd('/pages/my/contactUs/index')"></u-cell-item>
			<u-cell-item title="关于平台" @click="modifyPsd('/pages/my/abouts/index')"></u-cell-item>
		</u-cell-group>
		<view class="u-p-t-20">
			<view class="logout-cell" hover-class="u-cell-hover" @click="logout">退出登录</view>
		</view>
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	export default {
		data() {
			return {
				// #ifdef APP-PLUS
				agreement: resources.userAgreement,
				policy: resources.privacyPolicy,
				// #endif
			};
		},
		methods: {
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定退出当前账号吗？',
					success: res => {
						if (res.confirm) {
							this.$store.dispatch('user/logout').then(() => {
								uni.closeSocket()
								uni.reLaunch({
									url: '/pages/login/index'
								})
							})
						}
					}
				})
			},

			modifyPsd(path) {
				if (!path) return
				uni.navigateTo({
					url: path
				})
			},
			// #ifdef APP-PLUS
			openPage(url) {
				plus.runtime.openURL(url);
			}
			// #endif
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.settings-v {
		.logout-cell {
			text-align: center;
			font-size: 28rpx;
			line-height: 100rpx;
			background-color: #fff;
		}
	}
</style>
