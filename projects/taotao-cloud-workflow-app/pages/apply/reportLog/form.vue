<template>
	<view class="logForm-v workflow-wrap">
		<u-form :model="dataForm" :rules="rules" ref="dataForm" :errorType="['toast']" label-position="left"
			label-width="150" label-align="left">
			<u-form-item label="日志标题" prop="title" required>
				<u-input v-model="dataForm.title" placeholder="请输入日志标题" :disabled="disabled"></u-input>
			</u-form-item>
			<u-form-item label="今日内容" prop="todayContent" required>
				<u-input v-model="dataForm.todayContent" type="textarea" placeholder="请输入今日内容" :disabled="disabled" />
			</u-form-item>
			<u-form-item label="明日内容" prop="tomorrowContent" required>
				<u-input v-model="dataForm.tomorrowContent" type="textarea" placeholder="请输入明日内容"
					:disabled="disabled" />
			</u-form-item>
			<u-form-item label="遇到问题" prop="question" required>
				<u-input v-model="dataForm.question" type="textarea" placeholder="请输入遇到问题" :disabled="disabled" />
			</u-form-item>
			<u-form-item label="发送给谁" prop="userIds" required>
				<workflow-user-select v-model="dataForm.userIds" multiple :disabled="disabled"></workflow-user-select>
			</u-form-item>
		</u-form>
		<view class="com-saveBox" v-if="!disabled">
			<u-button type="primary" @click="save">保存</u-button>
		</view>
	</view>
</template>

<script>
	import {
		getLogInfo,
		createLog,
		updateLog
	} from '@/api/apply/reportLog.js'
	export default {
		data() {
			return {
				dataForm: {
					title: '',
					todayContent: '',
					tomorrowContent: '',
					question: '',
					userIds: ''
				},
				rules: {
					title: [{
						required: true,
						message: '日志标题不能为空',
						trigger: ['change', 'blur']
					}],
					todayContent: [{
						required: true,
						message: '今日内容不能为空',
						trigger: ['change', 'blur']
					}],
					tomorrowContent: [{
						required: true,
						message: '明日内容不能为空',
						trigger: ['change', 'blur']
					}],
					question: [{
						required: true,
						message: '问题不能为空',
						trigger: ['change', 'blur']
					}],
					userIds: [{
						required: true,
						message: '用户不能为空',
						trigger: ['change', 'blur'],
						type: 'array'
					}],
				},
				type: '0',
				disabled: false
			}
		},
		onReady() {
			this.$refs.dataForm.setRules(this.rules);
		},
		onLoad(option) {
			this.type = option.type
			if (!option.id) {
				uni.setNavigationBarTitle({
					title: '新增日志'
				});
				let userInfo = uni.getStorageSync('userInfo') || {}
				if (!userInfo.userName) return
				this.dataForm.title = userInfo.userName + '的日志'
			} else {
				if (this.type == '1') this.disabled = true
				getLogInfo(option.id).then(res => {
					this.dataForm = res.data;
					this.dataForm.userIds = this.dataForm.userIds.split(',')
					uni.setNavigationBarTitle({
						title: this.dataForm.title
					});
				})
			}
		},
		methods: {
			save() {
				this.$refs.dataForm.validate((valid) => {
					this.dataForm.toUserId = this.dataForm.userIds.join(',')
					if (valid) {
						const method = this.dataForm.id ? updateLog : createLog
						method(this.dataForm).then(res => {
							uni.showToast({
								title: res.msg,
								complete: () => {
									setTimeout(() => {
										uni.$emit('refresh')
										uni.navigateBack()
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

	.logForm-v {
		padding-bottom: 140rpx;
	}
</style>
