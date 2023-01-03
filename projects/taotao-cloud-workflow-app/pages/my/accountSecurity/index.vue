<template>
	<view class="accountSecurity-v">
		<u-cell-group>
			<u-cell-item title="注销账号" @click="openPage('/pages/my/cancellation/index')"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			openPage(path) {
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}
</style>
