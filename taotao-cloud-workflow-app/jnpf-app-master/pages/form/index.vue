<template>
	<view class="jnpf-wrap jnpf-wrap-form">
		<u-form :model="dataForm" :rules="rules" ref="dataForm" :errorType="['toast']" label-position="left"
			label-width="150" label-align="left" class="jnpf-form">
			<!-- 单行输入 -->
			<u-form-item label="单行输入" prop="comInput" required label-width="150">
				<u-input v-model="dataForm.comInput" placeholder="请输入"></u-input>
			</u-form-item>
			<!-- 多行输入 -->
			<u-form-item label="多行输入" prop="textarea">
				<u-input v-model="dataForm.textarea" type="textarea" placeholder="请输入" />
			</u-form-item>
			<!-- 数字输入 -->
			<u-form-item label="数字输入" prop="numInput">
				<u-number-box v-model="dataForm.numInput" :min="0" :max="100" :step="0.01" :input-width="120"
					:positive-integer="false" :input-height="60"></u-number-box>
			</u-form-item>
			<!-- 开关 -->
			<u-form-item label="开关" prop="switch">
				<view class="u-flex u-form-item-switch">
					<jnpf-switch v-model="dataForm.switch"></jnpf-switch>
				</view>
			</u-form-item>
			<!-- 单选框组 -->
			<u-form-item label="单选框组" prop="radio">
				<u-radio-group v-model="dataForm.radio">
					<u-radio v-for="(item, index) in radioList" :key="index" :name="item.id">{{ item.fullName }}
					</u-radio>
				</u-radio-group>
			</u-form-item>
			<!-- 多选框组 -->
			<u-form-item label="多选框组" prop="checkbox">
				<jnpf-checkbox v-model="dataForm.checkbox" :options="checkboxList"></jnpf-checkbox>
			</u-form-item>
			<!-- 下拉框组 -->
			<u-form-item label="下拉框组" prop="select">
				<jnpf-select v-model="dataForm.select" placeholder="请选择下拉框组" :options="checkboxList"></jnpf-select>
			</u-form-item>
			<!-- 下拉多选 -->
			<u-form-item label="下拉多选" prop="select1">
				<jnpf-select v-model="dataForm.select1" placeholder="请选择下拉框组" :options="checkboxList" multiple>
				</jnpf-select>
			</u-form-item>
			<!-- 级联选择 -->
			<u-form-item label="级联选择" prop="cascader">
				<jnpf-cascader v-model="dataForm.cascader" placeholder="请选择级联选择" :options="cascaderList">
				</jnpf-cascader>
			</u-form-item>
			<!-- 省市区 -->
			<u-form-item label="省市区" prop="address">
				<jnpf-city-select v-model="dataForm.address" placeholder="请选择省市区" :level="2">
				</jnpf-city-select>
			</u-form-item>
			<!-- 树形选择 -->
			<u-form-item label="树形选择" prop="treeSelect">
				<jnpf-tree-select v-model="dataForm.treeSelect" placeholder="请选择树形选择" :options="treeData">
				</jnpf-tree-select>
			</u-form-item>
			<!-- 文本 -->
			<jnpf-text v-model="text"></jnpf-text>
			<!-- 上传图片 -->
			<u-form-item label="上传图片" prop="uploadImg">
				<jnpf-upload v-model="dataForm.uploadImg"></jnpf-upload>
			</u-form-item>
			<!-- 富文本 -->
			<!-- <u-form-item label-width="0" prop="editor">
				<jnpf-editor v-model="dataForm.editor" disabled></jnpf-editor>
			</u-form-item> -->
			<!-- 评分 -->
			<u-form-item label="评分" prop="rate">
				<u-rate v-model="dataForm.rate" size="40"></u-rate>
			</u-form-item>
			<!-- 滑块 -->
			<u-form-item label="滑块" prop="slider">
				<u-slider v-model="dataForm.slider" step="1" min="1" max="100" style="width: 100%;"></u-slider>
			</u-form-item>
			<view class="jnpf-card">
				<!-- 时间选择 -->
				<u-form-item label="时间选择" prop="time">
					<jnpf-date-time type="time" v-model="dataForm.time"></jnpf-date-time>
				</u-form-item>
				<!-- 日期选择 -->
				<u-form-item label="日期选择" prop="date">
					<jnpf-date-time type="date" v-model="dataForm.date"></jnpf-date-time>
				</u-form-item>
			</view>
			<view class="jnpf-card">
				<!-- 时间选择 -->
				<u-form-item label="时间选择" prop="time">
					<jnpf-date-time type="time" v-model="dataForm.time"></jnpf-date-time>
				</u-form-item>
				<!-- 日期选择 -->
				<u-form-item label="日期选择" prop="date">
					<jnpf-date-time type="datetime" v-model="dataForm.date"></jnpf-date-time>
				</u-form-item>
			</view>
			<!-- 公司组件 -->
			<u-form-item label="公司组件" prop="comSelect">
				<jnpf-com-select v-model="dataForm.comSelect" placeholder="请选择">
				</jnpf-com-select>
			</u-form-item>
			<!-- 部门组件 -->
			<u-form-item label="部门组件" prop="depSelect">
				<jnpf-org-select type="department" v-model="dataForm.depSelect"></jnpf-org-select>
			</u-form-item>
			<!-- 岗位组件 -->
			<u-form-item label="岗位组件" prop="posSelect">
				<jnpf-org-select type="position" v-model="dataForm.posSelect"></jnpf-org-select>
			</u-form-item>
			<!-- 用户组件 -->
			<u-form-item label="用户组件" prop="userSelect">
				<jnpf-org-select v-model="dataForm.userSelect"></jnpf-org-select>
			</u-form-item>
			<!-- 分组标题 -->
			<jnpf-group content="分组标题" content-position="right"></jnpf-group>
			<!-- 系统控件(7个) + 单据组件 -->
			<u-form-item label="系统控件" prop="createUser">
				<u-input v-model="dataForm.createUser" placeholder="系统自动生成" disabled></u-input>
			</u-form-item>
			<view class="jnpf-table">
				<view class="jnpf-table-item" v-for="(item,i) in dataForm.table" :key="i">
					<view class="jnpf-table-item-title u-flex u-row-between">
						<text class="jnpf-table-item-title-num">设计子表({{i+1}})</text>
						<view class="jnpf-table-item-title-action" v-if="dataForm.table.length>1" @click="delItem(i)">删除
						</view>
					</view>
					<u-form-item label="单行输入" prop="dataForm.table[i].comInput">
						<u-input v-model="dataForm.table[i].comInput" placeholder="请输入"></u-input>
					</u-form-item>
				</view>
				<view class="jnpf-table-addBtn" @click="addItem">
					<u-icon name="plus" color="#2979ff"></u-icon>添加
				</view>
			</view>
		</u-form>
		<view class="buttom-actions">
			<u-button class="buttom-btn" @click="jnpf.goBack">取消</u-button>
			<u-button class="buttom-btn" type="primary" @click="submit">保存</u-button>
			<!-- <u-button class="buttom-btn" type="warning" @click="submit">保存草稿</u-button> -->
		</view>
	</view>
