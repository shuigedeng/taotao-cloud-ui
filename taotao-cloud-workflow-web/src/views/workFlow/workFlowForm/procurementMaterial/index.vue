<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>采购原材料</h1>
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
        <el-col :span="12" v-if="judgeShow('departmental')">
          <el-form-item label="申请部门" prop="departmental">
            <el-input v-model="dataForm.departmental" placeholder="申请部门" readonly
              :disabled="judgeWrite('departmental')"></el-input>
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
        <el-col :span="12" v-if="judgeShow('purchaseUnit')">
          <el-form-item label="采购单位" prop="purchaseUnit">
            <el-input v-model="dataForm.purchaseUnit" placeholder="采购单位"
              :disabled="judgeWrite('purchaseUnit')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('deliveryMode')">
          <el-form-item label="送货方式" prop="deliveryMode">
            <el-input v-model="dataForm.deliveryMode" placeholder="送货方式"
              :disabled="judgeWrite('deliveryMode')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('deliveryAddress')">
          <el-form-item label="送货地址" prop="deliveryAddress">
            <el-input v-model="dataForm.deliveryAddress" placeholder="送货地址"
              :disabled="judgeWrite('deliveryAddress')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('paymentMethod')">
          <el-form-item label="结算方式" prop="paymentMethod">
            <el-select v-model="dataForm.paymentMethod" placeholder="选择结算方式"
              :disabled="judgeWrite('paymentMethod')">
              <el-option :key="item.enCode" :label="item.fullName" :value="item.enCode"
                v-for="item in paymentMethodOptions" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('paymentMoney')">
          <el-form-item label="付款金额" prop="paymentMoney">
            <el-input v-model="dataForm.paymentMoney" placeholder="付款金额" type="number"
              :disabled="judgeWrite('paymentMoney')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('fileJson')">
          <el-form-item label="相关附件" prop="fileJson">
            <JNPF-UploadFz v-model="fileList" type="workFlow" :disabled="judgeWrite('fileJson')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('reason')">
          <el-form-item label="用途原因" prop="reason">
            <el-input v-model="dataForm.reason" placeholder="用途原因" type="textarea" :rows="3"
              :disabled="judgeWrite('reason')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-if="judgeShow('entryList')">
      <div class="JNPF-common-title">
        <h2>采购原材料</h2>
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
  name: 'ProcurementMaterial',
  data() {
    return {
      billEnCode: 'WF_ProcurementMaterialNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        applyUser: '',
        applyDate: '',
        departmental: '',
        purchaseUnit: '',
        deliveryMode: '',
        deliveryAddress: '',
        paymentMethod: '',
        paymentMoney: '',
        reason: '',
        fileJson: '',
        entryList: []
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        paymentMethod: [
          { required: true, message: '结算方式不能为空', trigger: 'change' },
        ],
      },
      paymentMethodOptions: []
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.applyDate = new Date().getTime()
      this.dataForm.flowTitle = this.userInfo.userName + "的采购原材料"
      this.dataForm.applyUser = this.userInfo.userName + '/' + this.userInfo.userAccount
      this.dataForm.departmental = this.userInfo.organizeName
    },
    beforeInit() { this.getPaymentMethodOptions() },
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