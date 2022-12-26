<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="数据库">
              <el-select v-model="dataBase" placeholder="请选择数据库">
                <el-option-group v-for="group in dbOptions" :key="group.fullName"
                  :label="group.fullName">
                  <el-option v-for="item in group.children" :key="item.id" :label="item.fullName"
                    :value="item.id" />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="keyword" placeholder="请输入关键词查询" clearable
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
          <topOpts @add="addOrUpdateHandle()" addText="新建表名">
            <upload-btn :url="'/api/system/DataModel/'+dataBase+'/Action/Import'"
              @on-success="getTabelData" />
            <el-button type="text" icon="el-icon-menu" @click="handleFieldsManage()">常用字段
            </el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="reset()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" @expand-change="expandChange"
          :hasNO="false">
          <el-table-column type="expand" width="40">
            <template slot-scope="props">
              <el-table v-loading="props.row.childTableLoading" :data="props.row.childTable" stripe
                size='mini'>
                <el-table-column prop="field" label="字段" />
                <el-table-column prop="fieldName" label="说明" />
                <el-table-column prop="dataType" label="类型" />
                <el-table-column prop="dataLength" label="长度" />
                <el-table-column prop="allowNull" label="允许空">
                  <template slot-scope="scope">
                    <el-checkbox :value='!!scope.row.allowNull' />
                  </template>
                </el-table-column>
                <el-table-column prop="defaults" label="默认值" />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50" label="序号" align="center" />
          <el-table-column prop="table" label="表名" sortable />
          <el-table-column prop="sum" label="总数" width="150" sortable />
          <el-table-column prop="tableName" label="说明" width="200" sortable />
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.table)"
                @del="handleDel(scope.$index,scope.row.table)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button size="mini" type="text">
                      {{$t('common.moreBtn')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="openData(scope.row.table)">
                      打开数据
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="exportTpl(scope.row.table)">
                      导出
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>
    <Form v-show="formVisible" ref="Form" @close="closeForm" />
    <Preview v-show="showData" ref="preview" @close="closeData" />
    <FieldsList v-if="drawer" ref="fieldsList" />
  </div>
</template>

<script>
import { getDataSourceListAll } from '@/api/systemData/dataSource'
import { DataModelList, DataModelDelete, DataModelFieldList, exportTpl } from '@/api/systemData/dataModel'
import Form from './Form'
import Preview from './Preview'
import FieldsList from './fields/index'
export default {
  name: 'systemData-dataModel',
  components: { Form, Preview, FieldsList },
  data() {
    return {
      keyword: '',
      list: [],
      formVisible: false,
      dataBase: '0',
      dbOptions: [],
      listLoading: false,
      childTableLoading: false,
      showData: false,
      drawer: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    search() {
      this.getTabelData()
    },
    reset() {
      this.keyword = ''
      this.getTabelData()
    },
    initData() {
      this.listLoading = true
      getDataSourceListAll().then(res => {
        const defaultItem = {
          fullName: '',
          children: [{
            fullName: '默认数据库',
            id: '0'
          }]
        }
        const list = [defaultItem, ...res.data.list]
        this.dbOptions = list.filter(o => o.children && o.children.length)
        this.getTabelData()
      })
    },
    getTabelData() {
      this.listLoading = true
      DataModelList(this.dataBase, { keyword: this.keyword }).then(res => {
        this.list = res.data.list
        for (let i = 0; i < this.list.length; i++) {
          this.$set(this.list[i], 'isExpanded', false)
          this.$set(this.list[i], 'childTableLoading', false)
          this.$set(this.list[i], 'childTable', [])
        }
        this.listLoading = false
      })
    },
    handleDel(index, tableName) {
      this.$confirm('您确定要删除这些数据吗, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        this.asyncDel(index, tableName);
      }).catch(() => { });
    },
    asyncDel(index, tableName) {
      DataModelDelete(this.dataBase, tableName).then(res => {
        this.list.splice(index, 1);
        this.$message({
          type: 'success',
          message: res.msg
        });
      })
    },
    exportTpl(id) {
      this.$confirm('您确定要导出该表, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportTpl(this.dataBase, id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.dataBase, id)
      })
    },
    expandChange(rows) {
      rows.isExpanded = !rows.isExpanded
      if (!rows.isExpanded) return
      if (rows.childTable.length) return
      rows.childTableLoading = true
      DataModelFieldList(this.dataBase, rows.table).then(res => {
        rows.childTableLoading = false
        rows.childTable = res.data.list
      }).catch(() => {
        rows.childTableLoading = false
      })
    },
    closeData() {
      this.showData = false
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.getTabelData()
      }
    },
    openData(table) {
      this.showData = true
      this.$nextTick(() => {
        this.$refs.preview.init(this.dataBase, table)
      })
    },
    handleFieldsManage() {
      this.drawer = true
      this.$nextTick(() => {
        this.$refs.fieldsList.init()
      })
    },
  }
}
</script>