</template>

<script>
	import {
		getUserSelector
	} from '@/api/common.js'
	export default {
		data() {
			return {
				text: '提示：测试文本',
				dataForm: {
					comInput: '',
					textarea: '',
					numInput: 0.055,
					switch: 0,
					radio: '',
					checkbox: [],
					select: '',
					select1: [],
					cascader: [],
					address: [],
					treeSelect: '',
					uploadImg: [
						// 	{
						// 	fileId: "20210415_23187ab6d1a04697a5e3f562bd7f5922.png",
						// 	name: "homeHL.png",
						// 	url: "/api/file/Image/annex/20210415_23187ab6d1a04697a5e3f562bd7f5922.png"
						// }
					],
					rate: 0,
					slider: 20,
					editor: '',
					time: '',
					date: null,
					comSelect: '',
					depSelect: '',
					posSelect: '',
					userSelect: '',
					createUser: '',
					table: [{
						comInput: ''
					}]
				},
				rules: {
					// comInput: [{
					// 	required: true,
					// 	message: '请输入',
					// 	trigger: 'blur',
					// }],
					// textarea: [{
					// 	required: true,
					// 	message: '请输入',
					// 	trigger: 'blur',
					// }],
					// numInput: [{
					// 	required: true,
					// 	message: '请输入',
					// 	trigger: 'change',
					// 	type: 'any'
					// }],
					// switch: [{
					// 	required: true,
					// 	message: '请选择',
					// 	trigger: 'change',
					// 	type: 'any'
					// }],
					// radio: [{
					// 	required: true,
					// 	message: '请选择任意一种单选',
					// 	trigger: 'change'
					// }],
					// checkbox: [{
					// 	required: true,
					// 	message: '请选择至少选择一个多选框组',
					// 	trigger: 'change',
					// 	type: 'array'
					// }],
					// select: [{
					// 	required: true,
					// 	message: '请选择一个下拉框组',
					// 	trigger: 'change',
					// }],
					// select1: [{
					// 	required: true,
					// 	message: '请至少选择一个下拉框组',
					// 	trigger: 'change',
					// 	type: 'array'
					// }],
					// cascader: [{
					// 	required: true,
					// 	message: '请选择级联选择',
					// 	trigger: 'change',
					// 	type: 'array'
					// }],
					// address: [{
					// 	required: true,
					// 	message: '请选择地址',
					// 	trigger: 'change',
					// 	type: 'array'
					// }],
					// treeSelect: [{
					// 	required: true,
					// 	message: '请选择树形选择',
					// 	trigger: 'change',
					// }],
					// uploadImg: [{
					// 	required: true,
					// 	message: '请至少上传一张图片',
					// 	trigger: 'change',
					// 	type: 'array'
					// }],
					// rate: [{
					// 	required: true,
					// 	message: '请选择评分',
					// 	trigger: 'change',
					// 	type: 'number'
					// }],
					// slider: [{
					// 	required: true,
					// 	message: '请选择滑块',
					// 	trigger: 'change',
					// }],
					// editor: [{
					// 	required: true,
					// 	message: '请输入富文本',
					// 	trigger: 'change',
					// }],
					// time: [{
					// 	required: true,
					// 	message: '请选择时间',
					// 	trigger: 'change',
					// }],
					// date: [{
					// 	required: true,
					// 	message: '请选择日期',
					// 	trigger: 'change',
					// 	type: 'number'
					// }],
				},
				checkboxList: [{
						fullName: '荔枝',
						id: '1',
						checked: false
					},
					{
						fullName: '香蕉',
						id: '2',
						checked: false
					},
					{
						fullName: '橙子',
						id: '3',
						checked: false
					},
					{
						fullName: '草莓',
						id: '4',
						checked: false
					},
					{
						fullName: '西瓜',
						id: '5',
						checked: false
					}
				],
				cascaderList: [{
						id: 1,
						fullName: '中国',
						children: [{
								id: 2,
								fullName: '广东',
								children: [{
										id: 3,
										fullName: '深圳'
									},
									{
										id: 4,
										fullName: '广州'
									}
								]
							},
							{
								id: 5,
								fullName: '广西',
								children: [{
										id: 6,
										fullName: '南宁'
									},
									{
										id: 7,
										fullName: '桂林'
									}
								]
							}
						]
					},
					{
						id: 8,
						fullName: '美国',
						children: [{
							id: 9,
							fullName: '纽约',
							children: [{
								id: 10,
								fullName: '皇后街区'
							}]
						}]
					}
				],
				radioList: [{
						fullName: '支付宝',
						id: '1'
					},
					{
						fullName: '微信',
						id: '2'
					},
					{
						fullName: '银联',
						id: '4'
					},
					{
						fullName: '现金',
						id: '5'
					}
				],
				treeData: []
			};
		},
		onLoad() {
			this.initData()
		},
		computed: {},
		onReady() {
			this.$refs.dataForm.setRules(this.rules);
			// this.$u.toast('测试');
		},
		methods: {
			initData() {
				getUserSelector().then(res => {
					this.treeData = res.data.list
				})
			},
			submit() {
				this.$refs.dataForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
			},
			addItem() {
				let item = {
					comInput: ''
				}
				this.dataForm.table.push(item)
			},
			delItem(i) {
				uni.showModal({
					title:'提示',
					content:'确定删除设计子表('+i+')?',
					success:(res) =>{
						if(res.confirm){
							this.dataForm.table.splice(i, 1)
						}
					}
				})
			}
		}
	};
</script>
