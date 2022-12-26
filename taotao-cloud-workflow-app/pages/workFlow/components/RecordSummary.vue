<template>
	<view class="approve-v u-flex-col">
		<u-tabs :list="approve_list" :current="approveIndex" @change="approveChange" height="100" :show-bar="false">
		</u-tabs>

		<view class="approve_list">
			<view v-if="list.length">
				<view class="u-flex approve_box" v-for="(item,index) in list" :key="index">
					<view class="tit">{{item.fullName}}</view>
					<view class="u-flex-col approve_box_right">
						<view v-for="(child,i) in item.list" :key="i" class="approve_box_right_inner">
							<template v-if="child.handleStatus === 0">
								<view class="approve_box_right_list">
									<view class="u-flex user_name marginBottom">
										<text>{{item.fullName}} {{child.userName}}</text>
										<text class="refuse">审批拒绝</text>
									</view>
									<view class="time marginBottom">
										<text>审批时间:{{$u.timeFormat(child.handleTime,'yyyy-mm-dd hh:MM')}}</text>
									</view>
									<view class="u-flex-col content_txt_box">
										<text>审批意见：</text>
										<text class="content_txt">{{child.handleOpinion}}</text>
									</view>
								</view>
							</template>
							<template v-if="child.handleStatus === 1">
								<view class="approve_box_right_list">
									<view class="u-flex user_name marginBottom">
										<text>{{item.fullName}} {{child.userName}}</text>
										<text class="adopt">审批通过</text>
									</view>
									<view class="time marginBottom">
										<text>审批时间:{{$u.timeFormat(child.handleTime,'yyyy-mm-dd hh:MM')}}</text>
									</view>
									<view class="u-flex-col content_txt_box">
										<text>审批意见：</text>
										<text class="content_txt">{{child.handleOpinion}}</text>
									</view>
								</view>
							</template>
							<template v-if="child.handleStatus === 2">
								<view class="approve_box_right_list">
									<view class="u-flex user_name marginBottom">
										<text>{{item.fullName}} {{child.userName}}</text>
										<text class="assign">发起</text>
									</view>
									<view class="time marginBottom">
										<text>发起时间:{{$u.timeFormat(child.handleTime,'yyyy-mm-dd hh:MM')}}</text>
									</view>
								</view>
							</template>
							<template v-if="child.handleStatus === 3">
								<view class="approve_box_right_list">
									<view class="u-flex user_name marginBottom">
										<text>{{item.fullName}} {{child.userName}}</text>
										<text class="back">撤回</text>
									</view>
									<view class="time marginBottom">
										<text>撤回时间:{{$u.timeFormat(child.handleTime,'yyyy-mm-dd hh:MM')}}</text>
									</view>
									<view class="u-flex-col content_txt_box">
										<text>撤回意见：</text>
										<text class="content_txt">{{child.handleOpinion}}</text>
									</view>
								</view>
							</template>
							<template v-if="child.handleStatus === 4">
								<view class="approve_box_right_list">
									<view class="u-flex user_name marginBottom">
										<text>{{item.fullName}} {{child.userName}}</text>
										<text class="refuse">流程终止</text>
									</view>
									<view class="time marginBottom">
										<text>终止时间:{{$u.timeFormat(child.handleTime,'yyyy-mm-dd hh:MM')}}</text>
									</view>
									<view class="u-flex-col content_txt_box">
										<text>终止原因：</text>
										<text class="content_txt">{{child.handleOpinion}}</text>
									</view>
								</view>
							</template>
							<template v-if="child.handleStatus === 5">
								<view class="approve_box_right_list">
									<view class="u-flex user_name marginBottom">
										<text>{{item.fullName}} {{child.userName}}</text>
										<text class="assign">指派</text>
									</view>
									<view class="time marginBottom">
										<text>指派时间:{{$u.timeFormat(child.handleTime,'yyyy-mm-dd hh:MM')}}</text>
									</view>
									<view class="u-flex-col content_txt_box">
										<text>指派人员：</text>
										<text class="content_txt">{{child.handleOpinion}}</text>
									</view>
								</view>
							</template>
							<template v-if="child.handleStatus === 6">
								<view class="approve_box_right_list">
									<view class="u-flex user_name marginBottom">
										<text>{{item.fullName}} {{child.userName}}</text>
										<text class="assign">加签</text>
									</view>
									<view class="time marginBottom">
										<text>加签时间:{{$u.timeFormat(child.handleTime,'yyyy-mm-dd hh:MM')}}</text>
									</view>
									<view class="u-flex-col content_txt_box">
										<text>加签人员：</text>
										<text class="content_txt">{{child.handleOpinion}}</text>
									</view>
								</view>
							</template>
							<template v-if="child.handleStatus === 7">
								<view class="approve_box_right_list">
									<view class="u-flex user_name marginBottom">
										<text>{{item.fullName}} {{child.userName}}</text>
										<text class="assign">转审</text>
									</view>
									<view class="time marginBottom">
										<text>转审时间:{{$u.timeFormat(child.handleTime,'yyyy-mm-dd hh:MM')}}</text>
									</view>
									<view class="u-flex-col content_txt_box">
										<text>转审人员：</text>
										<text class="content_txt">{{child.handleOpinion}}</text>
									</view>
								</view>
							</template>
						</view>
					</view>
				</view>
			</view>
			<view class="noContent" v-else>
				<img :src="nodataIcon" alt="" class="img">
				<view class="">
					暂无数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getRecordList
	} from '@/api/workFlow/flowBefore'
	import resources from '@/libs/resources.js'
	export default {
		name: "RecordSummary",
		props: {
			processId: {
				type: String,
				default: ''
			},
			summaryType: {
				default: "0"
			},
		},
		data() {
			return {
				approve_list: [{
					name: '按部门汇总',
					id: '1'
				}, {
					name: '按岗位汇总',
					id: '3'
				}],
				list: [],
				approveIndex: 0,
				tabI: 1,
				nodataIcon: resources.message.nodata
			}
		},
		created() {
			this.init()
		},
		watch: {
			approveIndex(val) {
				this.init()
			}
		},
		methods: {
			init() {

				const query = {
					category: this.tabI,
					type: this.summaryType
				}
				getRecordList(this.processId, query).then(res => {
					this.list = res.data
				}).catch(() => {})
			},
			approveChange(index) {
				this.approveIndex = index;
				this.tabI = this.approve_list[index].id
			},
		}
	}
