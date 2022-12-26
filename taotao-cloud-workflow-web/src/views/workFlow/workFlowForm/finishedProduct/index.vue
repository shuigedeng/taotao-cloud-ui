<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>成品入库单</h1>
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
        <el-col :span="12" v-if="judgeShow('warehouseName')">
          <el-form-item label="入库人" prop="warehouseName">
            <el-input v-model="dataForm.warehouseName" placeholder="入库人"
              :disabled="judgeWrite('warehouseName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('warehouse')">
          <el-form-item label="仓库" prop="warehouse">
            <el-input v-model="dataForm.warehouse" placeholder="仓库"
              :disabled="judgeWrite('warehouse')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('reservoirDate')">
          <el-form-item label="入库时间" prop="reservoirDate">
            <el-date-picker v-model="dataForm.reservoirDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('reservoirDate')">
            </el-date-picker>
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
    <template v-if="judgeShow('entryList')">
      <div class="JNPF-common-title">
        <h2>入库明细</h2>
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
  name: 'FinishedProduct',
  data() {
    return {
      billEnCode: 'WF_FinishedProductNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        warehouseName: '',
        warehouse: '',
        reservoirDate: '',
        description: '',
        entryList: []
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        reservoirDate: [
          { required: true, message: '入库时间不能为空', trigger: 'change' },
        ],
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.flowTitle = this.userInfo.userName + "的成品入库单"
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