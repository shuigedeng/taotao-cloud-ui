<template>
  <div class="popupSelect-container">
    <div class="el-select" @click="openDialog">
      <el-input placeholder="请选择短信模板" v-model="title" readonly :validate-event="false"
        @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false">
        <template slot="suffix">
          <i v-show="!showClose"
            :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up']"></i>
          <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close"
            @click.stop="clear"></i>
        </template>
      </el-input>
    </div>
    <el-dialog title="短信模板" :close-on-click-modal="false" :visible.sync="visible"
      class="WORKFLOW-dialog WORKFLOW-dialog_center WORKFLOW-dialog-tree-select" lock-scroll append-to-body
      width='600px'>
      <div class="WORKFLOW-common-layout">
        <div class="WORKFLOW-common-layout-center">
          <el-row class="WORKFLOW-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="10">
                <el-form-item label="关键词">
                  <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                    @keyup.enter.native="search()" class="search-input" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                  <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                </el-form-item>
              </el-col>
            </el-form>
            <div class="WORKFLOW-common-search-box-right">
              <el-tooltip effect="dark" content="刷新" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh WORKFLOW-common-head-icon" :underline="false"
                  @click="initData()" />
              </el-tooltip>
            </div>
          </el-row>
          <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main">
            <WORKFLOW-table v-loading="listLoading" :data="list" :border="false" highlight-current-row
              @row-click="rowClick" :hasNO="false">
              <el-table-column width="35">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.id" v-model="checked">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column type="index" width="50" label="序号" align="center" />
              <el-table-column prop="templateName" label="模板名称" show-overflow-tooltip
                min-width="150" />
              <el-table-column prop="templateId" label="模板编号" width="200" />
              <el-table-column prop="signContent" label="签名内容" show-overflow-tooltip />
            </WORKFLOW-table>
            <pagination :total="total" :page.sync="listQuery.currentPage"
              :limit.sync="listQuery.pageSize" @pagination="initData" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="small">{{$t('common.cancelButton')}}</el-button>
        <el-button type="primary" @click="select()" size="small">{{$t('common.confirmButton')}}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSelector } from '@/api/system/smsTemplate'
export default {
  name: 'PopupSelect',
  props: {
    value: {
      default: ''
    },
    title: {
      type: String,
      default: ''
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
        keyword: '',
        currentPage: 1,
        pageSize: 20
      },
      total: 0,
      checked: '',
      checkedRow: {},
      listLoading: false,
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
      getSelector(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    openDialog() {
      if (this.disabled) return
      this.checked = this.value
      this.visible = true
      this.reset()
    },
    reset() {
      this.listQuery.keyword = ''
      this.search()
    },
    search() {
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.initData()
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
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 70vh;
  padding: 0 0 10px !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .WORKFLOW-common-search-box {
    margin-bottom: 0;
    .WORKFLOW-common-search-box-right {
      padding: 10px 10px 0 0;
    }
  }
}
</style>
