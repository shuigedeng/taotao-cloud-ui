<template>
  <el-dialog title="选择产品" :close-on-click-modal="false" :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center JNPF-dialog-tree-select" lock-scroll append-to-body
    width="1000px">
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-left">
        <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
          <el-tree ref="treeBox" :data="treeData" :props="defaultProps" default-expand-all
            highlight-current :expand-on-click-node="false" node-key="id"
            @node-click="handleNodeClick" class="JNPF-common-el-tree">
            <span class="custom-tree-node" slot-scope="{ node }">
              <i class="el-icon-notebook-2" />
              <span class="text">{{node.label}}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="JNPF-common-layout-center">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="产品编号">
                <el-input v-model="query.code" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="产品名称">
                <el-input v-model="query.fullName" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-form>
          <div class="JNPF-common-search-box-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="refresh()" />
            </el-tooltip>
          </div>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="list" hasC
            @selection-change="handleSelectionChange" :border="false">
            <el-table-column prop="code" label="产品编码" />
            <el-table-column prop="fullName" label="产品名称" />
            <el-table-column prop="qty" label="库存" />
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.currentPage"
            :limit.sync="listQuery.pageSize" @pagination="getGoodsList" />
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="select()">{{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getGoodsList, getProductClassify } from '@/api/extend/saleOrder'
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      treeLoading: false,
      treeData: [],
      visible: false,
      listLoading: true,
      query: {
        classifyId: '',
        code: '',
        fullName: '',
      },
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      list: [],
      total: 0,
      checked: []
    }
  },
  methods: {
    init() {
      this.visible = true
      this.listLoading = true
      this.getProductClassify()
    },
    getProductClassify() {
      this.treeLoading = true
      getProductClassify().then(res => {
        this.treeData = res.data.list
        this.$nextTick(() => {
          this.query.classifyId = this.treeData[0].children[0].id
          this.$refs.treeBox.setCurrentKey(this.query.classifyId)
          this.treeLoading = false
          this.getGoodsList()
        })
      })
    },
    getGoodsList() {
      this.listLoading = true
      const query = {
        ...this.listQuery,
        ...this.query
      }
      getGoodsList(query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    handleNodeClick(data) {
      if (this.query.classifyId === data.id) return
      this.query.classifyId = data.id
      this.reset()
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.getGoodsList()
    },
    refresh() {
      this.getGoodsList()
    },
    select() {
      if (!this.checked.length) return
      this.visible = false
      this.$emit('choice', this.checked)
    },
    handleSelectionChange(val) {
      this.checked = val
    },
    reset() {
      this.query.code = ''
      this.query.fullName = ''
      this.search()
    }
  }
}
</script>