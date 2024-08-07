<template>
  <el-drawer title="字典分类管理" :visible.sync="drawer" :wrapperClosable="false" ref="drawer"
    size="700px" :before-close="handleDrawerClose" class="WORKFLOW-common-drawer">
    <div class="WORKFLOW-flex-main">
      <div class="WORKFLOW-common-head">
        <topOpts @refresh="getDictionaryTypeList()" @add="addOrUpdateHandle()">
          <upload-btn url="/api/system/DictionaryData/Action/Import"
            @on-success="getDictionaryTypeList" />
        </topOpts>
        <div class="WORKFLOW-common-head-right">
          <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
            <el-link icon="icon-ym icon-ym-Refresh
              WORKFLOW-common-head-icon" :underline="false" @click="reset()" />
          </el-tooltip>
        </div>
      </div>
      <WORKFLOW-table v-loading="listLoading" :data="tableData" row-key="id" default-expand-all
        :tree-props="{children: 'children', hasChildren: ''}">
        <el-table-column prop="fullName" label="名称" />
        <el-table-column prop="enCode" label="编码" />
        <el-table-column prop="sortCode" label="排序" width="70" align="center" />
        <el-table-column prop="isTree" label="是否树" width="60" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isTree === 1" type="success" size="mini">是</el-tag>
            <el-tag v-else type="danger" size="mini">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
              <el-button size="mini" type="text" @click="exportData(scope.row.id)">导出
              </el-button>
            </tableOpts>
          </template>
        </el-table-column>
      </WORKFLOW-table>
      <TypeForm v-if="typeFormVisible" ref="TypeForm" @refreshDataList="getDictionaryTypeList" />
    </div>
  </el-drawer>
</template>
<script>
import {
  getDictionaryType,
  delDictionaryType,
  exportData
} from '@/api/systemData/dictionary'
import TypeForm from './Form'

export default {
  components: {
    TypeForm
  },
  data() {
    return {
      drawer: false,
      listLoading: false,
      btnLoading: false,
      typeFormVisible: false,
      tableData: []
    }
  },
  methods: {
    init() {
      this.drawer = true
      this.$nextTick(() => {
        this.getDictionaryTypeList()
      })
    },
    getDictionaryTypeList() {
      this.listLoading = true
      getDictionaryType().then(res => {
        this.tableData = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    addOrUpdateHandle(id) {
      this.typeFormVisible = true
      this.$nextTick(() => {
        this.$refs.TypeForm.init(id)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delDictionaryType(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.$store.commit('base/SET_DICTIONARY_LIST', [])
              this.getDictionaryTypeList()
            }
          })
        })
      }).catch(() => { })
    },
    reset() {
      this.getDictionaryTypeList()
    },
    handleDrawerClose(done) {
      done();
      this.$emit('refreshDataList')
    },
    exportData(id) {
      this.$confirm('您确定要导出该字典分类, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportData(id).then(res => {
          this.workflow.downloadFile(res.data.url)
        })
      }).catch(() => { });
    }
  }
}
</script>
