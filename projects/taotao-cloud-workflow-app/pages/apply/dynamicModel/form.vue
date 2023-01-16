<template>
	<view class="dynamicModel-form-v workflow-wrap workflow-wrap-form" v-if="showPage">
		<workflow-parser :formConf="formConf" ref="dynamicForm" v-if="!loading" @submit="sumbitForm" :key="key" />
		<view class="buttom-actions" v-if="btnType === 'btn_edit' || btnType === 'btn_add'">
			<u-button class="buttom-btn" @click.stop="workflow.goBack">{{formConf.cancelButtonText||'取消'}}</u-button>
			<u-button class="buttom-btn" type="primary" @click.stop="submit" :loading="btnLoading">
				{{formConf.confirmButtonText||'确定'}}
			</u-button>
		</view>
	</view>
</template>

<script>
	import {
		getConfigData,
		createModel,
		updateModel,
		getModelInfo
	} from '@/api/apply/visualDev'
	export default {
		data() {
			return {
				webType: '',
				showPage: false,
				btnLoading: false,
				loading: true,
				isPreview: '0',
				modelId: '',
				formConf: {},
				formData: {},
				dataForm: {
					id: '',
					data: ''
				},
				btnType: '',
				formPermissionList: {}
			}
		},
		onLoad(option) {
			this.formPermissionList = !option.currentMenu ? [] : JSON.parse(decodeURIComponent(option.currentMenu))
			this.btnType = option.jurisdictionType || ''
			this.modelId = option.modelId;
			this.isPreview = option.isPreview || '0';
			this.dataForm.id = option.id || ''
			uni.setNavigationBarTitle({
				title: option.formTitle
			})
			this.getConfigData()
		},
		methods: {
			getConfigData() {
				getConfigData(this.modelId).then(res => {
					if (res.code !== 200 || !res.data) {
						uni.showToast({
							title: '暂无此页面',
							icon: 'none',
							complete: () => {
								setTimeout(() => {
									uni.navigateBack()
								}, 1500)
							}
						})
						return
					}
					this.formConf = res.data.formData ? JSON.parse(res.data.formData) : {};
					this.showPage = true
					this.initData()
				})
			},
			initData() {
				this.$nextTick(() => {
					if (this.dataForm.id) {
						let extra = {
							modelId: this.modelId,
							id: this.dataForm.id,
							type: 2
						}
						uni.setStorageSync('dynamicModelExtra', extra)
						getModelInfo(this.modelId, this.dataForm.id).then(res => {
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
							const btn_detail = this.$setPermission.hasBtnP('btn_detail', this.formPermissionList
								.menuId)
							const btn_edit = this.$setPermission.hasBtnP('btn_edit', this.formPermissionList
								.menuId)
							if (!!this.dataForm.id && !btn_edit && btn_detail) {
								item.disabled = btn_detail
							}
							let noShow = false
							let isVisibility = false
							if (!item.__config__.visibility || (Array.isArray(item.__config__.visibility) && item
									.__config__.visibility.includes('app'))) isVisibility = true
							this.$set(item.__config__, 'isVisibility', isVisibility)
							this.$set(item.__config__, 'noShow', noShow)
							if (this.formPermissionList.useFormPermission) {
								noShow = true
								if (this.formPermissionList.formList && this.formPermissionList.formList.length) {
									noShow = !this.formPermissionList.formList.some(o => o.enCode === item.__vModel__)
								}
								noShow = item.__config__.noShow ? item.__config__.noShow : noShow;
								this.$set(item.__config__, 'noShow', noShow)
							}
						} else {
							let noShow = false,
								isVisibility = false
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
				const formMethod = this.dataForm.id ? updateModel : createModel
				formMethod(this.modelId, this.dataForm).then(res => {
					uni.showToast({
						title: res.msg,
						complete: () => {
							setTimeout(() => {
								uni.$emit('refresh')
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.dynamicModel-form-v {}
</style>
