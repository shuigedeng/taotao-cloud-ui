<template>
  <el-dialog :visible.sync="visible" fullscreen lock-scroll class="JNPF-full-dialog"
    :show-close="false" :modal="false">
    <div class="JNPF-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/jnpf.png" class="header-logo" />
        <p class="header-txt"> · 门户设计</p>
      </div>
      <el-steps :active="activeStep" finish-status="success" simple class="steps steps2">
        <el-step title="基础设置" @click.native="stepChick(0)"></el-step>
        <el-step title="门户设计" @click.native="stepChick(1)"></el-step>
      </el-steps>
      <div class="options">
        <el-button @click="prev" :disabled="activeStep<=0">{{$t('common.prev')}}</el-button>
        <el-button @click="next" :disabled="activeStep>=1 || loading">{{$t('common.next')}}
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
            <el-form-item label="门户名称" prop="fullName">
              <el-input v-model="dataForm.fullName" placeholder="门户名称" maxlength="100">
              </el-input>
            </el-form-item>
            <el-form-item label="门户编码" prop="enCode">
              <el-input v-model="dataForm.enCode" placeholder="门户编码" maxlength="50">
              </el-input>
            </el-form-item>
            <el-form-item label="门户分类" prop="category">
              <el-select v-model="dataForm.category" placeholder="选择分类">
                <el-option :key="item.id" :label="item.fullName" :value="item.id"
                  v-for="item in categoryList" />
              </el-select>
            </el-form-item>
            <el-form-item label="门户排序" prop="sortCode">
              <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode"
                controls-position="right" />
            </el-form-item>
            <el-form-item label="门户状态" prop="enabledMark">
              <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="门户说明" prop="description">
              <el-input v-model="dataForm.description" placeholder="门户说明" type="textarea"
                :rows="3" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template v-if="activeStep==1">
        <PortalDesigner ref="portalDesigner" :conf="formData" />
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { getPortalInfo, Update, Create } from '@/api/onlineDev/portal'
import PortalDesigner from './components'
export default {
  components: { PortalDesigner },
  data() {
    return {
      visible: false,
      loading: false,
      activeStep: 0,
      dataForm: {
        id: '',
        fullName: '',
        enCode: '',
        sortCode: 0,
        enabledMark: 1,
        type: 0,
        linkType: null,
        customUrl: '',
        category: '',
        description: ""
      },
      dataRule: {
        fullName: [
          { required: true, message: '门户名称不能为空', trigger: 'blur' },
        ],
        enCode: [
          { required: true, message: '门户编码不能为空', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
        ],
        category: [
          { required: true, message: '门户分类不能为空', trigger: 'change' },
        ]
      },
      formVisible: false,
      btnLoading: false,
      formData: null,
      categoryList: []
    }
  },
  methods: {
    init(categoryList, id) {
      this.categoryList = categoryList
      this.activeStep = 0
      this.dataForm.id = id || ''
      this.visible = true
      this.formData = null
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.loading = true
          getPortalInfo(this.dataForm.id).then(res => {
            this.loading = false
            this.dataForm = res.data
            this.formData = JSON.parse(this.dataForm.formData)
          }).catch(() => { this.loading = false })
        }
      })
    },
    dataFormSubmit() {
      this.$refs['portalDesigner'].getData().then(res => {
        this.btnLoading = true
        this.formData = res.formData
        this.dataForm.formData = JSON.stringify(this.formData)
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
      }).catch(err => {
        err.msg && this.$message.warning(err.msg)
      })
    },
    closeDialog(isRefresh) {
      this.visible = false
      this.$emit('close', isRefresh)
    },
    prev() {
      this.activeStep -= 1
    },
    next() {
      if (this.activeStep < 1) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) this.activeStep += 1
        })
      }
    },
    stepChick(key) {
      if (this.activeStep <= key) return
      this.activeStep = key
    }
  }
}
</script>