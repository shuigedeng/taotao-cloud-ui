<template>
	<view class="jnpf-relation-select">
		<u-input type="select" v-model="innerValue" disabled @click="openSelect" :placeholder="placeholder"></u-input>
	</view>
</template>

<script>
	import {
		getDataChange
	} from '@/api/common.js'
	export default {
		name: 'jnpf-relation-select',
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
			disabled: {
				type: Boolean,
				default: false
			},
			columnOptions: {
				type: Array,
				default: []
			},
			relationField: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'relation'
			},
			propsValue: {
				type: String,
				default: ''
			},
			modelId: {
				type: String,
				default: ''
			},
			hasPage: {
				type: Boolean,
				default: false
			},
			pageSize: {
				type: Number,
				default: 10000
			},
			vModel: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				selectShow: false,
				innerValue: '',
				defaultValue: '',
				current: null,
				defaultOptions: [],
				firstVal: '',
				firstId: 0,
			}
		},
		watch: {
			value(val) {
				if (val != '') {
					this.setDefault()
				} else {
					this.innerValue = ''
				}
			},
		},

		created() {
			uni.$on('confirm1', (subVal, innerValue, list) => {
				this.confirm(subVal, innerValue, list)
			})
			this.setDefault()
		},
		methods: {
			setDefault() {
				if (!this.value) return this.innerValue = ''
				let query = {
					id: this.value,
					interfaceId: this.modelId,
					propsValue: this.propsValue,
					relationField: this.relationField,
				}
				if (!this.modelId) return
				getDataChange(this.modelId, this.value).then(res => {
					if (!res.data || !res.data.data) return
					let data = JSON.parse(res.data.data)
					this.innerValue = data[this.relationField] || ''
					let relationData = this.$store.getters.relationData
					this.$set(relationData, this.vModel, data)
					this.$store.commit('base/UPDATE_RELATION_DATA', relationData)
				})
			},
			openSelect() {
				if (this.disabled) return
				let data = {
					columnOptions: this.columnOptions,
					relationField: this.relationField,
					type: this.type,
					propsValue: this.propsValue,
					modelId: this.modelId,
					hasPage: this.hasPage,
					pageSize: this.pageSize,
					id: this.value,
					vModel: this.vModel,
					innerValue: this.innerValue
				}
				uni.navigateTo({
					url: '/pages/apply/popSelect/index?data=' + encodeURIComponent(JSON.stringify(data))
				})
			},
			confirm(subVal, innerValue, vModel) {
				if (vModel === this.vModel) {
					this.firstVal = innerValue;
					this.firstId = subVal;
					this.innerValue = innerValue;
					this.$emit('input', subVal)
				}
			},
		}
	}
</script>

<style>
	.jnpf-relation-select {
		width: 100%;
		height: 100%;
	}
</style>
