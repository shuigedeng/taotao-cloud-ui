<template>
	<view class="jnpf-wrap jnpf-wrap-workflow">
		<jnpf-parser :formConf="formConf" ref="dynamicForm" v-if="!loading" @submit="sumbitForm" :key="key" />
		<candidate-form v-model="selectShow" :candidateList="candidateList" taskId="0" :formData="dataForm"
			@submitCandidate="submitCandidate" ref="candidateForm" />
	</view>
</template>

<script>
	import {
		DynamicInfo
	} from '@/api/workFlow/workFlowForm'
	import {
		Candidates
	} from '@/api/workFlow/flowBefore'
	import {
		createModel,
		updateModel,
		getModelInfo
	} from '@/api/apply/visualDev'
	import CandidateForm from '../../components/CandidateForm'
	export default {
		components: {
			CandidateForm
		},
		data() {
			return {
				selectShow: false,
				loading: true,
				key: +new Date(),
				setting: {},
				formConf: {},
				formData: {},
				eventType: '',
				dataForm: {
					id: '',
					data: '',
					flowId: ''
				},
				candidateList: [],
			}
		},
		methods: {
			init(data) {
				this.setting = data
				this.formConf = data.formConf ? JSON.parse(data.formConf) : {}
				this.dataForm.id = data.id || '',
					this.dataForm.flowId = data.flowId,
					this.loading = true
				this.$nextTick(() => {
					if (this.dataForm.id) {
						let extra = {
							modelId: data.flowId,
							id: this.dataForm.id,
							type: data.type,
							flowId: data.flowId,
							processId: data.id,
							opType: data.opType,
							taskId: data.taskId
						}
						uni.setStorageSync('dynamicModelExtra', extra)
						if (data.draftData) {
							this.formData = data.draftData
							this.fillFormData(this.formConf, this.formData)
							this.$nextTick(() => {
								this.loading = false
							})
							return
						}
						if (data.type == 1) {
							getModelInfo(data.flowId, this.dataForm.id).then(res => {
								this.dataForm = res.data
								if (!this.dataForm.data) return
								this.formData = JSON.parse(this.dataForm.data)
								this.fillFormData(this.formConf, this.formData)
								this.$nextTick(() => {
									this.loading = false
								})
							})
						} else {
							DynamicInfo(this.dataForm.id).then(res => {
								this.dataForm = res.data
								if (!this.dataForm.data) return
								this.formData = JSON.parse(this.dataForm.data)
								this.fillFormData(this.formConf, this.formData)
								this.$nextTick(() => {
									this.loading = false
								})
							})
						}
					} else {
						uni.setStorageSync('dynamicModelExtra', {})
						this.formData = {}
						this.fillFormData(this.formConf, this.formData)
						this.$nextTick(() => {
							this.loading = false
						})
						this.dataForm.flowId = data.flowId
					}
					this.key = +new Date()
				})
			},
			fillFormData(form, data) {
				form.disabled = this.setting.readonly
				const loop = (list, parent) => {
					for (let i = 0; i < list.length; i++) {
						let item = list[i]
						if (item.__vModel__) {
							const val = data[item.__vModel__]
							if (val !== undefined && !item.__config__.isSubTable) item.__config__.defaultValue = val
							let noShow = false,
								isDisabled = true,
								required = false,
								isVisibility = false
							if (!item.__config__.visibility || (Array.isArray(item.__config__.visibility) && item
									.__config__.visibility.includes('app'))) isVisibility = true
							if (this.setting.formOperates && this.setting.formOperates.length) {
								let id = item.__config__.isSubTable ? parent.__vModel__ + '-' + item.__vModel__ :
									item
									.__vModel__
								let arr = this.setting.formOperates.filter(o => o.id === id) || []
								if (arr.length) {
									let obj = arr[0]
									noShow = !obj.read
									isDisabled = !obj.write
									required = obj.required ? obj.required : item.__config__.required
								}
							} else {
								isDisabled = false
							}
							isDisabled = item.disabled ? item.disabled : item.readonly ? item.readonly : isDisabled
							noShow = item.__config__.noShow ? item.__config__.noShow : noShow
							if (this.setting.readonly) isDisabled = true
							if (this.setting.origin === 'scan') isDisabled = true
							this.$set(item, 'disabled', isDisabled)
							this.$set(item.__config__, 'noShow', noShow)
							this.$set(item.__config__, 'required', required)
							this.$set(item.__config__, 'isVisibility', isVisibility)
						} else {
							let noShow = false,
								isVisibility = false
							if (!item.__config__.visibility || (Array.isArray(item.__config__.visibility) && item
									.__config__.visibility.includes('app'))) isVisibility = true
							this.$set(item.__config__, 'isVisibility', isVisibility)
							this.$set(item.__config__, 'noShow', noShow)
						}
						if (item.__config__ && item.__config__.children && Array.isArray(item.__config__.children)) {
							loop(item.__config__.children, item)
						}
					}
				}
				loop(form.fields)
			},
			sumbitForm(data, callback) {
				if (!data) return
				this.dataForm.data = JSON.stringify(data)
				if (callback && typeof callback === "function") callback()
				if (this.setting.type == 1) {
					if (this.eventType === 'save' || this.eventType === 'submit') {
						this.selfSubmit()
						return
					}
					this.$emit('eventReceiver', this.dataForm, this.eventType)
				} else {
					this.$emit('eventReceiver', this.dataForm, this.eventType)
				}
			},
			// 候选人提交
			submitCandidate(data) {
				this.selectShow = false
				if (data) {
					this.selfHandleRequest(data)
				} else {
					uni.showModal({
						title: '提示',
						content: '您确定要提交当前流程吗？',
						success: res => {
							this.selfHandleRequest()
						}
					})
				}
			},
			selfSubmit() {
				this.dataForm.status = this.eventType === 'submit' ? 0 : 1
				this.dataForm.flowId = this.setting.flowId
				if (this.eventType === 'save') return this.selfHandleRequest()
				Candidates(0, {
					formData: this.dataForm
				}).then(res => {
					let data = res.data
					if (Array.isArray(data) && data.length) {
						this.candidateList = res.data
						this.selectShow = true
					} else {
						uni.showModal({
							title: '提示',
							content: '您确定要提交当前流程吗？',
							success: res => {
								if (res.confirm) {
									this.selfHandleRequest()
								}
							}
						})
					}
				}).catch(() => {
					this.selectShow = false
				})
			},
			selfHandleRequest(candidateList) {
				if (candidateList) this.dataForm.candidateList = candidateList
				if (!this.dataForm.id) delete(this.dataForm.id)
				if (this.eventType === 'save') this.$emit('setBtnLoad', true)
				const formMethod = this.dataForm.id ? updateModel : createModel
				formMethod(this.setting.flowId, this.dataForm).then(res => {
					uni.showToast({
						title: res.msg,
						complete: () => {
							setTimeout(() => {
								uni.$emit('refresh')
								if (this.eventType === 'save') this.$emit('setBtnLoad', false)
								uni.navigateBack()
							}, 1500)
						}
					})
				}).catch(() => {
					if (this.eventType === 'save') this.$emit('setBtnLoad', false)
				})
			},
			submit(eventType) {
				if (this.setting.isPreview == '1') {
					uni.showToast({
						title: '功能预览不支持数据保存',
						icon: 'none'
					})
					return
				}
				this.eventType = eventType
				this.$refs.dynamicForm && this.$refs.dynamicForm.submitForm()
			},
			// resetForm() {
			// 	this.key = +new Date()
			// 	this.$refs.dynamicForm && this.$refs.dynamicForm.resetForm()
			// }
		}
	}
</script>
