<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>收入确认分析表</h1>
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
        <el-col :span="12" v-if="judgeShow('settlementMonth')">
          <el-form-item label="结算月份" prop="settlementMonth">
            <el-input v-model="dataForm.settlementMonth" placeholder="结算月份"
              :disabled="judgeWrite('settlementMonth')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('customerName')">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="dataForm.customerName" placeholder="客户名称"
              :disabled="judgeWrite('customerName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('contractNum')">
          <el-form-item label="合同编码" prop="contractNum">
            <el-input v-model="dataForm.contractNum" placeholder="合同编码"
              :disabled="judgeWrite('contractNum')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('totalAmount')">
          <el-form-item label="合同总金额" prop="totalAmount">
            <el-input v-model="dataForm.totalAmount" placeholder="合同总金额" type="number"
              :disabled="judgeWrite('totalAmount')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('moneyBank')">
          <el-form-item label="到款银行" prop="moneyBank">
            <el-input v-model="dataForm.moneyBank" placeholder="到款银行"
              :disabled="judgeWrite('moneyBank')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('actualAmount')">
          <el-form-item label="到款金额" prop="actualAmount">
            <el-input v-model="dataForm.actualAmount" placeholder="到款金额" type="number"
              :disabled="judgeWrite('actualAmount')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('paymentDate')">
          <el-form-item label="到款日期" prop="paymentDate">
            <el-date-picker v-model="dataForm.paymentDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('paymentDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('contactName')">
          <el-form-item label="联系人姓名" prop="contactName">
            <el-input v-model="dataForm.contactName" placeholder="联系人姓名"
              :disabled="judgeWrite('contactName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('contacPhone')">
          <el-form-item label="联系电话" prop="contacPhone">
            <el-input v-model="dataForm.contacPhone" placeholder="联系电话"
              :disabled="judgeWrite('contacPhone')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('contactQQ')">
          <el-form-item label="联系QQ" prop="contactQQ">
            <el-input v-model="dataForm.contactQQ" placeholder="联系QQ" type="number"
              :disabled="judgeWrite('contactQQ')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('unpaidAmount')">
          <el-form-item label="未付金额" prop="unpaidAmount">
            <el-input v-model="dataForm.unpaidAmount" placeholder="未付金额" type="number"
              :disabled="judgeWrite('unpaidAmount')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('amountPaid')">
          <el-form-item label="已付金额" prop="amountPaid">
            <el-input v-model="dataForm.amountPaid" placeholder="已付金额" type="number"
              :disabled="judgeWrite('amountPaid')"></el-input>
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
  name: 'IncomeRecognition',
  data() {
    return {
      billEnCode: 'WF_IncomeRecognitionNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        settlementMonth: '',
        moneyBank: '',
        totalAmount: '',
        contractNum: '',
        actualAmount: '',
        paymentDate: '',
        contacPhone: '',
        unpaidAmount: '',
        contactQQ: '',
        amountPaid: '',
        contactName: '',
        description: '',
        customerName: '',
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        settlementMonth: [
          { required: true, message: '结算月份不能为空', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' },
        ],
        contractNum: [
          { required: true, message: '合同编码不能为空', trigger: 'blur' },
        ],
        moneyBank: [
          { required: true, message: '到款银行不能为空', trigger: 'blur' },
        ],
        paymentDate: [
          { required: true, message: '到款日期不能为空', trigger: 'change' },
        ],
        contactName: [
          { required: true, message: '联系人姓名不能为空', trigger: 'blur' },
        ],
        contacPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的联系电话', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.flowTitle = this.userInfo.userName + "的收入确认分析表"
    }
  }
}
</script>