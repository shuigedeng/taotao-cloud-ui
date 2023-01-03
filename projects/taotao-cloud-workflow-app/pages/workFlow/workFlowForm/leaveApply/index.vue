<template>
	<view class="workflow-wrap workflow-wrap-workflow">
		<u-form :model="dataForm" :rules="rules" ref="dataForm" :errorType="['toast']" label-position="left"
			label-width="150" label-align="left">
			<u-form-item label="流程标题" prop="flowTitle" :required="requiredList.flowTitle" v-if="judgeShow('flowTitle')">
				<u-input v-model="dataForm.flowTitle" placeholder="流程标题" :disabled="judgeWrite('flowTitle')"></u-input>
			</u-form-item>
			<u-form-item label="流程编码" prop="billNo" v-if="judgeShow('billNo')" :required="requiredList.billNo">
				<u-input v-model="dataForm.billNo" placeholder="流程编码" disabled></u-input>
			</u-form-item>
			<u-form-item label="紧急程度" prop="flowUrgent" v-if="judgeShow('flowUrgent')" :required="requiredList.flowUrgent">
				<workflow-select v-model="dataForm.flowUrgent" placeholder="请选择紧急程度" :options="flowUrgentOptions"
					:disabled="judgeWrite('flowUrgent')">
				</workflow-select>
			</u-form-item>

			<view class="workflow-card">
				<u-form-item label="申请人员" prop="applyUser" v-if="judgeShow('applyUser')" :required="requiredList.applyUser">
					<u-input v-model="dataForm.applyUser" placeholder="请输入申请人员" :disabled="judgeWrite('applyUser')">
					</u-input>
				</u-form-item>
				<u-form-item label="申请部门" prop="applyDept" v-if="judgeShow('applyDept')" :required="requiredList.applyDept">
					<u-input v-model="dataForm.applyDept" placeholder="请输入申请部门" :disabled="judgeWrite('applyDept')">
					</u-input>
				</u-form-item>
				<u-form-item label="申请职位" prop="applyPost" v-if="judgeShow('applyPost')" :required="requiredList.applyPost">
					<u-input v-model="dataForm.applyPost" placeholder="请输入申请职位" :disabled="judgeWrite('applyPost')">
					</u-input>
				</u-form-item>
				<u-form-item label="申请日期" prop="applyDate" v-if="judgeShow('applyDate')" :required="requiredList.applyDate">
					<workflow-date-time type="date" v-model="dataForm.applyDate" placeholder="请输入申请日期"
						:disabled="judgeWrite('applyDate')"></workflow-date-time>
				</u-form-item>
				<u-form-item label="请假类别" prop="leaveType" v-if="judgeShow('leaveType')" :required="requiredList.leaveType">
					<workflow-select v-model="dataForm.leaveType" placeholder="请选择下拉框组" :options="leaveTypeList"
						:disabled="judgeWrite('leaveType')"></workflow-select>
				</u-form-item>
				<u-form-item label="请假原因" prop="leaveReason" v-if="judgeShow('leaveReason')" :required="requiredList.leaveReason">
					<u-input v-model="dataForm.leaveReason" placeholder="请输入请假原因" type="textarea"
						:disabled="judgeWrite('leaveReason')"></u-input>
				</u-form-item>
				<u-form-item label="起始时间" prop="leaveStartTime" v-if="judgeShow('leaveStartTime')" :required="requiredList.leaveStartTime">
					<workflow-date-time type="datetime" v-model="dataForm.leaveStartTime" placeholder="请输入起始时间"
						:disabled="judgeWrite('leaveStartTime')"></workflow-date-time>
				</u-form-item>
				<u-form-item label="结束时间" prop="leaveEndTime" v-if="judgeShow('leaveEndTime')" :required="requiredList.leaveEndTime">
					<workflow-date-time type="datetime" v-model="dataForm.leaveEndTime" placeholder="请输入结束时间"
						:disabled="judgeWrite('leaveEndTime')"></workflow-date-time>
				</u-form-item>

				<u-form-item label="请假天数" prop="leaveDayCount" v-if="judgeShow('leaveDayCount')" :required="requiredList.leaveDayCount">
					<u-input v-model="dataForm.leaveDayCount" placeholder="请输入请假天数"
						:disabled="judgeWrite('leaveDayCount')"></u-input>
				</u-form-item>
				<u-form-item label="请假小时" prop="leaveHour" v-if="judgeShow('leaveHour')" :required="requiredList.leaveHour">
					<u-input v-model="dataForm.leaveHour" placeholder="请输入请假小时" type="number"
						:disabled="judgeWrite('leaveHour')"></u-input>
				</u-form-item>
				<u-form-item label="相关附件" prop="fileJson" v-if="judgeShow('fileJson')" :required="requiredList.fileJson">
					<workflow-file v-model="fileList" :disabled="judgeWrite('fileJson')"/>
				</u-form-item>

			</view>
		</u-form>
	</view>
