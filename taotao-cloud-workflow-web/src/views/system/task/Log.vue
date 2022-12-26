<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <div class="main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="执行时间">
                <el-date-picker v-model="pickerVal" type="daterange" start-placeholder="开始日期"
                  end-placeholder="结束日期" :picker-options="pickerOptions" value-format="timestamp"
                  clearable :editable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="执行结果">
                <el-select v-model="listQuery.runResult" placeholder="选择执行结果" clearable>
                  <el-option label="成功" :value="0"></el-option>
                  <el-option label="失败" :value="1"></el-option>
                </el-select>
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
        <JNPF-table v-loading="listLoading" :data="list">
          <el-table-column prop="runTime" label="执行时间" :formatter="jnpf.tableDateFormat"
            width="130" />
          <el-table-column prop="runResult" label="执行结果" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.runResult == 0 ? 'success' : 'danger'">
                {{scope.row.runResult==0?'成功':'失败'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="执行说明" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
  </transition>
</template>

<script>
import { TimeTaskTaskLogList } from '@/api/system/timeTask'
import { deepClone } from '@/utils'
const listQuery = {
  runResult: '',
  startTime: '',
  endTime: '',
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
      listQuery: {},
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
      pickerVal: []
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
      TimeTaskTaskLogList(this.id, this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    reset() {
      this.pickerVal = []
      this.listQuery = deepClone(listQuery)
      this.initData()
    },
    search() {
      const runResult = this.listQuery.runResult
      this.listQuery = deepClone(listQuery)
      this.listQuery.runResult = runResult
      if (this.pickerVal && this.pickerVal.length) {
        this.listQuery.startTime = this.pickerVal[0]
        this.listQuery.endTime = this.pickerVal[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
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