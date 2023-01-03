<template>
  <div class="WORKFLOW-common-layout">
    <div class="WORKFLOW-common-layout-left">
      <div class="WORKFLOW-common-title">
        <h2>{{ $t('common.organization') }}</h2>
        <span class="options">
          <el-tooltip content="组织架构图" placement="top">
            <el-link icon="el-icon-menu" :underline="false" @click="showDiagram" />
          </el-tooltip>
        </span>
      </div>
      <el-scrollbar class="WORKFLOW-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="false" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="WORKFLOW-common-el-tree">
          <span class="custom-tree-node" slot-scope="{ data, node }" :title="data.fullName">
            <i :class="data.icon" />
            <span class="text">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="WORKFLOW-common-layout-center WORKFLOW-flex-main">
      <el-row class="WORKFLOW-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item :label="$t('common.keyword')">
              <el-input v-model="listQuery.keyword" :placeholder="$t('common.enterKeyword')" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main">
        <div class="WORKFLOW-common-head">
          <topOpts @add="addOrUpdateHandle()">
            <!-- <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button> -->
            <el-button type="text" icon="el-icon-download" @click="exportUserForm" :loading="btnLoading" >导出</el-button>
            <el-button type="text" icon="el-icon-upload2" @click="uploadForm">导入</el-button>
          </topOpts>
          <div class="WORKFLOW-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh WORKFLOW-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
          </div>
        </div>
        <WORKFLOW-table v-loading="listLoading" :data="tableData" :hasNO="false">
          <el-table-column prop="index" type="index" width="50" label="序号" fixed="left" align="center" />
          <el-table-column prop="account" label="账号" width="100" fixed="left"/>
          <el-table-column prop="realName" label="姓名" width="100" fixed="left"/>
          <el-table-column prop="gender" label="性别" width="90" align="center">
            <template slot-scope="scope" sortable>
              <span>{{ scope.row.gender == 1 ? '男' : (scope.row.gender == 2 ? '女' : '保密') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobilePhone" label="手机" width="120" />
          <el-table-column prop="organize" label="所属组织" min-width="200" show-overflow-tooltip />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="workflow.tableDateFormat" width="120" />
          <!--          <el-table-column prop="sortCode" label="排序" width="70" align="center" />-->
          <el-table-column prop="enabledMark" label="账号状态" width="70" align="center">
            <template slot-scope="scope">
              <el-tag type="success" disable-transitions v-if="scope.row.enabledMark == 1">正常
              </el-tag>
              <el-tag type="warning" disable-transitions v-else-if="scope.row.enabledMark == 2">锁定
              </el-tag>
              <el-tag type="danger" disable-transitions v-else>禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope" v-if="!scope.row.isAdministrator">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button size="mini" type="text">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleResetPwd(scope.row.id, scope.row.account)">
                      {{ $t('user.resetPassword') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="unlockUser(scope.row.id)" v-if="scope.row.enabledMark == 2">解除锁定
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </WORKFLOW-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-show="formVisible" ref="Form" @close="removeForm" />
    <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
    <ResetPwdForm v-if="resetFormVisible" ref="ResetPwdForm" @refreshDataList="initData" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" />
    <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()" />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import {
  getDepartmentSelector,
  getUserExcel,
  isReleaseMessage
} from '@/api/permission/department'
import {
  getUserList,
  updateUserState,
  unlockUser,
  delUser
} from '@/api/permission/user'
import Form from './Form'
import Diagram from './Diagram'
import ResetPwdForm from './ResetPassword'
import ImportForm from './ImportForm'
import ExportForm from './ExportForm'

export default {
  name: 'permission-user',
  components: {
    Form,
    Diagram,
    ResetPwdForm,
    ExportForm,
    ImportForm
  },
  data() {
    return {
      keyword: '',
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: true,
      listQuery: {
        organizeId: '',
        keyword: '',
        currentPage: 1,
        pageSize: 20
      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      total: 0,
      type: '',
      formVisible: false,
      diagramVisible: false,
      resetFormVisible: false,
      authorizeFormVisible: false,
      importFormVisible: false,
      exportFormVisible: false,
      btnLoading:false,
      isShowExport:false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getOrganizeList();
    // this.checkIsReleaseMessage();
  },
  methods: {
    showDiagram() {
      this.diagramVisible = true
      this.$nextTick(() => {
        this.$refs.Diagram.init()
      })
    },
    search() {
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.listQuery.sort = 'desc'
      this.initData()
    },
    reset() {
      this.listQuery.keyword = ''
      this.search()
    },
    getOrganizeList() {
      this.treeLoading = true
      getDepartmentSelector().then(res => {
        this.treeData = res.data.list
        this.treeLoading = false
        this.initData()
      }).catch(() => {
        this.treeLoading = false
      })
    },
    initData() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.tableData = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleNodeClick(data) {
      if (this.listQuery.organizeId === data.id) return
      this.listQuery.organizeId = data.id
      this.type = data.type
      this.reset()
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, this.type === 'department' ? this.listQuery.organizeId : '')
      })
    },
    removeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    removeAuthorizeForm(isRefresh) {
      this.authorizeFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前用户吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateUserState(row.id).then(res => {
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
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        delUser(id).then(res => {
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
    unlockUser(id) {
      this.$confirm('此操作将解除该账户锁定, 是否继续?', '解除锁定', {
        type: 'warning'
      }).then(() => {
        unlockUser(id).then(res => {
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
    exportForm() {
      this.exportFormVisible = true
      this.$nextTick(() => {
        this.$refs.exportForm.init(this.listQuery)
      })
    },
    exportUserForm(){
      this.btnLoading = true
      getUserExcel(this.userInfo.companyId).then((res)=>{
        if (!res.data.url) return;
        this.workflow.downloadFile(res.data.url);
        this.btnLoading = false;
        console.log("🚀 ~ file: index.vue ~ line 151 ~ exportInfo ~ res", res)
      })
    },
    uploadForm() {
      this.importFormVisible = true
      this.$nextTick(() => {
        this.$refs.importForm.init()
      })
    },
    handleResetPwd(id, account) {
      this.resetFormVisible = true
      this.$nextTick(() => {
        this.$refs.ResetPwdForm.init(id, account)
      })
    },
    checkIsReleaseMessage(){
      isReleaseMessage().then((res) => {
        this.isShowExport = res.data;
      })
    }
  }
}
</script>
