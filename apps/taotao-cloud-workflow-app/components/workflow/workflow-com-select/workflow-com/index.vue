<template>
	<view class="workflow-tree-select">
		<u-input type="select" :select-open="selectShow" v-model="innerValue" :placeholder="placeholder"
			@click="openSelect"></u-input>
		<com-tree v-model="selectShow" @confirm="selectConfirm" :multiple="multiple" :props="props"
			:selectedData="selectedData" :options="options" :idS='value'>
		</com-tree>
	</view>
</template>

<script>
	import comTree from './com-tree';
	import {
		getProvinceSelectorInfoList
	} from '@/api/common.js'
	export default {
		model: {
			prop: 'value',
			event: 'input'
		},
		components: {
			comTree
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
			}
		},

		data() {
			return {
				selectShow: false,
				innerValue: '',
				selectedData: [],
				allList: []
			}
		},
		watch: {
			value(val) {
				if (!this.value || !this.value.length) {
					this.innerValue = ''
					this.selectedData = [];
					return
				}
				this.setDefault()
			},
			options() {
				this.setDefault()
			},
		},
		created() {
			this.allList = this.treeToArray()
			// this.selectedData = JSON.parse(JSON.stringify(this.value))
			if (!this.value || !this.value.length) {
				this.innerValue = ''
				this.selectedData = [];
				return
			}
			this.setDefault()
		},
		methods: {
			setDefault() {
				this.selectedData = this.multiple ? this.value : [this.value]
				let textList = []
				for (let i = 0; i < this.selectedData.length; i++) {
					const item = this.selectedData[i];
					let textItem = JSON.parse(JSON.stringify(item))
					for (let j = 0; j < item.length; j++) {
						inner: for (let ii = 0; ii < this.allList.length; ii++) {
							if (item[j] === this.allList[ii].id) {
								textItem[j] = this.allList[ii].fullName
								break inner
							}
						}
					}
					textList.push(textItem)
				}
				this.selectedData = textList.map(o => o.join('/'))
				this.innerValue = this.selectedData.join(',')
			},
			treeToArray() {
				let options = JSON.parse(JSON.stringify(this.options))
				let list = []
				const loop = (options) => {
					for (let i = 0; i < options.length; i++) {
						const item = options[i]
						list.push(item)
						if (item.hasChildren && item.children && Array.isArray(item.children)) {
							loop(item.children)
						}
					}
				}
				loop(options)
				return list
			},
			openSelect() {
				if (this.disabled) return
				this.selectShow = true
			},
			selectConfirm(e, selectId) {
				this.selectedData = e;
				let label = ''
				let value = [];
				this.innerValue = e.join(',')
				if (!this.multiple) return this.$emit('input', selectId[0])
				this.$emit('input', selectId)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.workflow-tree-select {
		width: 100%;
	}
</style>
