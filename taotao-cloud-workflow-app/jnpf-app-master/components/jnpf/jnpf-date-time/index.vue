<template>
	<view class="jnpf-dateTime">
		<u-input type="select" :select-open="selectShow" v-model="innerValue" :placeholder="placeholder"
			@click="openSelect"></u-input>
		<u-picker mode="time" :defaultTime="defaultTime" v-model="selectShow" :params="params" @confirm="selectConfirm">
		</u-picker>
	</view>
</template>

<script>
	export default {
		name: 'jnpf-dateTime',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			disabled: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: 'time'
			}
		},
		data() {
			return {
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true,
					timestamp: true
				},
				defaultTime: '',
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
			this.setMode()
			this.setDefault()
		},
		methods: {
			setMode() {
				if (this.type === 'time') {
					this.params = {
						...this.params,
						year: false,
						month: false,
						day: false
					}
				}
				if (this.type === 'date') {
					this.params = {
						...this.params,
						hour: false,
						minute: false,
						second: false
					}
				}
			},
			setDefault() {
				if (!this.value) return this.innerValue = ''
				if (this.type === 'time') {
					this.innerValue = this.value
				} else {
					const format = this.type === 'date' ? 'yyyy-mm-dd' : 'yyyy-mm-dd hh:MM:ss'
					this.innerValue = this.$u.timeFormat(this.value, format)
				}
				this.defaultTime = this.innerValue
			},
			openSelect() {
				if (this.disabled) return
				this.selectShow = true
			},
			selectConfirm(e) {
				this.innerValue = ''
				if (this.params.year) this.innerValue += e.year
				if (this.params.month) this.innerValue += '-' + e.month
				if (this.params.day) this.innerValue += '-' + e.day
				if (this.params.hour) this.innerValue += (this.type === 'time' ? '' : ' ') + e.hour
				if (this.params.minute) this.innerValue += ':' + e.minute
				if (this.params.second) this.innerValue += ':' + e.second
				const value = this.type === 'time' ? this.innerValue : e.timestamp * 1000
				this.defaultTime = this.innerValue
				this.$emit('input', value)
				this.$emit('change', value)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.jnpf-dateTime {
		width: 100%;
	}
</style>
