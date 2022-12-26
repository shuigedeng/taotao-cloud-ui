<template>
	<view class="jnpf-org-select">
		<jnpf-tree-select v-model="innerValue" :placeholder="placeholder" :options="options" :multiple="multiple"
			:lastLevel="type!=='organize'" lastLevelKey="type" :lastLevelValue="type" :disabled="disabled"
			@change="onChange">
		</jnpf-tree-select>
	</view>
</template>

<script>
	import jnpfTreeSelect from '../jnpf-tree-select/index.vue';
	export default {
		name: 'jnpf-org-select',
		model: {
			prop: 'value',
			event: 'input'
		},
		components: {
			jnpfTreeSelect
		},
		props: {
			value: {
				default: ''
			},
			// organize/department/position/user
			type: {
				type: String,
				default: 'user'
			},
			placeholder: {
				type: String,
				default: '请选择'
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
		data() {
			return {
				options: [],
				innerValue: '',
				defaultValue: []
			}
		},
		watch: {
			innerValue(val) {
				this.$emit('input', val)
			},
			value(val) {
				this.innerValue = val
			}
		},
		created() {
			this.getOptions()
		},
		methods: {
			getMethod() {
				let method = ''
				switch (this.type) {
					case 'organize':
						method = 'getOrganizeTree'
						break;
					case 'department':
						method = 'getDepartmentTree'
						break;
					case 'position':
						method = 'getPositionTree'
						break;
					default:
						method = 'getUserTree'
						break;
				}
				return method
			},
			onChange(e) {
				this.$emit('change', e)
			},
			async getOptions() {
				const method = this.getMethod()
				this.options = await this.$store.dispatch(`base/${method}`)
				this.innerValue = this.value
			}
		}
	}
</script>
<style lang="scss" scoped>
	.jnpf-org-select {
		width: 100%;
	}
</style>
