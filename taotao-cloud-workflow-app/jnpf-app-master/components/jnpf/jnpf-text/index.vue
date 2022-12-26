<template>
	<view class="jnpf-text" :style="_style">{{value}}</view>
</template>
<script>
	export default {
		name: 'jnpf-text',
		props: {
			textStyle: {
				type: Object,
				default: () => ({
					// 'font-size': ' 24rpx',
					// "color": '#00000',
					// 'text-align': 'center',
					// 'line-height': '60rpx',
					// 'font-weight': 'normal',
					// 'font-style': 'normal',
					// 'text-decoration': 'none',
				})
			},
			value: {
				default: ''
			}
		},
		computed: {
			_style() {
				return {
					...this.textStyle,
					'line-height': this.textStyle['line-height'] + 'rpx',
					'font-size': this.textStyle['font-size'] + 'rpx'
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.jnpf-text {
		padding: 20rpx 32rpx;
		margin: 0;
	}
</style>
