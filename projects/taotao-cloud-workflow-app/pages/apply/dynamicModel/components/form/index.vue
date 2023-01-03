<template>
	<view class="workflow-wrap workflow-wrap-form">
		<workflow-parser :formConf="formConf" ref="dynamicForm" v-if="!loading" @submit="sumbitForm" :key="key" />
		<view class="buttom-actions" v-if="origin !='scan'">
			<u-button class="buttom-btn" @click.stop="resetForm">重置</u-button>
			<u-button class="buttom-btn" type="primary" @click.stop="submit" :loading="btnLoading">
				{{formConf.confirmButtonText||'确定'}}
			</u-button>
		</view>
	</view>
</template>

<script>
	import {
		createModel,
		getModelInfo
	} from '@/api/apply/visualDev'
	export default {
		props: ['config', 'modelId', 'isPreview', 'origin', 'id'],
		data() {
			return {
				dataForm: {
					data: ''
				},
				formConf: {},
				key: +new Date(),
				btnLoading: false,
				loading: true,
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				this.formConf = JSON.parse(this.config.formData)
				this.loading = true
				this.initData()
			},
			initData() {
				this.$nextTick(() => {
					if (this.origin === 'scan') {
						let extra = {
							modelId: this.modelId,
							id: this.id,
							type: 2
						}
						uni.setStorageSync('dynamicModelExtra', extra)
						getModelInfo(this.modelId, this.id).then(res => {
							this.dataForm = res.data
							if (!this.dataForm.data) return
							this.formData = JSON.parse(this.dataForm.data)
							this.fillFormData(this.formConf, this.formData)
							this.$nextTick(() => {
								this.loading = false
							})
						})
					} else {
						uni.setStorageSync('dynamicModelExtra', {})
						this.formData = {}
						this.loading = false
						this.fillFormData(this.formConf, this.formData)
					}
					this.key = +new Date()
				})
			},
			fillFormData(form, data) {
				const loop = list => {
					for (let i = 0; i < list.length; i++) {
						let item = list[i]
						if (item.__vModel__) {
							const val = data[item.__vModel__]
							if (val) item.__config__.defaultValue = val
							if (this.origin === 'scan') {
								this.$set(item, 'disabled', true)
							}
							let noShow = false
							let isVisibility = false
							if (!item.__config__.visibility || (Array.isArray(item.__config__.visibility) && item
									.__config__.visibility.includes('app'))) isVisibility = true
							this.$set(item.__config__, 'isVisibility', isVisibility)
							this.$set(item.__config__, 'noShow', noShow)
						}
						if (item.__config__ && item.__config__.workflowKey !== 'table' && item.__config__.children && Array
							.isArray(item.__config__.children)) {
							loop(item.__config__.children)
						}
					}
				}
				loop(form.fields)
			},
			sumbitForm(data, callback) {
				if (!data) return
				this.btnLoading = true
				this.dataForm.data = JSON.stringify(data)
				if (callback && typeof callback === "function") callback()
				createModel(this.modelId, this.dataForm).then(res => {
					uni.showToast({
						title: res.msg,
						complete: () => {
							setTimeout(() => {
								this.btnLoading = false
								uni.navigateBack()
							}, 1500)
						}
					})
				}).catch(() => {
					this.btnLoading = false
				})
			},
			submit() {
				if (this.isPreview == '1') {
					uni.showToast({
						title: '功能预览不支持数据保存',
						icon: 'none'
					})
					return
				}
				this.$refs.dynamicForm && this.$refs.dynamicForm.submitForm()
			},
			resetForm() {
				this.loading = true
				this.key = +new Date()
				this.$nextTick(() => {
					this.loading = false
					this.$refs.dynamicForm && this.$refs.dynamicForm.resetForm()
				})
			}
		}
	}
</script>
