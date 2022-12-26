<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main flow-form-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? '新建消息模板' : '编辑消息模板'" />
        <div class="options">
          <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
            {{$t('common.confirmButton')}}</el-button>
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <el-row class="main" v-loading="loading">
        <el-col :span="12" :offset="6">
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="mt-20"
            label-width="80px" @submit.native.prevent>
            <el-form-item label="模板名称" prop="fullName">
              <el-input v-model="dataForm.fullName" placeholder="模板名称"></el-input>
            </el-form-item>
            <el-form-item label="通知方式">
              <el-checkbox v-model="dataForm.isEmail" :true-label="1" :false-label="0">邮箱
              </el-checkbox>
              <el-checkbox v-model="dataForm.isWecom" :true-label="1" :false-label="0">企业微信
              </el-checkbox>
              <el-checkbox v-model="dataForm.isDingTalk" :true-label="1" :false-label="0">钉钉
              </el-checkbox>
              <el-checkbox v-model="dataForm.isSms" :true-label="1" :false-label="0"
                @change="onIsSmsChange">短信
              </el-checkbox>
            </el-form-item>
            <el-form-item label="状态" prop="enabledMark">
              <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <group-title content="内容配置" class="mb-20" />
            <el-form-item label="短信模板" prop="smsId" v-if="dataForm.isSms">
              <sms-dialog v-model="dataForm.smsId" :title="dataForm.smsTemplateName"
                @change="onSmsChange" />
            </el-form-item>
            <el-form-item label="参数定义" prop="templateJson">
              <el-button icon="el-icon-plus" @click="showDialog()">添加参数</el-button>
              <div class="tag-list">
                <el-tag v-for="(tag,index) in templateJson" :key="tag.field" effect="plain"
                  :closable="tag.closable" @close="onTagClose(index)" @click="addContent(tag)">
                  {{tag.fieldName?tag.field+'('+tag.fieldName+')':tag.field}}</el-tag>
              </div>
            </el-form-item>
            <el-form-item label="消息标题" prop="title">
              <el-input v-model="dataForm.title" placeholder="消息标题"></el-input>
            </el-form-item>
            <el-form-item label="消息内容" prop="content">
              <el-input v-model="dataForm.content" placeholder="消息内容" type="textarea" :rows="3" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-dialog title="添加参数" :visible.sync="dialogVisible" :close-on-click-modal="false"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll append-to-body width="600px">
        <el-form :model="fieldForm" :rules="fieldRule" ref="fieldForm" label-width="80px">
          <el-form-item label="参数名称" prop="field">
            <el-input v-model="fieldForm.field" placeholder="参数名称"></el-input>
          </el-form-item>
          <el-form-item label="参数说明" prop="fieldName">
            <el-input v-model="fieldForm.fieldName" placeholder="参数说明"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible=false">{{$t('common.cancelButton')}}
          </el-button>
          <el-button type="primary" @click="addParameter()">
            {{$t('common.confirmButton')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import { getInfo, Update, Create } from '@/api/system/messageTemplate'
import { getTemplateParams } from '@/api/system/smsTemplate'
import SmsDialog from './smsDialog.vue'

export default {
  components: {
    SmsDialog
  },
  data() {
    return {
      dataForm: {
        id: '',
        category: '1',
        fullName: '',
        title: '',
        isStationLetter: 0,
        isEmail: 0,
        isWecom: 0,
        isDingTalk: 0,
        isSms: 0,
        smsId: '',
        smsTemplateName: '',
        templateJson: '',
        content: '',
        enabledMark: 1,
      },
      dataRule: {
        category: [
          { required: true, message: '请选择消息类型', trigger: 'change' },
        ],
        fullName: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' },
        ],
        title: [
          { required: true, message: '消息标题不能为空', trigger: 'blur' },
        ],
        smsId: [
          { required: true, message: '请选择短信模板', trigger: 'click' },
        ]
      },
      categoryList: [{
        value: '1',
        label: '普通'
      }, {
        value: '2',
        label: '重要'
      }, {
        value: '3',
        label: '紧急'
      }],
      templateJson: [],
      fieldRule: {
        field: [
          { required: true, message: '参数名不能为空', trigger: 'blur' },
        ],
        fieldName: [
          { required: true, message: '字段不能为空', trigger: 'blur' },
        ],
      },
      fieldForm: {
        field: '',
        fieldName: ''
      },
      dialogVisible: false,
      btnLoading: false,
      loading: false,
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id) {
      this.templateJson = []
      this.dataForm.isStationLetter = 0
      this.dataForm.isEmail = 0
      this.dataForm.isWecom = 0
      this.dataForm.isDingTalk = 0
      this.dataForm.isSms = 0
      this.dataForm.id = id || ''
      this.dataForm.smsTemplateName = ''
      this.dataForm.smsId = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.loading = true
          getInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.templateJson = this.dataForm.templateJson ? JSON.parse(this.dataForm.templateJson) : []
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    dataFormSubmit() {
      this.dataForm.templateJson = JSON.stringify(this.templateJson)
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
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['fieldForm'].resetFields()
      })
    },
    addParameter() {
      this.$refs['fieldForm'].validate((valid) => {
        if (valid) {
          let boo = this.templateJson.some(o => o.field === this.fieldForm.field)
          if (boo) {
            this.$message({
              type: 'error',
              message: '参数名重复，请重新输入'
            })
            return
          }
          this.templateJson.push({
            ...this.fieldForm,
            closable: true
          })
          this.dialogVisible = false
        }
      })
    },
    onTagClose(index) {
      this.templateJson.splice(index, 1)
    },
    addContent(item) {
      this.dataForm.title += '{' + item.field + '}'
      this.dataForm.content += '{' + item.field + '}'
    },
    onIsSmsChange() {
      if (this.dataForm.isSms) return
      this.dataForm.smsId = ''
      this.dataForm.smsTemplateName = ''
      this.templateJson = this.templateJson.filter(o => o.closable)
    },
    onSmsChange(id, item) {
      if (!id) return this.dataForm.smsTemplateName = ''
      this.dataForm.smsTemplateName = item.templateName
      getTemplateParams(id).then(res => {
        if (!res.data) return
        let newList = res.data.map(o => ({
          field: o,
          fieldName: '',
          closable: false
        }))
        let templateJson = this.templateJson.filter(o => o.closable)
        outer: for (let i = 0; i < newList.length; i++) {
          inner: for (let j = 0; j < templateJson.length; j++) {
            if (newList[i].field === templateJson[j].field) {
              templateJson.splice(j, 1)
              break inner
            }
          }
        }
        this.templateJson = [...templateJson, ...newList]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tag-list {
  .el-tag {
    margin-top: 10px;
    cursor: pointer;
    & + .el-tag {
      margin-left: 10px;
    }
  }
}
</style>