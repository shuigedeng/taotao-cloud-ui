import {
	Info
} from '@/api/workFlow/workFlowForm'
import {
	getBillNumber
} from '@/api/common'

export default {
	data() {
		return {
			flowUrgentOptions: [{
				id: 1,
				fullName: '普通'
			}, {
				id: 2,
				fullName: '重要'
			}, {
				id: 3,
				fullName: '紧急'
			}],
			payProps: {
				label: 'fullName',
				value: 'enCode'
			},
			fileList: [],
			setting: {},
			userInfo: {},
			eventType: '',
			paymentMethodOptions: [],
			requiredList: {},
			rules: {},
			requiredObj: []
		}
	},
	mounted() {
		this.$refs.dataForm.setRules(this.rules)
		this.userInfo = uni.getStorageSync('userInfo') || {}
	},
	methods: {
		checkChildRule() {
			let list = {}
			this.requiredObj.forEach((data) => {
				if (data.required) {
					list[data.id] = data.name
				}
			})
			let title = [];
			for (let k in list) {
				let num = k.split("-");
				let childKey = num[0];
				num.forEach((model, i) => {
					if (i == 1) {
						let childData = this.dataForm[childKey]
						childData.forEach((child, i) => {
							if (child[model] instanceof Array) {
								if (child[model].length == 0) {
									title.push(list[childKey + "-" + model])
								}
							} else {
								if (!child[model]) {
									title.push(list[childKey + "-" + model])
								}
							}
						})
					}
				})
			}
			if (title.length > 0) {
				return title[0]
			}
		},
		/* 初始化处理 */
		init(data) {
			this.dataForm.id = data.id || ''
			this.dataForm.flowId = data.flowId
			this.setting = data
			this.updateDataRule()
			this.$nextTick(() => {
				this.$refs.dataForm.resetFields()
				if (this.beforeInit) this.beforeInit()
				if (data.id) {
					if (data.draftData) {
						this.dataForm = data.draftData
						if (this.dataForm.fileJson) {
							this.fileList = JSON.parse(this.dataForm.fileJson)
						}
						return
					}
					if (this.selfGetInfo && typeof this.selfGetInfo === "function") return this.selfGetInfo()
					Info(this.setting.enCode, data.id).then(res => {
						this.dataForm = res.data
						if (res.data.fileJson) {
							this.fileList = JSON.parse(res.data.fileJson)
						}
					})
				} else {
					if (this.selfInit) this.selfInit(data)
					if (!this.billEnCode) return
					getBillNumber(this.billEnCode).then(res => {
						if (data.enCode === 'crmOrder') {
							this.dataForm.orderCode = res.data
						} else {
							this.dataForm.billNo = res.data
						}
					})
				}
			})
		},
		getPaymentMethodOptions() {
			this.$store.dispatch('base/getDictionaryData', {
				sort: 'WFSettlementMethod'
			}).then(res => {
				this.paymentMethodOptions = res
			})
		},
		/* 提交 */
		submit(eventType) {
			let dataType = {}
			if ('fileJson' in this.dataForm) {
				this.dataForm.fileJson = !!this.fileList.length ? JSON.stringify(this.fileList) : ''
			}
			this.handleRules(this.dataForm, dataType)
			this.$refs.dataForm.setRules(this.rules)
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					if (!!this.checkChildRule()) return this.$u.toast(
						`${this.checkChildRule()}不能为空`
					)
					if (this.exist && !this.exist()) return
					this.eventType = eventType
					if (eventType === 'save' || eventType === 'submit') {
						if (this.selfSubmit && typeof this.selfSubmit === "function") {
							this.selfSubmit(this.dataForm)
							return
						}
					}
					this.$emit('eventReceiver', this.dataForm, eventType)
				}
			})
		},
		handleRules(dataForm, dataType) {
			for (let k in dataForm) {
				this.$set(dataType, k, (typeof dataForm[k]))
				if (dataForm[k] instanceof Array) {
					this.$set(dataType, k, 'array')
				}
			}
			for (let g in dataType) {
				for (let i in this.rules) {
					if (i == g) {
						for (let k = 0; k < this.rules[i].length; k++) {
							if (dataType[g] != 'undefined') {
								this.rules[i][k].type = dataType[g]
							}
						}
					}
				}
			}
		},
		updateDataRule() {
			let newRules = {}
			for (let i = 0; i < this.setting.formOperates.length; i++) {
				const item = this.setting.formOperates[i]
				if (item.required) {
					this.$set(this.requiredList, item.id, item.required)
					this.requiredObj.push(item)
				}
				const newRulesItem = {
					required: item.required || false,
					message: item.name + '不能为空',
					trigger: item.trigger || ['blur', 'change']
				}
				if (!this.rules.hasOwnProperty(item.id)) {
					if (item.required) this.$set(newRules, item.id, [newRulesItem])
				} else {
					let withoutRequiredItem = true
					for (let i = 0; i < this.rules[item.id].length; i++) {
						if (this.rules[item.id][i].hasOwnProperty('required')) {
							this.rules[item.id][i].required = item.required || false
							withoutRequiredItem = false
						}
					}
					if (withoutRequiredItem && item.required) this.rules[item.id].push(newRulesItem)
				}
			}
			this.rules = {
				...this.rules,
				...newRules
			}
			this.$refs.dataForm.setRules(this.rules)
		},
		/* 可见 */
		judgeShow(id) {
			if (this.setting.opType == 4) return true
			if (!this.setting.formOperates || !this.setting.formOperates.length) return true
			let arr = this.setting.formOperates.filter(o => o.id === id) || []
			if (!arr.length) return true
			let item = arr[0]
			return item.read
		},
		/* 可写 */
		judgeWrite(id) {
			if (this.setting.readonly) return true
			if (!this.setting.formOperates || !this.setting.formOperates.length) return false
			let arr = this.setting.formOperates.filter(o => o.id === id) || []
			if (!arr.length) return true
			let item = arr[0]
			return !item.write
		}
	}
}
