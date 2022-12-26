<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期">
              <el-date-picker v-model="pickerVal" type="daterange" start-placeholder="开始日期"
                end-placeholder="结束日期" :picker-options="pickerOptions" value-format="timestamp"
                clearable :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="refresh()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <topOpts @add="addOrUpdateHandle()" addText="新建订单"></topOpts>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="refresh()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" @expand-change="expandChange"
          :hasNO="false" @sort-change="sortChange">
          <el-table-column type="expand" width="40">
            <template slot-scope="props">
              <el-tabs v-model="props.row.activeName">
                <el-tab-pane label="订单商品">
                  <el-table :data="props.row.childTable" stripe size='mini' show-summary>
                    <el-table-column prop="goodsName" label="商品名称" />
                    <el-table-column prop="specifications" label="规格型号" width="80" />
                    <el-table-column prop="unit" label="单位" width="80" />
                    <el-table-column prop="qty" label="数量" width="80" />
                    <el-table-column prop="price" label="单价" width="80" />
                    <el-table-column prop="amount" label="金额" width="80" />
                    <el-table-column prop="discount" label="折扣%" width="80" />
                    <el-table-column prop="cess" label="税率%" width="80" />
                    <el-table-column prop="actualPrice" label="实际单价" width="80" />
                    <el-table-column prop="actualAmount" label="实际金额" width="80" />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="收款计划">
                  <el-table :data="props.row.childTable1" stripe size='mini' show-summary>
                    <el-table-column prop="receivableDate" label="收款日期"
                      :formatter="jnpf.tableDateFormat" width="120" />
                    <el-table-column prop="receivableRate" label="收款比率%" width="100" />
                    <el-table-column prop="receivableMoney" label="收款金额" width="100" />
                    <el-table-column prop="receivableMode" label="收款方式" width="100" />
                    <el-table-column prop="abstract" label="收款摘要" />
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50" label="序号" align="center" />
          <el-table-column prop="orderCode" label="订单编码" width="150" sortable="custom" />
          <el-table-column prop="orderDate" label="订单日期" width="120" sortable="custom"
            :formatter="jnpf.tableDateFormat" />
          <el-table-column prop="customerName" label="客户名称" width="220" sortable="custom" />
          <el-table-column prop="salesmanName" label="业务人员" width="120" sortable="custom" />
          <el-table-column prop="receivableMoney" label="付款金额" width="100" sortable="custom" />
          <el-table-column prop="creatorUser" label="制单人员" width="120" />
          <el-table-column prop="description" label="订单备注" show-overflow-tooltip />
          <el-table-column prop="currentState" label="状态" width="100" sortable="custom">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.currentState==1">等待审核</el-tag>
              <el-tag type="success" v-else-if="scope.row.currentState==2">审核通过</el-tag>
              <el-tag type="danger" v-else-if="scope.row.currentState==3">审核驳回</el-tag>
              <el-tag type="warning" v-else-if="scope.row.currentState==4">流程撤回</el-tag>
              <el-tag type="info" v-else-if="scope.row.currentState==5">审核终止</el-tag>
              <el-tag type="info" v-else>等待提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id)"
                :disabled="[1,2,5].indexOf(scope.row.currentState)>-1" v-has="'btn_edit'">编辑
              </el-button>
              <el-button size="mini" type="text" class="JNPF-table-delBtn"
                @click="handleDel(scope.$index,scope.row.id)"
                :disabled="[1,2,3,5].indexOf(scope.row.currentState)>-1" v-has="'btn_remove'">删除
              </el-button>
              <el-button size="mini" type="text" :disabled="!scope.row.currentState"
                @click="toApprovalDetail(scope.row.id,scope.row.currentState)"
                v-has="'btn_flowDetail'">详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <FlowBox v-if="formVisible" @close="closeForm" ref="Form" />
    <Detail v-show="detailVisible" ref="detail" @close="detailVisible=false" />
  </div>
</template>

<script>
import { OrderList, Delete, OrderEntryList, OrderReceivableList } from '@/api/extend/order'
import Detail from './Detail'
import FlowBox from '@/views/workFlow/components/FlowBox'
export default {
  name: 'extend-order',
  components: { Detail, FlowBox },
  data() {
    return {
      keyword: '',
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      formVisible: false,
      detailVisible: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pickerVal: [],
      startTime: '',
      endTime: ''
    }
  },
  created() {
    this.initData()
  },
  methods: {
    search() {
      if (this.pickerVal && this.pickerVal.length) {
        this.startTime = this.pickerVal[0]
        this.endTime = this.pickerVal[1]
      } else {
        this.startTime = ''
        this.endTime = ''
      }
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        keyword: this.keyword,
        startTime: this.startTime,
        endTime: this.endTime
      }
      OrderList(query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        for (let i = 0; i < this.list.length; i++) {
          this.$set(this.list[i], 'isExpanded', false)
          this.$set(this.list[i], 'activeName', '0')
          this.$set(this.list[i], 'childTable', [])
          this.$set(this.list[i], 'childTable1', [])
        }
        this.listLoading = false
      })
    },
    expandChange(rows) {
      rows.isExpanded = !rows.isExpanded
      if (!rows.isExpanded) return
      if (rows.childTable.length || rows.childTable1.length) return
      OrderEntryList(rows.id).then(res => {
        rows.childTable = res.data.list
      })
      OrderReceivableList(rows.id).then(res => {
        rows.childTable1 = res.data.list
      })
    },
    sortChange({ column, prop, order }) {
      this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
      this.listQuery.sidx = !order ? '' : prop
      this.initData()
    },
    handleDel(index, id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        this.asyncDel(index, id);
      }).catch(() => { });
    },
    asyncDel(index, id) {
      Delete(id).then(res => {
        this.list.splice(index, 1);
        this.$message({
          type: 'success',
          message: res.msg
        });
      })
    },
    addOrUpdateHandle(id) {
      let data = {
        id,
        enCode: 'crmOrder',
        flowId: '52d3144909d04e2f8a6629ab2ab39e14',
        formType: 1,
        opType: '-1'
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(data)
      })
    },
    toApprovalDetail(id, status) {
      let data = {
        id,
        enCode: 'crmOrder',
        flowId: '52d3144909d04e2f8a6629ab2ab39e14',
        formType: 1,
        opType: 0,
        status
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(data)
      })
    },
    toDetail(id) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(id)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) this.refresh()
    },
    refresh() {
      this.pickerVal = ''
      this.startTime = ''
      this.endTime = ''
      this.keyword = ''
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    }
  }
}
</script>