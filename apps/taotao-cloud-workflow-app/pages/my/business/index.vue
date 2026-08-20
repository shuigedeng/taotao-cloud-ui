<template>
	<view class="page_v u-flex-col">
		<view class="lists_box" v-if="show" v-for="(item,index) in list" :key="index"
			:class="item.isDefault ? 'active' : '' " @click="clickRadio(item,index)">
			<view class="icon-checked-box" v-if="item.isDefault">
				<text>{{majorType === 'Organize' ? '默认' : '主岗'}}</text>
				<view class="icon-checked">
					<u-icon name="checkbox-mark" color="#fff" size="28"></u-icon>
				</view>
			</view>
			<view class="list_inner">
				<text class="icon-ym"
					:class="majorType === 'Organize' ? 'icon-ym-organization' : 'icon-ym-wf-outgoingApply'"></text>
				<text class="txt">{{item.fullName}}</text>
			</view>
		</view>
		<view v-if="!show" class="notData-box u-flex-col">
			<view class="u-flex-col notData-inner">
				<text class="notData-inner-text">暂无数据</text>
				<image :src="icon" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserOrganizes,
		getUserPositions,
		setMajor,
		getCurrentUser
	} from '@/api/common.js'
	import resources from '@/libs/resources.js'
	export default {
		data() {
			return {
				value: '',
				list: [],
				organizeList: [],
				majorType: '',
				icon: resources.message.nodata,
				oldVal: "",
				show: true
			}
		},
		onLoad(e) {
			this.majorType = e.majorType
			this.getUserOrganizes(this.majorType)
			let title = this.majorType === 'Organize' ? '我的组织' : '我的岗位'
			uni.setNavigationBarTitle({
				title: title
			})
		},
		methods: {
			getUserOrganizes(majorType) {
				let method = majorType === 'Organize' ? getUserOrganizes : getUserPositions
				method().then(res => {
					let data = res.data || []
					if (data.length === []) {
						this.show = this.list.length > 0 ? true : false
						return
					}
					this.organizeList = JSON.parse(JSON.stringify(data));
					this.list = this.organizeList;
					this.list.map(o => {
						if (o.isDefault) {
							this.value = o.id
							this.oldVal = o.id
							return
						}
					})
					this.show = this.list.length > 0 ? true : false
				})
			},
			clickRadio(item, index) {
				this.change(item, index)
			},
			change(item, index) {
				this.value = item.id
				this.list.map((o, i) => {
					o.isDefault = false;
					if (index === i) o.isDefault = true;
				})
				this.changeMajor(item.id, this.majorType)
			},
			changeMajor(majorId, majorType) {
				let query = {
					majorId,
					majorType
				}
				setMajor(query).then(res => {
					if (res.code === 200) {
						this.value = majorId
						this.$u.toast('修改成功')
						setTimeout(() => {
							return this.getCurrentUser()
						}, 1000)
					}
				}).catch(() => {
					this.value = this.oldVal
				})
			},
			getCurrentUser() {
				this.$store.dispatch('user/getCurrentUser').then(() => {
					uni.navigateBack()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f0f2f6;
	}

	.page_v {
		height: calc(100vh - 88rpx);
		padding: 0 34rpx;

		.notData-box {
			width: 100%;
			height: 100%;
			justify-content: center;
			align-items: center;

			.notData-inner {
				align-items: center;

				.notData-inner-text {
					padding: 30rpx 0;
					color: #909399;
				}
			}
		}


		.active {
			border: 1rpx solid #1890ff;
			color: #1890ff;
		}

		.lists_box {
			width: 100%;
			height: 180rpx;
			border-radius: 12rpx;
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			background-color: #FFFFFF;
			margin-top: 30rpx;

			.icon-checked-box {
				display: flex;
				width: 140rpx;
				height: 80rpx;
				position: absolute;
				transform: scale(0.9);
				right: -4rpx;
				bottom: -2rpx;
				flex-direction: row;
				align-items: center;


				.icon-checked {
					width: 44rpx;
					height: 44rpx;
					border: 40rpx solid #1890ff;
					border-left: 40rpx solid transparent;
					border-top: 40rpx solid transparent;
					border-bottom-right-radius: 12rpx;
					position: absolute;
					transform: scale(0.95);
					right: -8rpx;
					bottom: -6rpx;
				}
			}

			.list_inner {
				width: 100%;
				display: flex;
				flex-direction: row;
				padding: 0 40rpx;
				align-items: center;

				.icon-ym-wf-outgoingApply {
					&::before {
						margin-right: 6rpx;
						font-size: 40rpx;
					}
				}

				.icon-ym-organization {
					&::before {
						margin-right: 6rpx;
						font-size: 40rpx;
					}
				}

				.txt_icon {}

				.txt {
					width: 100%;
					align-items: flex-end;
					word-wrap: break-word;
				}
			}















			// .radio_group {
			// 	width: 100%;
			// 	.items_boder {
			// 		border: 1rpx solid #1890ff;
			// 	}

			// 	.items_boder2 {
			// 		border: 1rpx solid #C0C4CC;
			// 	}

			// 	.items {
			// 		width: 100%;
			// 		min-height: 136rpx;
			// 		padding: 40rpx 20rpx 0 20rpx;
			// 		justify-content: space-between;
			// 		margin-top: 30rpx;
			// 		background-color: #FFFFFF;
			// 		border-radius: 12rpx;

			// 		.txt {
			// 			width: 100%;
			// 			min-height: 48rpx;
			// 			align-items: flex-end;
			// 			word-wrap: break-word;
			// 		}

			// 		.u_radio_box {
			// 			width: 30px;
			// 			background-color: #0066CC;
			// 			justify-content: flex-end;
			// 		}
			// 	}
			// }
		}
	}
</style>
