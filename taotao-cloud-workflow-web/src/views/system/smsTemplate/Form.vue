<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main flow-form-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? '新建短信模板' : '编辑短信模板'" />
        <div class="options">
          <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
            {{$t('common.confirmButton')}}</el-button>
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <el-row class="main" v-loading="loading">
        <el-col :span="12" :offset="6">
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="mt-20"
            label-width="100px" @submit.native.prevent>
            <el-form-item label="短信厂家" prop="company">
              <el-radio-group v-model="dataForm.company">
                <el-radio-button :label="1">阿里</el-radio-button>
                <el-radio-button :label="2">腾讯</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="dataForm.templateName" placeholder="模板名称"></el-input>
            </el-form-item>
            <el-form-item label="模板编号" prop="templateId">
              <el-input v-model="dataForm.templateId" placeholder="模板编号"></el-input>
            </el-form-item>
            <el-form-item label="签名内容" prop="signContent">
              <el-input v-model="dataForm.signContent" placeholder="签名内容"></el-input>
            </el-form-item>
            <el-form-item label="应用编号" prop="appId" v-if="dataForm.company===2">
              <el-input v-model="dataForm.appId" placeholder="应用编号"></el-input>
            </el-form-item>
            <el-form-item label="模板验证">
              <el-button @click="showDialog()" :loading="testLoading">测试</el-button>
            </el-form-item>
            <el-form-item label="状态" prop="enabledMark">
              <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-dialog title="测试" :visible.sync="testVisible" :close-on-click-modal="false"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll append-to-body width="600px">
        <el-form :model="testForm" :rules="testRule" ref="testForm" label-width="80px">
          <JNPF-table :data="testList">
            <el-table-column prop="field" label="参数名称" width="100" />
            <el-table-column prop="value" label="参数赋值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" placeholder="参数赋值"></el-input>
              </template>
            </el-table-column>
          </JNPF-table>
          <el-form-item></el-form-item>
          <el-form-item label="接收号码" prop="phoneNumbers">
            <el-input v-model="testForm.phoneNumbers" placeholder="接收号码"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="testVisible=false">{{$t('common.cancelButton')}}
          </el-button>
          <el-button type="primary" @click="test" :loading="testBtnLoading">测试</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import { getInfo, Update, Create, getTemplate, testSent } from '@/api/system/smsTemplate'

export default {
  data() {
    return {
      dataForm: {
        id: '',
        enabledMark: 1,
        company: 1,
        templateId: '',
        templateName: '',
        signContent: '',
        appId: '',
      },
      dataRule: {
        company: [
          { required: true, message: '短信厂家不能为空', trigger: 'blur' },
        ],
        templateId: [
          { required: true, message: '模板编号不能为空', trigger: 'blur' },
        ],
        templateName: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' },
        ],
        signContent: [
          { required: true, message: '签名内容不能为空', trigger: 'blur' },
        ],
        appId: [
          { required: true, message: '应用编号不能为空', trigger: 'blur' },
        ],
      },
      testRule: {
        phoneNumbers: [
          { required: true, message: '接收号码不能为空', trigger: 'blur' },
        ],
      },
      testForm: {
        phoneNumbers: ''
      },
      testVisible: false,
      btnLoading: false,
      testBtnLoading: false,
      testLoading: false,
      loading: false,
      testList: []
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id) {
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.loading = true
          getInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? Update : Create
          formMethod(this.dataForm).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => { this.btnLoading = false })
        }
      })
    },
    showDialog() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.testLoading = true
          getTemplate(this.dataForm).then(res => {
            this.testList = res.data.map(o => ({
              field: o,
              value: ''
            }))
            this.testVisible = true
            this.testLoading = false
            this.$nextTick(() => {
              this.$refs['testForm'].resetFields()
            })
          }).catch(() => { this.testLoading = false })
        }
      })
    },
    test() {
      this.$refs['testForm'].validate((valid) => {
        if (valid) {
          this.testBtnLoading = true
          let parameters = {}
          for (let i = 0; i < this.testList.length; i++) {
            parameters[this.testList[i].field] = this.testList[i].value
          }
          let query = {
            ...this.dataForm,
            ...this.testForm,
            parameters
          }
          testSent(query).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.testBtnLoading = false
                this.testVisible = false
              }
            })
          }).catch(() => { this.testBtnLoading = false })
        }
      })
    }
  }
}
</script>