<template>
	<view class="dynamicModel-v">
		<template v-if="showPage">
			<template v-if="webType==1">
				<Form :config="config" :modelId="modelId" :isPreview="isPreview" />
			</template>
			<template v-if="webType==2||webType==3">
				<List :config="config" :modelId="modelId" :isPreview="isPreview" :title="title" :menuId="menuId"
					ref="List" />
			</template>
		</template>
	</view>
</template>

<script>
	import Form from './components/form/index.vue'
	import List from './components/list/index.vue'
	import {
		getConfigData
	} from '@/api/apply/visualDev'
	export default {
		name: 'dynamicModel',
		components: {
			Form,
			List
		},
		data() {
			return {
				webType: '',
				showPage: false,
				isPreview: '0',
				modelId: '',
				menuId: '',
				title: '',
				config: {}
			}
		},
		onLoad(option) {
			this.modelId = option.id;
			this.isPreview = option.isPreview || '0';
			this.title = option.fullName || '';
			this.menuId = option.menuId || '';
			this.getConfigData()
		},
		onShow() {
			if (this.showPage) {
				this.$nextTick(() => {
					this.$refs.List.downCallback()
				})
			}
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
					this.config = res.data
					this.webType = res.data.webType || '2'
					this.title = this.title ? this.title : res.data.fullName
					uni.setNavigationBarTitle({
						title: this.title
					})
					this.showPage = true
				})
			}
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
