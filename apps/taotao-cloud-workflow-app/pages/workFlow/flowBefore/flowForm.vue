<template>
	<view class="flowBefore-v">
		<view class="flowBefore-box" v-if="config.opType ==='-1'">
			<view class="scroll-v" scroll-y>
				<childForm ref="child" :config="config" @eventReceiver="eventReceiver" />
				<candidate-form v-model="selectShow" :candidateList="candidateList" :taskId="config.taskId"
					:formData="formData" @submitCandidate="submitCandidate" ref="candidateForm" />
			</view>
		</view>
		<view class="flowBefore-box" v-else>
			<view class="u-border-bottom">
				<u-sticky>
					<u-tabs :list="tabBars" :is-scroll="true" :current="tabIndex" @change="tabChange" height="100">
					</u-tabs>
				</u-sticky>
			</view>
			<block>
				<view v-show="tabsName === '表单信息'">
					<view>
						<view class="flowStatus" v-if="config.opType==0 || config.opType==4">
							<image :src="flowStatus" mode="widthFix"></image>
						</view>
						<childForm ref="child" :config="config" @eventReceiver="eventReceiver" @setBtnLoad="setBtnLoad" />
						<candidate-form v-model="selectShow" :candidateList="candidateList" :taskId="config.taskId"
							:formData="formData" @submitCandidate="submitCandidate" ref="candidateForm" />
					</view>
				</view>
				<view class="nodeList-v" v-if="tabsName === '流程信息'">
					<steps :options="flowTaskNodeList" />
				</view>
				<view class="record-v" v-if="tabsName === '流转记录'">
					<records :options="recordList" :endTime="endTime" />
				</view>
				<view class="record2-v" v-if="tabsName === '审批汇总'">
					<RecordSummary :processId='processId' ref="recordSummary" :summaryType="summaryType">
					</RecordSummary>
				</view>
				<view v-if="tabsName === '流程评论'">
					<view class="record-v">
						<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback"
							:sticky="false" :down="downOption" :up="upOption" :bottombar="false">
							<view class="discuss_box">
								<scroll-view scroll-y="true" style="height: 100%;">
									<view class="u-flex-col discuss_list" v-for="(item,index) in commentList"
										:key="index">
										<view class="u-flex discuss_txt">
											<view class="discuss_txt_left u-flex">
												<u-avatar :src="baseURL+item.creatorUserHeadIcon"></u-avatar>
												<text class="uName">{{item.creatorUserName}}</text>
											</view>
											<text v-if="item.isDel" class="del"
												@click="delComment(item.id,index)">删除</text>
										</view>
										<view class="u-flex-col discuss_content">
											<text class="txt">{{item.text}}</text>
											<view class="u-flex img_box" v-if="item.image.length">
												<workflow-upload v-model="item.image" :disabled="true" />
											</view>
											<workflow-file v-model="item.file" :show="false" :disabled='true'
												v-if="item.file.length" />
										</view>
									</view>
								</scroll-view>
							</view>
						</mescroll-body>
					</view>
				</view>
			</block>
		</view>
		<userSelect v-model="userSelectShow" @confirm="selectConfirm"></userSelect>
	</view>
</template>

