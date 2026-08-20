<template>
	<view class="workflow-table">
		<view class="workflow-table-item" v-for="(item,i) in tableFormData" :key="i">
			<view class="workflow-table-item-title u-flex u-row-between">
				<text class="workflow-table-item-title-num">{{config.__config__.label}}({{i+1}})</text>
				<view class="workflow-table-item-title-action" v-if="!disabled && tableFormData.length>1"
					@click="delItem(i)">删除
				</view>
			</view>
			<u-form-item :label="childItem.__config__.label+':'"
				:label-width="childItem.__config__.labelWidth ? childItem.__config__.labelsssWidth * 1.5 : ''"
				v-for="(childItem,cIndex) in item" :key="cIndex" :required="childItem.__config__.required"
				v-if="!childItem.__config__.noShow && childItem.__config__.isVisibility&& childItem.__config__.workflowKey!=='colorPicker'">
				<block v-if="childItem.__config__.workflowKey==='comInput'">
					<u-input v-model="tableFormData[i][cIndex].value" :placeholder="childItem.placeholder"
						:maxlength="childItem.maxlength?childItem.maxlength:140"
						:disabled="disabled||childItem.disabled">
					</u-input>
				</block>
				<block v-if="childItem.__config__.workflowKey==='calculate'">
					<workflow-calculation :expression='childItem.expression' :vModel='childItem.__vModel__'
						:config='childItem.__config__' :formData='formData' v-model="tableFormData[i][cIndex].value" />
				</block>
				<block v-if="childItem.__config__.workflowKey==='textarea'">
					<u-input v-model="tableFormData[i][cIndex].value" type="textarea"
						:placeholder="childItem.placeholder" :maxlength="childItem.maxlength?childItem.maxlength:140"
						:disabled="disabled||childItem.disabled" />
				</block>
				<block v-if="childItem.__config__.workflowKey==='numInput'">
					<u-number-box v-model="tableFormData[i][cIndex].value" :step="childItem.step"
						:max="childItem.max||99999" :min="childItem.min||childItem.min===0?childItem.min:-99999"
						:input-width="120" :input-height="60" :positive-integer="false"
						:disabled="disabled||childItem.disabled"></u-number-box>
				</block>
				<block v-if="childItem.__config__.workflowKey==='switch'">
					<workflow-switch v-model="tableFormData[i][cIndex].value" :disabled="disabled||childItem.disabled">
					</workflow-switch>
				</block>
				<block v-if="childItem.__config__.workflowKey==='radio'">
					<u-radio-group v-model="tableFormData[i][cIndex].value" :disabled="disabled||childItem.disabled">
						<u-radio v-for="(option, index) in childItem.__slot__.options" :key="index"
							:name="option[childItem.__config__.props.value]">
							{{ option[childItem.__config__.props.label] }}
						</u-radio>
					</u-radio-group>
				</block>
				<block v-if="childItem.__config__.workflowKey==='checkbox'">
					<workflow-checkbox v-model="tableFormData[i][cIndex].value" :options="childItem.__slot__.options"
						:props="childItem.__config__.props" :disabled="disabled||childItem.disabled">
					</workflow-checkbox>
				</block>
				<block v-if="childItem.__config__.workflowKey==='select'">
					<workflow-select v-model="tableFormData[i][cIndex].value" :placeholder="childItem.placeholder"
						:options="childItem.__slot__.options" :props="childItem.__config__.props"
						:multiple="childItem.multiple" :disabled="disabled||childItem.disabled"
						@change="onChange($event,childItem,i)">
					</workflow-select>
				</block>
				<block v-if="childItem.__config__.workflowKey==='cascader'">
					<workflow-cascader v-model="tableFormData[i][cIndex].value" :placeholder="childItem.placeholder"
						:options="childItem.options" :props="childItem.props.props"
						:disabled="disabled||childItem.disabled">
					</workflow-cascader>
				</block>
				<block v-if="childItem.__config__.workflowKey==='time'">
					<workflow-date-time type="time" v-model="tableFormData[i][cIndex].value"
						:placeholder="childItem.placeholder" :disabled="disabled||childItem.disabled">
					</workflow-date-time>
				</block>
				<block v-if="childItem.__config__.workflowKey==='date'">
					<workflow-date-time type="datetime" v-model="tableFormData[i][cIndex].value"
						:placeholder="childItem.placeholder" :disabled="disabled||childItem.disabled">
					</workflow-date-time>
				</block>
				<block v-if="childItem.__config__.workflowKey==='uploadImg'">
					<workflow-upload v-model="tableFormData[i][cIndex].value" :disabled="disabled||childItem.disabled">
					</workflow-upload>
				</block>
				<block v-if="childItem.__config__.workflowKey==='uploadFz'">
					<workflow-file v-model="tableFormData[i][cIndex].value" :disabled="disabled||childItem.disabled"
						:limit="childItem.limit" :sizeUnit="childItem.sizeUnit" :fileSize="childItem.fileSize"
						:accept="childItem.accept" />
				</block>
				<block v-if="childItem.__config__.workflowKey==='rate'">
					<u-rate v-model="tableFormData[i][cIndex].value" size="40" :count="childItem.max"
						:disabled="disabled||childItem.disabled"></u-rate>
				</block>
				<block v-if="childItem.__config__.workflowKey==='slider'">
					<u-slider v-model="tableFormData[i][cIndex].value" :step="childItem.step" :min="childItem.min||0"
						:max="childItem.max||100" style="width: 100%;" :disabled="disabled||childItem.disabled">
						<view class="slider-badge-button">{{tableFormData[i][cIndex].value}}</view>
					</u-slider>
				</block>
				<block v-if="childItem.__config__.workflowKey==='relationFormAttr'">
					<workflow-relation-attr :showField="childItem.showField"
						:relationField="childItem.relationField+'_workflowRelation_'+i" type="relation">
					</workflow-relation-attr>
				</block>
				<block v-if="childItem.__config__.workflowKey==='popupAttr'">
					<workflow-relation-attr :showField="childItem.showField"
						:relationField="childItem.relationField+'_workflowRelation_'+i" type="popup">
					</workflow-relation-attr>
				</block>
				<block v-if="childItem.__config__.workflowKey==='relationForm'">
					<workflow-relation-select type="relation" v-model="tableFormData[i][cIndex].value"
						:placeholder="childItem.placeholder" :disabled="childItem.disabled" :modelId="childItem.modelId"
						:columnOptions="childItem.columnOptions" :relationField="childItem.relationField"
						:hasPage="childItem.hasPage" :pageSize="childItem.pageSize"
						:vModel="childItem.__config__.tableName ? childItem.__vModel__ + '_workflowTable_' + childItem.__config__.tableName + (childItem
				                            .__config__.isSubTable ? '0' : '1')+'_workflowRelation_'+i : childItem.__vModel__+'_workflowRelation_'+i">
					</workflow-relation-select>
				</block>
				<block v-if="childItem.__config__.workflowKey === 'popupSelect'">
					<workflow-popup-select type="popup" v-model="tableFormData[i][cIndex].value"
						:placeholder="childItem.placeholder" :disabled="childItem.disabled"
						:interfaceId="childItem.interfaceId" :columnOptions="childItem.columnOptions"
						:relationField="childItem.relationField" :propsValue="childItem.propsValue"
						:hasPage="childItem.hasPage" :pageSize="childItem.pageSize"
						:vModel="childItem.__config__.tableName ? childItem.__vModel__ + '_workflowTable_' + childItem.__config__.tableName + (childItem
				                            .__config__.isSubTable ? '0' : '1')+'_workflowRelation_'+i : childItem.__vModel__+'_workflowRelation_'+i">
					</workflow-popup-select>
				</block>
				<block v-if="childItem.__config__.workflowKey==='comSelect'">
					<workflow-com-select v-model="tableFormData[i][cIndex].value" :multiple="childItem.multiple"
						:placeholder="childItem.placeholder" :disabled="disabled||childItem.disabled">
					</workflow-com-select>
				</block>
				<block v-if="childItem.__config__.workflowKey==='depSelect'">
					<workflow-org-select type="department" v-model="tableFormData[i][cIndex].value"
						:multiple="childItem.multiple" :placeholder="childItem.placeholder"
						:disabled="disabled||childItem.disabled">
					</workflow-org-select>
				</block>
				<block v-if="childItem.__config__.workflowKey==='posSelect'">
					<workflow-org-select type="position" v-model="tableFormData[i][cIndex].value"
						:multiple="childItem.multiple" :placeholder="childItem.placeholder"
						:disabled="disabled||childItem.disabled">
					</workflow-org-select>
				</block>
				<block v-if="childItem.__config__.workflowKey==='userSelect'">
					<workflow-user-select v-model="tableFormData[i][cIndex].value" :multiple="childItem.multiple"
						:placeholder="childItem.placeholder" :disabled="disabled||childItem.disabled">
					</workflow-user-select>
				</block>
				<block v-if="childItem.__config__.workflowKey==='treeSelect'">
					<workflow-tree-select v-model="tableFormData[i][cIndex].value" :options="childItem.options"
						:props="childItem.props.props" :multiple="childItem.multiple"
						:placeholder="childItem.placeholder" :disabled="disabled||childItem.disabled">
					</workflow-tree-select>
				</block>
				<block v-if="childItem.__config__.workflowKey==='address'">
					<workflow-city-select v-model="tableFormData[i][cIndex].value" :placeholder="childItem.placeholder"
						:level="childItem.level" :disabled="disabled||childItem.disabled"
						:multiple="childItem.multiple">
					</workflow-city-select>
				</block>
				<block v-if="childItem.__config__.workflowKey==='billRule'">
					<u-input v-model="tableFormData[i][cIndex].value" placeholder="系统自动生成" disabled></u-input>
				</block>
			</u-form-item>
		</view>
		<view class="workflow-table-addBtn" v-if="!disabled" @click="addItem()">
			<u-icon name="plus" color="#2979ff"></u-icon>{{config.actionText}}
		</view>
		<view class="workflow-table-item" v-if="config['show-summary'] && summaryField.length">
			<view class="workflow-table-item-title u-flex u-row-between">
				<text class="workflow-table-item-title-num">{{config.__config__.label}}合计</text>
			</view>
			<u-form-item v-for="(item,index) in summaryField" :label="item.__config__.label" :key="item.__vModel__">
				<u-input v-model="item.value" disabled placeholder=""></u-input>
			</u-form-item>
		</view>
	</view>
