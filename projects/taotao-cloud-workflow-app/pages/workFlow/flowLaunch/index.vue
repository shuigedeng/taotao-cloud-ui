<template>
	<view class="flowLaunch-v">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :sticky="true"
			:down="downOption" :up="upOption">
			<view class="search-box search-box_sticky">
				<u-search placeholder="请输入关键词搜索" v-model="keyword" height="72" :show-action="false" @change="search"
					bg-color="#f0f2f6" shape="square">
				</u-search>
			</view>
			<view class="flow-list" v-if="list.length > 0">
				<view class="flow-list-box" v-for="(item, index) in list" :key="item.id">
					<u-swipe-action :index="index" :show="item.show" @click="handleClick" @open="open"
						:options="options" @content-click="goDetail(item)" class='swipe-action'>
						<view class="item">
							<view class="item-left">
								<text class="title u-font-28 u-line-1">{{item.fullName}}</text>
								<text class="title u-line-1 u-font-24">审批节点: <text
										class="titInner">{{item.thisStep ? item.thisStep : ''}}</text></text>
								<text class="time title u-font-24">发起时间:<text
										class="titInner">{{item.creatorTime | date('yyyy-mm-dd hh:MM')}}</text></text>
							</view>
							<view class="item-right">
								<image :src="item.flowStatus" mode="widthFix" class="item-right-img">
								</image>
							</view>
						</view>
					</u-swipe-action>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		FlowLaunchList,
		Delete
	} from '@/api/workFlow/flowLaunch'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				flowStatus: '',
				downOption: {
					use: true,
					auto: true
				},
				upOption: {
					page: {
						num: 0,
						size: 10,
						time: null
					},
					empty: {
						use: true,
						icon: resources.message.nodata,
						tip: "暂无数据",
						fixed: true,
						top: "300rpx",
					},
					textNoMore: '没有更多数据',
				},
				keyword: '',
				list: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			}
		},
		onLoad() {
			uni.$on('refresh', () => {
				this.list = [];
				this.mescroll.resetUpScroll();
			})
		},
		onUnload() {
			uni.$off('refresh')
		},
		methods: {
			upCallback(page) {
				let query = {
					currentPage: page.num,
					pageSize: page.size,
					keyword: this.keyword
				}
				FlowLaunchList(query, {
					load: page.num == 1
				}).then(res => {
					this.mescroll.endSuccess(res.data.list.length);
					if (page.num == 1) this.list = [];
					const list = res.data.list.map(o => ({
						'flowStatus': this.getFlowStatus(o.status),
						...o
					}))
					this.list = this.list.concat(list);
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
			getFlowStatus(status) {
				let flowStatus;
				switch (status) {
					case 0: //等待提交
						flowStatus = resources.status.submit
						break;
					case 1: //等待审核
						flowStatus = resources.status.review
						break;
					case 2: //审核通过
						flowStatus = resources.status.reviewAdopt
						break;
					case 3: //审核驳回
						flowStatus = resources.status.reviewRefuse
						break;
					case 4: //流程撤回
						flowStatus = resources.status.reviewUndo
						break;
					case 5: //审核终止
						flowStatus = resources.status.reviewStop
						break;
					default: //等待审核
						flowStatus = resources.status.review
						break;
				}
				return flowStatus
			},
			handleClick(index, index1) {
				const item = this.list[index]
				if ([4].includes(item.status)) return this.$u.toast("撤回的流程无法删除")
				if ([1, 2, 3, 5].includes(item.status)) {
					this.$u.toast("流程正在审核,请勿删除")
					this.list[index].show = false
					return
				}
				Delete(item.id).then(res => {
					this.$u.toast(res.msg)
					this.list.splice(index, 1)
					if (!this.list.length) this.mescroll.resetUpScroll()
				})
			},
			open(index) {
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			search() {
				// 节流,避免输入过快多次请求
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(() => {
					this.list = [];
					this.mescroll.resetUpScroll();
				}, 300)
			},
			goDetail(item) {
				let opType = '-1'
				if ([1, 2, 4, 5].includes(item.status)) opType = 0
				const config = {
					id: item.id,
					enCode: item.flowCode,
					flowId: item.flowId,
					formType: item.formType,
					opType: opType,
					status: item.status,
					taskNodeId: '',
					fullName: item.fullName
				}
				uni.navigateTo({
					url: '/pages/workFlow/flowBefore/index?config=' + encodeURIComponent(JSON.stringify(config))
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.flowLaunch-v {
		width: 100%;

		.flow-list-box {
			width: 95%;
		}
	}
</style>
