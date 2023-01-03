<template>
	<u-checkbox-group @change="onChange" :disabled="disabled">
		<u-checkbox v-model="item.checked" v-for="(item, index) in newOptions" :key="index" :name="item[props.value]">
			{{ item[props.label] }}
		</u-checkbox>
	</u-checkbox-group>
</template>

<script>
	export default {
		name: 'workflow-checkbox',
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
			}
		},
		data() {
			return {
				newOptions: [],
			}
		},
		watch: {
			value(val) {
				this.setDefault()
			},
			options(val) {
				this.setColumnData()
			}
		},
		created() {
			this.setColumnData()
		},
		methods: {
			onChange(value) {
				this.$emit('input', value)
				this.$emit('change', value)
			},
			setColumnData() {
				this.newOptions = this.options.map(o => ({
					...o,
					checked: false
				}))
				this.setDefault()
			},
			setDefault() {
				if (!this.value.length) return
				outer: for (let i = 0; i < this.value.length; i++) {
					inner: for (let j = 0; j < this.newOptions.length; j++) {
						if (this.value[i] === this.newOptions[j][this.props.value]) {
							this.newOptions[j].checked = true
							break inner
						}
					}
				}
			}
		}
	}
</script>
