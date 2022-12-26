<template>
	<view class="scheduleForm-v jnpf-wrap">
		<u-toast ref="uToast" />
		<u-form :model="dataForm" :rules="rules" ref="dataForm" :errorType="['toast']" label-position="left"
			label-width="150" label-align="left">
			<u-form-item label="开始时间" prop="startTime" required>
				<jnpf-date-time type="dateTime" v-model="dataForm.startTime" placeholder="开始时间">
				</jnpf-date-time>
			</u-form-item>
			<u-form-item label="结束时间" prop="endTime" required>
				<jnpf-date-time type="dateTime" v-model="dataForm.endTime" placeholder="结束时间"></jnpf-date-time>
			</u-form-item>
			<u-form-item label="记录内容" prop="content" required>
				<u-input v-model="dataForm.content" type="textarea" placeholder="请输入记录内容" />
			</u-form-item>
			<view class="jnpf-card">
				<u-form-item label="提醒设置" prop="early">
					<u-input v-model="dataForm.early" type="number" placeholder="默认一小时提醒我" />
				</u-form-item>
				<u-form-item label="APP提醒" prop="appAlert">
					<jnpf-switch v-model="dataForm.appAlert"></jnpf-switch>
				</u-form-item>
				<u-form-item label="微信提醒" prop="weChatAlert">
					<jnpf-switch v-model="dataForm.weChatAlert"></jnpf-switch>
				</u-form-item>
				<u-form-item label="邮件提醒" prop="mailAlert">
					<jnpf-switch v-model="dataForm.mailAlert"></jnpf-switch>
				</u-form-item>
				<u-form-item label="短信提醒" prop="mobileAlert">
					<jnpf-switch v-model="dataForm.mobileAlert"></jnpf-switch>
				</u-form-item>
			</view>
		</u-form>
		<view class="com-saveBox">
			<u-button type="primary" @click="save">保存</u-button>
		</view>
	</view>
</template>

<script>
	import {
		getScheduleInfo,
		create,
		update
	} from '@/api/apply/schedule.js'
	export default {
		data() {
			return {
				dataForm: {
					appAlert: 0,
					colour: "",
					content: "",
					early: '',
					endTime: '',
					mailAlert: 0,
					mobileAlert: 0,
					startTime: '',
					weChatAlert: 0
				},
				rules: {
					startTime: [{
						required: true,
						message: '开始时间不能为空',
						trigger: 'change',
						type: 'number'
					}],
					endTime: [{
						required: true,
						message: '结束时间不能为空',
						trigger: 'change',
						type: 'number'
					}],
					content: [{
						required: true,
						message: '记录不能为空',
						trigger: 'change',
					}],
				}
			}
		},
		onReady() {
			this.$refs.dataForm.setRules(this.rules);
		},
		onLoad(option) {
			if (option.id) {
				this.dataForm.id = option.id
				uni.setNavigationBarTitle({
					title: '编辑日程'
				});
				getScheduleInfo(option.id).then(res => {
					this.dataForm = res.data
				})
			} else {
				uni.setNavigationBarTitle({
					title: '新增日程'
				});
			}
		},
		methods: {
			save() {
				if (this.dataForm.startTime > this.dataForm.endTime) {
					this.$refs.uToast.show({
						title: '开始时间不能大于结束时间',
						type: 'error'
					})
					this.dataForm.startTime = '';
					this.dataForm.endTime = '';
					return
				}
				this.$refs.dataForm.validate((valid) => {
					if (valid) {
						const formMethod = this.dataForm.id ? update : create;
						formMethod(this.dataForm).then(res => {
							uni.showToast({
								title: res.msg,
								complete: () => {
									setTimeout(() => {
										uni.redirectTo({
											url: './index',
										});
									}, 1500)
								}
							})
						})
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.scheduleForm-v {
		padding-bottom: 110rpx;
	}
</style>
