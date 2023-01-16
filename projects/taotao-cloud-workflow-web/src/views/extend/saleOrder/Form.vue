<template>
  <transition name="el-zoom-in-center">
    <div class="WORKFLOW-preview-main order-form">
      <div class="WORKFLOW-common-page-header">
        <el-page-header @back="goBack" :content="dataForm.id?'编辑':'新建'" />
        <div class="options">
          <el-button type="primary" @click="submit()" :loading="btnLoading">确 定</el-button>
          <el-button @click="goBack()">取 消</el-button>
        </div>
      </div>
      <div class="main" v-loading="loading">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="90px">
          <el-row>
            <el-col :span="18">
              <el-col :span="8">
                <el-form-item label="订单编码" prop="code">
                  <el-input v-model="dataForm.code" placeholder="提交后系统自动生成" readonly>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="客户名称" prop="customerName">
                  <el-autocomplete v-model="dataForm.customerName"
                    :fetch-suggestions="querySearchAsync" placeholder="请输入客户名称"
                    @select="handleSelect" style="width:100%" popper-class="sale-order-popper">
                    <template slot-scope="{ item }">
                      <div class="sale-order-popper-item">
                        <span>{{ item.code }}</span>
                        <span class="name">{{ item.name }}</span>
                        <span>{{ item.address }}</span>
                        <span>{{ item.customerName }}</span>
                        <span>{{ item.contactTel }}</span>
                      </div>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式" prop="contactTel">
                  <el-input v-model="dataForm.contactTel" placeholder="联系方式">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="送货地址" prop="address">
                  <el-input v-model="dataForm.address" placeholder="送货地址">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发货仓库" prop="goodsWarehouse">
                  <el-select v-model="dataForm.goodsWarehouse" placeholder="发货仓库">
                    <el-option :key="item" :label="item" :value="item"
                      v-for="item in storeOptions" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="业务员" prop="business">
                  <el-input v-model="dataForm.business" placeholder="业务员">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收款方式" prop="gatheringType">
                  <el-select v-model="dataForm.gatheringType" placeholder="选择收款方式">
                    <el-option :key="item" :label="item" :value="item" v-for="item in options" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="让利金额" prop="partPrice">
                  <el-input v-model="dataForm.partPrice" placeholder="让利金额">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="优惠金额" prop="reducedPrice">
                  <el-input v-model="dataForm.reducedPrice" placeholder="优惠金额">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折后金额" prop="discountPrice">
                  <el-input v-model="dataForm.discountPrice" placeholder="折后金额">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input v-model="dataForm.description" placeholder="备注" type="textarea"
                    :rows="3" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="6">
              <el-form-item label="审核人" label-width="120px" prop="auditName">
                <el-input v-model="dataForm.auditName" disabled />
              </el-form-item>
              <el-form-item label="审核时间" label-width="120px" prop="auditDate">
                <el-input v-model="dataForm.auditDate" disabled />
              </el-form-item>
              <el-form-item label="发货通知人" label-width="120px" prop="goodsName">
                <el-input v-model="dataForm.goodsName" disabled />
              </el-form-item>
              <el-form-item label="发货通知时间" label-width="120px" prop="goodsDate">
                <el-input v-model="dataForm.goodsDate" disabled />
              </el-form-item>
              <el-form-item label="收货仓库" label-width="120px" prop="harvestWarehouse">
                <el-input v-model="dataForm.harvestWarehouse" disabled />
              </el-form-item>
              <el-form-item label="代发客户" label-width="120px" prop="issuingName">
                <el-input v-model="dataForm.issuingName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="add-btn">
          <el-col :span="18">
            <el-button type="primary" icon="el-icon-plus" @click="openGoodsBox">选择产品</el-button>
          </el-col>
          <el-col :span="6">
            <el-form label-width="120px">
              <el-form-item label="订货类型">
                <el-select v-model="orderType" placeholder="选择订货类型" @change="onTypeChange"
                  clearable>
                  <el-option label="1" value="1" />
                  <el-option label="2" value="2" />
                  <el-option label="3" value="3" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <WORKFLOW-table :data="dataForm.productEntryList" size='small'>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-plus" @click="addItem(scope.$index)">
              </el-button>
              <el-button size="mini" type="text" class="WORKFLOW-table-delBtn" icon="el-icon-minus"
                @click="delItem(scope.$index)">
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="商品编码" width="200">
            <template slot-scope="scope">
              <el-autocomplete v-model="scope.row.productCode" :fetch-suggestions="goodsSearchAsync"
                placeholder="商品编码" @select="goodsSelect($event,scope.row)" style="width:100%"
                popper-class="sale-order-popper goods-popper">
                <template slot-scope="{ item }">
                  <div class="sale-order-popper-item">
                    <span>{{ item.code }}</span>
                    <span>{{ item.fullName }}</span>
                    <span>{{ item.productSpecification }}</span>
                  </div>
                </template>
              </el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称" />
          <el-table-column prop="productSpecification" label="规格型号" width="100" />
          <el-table-column prop="type" label="订货类型" width="100" />
          <el-table-column prop="qty" label="数量" width="120">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.qty" @change="count(scope.row)" :controls="false"
                style="width:100% !important">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="单价" width="120">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.money" @change="count(scope.row)"
                :controls="false" style="width:100% !important">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" width="120" />
          <el-table-column prop="description" label="备注" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.description"> </el-input>
            </template>
          </el-table-column>
        </WORKFLOW-table>
        <div class="order-footer">
          <span class="order-footer-item">订单总数：0</span>
          <span class="order-footer-item">下单总数：0</span>
          <span class="order-footer-item">总金额(元)：{{total}}</span>
        </div>
      </div>
      <GoodsBox v-if="goodsBoxVisible" ref="goodsBox" @choice="choice" />
    </div>
  </transition>
