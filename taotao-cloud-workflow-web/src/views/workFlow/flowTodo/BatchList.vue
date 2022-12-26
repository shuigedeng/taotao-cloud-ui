<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" content="批量审批" />
        <div class="options">
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <div class="main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="关键词">
                <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属流程">
                <el-select v-model="listQuery.flowId" placeholder="选择所属流程" clearable
                  @change="onFlowChange">
                  <el-option v-for="item in flowOptions" :key="item.id" :label="item.fullName"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属节点">
                <el-select v-model="listQuery.nodeCode" placeholder="选择所属节点" clearable
                  @visible-change="visibleChange">
                  <el-option v-for="item in nodeOptions" :key="item.id" :label="item.fullName"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="showAll">
              <el-col :span="6">
                <el-form-item label="日期">
                  <el-date-picker v-model="pickerVal" type="daterange" start-placeholder="开始日期"
                    end-placeholder="结束日期" :picker-options="pickerOptions" value-format="timestamp"
                    clearable :editable="false">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属分类">
                  <el-select v-model="listQuery.flowCategory" placeholder="选择所属分类" clearable>
                    <el-option v-for="item in categoryList" :key="item.enCode"
                      :label="item.fullName" :value="item.enCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发起人员">
                  <user-select v-model="listQuery.creatorUserId" placeholder="选择发起人员" />
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">
                  {{$t('common.search')}}</el-button>
                <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
                </el-button>
                <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true"
                  v-if="!showAll">展开</el-button>
                <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
                  收起</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-head">
          <div>
            <el-button type="warning" @click="handleBatch(2)" :disabled="!listQuery.nodeCode">
              批量转办</el-button>
            <el-button type="primary" @click="handleBatch(0)" :disabled="!listQuery.nodeCode"
              :loading="btnLoading">批量通过</el-button>
            <el-button type="danger" @click="handleBatch(1)" :disabled="!listQuery.nodeCode">批量拒绝
            </el-button>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" has-c @selection-change="handleChange">
          <el-table-column prop="fullName" label="流程标题" show-overflow-tooltip min-width="150" />
          <el-table-column prop="flowName" label="所属流程" width="130" />
          <el-table-column prop="flowVersion" label="流程版本" width="130" />
          <el-table-column prop="nodeName" label="所属节点" width="130" />
          <el-table-column prop="startTime" label="发起时间" width="130"
            :formatter="jnpf.tableDateFormat" />
          <el-table-column prop="userName" label="发起人员" width="130" />
          <el-table-column prop="flowUrgent" label="紧急程度" width="130">
            <template slot-scope="scope">
              {{ scope.row.flowUrgent | urgentText() }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="流程状态" width="130">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status==2">审核通过</el-tag>
              <el-tag type="danger" v-else-if="scope.row.status==3">审核驳回</el-tag>
              <el-tag type="warning" v-else-if="scope.row.status==4">流程撤回</el-tag>
              <el-tag type="info" v-else-if="scope.row.status==5">审核终止</el-tag>
              <el-tag type="primary" v-else>等待审核</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="creatorTime" label="接收时间" width="130">
            <template slot-scope="scope">
              {{scope.row.creatorTime | toDate() }}
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
      <approve-dialog v-if="approveVisible" ref="approveDialog" @submit="batchOperation" />
      <UserBox v-if="userBoxVisible" ref="userBox" title="审批人" @submit="handleTransfer" />
    </div>
  </transition>
</template>

<script>
import { FlowBeforeList, getBatchFlowSelector, getNodeSelector, BatchCandidate, BatchOperation } from '@/api/workFlow/FlowBefore'
import ApproveDialog from '@/views/workFlow/components/ApproveDialog'
export default {
  components: { ApproveDialog },
  props: ['categoryList'],
  data() {
    return {
      id: '',
      title: '',
      list: [],
      total: 0,
      listLoading: false,
      btnLoading: false,
      listQuery: {
        keyword: '',
        flowId: '',
        nodeCode: '',
        flowCategory: '',
        creatorUserId: '',
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      flowOptions: [],
      nodeOptions: [],
      multipleSelection: [],
      currentBatchType: null,
      userBoxVisible: false,
      approveVisible: false,
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
      showAll: false
    }
  },
  watch: {
    'listQuery.nodeCode': function (val) {
      this.search()
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init() {
      this.reset()
      this.getBatchFlowSelector()
    },
    initData() {
      this.listLoading = true
      FlowBeforeList(4, this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    getBatchFlowSelector() {
      getBatchFlowSelector().then(res => {
        this.flowOptions = res.data
      })
    },
    getNodeSelector() {
      getNodeSelector(this.listQuery.flowId).then(res => {
        this.nodeOptions = res.data
      })
    },
    onFlowChange(val) {
      this.listQuery.nodeCode = ''
      if (!val) return this.nodeOptions = []
      this.getNodeSelector()
    },
    visibleChange(val) {
      if (!val) return
      if (!this.listQuery.flowId) this.$message.warning('请先选择所属流程')
    },
    handleChange(val) {
      this.multipleSelection = val
    },
    handleBatch(batchType) {
      // batchType 0-通过 1-拒绝 2-转办
      if (!this.multipleSelection.length) return this.$message.error('请先选择数据')
      let isDiffer = this.multipleSelection.some(o => o.flowVersion !== this.multipleSelection[0].flowVersion)
      if (isDiffer) return this.$message.error('请选择相同的版本审批单')
      this.currentBatchType = batchType
      const item = this.multipleSelection[0]
      const properties = item.approversProperties ? JSON.parse(item.approversProperties) : {}
      if (batchType === 0) {
        if (!properties.hasAuditBtn) return this.$message.error('当前审批节点无通过权限')
        this.btnLoading = true
        const query = {
          flowId: item.flowId,
          taskOperatorId: item.id
        }
        BatchCandidate(query).then(res => {
          let data = res.data
          this.btnLoading = false
          let candidateList = []
          if (Array.isArray(data) && data.length) {
            candidateList = res.data.map(o => ({
              ...o,
              label: o.nodeName + '审批人',
              value: [],
              rules: [{ required: true, message: `${o.nodeName}审批人不能为空`, trigger: 'click' }]
            }))
          }
          this.approveVisible = true
          this.$nextTick(() => {
            this.$refs.approveDialog.init(properties, item.id, 'audit', candidateList, item.flowId)
          })
        }).catch(() => {
          this.btnLoading = false
        })
        return
      }
      if (batchType === 1) {
        if (!properties.hasRejectBtn) return this.$message.error('当前审批节点无拒绝权限')
        this.approveVisible = true
        this.$nextTick(() => {
          this.$refs.approveDialog.init(properties, item.id, 'reject', [], item.flowId)
        })
        return
      }
      if (batchType === 2) {
        if (!properties.hasTransferBtn) return this.$message.error('当前审批节点无转办权限')
        this.userBoxVisible = true
        this.$nextTick(() => {
          this.$refs.userBox.init()
        })
      }
    },
    handleApproval(data) {
      this.batchOperation(data)
    },
    handleTransfer(freeApproverUserId) {
      const data = { freeApproverUserId }
      this.batchOperation(data)
    },
    batchOperation(data) {
      const ids = this.multipleSelection.map(o => o.id)
      const query = {
        ...data,
        enCode: this.multipleSelection[0].flowCode,
        batchType: this.currentBatchType,
        ids
      }
      BatchOperation(query).then(res => {
        this.$message({
          type: 'success',
          message: res.msg,
          duration: 1000,
          onClose: () => {
            this.initData()
            this.$refs.approveDialog && this.$refs.approveDialog.closeDialog()
          }
        })
      }).catch(() => {
        this.$refs.approveDialog && (this.$refs.approveDialog.btnLoading = false)
      })
    },
    reset() {
      this.list = []
      this.nodeOptions = []
      this.pickerVal = []
      this.listQuery = {
        keyword: '',
        flowId: '',
        nodeCode: '',
        flowCategory: '',
        creatorUserId: '',
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    search() {
      if (this.pickerVal && this.pickerVal.length) {
        this.listQuery.startTime = this.pickerVal[0]
        this.listQuery.endTime = this.pickerVal[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0 0 10px;
  .JNPF-common-search-box {
    border-bottom: 1px solid #dcdfe6;
  }
  ::v-deep .el-table {
    flex: 1;
    border-top: none;
  }
}
</style>