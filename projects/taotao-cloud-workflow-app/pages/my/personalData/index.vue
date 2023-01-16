<template>
	<view class="flowBefore-v">
		<view class="flowBefore-box">
			<view class="u-border-bottom">
				<u-sticky>
					<view class="workFlowTitle">
					</view>
					<u-tabs :list="tabBars" :is-scroll="false" :current="current" @change="tabChange" height="100">
					</u-tabs>
				</u-sticky>
			</view>
			<block>
				<view v-show="current == 0">
					<accountData ref="accountData"></accountData>
				</view>
				<view v-show="current == 1">
					<personalData ref="personalData"></personalData>
				</view>

			</block>
		</view>
	</view>
</template>

<script>
	import personalData from './components/personalData.vue';
	import accountData from './components/accountInformation.vue';
	export default {
		components: {
			personalData,
			accountData
		},
		data() {
			return {
				tabBars: [{
					name: '账户信息'
				}, {
					name: '个人资料'
				}],
				current: 0,
				baseInfo: {}
			};
		},
		onLoad(e) {
			uni.showLoading({
				title: '加载中'
			});
			this.baseInfo = JSON.parse(decodeURIComponent(e.baseInfo))
			this.$nextTick(() => {
				this.$refs.personalData.init(this.baseInfo)
				this.$refs.accountData.init(this.baseInfo)
				uni.hideLoading()
			})
		},
		methods: {
			tabChange(index) {
				this.current = index;
				this.$refs.personalData.init(this.baseInfo)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
		height: 100%;
	}

	.flowBefore-v {
		display: flex;
		flex-direction: column;

		.workFlowTitle {
			width: 100%;
			background-color: #FFFFFF;
			font-size: 32rpx;
			font-weight: 700;
			white-space: pre-wrap;
			text-align: left;
		}

		.flowBefore-box {
			height: 100%;
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			padding-bottom: 100rpx;


		}
	}
</style>
