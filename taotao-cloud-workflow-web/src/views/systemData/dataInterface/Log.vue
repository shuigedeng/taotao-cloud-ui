<template>
  <transition name="el-zoom-in-center">
    <div class="WORKFLOW-preview-main">
      <div class="WORKFLOW-common-page-header">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <div class="main">
        <el-row class="WORKFLOW-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="关键词">
                <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
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
        <WORKFLOW-table v-loading="listLoading" :data="list">
          <el-table-column prop="invokTime" label="请求时间" :formatter="workflow.tableDateFormat"
            width="120" />
          <el-table-column prop="userId" label="请求用户" width="120" />
          <el-table-column prop="invokIp" label="请求IP" width="120" />
          <el-table-column prop="invokDevice" label="请求设备" show-overflow-tooltip />
          <el-table-column prop="invokType" label="请求类型" width="80" align="center" />
          <el-table-column prop="invokWasteTime" label="耗时(毫秒)" width="80" />
        </WORKFLOW-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
  </transition>
</template>

<script>
import { getDataInterfaceLog } from '@/api/systemData/dataInterface'
import { deepClone } from '@/utils'
const listQuery = {
  keyword: '',
  currentPage: 1,
  pageSize: 20,
  sort: 'desc',
  sidx: ''
}
export default {
  data() {
    return {
      id: '',
      title: '',
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {}
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id, title) {
      if (!id) return this.$emit('close')
      this.id = id
      this.title = title
      this.reset()
    },
    initData() {
      this.listLoading = true
      getDataInterfaceLog(this.id, this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    reset() {
      this.listQuery = deepClone(listQuery)
      this.initData()
    },
    search() {
      const keyword = this.listQuery.keyword
      this.listQuery = deepClone(listQuery)
      this.listQuery.keyword = keyword
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
  ::v-deep .el-table {
    flex: 1;
    border-top: none;
  }
}
</style>
