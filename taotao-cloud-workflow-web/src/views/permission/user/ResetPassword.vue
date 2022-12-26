<template>
  <el-dialog :title="$t(`user.resetPassword`)" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll
    class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule"
      label-width="100px">
      <el-form-item label="账户" prop="account">
        <el-input v-model="dataForm.account" placeholder="账户" readonly />
      </el-form-item>
      <el-form-item label="新密码" prop="userPassword">
        <el-input v-model="dataForm.userPassword" type="password" autocomplete="off"
          placeholder="输入新密码" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="validatePassword">
        <el-input v-model="dataForm.validatePassword" type="password" autocomplete="off"
          placeholder="确认新密码" />
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
import {
  resetUserPassword
} from '@/api/permission/user'
import md5 from 'js-md5'

export default {
  data() {
    const validateUserPassword = (rule, value, callback) => {
      const passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
      if (!value) {
        callback(new Error('请输入新密码'));
      } else if (!passwordreg.test(value)) {
        callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
      } else {
        if (this.dataForm.userPassword !== '') {
          this.$refs.dataForm.validateField('validatePassword');
        }
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.dataForm.userPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        account: '',
        userPassword: '',
        validatePassword: ''
      },
      dataRule: {
        userPassword: [
          { required: true, validator: validateUserPassword, trigger: 'blur' }
        ],
        validatePassword: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, account) {
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.id = id
        this.dataForm.account = account
        this.formLoading = false
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formData = {
            id: this.dataForm.id,
            userPassword: md5(this.dataForm.userPassword),
            validatePassword: md5(this.dataForm.validatePassword)
          }
          resetUserPassword(formData).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refreshDataList')
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
