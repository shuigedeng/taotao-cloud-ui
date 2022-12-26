<template>
	<view class="jnpf-date-range">
		<u-input type="select" :select-open="selectShow" v-model="innerValue" :placeholder="placeholder"
			@click="openSelect"></u-input>
		<u-calendar v-model="selectShow" ref="calendar" @change="change" mode="range" max-date="2051-01-01"
			:defaultTime="defaultTime"></u-calendar>
	</view>
</template>

<script>
	export default {
		name: 'jnpf-date-range',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				type: Array,
				default: () => []
			},
			placeholder: {
				type: String,
				default: '请选择日期范围'
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				defaultTime: [],
				selectShow: false,
				innerValue: '',
			}
		},
		watch: {
			value(val) {
				this.innerValue = ''
				this.setDefault()
			}
		},
		created() {
			this.setDefault()
		},
		methods: {
			setDefault() {
				if (this.value.length === 2) {
					this.defaultTime = this.value
					this.innerValue = this.$u.timeFormat(this.value[0], 'yyyy-mm-dd') + '至' +
						this.$u.timeFormat(this.value[1], 'yyyy-mm-dd')
				} else {
					this.innerValue = ''
					this.defaultTime = []
				}
			},
			openSelect() {
				if (this.disabled) return
				this.selectShow = true
			},
			change(e) {
				const startDate = Date.parse(e.startDate + ' 00:00:00')
				const endDate = Date.parse(e.endDate + ' 00:00:00')
				// #ifdef MP-WEIXIN
				this.innerValue = e.startDate + '至' + e.endDate
				// #endif
				this.$emit('input', [startDate, endDate])
			}
		}
	}
</script>
<style lang="scss" scoped>
	.jnpf-date-range {
		width: 100%;
	}
</style>
