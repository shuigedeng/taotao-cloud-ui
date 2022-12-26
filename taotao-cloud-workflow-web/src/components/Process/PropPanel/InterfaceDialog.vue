<template>
  <div class="popupSelect-container">
    <div class="el-select" @click="openDialog">
      <el-input placeholder="请选择接口模板" v-model="title" readonly :validate-event="false"
        @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false">
        <template slot="suffix">
          <i v-show="!showClose"
            :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up']"></i>
          <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close"
            @click.stop="clear"></i>
        </template>
      </el-input>
    </div>
    <el-dialog title="接口模板" :close-on-click-modal="false" :visible.sync="visible"
      class="JNPF-dialog JNPF-dialog_center JNPF-dialog-tree-select" lock-scroll append-to-body
      width="1000px">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-left">
          <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
            <el-tree ref="treeBox" :data="treeData" :props="defaultProps" default-expand-all
              highlight-current :expand-on-click-node="false" node-key="id"
              @node-click="handleNodeClick" class="JNPF-common-el-tree" />
          </el-scrollbar>
        </div>
        <div class="JNPF-common-layout-center">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="8">
                <el-form-item label="关键词">
                  <el-input v-model="query.keyword" placeholder="请输入关键词查询" clearable
                    @keyup.enter.native="search()" class="search-input" />
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="!dataType">
                <el-form-item label="类型">
                  <el-select v-model="query.dataType" placeholder="请选择" clearable>
                    <el-option label="SQL操作" :value="1"></el-option>
                    <el-option label="静态数据" :value="2"></el-option>
                    <el-option label="Api数据" :value="3"></el-option>
                  </el-select>
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
                  @click="initData()" />
              </el-tooltip>
            </div>
          </el-row>
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <JNPF-table v-loading="listLoading" :data="list" :border="false" highlight-current-row
              @row-click="rowClick" :hasNO="false">
              <el-table-column width="35">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.id" v-model="checked">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column type="expand" width="40">
                <template slot-scope="scope">
                  <el-table :data="scope.row.templateJson" size='mini'>
                    <el-table-column prop="field" label="参数名称(说明)">
                      <template slot-scope="scope">
                        <p>
                          <span class="required-sign">{{scope.row.required?'*':''}}</span>
                          {{scope.row.field}}{{scope.row.fieldName?'('+scope.row.fieldName+')':''}}
                        </p>
                      </template>
                    </el-table-column>
                    <el-table-column prop="dataType" label="参数类型" width="200">
                      <template slot-scope="scope">
                        <span v-if="scope.row.dataType === 'varchar'">字符串</span>
                        <span v-if="scope.row.dataType === 'int'">整型</span>
                        <span v-if="scope.row.dataType === 'datetime'">日期时间</span>
                        <span v-if="scope.row.dataType === 'decimal'">浮点</span>
                        <span v-if="scope.row.dataType === 'bigint'">长整型</span>
                        <span v-if="scope.row.dataType === 'text'">文本</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="defaultValue" label="默认值" width="200" />
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column type="index" width="50" label="序号" align="center" />
              <el-table-column prop="fullName" label="名称" />
              <el-table-column prop="enCode" label="编码" />
              <el-table-column prop="dataType" label="类型" width="100" />
              <el-table-column prop="requestMethod" label="动作" width="100" />
            </JNPF-table>
            <pagination :total="total" :page.sync="listQuery.currentPage"
              :limit.sync="listQuery.pageSize" @pagination="initData" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
        <el-button type="primary" @click="select()">{{$t('common.confirmButton')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDataInterfaceTypeSelector, getDataInterfaceSelectorList } from '@/api/systemData/dataInterface'
export default {
  props: {
    value: {
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    dataType: {
      type: Number,
      default: 0
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      list: [],
      innerValue: '',
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      checked: '',
      checkedRow: {},
      listLoading: false,
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      query: {
        categoryId: '',
        keyword: '',
        dataType: null,
      },
      treeLoading: false,
      treeData: [],
      inputHovering: false,
      visible: false
    }
  },
  computed: {
    showClose() {
      let hasValue = this.value !== undefined && this.value !== null && this.value !== '';
      let criteria = this.clearable &&
        !this.disabled &&
        this.inputHovering &&
        hasValue;
      return criteria;
    }
  },
  methods: {
    initData() {
      this.listLoading = true
      const query = {
        ...this.listQuery,
        ...this.query,
        dataType: this.dataType === 0 ? this.query.dataType : this.dataType
      }
      getDataInterfaceSelectorList(query).then(res => {
        this.list = res.data.list.map(o => {
          let templateJson = o.requestParameters ? JSON.parse(o.requestParameters) : []
          if (!templateJson) templateJson = []
          let item = { templateJson, ...o }
          return item
        })
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    handleNodeClick(data) {
      if (this.query.categoryId === data.id) return
      this.query.categoryId = data.id
      this.reset()
    },
    reset() {
      this.query.keyword = ''
      this.query.dataType = null
      this.search()
    },
    search() {
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.listQuery.sort = 'desc'
      this.initData()
    },
    openDialog() {
      if (this.disabled) return
      this.checked = this.value
      this.visible = true
      this.treeLoading = true
      this.listLoading = true
      getDataInterfaceTypeSelector().then(res => {
        this.treeData = res.data.list
        if (!this.treeData.length) return this.treeLoading = false
        this.$nextTick(() => {
          this.query.categoryId = this.treeData[0].id
          this.$refs.treeBox.setCurrentKey(this.query.categoryId)
          this.treeLoading = false
          this.reset()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    clear() {
      this.checked = ''
      this.checkedRow = {}
      this.$emit('input', this.checked)
      this.$emit('change', this.checked, this.checkedRow)
    },
    select() {
      if (!this.checked) return
      this.$emit('input', this.checked)
      this.$emit('change', this.checked, this.checkedRow)
      this.visible = false
    },
    rowClick(row) {
      this.checked = row.id
      this.checkedRow = row
    }
  }
}
</script>
<style lang="scss">
.template-item {
  line-height: 30px;
}
</style>