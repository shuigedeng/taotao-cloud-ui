<template>
	<view class="userDetail-v">
		<view class="userDetail-hd u-flex-col">
			<view class="u-m-t-60">
				<u-avatar :src="define.baseURL+userData.headIcon" size="120"></u-avatar>
			</view>
			<view class="u-m-t-32 u-font-32 name">
				<text>{{userData.realName}}/{{userData.account}}</text>
			</view>
			<view class="u-m-t-20 u-font-24 positionName">
				<text>{{userData.organizeName}}</text>
			</view>
			<view class="u-m-t-32 u-flex userDetail-hd-btn">
				<view class="u-m-r-40 btn" @click="call()">
					<text class="ym-custom ym-custom-phone u-font-40" />
				</view>
				<view class="u-m-l-40 btn" @click="toIm()">
					<text class="ym-custom ym-custom-comment u-font-40" />
				</view>
			</view>
		</view>
		<u-cell-group>
			<u-cell-item title="手机号" :value="userData.mobilePhone || '未填写'" :arrow="false" :title-style="titleStyle">
			</u-cell-item>
			<u-cell-item title="座机号" :value="userData.telePhone || '未填写'" :arrow="false" :title-style="titleStyle">
			</u-cell-item>
			<u-cell-item title="邮箱" :value="userData.email || '未填写'" :arrow="false" :title-style="titleStyle">
			</u-cell-item>
			<u-cell-item title="岗位" :value="userData.positionName || '未填写'" :arrow="false" :title-style="titleStyle">
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	import {
		getUesrDetail
	} from '@/api/common.js'
	export default {
		data() {
			return {
				userData: {},
				titleStyle: {
					color: '#606266'
				},
				userDetal:{}
			}
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			}
		},
		onLoad(option) {
			let userId = option.userId;
			this.getUserDetail(userId)
		},
		methods: {
			getUserDetail(userId) {
				getUesrDetail(userId).then(res => {
					this.userData = res.data
					uni.setNavigationBarTitle({
						title: this.userData.realName + '/' + this.userData.account
					});
				})
			},
			call() {
				if (!this.userData.mobilePhone) return
				uni.makePhoneCall({
					phoneNumber: this.userData.mobilePhone
				})
			},
			toIm() {
				const userData = this.userData
				const name = userData.realName + '/' + userData.account
				uni.$emit('updateMsgNum', userData.id)
				uni.navigateTo({
					url: '/pages/message/im/index?name=' + name + '&formUserId=' + userData.id + '&headIcon=' +
						userData.headIcon
				})
			}
		}
	}
</script>

<style lang="scss">
	.userDetail-v {
		.userDetail-hd {
			height: 482rpx;
			background-color: #f0f2f6;
			color: #FFFFFF;
			align-items: center;
		}
		.name {
			// font-weight: 700;
			color: #606266;
		}
		.positionName{
			color: #606266;
		}

		.userDetail-hd-btn {
			.btn {
				width: 84rpx;
				height: 84rpx;
				border: 2rpx solid #606266;
				border-radius: 50%;
				text-align: center;
				line-height: 80rpx;
				color: #606266;
			}
		}
	}
</style>
