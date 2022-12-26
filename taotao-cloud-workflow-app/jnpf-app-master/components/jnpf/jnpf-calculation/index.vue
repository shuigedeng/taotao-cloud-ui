<template>
	<view>
		<u-input v-model="value" disabled placeholder='0.00' />
	</view>
</template>

<script>
	export default {
		name: 'jnpf-calculation',
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			vModel: {
				type: String,
				default: ''
			},
			expression: {
				type: Array,
				default: []
			},
			config: {
				type: Object,
				default: {}
			},
			formData: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				item: {},
				expressionC: []
			}
		},
		watch: {
			formData: {
				handler(val, oldVal) {
					this.item = this.$u.deepClone(val)
					this.calculation(this.item)
				},
				deep: true
			}
		},
		created() {
			this.calculation(this.value)
		},
		methods: {
			calculation(item) {
				let str = '';
				let expression = this.$u.deepClone(this.expression)
				let tabelVal = 0;
				expression.filter((o, i) => {
					if (o == '×') {
						expression.splice(i, 1, '*')
					} else if (o == '÷') {
						expression.splice(i, 1, '/')
					} else if (typeof o == 'object') {
						let [tabelVModel, cmpVModel] = o.__vModel__.split('.')
						for (let key in item) {
							if (item[key] instanceof Array) {
								if (key == tabelVModel) {
									item[key].forEach((o, k) => {
										if (o instanceof Array) {
											o.forEach(j => {
												if (j.__vModel__ == cmpVModel) {
													if (k > 0) {
														tabelVal += Number(j.value)
														expression.splice(i, 1, tabelVal)
														return
													}
													tabelVal = Number(j.value)
													expression.splice(i, 1, tabelVal)
												}
											})
										}
									})
								}
							} else {
								if (typeof item[key] != 'array') {
									if (key == tabelVModel) {
										expression.splice(i, 1, item[key])
									}
								}
							}
						}
					}
				})
				try {
					expression.forEach(data => {
						str += data
					})
					let val = eval(str)
					this.$emit('input', (Math.round(val * 100) / 100))
				} catch (err) {
					// this.$u.toast(
					// 	'计算公式错误'
					// )
				}
			}
		}
	}
</script>

<style>
</style>
