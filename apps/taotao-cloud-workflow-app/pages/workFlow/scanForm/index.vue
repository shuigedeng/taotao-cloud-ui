<template>
	<view class="dynamicModel-v">
		<template>
			<view class="workflow-wrap workflow-wrap-form" v-if="isShow">
				<childForm ref="child" :config="config" />
			</view>
		</template>
	</view>
</template>

<script>
	import childForm from '@/pages/workFlow/flowBefore/form'
	import {
		FlowEngineInfo
	} from '@/api/workFlow/flowEngine'
	export default {
		name: 'scanForm',
		components: {
			childForm
		},
		data() {
			return {
				webType: '',
				origin: '',
				id: '',
				config: {},
				formConf: {},
				key: +new Date(),
				flowConfig: {},
				isShow: false
			}
		},
		onLoad(option) {
			this.id = option.id
			this.initData()
		},
		methods: {
			initData() {
				FlowEngineInfo(this.id).then(res => {
					if (!res.data || !res.data.formData) return
					let data = {
						enCode: res.data.enCode,
						flowId: res.data.id,
						formConf: res.data.formData,
						formType: res.data.formType,
						fullName: res.data.fullName,
						type: res.data.type
					}
					this.config = data
					this.isShow = true
					this.$nextTick(() => {
						this.$refs.child.$refs.form.init(this.config)
					})
				})
			},
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
