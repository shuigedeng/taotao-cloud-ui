<template>
	<view class="workflow-org-select">
		<workflowcom v-model="innerValue" :placeholder="placeholder" :multiple="multiple" :disabled="disabled"
			@change="onChange" :options="options" v-if="options.length">
		</workflowcom>
	</view>
</template>
<script>
	import workflowcom from './workflow-com/index.vue';
	export default {
		name: 'workflow-city',
		model: {
			prop: 'value',
			event: 'input'
		},
		components: {
			workflowcom
		},
		props: {
			value: {
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
			multiple: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				innerValue: '',
				options: [],
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
			onChange(e) {
				this.$emit('change', e)
			},
			async getOptions() {
				this.options = await this.$store.dispatch(`base/getDepartmentTree`)
				this.innerValue = this.value
			}
		}
	}
</script>
<style lang="scss" scoped>
	.workflow-org-select {
		width: 100%;
	}
</style>
