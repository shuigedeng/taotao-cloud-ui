<template>
	<block v-if="itemCopy.__config__.workflowKey==='WORKFLOWText'">
		<workflow-text v-model="value" :textStyle="itemCopy.textStyle"></workflow-text>
	</block>
	<block v-else-if="itemCopy.__config__.workflowKey==='groupTitle'">
		<workflow-group :content="itemCopy.content" :content-position="itemCopy['content-position']"></workflow-group>
	</block>
	<view class="workflow-divider" v-else-if="itemCopy.__config__.workflowKey==='divider'">
		<u-divider half-width="200" height="80">{{itemCopy.__slot__.default}}</u-divider>
	</view>
	<view v-else-if="isIgnore"></view>
	<view v-else-if="itemCopy.__config__.workflowKey==='editor'"></view>
	<!-- <u-form-item label-width="0" v-else-if="itemCopy.__config__.workflowKey==='editor'">
			<workflow-editor v-model="value"></workflow-editor>
		</u-form-item> -->

	<view class="workflow-card" v-else-if="itemCopy.__config__.workflowKey==='card'||itemCopy.__config__.workflowKey==='row'">
		<view class="workflow-card-cap u-line-1" v-if="itemCopy.header">{{itemCopy.header}}</view>
		<item v-for="(child, index) in itemCopy.__config__.children" :key="child.__config__.renderKey" :item="child"
			:formConf="formConf" :formData="formData" @input="setValue" v-if="!child.__config__.noShow" />
	</view>
	<block v-else-if="itemCopy.__config__.isVisibility && itemCopy.__config__.workflowKey==='table'">
		<child-table v-model="value" :config="itemCopy" :ref="itemCopy.__vModel__" @input="setValue"
			:formData='formData'></child-table>
	</block>
	<view class="workflow-card" v-else-if="itemCopy.__config__.workflowKey==='tab'">
		<u-tabs is-scroll :list="itemCopy.__config__.children" name="title" :current="tabCurrent" @change="onTabChange">
		</u-tabs>
		<view v-for="(item,i) in itemCopy.__config__.children" :key='i'>
			<view v-show="i == tabCurrent">
				<item v-for="(child, index) in item.__config__.children" :key="child.__config__.renderKey" :item="child"
					:formConf="formConf" :formData="formData" @input="setValue" v-if="!child.__config__.noShow" />
			</view>
		</view>
	</view>
	<block v-else-if="itemCopy.__config__.workflowKey==='collapse'">
		<u-collapse :head-style="{'padding-left':'32rpx'}" :accordion="itemCopy.accordion">
			<u-collapse-item :title="item.title" v-for="(item, i) in itemCopy.__config__.children" :key="i"
				:open="itemCopy.__config__.active.indexOf(item.name)>-1" @change="onCollapseChange">
				<item v-for="(child, index) in item.__config__.children" :key="child.__config__.renderKey" :item="child"
					:formConf="formConf" :formData="formData" @input="setValue" v-if="!child.__config__.noShow" />
			</u-collapse-item>
		</u-collapse>
	</block>
	<u-form-item label-width="0" v-else-if="itemCopy.__config__.workflowKey==='button'">
		<workflow-button :buttonText="itemCopy.buttonText" :align="itemCopy.align" :type="itemCopy.type"
			:disabled="itemCopy.disabled" @click="onButtonClick"></workflow-button>
	</u-form-item>
	<u-form-item :label="label+':'" :prop="itemCopy.__vModel__" :required="itemCopy.__config__.required"
		:label-width="labelWidth" v-else>
		<block v-if="itemCopy.__config__.workflowKey==='comInput'">
			<u-input :type="itemCopy['show-password']?'password':'text'" v-model="value"
				:placeholder="itemCopy.placeholder" :maxlength="itemCopy.maxlength?itemCopy.maxlength:140"
				:disabled="itemCopy.disabled" @blur="onBlur"></u-input>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='calculate'">
			<workflow-calculation :expression='itemCopy.expression' :vModel='itemCopy.__vModel__'
				:config='itemCopy.__config__' :formData='formData' v-model="value" />
		</block>
		<!-- <block v-if="itemCopy.__config__.workflowKey==='colorPicker'">
			<workflow-colorPicker v-model="value" :colorFormat="itemCopy['color-format']"></workflow-colorPicker>
		</block> -->
		<block v-if="itemCopy.__config__.workflowKey==='textarea'">
			<u-input v-model="value" type="textarea" :placeholder="itemCopy.placeholder"
				:maxlength="itemCopy.maxlength?itemCopy.maxlength:140" :disabled="itemCopy.disabled" />
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='numInput'">
			<u-number-box v-model="value" :step="itemCopy.step" :max="itemCopy.max||99999"
				:min="itemCopy.min||itemCopy.min===0?itemCopy.min:-99999" :input-width="120" :input-height="60"
				:positive-integer="false" :disabled="itemCopy.disabled" @blur="onBlur">
			</u-number-box>
		</block>
		<view v-if="itemCopy.__config__.workflowKey==='switch'" class="u-flex u-form-item-switch">
			<workflow-switch v-model="value" :disabled="itemCopy.disabled"></workflow-switch>
		</view>
		<block v-if="itemCopy.__config__.workflowKey==='radio'">
			<u-radio-group v-model="value" :disabled="itemCopy.disabled">
				<u-radio v-for="(option, index) in itemCopy.__slot__.options" :key="index"
					:name="option[itemCopy.__config__.props.value]">{{ option[itemCopy.__config__.props.label] }}
				</u-radio>
			</u-radio-group>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='checkbox'">
			<workflow-checkbox v-model="value" :options="itemCopy.__slot__.options" :props="itemCopy.__config__.props"
				:disabled="itemCopy.disabled">
			</workflow-checkbox>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='select'">
			<workflow-select v-model="value" :placeholder="itemCopy.placeholder" :options="itemCopy.__slot__.options"
				:props="itemCopy.__config__.props" :multiple="itemCopy.multiple" :disabled="itemCopy.disabled">
			</workflow-select>
		</block>

		<block v-if="itemCopy.__config__.workflowKey==='cascader'">
			<workflow-cascader v-model="value" :placeholder="itemCopy.placeholder" :options="itemCopy.options"
				:props="itemCopy.props.props" :disabled="itemCopy.disabled">
			</workflow-cascader>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='time'">
			<workflow-date-time type="time" v-model="value" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled">
			</workflow-date-time>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='date'">
			<workflow-date-time :type="itemCopy.type||'date'" v-model="value" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled">
			</workflow-date-time>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='uploadImg'">
			<workflow-upload v-model="value" :disabled="itemCopy.disabled" :limit="itemCopy.limit"></workflow-upload>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='uploadFz'">
			<workflow-file v-model="value" :disabled="itemCopy.disabled" :limit="itemCopy.limit"
				:sizeUnit="itemCopy.sizeUnit" :fileSize="!itemCopy.fileSize ? 5 : itemCopy.fileSize"
				:accept="itemCopy.accept" />
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='rate'">
			<u-rate v-model="value" size="40" :count="itemCopy.max" :disabled="itemCopy.disabled"></u-rate>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='slider'">
			<u-slider v-model="value" :step="itemCopy.step" :min="itemCopy.min||0" :max="itemCopy.max||100"
				style="width: 100%;" :disabled="itemCopy.disabled">
				<view class="slider-badge-button">{{value}}</view>
			</u-slider>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='relationFormAttr'">
			<workflow-relation-attr :showField="itemCopy.showField" :relationField="itemCopy.relationField"
				type='relationFormAttr'>
			</workflow-relation-attr>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='popupAttr'">
			<workflow-relation-attr :showField="itemCopy.showField" :relationField="itemCopy.relationField"
				type='popupAttr'>
			</workflow-relation-attr>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='relationForm'">
			<workflow-relation-select type="relation" v-model="value" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled" :modelId="itemCopy.modelId" :columnOptions="itemCopy.columnOptions"
				:relationField="itemCopy.relationField" :hasPage="itemCopy.hasPage" :pageSize="itemCopy.pageSize"
				:vModel="itemCopy.__config__.tableName ? itemCopy.__vModel__ + '_workflowTable_' + itemCopy.__config__.tableName + (itemCopy
					.__config__.isSubTable ? '0' : '1') : itemCopy.__vModel__">
			</workflow-relation-select>
		</block>
		<block v-if="itemCopy.__config__.workflowKey === 'popupSelect'">
			<workflow-popup-select type="popup" v-model="value" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled" :interfaceId="itemCopy.interfaceId"
				:columnOptions="itemCopy.columnOptions" :relationField="itemCopy.relationField"
				:propsValue="itemCopy.propsValue" :hasPage="itemCopy.hasPage" :pageSize="itemCopy.pageSize" :vModel="itemCopy.__config__.tableName ? itemCopy.__vModel__ + '_workflowTable_' + itemCopy.__config__.tableName + (itemCopy
					.__config__.isSubTable ? '0' : '1') : itemCopy.__vModel__" :popupTitle="itemCopy.popupTitle"></workflow-popup-select>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='comSelect'">
			<workflow-com-select v-model="value" :multiple="itemCopy.multiple" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled">
			</workflow-com-select>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='depSelect'">
			<workflow-org-select type="department" v-model="value" :multiple="itemCopy.multiple"
				:placeholder="itemCopy.placeholder" :disabled="itemCopy.disabled">
			</workflow-org-select>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='posSelect'">
			<workflow-org-select type="position" v-model="value" :multiple="itemCopy.multiple"
				:placeholder="itemCopy.placeholder" :disabled="itemCopy.disabled">
			</workflow-org-select>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='userSelect'">
			<workflow-user-select v-model="value" :multiple="itemCopy.multiple" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled">
			</workflow-user-select>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='treeSelect'">
			<workflow-tree-select v-model="value" :options="itemCopy.options" :props="itemCopy.props.props"
				:multiple="itemCopy.multiple" :placeholder="itemCopy.placeholder" :disabled="itemCopy.disabled">
			</workflow-tree-select>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='address'">
			<workflow-city-select v-model="value" :placeholder="itemCopy.placeholder" :level="itemCopy.level"
				:disabled="itemCopy.disabled" :multiple="itemCopy.multiple">
			</workflow-city-select>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='barcode'">
			<workflow-barcode :staticText="itemCopy.staticText" :width="itemCopy.width" :height="itemCopy.height"
				:format="itemCopy.format" :dataType="itemCopy.dataType" :lineColor="itemCopy.lineColor"
				:background="itemCopy.background" :relationField="itemCopy.relationField" :formData="formData">
			</workflow-barcode>
		</block>
		<block v-if="itemCopy.__config__.workflowKey==='qrcode'">
			<workflow-qrcode :staticText="itemCopy.staticText" :size="itemCopy.size" :dataType="itemCopy.dataType"
				:colorDark="itemCopy.colorDark" :colorLight="itemCopy.colorLight"
				:relationField="itemCopy.relationField" :formData="formData">
			</workflow-qrcode>
		</block>
		<block v-if="isSystem">
			<u-input v-model="value" placeholder="系统自动生成" disabled></u-input>
		</block>
	</u-form-item>
