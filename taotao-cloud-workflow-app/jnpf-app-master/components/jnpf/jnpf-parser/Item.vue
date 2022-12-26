<template>
	<block v-if="itemCopy.__config__.jnpfKey==='JNPFText'">
		<jnpf-text v-model="value" :textStyle="itemCopy.textStyle"></jnpf-text>
	</block>
	<block v-else-if="itemCopy.__config__.jnpfKey==='groupTitle'">
		<jnpf-group :content="itemCopy.content" :content-position="itemCopy['content-position']"></jnpf-group>
	</block>
	<view class="jnpf-divider" v-else-if="itemCopy.__config__.jnpfKey==='divider'">
		<u-divider half-width="200" height="80">{{itemCopy.__slot__.default}}</u-divider>
	</view>
	<view v-else-if="isIgnore"></view>
	<view v-else-if="itemCopy.__config__.jnpfKey==='editor'"></view>
	<!-- <u-form-item label-width="0" v-else-if="itemCopy.__config__.jnpfKey==='editor'">
			<jnpf-editor v-model="value"></jnpf-editor>
		</u-form-item> -->

	<view class="jnpf-card" v-else-if="itemCopy.__config__.jnpfKey==='card'||itemCopy.__config__.jnpfKey==='row'">
		<view class="jnpf-card-cap u-line-1" v-if="itemCopy.header">{{itemCopy.header}}</view>
		<item v-for="(child, index) in itemCopy.__config__.children" :key="child.__config__.renderKey" :item="child"
			:formConf="formConf" :formData="formData" @input="setValue" v-if="!child.__config__.noShow" />
	</view>
	<block v-else-if="itemCopy.__config__.isVisibility && itemCopy.__config__.jnpfKey==='table'">
		<child-table v-model="value" :config="itemCopy" :ref="itemCopy.__vModel__" @input="setValue"
			:formData='formData'></child-table>
	</block>
	<view class="jnpf-card" v-else-if="itemCopy.__config__.jnpfKey==='tab'">
		<u-tabs is-scroll :list="itemCopy.__config__.children" name="title" :current="tabCurrent" @change="onTabChange">
		</u-tabs>
		<view v-for="(item,i) in itemCopy.__config__.children" :key='i'>
			<view v-show="i == tabCurrent">
				<item v-for="(child, index) in item.__config__.children" :key="child.__config__.renderKey" :item="child"
					:formConf="formConf" :formData="formData" @input="setValue" v-if="!child.__config__.noShow" />
			</view>
		</view>
	</view>
	<block v-else-if="itemCopy.__config__.jnpfKey==='collapse'">
		<u-collapse :head-style="{'padding-left':'32rpx'}" :accordion="itemCopy.accordion">
			<u-collapse-item :title="item.title" v-for="(item, i) in itemCopy.__config__.children" :key="i"
				:open="itemCopy.__config__.active.indexOf(item.name)>-1" @change="onCollapseChange">
				<item v-for="(child, index) in item.__config__.children" :key="child.__config__.renderKey" :item="child"
					:formConf="formConf" :formData="formData" @input="setValue" v-if="!child.__config__.noShow" />
			</u-collapse-item>
		</u-collapse>
	</block>
	<u-form-item label-width="0" v-else-if="itemCopy.__config__.jnpfKey==='button'">
		<jnpf-button :buttonText="itemCopy.buttonText" :align="itemCopy.align" :type="itemCopy.type"
			:disabled="itemCopy.disabled" @click="onButtonClick"></jnpf-button>
	</u-form-item>
	<u-form-item :label="label+':'" :prop="itemCopy.__vModel__" :required="itemCopy.__config__.required"
		:label-width="labelWidth" v-else>
		<block v-if="itemCopy.__config__.jnpfKey==='comInput'">
			<u-input :type="itemCopy['show-password']?'password':'text'" v-model="value"
				:placeholder="itemCopy.placeholder" :maxlength="itemCopy.maxlength?itemCopy.maxlength:140"
				:disabled="itemCopy.disabled" @blur="onBlur"></u-input>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='calculate'">
			<jnpf-calculation :expression='itemCopy.expression' :vModel='itemCopy.__vModel__'
				:config='itemCopy.__config__' :formData='formData' v-model="value" />
		</block>
		<!-- <block v-if="itemCopy.__config__.jnpfKey==='colorPicker'">
			<jnpf-colorPicker v-model="value" :colorFormat="itemCopy['color-format']"></jnpf-colorPicker>
		</block> -->
		<block v-if="itemCopy.__config__.jnpfKey==='textarea'">
			<u-input v-model="value" type="textarea" :placeholder="itemCopy.placeholder"
				:maxlength="itemCopy.maxlength?itemCopy.maxlength:140" :disabled="itemCopy.disabled" />
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='numInput'">
			<u-number-box v-model="value" :step="itemCopy.step" :max="itemCopy.max||99999"
				:min="itemCopy.min||itemCopy.min===0?itemCopy.min:-99999" :input-width="120" :input-height="60"
				:positive-integer="false" :disabled="itemCopy.disabled" @blur="onBlur">
			</u-number-box>
		</block>
		<view v-if="itemCopy.__config__.jnpfKey==='switch'" class="u-flex u-form-item-switch">
			<jnpf-switch v-model="value" :disabled="itemCopy.disabled"></jnpf-switch>
		</view>
		<block v-if="itemCopy.__config__.jnpfKey==='radio'">
			<u-radio-group v-model="value" :disabled="itemCopy.disabled">
				<u-radio v-for="(option, index) in itemCopy.__slot__.options" :key="index"
					:name="option[itemCopy.__config__.props.value]">{{ option[itemCopy.__config__.props.label] }}
				</u-radio>
			</u-radio-group>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='checkbox'">
			<jnpf-checkbox v-model="value" :options="itemCopy.__slot__.options" :props="itemCopy.__config__.props"
				:disabled="itemCopy.disabled">
			</jnpf-checkbox>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='select'">
			<jnpf-select v-model="value" :placeholder="itemCopy.placeholder" :options="itemCopy.__slot__.options"
				:props="itemCopy.__config__.props" :multiple="itemCopy.multiple" :disabled="itemCopy.disabled">
			</jnpf-select>
		</block>

		<block v-if="itemCopy.__config__.jnpfKey==='cascader'">
			<jnpf-cascader v-model="value" :placeholder="itemCopy.placeholder" :options="itemCopy.options"
				:props="itemCopy.props.props" :disabled="itemCopy.disabled">
			</jnpf-cascader>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='time'">
			<jnpf-date-time type="time" v-model="value" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled">
			</jnpf-date-time>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='date'">
			<jnpf-date-time :type="itemCopy.type||'date'" v-model="value" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled">
			</jnpf-date-time>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='uploadImg'">
			<jnpf-upload v-model="value" :disabled="itemCopy.disabled" :limit="itemCopy.limit"></jnpf-upload>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='uploadFz'">
			<jnpf-file v-model="value" :disabled="itemCopy.disabled" :limit="itemCopy.limit"
				:sizeUnit="itemCopy.sizeUnit" :fileSize="!itemCopy.fileSize ? 5 : itemCopy.fileSize"
				:accept="itemCopy.accept" />
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='rate'">
			<u-rate v-model="value" size="40" :count="itemCopy.max" :disabled="itemCopy.disabled"></u-rate>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='slider'">
			<u-slider v-model="value" :step="itemCopy.step" :min="itemCopy.min||0" :max="itemCopy.max||100"
				style="width: 100%;" :disabled="itemCopy.disabled">
				<view class="slider-badge-button">{{value}}</view>
			</u-slider>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='relationFormAttr'">
			<jnpf-relation-attr :showField="itemCopy.showField" :relationField="itemCopy.relationField"
				type='relationFormAttr'>
			</jnpf-relation-attr>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='popupAttr'">
			<jnpf-relation-attr :showField="itemCopy.showField" :relationField="itemCopy.relationField"
				type='popupAttr'>
			</jnpf-relation-attr>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='relationForm'">
			<jnpf-relation-select type="relation" v-model="value" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled" :modelId="itemCopy.modelId" :columnOptions="itemCopy.columnOptions"
				:relationField="itemCopy.relationField" :hasPage="itemCopy.hasPage" :pageSize="itemCopy.pageSize"
				:vModel="itemCopy.__config__.tableName ? itemCopy.__vModel__ + '_jnpfTable_' + itemCopy.__config__.tableName + (itemCopy
					.__config__.isSubTable ? '0' : '1') : itemCopy.__vModel__">
			</jnpf-relation-select>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey === 'popupSelect'">
			<jnpf-popup-select type="popup" v-model="value" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled" :interfaceId="itemCopy.interfaceId"
				:columnOptions="itemCopy.columnOptions" :relationField="itemCopy.relationField"
				:propsValue="itemCopy.propsValue" :hasPage="itemCopy.hasPage" :pageSize="itemCopy.pageSize" :vModel="itemCopy.__config__.tableName ? itemCopy.__vModel__ + '_jnpfTable_' + itemCopy.__config__.tableName + (itemCopy
					.__config__.isSubTable ? '0' : '1') : itemCopy.__vModel__" :popupTitle="itemCopy.popupTitle"></jnpf-popup-select>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='comSelect'">
			<jnpf-com-select v-model="value" :multiple="itemCopy.multiple" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled">
			</jnpf-com-select>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='depSelect'">
			<jnpf-org-select type="department" v-model="value" :multiple="itemCopy.multiple"
				:placeholder="itemCopy.placeholder" :disabled="itemCopy.disabled">
			</jnpf-org-select>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='posSelect'">
			<jnpf-org-select type="position" v-model="value" :multiple="itemCopy.multiple"
				:placeholder="itemCopy.placeholder" :disabled="itemCopy.disabled">
			</jnpf-org-select>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='userSelect'">
			<jnpf-user-select v-model="value" :multiple="itemCopy.multiple" :placeholder="itemCopy.placeholder"
				:disabled="itemCopy.disabled">
			</jnpf-user-select>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='treeSelect'">
			<jnpf-tree-select v-model="value" :options="itemCopy.options" :props="itemCopy.props.props"
				:multiple="itemCopy.multiple" :placeholder="itemCopy.placeholder" :disabled="itemCopy.disabled">
			</jnpf-tree-select>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='address'">
			<jnpf-city-select v-model="value" :placeholder="itemCopy.placeholder" :level="itemCopy.level"
				:disabled="itemCopy.disabled" :multiple="itemCopy.multiple">
			</jnpf-city-select>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='barcode'">
			<jnpf-barcode :staticText="itemCopy.staticText" :width="itemCopy.width" :height="itemCopy.height"
				:format="itemCopy.format" :dataType="itemCopy.dataType" :lineColor="itemCopy.lineColor"
				:background="itemCopy.background" :relationField="itemCopy.relationField" :formData="formData">
			</jnpf-barcode>
		</block>
		<block v-if="itemCopy.__config__.jnpfKey==='qrcode'">
			<jnpf-qrcode :staticText="itemCopy.staticText" :size="itemCopy.size" :dataType="itemCopy.dataType"
				:colorDark="itemCopy.colorDark" :colorLight="itemCopy.colorLight"
				:relationField="itemCopy.relationField" :formData="formData">
			</jnpf-qrcode>
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
				return systemList.indexOf(this.itemCopy.__config__.jnpfKey) > -1
			},
			isIgnore() {
				return ignoreList.indexOf(this.itemCopy.__config__.jnpfKey) > -1
			},
			labelWidth() {
				return this.itemCopy.__config__.labelWidth ? this.itemCopy.__config__.labelWidth * 1.5 : ''
			},
			label() {
				return this.itemCopy.__config__.label
			}
		},
		created() {
			const jnpfKey = this.itemCopy.__config__.jnpfKey
			if (jnpfKey === 'switch') {
				this.value = this.itemCopy.__config__.defaultValue ? 1 : 0
			} else if (jnpfKey === 'cascader') {
				this.value = this.itemCopy.__config__.defaultValue || []
			} else if (jnpfKey === 'rate') {
				this.value = this.itemCopy.__config__.defaultValue || 0
			} else if (jnpfKey === 'tab') {
				this.tabCurrent = Number(this.itemCopy.__config__.active)
			} else if (jnpfKey === 'numInput') {
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
