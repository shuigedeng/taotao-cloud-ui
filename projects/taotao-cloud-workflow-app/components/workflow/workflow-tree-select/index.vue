<template>
	<view class="workflow-tree-select">
		<u-input type="select" :select-open="selectShow" v-model="innerValue" :placeholder="placeholder"
			@click="openSelect"></u-input>
		<tree-select v-model="selectShow" @confirm="selectConfirm" :default-value="defaultValue" :options="options"
			:multiple="multiple" :lastLevel="lastLevel" :lastLevelKey="lastLevelKey" :lastLevelValue="lastLevelValue" :props="props">
		</tree-select>
	</view>
</template>

<script>
	import treeSelect from './tree-select';
	export default {
		name: 'workflow-tree-select',
		model: {
			prop: 'value',
			event: 'input'
		},
		components: {
			treeSelect
		},
		props: {
			value: {
				default: ''
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
			},
			multiple: {
				type: Boolean,
				default: false
			},
			// 只能选择最后一层的数值
			lastLevel: {
				type: Boolean,
				default: false
			},
			// 只能选择最后一层的数值时，需要根据lastLevelKey来判断是否最后一层
			lastLevelKey: {
				type: String,
				default: "hasChildren"
			},
			lastLevelValue: {
				default: false
			},
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
				this.setDefault()
			},
			value(val) {
				this.setDefault()
			}
		},
		created() {
			this.setDefault()
		},
		methods: {
			setDefault() {
				if (!this.value || !this.options) return this.innerValue = ''
				const value = typeof(this.value) === 'string' ? this.value.split(',') : this.value
				let label = ''
				const loop = (value, list) => {
					for (let i = 0; i < list.length; i++) {
						let item = list[i]
						if (value === item[this.props.value]) {
							label += (!label ? '' : ',') + item[this.props.label]
							break
						}
						if (item.children && Array.isArray(item.children) && item.children.length) {
							loop(value, item.children)
						}
					}
				}
				for (let i = 0; i < value.length; i++) {
					loop(value[i], this.options)
				}
				this.innerValue = label
				this.defaultValue = value
			},
			openSelect() {
				if (this.disabled) return
				this.selectShow = true
			},
			selectConfirm(e) {
				let label = ''
				let value = []
				for (let i = 0; i < e.length; i++) {
					label += (!label ? '' : ',') + e[i][this.props.label]
					value.push(e[i][this.props.value])
				}
				this.defaultValue = value
				this.innerValue = label
				if(!this.multiple) return this.$emit('input', value.join())
				this.$emit('input', value)
				this.$emit('change', e)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.workflow-tree-select {
		width: 100%;
	}
</style>
