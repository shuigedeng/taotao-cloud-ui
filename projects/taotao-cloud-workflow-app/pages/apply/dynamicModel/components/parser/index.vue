<template>
	<u-form :model="formData" ref="dataForm" :errorType="['toast']" label-position="left" label-width="150">
		<u-form-item :label="item.__config__.label" :prop="item.__vModel__" v-for="(item, i) in formConfCopy" :key="i">
			<block v-if="useInputList.indexOf(item.__config__.workflowKey) > -1">
				<u-input v-model="formData[item.__vModel__]" :placeholder="'请输入'+item.__config__.label" />
			</block>
			<block v-if="item.__config__.workflowKey==='numInput'||item.__config__.workflowKey==='calculate'">
				<workflow-num-range v-model="formData[item.__vModel__]" />
			</block>
			<view v-if="item.__config__.workflowKey==='switch'" class="u-flex u-form-item-switch">
				<workflow-switch v-model="formData[item.__vModel__]"></workflow-switch>
			</view>
			<block v-if="['select','radio','checkbox'].indexOf(item.__config__.workflowKey) > -1">
				<workflow-select v-model="formData[item.__vModel__]" :placeholder="'请选择'+item.__config__.label"
					:options="item.__slot__.options" :props="item.__config__.props">
				</workflow-select>
			</block>
			<block v-if="item.__config__.workflowKey==='cascader'">
				<workflow-cascader v-model="formData[item.__vModel__]" :placeholder="'请选择'+item.__config__.label"
					:options="item.options" :props="item.props.props">
				</workflow-cascader>
			</block>
			<block v-if="item.__config__.workflowKey==='time'">
				<workflow-time-range v-model="formData[item.__vModel__]" />
			</block>
			<block v-if="useDateList.indexOf(item.__config__.workflowKey) > -1">
				<workflow-date-range v-model="formData[item.__vModel__]" />
			</block>
			<block v-if="item.__config__.workflowKey==='rate'">
				<u-rate v-model="formData[item.__vModel__]" size="40" :count="item.max">
				</u-rate>
			</block>
			<block v-if="item.__config__.workflowKey==='slider'">
				<u-slider v-model="formData[item.__vModel__]" :step="item.step" :min="item.min||0" :max="item.max||100"
					style="width: 100%;">
					<view class="slider-badge-button">{{formData[item.__vModel__]}}</view>
				</u-slider>
			</block>
			<block v-if="item.__config__.workflowKey==='comSelect'||item.__config__.workflowKey==='currOrganize'">
				<workflow-com-select v-model="formData[item.__vModel__]" :placeholder="'请选择'+item.__config__.label">
				</workflow-com-select>
			</block>
			<block v-if="item.__config__.workflowKey==='depSelect'||item.__config__.workflowKey==='currDept'">
				<workflow-org-select type="department" v-model="formData[item.__vModel__]"
					:placeholder="'请选择'+item.__config__.label">
				</workflow-org-select>
			</block>
			<block v-if="item.__config__.workflowKey==='posSelect'||item.__config__.workflowKey==='currPosition'">
				<workflow-org-select type="position" v-model="formData[item.__vModel__]"
					:placeholder="'请选择'+item.__config__.label">
				</workflow-org-select>
			</block>
			<block v-if="['userSelect','createUser', 'modifyUser'].indexOf(item.__config__.workflowKey) > -1">
				<workflow-user-select v-model="formData[item.__vModel__]" :placeholder="'请选择'+item.__config__.label">
				</workflow-user-select>
			</block>
			<block v-if="item.__config__.workflowKey==='treeSelect'">
				<workflow-tree-select v-model="formData[item.__vModel__]" :options="item.options" :props="item.props.props"
					:placeholder="'请选择'+item.__config__.label">
				</workflow-tree-select>
			</block>
			<block v-if="item.__config__.workflowKey==='address'">
				<workflow-city-select v-model="formData[item.__vModel__]" :placeholder="'请选择'+item.__config__.label"
					:level="item.level">
				</workflow-city-select>
			</block>
		</u-form-item>
	</u-form>
</template>
<script>
	import {
		getDictionaryDataSelector,
		getDataInterfaceRes
	} from '@/api/common'
	const dyOptionsList = ['radio', 'checkbox', 'select', 'cascader', 'treeSelect']
	const useInputList = ['comInput', 'textarea', 'WORKFLOWText', 'billRule']
	const useDateList = ['date', 'createTime', 'modifyTime']
	const useArrList = ['cascader', 'address', 'numInput', 'calculate', ...useDateList]

	export default {
		props: ['formConf'],
		data() {
			const data = {
				useInputList,
				useDateList,
				formConfCopy: this.$u.deepClone(this.formConf),
				formData: {}
			}
			this.initFormData(data.formConfCopy, data.formData)
			return data
		},
		methods: {
			initFormData(componentList, formData) {
				componentList.forEach(cur => {
					const config = cur.__config__
					if (cur.__vModel__) formData[cur.__vModel__] = config.defaultValue
					if (dyOptionsList.indexOf(config.workflowKey) > -1) {
						let isTreeSelect = config.workflowKey === 'treeSelect' || config.workflowKey === 'cascader'
						if (config.dataType === 'dictionary') {
							if (!config.dictionaryType) return
							getDictionaryDataSelector(config.dictionaryType).then(res => {
								isTreeSelect ? cur.options = res.data.list : cur.__slot__.options = res
									.data.list
							})
						}
						if (config.dataType === 'dynamic') {
							if (!config.propsUrl) return
							getDataInterfaceRes(config.propsUrl).then(res => {
								let realData = res.data.data
								if (Array.isArray(realData)) {
									isTreeSelect ? cur.options = realData : cur.__slot__.options = realData
								} else {
									isTreeSelect ? cur.options = [] : cur.__slot__.options = []
								}
							})
						}
					}
				})
			},
			submitForm() {
				this.$refs.dataForm.validate(valid => {
					if (!valid) return
					for (let key in this.formData) {
						if (!this.formData[key]) this.formData[key] = undefined
						if (this.formData[key] && Array.isArray(this.formData[key]) && !this.formData[key]
							.length) {
							this.formData[key] = undefined
						}
					}
					this.$emit('submit', this.formData)
				})
			},
			resetForm() {
				this.$refs.dataForm.resetFields()
			}
		}
	}
</script>
