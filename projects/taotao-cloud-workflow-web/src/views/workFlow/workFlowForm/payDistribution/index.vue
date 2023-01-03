<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>薪酬发放</h1>
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
        <el-col :span="12" v-if="judgeShow('month')">
          <el-form-item label="所属月份" prop="month">
            <el-input v-model="dataForm.month" placeholder="所属月份" :disabled="judgeWrite('month')">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('issuingUnit')">
          <el-form-item label="发放单位" prop="issuingUnit">
            <el-input v-model="dataForm.issuingUnit" placeholder="发放单位"
              :disabled="judgeWrite('issuingUnit')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('department')">
          <el-form-item label="员工部门" prop="department">
            <el-input v-model="dataForm.department" placeholder="员工部门"
              :disabled="judgeWrite('department')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('position')">
          <el-form-item label="员工职位" prop="position">
            <el-input v-model="dataForm.position" placeholder="员工职位"
              :disabled="judgeWrite('position')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('baseSalary')">
          <el-form-item label="基本薪资" prop="baseSalary">
            <el-input v-model="dataForm.baseSalary" placeholder="基本薪资" type="number"
              :disabled="judgeWrite('baseSalary')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('actualAttendance')">
          <el-form-item label="出勤天数" prop="actualAttendance">
            <el-input v-model="dataForm.actualAttendance" placeholder="出勤天数" type="number"
              :disabled="judgeWrite('actualAttendance')">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('allowance')">
          <el-form-item label="员工津贴" prop="allowance">
            <el-input v-model="dataForm.allowance" placeholder="员工津贴" type="number"
              :disabled="judgeWrite('allowance')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('incomeTax')">
          <el-form-item label="所得税" prop="incomeTax">
            <el-input v-model="dataForm.incomeTax" placeholder="所得税" type="number"
              :disabled="judgeWrite('incomeTax')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('insurance')">
          <el-form-item label="员工保险" prop="insurance">
            <el-input v-model="dataForm.insurance" placeholder="员工保险" type="number"
              :disabled="judgeWrite('insurance')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('performance')">
          <el-form-item label="员工绩效" prop="performance">
            <el-input v-model="dataForm.performance" placeholder="员工绩效" type="number"
              :disabled="judgeWrite('performance')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('overtimePay')">
          <el-form-item label="加班费用" prop="overtimePay">
            <el-input v-model="dataForm.overtimePay" placeholder="加班费用" type="number"
              :disabled="judgeWrite('overtimePay')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('grossPay')">
          <el-form-item label="应发工资" prop="grossPay">
            <el-input v-model="dataForm.grossPay" placeholder="应发工资" type="number"
              :disabled="judgeWrite('grossPay')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('payroll')">
          <el-form-item label="实发工资" prop="payroll">
            <el-input v-model="dataForm.payroll" placeholder="实发工资" type="number"
              :disabled="judgeWrite('payroll')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('description')">
          <el-form-item label="备注" prop="description">
            <el-input v-model="dataForm.description" placeholder="备注" type="textarea" :rows="3"
              :disabled="judgeWrite('description')" />
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
  name: 'PayDistribution',
  data() {
    return {
      billEnCode: 'WF_PayDistributionNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        month: '',
        baseSalary: '',
        position: '',
        department: '',
        actualAttendance: '',
        allowance: '',
        insurance: '',
        overtimePay: '',
        performance: '',
        grossPay: '',
        incomeTax: '',
        description: '',
        issuingUnit: '',
        payroll: ''
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ]
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.flowTitle = this.userInfo.userName + "的薪酬发放"
    }
  }
}
</script>