<template>
	<view class="policy-v">
		<view class="reminder-content">
			<image :src="loginlogo" class="logo" mode="widthFix"></image>
			<view class="u-font-36 u-m-t-20 u-m-b-30">引迈开发平台</view>
			<view class="policy-tips u-m-t-20">
				<view>欢迎使用引迈开发平台,依据政策要求,为了您能使用所有功能，在使用中需要连接网络、定位、调用麦克风等服务，请仔细阅读
					<text class="u-type-primary" @click="userAgreement">《用户协议》</text>和<text class="u-type-primary"
						@click="privacyPolicy">《隐私政策》</text>，选择下方“同意并继续”表示您同意以上协议内容。
				</view>
			</view>
			<view class="operation-btn u-flex u-row-between">
				<u-button @click="exitApp" :custom-style="customStyle">不同意</u-button>
				<u-button type="primary" @click="agree" :custom-style="customStyle">同意并继续</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	export default {
		data() {
			return {
				loginlogo: resources.login.logo,
				agreement: resources.userAgreement,
				policy: resources.privacyPolicy,
				customStyle: {
					width: '40%'
				}
			}
		},
		methods: {
			exitApp() {
				plus.os.name == "Android" ? plus.runtime.quit() : plus.ios.import("UIApplication").sharedApplication()
					.performSelector("exit");
			},
			userAgreement() {
				plus.runtime.openURL(this.agreement);
			},
			privacyPolicy() {
				plus.runtime.openURL(this.policy);
			},
			agree() {
				uni.redirectTo({
					url: '/pages/launch/guide'
				})
			},
		}
	}
</script>

<style lang="scss">
	.policy-v {
		padding-top: 300rpx;

		.logo {
			width: 164rpx;
		}

		.reminder-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 0 54rpx;
		}

		.policy-tips {
			color: #9A9A9A;
		}

		.operation-btn {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 100rpx;
		}
	}
</style>
