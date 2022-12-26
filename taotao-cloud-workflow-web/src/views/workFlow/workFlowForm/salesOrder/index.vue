<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>销售订单</h1>
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
        <el-col :span="12" v-if="judgeShow('customerName')">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="dataForm.customerName" placeholder="客户名称"
              :disabled="judgeWrite('customerName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('salesDate')">
          <el-form-item label="开单日期" prop="salesDate">
            <el-date-picker v-model="dataForm.salesDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('salesDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('contacts')">
          <el-form-item label="联系人员" prop="contacts">
            <el-input v-model="dataForm.contacts" placeholder="联系人员"
              :disabled="judgeWrite('contacts')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('contactPhone')">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="dataForm.contactPhone" placeholder="联系电话"
              :disabled="judgeWrite('contactPhone')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('customerAddres')">
          <el-form-item label="客户地址" prop="customerAddres">
            <el-input v-model="dataForm.customerAddres" placeholder="客户地址"
              :disabled="judgeWrite('customerAddres')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('salesman')">
          <el-form-item label="业务人员" prop="salesman">
            <el-input v-model="dataForm.salesman" placeholder="业务人员"
              :disabled="judgeWrite('salesman')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('ticketNum')">
          <el-form-item label="发票编码" prop="ticketNum">
            <el-input v-model="dataForm.ticketNum" placeholder="发票编码"
              :disabled="judgeWrite('ticketNum')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('paymentMethod')">
          <el-form-item label="付款方式" prop="paymentMethod">
            <el-input v-model="dataForm.paymentMethod" placeholder="付款方式"
              :disabled="judgeWrite('paymentMethod')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('invoiceType')">
          <el-form-item label="发票类型" prop="invoiceType">
            <el-radio-group v-model="dataForm.invoiceType" :disabled="judgeWrite('invoiceType')">
              <el-radio label="普通发票">普通发票</el-radio>
              <el-radio label="专业发票">专业发票</el-radio>
              <el-radio label="其他">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('paymentMoney')">
          <el-form-item label="付款金额" prop="paymentMoney">
            <el-input v-model="dataForm.paymentMoney" placeholder="付款金额" type="number"
              :disabled="judgeWrite('paymentMoney')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('flowTfileJsonitle')">
          <el-form-item label="相关附件" prop="fileJson">
            <JNPF-UploadFz v-model="fileList" type="workFlow" :disabled="judgeWrite('fileJson')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('description')">
          <el-form-item label="开单备注" prop="description">
            <el-input v-model="dataForm.description" placeholder="开单备注" type="textarea" :rows="3"
              :disabled="judgeWrite('description')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-if="judgeShow('entryList')">
      <div class="JNPF-common-title">
        <h2>销售明细</h2>
      </div>
      <el-table :data="dataForm.entryList" size='mini'>
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="goodsName" label="商品名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.goodsName" :disabled="judgeWrite('entryList')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.specifications" :disabled="judgeWrite('entryList')">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位">
          <template slot-scope="scope">
            <el-input v-model="scope.row.unit" :disabled="judgeWrite('entryList')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.qty" @change="count(scope.row)" type="number"
              :disabled="judgeWrite('entryList')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" @change="count(scope.row)" type="number"
              :disabled="judgeWrite('entryList')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额">
          <template slot-scope="scope">
            <el-input v-model="scope.row.amount" readonly :disabled="judgeWrite('entryList')">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.description" :disabled="judgeWrite('entryList')">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="50" v-if="!setting.readonly && !judgeWrite('entryList')">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn"
              @click="handleDel(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-actions" @click="addHandle()"
        v-if="!setting.readonly && !judgeWrite('entryList')">
        <el-button type="text" icon="el-icon-plus" :disabled="setting.readonly">新增</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import comMixin from '../mixin';
export default {
  mixins: [comMixin],
  name: 'SalesOrder',
  data() {
    return {
      billEnCode: 'WF_SalesOrderNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        customerName: '',
        contactPhone: '',
        contacts: '',
        customerAddres: '',
        salesman: '',
        ticketNum: '',
        paymentMethod: '',
        paymentMoney: '',
        description: '',
        fileJson: '',
        salesDate: '',
        invoiceType: '普通发票',
        entryList: []
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        customerName: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' },
        ],
        salesDate: [
          { required: true, message: '开单日期不能为空', trigger: 'change' },
        ],
        contactPhone: [
          { pattern: /^1[3456789]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的联系电话', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.flowTitle = this.userInfo.userName + "的销售订单"
    },
    addHandle() {
      let item = {
        goodsName: "", specifications: "", unit: "", qty: 0, price: 0, amount: 0, description: ""
      }
      this.dataForm.entryList.push(item)
    },
    count(row) {
      //金额 = 数量*单价
      row.amount = this.jnpf.toDecimal(parseFloat(row.price) * parseFloat(row.qty))
    },
    handleDel(index) {
      this.dataForm.entryList.splice(index, 1);
    }
  }
}
</script>