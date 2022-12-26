<template>
	<view class="cancellation-v">
		<view class="cancellation-hd">
			<image :src="accountSecurity"></image>
		</view>
		<view class="content u-flex-col">
			<view class="content-text u-flex-col">
				<text class="content-title u-font-36 u-type-primary">确认注销账户？</text>
				<text class="content-tip u-font-28">注销账户后以下数据将全部清空</text>
				<view class="list u-flex-col u-font-26">
					<text class="item">企业组织架构和员工信息</text>
					<text class="item">所有数据和聊天记录</text>
					<text class="item">删除和永久注销JNPF账户</text>
				</view>
			</view>
			<view class="btn">
				<u-button type="primary" @click="handleClick">注销账号</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	export default {
		data() {
			return {
				accountSecurity: resources.banner.accountSecurity
			}
		},
		methods: {
			handleClick() {
				uni.showModal({
					title: '提示',
					content: '您的JNPF账号将被删除，您确定要注销JNPF账号么？',
					success: res => {
						if (res.confirm) {
							
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.cancellation-v {
		.cancellation-hd {
			width: 100%;
			height: 280rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.content {
			.content-text {
				justify-content: center;
				padding: 176rpx 0 0 190rpx;
			}

			.content-title {
				height: 100rpx;
				font-weight: 700;
			}

			.content-tip {
				height: 80rpx;
				color: #252B3A;
			}

			.list {
				.item {
					margin-bottom: 35rpx;
					color: #666;
					display: flex;
					flex-direction: row;
					align-items: center;

					&::before {
						content: "";
						width: 12rpx;
						height: 12rpx;
						border-radius: 50%;
						background-color: #356efe;
						margin-right: 30rpx;
					}
				}
			}

			.btn {
				padding: 0 32rpx;
				width: 100%;
				position: fixed;
				bottom: 40rpx;
				margin: 0 auto;
			}
		}
	}
</style>
