<template>
	<view class="flow-list flowBefore">
		<view class="flow-list-box">
			<view class="item" v-for="(item, index) in list" :key="item.id" @click="handleClick(item)">
				<view class="item-left">
					<text class="title u-font-28 u-line-1">{{item.fullName}}</text>
					<text class="title u-line-1 u-font-24">审批节点: <text
							class="titInner">{{item.thisStep ? item.thisStep : '暂无'}}</text></text>
					<text class="time title u-font-24">{{title}}:<text
							class="titInner">{{item.creatorTime | date('yyyy-mm-dd hh:MM')}}</text></text>
				</view>
				<view class="item-right">
					<image :src="item.flowStatus" mode="widthFix" class="item-right-img"></image>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import resources from '@/libs/resources.js'
	export default {
		name: "FlowList",
		props: {
			list: {
				type: Array,
				default: () => []
			},
			opType: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				title: ''
			};
		},
		created() {
			this.title = this.opType == 1 ? '接收时间' : this.opType == 2 ? '办理时间' : '抄送时间'
		},
		methods: {
			handleClick(item) {
				const config = {
					id: item.processId,
					enCode: item.flowCode,
					flowId: item.flowId,
					formType: item.formType,
					opType: this.opType,
					status: item.status,
					taskNodeId: item.thisStepId,
					fullName: item.fullName,
					taskId: item.id
				}
				uni.navigateTo({
					url: '/pages/workFlow/flowBefore/index?config=' + encodeURIComponent(JSON.stringify(config))
				})
			}
		}
	};
</script>