</template>

<script>
	import childTable from './childTable.vue'
	import Item from './Item'
	const systemList = ['createUser', 'createTime', 'modifyUser', 'modifyTime', 'currOrganize', 'currDept', 'currPosition',
		'billRule'
	]
	const ignoreList = []
	export default {
		name: 'Item',
		model: {
			event: 'input'
		},
		components: {
			childTable,
			Item
		},
		props: {
			item: {
				type: Object,
				required: true
			},
			formConf: {
				type: Object,
				required: true
			},
			formData: {
				type: Object,
				required: true
			},
		},
		data() {
			return {
				tabCurrent: 0,
				value: '',
				show: false
			}
		},
		watch: {
			value(val) {
				this.itemCopy.__config__.defaultValue = this.value
				this.$emit('input', this.itemCopy)
			}
		},
		computed: {
			itemCopy() {
				return this.$u.deepClone(this.item)
			},
			isSystem() {
				return systemList.indexOf(this.itemCopy.__config__.workflowKey) > -1
			},
			isIgnore() {
				return ignoreList.indexOf(this.itemCopy.__config__.workflowKey) > -1
			},
			labelWidth() {
				return this.itemCopy.__config__.labelWidth ? this.itemCopy.__config__.labelWidth * 1.5 : ''
			},
			label() {
				return this.itemCopy.__config__.label
			}
		},
		created() {
			const workflowKey = this.itemCopy.__config__.workflowKey
			if (workflowKey === 'switch') {
				this.value = this.itemCopy.__config__.defaultValue ? 1 : 0
			} else if (workflowKey === 'cascader') {
				this.value = this.itemCopy.__config__.defaultValue || []
			} else if (workflowKey === 'rate') {
				this.value = this.itemCopy.__config__.defaultValue || 0
			} else if (workflowKey === 'tab') {
				this.tabCurrent = Number(this.itemCopy.__config__.active)
			} else if (workflowKey === 'numInput') {
				let value = 0
				if (this.itemCopy.min) {
					if (this.itemCopy.__config__.defaultValue && this.itemCopy.__config__.defaultValue > this.itemCopy
						.min) {
						value = this.itemCopy.__config__.defaultValue
					} else {
						value = this.itemCopy.min
					}
					if (this.itemCopy.max && this.itemCopy.min > this.itemCopy.max) {
						this.itemCopy.max = this.itemCopy.min
					}
				} else {
					value = this.itemCopy.__config__.defaultValue || 0
				}
				this.value = value
			} else {
				this.value = this.itemCopy.__config__.defaultValue
			}
		},
		methods: {
			onTabChange(index) {
				if (this.tabCurrent === index) return
				this.tabCurrent = index;
				this.$emit('tab-change', this.itemCopy, index)
			},
			onCollapseChange(data) {
				this.$emit('collapse-change', this.itemCopy, data)
			},
			setValue(item) {
				this.$emit('input', item)
			},
			setDefaultValue(val) {
				this.value = val
			},
			onButtonClick(event) {
				this.$emit('click', this.itemCopy, event)
			},
			onBlur(data) {
				this.$emit('blur', this.itemCopy, data)
			}
		}
	}
</script>
<style>
	.close-btn {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
