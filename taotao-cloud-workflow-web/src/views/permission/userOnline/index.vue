<template>
  <div class="JNPF-common-layout JNPF-flex-main">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item :label="$t('common.keyword')">
              <el-input v-model="listQuery.keyword" :placeholder="$t('common.enterKeyword')"
                clearable @change="initData()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="initData()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button type="danger" size="small" @click="batchDel">强制下线</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="reset()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableDataList" has-c
          @selection-change="handleSelectionChange">
          <el-table-column prop="userName" label="在线用户" width="120" />
          <el-table-column prop="loginIPAddress" label="登录IP" width="120" />
          <el-table-column prop="loginTime" label="登录时间" width="150" />
          <el-table-column prop="loginPlatForm" label="登录设备" show-overflow-tooltip />
          <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button slot="reference" type="text" class="JNPF-table-delBtn"
                @click="handleDel(scope.row.userId)">
                {{$t('userOnline.forcedOffline')}}
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOnlineUser,
  batchDelOnlineUser,
  deleteOnlineUser
} from '@/api/permission/onlineUser'

export default {
  name: 'permission-userOnline',
  data() {
    return {
      formVisible: false,
      tableDataList: [],
      refreshLoading: false,
      listLoading: true,
      multipleSelection: [],
      listQuery: {
        keyword: ''
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    reset() {
      this.listQuery.keyword = ''
      this.initData()
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        keyword: this.keyword
      }
      getOnlineUser(this.listQuery).then(res => {
        this.tableDataList = res.data
        this.listLoading = false
        this.refreshLoading = false
      }).catch(() => {
        this.listLoading = false
        this.refreshLoading = false
      })
    },
    handleSelectionChange(val) {
      const res = val.map(item => item.userId)
      this.multipleSelection = res
    },
    batchDel() {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请选择一条数据',
          duration: 1500,
        })
        return
      }
      this.$confirm('您确定要强制下线这些用户吗, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        batchDelOnlineUser(this.multipleSelection).then(res => {
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
    handleDel(userId) {
      this.$confirm(this.$t(`userOnline.cancelAccountTip`), this.$t(`common.tipTitle`), {
        type: 'warning'
      }).then(() => {
        deleteOnlineUser(userId).then(res => {
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
    }
  }
}
</script>
