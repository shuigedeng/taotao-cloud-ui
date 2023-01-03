<template>
	<view class="scanResult-v">
		<view class="text">
			{{result}}
		</view>
	</view>
</template>

<script>
	export default {
		name: 'scanResult',
		data() {
			return {
				result: '',
			}
		},
		onLoad(option) {
			this.result = option.result;
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.scanResult-v {
		height: 100%;
		padding: 0 24rpx;
	}
</style>
