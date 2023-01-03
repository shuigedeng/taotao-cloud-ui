<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>费用支出单</h1>
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
        <el-col :span="12" v-if="judgeShow('department')">
          <el-form-item label="申请部门" prop="department">
            <el-input v-model="dataForm.department" placeholder="申请部门" readonly
              :disabled="judgeWrite('department')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('applyDate')">
          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker v-model="dataForm.applyDate" type="date" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd" :editable="false" readonly
              :disabled="judgeWrite('applyDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('contractNum')">
          <el-form-item label="合同编码" prop="contractNum">
            <el-input v-model="dataForm.contractNum" placeholder="合同编码"
              :disabled="judgeWrite('contractNum')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('nonContract')">
          <el-form-item label="非合同支出" prop="nonContract">
            <el-input v-model="dataForm.nonContract" placeholder="非合同支出" type="number"
              :disabled="judgeWrite('nonContract')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('accountOpeningBank')">
          <el-form-item label="开户银行" prop="accountOpeningBank">
            <el-input v-model="dataForm.accountOpeningBank" placeholder="开户银行"
              :disabled="judgeWrite('accountOpeningBank')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('bankAccount')">
          <el-form-item label="银行账号" prop="bankAccount">
            <el-input v-model="dataForm.bankAccount" placeholder="银行账号"
              :disabled="judgeWrite('bankAccount')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('openAccount')">
          <el-form-item label="开户姓名" prop="openAccount">
            <el-input v-model="dataForm.openAccount" placeholder="开户姓名"
              :disabled="judgeWrite('openAccount')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('total')">
          <el-form-item label="合计费用" prop="total">
            <el-input v-model="dataForm.total" placeholder="合计费用" type="number"
              :disabled="judgeWrite('total')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('paymentMethod')">
          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select v-model="dataForm.paymentMethod" placeholder="选择支付方式"
              :disabled="judgeWrite('paymentMethod')">
              <el-option :key="item.enCode" :label="item.fullName" :value="item.enCode"
                v-for="item in paymentMethodOptions" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('amountPayment')">
          <el-form-item label="支付金额" prop="amountPayment">
            <el-input v-model="dataForm.amountPayment" placeholder="支付金额" type="number"
              :disabled="judgeWrite('amountPayment')"></el-input>
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
  name: 'ExpenseExpenditure',
  data() {
    return {
      billEnCode: 'WF_ExpenseExpenditureNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        applyUser: '',
        applyDate: '',
        department: '',
        contractNum: '',
        nonContract: '',
        accountOpeningBank: '',
        openAccount: '',
        paymentMethod: '',
        total: '',
        amountPayment: '',
        bankAccount: '',
        description: '',
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        paymentMethod: [
          { required: true, message: '支付方式不能为空', trigger: 'change' },
        ],
      },
      paymentMethodOptions: []
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.applyDate = new Date().getTime()
      this.dataForm.flowTitle = this.userInfo.userName + "的费用支出单"
      this.dataForm.applyUser = this.userInfo.userName + '/' + this.userInfo.userAccount
      this.dataForm.department = this.userInfo.organizeName
    },
    beforeInit() { this.getPaymentMethodOptions() }
  }
}
</script>