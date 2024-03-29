<template>
  <div class="WORKFLOW-common-layout">
    <div class="WORKFLOW-common-layout-center">
      <el-row class="WORKFLOW-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main">
        <div class="WORKFLOW-common-head">
          <topOpts @add="addOrUpdateHandle()"></topOpts>
          <div class="WORKFLOW-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh WORKFLOW-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <WORKFLOW-table v-loading="listLoading" :data="list">
          <el-table-column prop="company" label="短信厂家" width="80" align="center" />
          <el-table-column prop="templateName" label="模板名称" show-overflow-tooltip min-width="150" />
          <el-table-column prop="templateId" label="模板编号" width="200" />
          <el-table-column prop="signContent" label="签名内容" show-overflow-tooltip />
          <el-table-column prop="creatorUser" label="创建人" width="120" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="workflow.tableDateFormat"
            width="120" />
          <el-table-column prop="lastModifyTime" label="最后修改时间" :formatter="workflow.tableDateFormat"
            width="120" />
          <el-table-column prop="enabledMark" label="状态" width="70" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.enabledMark==1?'正常':'停用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)"
                @del="handleDel(scope.$index,scope.row.id)">
              </tableOpts>
            </template>
          </el-table-column>
        </WORKFLOW-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
        <Form v-show="formVisible" ref="Form" @close="closeForm" />
      </div>
    </div>
  </div>
</template>

<script>
import { getList, Delete } from '@/api/system/smsTemplate'
import Form from './Form'
export default {
  name: 'system-smsTemplate',
  components: { Form },
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
      logVisible: false,
      formVisible: false
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
      this.initData()
    },
    reset() {
      this.keyword = ''
      this.search()
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        keyword: this.keyword
      }
      getList(query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    handleDel(index, id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
          this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
      }).catch(() => { });
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '停止' : '启用'
      this.$confirm(`您确定要${txt}该任务, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        const reqMethod = row.enabledMark ? TimeTaskStop : TimeTaskEnable
        reqMethod(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              row.enabledMark = row.enabledMark ? 0 : 1
            }
          })
        })
      }).catch(() => { })
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) this.initData()
    }
  }
}
</script>