<script>
	import {
		Create,
		Update,
		DynamicCreate,
		DynamicUpdate
	} from '@/api/workFlow/workFlowForm'
	import {
		FlowBeforeInfo,
		Audit,
		Reject,
		Transfer,
		Recall,
		Cancel,
		SaveAudit,
		Candidates
	} from '@/api/workFlow/flowBefore'
	import {
		Revoke,
		Press
	} from '@/api/workFlow/flowLaunch'
	import {
		getCommentList,
		createComment,
		delComment,
		FlowEngineInfo
	} from '@/api/workFlow/flowEngine'
	import resources from '@/libs/resources.js'
	import userSelect from '@/components/workflow/workflow-user-select/user-tree.vue'
	import childForm from './form.vue'
	import steps from '../components/steps.vue'
	import records from '../components/records.vue'
	import CandidateForm from '../components/CandidateForm'
	import RecordSummary from '../components/RecordSummary'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		components: {
			CandidateForm,
			userSelect,
			childForm,
			steps,
			records,
			RecordSummary
		},
		data() {
			return {
				downOption: {
					use: true,
					auto: true
				},
				upOption: {
					page: {
						num: 0,
						size: 20,
						time: null
					},
					empty: {
						use: true,
						icon: resources.message.nodata,
						tip: "暂无数据",
						fixed: true,
						top: "300rpx",
					},
					textNoMore: '没有更多数据',
				},
				isComment: false,
				show: false,
				config: {
					opType: '-1'
				},
				currentView: '',
				formData: {},
				flowTaskInfo: {},
				flowTaskNodeList: [],
				recordList: [],
				properties: {},
				endTime: 0,
				tabIndex: 0,
				tabBars: [{
						name: '表单信息',
						id: 0
					},
					{
						name: '流程信息',
						id: 1
					},
					{
						name: '流转记录',
						id: 2
					}

				],
				flowStatus: '',
				stepIndex: 0,
				userSelectShow: false,
				userOptions: [],
				btnLoading: false,
				eventType: '',
				commentList: [],
				processId: "",
				selectShow: false,
				candidateList: [],
				isSummary: false,
				summaryType: 0,
				tabsName: '表单信息'
			};
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			}
		},
		watch: {
			isSummary(val) {
				if (val) return this.tabBars.push({
					name: '审批汇总',
					id: 3
				})
			},
			isComment(val) {
				if (val) return this.tabBars.push({
					name: '流程评论',
					id: 4
				})
			},

		},
		methods: {
			upCallback(page) {
				let query = {
					currentPage: page.num,
					pageSize: page.size,
					sort: 'desc',
					sidx: '',
					taskId: this.processId
				}

				getCommentList(query, {
					load: page.num == 1
				}).then(res => {
					this.mescroll.endSuccess(res.data.list.length);
					if (page.num == 1) this.commentList = [];
					const list = res.data.list.map((o) => {
						o.image = JSON.parse(o.image)
						o.file = JSON.parse(o.file)
						return o
					})
					this.commentList = this.commentList.concat(list);
				}).catch(() => {
					this.mescroll.endErr();
				})

			},
			tabChange(index) {
				this.tabIndex = index;
				this.tabsName = this.tabBars[index].name;
				// if (this.tabsName === '流程评论') this.mescroll.resetUpScroll();
			},
			jumpComment() {
				uni.navigateTo({
					url: '/pages/workFlow/comment/index'
				})
			},
			addComment(query) {
				query.taskId = this.processId
				createComment(query).then(res => {
					this.mescroll.resetUpScroll()
				})
			},
			delComment(id, i) {
				uni.showModal({
					title: '提示',
					content: '确定删除?',
					success: (res) => {
						if (res.confirm) {
							delComment(id).then(res => {
								this.commentList.splice(i, 1)
								this.mescroll.resetUpScroll()
							})
						}
					}
				})
			},
			init(data) {
				this.tabIndex = 0
				this.config = data
				this.config.origin = 'scan'
				this.taskId = this.config.id
				/**
				 * opType
				 * -1 - 我发起的新建/编辑 
				 * 0 - 我发起的详情
				 * 1 - 待办事宜
				 * 2 - 已办事宜
				 * 3 - 抄送事宜
				 */
				if (this.config.opType == '-1') {
					this.getEngineInfo(this.config)
				} else {
					this.getBeforeInfo(this.config)
				}
			},
			getEngineInfo(data) {
				FlowEngineInfo(data.flowId).then(res => {
					data.type = res.data.type
					data.formConf = res.data.formData
					uni.setNavigationBarTitle({
						title: res.data.fullName
					})
					const flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) :
						null
					this.flowTemplateJson = flowTemplateJson
					data.formOperates = [];
					this.properties = this.flowTemplateJson && this.flowTemplateJson.properties || {}
					if (flowTemplateJson && flowTemplateJson.properties && flowTemplateJson.properties
						.formOperates) {
						data.formOperates = flowTemplateJson.properties.formOperates || []
					}
					setTimeout(() => {
						this.$nextTick(() => {
							if (!this.$refs.child || !this.$refs.child.$refs.form || !this.$refs
								.child.$refs.form.init) {
								uni.showToast({
									title: '暂无此流程表单',
									icon: 'none',
									complete: () => {
										setTimeout(() => {
											uni.navigateBack()
										}, 1500)
									}
								})
								return
							}
							this.$refs.child.$refs.form.init(data)
						})
					}, 100)
				})
			},
			getBeforeInfo(data) {
				this.formData.flowId = data.flowId;
				FlowBeforeInfo(data.id, {
					taskNodeId: data.taskNodeId,
					taskOperatorId: data.taskId
				}).then(res => {
					this.flowTaskInfo = res.data.flowTaskInfo
					uni.setNavigationBarTitle({
						title: this.flowTaskInfo.fullName
					})
					this.flowTaskNodeList = res.data.flowTaskNodeList
					const recordList = res.data.flowTaskOperatorRecordList || []
					this.recordList = recordList.reverse()
					this.properties = res.data.approversProperties || {}
					this.endTime = this.flowTaskInfo.completion == 100 ? this.flowTaskInfo.endTime : 0
					data.type = this.flowTaskInfo.type
					data.draftData = res.data.draftData || null
					const flowTemplateJson = this.flowTaskInfo.flowTemplateJson ? JSON.parse(this.flowTaskInfo
						.flowTemplateJson) : null
					this.flowTemplateJson = flowTemplateJson
					this.isComment = this.flowTemplateJson.properties.isComment
					this.isSummary = this.flowTemplateJson.properties.isSummary
					this.summaryType = this.flowTemplateJson.properties.summaryType
					this.endTime = this.flowTaskInfo.completion == 100 ? this.flowTaskInfo.endTime : 0
					data.formConf = res.data.flowFormInfo
					if (data.opType != 1) data.readonly = true
					if (data.opType == 0 && data.status == 3) data.readonly = false
					data.formOperates = []
					if (data.opType == 0) {
						this.properties = this.flowTemplateJson && this.flowTemplateJson.properties || {}
						if (flowTemplateJson && flowTemplateJson.properties && flowTemplateJson.properties
							.formOperates) {
							data.formOperates = flowTemplateJson.properties.formOperates || []
						}
					} else {
						data.formOperates = res.data.formOperates || []
					}
					if (this.config.opType === 1) {
						this.$store.dispatch('base/getUserTree').then(res => {
							this.userOptions = res
						})
					}
					switch (this.config.status) {
						case 1: //等待审核
							this.flowStatus = resources.status.review
							break;
						case 2: //审核通过
							this.flowStatus = resources.status.reviewAdopt
							break;
						case 3: //审核驳回
							this.flowStatus = resources.status.reviewRefuse
							break;
						case 4: //流程撤回
							this.flowStatus = resources.status.reviewUndo
							break;
						case 5: //审核终止
							this.flowStatus = resources.status.reviewStop
							break;
						default: //等待审核
							this.flowStatus = resources.status.review
							break;
					}
					setTimeout(() => {
						this.$nextTick(() => {
							if (!this.$refs.child || !this.$refs.child.$refs.form || !this.$refs
								.child.$refs.form.init) {
								uni.showToast({
									title: '暂无此流程表单',
									icon: 'none',
									complete: () => {
										setTimeout(() => {
											uni.navigateBack()
										}, 1500)
									}
								})
								return
							}
							this.$refs.child.$refs.form.init(data)
						})
					}, 100)
				})
			},
			eventLauncher(eventType) {
				this.$refs.child && this.$refs.child.$refs.form && this.$refs.child
					.$refs.form.submit(eventType)
			},
			eventReceiver(formData, eventType) {
				this.formData = formData;
				this.eventType = eventType
				if (eventType === 'save' || eventType === 'submit') {
					return this.submitOrSave(eventType)
				}
				if (eventType === 'saveAudit') {
					return this.saveAudit()
				}
				if (eventType === 'audit') {
					return this.operate('audit', this.properties.auditBtnText)
				}
				if (eventType === 'reject') {
					return this.operate('reject', this.properties.rejectBtnText)
				}
			},
			/* 保存草稿 */
			saveAudit() {
				this.btnLoading = true
				let query = {
					formData: this.formData
				}
				SaveAudit(this.config.taskId, query).then(res => {
					uni.showToast({
						title: res.msg,
						complete: () => {
							setTimeout(() => {
								this.btnLoading = false
								uni.navigateBack()
							}, 1500)
						}
					});
				}).catch(() => {
					this.btnLoading = false
				})
			},
			// 候选人提交
			submitCandidate(data) {
				this.selectShow = false
				if (data) {
					this.handleRequest(data)
				} else {
					uni.showModal({
						title: '提示',
						content: '您确定要提交当前流程吗？',
						success: res => {
							this.handleRequest()
						}
					})
				}
			},
			submitOrSave(eventType) {
				this.formData.status = eventType === 'submit' ? 0 : 1
				if (eventType === 'save') return this.handleRequest()
				Candidates(0, {
					formData: this.formData
				}).then(res => {
					let data = res.data
					if (Array.isArray(data) && data.length) {
						this.candidateList = res.data
						this.selectShow = true
					} else {
						uni.showModal({
							title: '提示',
							content: '您确定要提交当前流程吗？',
							success: res => {
								if (res.confirm) {
									this.handleRequest()
								}
							}
						})
					}
				}).catch(() => {
					this.selectShow = false
				})
			},
			selectConfirm(e) {
				const ids = e.map(o => o.id)
				const id = ids.join()
				if (this.eventType === 'transfer') return this.handleTransfer(id)
			},
			handleRequest(candidateList) {
				if (candidateList) this.formData.candidateList = candidateList
				if (this.eventType === 'save') this.btnLoading = true
				let formMethod = null
				if (this.config.formType == 1) {
					formMethod = this.formData.id ? Update : Create
				} else {
					formMethod = this.formData.id ? DynamicUpdate : DynamicCreate
				}
				formMethod(this.config.enCode, this.formData).then(res => {
					uni.showToast({
						title: res.msg,
						complete: () => {
							setTimeout(() => {
								if (this.formData.id) uni.$emit('refresh')
								this.btnLoading = false
								uni.navigateBack()
							}, 1500)
						}
					})
				}).catch(() => {
					this.btnLoading = false
				})
			},
			handlePress() {
				uni.showModal({
					title: '提示',
					content: '此操作将提示该节点尽快处理',
					success: res => {
						if (res.confirm) {
							Press(this.config.id).then(res => {
								this.$u.toast(res.msg)
							})
						}
					}
				})
			},
			openUserBox(eventType) {
				this.userSelectShow = true
				this.eventType = eventType
			},
			operate(eventType, title) {
				let config = {
					eventType,
					title: '确认' + title.replace(/\s+/g, "")
				}
				if (eventType === 'audit' || eventType === 'reject') {
					config = {
						...config,
						hasSign: this.properties.hasSign,
						hasFreeApprover: this.properties.hasFreeApprover,
						isCustomCopy: this.properties.isCustomCopy,
						formData: this.formData,
						taskId: this.config.taskId,
						eventType: eventType
					}
				}
				uni.navigateTo({
					url: '/pages/workFlow/operate/index?config=' + encodeURIComponent(JSON.stringify(config))
				})
			},
			handleTransfer(freeApproverUserId) {
				Transfer(this.config.taskId, {
					freeApproverUserId
				}).then(res => {
					this.toastAndBack(res.msg, true)
				})
			},
			revokeHandle(data) {
				Revoke(this.config.id, {
					handleOpinion: data.handleOpinion
				}).then(res => {
					this.toastAndBack(res.msg, true)
				})
			},
			recallHandle(data) {
				Recall(this.config.taskId, {
					handleOpinion: data.handleOpinion
				}).then(res => {
					this.toastAndBack(res.msg, true)
				})
			},
			auditHandle(data) {
				this.handleApproval(data)
			},
			rejectHandle(data) {
				this.handleApproval(data)
			},
			handleApproval(data) {
				const query = {
					...data,
					formData: this.formData,
					enCode: this.config.enCode
				}
				const approvalMethod = data.eventType === 'audit' ? Audit : Reject
				approvalMethod(this.config.taskId, query).then(res => {
					this.toastAndBack(res.msg, true)
				})
			},
			setBtnLoad(val) {
				this.btnLoading = !!val
			},
			toastAndBack(title, refresh) {
				uni.showToast({
					title: title,
					complete: () => {
						setTimeout(() => {
							if (refresh) uni.$emit('refresh')
							uni.navigateBack()
						}, 1500)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
		height: 100%;
	}

	.flowBefore-v {
		display: flex;
		flex-direction: column;

		.flowBefore-box {
			height: 100%;
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			padding-bottom: 100rpx;

			.discuss_box {

				// border: 1px solid red;
				.discuss_list {
					margin-bottom: 40rpx;

					.discuss_txt {
						width: 100%;
						justify-content: space-between;

						.discuss_txt_left {
							.uName {
								margin-left: 20rpx;
							}
						}

						.del {
							color: red;
						}
					}

					.discuss_content {
						padding-left: 110rpx;

						.txt {
							color: #666666
						}

						.img_box {
							margin: 40rpx 0;
						}
					}
				}
			}
		}

		.swiper-box {
			height: 100vh;
		}

		.swiper-item {
			flex: 1;
			flex-direction: row;
		}

		.scroll-v {
			flex: 1;
			/* #ifndef MP-ALIPAY */
			flex-direction: column;
			/* #endif */
			width: 100%;
			height: 100%;
		}

		.flowStatus {
			position: absolute;
			top: 90rpx;
			right: 0;
			border: 0;
			margin: 20rpx;
			opacity: 0.7;
			z-index: 9;

			image {
				width: 200rpx;
			}
		}

		.discuss_btn {
			background-color: #fff;
			position: fixed;
			bottom: 0;
			display: flex;
			width: 100%;
			// height: 88rpx;
			// box-shadow: 0 -2rpx 8rpx #e1e5ec;
			z-index: 20;

			.custom-style {
				background-color: #2979ff;
				color: #FFFFFF;
				width: 100%;
				border-radius: 0 !important;

				&::after {
					border: none !important;
				}
			}

			.content {
				padding: 24rpx;
				text-align: center;

				.confrim-btn {
					display: flex;
					flex-direction: row;

					.send {
						flex: 1;
						background-color: #2979ff;
						color: #FFFFFF;
					}

					.cancel {
						flex: 1;
					}
				}
			}
		}
	}

	.nodeList-v,
	.record-v {
		padding: 32rpx 32rpx 10rpx;
		background-color: #fff;
	}

	.record2-v {
		padding: 0rpx 32rpx 10rpx;
		background-color: #fff;
	}
</style>
