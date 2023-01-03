<template>
	<view class="logo-v">
		<view class="login-bg">
			<image src="/static/login-bg.png" mode="widthFix"></image>
		</view>
		<view class="logo-hd u-flex-col">
			<view class="logoImg">
				<image :src="appIcon" mode="widthFix"></image>
			</view>
			<!-- <view class="u-flex-col introduce u-m-t-30">
				<text class="u-font-36 text-one">{{sysName}}</text>
				<text class="u-font-24 text-two">低代码，企业数字化好帮手</text>
			</view> -->
			<view class="loginSwitch u-flex-col">
				<view class="loginInputBox u-flex-col">
					<u-form :model="formData" :rules="rules" ref="dataForm" :errorType="['toast']" label-position="left"
						label-width="150" label-align="left">
						<u-form-item prop="account">
							<u-input v-model="formData.account" placeholder="请输入帐号" @focus="onFocus" @blur="onBlur">
							</u-input>
						</u-form-item>
						<u-form-item prop="password">
							<u-input v-model="formData.password" type="password" placeholder="请输入密码"></u-input>
						</u-form-item>
						<u-form-item prop="code" required v-if="needCode">
							<view class="u-flex code-box">
								<u-input v-model="formData.code" placeholder="验证码"></u-input>
								<view style="flex: 0.1;">
									<u-image :showLoading="true" :src="baseURL+imgUrl" width="130px" height="38px"
										@click="changeCode">
									</u-image>
								</view>
							</view>
						</u-form-item>
					</u-form>
					<view class="loginBtnBox u-m-t-64">
						<u-button @click="login" type="primary" :loading="loading">{{ loading ? "登录中...":"登录"}}
						</u-button>
					</view>
				</view>
			</view>
		</view>
		<view class="copyright">{{copyright}}</view>
	</view>
</template>

<script>
	import {
		login,
		getConfig
	} from '@/api/common.js'
	import md5Libs from "uview-ui/libs/function/md5";
	import resources from '@/libs/resources'

	export default {
		data() {
			return {
				imgUrl: '',
				loading: false,
				formData: {
					account: "",
					password: "",
					code: "",
					origin: 'password'
				},
				needCode: false,
				codeLength: 4,
				isCode: false,
				rules: {
					account: [{
						required: true,
						message: '请输入账号',
						trigger: 'blur',
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur',
					}],
				},
				sysConfigInfo: {},
				appIcon: '',
				sysName: '',
				copyright: ''
			}
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			},
		},
		onReady() {
			this.$refs.dataForm.setRules(this.rules);
		},
		onLoad() {
			this.sysConfigInfo = uni.getStorageSync('sysConfigInfo')
			this.appIcon = !!this.sysConfigInfo.appIcon ? this.baseURL + this.sysConfigInfo.appIcon :
				'/static/logo.png'
			this.sysName = !!this.sysConfigInfo.companyName ? this.sysConfigInfo.sysName :
				'WORKFLOW快速开发平台'
			this.copyright = !!this.sysConfigInfo.copyright ? this.sysConfigInfo.copyright :
				'Copyright © 2022 滔滔信息技术有限公司出品'

			let needCode = uni.getStorageSync('app_loginNeedCode')
			this.isCode = needCode
			this.changeCode()
			this.formData.password = '';
		},
		methods: {
			onFocus(e) {
				this.getConfig(e)
			},
			onBlur(e) {
				this.getConfig(e)
			},

			getConfig(val) {
				if (!val) return
				getConfig(this.formData.account).then(res => {
					this.needCode = !!res.data.enableVerificationCode
					if (this.needCode) {
						this.codeLength = res.data.verificationCodeNumber || 4
						this.changeCode()
					}
				})
			},
			changeCode() {
				let timestamp = Math.random()
				this.timestamp = timestamp
				this.imgUrl = `/api/oauth/ImageCode/${this.codeLength || 4}/${timestamp}`
			},
			login() {
				this.$refs.dataForm.validate(valid => {
					if (valid) {
						this.loading = true
						let query = {
							account: this.formData.account,
							password: md5Libs.md5(this.formData.password),
							timestamp: this.timestamp,
							code: this.formData.code,
							origin: this.formData.origin
						}
						// #ifdef  APP-PLUS
						const clientId = plus.push.getClientInfo().clientid;
						query.clientId = clientId
						// #endif
						login(query).then(res => {
							this.loading = false
							let token = res.data.token
							this.$store.commit('user/SET_TOKEN', token)
							uni.setStorageSync('token', token)
							uni.switchTab({
								url: '/pages/index/apply'
							});
						}).catch((err) => {
							this.loading = false
						})
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {}

	.logo-v {
		.login-bg {
			image {
				width: 100%;
				height: 100%;
			}
		}

		.logo-hd {
			width: 100%;
			position: absolute;
			top: 200rpx;

			.logoImg {
				width: 160rpx;
				height: 160rpx;
				margin: 0 auto;

				image {
					width: 100%;
					height: 100%;
					border-radius: 20%;
				}
			}

			.introduce {
				justify-content: center;
				align-items: center;

				.text-one {
					height: 70rpx;
					font-weight: 700;
				}

				.text-two {
					color: #999999;
				}
			}
		}

		.loginSwitch {
			margin-top: 40rpx;
			justify-content: center;
			align-items: center;

			.tabs {
				color: #999999;
				position: relative;

				&::after {
					content: "";
					width: 64rpx;
					height: 4rpx;
					background-color: #356efe;
					margin-top: 15rpx;
					position: absolute;
					left: 0;
					bottom: -15rpx;
					display: block;
					border-radius: 50rpx;
				}

				// &.active1 {
				// 	&::after {
				// 		left: 0;
				// 	}
				// }

				&.active2 {
					&::after {
						left: 70%;
					}
				}

				.tab {
					width: 50%;
					height: 80upx;
					text-align: center;
					color: #AEAFB5;
					font-size: 32upx;

					&.active {
						color: #3281ff;
					}
				}

			}

			.loginInputBox {
				width: 100%;
				margin-top: 80rpx;
				padding: 0 64rpx;

				.code-box {
					width: 100%;
				}

				.loginBtnBox {}
			}
		}
	}
</style>
