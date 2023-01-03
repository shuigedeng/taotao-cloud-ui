<template>
	<view class="operate-v">
		<scroll-view class="operate-area" scroll-y>
			<view class="u-p-l-32 u-p-r-32 u-p-t-10"
				v-if="config.eventType === 'revoke' || config.eventType === 'recall'">
				<u-input v-model="dataForm.handleOpinion" type="textarea" placeholder="请输入撤回原因" height="500" />
			</view>
			<view class="workflow-wrap">
				<u-form :model="dataForm" label-position="left" label-width="150" class="workflow-form"
					v-if="config.eventType === 'audit' || config.eventType === 'reject'">
					<u-form-item prop="comInput" label-width="250" v-for="(item,index) in this.dataForm.candidateList"
						:key="index" :label="item.label">
						<u-input type="select" :select-open="item.selectShow" v-model="item.value"
							@click="openSelect(item)" placeholder="请选择审批候选人">
						</u-input>
					</u-form-item>
					<u-form-item label="加签人员" prop="freeApproverUserId"
						v-if="config.eventType === 'audit' && config.hasFreeApprover">
						<workflow-user-select v-model="dataForm.freeApproverUserId" />
					</u-form-item>
					<u-form-item label="审批意见" prop="handleOpinion">
						<u-input v-model="dataForm.handleOpinion" type="textarea" placeholder="请输入审批意见" />
					</u-form-item>
					<u-form-item label="抄送人员" prop="copyIds" v-if="config.isCustomCopy">
						<workflow-user-select v-model="dataForm.copyIds" multiple />
					</u-form-item>
					<u-form-item label="审批签名" prop="signImg" v-if="config.hasSign">
						<Signature ref="sig" v-model="dataForm.signImg"></Signature>
					</u-form-item>
				</u-form>
			</view>
		</scroll-view>
		<view class="flowBefore-actions">
			<u-button class="buttom-btn" type="primary" @click="handleClick">{{config.title}}</u-button>
		</view>
	</view>
</template>

<script>
	import Signature from '../components/sin-signature/sin-signature.vue'
	import CandidateForm from '../components/CandidateForm'
	import {
		Candidates
	} from '@/api/workFlow/flowBefore'
	export default {
		components: {
			Signature,
			CandidateForm
		},
		data() {
			return {
				config: {},
				dataForm: {
					handleOpinion: '',
					signImg: '',
					copyIds: '',
					freeApproverUserId: '',
					candidateList: []
				},
				selectList: [],
				selectId: {},
				selectVal: {},
				isCandidate: false
			};
		},
		onLoad(option) {
			this.config = JSON.parse(decodeURIComponent(option.config))
			uni.setNavigationBarTitle({
				title: this.config.title
			});
			if (!!this.config.formData) this.config.formData.flowId = this.config.flowId
			if (this.config.eventType === 'audit') this.getCandidates(this.config.formData)
			uni.$on('confirm', (data, id) => {
				this.selectConfirm(data, id)
			})
		},
		onUnload() {
			uni.$off('confirm')
		},
		methods: {
			getCandidates(formData) {
				Candidates(this.config.taskId, {
					formData
				}).then(res => {
					let data = res.data
					if (Array.isArray(data) && data.length) {
						this.isCandidate = true
						this.dataForm.candidateList = JSON.parse(JSON.stringify(res.data))
						this.dataForm.candidateList = this.dataForm.candidateList.map(o => ({
							...o,
							label: o.nodeName + '审批人',
							value: ''
						}))
					}
				}).catch(() => {
					this.selectShow = false
				})
			},

			//选择审批候选人
			openSelect(item) {
				this.selectList = []
				for (let o in this.selectVal) {
					if (o === item.nodeId) this.selectList = this.selectVal[o]
				}
				item.formData = this.config.formData
				item.taskId = this.config.taskId
				item.selectList = this.selectList
				uni.navigateTo({
					url: '/pages/workFlow/candiDateUserSelect/index?data=' + encodeURIComponent(JSON.stringify(
						item))
				})
			},

			selectConfirm(e, id) {
				let selectData = e;
				let selectVal = [];
				let val = [];
				let selectId = [];
				let nodeId = '';
				if (!selectData.length) {
					delete this.selectVal[id]
					delete this.selectId[id]
					for (let i = 0; i < this.dataForm.candidateList.length; i++) {
						if (id === this.dataForm.candidateList[i].nodeId) {
							this.dataForm.candidateList[i].value = ""
						}
					}
				}
				for (let i = 0; i < this.dataForm.candidateList.length; i++) {
					for (let o = 0; o < selectData.length; o++) {
						if (selectData[o].nodeId === this.dataForm.candidateList[i].nodeId) {
							nodeId = selectData[o].nodeId
							val.push(selectData[o].userName)
							selectVal.push(selectData[o])
							this.dataForm.candidateList[i].value = val.join(',')
							selectId.push(selectData[o].userId)
							this.$set(this.selectId, selectData[o].nodeId, selectId)
						}
					}
				}
				this.$set(this.selectVal, nodeId, selectVal)
			},
			handleClick() {
				if (!this.isCandidate) delete this.dataForm['candidateList']
				if (this.config.hasSign && !this.dataForm.signImg) {
					uni.showToast({
						title: '请签名',
						icon: 'none'
					})
					return
				}
				this.dataForm.copyIds = !!this.dataForm.copyIds ? this.dataForm.copyIds.join() : ''
				const query = {
					...this.dataForm,
					eventType: this.config.eventType
				}
				if (this.isCandidate) {
					query.candidateList = this.selectId
					for (let rules of this.dataForm.candidateList) {
						if (!rules.value) return this.$u.toast(
							`${rules.nodeName}不能为空`
						)
					}
				}
				uni.$emit('operate', query);
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.operate-v {
		height: 100%;
		display: flex;
		flex-direction: column;

		.operate-area {
			flex: 1;
		}
	}
</style>