</template>

<script>
	import comMixin from '../mixin'
	export default {
		name: 'LeaveApply',
		mixins: [comMixin],
		data() {
			return {
				billEnCode: 'WF_LeaveApplyNo',
				dataForm: {
					flowTitle: '',
					billNo: '',
					flowUrgent: 1,
					applyUser: '',
					leaveHour: '',
					applyDept: '',
					leaveStartTime: '',
					leaveEndTime: '',
					leaveDayCount: '',
					leaveReason: '',
					applyDate: '',
					leaveType: '',
					fileJson: '',
					applyPost: ''
				},
				rules: {
					flowTitle: [{
						required: true,
						message: '流程标题不能为空',
						trigger: 'blur'
					}],
					flowUrgent: [{
						required: true,
						message: '紧急程度不能为空',
						trigger: 'change',
						type: 'number'
					}],
					billNo: [{
						required: true,
						message: '流程编码不能为空',
						trigger: 'blur',
					}],
					leaveHour: [{
						required: true,
						message: '请假小时不能为空',
						trigger: 'blur',
					}],
					leaveStartTime: [{
						required: true,
						message: '起始时间不能为空',
						trigger: 'blur',
						type: 'number'
					}],
					leaveDayCount: [{
						required: true,
						message: '请假天数不能为空',
						trigger: 'blur',
					}],
					leaveEndTime: [{
						required: true,
						message: '结束时间不能为空',
						trigger: 'blur',
						type: 'number'
					}],
					leaveType: [{
						required: true,
						message: '请假原因不能为空',
						trigger: 'blur',

					}],
				},
				leaveTypeList: [{
						fullName: '事假',
						id: '事假',
						checked: false
					},
					{
						fullName: '病假',
						id: '病假',
						checked: false
					},
					{
						fullName: '婚假',
						id: '婚假',
						checked: false
					},
					{
						fullName: '产假',
						id: '产假',
						checked: false
					},
					{
						fullName: '丧假',
						id: '丧假',
						checked: false
					},
					{
						fullName: '年假',
						id: '年假',
						checked: false
					},
					{
						fullName: '调休',
						id: '调休',
						checked: false
					},
					{
						fullName: '其他',
						id: '其他',
						checked: false
					},

				],
			}
		},
		methods: {
			selfInit(data) {
				this.dataForm.applyDate = new Date().getTime()
				this.dataForm.flowTitle = this.userInfo.userName + "的请假申请表"
				this.dataForm.applyUser = this.userInfo.userName + '/' + this.userInfo.userAccount
				this.dataForm.applyDept = this.userInfo.organizeName
				if (this.userInfo.positionIds && this.userInfo.positionIds.length) {
					let list = this.userInfo.positionIds.map(o => o.name)
					this.dataForm.applyPost = list.join(',')
				}
			},

		}
	}
</script>

<style>

</style>
