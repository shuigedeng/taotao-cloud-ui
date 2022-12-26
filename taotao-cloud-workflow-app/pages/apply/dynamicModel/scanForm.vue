<template>
	<view class="dynamicModel-v">
		<template v-if="showPage">
			<view class="workflow-wrap workflow-wrap-form" v-if="config.mt == 2">
				<workflow-parser :formConf="formConf" ref="dynamicForm" @submit="sumbitForm" :key="key" />
			</view>
			<template v-else>
				<FlowForm ref="flowForm" :config="flowConfig" />
			</template>
		</template>
	</view>
</template>

<script>
	import Form from './components/form/index.vue'
	import FlowForm from '@/pages/workFlow/flowBefore/flowForm'
	import {
		getConfigData,
		getModelInfo
	} from '@/api/apply/visualDev'
	export default {
		name: 'scanForm',
		components: {
			Form,
			FlowForm
		},
		data() {
			return {
				webType: '',
				showPage: false,
				origin: '',
				id: '',
				config: {},
				formConf: {},
				key: +new Date(),
				flowConfig: {}
			}
		},
		onLoad(option) {
			this.config = JSON.parse(option.config)
			this.initData()
		},
		methods: {
			initData() {
				this.showPage = false
				if (this.config.mt == 2) {
					this.getConfigData()
				} else {
					let data = {
						flowId: this.config.fid,
						id: this.config.pid,
						formType: 2,
						opType: this.config.opt,
						taskId: this.config.ftid
					}
					this.showPage = true
					this.$nextTick(() => {
						this.$refs.flowForm.init(data)
					})
				}
			},
			getConfigData() {
				getConfigData(this.config.mid).then(res => {
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
					this.formConf = JSON.parse(res.data.formData)
					uni.setNavigationBarTitle({
						title: res.data.fullName
					})
					let extra = {
						modelId: this.config.mid,
						id: this.config.id,
						type: this.config.mt
					}
					uni.setStorageSync('dynamicModelExtra', extra)
					getModelInfo(this.config.mid, this.config.id).then(res => {
						if (!res.data.data) return
						let formData = JSON.parse(res.data.data)
						this.fillFormData(this.formConf, formData)
						this.$nextTick(() => {
							this.showPage = true
							this.key = +new Date()
						})
					})
				})
			},
			fillFormData(form, data) {
				const loop = list => {
					for (let i = 0; i < list.length; i++) {
						let item = list[i]
						if (item.__vModel__) {
							const val = data[item.__vModel__]
							if (val) item.__config__.defaultValue = val
							this.$set(item, 'disabled', true)
						}
						if (item.__config__ && item.__config__.workflowKey !== 'table' && item.__config__.children && Array
							.isArray(item.__config__.children)) {
							loop(item.__config__.children)
						}
					}
				}
				loop(form.fields)
			},
			sumbitForm() {}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.dynamicModel-v {
		height: 100%;
	}
</style>
