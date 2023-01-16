<template>
	<view class="personalData-v">
		<u-cell-group>
			<u-cell-item title="账户" :value="data.account" :arrow="false"></u-cell-item>
			<u-cell-item title="所属组织" :value="data.organize" :arrow="false"></u-cell-item>
			<u-cell-item title="直属主管" :value="data.manager" :arrow="false"></u-cell-item>
			<u-cell-item title="岗位" :value="data.position" :arrow="false"></u-cell-item>
			<u-cell-item title="角色" :value="data.roleId" :arrow="false"></u-cell-item>
			<u-cell-item title="注册时间" :value="creatorTime" :arrow="false"></u-cell-item>
			<u-cell-item title="上次登录时间" :value="prevLogTime" :arrow="false"></u-cell-item>
			<u-cell-item title="入职时间" :value="entryDate" :arrow="false"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gender: '',
				birthday: '',
				prevLogTime: '',
				creatorTime: '',
				entryDate: '',
				data: {}
			}
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			},
		},
		onLoad() {

		},
		methods: {
			init(data) {
				this.data = data || {}
				this.creatorTime = this.data.creatorTime ? this.$u.timeFormat(this.data.creatorTime,
					'yyyy-mm-dd hh:MM') : ''
				this.prevLogTime = this.data.prevLogTime ? this.$u.timeFormat(this.data.prevLogTime,
					'yyyy-mm-dd hh:MM') : ''
				this.entryDate = this.data.entryDate ? this.$u.timeFormat(this.data.entryDate,
					'yyyy-mm-dd hh:MM') : ''
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}
</style>
