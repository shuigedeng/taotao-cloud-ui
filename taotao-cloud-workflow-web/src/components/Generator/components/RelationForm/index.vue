<template>
  <div class="popupSelect-container">
    <div class="el-select" @click="openDialog">
      <el-input :placeholder="placeholder" v-model="innerValue" readonly :validate-event="false"
        @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false">
        <template slot="suffix">
          <i v-show="!showClose"
            :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up']"></i>
          <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close"
            @click.stop="clear"></i>
        </template>
      </el-input>
    </div>
    <el-dialog title="选择数据" :close-on-click-modal="false" :visible.sync="visible" v-if="visible"
      class="JNPF-dialog JNPF-dialog_center" lock-scroll append-to-body width='800px'>
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="10">
            <el-form-item label="关键词">
              <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="search()" class="search-input" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{$t('common.search')}}
              </el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <div class="JNPF-common-search-box-right">
          <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
              @click="reset()" />
          </el-tooltip>
        </div>
      </el-row>
      <JNPF-table v-loading="listLoading" :data="list" :border="false" highlight-current-row
        @row-click="rowClick" :hasNO="false">
        <el-table-column width="35">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="checked">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column :prop="item.value" :label="item.label" v-for="(item,i) in columnOptions"
          :key="i" />
      </JNPF-table>
      <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
        @pagination="initData" v-if="hasPage" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="small">{{$t('common.cancelButton')}}</el-button>
        <el-button type="primary" @click="select()" size="small">{{$t('common.confirmButton')}}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFieldDataSelect, getDataChange } from '@/api/onlineDev/visualDev'
export default {
  name: 'PopupSelect',
  props: {
    value: {
      default: ''
    },
    modelId: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    relationField: {
      type: String,
      default: ''
    },
    field: {
      type: String,
      default: ''
    },
    columnOptions: {
      type: Array,
      default: () => []
    },
    hasPage: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 20
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
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
      checkedTxt: '',
      checkedRow: {},
      listLoading: false,
      inputHovering: false,
      visible: false
    }
  },
  watch: {
    value(val) {
      this.setDefault()
    }
  },
  computed: {
    showClose() {
      let hasValue = this.multiple
        ? Array.isArray(this.value) && this.value.length > 0
        : this.value !== undefined && this.value !== null && this.value !== '';
      let criteria = this.clearable &&
        !this.disabled &&
        this.inputHovering &&
        hasValue;
      return criteria;
    }
  },
  created() {
    this.listQuery.pageSize = this.hasPage ? this.pageSize : 10000
    this.setDefault()
  },
  methods: {
    initData() {
      if (!this.modelId || !this.relationField) return
      this.listLoading = true
      let columnOptionsList = this.columnOptions.map(o => o.value)
      let query = {
        ...this.listQuery,
        relationField: this.relationField,
        columnOptions: columnOptionsList.join(',')
      }
      getFieldDataSelect(this.modelId, query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
        this.setDefault()
      }).catch(() => { this.listLoading = false })
    },
    search() {
      this.initData()
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = this.hasPage ? this.pageSize : 10000
    },
    reset() {
      this.listQuery.keyword = ''
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = this.hasPage ? this.pageSize : 10000
      this.initData()
    },
    openDialog() {
      if (this.disabled) return
      this.checked = this.value
      this.visible = true
      this.reset()
    },
    clear() {
      this.checked = ''
      this.innerValue = ''
      this.checkedRow = {}
      this.$emit('input', this.checked)
      this.$emit('change', this.checked, this.checkedRow)
    },
    select() {
      if (!this.checked) return
      this.innerValue = this.checkedTxt
      this.$emit('input', this.checked)
      this.$emit('change', this.checked, this.checkedRow)
      this.visible = false
    },
    rowClick(row) {
      this.checked = row.id
      this.checkedTxt = row[this.relationField]
      this.checkedRow = row
    },
    setDefault() {
      this.getItemValue(this.value)
    },
    getItemValue(val) {
      if (val) {
        if (!this.modelId) return
        getDataChange(this.modelId, val).then(res => {
          if (!res.data || !res.data.data) return
          let data = JSON.parse(res.data.data)
          this.innerValue = data[this.relationField]
          if (!this.field) return
          let relationData = this.$store.state.generator.relationData
          this.$set(relationData, this.field, data)
          this.$store.commit('generator/UPDATE_RELATION_DATA', relationData)
        })
      } else {
        this.innerValue = ''
        if (!this.field) return
        let relationData = this.$store.state.generator.relationData
        this.$set(relationData, this.field, {})
        this.$store.commit('generator/UPDATE_RELATION_DATA', relationData)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  height: 70vh;
  padding: 0 0 10px !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .JNPF-common-search-box {
    margin-bottom: 0;
    .JNPF-common-search-box-right {
      padding: 10px 10px 0 0;
    }
  }
}
</style>