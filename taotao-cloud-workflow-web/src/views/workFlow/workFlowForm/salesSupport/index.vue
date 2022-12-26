<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>销售支持表</h1>
      <span class="number">流程编码：{{dataForm.billNo}}</span>
    </div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px"
      :disabled="setting.readonly">
      <el-row>
        <el-col :span="12" v-if="judgeShow('flowTitle')">
          <el-form-item label="流程标题" prop="flowTitle">
            <el-input v-model="dataForm.flowTitle" placeholder="流程标题"
              :disabled="judgeWrite('flowTitle')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('flowUrgent')">
          <el-form-item label="紧急程度" prop="flowUrgent">
            <el-select v-model="dataForm.flowUrgent" placeholder="选择紧急程度"
              :disabled="judgeWrite('flowUrgent')">
              <el-option :key="item.value" :label="item.label" :value="item.value"
                v-for="item in flowUrgentOptions" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('applyUser')">
          <el-form-item label="申请人员" prop="applyUser">
            <el-input v-model="dataForm.applyUser" placeholder="申请人员" readonly
              :disabled="judgeWrite('applyUser')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('flowTitle')">
          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker v-model="dataForm.applyDate" type="date" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd" :editable="false" readonly
              :disabled="judgeWrite('flowTitle')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('applyDept')">
          <el-form-item label="申请部门" prop="applyDept">
            <el-input v-model="dataForm.applyDept" placeholder="申请部门" readonly
              :disabled="judgeWrite('applyDept')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('customer')">
          <el-form-item label="相关客户" prop="customer">
            <el-input v-model="dataForm.customer" placeholder="相关客户"
              :disabled="judgeWrite('customer')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('project')">
          <el-form-item label="相关项目" prop="project">
            <el-input v-model="dataForm.project" placeholder="相关项目"
              :disabled="judgeWrite('project')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('psaleSupInfo')">
          <el-form-item label="售前支持" prop="psaleSupInfo">
            <el-input v-model="dataForm.psaleSupInfo" placeholder="售前支持"
              :disabled="judgeWrite('psaleSupInfo')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('startDate')">
          <el-form-item label="开始时间" prop="startDate">
            <el-date-picker v-model="dataForm.startDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('startDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('endDate')">
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker v-model="dataForm.endDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('endDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('psaleSupDays')">
          <el-form-item label="支持天数" prop="psaleSupDays">
            <el-input v-model="dataForm.psaleSupDays" placeholder="支持天数" type="number"
              :disabled="judgeWrite('psaleSupDays')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('psalePreDays')">
          <el-form-item label="准备天数" prop="psalePreDays">
            <el-input v-model="dataForm.psalePreDays" placeholder="准备天数" type="number"
              :disabled="judgeWrite('psalePreDays')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('consulManager')">
          <el-form-item label="机构咨询" prop="consulManager">
            <el-input v-model="dataForm.consulManager" placeholder="机构咨询"
              :disabled="judgeWrite('consulManager')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('psalSupConsul')">
          <el-form-item label="售前顾问" prop="psalSupConsul">
            <el-input v-model="dataForm.psalSupConsul" placeholder="售前顾问"
              :disabled="judgeWrite('psalSupConsul')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('fileJson')">
          <el-form-item label="相关附件" prop="fileJson">
            <JNPF-UploadFz v-model="fileList" type="workFlow" :disabled="judgeWrite('fileJson')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('salSupConclu')">
          <el-form-item label="销售总结" prop="salSupConclu">
            <el-input v-model="dataForm.salSupConclu" placeholder="销售总结" type="textarea" :rows="3"
              :disabled="judgeWrite('salSupConclu')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('consultResult')">
          <el-form-item label="交付说明" prop="consultResult">
            <el-input v-model="dataForm.consultResult" placeholder="交付说明" type="textarea" :rows="3"
              :disabled="judgeWrite('consultResult')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('ievaluation')">
          <el-form-item label="咨询评价" prop="ievaluation">
            <el-input v-model="dataForm.ievaluation" placeholder="咨询评价" type="textarea" :rows="3"
              :disabled="judgeWrite('ievaluation')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('conclusion')">
          <el-form-item label="发起人总结" prop="conclusion">
            <el-input v-model="dataForm.conclusion" placeholder="发起人总结" type="textarea" :rows="3"
              :disabled="judgeWrite('conclusion')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import comMixin from '../mixin';
export default {
  mixins: [comMixin],
  name: 'SalesSupport',
  data() {
    var checkStartTime = (rule, value, callback) => {
      if (!this.dataForm.endDate) {
        callback()
      } else {
        if (this.dataForm.endDate < value) {
          callback(new Error('开始日期应该小于结束日期'));
        } else {
          this.$refs.dataForm.validateField('endTime');
          callback()
        }
      }
    }
    var checkEndTime = (rule, value, callback) => {
      if (!this.dataForm.startDate) {
        callback()
      } else {
        if (this.dataForm.startDate > value) {
          callback(new Error('结束日期应该大于开始日期'));
        } else {
          callback()
        }
      }
    }
    return {
      billEnCode: 'WF_SalesSupportNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        applyUser: '',
        applyDate: '',
        applyDept: '',
        customer: '',
        project: '',
        salSupConclu: '',
        startDate: '',
        endDate: '',
        psalePreDays: '',
        psaleSupInfo: '',
        fileJson: '',
        consulManager: '',
        psalSupConsul: '',
        consultResult: '',
        ievaluation: '',
        conclusion: '',
        psaleSupDays: ''
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        customer: [
          { required: true, message: '相关客户不能为空', trigger: 'blur' },
        ],
        project: [
          { required: true, message: '相关项目不能为空', trigger: 'blur' },
        ],
        startDate: [
          { required: true, message: '开始时间不能为空', trigger: 'change' },
          { validator: checkStartTime, trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '结束时间不能为空', trigger: 'change' },
          { validator: checkEndTime, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.applyDate = new Date().getTime()
      this.dataForm.flowTitle = this.userInfo.userName + "的销售支持表"
      this.dataForm.applyUser = this.userInfo.userName + '/' + this.userInfo.userAccount
      this.dataForm.applyDept = this.userInfo.organizeName
    }
  }
}
</script>