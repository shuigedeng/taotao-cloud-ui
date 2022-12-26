<template>
  <div class="JNPF-preview-main flow-form-main">
    <div class="JNPF-common-page-header">
      <el-page-header @back="goBack" content="" />
      <el-steps :active="active" finish-status="success" simple class="steps">
        <el-step title="基本信息"></el-step>
        <el-step title="数据配置"></el-step>
      </el-steps>
      <div class="options">
        <el-button :disabled="active <= 0" @click="handlePrevStep">{{$t('common.prev')}}
        </el-button>
        <el-button :disabled="active >= 1" @click="handleNextStep">{{$t('common.next')}}
        </el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="active < 1"
          @click="dataFormSubmit()">{{$t('common.confirmButton')}}</el-button>
        <el-button @click="goBack">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" v-loading="formLoading"
      label-width="100px" v-if="active === 0">
      <el-row>
        <el-col :span="14" :offset="5" class="baseInfo mt-20">
          <el-form-item label="名称" prop="fullName">
            <el-input v-model="dataForm.fullName" placeholder="输入名称" maxlength="50" />
          </el-form-item>
          <el-form-item label="编码" prop="enCode">
            <el-input v-model="dataForm.enCode" placeholder="输入编码" maxlength="50" />
          </el-form-item>
          <el-form-item label="分类" prop="categoryId">
            <JNPF-TreeSelect v-model="dataForm.categoryId" :options="selectData" placeholder="选择分类"
              clearable />
          </el-form-item>
          <el-form-item label="授权" prop="checkType">
            <el-radio-group v-model="dataForm.checkType">
              <el-radio :label="0">忽略验证</el-radio>
              <el-radio :label="1">鉴权验证</el-radio>
              <el-radio :label="2">跨域验证</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="ipAddress" v-if="dataForm.checkType===2">
            <el-input v-model="dataForm.ipAddress" placeholder="请输入域名，多个域名用逗号隔开" />
          </el-form-item>
          <el-form-item label="类型" prop="dataType">
            <el-radio-group v-model="dataForm.dataType" @change="onDataTypeChange">
              <el-radio :label="2">静态数据</el-radio>
              <el-radio :label="1">SQL操作</el-radio>
              <el-radio :label="3">Api数据</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="动作" prop="requestMethod" v-if="dataForm.dataType===1">
            <el-radio-group v-model="dataForm.requestMethod" @change="onMethodChange($event,'sql')">
              <el-radio label="3">查询</el-radio>
              <el-radio label="1">增加</el-radio>
              <el-radio label="2">修改</el-radio>
              <el-radio label="4">删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="动作" prop="requestMethod" v-if="dataForm.dataType===3">
            <el-radio-group v-model="dataForm.requestMethod" @change="onMethodChange($event,'api')">
              <el-radio label="6">GET请求</el-radio>
              <el-radio label="7">POST请求</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="sortCode">
            <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode"
              controls-position="right" />
          </el-form-item>
          <el-form-item label="状态" prop="enabledMark">
            <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="说明" prop="description">
            <el-input v-model="dataForm.description" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="config" v-if="active === 1 && dataForm.dataType === 1">
      <div class="tableData">
        <el-select v-model="dataForm.dbLinkId" filterable placeholder="选择数据库" style="width: 100%"
          @change="handleSelectTable">
          <el-option-group v-for="group in dbOptions" :key="group.fullName" :label="group.fullName">
            <el-option v-for="item in group.children" :key="item.id" :label="item.fullName"
              :value="item.id" />
          </el-option-group>
        </el-select>
        <div class="box">
          <el-tree :data="treeData" node-key="index" v-loading="treeLoading" :props="defaultProps"
            @node-click="handleNodeClick" />
        </div>
      </div>
      <div class="detail">
        <el-tabs v-model="activeName">
          <el-tab-pane label="查询SQL" name="query">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px">
              <el-form-item label-width="0" prop="query">
                <div class="sql-box">
                  <SQLEditor v-model="dataForm.query" :options="sqlOptions" ref="SQLEditorRef" />
                </div>
              </el-form-item>
            </el-form>
            <div class="tips">
              <p><span>@user</span>当前用户</p>
              <p><span>@organize</span>当前用户所在公司</p>
              <p><span>@department</span>当前用户所在部门</p>
              <p><span>@position</span>当前用户所在岗位</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right-pane">
        <div class="right-pane-list">
          <div class="cap">
            <span>参数定义</span>
          </div>
          <div class="list">
            <el-table :data="requestParameters" ref="dragTable" row-key="id" size='mini'
              height="100%">
              <el-table-column align="center" label="拖动" width="50">
                <template>
                  <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px"
                    title='点击拖动' />
                </template>
              </el-table-column>
              <el-table-column prop="field" label="参数名称(说明)">
                <template slot-scope="scope">
                  <p @click="handleItemClick(scope.row)" style="cursor:pointer">
                    <span class="required-sign">{{scope.row.required?'*':''}}</span>
                    {{scope.row.field}}{{scope.row.fieldName?'('+scope.row.fieldName+')':''}}
                  </p>
                </template>
              </el-table-column>
              <el-table-column prop="dataType" label="参数类型" width="70">
                <template slot-scope="scope">
                  <span v-if="scope.row.dataType === 'varchar'">字符串</span>
                  <span v-if="scope.row.dataType === 'int'">整型</span>
                  <span v-if="scope.row.dataType === 'datetime'">日期时间</span>
                  <span v-if="scope.row.dataType === 'decimal'">浮点</span>
                  <span v-if="scope.row.dataType === 'bigint'">长整型</span>
                  <span v-if="scope.row.dataType === 'text'">文本</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                  <el-button type="text" @click="addOrUpdateHandle(scope.row)"
                    icon="el-icon-edit-outline"></el-button>
                  <el-button type="text" class="JNPF-table-delBtn" icon="el-icon-delete"
                    @click="removeParameter(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-actions" @click="addOrUpdateHandle()">
            <el-button type="text" icon="el-icon-plus">添加参数</el-button>
          </div>
        </div>
        <div class="right-pane-btn">
          <el-button @click="editFunc()">接口数据处理</el-button>
        </div>
      </div>
    </div>
    <div class="staticData" v-if="active === 1 && dataForm.dataType === 2">
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px">
        <el-form-item label-width="0" prop="query">
          <div class="json-box">
            <JSONEditor v-model="dataForm.query" :options="jsonOptions" ref="JSONEditorRef" />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px"
      v-if="active === 1 && dataForm.dataType === 3">
      <el-row>
        <el-col :span="14" :offset="5" class="mt-20 baseInfo">
          <el-form-item label="接口路径" prop="path" maxlength="50">
            <el-input v-model="dataForm.path" placeholder="输入接口路径">
              <template slot="prepend">{{dataForm.requestMethod=='6'?'GET':'POST'}}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="接口headers" prop="requestHeaders">
            <el-button @click="addHeaders()" class="el-icon-plus" size="mini">添加headers
            </el-button>
            <el-row v-for="(item, index) in requestHeaders" :key="item.index" class="mt-10">
              <el-col :span="10">
                <el-autocomplete v-model="item.field" :fetch-suggestions="querySearch"
                  placeholder="key" clearable style="width:100%" />
              </el-col>
              <el-col :span="10" :offset="1">
                <el-input v-model="item.defaultValue" placeholder="value" clearable />
              </el-col>
              <el-col :span="2" :offset="1">
                <el-button type="danger" icon="el-icon-close" @click="removeHeaders(index)">
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="接口参数">
            <el-button @click="addOrUpdateHandle()" class="el-icon-plus" size="mini">添加参数
            </el-button>
          </el-form-item>
          <div class="parameterList">
            <el-table :data="requestParameters" ref="dragTable" row-key="id" size='mini'>
              <el-table-column align="center" label="拖动" width="50">
                <template>
                  <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px"
                    title='点击拖动' />
                </template>
              </el-table-column>
              <el-table-column prop="field" label="参数名称(说明)">
                <template slot-scope="scope">
                  <p>
                    <span class="required-sign">{{scope.row.required?'*':''}}</span>
                    {{scope.row.field}}{{scope.row.fieldName?'('+scope.row.fieldName+')':''}}
                  </p>
                </template>
              </el-table-column>
              <el-table-column prop="dataType" label="参数类型" width="70">
                <template slot-scope="scope">
                  <span v-if="scope.row.dataType === 'varchar'">字符串</span>
                  <span v-if="scope.row.dataType === 'int'">整型</span>
                  <span v-if="scope.row.dataType === 'datetime'">日期时间</span>
                  <span v-if="scope.row.dataType === 'decimal'">浮点</span>
                  <span v-if="scope.row.dataType === 'bigint'">长整型</span>
                  <span v-if="scope.row.dataType === 'text'">文本</span>
                </template>
              </el-table-column>
              <el-table-column prop="defaultValue" label="默认值" />
              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                  <el-button type="text" @click="addOrUpdateHandle(scope.row)"
                    icon="el-icon-edit-outline"></el-button>
                  <el-button type="text" class="JNPF-table-delBtn" icon="el-icon-delete"
                    @click="removeParameter(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form-item label="数据处理">
            <el-button @click="editFunc()">接口数据处理</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <FieldForm v-show="fieldFormVisible" ref="fieldForm" @addParameter="addParameter" />
    <form-script :visible.sync="formScriptVisible" :value="this.dataForm.dataProcessing"
      @updateScript="updateScript" />
  </div>
