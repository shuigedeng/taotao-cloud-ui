<template>
  <el-dialog :title="!dataForm.id ? '新建门户' : '编辑门户'" :close-on-click-modal="false"
    :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" v-loading="loading"
      label-width="80px">
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
      <el-form-item label="链接类型" prop="linkType">
        <el-select v-model="dataForm.linkType" placeholder="选择链接类型">
          <el-option label="页面" :value="0" />
          <el-option label="外链" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="链接地址" prop="customUrl">
        <el-input v-model="dataForm.customUrl" placeholder="链接地址">
          <template slot="prepend" v-if="dataForm.linkType===0">@/views/</template>
        </el-input>
      </el-form-item>
      <el-form-item label="门户排序" prop="sortCode">
        <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="门户状态" prop="enabledMark">
        <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="门户说明" prop="description">
        <el-input v-model="dataForm.description" placeholder="门户说明" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPortalInfo, Update, Create } from '@/api/onlineDev/portal'

export default {
  data() {
    return {
      visible: false,
      loading: false,
      btnLoading: false,
      categoryList: [],
      dataForm: {
        id: '',
        fullName: '',
        enCode: '',
        sortCode: 0,
        enabledMark: 1,
        type: 1,
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
        ],
        linkType: [
          { required: true, message: '链接类型不能为空', trigger: 'change' },
        ],
        customUrl: [
          { required: true, message: '链接地址不能为空', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    init(categoryList, id) {
      this.categoryList = categoryList
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.loading = true
          getPortalInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.loading = false
          }).catch(() => { this.loading = false })
        }
      })
    },
    dataFormSubmit() {
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
  }
}
</script>
