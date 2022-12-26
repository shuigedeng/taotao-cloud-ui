<template>
	<view class="steps">
		<u-time-line>
			<u-time-line-item v-for="(item,i) in options" :key="i">
				<template v-slot:node>
					<view
						:class="['steps-dot',item.type=='0'?'u-type-success-bg':item.type=='1'?'u-type-primary-bg':'u-type-info-bg']">
					</view>
				</template>
				<template v-slot:content>
					<view>
						<view
							:class="['steps-title',item.type=='0'?'u-type-success':item.type=='1'?'u-type-primary':'u-type-info']">
							{{item.nodeName}}
						</view>
						<view class="steps-desc" v-if="item.nodeCode!=='end'">{{item.userName}}</view>
					</view>
				</template>
			</u-time-line-item>
		</u-time-line>
	</view>
</template>

<script>
	export default {
		name: 'Steps',
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.steps {
		.steps-dot {
			height: 8px;
			width: 8px;
			border-radius: 50px;
		}

		.steps-title {
			font-size: 30rpx;
			line-height: 36rpx;
		}

		.steps-desc {
			margin-top: 10rpx;
			font-size: 26rpx;
			line-height: 36rpx;
			color: #909399;
			margin-bottom: 10rpx;
		}
	}
</style>
