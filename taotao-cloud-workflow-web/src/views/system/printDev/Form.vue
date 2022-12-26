<template>
  <el-dialog :visible.sync="visible" fullscreen lock-scroll class="JNPF-full-dialog"
    :show-close="false" :modal="false">
    <div class="JNPF-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/jnpf.png" class="header-logo" />
        <p class="header-txt"> · 打印模板</p>
      </div>
      <el-steps :active="activeStep" finish-status="success" simple class="steps steps2"
        v-if="!loading">
        <el-step title="基础设置" @click.native="stepChick(0)" />
        <el-step title="打印设计" @click.native="stepChick(1)" />
      </el-steps>
      <div class="options">
        <el-button @click="prev" :disabled="activeStep<=0">{{$t('common.prev')}}</el-button>
        <el-button @click="next" :disabled="activeStep>=1 || loading" :loading="nextBtnLoading">
          {{$t('common.next')}}
        </el-button>
        <el-button type="primary" @click="dataFormSubmit()" :disabled="activeStep!=1"
          :loading="btnLoading">{{$t('common.confirmButton')}}</el-button>
        <el-button @click="closeDialog()">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <el-row type="flex" justify="center" align="middle" v-if="!activeStep" class="basic-box">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="10" class="basicForm">
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px"
            @submit.native.prevent label-position="right">
            <el-form-item label="模板名称" prop="fullName">
              <el-input v-model="dataForm.fullName" placeholder="模板名称" maxlength="100">
              </el-input>
            </el-form-item>
            <el-form-item label="模板编码" prop="enCode">
              <el-input v-model="dataForm.enCode" placeholder="模板编码" maxlength="50">
              </el-input>
            </el-form-item>
            <el-form-item label="模板分类" prop="category">
              <el-select v-model="dataForm.category" placeholder="选择分类">
                <el-option :key="item.id" :label="item.fullName" :value="item.enCode"
                  v-for="item in categoryList" />
              </el-select>
            </el-form-item>
            <el-form-item label="模板类型" prop="type">
              <el-radio-group v-model="dataForm.type">
                <el-radio :label="1">流程表单</el-radio>
                <el-radio :label="2">功能表单</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="模板排序" prop="sortCode">
              <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode"
                controls-position="right" />
            </el-form-item>
            <el-form-item label="模板状态" prop="enabledMark">
              <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="模板说明" prop="description">
              <el-input v-model="dataForm.description" placeholder="模板说明" type="textarea"
                :rows="3" />
            </el-form-item>
            <group-title content="数据来源" class="mb-10" />
            <div class="mb-20">
              <el-alert title="默认打印的时候必须传业务主键@formId给SQL语句里面作为Where查询条件" type="warning" show-icon
                :closable="false"></el-alert>
            </div>
            <el-form-item label="数据连接" prop="dbLinkId">
              <el-select v-model="dataForm.dbLinkId" placeholder="请选择数据库" clearable>
                <el-option-group v-for="group in dbOptions" :key="group.fullName"
                  :label="group.fullName">
                  <el-option v-for="item in group.children" :key="item.id" :label="item.fullName"
                    :value="item.id" />
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="SQL语句" prop="sqlTemplate">
              <el-button icon="el-icon-plus" @click="addSql()">新增SQL</el-button>
              <el-row v-for="(item,i) in sqlTemplate" :key="i" class="mt-10">
                <el-col :span="20">
                  <el-input v-model="item.sql" placeholder="SQL语句" type="textarea"
                    :autosize="{ minRows: 3, maxRows: 10}" />
                </el-col>
                <el-col :span="3" :offset="1" class="delBtn">
                  <el-button type="danger" icon="el-icon-close" @click="delSql(i)">
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template v-if="activeStep==1">
        <print-templater ref="printTemplater" :treeData="treeData" v-model="dataForm.printTemplate"
          :type="dataForm.type" />
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { getPrintDevInfo, Update, Create, getFields } from '@/api/system/printDev'
import { getDataSourceListAll } from '@/api/systemData/dataSource'
import PrintTemplater from './ts-print-templater'
export default {
  components: { PrintTemplater },
  data() {
    return {
      visible: false,
      loading: false,
      nextBtnLoading: false,
      activeStep: 0,
      dataForm: {
        id: '',
        fullName: '',
        enCode: '',
        dbLinkId: '0',
        type: 1,
        enabledMark: 1,
        sortCode: 0,
        category: '',
        sqlTemplate: '',
        leftFields: '',
        printTemplate: '',
        description: ''
      },
      dataRule: {
        fullName: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' },
        ],
        enCode: [
          { required: true, message: '模板编码不能为空', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
        ],
        category: [
          { required: true, message: '模板分类不能为空', trigger: 'change' },
        ],
        dbLinkId: [
          { required: true, message: '数据连接不能为空', trigger: 'change' },
        ],
        sqlTemplate: [
          { required: true, message: 'SQL语句不能为空', trigger: 'click' },
        ]
      },
      formVisible: false,
      btnLoading: false,
      sqlTemplate: [],
      categoryList: [],
      treeData: [],
      dbOptions: []
    }
  },
  methods: {
    init(categoryList, id) {
      this.categoryList = categoryList
      this.activeStep = 0
      this.dataForm.id = id || ''
      this.getDbOptions()
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.loading = true
          getPrintDevInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.sqlTemplate = this.dataForm.sqlTemplate && JSON.parse(this.dataForm.sqlTemplate) || []
            this.updateFields()
            this.loading = false
          }).catch(() => { this.loading = false })
        }
      })
    },
    dataFormSubmit() {
      this.btnLoading = true
      // this.dataForm.sqlTemplate = JSON.stringify(this.sqlTemplate)
      const formMethod = this.dataForm.id ? Update : Create
      formMethod(this.dataForm).then((res) => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.closeDialog(true)
          }
        })
      }).catch(() => { this.btnLoading = false })
    },
    delSql(i) {
      this.sqlTemplate.splice(i, 1)
    },
    addSql() {
      let item = { sql: "" }
      this.sqlTemplate.push(item)
    },
    exist() {
      if (!this.sqlTemplate.length) {
        this.$message.error('请输入SQL语句')
        return false
      }
      let isOk = true;
      //  遍历数组，判断非空
      for (let i = 0; i < this.sqlTemplate.length; i++) {
        const e = this.sqlTemplate[i];
        if (!e.sql) {
          this.$message({
            message: `第${i + 1}行SQL语句不能为空`,
            type: 'error',
            duration: 1000
          });
          isOk = false
          break
        }
      }
      return isOk;
    },
    next() {
      if (this.activeStep < 1) {
        if (!this.exist()) return
        this.dataForm.sqlTemplate = JSON.stringify(this.sqlTemplate)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.nextBtnLoading = true
            const query = {
              dbLinkId: this.dataForm.dbLinkId,
              sqlTemplate: this.dataForm.sqlTemplate
            }
            getFields(query).then(res => {
              let treeData = res.data.headTable
              for (let key in res.data) {
                if (key !== 'headTable') {
                  let item = {
                    field: key,
                    fieldName: key,
                    children: res.data[key]
                  }
                  treeData.push(item)
                }
              }
              this.treeData = treeData
              this.activeStep += 1
              this.nextBtnLoading = false
            }).catch(() => {
              this.nextBtnLoading = false
            })
          }
        })
      }
    },
    closeDialog(isRefresh) {
      this.visible = false
      this.$emit('close', isRefresh)
    },
    prev() {
      this.activeStep -= 1
    },
    stepChick(key) {
      if (this.activeStep <= key) return
      this.activeStep = key
    },
    getDbOptions() {
      const defaultItem = {
        fullName: '',
        children: [{
          fullName: '默认数据库',
          id: '0'
        }]
      }
      getDataSourceListAll().then(res => {
        const list = [defaultItem, ...res.data.list]
        this.dbOptions = list.filter(o => o.children && o.children.length)
      }).catch(() => {
        this.dbOptions = [defaultItem]
      })
    }
  }
}
</script>