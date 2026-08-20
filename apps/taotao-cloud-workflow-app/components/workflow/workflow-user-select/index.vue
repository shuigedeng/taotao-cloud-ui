<template>
	<view class="workflow-tree-select">
		<u-input type="select" :select-open="selectShow" v-model="innerValue" :placeholder="placeholder"
			@click="openSelect"></u-input>
		<user-tree v-model="selectShow" @confirm="selectConfirm" :options="options" :multiple="multiple" :props="props"
			:selectedData="selectedData">
		</user-tree>
	</view>
</template>

<script>
	import userTree from './user-tree.vue';
	import {
		getUserInfoList
	} from '@/api/common.js'
	export default {
		model: {
			prop: 'value',
			event: 'input'
		},
		components: {
			userTree
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
					children: 'children',
					isLeaf: 'isLeaf'
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
		},
		data() {
			return {
				selectShow: false,
				innerValue: '',
				selectedData: []
			}
		},
		watch: {
			value(val) {
				if (!val) return this.innerValue = ''
				this.setDefault(val)
			}
		},
		created() {
			this.setDefault(this.value)
		},
		methods: {
			setDefault(id) {
				this.selectedData = []
				if (!id) return this.innerValue = ''
				const arr = typeof(id) === 'string' ? id.split(',') : id
				getUserInfoList(arr).then(res => {
					const list = res.data.list
					this.selectedData = list
					let txt = ''
					for (let i = 0; i < list.length; i++) {
						txt += (i ? ',' : '') + list[i].fullName
					}
					this.innerValue = txt
				})
			},

			openSelect() {
				if (this.disabled) return
				this.selectShow = true
			},
			selectConfirm(e) {
				this.selectedData = e;
				let label = ''
				let value = []
				for (let i = 0; i < e.length; i++) {
					label += (!label ? '' : ',') + e[i][this.props.label]
					value.push(e[i][this.props.value])
				}
				this.defaultValue = value
				this.innerValue = label
				if (!this.multiple) return this.$emit('input', value.join())
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