</template>

<script>
import {
  getDataInterfaceTypeSelector,
  getDataInterfaceInfo,
  createDataInterface,
  updateDataInterface,
} from '@/api/systemData/dataInterface'
import { getDataSourceListAll } from '@/api/systemData/dataSource'
import { DataModelList } from '@/api/systemData/dataModel'
import SQLEditor from '@/components/JNPFEditor/monaco'
import JSONEditor from '@/components/JNPFEditor/monaco'
import FieldForm from './FieldForm'
import FormScript from './FormScript'
import { deepClone } from '@/utils'
import Sortable from 'sortablejs'
const defaultDataHandler = '(data) => {\r\n    // 处理数据逻辑\r\n\r\n    // 返回所需的数据\r\n    return data\r\n}'

export default {
  components: {
    SQLEditor,
    JSONEditor,
    FieldForm,
    FormScript
  },
  data() {
    return {
      active: 0,
      treeLoading: false,
      formLoading: false,
      btnLoading: false,
      fieldFormVisible: false,
      formScriptVisible: false,
      selectData: [],
      sqlOptions: {
        language: 'sql'
      },
      jsonOptions: {
        language: 'json'
      },
      dataForm: {
        fullName: '',
        enCode: '',
        categoryId: '',
        dbLinkId: '0',
        dataType: 2,
        checkType: 0,
        ipAddress: '',
        requestHeaders: '',
        requestMethod: '1',
        responseType: 'json',
        sortCode: 0,
        enabledMark: 1,
        description: '',
        dataProcessing: '',
        requestParameters: '',
        query: ''
      },
      restaurants: [
        { "value": "Postman-Token" },
        { "value": "Host" },
        { "value": "User-Agent" },
        { "value": "Accept" },
        { "value": "Accept-Encoding" },
        { "value": "Connection" }
      ],
      requestHeaders: [],
      requestParameters: [],
      sqlRequestMethod: '3',
      apiRequestMethod: '6',
      dbOptions: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'table'
      },
      activeName: 'query',
      dataRule: {
        fullName: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        enCode: [
          {
            required: true,
            message: '编码不能为空',
            trigger: 'blur'
          }
        ],
        categoryId: [
          {
            required: true,
            message: '请选择分类',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '请填写接口路径',
            trigger: 'blur'
          }
        ],
        query: [
          {
            required: true,
            message: '请输入SQL查询语句或静态数据',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id, categoryId) {
      Object.assign(this.$data, this.$options.data())
      this.active = 0
      this.dataForm.id = id || ''
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // 获取分类
        getDataInterfaceTypeSelector().then(res => {
          this.selectData = res.data.list
        })
        // 获取数据库
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
          this.getTableList(this.dataForm.dbLinkId)
          if (this.dataForm.id) {
            this.getFormData()
          } else {
            this.dataForm.categoryId = categoryId
            this.formLoading = false
          }
        })
      })
    },
    getFormData() {
      getDataInterfaceInfo(this.dataForm.id).then(res => {
        this.dataForm = res.data
        this.dataForm.query = res.data.query
        if (res.data.requestParameters) this.requestParameters = JSON.parse(res.data.requestParameters) || []
        if (res.data.requestHeaders) this.requestHeaders = JSON.parse(res.data.requestHeaders) || []
        if (res.data.dataType === 1) this.sqlRequestMethod = this.dataForm.requestMethod
        if (res.data.dataType === 3) this.apiRequestMethod = this.dataForm.requestMethod
        this.formLoading = false
      })
    },
    onDataTypeChange(val) {
      if (val === 1) {
        this.dataForm.requestMethod = this.sqlRequestMethod
      } else if (val === 3) {
        this.dataForm.requestMethod = this.apiRequestMethod
      } else {
        this.dataForm.requestMethod = ''
      }
      this.requestParameters = []
    },
    onMethodChange(val, key) {
      this[key + 'RequestMethod'] = val
    },
    handleSelectTable(val) {
      this.dataForm.dbLinkId = val
      this.getTableList(val);
    },
    getTableList(id) {
      this.treeLoading = true
      DataModelList(id).then(res => {
        this.treeData = res.data.list
        this.treeLoading = false
      })
    },
    handleNodeClick(data) {
      this.$refs.SQLEditorRef && this.$refs.SQLEditorRef.insert(data.table)
    },
    handlePrevStep() {
      this.active -= 1
      this.$refs['dataForm'].clearValidate()
    },
    handleNextStep() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.active < 1) {
            this.active += 1
            // SQL操作
            if (this.dataForm.dataType === 1) {
              this.$refs.SQLEditorRef && this.$refs.SQLEditorRef.changeEditor({
                value: this.dataForm.query,
                options: this.sqlOptions
              })
            }
            // 静态数据
            if (this.dataForm.dataType === 2) {
              this.$refs.JSONEditorRef && this.$refs.JSONEditorRef.changeEditor({
                value: this.dataForm.query,
                options: this.jsonOptions
              })
            } else {
              this.$nextTick(() => {
                this.setSort()
              })
            }
          }
        }
      })
    },
    querySearch(queryString, cb) {
      const restaurants = this.restaurants;
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    removeHeaders(index) {
      this.requestHeaders.splice(index, 1)
    },
    addHeaders() {
      this.requestHeaders.push({
        field: '',
        defaultValue: ''
      })
    },
    removeParameter(index) {
      this.$confirm('此操作删除该参数, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        this.requestParameters.splice(index, 1)
      }).catch(() => { });
    },
    addParameter(type, item) {
      this.fieldFormVisible = false
      if (type === 'add') {
        this.requestParameters.push(deepClone(item))
      } else {
        for (let i = 0; i < this.requestParameters.length; i++) {
          if (item.id === this.requestParameters[i].id) {
            this.$set(this.requestParameters, i, deepClone(item))
            break
          }
        }
      }
    },
    addOrUpdateHandle(item) {
      this.fieldFormVisible = true
      this.$nextTick(() => {
        this.$refs.fieldForm.init(item ? JSON.parse(JSON.stringify(item)) : null, this.requestParameters)
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.requestParameters.splice(evt.oldIndex, 1)[0]
          this.requestParameters.splice(evt.newIndex, 0, targetRow)
        },
        handle: '.drag-handler',
      })
    },
    editFunc() {
      if (!this.dataForm.dataProcessing) this.dataForm.dataProcessing = defaultDataHandler
      this.$nextTick(() => {
        this.formScriptVisible = true
      })
    },
    updateScript(data) {
      this.dataForm.dataProcessing = data
    },
    handleItemClick(item) {
      if (!item.field) return
      this.$refs.SQLEditorRef.insert('{' + item.field + '}')
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.dataForm.requestHeaders = JSON.stringify(this.requestHeaders)
          this.dataForm.requestParameters = JSON.stringify(this.requestParameters)
          const formMethod = this.dataForm.id ? updateDataInterface : createDataInterface
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.flow-form-main {
  ::v-deep .el-tabs__header {
    padding: 0;
    margin-bottom: 0;
    .el-tabs__item {
      line-height: 50px;
    }
  }
  .config {
    flex: 1;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    .tableData {
      flex: 0 0 220px;
      .box {
        margin-top: 8px;
        border-radius: 4px;
        height: calc(100% - 40px);
        border: 1px solid #dcdfe6;
        overflow: auto;
        overflow-x: hidden;
        ::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
          padding: 0;
        }
      }
    }

    .detail {
      flex: 1;
      margin: 0 10px;
      margin-top: -10px;
      overflow: hidden;
      .sql-box {
        border: 1px solid #dcdfe6;
        height: calc(100vh - 370px);
        overflow: auto;
      }
      .tips {
        padding: 8px 16px;
        background-color: #ecf8ff;
        border-radius: 4px;
        border-left: 5px solid #50bfff;
        p {
          line-height: 24px;
          color: #5e6d82;
          span {
            display: inline-block;
            padding-right: 10px;
          }
        }
      }
    }
  }
  .staticData {
    flex: 1;
    .json-box {
      height: calc(100vh - 210px);
    }
  }
  .parameterList {
    padding-left: 90px;
    margin-bottom: 18px;
    ::v-deep .el-icon-edit-outline,
    ::v-deep .el-icon-delete {
      font-size: 16px;
    }
  }
  .right-pane {
    width: 350px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .right-pane-list {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      overflow: hidden;
      .cap {
        height: 36px;
        line-height: 36px;
        display: flex;
        color: #606266;
        font-size: 14px;
        padding: 0 10px;
        flex-shrink: 0;
        justify-content: space-between;
        align-items: center;
      }
      .table-actions {
        flex-shrink: 0;
      }
      .list {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      ::v-deep .el-icon-edit-outline,
      ::v-deep .el-icon-delete {
        font-size: 16px;
      }
    }
    .right-pane-btn {
      flex-shrink: 0;
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
