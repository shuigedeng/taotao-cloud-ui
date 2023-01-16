<template>
	<view class="records">
		<u-time-line>
			<u-time-line-item v-if="endTime">
				<template v-slot:content>
					<view class="record-cell record-title">流程结束</view>
					<view class="record-cell">结束时间：{{endTime|date('yyyy-mm-dd hh:MM')}}</view>
				</template>
			</u-time-line-item>
			<u-time-line-item v-for="(item,i) in options" :key="i">
				<template v-slot:content>
					<view v-if="item.handleStatus==2">
						<view class="record-cell record-title">发起人员：{{item.userName}}</view>
						<view class="record-cell">发起时间：{{item.handleTime|date('yyyy-mm-dd hh:MM')}}</view>
					</view>
					<view v-else-if="item.handleStatus==3">
						<view class="record-cell record-title">撤回人员：{{item.userName}}</view>
						<view class="record-cell">撤回节点：{{item.nodeName}}</view>
						<view class="record-cell">撤回时间：{{item.handleTime|date('yyyy-mm-dd hh:MM')}}</view>
						<view class="record-cell" v-if="item.handleOpinion">撤回原因：{{item.handleOpinion}}</view>
					</view>
					<view v-else-if="item.handleStatus==4">
						<view class="record-cell record-title">终止人员：{{item.userName}}</view>
						<view class="record-cell">终止时间：{{item.handleTime|date('yyyy-mm-dd hh:MM')}}</view>
						<view class="record-cell" v-if="item.handleOpinion">终止原因：{{item.handleOpinion}}</view>
					</view>
					<view v-else-if="item.handleStatus==5">
						<view class="record-cell record-title">执行人员：{{item.userName}}</view>
						<view class="record-cell">执行动作：<text class="u-type-primary">指派</text></view>
						<view class="record-cell">执行时间：{{item.handleTime|date('yyyy-mm-dd hh:MM')}}</view>
						<view class="record-cell">指派人员：{{item.operatorId}}</view>
					</view>
					<view v-else-if="item.handleStatus==6">
						<view class="record-cell record-title">执行人员：{{item.userName}}</view>
						<view class="record-cell">执行动作：<text class="u-type-primary">加签</text></view>
						<view class="record-cell">执行时间：{{item.handleTime|date('yyyy-mm-dd hh:MM')}}</view>
						<view class="record-cell">加签人员：{{item.operatorId}}</view>
					</view>
					<view v-else-if="item.handleStatus==7">
						<view class="record-cell record-title">执行人员：{{item.userName}}</view>
						<view class="record-cell">执行动作：<text class="u-type-primary">转审</text></view>
						<view class="record-cell">执行时间：{{item.handleTime|date('yyyy-mm-dd hh:MM')}}</view>
						<view class="record-cell">转审人员：{{item.operatorId}}</view>
					</view>
					<view v-else>
						<view class="record-cell record-title">审核人员：{{item.userName}}{{item.status==1?'(加签)':''}}</view>
						<view class="record-cell">审核节点：{{item.nodeName}}</view>
						<view class="record-cell">审核时间：{{item.handleTime|date('yyyy-mm-dd hh:MM')}}</view>
						<view class="record-cell">审核状态：
							<text :class="item.handleStatus==1?'u-type-success':'u-type-error'">
								{{item.handleStatus == 1?'审核通过':'审核拒绝'}}</text>
						</view>
						<view class="record-cell" v-if="item.handleOpinion">审核意见：{{item.handleOpinion}}</view>
						<view class="record-cell" v-if="item.signImg">审核签名：
							<image class="record-cell-img" :src="item.signImg" mode="widthFix" />
						</view>
					</view>
				</template>
			</u-time-line-item>
		</u-time-line>
	</view>
</template>

<script>
	export default {
		name: 'Records',
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			},
			endTime: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.records {
		.record-cell {
			color: #909399;
			line-height: 50rpx;
			font-size: 28rpx;

			&.record-title {
				color: #3a3a3a;
				font-size: 30rpx;
			}

			.record-cell-img {
				width: 100%;
			}
		}
	}
</style>
