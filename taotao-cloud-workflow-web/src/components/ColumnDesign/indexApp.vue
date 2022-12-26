<template>
  <div class="columnDesign-container">
    <div class="main-board">
      <div class="sort-box">
        <h4 class="cap">排序查询</h4>
        <el-table :data="columnData.sortList" class="JNPF-common-table" ref="dragTableSort"
          :row-key="row=>row.prop">
          <el-table-column align="center" label="拖动" width="50">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px"
                title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="列名" />
          <el-table-column prop="prop" label="字段" />
        </el-table>
      </div>
      <el-divider></el-divider>
      <div class="search-box">
        <h4 class="cap">查询条件</h4>
        <el-table :data="columnData.searchList" class="JNPF-common-table" ref="dragTableSearch"
          :row-key="row=>row.prop">
          <el-table-column align="center" label="拖动" width="50">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px"
                title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="列名" />
          <el-table-column prop="prop" label="字段" />
          <el-table-column prop="searchType" label="类型">
            <template slot-scope="scope">
              {{scope.row.searchType===3?'范围查询':scope.row.searchType===2?'模糊查询':'等于查询'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider></el-divider>
      <div class="column-box">
        <h4 class="cap">列表字段</h4>
        <el-table :data="columnData.columnList" class="JNPF-common-table" ref="dragTable"
          :row-key="row=>row.prop">
          <el-table-column align="center" label="拖动" width="50">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px"
                title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="列名" />
          <el-table-column prop="prop" label="字段" />
        </el-table>
      </div>
    </div>
    <div class="right-board">
      <el-tabs v-model="currentTab" class="top-tabs top-tabs_app">
        <el-tab-pane label="排序字段" name="sort" />
        <el-tab-pane label="查询字段" name="search" />
        <el-tab-pane label="列表字段" name="field" />
        <el-tab-pane label="列表属性" name="column" />
      </el-tabs>
      <div class="field-box">
        <div class="columnList" v-show="currentTab==='sort'">
          <el-table :data="sortOptions" class="JNPF-common-table" height="100%"
            @selection-change="sortSelectionChange" ref="sortTable">
            <el-table-column prop="label" label="排序字段" />
            <el-table-column type="selection" width="55" align="center" />
          </el-table>
        </div>
        <div class="columnList" v-show="currentTab==='search'">
          <el-table :data="searchOptions" class="JNPF-common-table" height="100%"
            @selection-change="searchSelectionChange" ref="searchTable">
            <el-table-column prop="label" label="查询字段" />
            <el-table-column type="selection" width="55" align="center" />
          </el-table>
        </div>
        <div class="columnList" v-show="currentTab==='field'">
          <el-table :data="columnOptions" class="JNPF-common-table" height="100%"
            @selection-change="columnSelectionChange" ref="columnTable">
            <el-table-column prop="label" label="列表字段" />
            <el-table-column type="selection" width="55" align="center" />
          </el-table>
        </div>
        <el-scrollbar class="right-scrollbar" v-show="currentTab==='column'">
          <div class="setting-box">
            <el-form :model="columnData" label-width="80px">
              <el-divider>排序设置</el-divider>
              <el-form-item label="排序字段">
                <el-select v-model="columnData.defaultSidx" placeholder="请选择排序字段" clearable>
                  <el-option :label="item.__config__.label" :value="item.__vModel__"
                    v-for="(item, i) in list" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序类型">
                <el-select v-model="columnData.sort" placeholder="请选择排序类型">
                  <el-option label="升序" value="asc"></el-option>
                  <el-option label="降序" value="desc"></el-option>
                </el-select>
              </el-form-item>
              <el-divider>分页设置</el-divider>
              <el-form-item label="列表分页">
                <el-switch v-model="columnData.hasPage"></el-switch>
              </el-form-item>
              <el-form-item label="分页条数">
                <el-radio-group v-model="columnData.pageSize">
                  <el-radio-button :label="20">20条</el-radio-button>
                  <el-radio-button :label="50">50条</el-radio-button>
                  <el-radio-button :label="100">100条</el-radio-button>
                  <el-radio-button :label="500">500条</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-divider>按钮配置</el-divider>
              <el-checkbox-group v-model="btnsList" class="btnsList">
                <el-checkbox :label="item.value" v-for="item in btnsOption" :key="item.value">
                  <span class="btn-label">{{ item.value | btnText }}</span>
                  <el-input v-model="item.label" />
                </el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-model="columnBtnsList" class="btnsList columnBtnList">
                <el-checkbox :label="item.value" v-for="item in columnBtnsOption" :key="item.value">
                  <span class="btn-label">{{ item.value | btnText }}</span>
                  <el-input v-model="item.label" />
                </el-checkbox>
              </el-checkbox-group>
              <el-divider>权限设置</el-divider>
              <el-form-item label="按钮权限">
                <el-switch v-model="columnData.useBtnPermission"></el-switch>
              </el-form-item>
              <el-form-item label="列表权限">
                <el-switch v-model="columnData.useColumnPermission"></el-switch>
              </el-form-item>
              <el-form-item label="数据权限">
                <el-switch v-model="columnData.useDataPermission"></el-switch>
              </el-form-item>
              <el-form-item label="表单权限">
                <el-switch v-model="columnData.useFormPermission"></el-switch>
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import { getDrawingList } from '@/components/Generator/utils/db'
import { deepClone } from '@/utils'
import { noColumnShowList, noSearchList, useInputList, useDateList } from '@/components/Generator/generator/comConfig'
const getSearchType = item => {
  const jnpfKey = item.__config__.jnpfKey
  // 等于-1  模糊-2  范围-3
  const fuzzyList = [...useInputList]
  const RangeList = [...useDateList, 'time', 'date', 'numInput', 'calculate']
  if (RangeList.includes(jnpfKey)) return 3
  if (fuzzyList.includes(jnpfKey)) return 2
  return 1
}
const defaultColumnData = {
  searchList: [], // 查询条件
  columnList: [], // 字段列表
  sortList: [], // 排序列表
  // type: 1, //列表类型
  defaultSidx: '', // 默认排序字段
  sort: 'desc',   // 排序类型
  hasPage: true,  // 列表分页
  pageSize: 20,  // 分页条数
  useColumnPermission: false,
  useFormPermission: false,
  useBtnPermission: false,
  useDataPermission: false,
  btnsList: [
    { value: 'add', icon: 'el-icon-plus', label: '新增' }
  ],  // 按钮
  columnBtnsList: [
    { value: 'edit', icon: 'el-icon-edit', label: '编辑' },
    { value: 'remove', icon: 'el-icon-delete', label: '删除' }
  ] // 列按钮
}
export default {
  name: 'columnDesign',
  props: {
    conf: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      currentTab: 'column',
      alignOptions: ['left', 'center', 'right'],
      list: [],
      columnData: JSON.parse(JSON.stringify(defaultColumnData)),
      btnsOption: [
        { value: 'add', icon: 'el-icon-plus', label: '新增' }
      ],
      columnBtnsOption: [
        { value: 'detail', icon: 'el-icon-tickets', label: '详情' },
        { value: 'edit', icon: 'el-icon-edit', label: '编辑' },
        { value: 'remove', icon: 'el-icon-delete', label: '删除' }
      ],
      columnOptions: [],
      searchOptions: [],
      sortOptions: [],
      sortList: [],
      btnsList: [],
      columnBtnsList: [],
    }
  },
  filters: {
    btnText(key) {
      let text = ''
      switch (key) {
        case 'edit':
          text = '编辑'
          break;
        case 'remove':
          text = '删除'
          break;
        case 'detail':
          text = '详情'
          break;
        default:
          text = '新增'
          break;
      }
      return text
    }
  },
  watch: {
    btnsList(val) {
      let list = []
      outer: for (let i = 0; i < this.btnsOption.length; i++) {
        inter: for (let ii = 0; ii < val.length; ii++) {
          if (val[ii] === this.btnsOption[i].value) {
            list.push(this.btnsOption[i])
            break inter;
          }
        }
      }
      this.columnData.btnsList = list
    },
    columnBtnsList(val) {
      let list = []
      outer: for (let i = 0; i < this.columnBtnsOption.length; i++) {
        inter: for (let ii = 0; ii < val.length; ii++) {
          if (val[ii] === this.columnBtnsOption[i].value) {
            list.push(this.columnBtnsOption[i])
            break inter;
          }
        }
      }
      this.columnData.columnBtnsList = list
    },
  },
  created() {
    let list = []
    let list1 = []
    const loop = (data, parent) => {
      if (!data) return
      if (data.__config__ && data.__config__.jnpfKey !== 'table' && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data)
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent))
      if (data.__config__ && data.__config__.jnpfKey) {
        if (data.__config__.layout === "colFormItem" && data.__vModel__) {
          list.push(data)
        }
        if (data.__config__.layout === "colFormItem" && data.__vModel__ && data.__vModel__.indexOf('_jnpf_') < 0) {
          list1.push(data)
        }
      }
    }
    loop(getDrawingList())
    this.list = list
    let options = list.filter(o => noColumnShowList.indexOf(o.__config__.jnpfKey) < 0)
    let searchOptions = list.filter(o => noSearchList.indexOf(o.__config__.jnpfKey) < 0)
    let sortOptions = list1.filter(o => noColumnShowList.indexOf(o.__config__.jnpfKey) < 0)
    this.columnOptions = options.map(o => ({
      label: o.__config__.label,
      prop: o.__vModel__
    }));
    this.searchOptions = searchOptions.map(o => ({
      label: o.__config__.label,
      prop: o.__vModel__,
      jnpfKey: o.__config__.jnpfKey,
      searchType: getSearchType(o),
      ...o
    }));
    this.sortOptions = sortOptions.map(o => ({
      label: o.__config__.label,
      prop: o.__vModel__
    }));
    if (typeof this.conf === 'object' && this.conf !== null) {
      this.columnData = Object.assign({}, defaultColumnData, this.conf)
    }
    if (!this.columnOptions.length) this.columnData.columnList = []
    if (!this.searchOptions.length) this.columnData.searchList = []
    if (!this.sortOptions.length) this.columnData.sortList = []
    this.setBtnValue(this.columnData.btnsList, this.btnsOption)
    this.setBtnValue(this.columnData.columnBtnsList, this.columnBtnsOption)
    this.btnsList = this.columnData.btnsList.map(o => o.value)
    this.columnBtnsList = this.columnData.columnBtnsList.map(o => o.value)
  },
  mounted() {
    this.setSort()
    this.$nextTick(() => {
      this.setListValue(this.columnData.columnList, this.columnOptions, 'column')
      this.setListValue(this.columnData.searchList, this.searchOptions, 'search')
      this.setListValue(this.columnData.sortList, this.sortOptions, 'sort')
    })
  },
  methods: {
    setBtnValue(replacedData, data, key) {
      key = key ? key : 'value'
      outer: for (let i = 0; i < replacedData.length; i++) {
        inter: for (let ii = 0; ii < data.length; ii++) {
          if (replacedData[i][key] === data[ii][key]) {
            data[ii] = replacedData[i]
            break inter
          }
        }
      }
    },
    setListValue(replacedData, data, type) {
      const key = 'prop'
      let res = []
      outer: for (let i = 0; i < replacedData.length; i++) {
        inter: for (let ii = 0; ii < data.length; ii++) {
          if (replacedData[i][key] === data[ii][key]) {
            res.push(data[ii])
            break inter
          }
        }
      }
      res.forEach(row => {
        this.$refs[type + 'Table'].toggleRowSelection(row, true)
      })
    },
    /**
      * 供父组件使用 获取列表JSON
    */
    getData() {
      return new Promise((resolve, reject) => {
        if (!this.columnData.columnList.length) {
          reject({ msg: '列表字段不允许为空', target: 2 })
          return
        }
        resolve({ columnData: this.columnData, target: 2 })
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.columnData.columnList.splice(evt.oldIndex, 1)[0]
          this.columnData.columnList.splice(evt.newIndex, 0, targetRow)
        },
        handle: '.drag-handler',
      })
      const el1 = this.$refs.dragTableSort.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      Sortable.create(el1, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.columnData.sortList.splice(evt.oldIndex, 1)[0]
          this.columnData.sortList.splice(evt.newIndex, 0, targetRow)
        },
        handle: '.drag-handler',
      })
      const el2 = this.$refs.dragTableSearch.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      Sortable.create(el2, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.columnData.searchList.splice(evt.oldIndex, 1)[0]
          this.columnData.searchList.splice(evt.newIndex, 0, targetRow)
        },
        handle: '.drag-handler',
      })
    },
    sortSelectionChange(val) {
      this.$set(this.columnData, 'sortList', val)
    },
    searchSelectionChange(val) {
      this.$set(this.columnData, 'searchList', val)
    },
    columnSelectionChange(val) {
      this.$set(this.columnData, 'columnList', val)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>