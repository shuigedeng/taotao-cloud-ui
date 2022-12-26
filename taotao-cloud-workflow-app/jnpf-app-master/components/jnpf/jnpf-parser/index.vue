<template>
	<u-form :model="formData" :rules="rules" ref="dataForm" :errorType="['toast']"
		:label-position="formConf.labelPosition==='top'?'top':'left'" :label-width="formConf.labelWidth*1.5"
		:label-align="formConf.labelPosition==='right'?'right':'left'" class="jnpf-form">
		<template v-for="(item, index) in formConfCopy.fields">
			<view>
				<Item :key="item.__config__.renderKey" :item="item" :formConf="formConf" @blur="onBlur"
					@input="setValue" @collapse-change="onCollapseChange" @tab-change="onTabChange" :formData="formData"
					@click="onButtonClick" :ref="item.__vModel__?item.__vModel__: undefined"
					v-if="!item.__config__.noShow && item.__config__.isVisibility" />
			</view>
		</template>
	</u-form>
</template>
<script>
	import Item from './Item'
	import request from '@/utils/request'
	import {
		getDictionaryDataSelector,
		getDataInterfaceRes
	} from '@/api/common'
	const dyOptionsList = ['radio', 'checkbox', 'select', 'cascader', 'treeSelect']

	export default {
		components: {
			Item
		},
		props: {
			formConf: {
				type: Object,
				required: true
			},
			loading: {
				type: Boolean,
				default: false
			}
		},
		data() {
			const data = {
				formConfCopy: this.$u.deepClone(this.formConf),
				formData: {},
				rules: {},
				options: {},
				tableRefs: {},
			}
			this.initFormData(data.formConfCopy.fields, data.formData, data.tableRefs)
			this.buildRules(data.formConfCopy.fields, data.rules)
			this.buildOptions(data.formConfCopy.fields, data.options)
			this.$nextTick(() => {
				this.onLoadFunc(data.formConfCopy)
			})
			showList: false
			return data
		},
		provide() {
			return {
				parameter: this.parameter
			}
		},
		computed: {
			parameter() {
				return {
					formData: this.formData,
					setFormData: this.setFormData,
					setShowOrHide: this.setShowOrHide,
					setRequired: this.setRequired,
					setDisabled: this.setDisabled,
					request: this.request,
					getFieldOptions: this.getFieldOptions,
					setFieldOptions: this.setFieldOptions
				}
			}
		},
		mounted() {
			this.$refs.dataForm.setRules(this.rules);
		},
		methods: {
			initFormData(componentList, formData, tableRefs) {
				this.$store.commit('base/UPDATE_RELATION_DATA', {})
				componentList.forEach(cur => {
					const config = cur.__config__
					if (cur.__vModel__) {
						formData[cur.__vModel__] = config.defaultValue
						if (config.children && cur.__config__.jnpfKey !== 'table') {
							this.initFormData(config.children, formData)
						}
						if (cur.__config__.jnpfKey == 'table' && !cur.__config__.noShow) {
							tableRefs[cur.__vModel__] = cur
						}
					}
				})
			},
			buildOptions(componentList, data) {
				componentList.forEach(cur => {
					const config = cur.__config__
					if (dyOptionsList.indexOf(config.jnpfKey) > -1) {
						let isTreeSelect = config.jnpfKey === 'treeSelect' || config.jnpfKey === 'cascader'
						if (config.dataType === 'dictionary') {
							if (!config.dictionaryType) return
							isTreeSelect ? cur.options = [] : cur.__slot__.options = []
							getDictionaryDataSelector(config.dictionaryType).then(res => {
								isTreeSelect ? cur.options = res.data.list : cur.__slot__.options = res
									.data.list
								isTreeSelect ? data[cur.__vModel__ + 'Options'] = cur.options : data[cur
									.__vModel__ + 'Options'] = cur.__slot__.options
							})
						} else if (config.dataType === 'dynamic') {
							if (!config.propsUrl) return
							isTreeSelect ? cur.options = [] : cur.__slot__.options = []
							getDataInterfaceRes(config.propsUrl).then(res => {
								let realData = res.data.data
								if (Array.isArray(realData)) {
									isTreeSelect ? cur.options = realData : cur.__slot__.options = realData
								} else {
									isTreeSelect ? cur.options = [] : cur.__slot__.options = []
								}
								isTreeSelect ? data[cur.__vModel__ + 'Options'] = cur.options : data[cur
									.__vModel__ + 'Options'] = cur.__slot__.options
							})
						} else {
							isTreeSelect ? data[cur.__vModel__ + 'Options'] = cur.options : data[cur.__vModel__ +
								'Options'] = cur.__slot__.options
						}
					}
					if (config.jnpfKey === 'comSelect') {
						this.$store.dispatch('base/getOrganizeTree').then(res => {
							data[cur.__vModel__ + 'Options'] = res
						})
					}
					if (config.jnpfKey === 'depSelect') {
						this.$store.dispatch('base/getDepartmentTree').then(res => {
							data[cur.__vModel__ + 'Options'] = res
						})
					}
					if (config.jnpfKey === 'posSelect') {
						this.$store.dispatch('base/getPositionTree').then(res => {
							data[cur.__vModel__ + 'Options'] = res
						})
					}
					if (config.children && config.jnpfKey !== 'table') this.buildOptions(config.children, data)
				})
			},
			buildRules(componentList, rules) {
				componentList.forEach(cur => {
					const config = cur.__config__
					const jnpfKey = config.jnpfKey
					const useNumList = ['numInput', 'switch', 'date', 'rate', 'slider', 'calculate']
					const useArrayList = ['select', 'comSelect',
						'depSelect', 'posSelect', 'userSelect', 'treeSelect', 'address'
					]
					if (!Array.isArray(config.regList)) config.regList = []
					if (config.required) {
						config.regList.push({
							required: config.required,
							message: `${config.label}不能为空`
						})
					}
					const rule = config.regList.map(item => {
						item.pattern && (item.pattern = eval(item.pattern))
						item.trigger = config.trigger || 'change, blur'
						if (useNumList.includes(jnpfKey)) item.type = 'number'
						if (useArrayList.includes(jnpfKey) && cur.multiple) item.type = 'array'
						if (Array.isArray(config.defaultValue)) item.type = 'array'
						return item
					})
					if (rule.length) rules[cur.__vModel__] = rule
					if (config.children && jnpfKey !== 'table') this.buildRules(config.children, rules)
				})
			},
			setValue(item) {
				if (item.__vModel__) {
					this.$set(this.formData, item.__vModel__, item.__config__.defaultValue)
				}
				this.onChange(item)
			},
			onChange(item) {
				if (item && item.on && item.on.change) {
					const func = this.jnpf.getScriptFunc(item.on.change);
					if (!func) return
					func.call(this, {
						data: item.__config__.defaultValue,
						...this.parameter
					})
				}
			},
			onBlur(item, data) {
				this.setValue(item)
				if (item && item.on && item.on.blur) {
					const func = this.jnpf.getScriptFunc(item.on.blur);
					if (!func) return
					func.call(this, {
						data: data,
						...this.parameter
					})
				}
			},
			onTabChange(item, data) {
				if (item && item.on && item.on['tab-click']) {
					const func = this.jnpf.getScriptFunc(item.on['tab-click']);
					if (!func) return
					func.call(this, {
						data: data,
						...this.parameter
					})
				}
			},
			onButtonClick(item, event) {
				if (item && item.on && item.on.click) {
					const func = this.jnpf.getScriptFunc(item.on.click);
					if (!func) return
					func.call(this, {
						data: event,
						...this.parameter
					})
				}
			},
			onCollapseChange(item, data) {
				if (item && item.on && item.on.change) {
					const func = this.jnpf.getScriptFunc(item.on.change);
					if (!func) return
					func.call(this, {
						data: data,
						...this.parameter
					})
				}
			},
			setFormData(prop, value) {
				if (!prop) return
				const isChildTable = prop.indexOf('.') > -1
				if (isChildTable) {
					const list = prop.split('.')
					if (this.$refs[list[0]][0] && this.$refs[list[0]][0].$children[0]) {
						this.$refs[list[0]][0].$children[0].setTableFormData(list[1], value)
					}
				} else {
					this.comSet('defaultValue', prop, value)
				}

			},
			setShowOrHide(prop, value) {
				const newVal = !!value
				const isChildTable = prop.indexOf('.') > -1
				if (!isChildTable) {
					this.comSet('noShow', prop, !newVal)
				}
			},
			setRequired(prop, value) {
				const newVal = !!value
				const isChildTable = prop.indexOf('.') > -1
				if (!isChildTable) {
					this.comSet('required', prop, newVal)
					this.buildRules(this.formConfCopy.fields, this.rules)
				}
			},
			setDisabled(prop, value) {
				const newVal = !!value
				const isChildTable = prop.indexOf('.') > -1
				if (!isChildTable) {
					this.comSet('disabled', prop, newVal)
				}
			},
			setFieldOptions(prop, value) {
				const newVal = Array.isArray(value) ? value : []
				const isChildTable = prop.indexOf('.') > -1
				if (!isChildTable) {
					this.comSet('options', prop, newVal)
				}
			},
			request(url, method, data) {
				if (!url) return
				return request({
					url: url,
					method: method || 'GET',
					data: data || {},
					options: {
						load: false
					}
				})
			},
			getFieldOptions(prop) {
				if (!prop) return []
				const isChildTable = prop.indexOf('.') > -1
				if (isChildTable) {
					const list = prop.split('.')
					if (this.$refs[list[0]][0] && this.$refs[list[0]][0].$children[0]) {
						let res = this.$refs[list[0]][0] && this.$refs[list[0]][0].$children[0].getTableFieldOptions(list[
							1])
						return res
					} else {
						return []
					}
				} else {
					return this.options[prop + 'Options'] || []
				}
			},
			comSet(field, prop, value) {
				if (!prop) return
				const loop = list => {
					for (let i = 0; i < list.length; i++) {
						let item = list[i]
						if (item.__vModel__ && item.__vModel__ === prop) {
							item.__config__.defaultValue = this.formData[prop]
							switch (field) {
								case 'disabled':
									item[field] = value
									break;
								case 'options':
									if (dyOptionsList.indexOf(item.__config__.jnpfKey) > -1) {
										let isTreeSelect = item.__config__.jnpfKey === 'treeSelect' || item.__config__
											.jnpfKey === 'cascader'
										isTreeSelect ? item.options = value : item.__slot__.options = value
									}
									break;
								default:
									item.__config__[field] = value
									break;
							}
							item.__config__.renderKey = +new Date() + item.__vModel__
							break;
						}
						if (item.__config__ && item.__config__.jnpfKey !== 'table' && item.__config__.children && Array
							.isArray(item.__config__.children)) {
							loop(item.__config__.children)
						}
					}
				}
				loop(this.formConfCopy.fields)
			},
			onLoadFunc(formConfCopy) {
				if (!formConfCopy || !formConfCopy.funcs || !formConfCopy.funcs.onLoad) return
				const onLoadFunc = this.jnpf.getScriptFunc(formConfCopy.funcs.onLoad)
				if (!onLoadFunc) return
				onLoadFunc(this.parameter)
			},
			beforeSubmit() {
				if (!this.formConfCopy || !this.formConfCopy.funcs || !this.formConfCopy.funcs.beforeSubmit) return Promise
					.resolve()
				const func = this.jnpf.getScriptFunc(this.formConfCopy.funcs.beforeSubmit)
				if (!func) return Promise.resolve()
				return func(this.parameter)
			},
			afterSubmit() {
				if (!this.formConfCopy || !this.formConfCopy.funcs || !this.formConfCopy.funcs.afterSubmit) return
				const func = this.jnpf.getScriptFunc(this.formConfCopy.funcs.afterSubmit)
				if (!func) return
				func(this.parameter)
			},
			checkTableData() {
				let valid = true
				Object.keys(this.tableRefs).forEach(vModel => {
					const res = this.$refs[vModel][0].$refs[vModel].submit()
					res ? (this.formData[vModel] = res) : (valid = false)
				})
				return valid
			},
			submitForm() {
				try {
					this.beforeSubmit().then(() => {
						this.submit()
					})
				} catch (e) {
					this.submit()
				}
			},
			submit() {
				if (!this.checkTableData()) return
				this.$refs.dataForm.validate(valid => {
					if (!valid) return
					this.$emit('submit', this.formData, this.afterSubmit)
				});
			},
			resetForm() {
				this.$refs.dataForm.resetFields()
			},
			setFormValue(vModel, value) {
				this.formData[vModel] = value
				this.$refs[vModel][0].setDefaultValue(value)
			}
		}
	}
</script>
