<template>
	<view class="flowDone-v">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :sticky="true"
			:down="downOption" :up="upOption">
			<view class="search-box search-box_sticky">
				<u-search placeholder="请输入关键词搜索" v-model="keyword" height="72" :show-action="false" @change="search"
					bg-color="#f0f2f6" shape="square">
				</u-search>
			</view>
			<flowlist :list='list' :opType="opType" />
		</mescroll-body>
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	import {
		FlowBeforeList
	} from '@/api/workFlow/flowBefore'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import flowlist from '../components/flowList.vue'
	export default {
		components: {
			flowlist
		},
		mixins: [MescrollMixin],
		data() {
			return {
				keyword: '',
				opType: 2,
				list: [],
				downOption: {
					use: true,
					auto: true
				},
				upOption: {
					page: {
						num: 0,
						size: 20,
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
				FlowBeforeList(this.opType, query, {
					load: page.num == 1
				}).then(res => {
					this.mescroll.endSuccess(res.data.list.length);
					if (page.num == 1) this.list = [];
					let flowStatus;
					const list = res.data.list.map(o => (
						flowStatus = o.status == 1 ? resources.status.adopt : resources.status
						.refuse, {
							flowStatus: flowStatus,
							...o
						}));
					this.list = this.list.concat(list);
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
			search() {
				// 节流,避免输入过快多次请求
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(() => {
					this.list = [];
					this.mescroll.resetUpScroll();
				}, 300)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}
</style>
