<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>接口分类</h2>
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" default-expand-all
          highlight-current :expand-on-click-node="false" node-key="id"
          @node-click="handleNodeClick" class="JNPF-common-el-tree" />
      </el-scrollbar>
    </div>
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
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle()">
            <upload-btn url="/api/system/DataInterface/Action/Import" @on-success="getList" />
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="reset()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData">
          <el-table-column prop="fullName" label="名称" />
          <el-table-column prop="enCode" label="编码" />
          <el-table-column prop="checkType" label="授权" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.checkType === 0">忽略验证</span>
              <span v-if="scope.row.checkType === 1">鉴权验证</span>
              <span v-if="scope.row.checkType === 2">跨域验证</span>
            </template>
          </el-table-column>
          <el-table-column prop="dataType" label="类型" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.dataType === 1">SQL操作</span>
              <span v-if="scope.row.dataType === 2">静态数据</span>
              <span v-if="scope.row.dataType === 3">Api数据</span>
            </template>
          </el-table-column>
          <el-table-column prop="requestMethod" label="动作" width="100" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat"
            width="120" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column prop="enabledMark" label="状态" width="70" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.enabledMark==1?'正常':'停用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="handlePreview(scope.row.id, scope.row.enabledMark,scope.row.tenantId||'')">
                      预览
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="viewLog(scope.row)">
                      日志
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="exportData(scope.row.id)">
                      导出
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="getList" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <Log v-show="logVisible" ref="Log" @close="logVisible=false" />
    <Preview v-if="previewVisible" ref="Preview" @close="closePreview" />
  </div>
</template>
<script>
import {
  getDataInterfaceTypeSelector,
  getDataInterfaceList,
  updateDataInterfaceState,
  delDataInterface,
  exportData
} from '@/api/systemData/dataInterface'
import Form from './Form'
import Preview from './Preview'
import Log from './Log'
export default {
  name: 'systemData-dataInterface',
  components: { Form, Preview, Log },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      listQuery: {
        keyword: '',
        currentPage: 1,
        pageSize: 20,
        categoryId: '',
        sort: 'desc'
      },
      total: 0,
      treeLoading: false,
      listLoading: false,
      btnLoading: false,
      treeData: [],
      tableData: [],
      logVisible: false,
      formVisible: false,
      previewVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.treeLoading = true
      getDataInterfaceTypeSelector().then(res => {
        this.treeData = res.data.list
        if (!this.treeData.length) return this.treeLoading = false
        this.$nextTick(() => {
          this.listQuery.categoryId = this.treeData[0].id
          this.$refs.treeBox.setCurrentKey(this.listQuery.categoryId)
          this.treeLoading = false
          this.getList()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    getList() {
      this.listLoading = true
      getDataInterfaceList(this.listQuery).then(res => {
        this.tableData = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    viewLog(row) {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.Log.init(row.id, row.fullName)
      })
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前接口吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateDataInterfaceState(row.id).then(res => {
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
    handleNodeClick(data) {
      if (this.listQuery.categoryId === data.id) return
      this.listQuery.categoryId = data.id
      this.reset()
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, this.listQuery.categoryId)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delDataInterface(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.getList()
            }
          })
        })
      }).catch(() => { })
    },
    handlePreview(id, enabledMark, tenantId) {
      if (enabledMark === 0) {
        this.$message.error('接口已被禁用，请先开启接口')
      } else {
        this.previewVisible = true
        this.$nextTick(() => {
          this.$refs.Preview.init(id, tenantId)
        })
      }
    },
    search() {
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.listQuery.sort = 'desc'
      this.getList()
    },
    reset() {
      this.listQuery.keyword = ''
      this.search()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.reset()
      }
    },
    closePreview(isRefresh) {
      this.previewVisible = false
      if (isRefresh) {
        this.reset()
      }
    },
    exportData(id) {
      this.$confirm('您确定要导出该数据接口, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportData(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    }
  }
}
</script>
