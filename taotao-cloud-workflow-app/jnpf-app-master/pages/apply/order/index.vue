<template>
	<view class="order-v">
		<view class="head-warp com-dropdown">
			<u-dropdown class="u-dropdown" ref="uDropdown">
				<u-dropdown-item title="排序" :options="sortOptions" @change="onChange">
					<view class="dropdown-slot-content">
						<view class="dropdown-slot-content-main">
							<u-cell-group>
								<u-cell-item @click="cellClick(item.value)" :arrow="false" :title="item.label"
									v-for="(item, index) in sortOptions" :key="index" :title-style="{
									color: sortValue == item.value ? '#2979ff' : '#606266' }">
									<u-icon v-if="sortValue == item.value" name="checkbox-mark" color="#2979ff"
										size="32"></u-icon>
								</u-cell-item>
							</u-cell-group>
						</view>
						<view class="dropdown-slot-bg" @click="$refs.uDropdown.close()"></view>
					</view>
				</u-dropdown-item>
				<u-dropdown-item title="筛选">
					<view class="dropdown-slot-content">
						<view class="dropdown-slot-content-main">
							<view class="u-p-l-32 u-p-r-32">
								<u-form label-position="left" label-width="150" label-align="left">
									<u-form-item label="起始日期" prop="startTime">
										<jnpf-date-time type="date" v-model="listQuery.startTime"></jnpf-date-time>
									</u-form-item>
									<u-form-item label="结束日期" prop="endTime">
										<jnpf-date-time type="date" v-model="listQuery.endTime"></jnpf-date-time>
									</u-form-item>
								</u-form>
							</view>
							<view class="buttom-actions">
								<u-button class="buttom-btn" @click="reset">重置</u-button>
								<u-button class="buttom-btn" type="primary" @click="closeDropdown">检索</u-button>
							</view>
						</view>
						<view class="dropdown-slot-bg" @click="$refs.uDropdown.close()"></view>
					</view>
				</u-dropdown-item>
			</u-dropdown>
			<view class="search-box">
				<u-search placeholder="请输入关键词搜索" v-model="listQuery.keyword" height="72" :show-action="false"
					@change="search" bg-color="#f0f2f6" shape="square">
				</u-search>
			</view>
		</view>
		<view class="list-warp">
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :fixed="false"
				:down="downOption" :up="upOption">
				<view class="flow-list">
					<view class="flow-list-box" v-for="(item, index) in list" :key="item.id">
						<u-swipe-action :index="index" :show="item.show" @click="handleClick" @open="open"
							:options="options" @content-click="goDetail(item.id,item.currentState,item.customerName)">
							<view class="item">
								<view class="item-cell item-title u-border-bottom">
									<text class="title u-line-1">{{item.customerName}}</text>
								</view>
								<view class="item-cell">
									<text class="time">{{item.orderCode}}</text>
									<text :class="'status '+getFlowStatus(item.currentState).statusCss">
										{{getFlowStatus(item.currentState).text}}
									</text>
								</view>
								<view class="item-cell">
									<text class="time">{{item.salesmanName}}</text>
									<text class="time">{{item.orderDate | date('yyyy-mm-dd')}}</text>
								</view>
							</view>
						</u-swipe-action>
					</view>
				</view>
			</mescroll-uni>
		</view>
		<view class="com-addBtn" @click="addPage()" v-if="$setPermission.hasBtnP('btn_add',menuIds)">
			<u-icon name="plus" size="60" color="#fff" />
		</view>
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		getOrderList,
		Delete
	} from '@/api/apply/order'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				sortValue: 0,
				
				sortOptions: [{
						label: '单据升序',
						value: 1,
					},
					{
						label: '单据降序',
						value: 2,
					},
					{
						label: '日期升序',
						value: 3,
					},
					{
						label: '日期降序',
						value: 4,
					}
				],
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
						zIndex: 5
					},
					textNoMore: '没有更多数据',
					toTop: {
						bottom: 250
					}
				},
				list: [],
				listQuery: {
					sort: 'desc',
					sidx: '',
					keyword: '',
					startTime: '',
					endTime: ''
				},
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				menuIds:'',
			}
		},
		onLoad(e) {
			this.menuIds = e.menuId
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
					...this.listQuery
				}
				getOrderList(query, {
					load: page.num == 1
				}).then(res => {
					this.mescroll.endSuccess(res.data.list.length);
					if (page.num == 1) this.list = [];
					const list = res.data.list.map(o => ({
						show: false,
						...o
					}));
					this.list = this.list.concat(list);
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
			handleClick(index, index1) {
				const item = this.list[index]
				if ([1, 2, 3, 5].includes(item.currentState)) {
					this.$u.toast("流程正在审核,请勿删除")
					this.list[index].show = false
					return
				}
				if (!this.$setPermission.hasBtnP('btn_remove',this.menuIds)) return this.$u.toast("未开启删除权限")
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
				// this.listQuery.sort = 'desc'
				// this.listQuery.sidx = ''
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(() => {
					this.list = [];
					this.mescroll.resetUpScroll();
				}, 300)
			},
			addPage() {
				this.jumPage()
			},
			
			jumPage(id, status,fullName,btnType){
				if (!id && !status && !fullName) btnType = 'btn_edit'
				let opType = '-1'
				if ([1, 2, 3, 5].includes(status)) opType = 0
				const config = {
					id: id,
					enCode: 'crmOrder',
					flowId: '52d3144909d04e2f8a6629ab2ab39e14',
					formType: 1,
					opType: opType,
					status: status,
					type:1,
					fullName: fullName || '新增订单',
					jurisdictionType: btnType || ''
				}
				uni.navigateTo({
					url: '/pages/workFlow/flowBefore/index?config=' + encodeURIComponent(JSON.stringify(config))
				})
			},
			
			goDetail(id, status, fullName) {
				if(!this.$setPermission.hasBtnP('btn_edit',this.menuIds) && !this.$setPermission.hasBtnP('btn_detail',this.menuIds)) return
				let btnType = '';
				if(this.$setPermission.hasBtnP('btn_edit',this.menuIds)) btnType = 'btn_edit'
				this.jumPage(id, status,fullName,btnType)
			},
			getFlowStatus(val) {
				let status
				switch (val) {
					case 0:
						status = {
							text: '等待提交',
							statusCss: 'u-type-info'
						}
						break;
					case 1:
						status = {
							text: '等待审核',
							statusCss: 'u-type-primary'
						}
						break;
					case 2:
						status = {
							text: '审核通过',
							statusCss: 'u-type-success'
						}
						break;
					case 3:
						status = {
							text: '审核驳回',
							statusCss: 'u-type-error'
						}
						break;
					case 4:
						status = {
							text: '流程撤回',
							statusCss: 'u-type-warning'
						}
						break;
					case 5:
						status = {
							text: '审核终止',
							statusCss: 'u-type-info'
						}
						break;
					default:
						status = {
							text: '等待提交',
							statusCss: 'u-type-info'
						}
						break;
				}
				return status
			},
			cellClick(val) {
				this.listQuery.sort = val == 1 || val == 3 ? 'asc' : 'desc'
				this.listQuery.sidx = val == 1 || val == 2 ? 'orderCode' : 'orderDate'
				this.sortValue = val
				this.$refs.uDropdown.close();
				this.$nextTick(() => {
					this.list = [];
					this.mescroll.resetUpScroll();
				})
			},
			reset() {
				this.listQuery.startTime = ''
				this.listQuery.endTime = ''
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
				this.$nextTick(() => {
					this.list = [];
					this.mescroll.resetUpScroll();
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
		height: 100%;
		/* #ifdef MP-ALIPAY */
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* #endif */
	}

	.order-v {
		height: 100%;
		display: flex;
		flex-direction: column;

		.head-warp {
			background-color: #fff;
		}

		.list-warp {
			flex: 1;
			min-width: 0;
			min-height: 0;
		}

		.flow-list-box {
			width: 100%;
			margin-bottom: 20rpx;
		}
	}
</style>
