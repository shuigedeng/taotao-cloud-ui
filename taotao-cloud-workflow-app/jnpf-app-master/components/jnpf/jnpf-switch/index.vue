<template>
	<u-switch v-model="innerValue" :active-value="activeValue" :inactive-value="inactiveValue" :disabled="disabled"
		@change="onChange"></u-switch>
</template>

<script>
	export default {
		name: 'jnpf-switch',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				default: 0
			},
			activeValue: {
				default: 1
			},
			inactiveValue: {
				default: 0
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				innerValue: false
			}
		},
		watch: {
			value(val) {
				this.innerValue = !!val
			}
		},
		created() {
			this.innerValue = !!this.value
		},
		methods: {
			onChange(value) {
				this.$emit('input', value)
				this.$emit('change', value)
			}
		}
	}
</script>
