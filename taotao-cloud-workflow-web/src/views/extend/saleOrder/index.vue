<template>
  <div class="JNPF-common-layout sale-order-main">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input v-model="query.code" placeholder="请输入订单编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="query.customerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态">
              <el-select v-model="query.auditState" placeholder="选择审核状态" clearable>
                <el-option label="全部" :value="0" />
                <el-option label="未审核" :value="1" />
                <el-option label="已审核" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="关闭状态">
                <el-select v-model="query.closeState" placeholder="选择关闭状态" clearable>
                  <el-option label="全部" :value="0" />
                  <el-option label="未关闭" :value="1" />
                  <el-option label="已关闭" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="制单人">
                <el-input v-model="query.creatorUser" placeholder="请输入制单人" clearable />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="联系人">
                <el-input v-model="query.keyword" placeholder="请输入联系人" clearable />
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="联系方式">
                <el-input v-model="query.contactTel" placeholder="请输入联系方式" clearable />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
              <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true"
                v-if="!showAll">展开</el-button>
              <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
                收起</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">新建</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleEdit()">编辑</el-button>
            <el-button type="text" icon="el-icon-close" @click="handleDel()">删除</el-button>
            <el-button type="text" icon="el-icon-arrow-down">更多</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="refresh()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" has-c @selection-change="handleChange"
          highlight-current-row @row-click="rowClick" ref="mainTable">
          <el-table-column prop="code" label="订单编号" width="150" />
          <!-- <el-table-column prop="orderCode" label="客户类别" width="150" /> -->
          <el-table-column prop="customerName" label="客户名称" width="150" />
          <!-- <el-table-column prop="orderCode" label="制单人" width="100" />
          <el-table-column prop="orderDate" label="制单日期" width="120"
            :formatter="jnpf.tableDateFormat" /> -->
          <el-table-column prop="auditState" label="审核状态" width="100">
            <template slot-scope="scope">
              <!-- <el-tag type="success">已审核</el-tag> -->
              <el-tag type="danger">未审核</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="goodsState" label="发货通知状态" width="100">
            <template slot-scope="scope">
              <!-- <el-tag type="success">已通知</el-tag> -->
              <el-tag type="danger">未通知</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="closeState" label="关闭状态" width="100">
            <template slot-scope="scope">
              <!-- <el-tag type="success">已关闭</el-tag> -->
              <el-tag type="danger">未关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="closeDate" label="关闭日期" width="120"
            :formatter="jnpf.tableDateFormat" />
          <el-table-column prop="business" label="业务员" width="120" />
          <el-table-column prop="address" label="送货地址" show-overflow-tooltip />
          <el-table-column prop="contactTel" label="联系方式" width="120" />
          <!-- <el-table-column prop="creatorUser" label="联系人" width="120" /> -->
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
        <div class="sale-order-footer">
          <JNPF-table :data="productEntryList" highlight-current-row @row-click="rowClick1">
            <el-table-column prop="productCode" label="产品编号" />
            <el-table-column prop="productName" label="产品名称" />
            <el-table-column prop="qty" label="发货通知数" />
            <el-table-column prop="type" label="订货类型" />
            <el-table-column prop="activity" label="活动" />
          </JNPF-table>
          <JNPF-table :data="childrenList" class="ml-10">
            <el-table-column prop="productSpecification" label="产品规格" />
            <el-table-column prop="qty" label="数量" />
            <el-table-column prop="price" label="单价" />
            <el-table-column prop="money" label="折后单价" />
            <el-table-column prop="commandType" label="控制方式" />
            <el-table-column prop="util" label="单位" />
          </JNPF-table>
        </div>
      </div>
    </div>
    <Form v-if="formVisible" ref="form" @close="closeForm" />
  </div>
</template>

<script>
import { getOrderList, getProductEntry, delOrder } from '@/api/extend/saleOrder'
import Form from './Form'
export default {
  name: 'extend-saleOrder',
  components: { Form },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      showAll: false,
      query: {
        keyword: '',
        code: '',
        customerName: '',
      },
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      formVisible: false,
      multipleSelection: [],
      activeId: '',
      productEntryList: [],
      childrenList: [],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.productEntryList = []
      this.childrenList = []
      this.initData()
    },
    initData() {
      this.listLoading = true
      const query = {
        ...this.listQuery,
        ...this.query
      }
      getOrderList(query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    handleDel() {
      if (this.multipleSelection.length != 1) {
        this.$message.error('请只选择一条数据')
        return
      }
      const id = this.multipleSelection[0].id
      this.$confirm('此操作将永久删除该数据, 是否继续？', '提示', {
        type: 'warning'
      }).then(() => {
        delOrder(id).then(res => {
          this.initData()
          this.productEntryList = []
          this.childrenList = []
          this.$message({
            type: 'success',
            message: res.msg
          });
        })
      }).catch(() => { });
    },
    rowClick(item) {
      if (this.activeId === item.id) return
      this.activeId = item.id
      getProductEntry(this.activeId).then(res => {
        this.productEntryList = res.data.list
      })
    },
    rowClick1(item) {
      this.childrenList = item.dataList || []
    },
    handleEdit() {
      if (this.multipleSelection.length != 1) {
        this.$message.error('请只选择一条数据')
        return
      }
      const id = this.multipleSelection[0].id
      this.handleAdd(id)
    },
    handleChange(val) {
      this.multipleSelection = val
    },
    handleAdd(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.form.init(id)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) this.refresh()
    },
    reset() {
      this.query = {
        keyword: '',
        code: '',
        customerName: '',
      }
      this.search()
    },
    refresh() {
      this.productEntryList = []
      this.childrenList = []
      this.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
.sale-order-main {
  .sale-order-footer {
    margin-top: 10px;
    height: 300px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    .ml-10 {
      margin-left: 10px;
    }
  }
}
</style>