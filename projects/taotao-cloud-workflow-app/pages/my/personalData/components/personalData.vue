<template>
	<view class="workflow-wrap personalData">
		<u-form :model="dataForm" :errorType="['toast']" label-position="left" label-width="150" label-align="left"
			ref="dataForm">
			<u-form-item label="姓名" prop='realName' required>
				<u-input v-model="dataForm.realName" placeholder="请输入我的姓名"></u-input>
			</u-form-item>
			<u-form-item label="民族">
				<workflow-select v-model="dataForm.nation" placeholder="请选择我的民族" :options='nationOptions'>
				</workflow-select>
			</u-form-item>
			<u-form-item label="性别">
				<workflow-select v-model="dataForm.gender" placeholder="请选择我的性别" :options='genderOptions' :props='props'>
				</workflow-select>
			</u-form-item>
			<u-form-item label="籍贯">
				<u-input v-model="dataForm.nativePlace" placeholder="请输入我的籍贯"></u-input>
			</u-form-item>
			<u-form-item label="证件类型">
				<workflow-select v-model="dataForm.certificatesType" placeholder="请选择证件类型"
					:options='certificatesTypeOptions'>
				</workflow-select>
			</u-form-item>
			<u-form-item label="证件号码">
				<u-input v-model="dataForm.certificatesNumber" placeholder="请输入证件号码">
				</u-input>
			</u-form-item>
			<u-form-item label="文化程度">
				<workflow-select v-model="dataForm.education" placeholder="请选择文化程度" :options='educationOptions'>
				</workflow-select>
			</u-form-item>
			<u-form-item label="出生年月">
				<workflow-date-time type="date" v-model="dataForm.birthday" placeholder="请选择出生年月">
				</workflow-date-time>
			</u-form-item>
			<u-form-item label="办公电话">
				<u-input v-model="dataForm.telePhone" placeholder="请输入办公电话">
				</u-input>
			</u-form-item>
			<u-form-item label="办公座机">
				<u-input v-model="dataForm.landline" placeholder="请输入办公座机">
				</u-input>
			</u-form-item>
			<u-form-item label="手机号码">
				<u-input v-model="dataForm.mobilePhone" placeholder="请输入手机号码">
				</u-input>
			</u-form-item>
			<u-form-item label="电子邮箱">
				<u-input v-model="dataForm.email" placeholder="请输入电子邮箱">
				</u-input>
			</u-form-item>
			<u-form-item label="紧急联系">
				<u-input v-model="dataForm.urgentContacts" placeholder="请输入紧急联系">
				</u-input>
			</u-form-item>
			<u-form-item label="紧急电话">
				<u-input v-model="dataForm.urgentTelePhone" placeholder="请输入紧急电话">
				</u-input>
			</u-form-item>
			<u-form-item label="通讯地址">
				<u-input v-model="dataForm.postalAddress" placeholder="请输入通讯地址">
				</u-input>
			</u-form-item>
			<u-form-item label="自我介绍">
				<u-input v-model="dataForm.signature" placeholder="请输入自我介绍" type="textarea" />
			</u-form-item>
		</u-form>
		<view class="flowBefore-actions">
			<template>
				<u-button class="buttom-btn" type="primary" @click='submit'>保存</u-button>
			</template>
		</view>
	</view>
</template>

<script>
	import {
		UpdateUser
	} from '@/api/common'
	export default {
		data() {
			const data = {
				show: false,
				avatar: 'https://cdn.uviewui.com/uview/common/logo.png',
				props: {
					label: 'fullName',
					value: 'enCode'
				},
				dataForm: {
					birthday: null,
					certificatesNumber: "",
					certificatesType: "",
					education: "",
					email: "",
					gender: "",
					landline: "",
					mobilePhone: "",
					nation: "",
					nativePlace: "",
					postalAddress: "",
					realName: "",
					signature: null,
					telePhone: "",
					urgentContacts: "",
					urgentTelePhone: "",
					id: null
				},
				nationOptions: [],
				genderOptions: [],
				certificatesTypeOptions: [],
				educationOptions: [],
				rules: {
					realName: [{
						required: true,
						message: '请输入姓名',
						trigger: ['change', 'blur'],
					}]
				}
			}
			this.getOptions()
			return data
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			},
		},
		mounted() {
			this.$refs.dataForm.setRules(this.rules);
		},
		methods: {
			init(data) {
				let initData = JSON.parse(JSON.stringify(data))
				for (let key in initData) {
					for (let k in this.dataForm) {
						if (key === k) {
							this.dataForm[key] = initData[key]
						}
					}
				}
			},
			getOptions() {
				this.$store.dispatch('base/getDictionaryData', {
					sort: 'Education'
				}).then((res) => {
					this.educationOptions = JSON.parse(JSON.stringify(res))
					this.educationOptions.map((o) => {
						if (o.id === this.dataForm.education) {
							this.dataForm.education = o.id
						}
					})
					this.$store.dispatch('base/getDictionaryData', {
						sort: 'certificateType'
					}).then((res) => {
						this.certificatesTypeOptions = JSON.parse(JSON.stringify(res))
						this.certificatesTypeOptions.map((o) => {
							if (o.id === this.dataForm.certificatesType) {
								this.dataForm.certificatesType = o.id
							}
						})
					})
					this.$store.dispatch('base/getDictionaryData', {
						sort: 'sex'
					}).then(res => {
						this.genderOptions = JSON.parse(JSON.stringify(res))
						this.genderOptions.map((o) => {
							if (o.enCode === this.dataForm.gender) {
								this.dataForm.gender = o.enCode
							}
						})
					})
					this.$store.dispatch('base/getDictionaryData', {
						sort: 'Nation'
					}).then(res => {
						this.nationOptions = JSON.parse(JSON.stringify(res))
						this.nationOptions.map((o) => {
							if (o.id === this.dataForm.nation) {
								this.dataForm.nation = o.id
							}
						})
					})
				})
				this.show = true
			},
			submit() {
				this.$refs.dataForm.validate(valid => {
					if (valid) {
						UpdateUser(this.dataForm).then(res => {
							uni.showToast({
								title: '保存成功',
								duration: 800,
								icon: 'none'
							});
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.u-form {
		padding: 0;
	}

	.slot-btn {
		width: 329rpx;
		height: 140rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgb(244, 245, 246);
		border-radius: 10rpx;
	}

	.slot-btn__hover {
		background-color: rgb(235, 236, 238);
	}

	// .personalData {
	// 	padding-bottom: 110rpx;
	// 	z-index: 9;
	// }
</style>
