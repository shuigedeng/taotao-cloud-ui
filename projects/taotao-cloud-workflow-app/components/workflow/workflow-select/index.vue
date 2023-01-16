<template>
	<view class="workflow-select">
		<u-input type="select" :select-open="selectShow" v-model="innerValue" :placeholder="placeholder"
			@click="openSelect"></u-input>
		<u-select :list="newOptions" v-model="selectShow" @confirm="selectConfirm" :value-name="props.value"
			:label-name="props.label" :default-value="defaultValue" v-if="!multiple" />
		<mult-select :list="newOptions" v-model="selectShow" @confirm="selectConfirm" :value-name="props.value"
			:label-name="props.label" :default-value="defaultValue" v-if="multiple" />
	</view>
</template>

<script>
	import multSelect from './mult-select'
	export default {
		name: 'workflow-select',
		components: {
			multSelect
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				default: ''
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			options: {
				type: Array,
				default: () => []
			},
			props: {
				type: Object,
				default: () => ({
					label: 'fullName',
					value: 'id'
				})
			},
			disabled: {
				type: Boolean,
				default: false
			},
			multiple: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			newOptions() {
				return this.options.map((o, i) => ({
					...o,
					extra: i
				}))
			}
		},
		watch: {
			newOptions() {
				this.setDefault()
			},
			value(val) {
				this.setDefault()
			}
		},
		data() {
			return {
				selectShow: false,
				innerValue: '',
				defaultValue: []
			}
		},
		created() {
			this.setDefault()
		},
		methods: {
			openSelect() {
				if (this.disabled) return
				this.selectShow = true
			},
			selectConfirm(e, label = '') {
				if (this.multiple) {
					this.$emit('input', e)
					this.$emit('change', e)
					this.defaultValue = e
					this.innerValue = label
				} else {
					this.$emit('input', e[0].value || '')
					this.$emit('change', e[0].value || '')
					this.innerValue = e[0].label || ''
					if (e[0].extra === undefined || e[0].extra === null || e[0].extra === '') return
					this.defaultValue = [e[0].extra]
				}
			},
			setDefault() {
				if (this.multiple) {
					if (!this.value.length) return this.innerValue = ''
					this.defaultValue = this.value
					let label = ''
					outer: for (let i = 0; i < this.defaultValue.length; i++) {
						inner: for (let j = 0; j < this.options.length; j++) {
							if (this.defaultValue[i] === this.options[j][this.props.value]) {
								if (!label) {
									label += this.options[j][this.props.label]
								} else {
									label += ',' + this.options[j][this.props.label]
								}
								break inner
							}
						}
					}
					this.innerValue = label
				} else {
					if (!this.value) return this.innerValue = ''
					for (let i = 0; i < this.options.length; i++) {
						if (this.options[i][this.props.value] === this.value) {
							this.defaultValue = [i]
							this.innerValue = this.options[i][this.props.label]
							break
						}
					}
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.workflow-select {
		width: 100%;
	}
</style>