</template>

<script>
	import {
		getDictionaryDataSelector,
		getDataInterfaceRes
	} from '@/api/common'
	const dyOptionsList = ['radio', 'checkbox', 'select', 'cascader', 'treeSelect']
	export default {
		name: 'workflow-table',
		inject: ["parameter"],
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			config: {
				type: Object,
				default: () => {}
			},
			formData: {
				type: Object,
				required: true
			},
			value: {
				type: Array,
				default: () => ([])
			}
		},
		data() {
			return {
				activeRowIndex: 0,
				tableData: [],
				tableFormData: [],
				summaryField: [],
				isIgnore: false
			}
		},
		watch: {
			tableFormData: {
				handler(val, oldVal) {
					this.$emit('input', val)
					this.getTableSummaries()
				},
				deep: true
			}
		},
		computed: {
			disabled() {
				return this.config.disabled
			}
		},
		created() {
			let summaryField = this.config.summaryField || []
			this.summaryField = []
			this.tableData = this.config.__config__.children || []
			for (let i = 0; i < summaryField.length; i++) {
				for (let o = 0; o < this.tableData.length; o++) {
					if (this.tableData[o].__vModel__ === summaryField[i]) {
						this.summaryField.push(this.tableData[o])
						this.summaryField = this.summaryField.map(o => ({
							value: '0',
							...o
						}))
					}
				}
			}
			this.buildOptions()
		},
		methods: {
			getTableSummaries() {
				const newVal = this.tableFormData.map((row, i) => row.reduce((p, c) => {
					p[c.__vModel__] = c.value
					return p
				}, {}))
				for (let i = 0; i < this.summaryField.length; i++) {
					let val = 0
					for (let j = 0; j < newVal.length; j++) {
						if (newVal[j][this.summaryField[i].__vModel__]) {
							let data = isNaN(newVal[j][this.summaryField[i].__vModel__]) ? 0 :
								Number(newVal[j][this.summaryField[i].__vModel__])
							val += data
							this.summaryField[i].value = val
						}
					}
				}
			},
			async buildOptions() {
				for (let i = 0; i < this.tableData.length; i++) {
					const config = this.tableData[i].__config__
					if (dyOptionsList.indexOf(config.workflowKey) > -1) {
						let isTreeSelect = config.workflowKey === 'treeSelect' || config.workflowKey === 'cascader'
						if (config.dataType === 'dictionary') {
							if (!config.dictionaryType) return
							isTreeSelect ? this.tableData[i].options = [] : this.tableData[i].__slot__.options = [];
							let res = await getDictionaryDataSelector(config.dictionaryType)
							isTreeSelect ? this.tableData[i].options = res.data.list : this.tableData[i].__slot__
								.options = res.data.list
						}
						if (config.dataType === 'dynamic') {
							if (!config.propsUrl) return
							isTreeSelect ? this.tableData[i].options = [] : this.tableData[i].__slot__.options = []
							let res = await getDataInterfaceRes(config.propsUrl)
							let realData = res.data.data
							if (Array.isArray(realData)) {
								isTreeSelect ? this.tableData[i].options = realData : this.tableData[i].__slot__
									.options = realData
							} else {
								isTreeSelect ? this.tableData[i].options = [] : this.tableData[i].__slot__
									.options = []
							}
						}
					}
				}
				this.init()
			},
			init() {
				if (this.value && this.value.length) {
					this.value.forEach(t => this.addItem(t))
				} else {
					this.addItem()
				}
			},
			addItem(val) {
				this.tableFormData.push(this.getEmptyItem(val))
			},
			delItem(i, title) {
				this.tableFormData.splice(i, 1)
			},
			getEmptyItem(val) {
				return this.tableData.map(t => {
					let res = {
						...t,
						value: val && val[t.__vModel__] || t.__config__.defaultValue
					}
					if (res.__config__.workflowKey === 'numInput') {
						let defVal = 0;
						if (res.value === undefined) {
							res.value = defVal
						}
					}
					return res
				})
			},
			checkData(item) {
				if ([null, undefined, ''].includes(item.value)) return false
				if (Array.isArray(item.value)) return item.value.length > 0
				return true
			},
			submit() {
				let res = true
				outer: for (let i = 0; i < this.tableFormData.length; i++) {
					const row = this.tableFormData[i]
					for (let j = 0; j < row.length; j++) {
						if (row[j].__config__.required && !this.checkData(row[j])) {
							res = false
							this.$u.toast(
								`${this.config.__config__.label}(${i+1})${row[j].__config__.label}不能为空`
							)
							break outer
						}
						if (row[j].__config__.regList && row[j].__config__.regList.length) {
							let regList = row[j].__config__.regList
							for (let ii = 0; ii < regList.length; ii++) {
								const item = regList[ii];
								let pattern = eval(item.pattern)
								if (row[j].value && !pattern.test(row[j].value)) {
									this.$u.toast(
										`${this.config.__config__.label}(${i+1})${row[j].__config__.label}${item.message}`
									)
									res = false
									break outer
								}
							}
						}
					}
				}
				return res ? this.tableFormData.map(row => row.reduce((p, c) => (p[c.__vModel__] = c.value,
						p), {})) :
					false
			},
			setTableFormData(prop, value) {
				let activeRow = this.tableFormData[this.activeRowIndex]
				for (let i = 0; i < activeRow.length; i++) {
					if (activeRow[i].__vModel__ === prop) {
						activeRow[i].value = value
						break
					}
				}
			},
			getTableFieldOptions(prop) {
				let res = []
				for (let i = 0; i < this.tableData.length; i++) {
					if (this.tableData[i].__vModel__ === prop) {
						let item = this.tableData[i]
						let isTreeSelect = item.__config__.workflowKey === 'treeSelect' || item.__config__
							.workflowKey ===
							'cascader'
						isTreeSelect ? res = item.options || [] : res = item.__slot__.options || []
						break
					}
				}
				return res
			},
			onChange(val, data, rowIndex) {
				this.activeRowIndex = rowIndex
				if (data && data.on && data.on.change) {
					const func = this.workflow.getScriptFunc(data.on.change);
					if (!func) return
					func.call(this, {
						data: val,
						...this.parameter
					})
				}
			}
		}
	}
</script>