</template>

<script>
import { orderInfo, createOrder, updateOrder, getGoodsSelector, getCustomer, GoodsList } from '@/api/extend/saleOrder'
import GoodsBox from './GoodsBox'
export default {
  components: { GoodsBox },
  data() {
    return {
      dataForm: {
        id: '',
        address: "",
        auditDate: '',
        auditName: "",
        business: "",
        code: "",
        contactTel: "",
        customerId: "",
        customerName: '',
        description: "",
        discountPrice: '',
        gatheringType: "",
        goodsDate: '',
        goodsName: "",
        goodsWarehouse: "",
        harvestMsg: 0,
        harvestWarehouse: "",
        issuingName: "",
        partPrice: '',
        productEntryList: []
      },
      dataRule: {},
      list: [],
      loading: true,
      total: 0,
      options: ['现金', '转帐', '汇票'],
      storeOptions: ['仓库1', '仓库2', '仓库3'],
      goodsBoxVisible: false,
      btnLoading: false,
      orderType: ''
    }
  },
  watch: {
    'dataForm.productEntryList': {
      handler(newVal, oldVal) {
        let menoy = 0
        for (let i = 0; i < newVal.length; i++) {
          const e = newVal[i];
          menoy += parseFloat(e.amount)
        }
        this.total = menoy
      },
      deep: true
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id) {
      this.dataForm.id = id || ''
      this.loading = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$refs['dataForm'].resetFields()
          orderInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.loading = false
          })
        } else {
          this.loading = false
          this.addItem()
        }
      })
    },
    addItem(index) {
      let item = {
        productId: '',
        productCode: '',
        productName: '',
        productSpecification: '',
        qty: 1,
        money: 0,
        amount: 0,
        description: '',
        type: ''
      }
      this.dataForm.productEntryList.splice(index + 1, 0, item)
    },

    delItem(index) {
      this.dataForm.productEntryList.splice(index, 1);
    },
    count(row) {
      row.amount = this.workflow.toDecimal(parseFloat(row.money) * parseFloat(row.qty))
    },
    openGoodsBox() {
      this.goodsBoxVisible = true
      this.$nextTick(() => {
        this.$refs.goodsBox.init()
      })
    },
    onTypeChange(val) {
      if (!val) return
      for (let i = 0; i < this.dataForm.productEntryList.length; i++) {
        this.dataForm.productEntryList[i].type = val
      }
    },
    choice(list) {
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        let item = {
          productId: e.id,
          productCode: e.code,
          productName: e.fullName,
          productSpecification: e.productSpecification,
          qty: 1,
          money: e.money,
          amount: e.money,
          description: '',
          type: e.type
        }
        this.dataForm.productEntryList.push(item)
      }
    },
    querySearchAsync(queryString, cb) {
      getCustomer(queryString).then(res => {
        cb(res.data.list)
      })
    },
    goodsSearchAsync(queryString, cb) {
      getGoodsSelector(queryString).then(res => {
        cb(res.data.list)
      })
    },
    goodsSelect(item, row) {
      row.productId = item.id
      row.productCode = item.code
      row.productName = item.fullName
      row.productSpecification = item.productSpecification
      row.money = item.money
      row.type = item.type
      row.amount = this.workflow.toDecimal(parseFloat(row.money) * parseFloat(row.qty))
    },
    handleSelect(item) {
      this.dataForm.customerName = item.name
      this.dataForm.customerId = item.id
      this.dataForm.contactTel = item.contactTel
      this.dataForm.address = item.address
    },
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateOrder : createOrder
          if (!this.dataForm.id) delete (this.dataForm.id)
          formMethod(this.dataForm).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => { this.btnLoading = false })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.WORKFLOW-common-page-header {
  height: 61px;
}
::v-deep .el-tabs__header {
  margin-bottom: 0;
}
::v-deep .el-select {
  width: 100%;
}
.box {
  position: relative;
}
.order-form {
  height: 100%;
  overflow: hidden;
  .main {
    display: flex;
    flex-direction: column;
  }
  .add-btn {
    margin-top: 20px;
    margin-bottom: -10px;
  }
  .order-footer {
    margin-top: 10px;
    text-align: right;
    font-size: 12px;
    .order-footer-item {
      display: inline-block;
      min-width: 150px;
      color: #606266;
      text-align: left;
    }
  }
}
</style>
<style lang="scss">
.sale-order-popper {
  &.el-autocomplete-suggestion li {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
  }
  .sale-order-popper-item {
    span {
      margin-right: 10px;
    }
    .name {
      color: #1890ff;
    }
  }
}
.goods-popper {
  width: 400px !important;
}
</style>
