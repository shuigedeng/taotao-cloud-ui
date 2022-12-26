<template>
  <div class="JNPF-common-layout systemLogs">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker v-model="pickerVal" type="daterange" start-placeholder="开始日期"
                end-placeholder="结束日期" :picker-options="pickerOptions" value-format="timestamp"
                clearable :editable="false" />
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
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <el-tabs v-model="activeName" type="border-card" class="logTabs"
          @tab-click="handleTabClick">
          <div class="JNPF-common-head">
            <div class="left-btn">
              <el-button type="danger" size="small" @click="handleDel" icon="el-icon-delete">删除
              </el-button>
              <el-link type="danger" :underline="false" @click="batchDel" style="margin-left:10px">
                一键清空</el-link>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <el-tab-pane label="登录日志" name="1">
            <JNPF-table v-loading="listLoading" :data="loginLogData" has-c
              @selection-change="handleSelectionChange">
              <el-table-column prop="creatorTime" :formatter="jnpf.tableDateFormat" label="登录时间"
                width="120" />
              <el-table-column prop="userName" label="登录用户" width="120" />
              <el-table-column prop="ipaddress" label="登录IP" width="120" />
              <el-table-column prop="platForm" label="登录设备" show-overflow-tooltip />
            </JNPF-table>
          </el-tab-pane>
          <el-tab-pane label="请求日志" name="5">
            <JNPF-table v-loading="listLoading" :data="requestLogData" has-c
              @selection-change="handleSelectionChange">
              <el-table-column prop="creatorTime" :formatter="jnpf.tableDateFormat" label="请求时间"
                width="120" />
              <el-table-column prop="userName" label="请求用户" width="120" />
              <el-table-column prop="ipaddress" label="请求IP" width="120" />
              <el-table-column prop="platForm" label="请求设备" min-width="200" show-overflow-tooltip />
              <el-table-column prop="requestURL" label="请求地址" min-width="200"
                show-overflow-tooltip />
              <el-table-column prop="requestMethod" label="请求类型" width="80" align="center" />
              <el-table-column prop="requestDuration" label="耗时(毫秒)" width="80" />
            </JNPF-table>
          </el-tab-pane>
          <el-tab-pane label="操作日志" name="3">
            <JNPF-table v-loading="listLoading" :data="operationLogData" has-c
              @selection-change="handleSelectionChange">
              <el-table-column prop="creatorTime" :formatter="jnpf.tableDateFormat" label="操作时间"
                width="120" />
              <el-table-column prop="userName" label="操作用户" width="120" />
              <el-table-column prop="ipaddress" label="操作IP" width="120" />
              <el-table-column prop="moduleName" label="操作模块" width="160" />
              <el-table-column prop="requestMethod" label="操作类型" width="80" align="center" />
              <el-table-column prop="requestDuration" label="耗时(毫秒)" width="80" />
              <el-table-column prop="json" label="操作记录" min-width="200">
                <template slot-scope="scope">
                  <el-link @click="goDetail(scope.row.json,'操作记录')" style="font-size:12px">
                    <p class="line1">{{ scope.row.json }}</p>
                  </el-link>
                </template>
              </el-table-column>
            </JNPF-table>
          </el-tab-pane>
          <el-tab-pane label="异常日志" name="4">
            <JNPF-table v-loading="listLoading" :data="errorLogData" has-c
              @selection-change="handleSelectionChange">
              <el-table-column prop="creatorTime" :formatter="jnpf.tableDateFormat" label="创建时间"
                width="120" />
              <el-table-column prop="userName" label="创建用户" width="120" />
              <el-table-column prop="ipaddress" label="异常IP" width="120" />
              <el-table-column prop="moduleName" label="异常功能" width="120" />
              <el-table-column prop="json" label="异常描述" min-width="200">
                <template slot-scope="scope">
                  <el-link @click="goDetail(scope.row.json,'异常描述')" style="font-size:12px">
                    <p class="line1">{{ scope.row.json }}</p>
                  </el-link>
                </template>
              </el-table-column>
            </JNPF-table>
          </el-tab-pane>
          <pagination :total="total" :page.sync="listQuery.currentPage"
            :limit.sync="listQuery.pageSize" @pagination="initData" />
        </el-tabs>
      </div>
    </div>
    <Form v-show="formVisible" ref="Form" @close="formVisible=false" />
  </div>
</template>

<script>
import { getLogList, delLog, batchDelLog } from '@/api/system/log'
import Form from './Form'
export default {
  name: 'system-log',
  components: { Form },
  data() {
    return {
      formVisible: false,
      listLoading: true,
      activeName: '1',
      loginLogData: [],
      errorLogData: [],
      requestLogData: [],
      operationLogData: [],
      multipleSelection: [],
      total: 0,
      listQuery: {
        keyword: '',
        startTime: '',
        endTime: '',
        sort: 'desc',
        currentPage: 1,
        pageSize: 20
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      pickerVal: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      const activeId = this.activeName
      this.listLoading = true
      getLogList(activeId, this.listQuery).then(res => {
        if (activeId === '1') this.loginLogData = res.data.list
        if (activeId === '3') this.operationLogData = res.data.list
        if (activeId === '4') this.errorLogData = res.data.list
        if (activeId === '5') this.requestLogData = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleTabClick() {
      this.reset()
    },
    goDetail(data, title) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(data, title)
      })
    },
    handleSelectionChange(val) {
      const res = val.map(item => item.id)
      this.multipleSelection = res
    },
    handleDel() {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请选择一条数据',
          duration: 1500,
        })
        return
      }
      const data = {
        ids: this.multipleSelection
      }
      this.$confirm('您确定要删除这些数据吗, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        delLog(data).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    batchDel() {
      this.$confirm('此操作会将所有日志删除，是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        batchDelLog(this.activeName).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
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
      this.listQuery.sort = 'desc'
      this.initData()
    },
    reset() {
      this.pickerVal = []
      this.listQuery.keyword = ''
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
.systemLogs {
  .JNPF-common-layout-main {
    padding: 0;
  }
  .logTabs {
    height: 100%;
  }
  .line1 {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
    padding: 0;
    .el-tab-pane {
      height: calc(100% - 110px);
      overflow: hidden;
    }
  }
}
</style>