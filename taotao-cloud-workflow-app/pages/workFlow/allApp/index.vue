<template>
	<view>
		<view class="" v-if="type == 1">
			<allAppWorkFlow ref="allAppWorkFlow" :categoryList='categoryList'></allAppWorkFlow>
		</view>
		<view class="" v-if="type == 2">
			<allAppApply ref="allAppApply"></allAppApply>
		</view>
	</view>
</template>

<script>
	import allAppWorkFlow from './allApp_workFlow.vue'
	import allAppApply from './allApp_apply.vue'
	import {
		FlowEngineListAll
	} from '@/api/workFlow/flowEngine'
	import {
		getFlowList,
		getDataList,
		getUsualList,
		addUsual,
		delUsual
	} from '@/api/apply/apply.js'
	export default {
		components: {
			allAppWorkFlow,
			allAppApply
		},
		data() {
			return {
				type: '1',
				categoryList: []
			}
		},
		onLoad(option) {
			this.type = option.type || '1'
			uni.setNavigationBarTitle({
				title: this.type == '1' ? '更多流程' : '更多应用'
			})
			this.categoryList = option.categoryList ? JSON.parse(option.categoryList) : []
			this.init()
		},
		methods: {
			init(option) {
				this.$nextTick(() => {
					if (this.type == 1) {
						this.$refs.allAppWorkFlow.init()
					} else {
						this.$refs.allAppApply.init()
					}
				})
			},
		}
	}
</script>

<style lang="scss">
</style>
