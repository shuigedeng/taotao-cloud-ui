<template>
	<view class="jnpf-cascader">
		<u-input type="select" :select-open="selectShow" v-model="innerValue" :placeholder="placeholder"
			@click="openSelect"></u-input>
		<u-select :list="options" v-model="selectShow" mode="mutil-column-auto" @confirm="selectConfirm"
			:value-name="props.value" :label-name="props.label" :child-name="props.children"
			:default-value="defaultValue" />
	</view>
</template>

<script>
	export default {
		name: 'jnpf-cascader',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				type: Array,
				default: () => []
			},
			options: {
				type: Array,
				default: () => []
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			props: {
				type: Object,
				default: () => ({
					label: 'fullName',
					value: 'id',
					children: 'children'
				})
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				selectShow: false,
				innerValue: '',
				defaultValue: []
			}
		},
		watch: {
			options() {
				this.setDefault(this.value)
			},
			value(val) {
				this.setDefault(val)
			}
		},
		created() {
			this.setDefault(this.value)
		},
		methods: {
			setDefault(value) {
				if (!value.length) return this.innerValue = ''
				let options = this.$u.deepClone(this.options)
				let defaultValue = []
				let label = ''
				outer: for (let i = 0; i < value.length; i++) {
					inter: for (let j = 0; j < options.length; j++) {
						if (value[i] == options[j][this.props.value]) {
							defaultValue.push(j)
							label += (!label ? '' : '-') + options[j][this.props.label]
							if (options[j].children) options = options[j].children
							break inter
						}
					}
				}
				this.innerValue = label
				this.defaultValue = defaultValue
			},
			openSelect() {
				if (this.disabled) return
				this.selectShow = true
			},
			selectConfirm(e) {
				this.innerValue = ''
				let value = []
				for (let i = 0; i < e.length; i++) {
					value.push(e[i].value)
				}
				this.setDefault(value)
				this.$emit('input', value)
				this.$emit('change', value, e)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.jnpf-cascader {
		width: 100%;
	}
</style>