</script>

<style lang="scss" scoped>
	.adopt {
		color: #85ce61;
	}

	.assign {
		color: #189dff;
	}

	.back {
		color: #000000;
	}

	.refuse {
		color: #d9001b;
	}


	.approve-v {
		height: 100%;

		.approve_list {
			width: 100%;
			height: 100%;

			.approve_box {
				width: 100%;
				height: 100%;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
				border-radius: 20rpx;
				margin-bottom: 20rpx;

				.tit {
					width: 90rpx;
					height: 90rpx;
					text-align: center;
					flex: 0.5;
				}

				.approve_box_right {
					padding: 20rpx;
					flex: 4;
					width: 100%;
					border-left: 1px solid #e4e7ed;

					.approve_box_right_inner {
						margin-bottom: 60rpx;

						&:last-child {
							margin-bottom: 0;
						}

						.marginBottom {
							margin-bottom: 10rpx;
						}

						.approve_box_right_list {
							.user_name {
								justify-content: space-between;
							}

							.content_txt {
								text-align: justify;
								text-justify: newspaper;
								word-break: break-all;
							}
						}
					}

				}
			}
		}

		.noContent {
			text-align: center;
			padding: 58% 0;

			.img {
				width: 154px;
				height: 118px;
			}
		}
	}
</style>
