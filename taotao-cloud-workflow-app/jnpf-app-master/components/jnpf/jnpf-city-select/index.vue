<template>
	<view class="jnpf-tree-select">
		<u-input type="select" :select-open="selectShow" v-model="innerValue" :placeholder="placeholder"
			@click="openSelect"></u-input>
		<city-tree v-if="selectShow" v-model="selectShow" @confirm="selectConfirm" :multiple="multiple" :props="props"
			:selectedData="selectedData" :level='level' :idS='value'>
		</city-tree>
	</view>
</template>

<script>
	import cityTree from './city-tree';
	import {
		getProvinceSelectorInfoList
	} from '@/api/common.js'
	export default {
		model: {
			prop: 'value',
			event: 'input'
		},
		components: {
			cityTree
		},
		props: {
			value: {
				default: ''
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
			level: {
				type: Number,
				default: 0
			}
		},
		watch: {
			value(val) {
				if (val === '') return this.innerValue = ''
				this.setDefault(val)
			}
		},
		data() {
			return {
				selectShow: false,
				innerValue: '',
				selectedData: []
			}
		},
		created() {
			this.setDefault(this.value)
		},
		methods: {
			setDefault(id) {
				if (id.length === 0) return this.innerValue = ''
				this.selectedData = []
				if (!this.multiple) id = [id]
				getProvinceSelectorInfoList(id).then(res => {
					const list = res.data
					let txt = ''
					for (let i = 0; i < list.length; i++) {
						txt += (i ? ',' : '') + list[i].join('-')
						this.selectedData.push(list[i].join('-'))
					}
					this.innerValue = txt
				})
			},

			openSelect() {
				if (this.disabled) return
				this.selectShow = true
			},
			selectConfirm(e, selectId) {
				this.selectedData = e;
				let label = '';
				let value = [];
				this.defaultValue = value
				this.innerValue = e.join()
				if (!this.multiple) return this.$emit('input', selectId[0])
				this.$emit('input', selectId)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.jnpf-tree-select {
		width: 100%;
	}
</style>
