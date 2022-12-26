<template>
	<view class="jnpf-time-range">
		<u-input type="select" :select-open="selectShow" v-model="innerValue" :placeholder="placeholder"
			@click="openSelect"></u-input>
		<time-range :defaultTime="defaultTime" v-model="selectShow" @confirm="selectConfirm">
		</time-range>
	</view>
</template>

<script>
	import timeRange from './time-range.vue'
	export default {
		name: 'jnpf-time-range',
		components: {
			timeRange
		},
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
				default: '请选择时间范围'
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
					this.innerValue = this.value[0] + '-' + this.value[1]
				} else {
					this.innerValue = ''
					this.defaultTime = []
				}
			},
			openSelect() {
				if (this.disabled) return
				this.selectShow = true
			},
			selectConfirm(e) {
				// #ifdef MP-WEIXIN
				this.innerValue = e[0] + '-' + e[1]
				// #endif
				this.$emit('input', e)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.jnpf-time-range {
		width: 100%;
	}
</style>
