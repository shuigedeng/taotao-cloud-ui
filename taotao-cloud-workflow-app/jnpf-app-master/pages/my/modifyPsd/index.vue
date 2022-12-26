<template>
	<view class="jnpf-wrap jnpf-wrap-workflow">
		<u-form :model="dataForm" :rules="rules" ref="dataForm" :errorType="['toast']" label-position="left"
			label-width="150" label-align="left">
			<u-form-item label="旧密码" prop="oldPassword" required>
				<u-input v-model="dataForm.oldPassword" placeholder="旧密码" type="password"></u-input>
			</u-form-item>
			<u-form-item label="新密码" prop="password" required>
				<u-input v-model="dataForm.password" placeholder="新密码" type="password"></u-input>
			</u-form-item>
			<u-form-item label="重复密码" prop="repeatPsd" required>
				<u-input v-model="dataForm.repeatPsd" placeholder="重复密码" type="password"></u-input>
			</u-form-item>
			<u-form-item label="验证码" prop="code" required>
				<view class="u-flex">
					<u-input v-model="dataForm.code" placeholder="验证码"></u-input>
					<view style="flex: 0.1;">
						<u-image :showLoading="true" :src="baseURL+imgUrl" width="130px" height="38px"
							@click="changeCode">
						</u-image>
					</view>
				</view>
			</u-form-item>
			<!-- 底部按钮 -->
			<view class="flowBefore-actions">
				<template>
					<u-button class="buttom-btn" type="primary" @click.stop="dataFormSubmit">
						{{'保存'}}
					</u-button>
				</template>
			</view>
		</u-form>
	</view>
</template>

<script>
	import md5Libs from "uview-ui/libs/function/md5";
	import {
		updatePassword
	} from "@/api/common.js"
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				const passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
				if (value === '') {
					callback(new Error('新密码不能为空'));
				} else if (!passwordreg.test(value)) {
					callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
				} else {
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('重复密码不能为空'));
				} else if (value !== this.dataForm.password) {
					callback(new Error('两次密码输入不一致'));
				} else {
					callback();
				}
			};
			return {
				imgUrl: '',
				timestamp: '',
				dataForm: {
					oldPassword: '',
					password: '',
					repeatPsd: '',
					code: '',
					timestamp: ''
				},
				rules: {
					oldPassword: [{
						required: true,
						message: '旧密码不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}],
					repeatPsd: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: '验证码不能为空',
						trigger: 'blur'
					}]
				},
			}
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			},
		},
		onLoad() {
			this.changeCode()

		},
		mounted() {
			this.$refs.dataForm.setRules(this.rules)
		},
		methods: {
			changeCode() {
				let timestamp = Math.random()
				this.timestamp = timestamp
				this.imgUrl = `/api/file/ImageCode/${timestamp}`
			},
			dataFormSubmit() {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						let query = {
							oldPassword: md5Libs.md5(this.dataForm.oldPassword),
							password: md5Libs.md5(this.dataForm.password),
							code: this.dataForm.code,
							timestamp: this.timestamp
						}
						updatePassword(query).then(res => {
							this.$store.dispatch('user/logout').then(() => {
								uni.reLaunch({
									url: '/pages/login/index'
								})
							})
						}).catch(() => {
							this.changeImg()
						})
					}
				})
			},
		}
	}
</script>
