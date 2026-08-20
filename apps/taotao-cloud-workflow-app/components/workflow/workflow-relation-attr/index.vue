<template>
	<view>
		<u-input disabled :placeholder="placeholder" v-model="value"></u-input>
	</view>
</template>

<script>
	export default {
		name: 'workflow-relation-attr',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: ["showField", "relationField",'type'],
		data() {
			return {
				value: '',
				placeholder:'用于展示弹窗选择的属性，且数据不会保存'
			}
		},
		computed: {
			relationData() {
				return this.$store.getters.relationData
			}
		},
		watch: {
			relationData: {
				handler(val) {
					if (!this.showField || !this.relationField) return
					let obj = val[this.relationField] || {}
					this.value = obj[this.showField] ? obj[this.showField] : ''
				},
				deep: true
			}
		},
		created() {
			if(this.type && this.type === 'relationFormAttr') return this.placeholder = '用于展示关联表单的属性，且数据不会保存'
		},
		methods: {

		}
	}
</script>

<style>
</style>
