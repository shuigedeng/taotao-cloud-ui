<template>
  <div class="WORKFLOW-common-layout menu-list">
    <div class="WORKFLOW-common-layout-center">
      <el-row class="WORKFLOW-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="initData()" />
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
      <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main">
        <el-tabs type="border-card" v-model="listQuery.category" class="menu-tab">
          <el-tab-pane label="Web菜单" name="Web"></el-tab-pane>
          <el-tab-pane label="App菜单" name="App"></el-tab-pane>
          <div class="box">
            <div class="WORKFLOW-common-head">
              <topOpts @add="addOrUpdateHandle()">
                <upload-btn url="/api/system/Menu/Action/Import" @on-success="initData" />
              </topOpts>
              <div class="WORKFLOW-common-head-right">
                <el-tooltip effect="dark" content="展开" placement="top">
                  <el-link v-show="!expands" type="text"
                    icon="icon-ym icon-ym-btn-expand WORKFLOW-common-head-icon" :underline="false"
                    @click="toggleExpand()" />
                </el-tooltip>
                <el-tooltip effect="dark" content="折叠" placement="top">
                  <el-link v-show="expands" type="text"
                    icon="icon-ym icon-ym-btn-collapse WORKFLOW-common-head-icon" :underline="false"
                    @click="toggleExpand()" />
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                  <el-link icon="icon-ym icon-ym-Refresh WORKFLOW-common-head-icon" :underline="false"
                    @click="reset()" />
                </el-tooltip>
              </div>
            </div>
            <WORKFLOW-table v-loading="listLoading" :data="treeList" row-key="id" v-if="refreshTable"
              :default-expand-all="expands" :tree-props="{children: 'children', hasChildren: ''}">
              <el-table-column prop="fullName" label="菜单名称" width="260" />
              <el-table-column prop="urlAddress" label="菜单地址" show-overflow-tooltip />
              <el-table-column prop="icon" label="图标" width="50" align="center">
                <template slot-scope="scope">
                  <i :class="scope.row.icon+' table-icon'" />
                </template>
              </el-table-column>
              <el-table-column prop="type" label="类型" width="70" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 1">目录</span>
                  <span v-if="scope.row.type === 2">页面</span>
                  <span v-if="scope.row.type === 3">功能</span>
                  <span v-if="scope.row.type === 4">字典</span>
                  <span v-if="scope.row.type === 5">报表</span>
                  <span v-if="scope.row.type === 6">大屏</span>
                  <span v-if="scope.row.type === 7">外链</span>
                  <span v-if="scope.row.type === 8">门户</span>
                </template>
              </el-table-column>
              <el-table-column prop="sortCode" label="排序" width="70" align="center" />
              <el-table-column prop="enabledMark" label="状态" width="70" align="center">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'"
                    disable-transitions>
                    {{scope.row.enabledMark==1?'正常':'停用'}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                    <template v-if="scope.row.type && scope.row.type!=1">
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                              class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <template v-if="[2,3,4].indexOf(scope.row.type)>-1">
                            <el-dropdown-item v-if="scope.row.isButtonAuthorize === 1"
                              @click.native="handleButtonAuthorize(scope.row)">
                              按钮权限
                            </el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.isColumnAuthorize === 1"
                              @click.native="handleColumnAuthorize(scope.row)">
                              列表权限
                            </el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.isDataAuthorize === 1"
                              @click.native="handleDataAuthorize(scope.row)">
                              数据权限
                            </el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.isFormAuthorize === 1"
                              @click.native="handleFormAuthorize(scope.row)">
                              表单权限
                            </el-dropdown-item>
                          </template>
                          <el-dropdown-item @click.native="exportMenu(scope.row.id)">
                            导出模板
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </tableOpts>
                </template>
              </el-table-column>
            </WORKFLOW-table>
          </div>
        </el-tabs>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <ButtonAuthorizeListDrawer v-if="buttonAuthorizeListDrawer" ref="buttonAuthorizeList" />
    <ColumnAuthorizeListDrawer v-if="columnAuthorizeListDrawer" ref="ColumnAuthorizeList" />
    <FormAuthorizeListDrawer v-if="formAuthorizeListDrawer" ref="FormAuthorizeList" />
    <DataAuthorizeListDrawer v-if="dataAuthorizeListDrawer" ref="DataAuthorizeList" />
  </div>
</template>
<script>
import { getMenuList, updateMenuState, delMenu, exportMenu } from '@/api/system/menu'
import Form from './Form'
import ButtonAuthorizeListDrawer from './components/buttonAuthorize/index'
import ColumnAuthorizeListDrawer from './components/columnAuthorize/index'
import FormAuthorizeListDrawer from './components/formAuthorize/index'
import DataAuthorizeListDrawer from './components/dataAuthorize/index'

export default {
  name: 'system-menu',
  components: {
    Form,
    ButtonAuthorizeListDrawer,
    ColumnAuthorizeListDrawer,
    FormAuthorizeListDrawer,
    DataAuthorizeListDrawer
  },
  data() {
    return {
      options: [],
      listQuery: {
        keyword: '',
        category: 'Web'
      },
      treeList: [],
      btnLoading: false,
      listLoading: true,
      formVisible: false,
      buttonAuthorizeListDrawer: false,
      columnAuthorizeListDrawer: false,
      formAuthorizeListDrawer: false,
      dataAuthorizeListDrawer: false,
      expands: true,
      refreshTable: true
    }
  },
  watch: {
    "listQuery.category": function (val) {
      this.reset()
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
      getMenuList(this.listQuery).then(res => {
        this.treeList = res.data.list
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    toggleExpand() {
      this.refreshTable = false
      this.expands = !this.expands
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, this.listQuery.category)
      })
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前菜单吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateMenuState(row.id).then(res => {
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
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delMenu(id).then(res => {
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
    handleButtonAuthorize(row) {
      const moduleId = row.id
      const fullName = row.fullName
      this.buttonAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.buttonAuthorizeList.init(moduleId, fullName)
      })
    },
    handleColumnAuthorize(row) {
      const moduleId = row.id
      const fullName = row.fullName
      this.columnAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.ColumnAuthorizeList.init(moduleId, fullName)
      })
    },
    handleFormAuthorize(row) {
      const moduleId = row.id
      const fullName = row.fullName
      this.formAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.FormAuthorizeList.init(moduleId, fullName)
      })
    },
    handleDataAuthorize(row) {
      const moduleId = row.id
      const fullName = row.fullName
      this.dataAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.DataAuthorizeList.init(moduleId, fullName)
      })
    },
    exportMenu(id) {
      this.$confirm('您确定要导出该菜单, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportMenu(id).then(res => {
          this.workflow.downloadFile(res.data.url)
        })
      }).catch(() => { });
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-list {
  .table-icon {
    vertical-align: middle;
    font-size: 16px;
  }
  .WORKFLOW-common-layout-main {
    padding: 0;
  }
  .menu-tab {
    height: 100%;
    ::v-deep .el-tabs__content {
      padding: 0;
      height: calc(100% - 40px);
      .box {
        flex: 1;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
      }
    }
  }
}
</style>
