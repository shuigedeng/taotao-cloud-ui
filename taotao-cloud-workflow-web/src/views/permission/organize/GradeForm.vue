<template>
  <el-dialog title="分级管理" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-alert title="设置当前组织部门的管理和相关操作权限" type="warning" :closable="false" show-icon />
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule"
      label-position="top" class="mt-10">
      <el-form-item label="组织名称">
        <el-input v-model="fullName" readonly placeholder="组织名称" />
      </el-form-item>
      <el-form-item label="设置管理员" prop="userId">
        <user-select v-model="userId" placeholder="选择分级管理员" multiple @change="onChange" />
      </el-form-item>
      <el-form-item label="组织操作权限(本层级)">
        <el-checkbox v-model="dataForm.thisLayerAdd" :true-label="1" :false-label="0">添加
        </el-checkbox>
        <el-checkbox v-model="dataForm.thisLayerEdit" :true-label="1" :false-label="0">编辑
        </el-checkbox>
        <el-checkbox v-model="dataForm.thisLayerDelete" :true-label="1" :false-label="0">删除
        </el-checkbox>
      </el-form-item>
      <el-form-item label="子组织操作权限(子层级)">
        <el-checkbox v-model="dataForm.subLayerAdd" :true-label="1" :false-label="0">添加
        </el-checkbox>
        <el-checkbox v-model="dataForm.subLayerEdit" :true-label="1" :false-label="0">编辑
        </el-checkbox>
        <el-checkbox v-model="dataForm.subLayerDelete" :true-label="1" :false-label="0">删除
        </el-checkbox>
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
  getOrganizeTrator,
  setOrganizeTrator
} from '@/api/permission/organize'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        userId: '',
        organizeId: '',
        thisLayerAdd: 0,
        thisLayerEdit: 0,
        thisLayerDelete: 0,
        subLayerAdd: 0,
        subLayerEdit: 0,
        subLayerDelete: 0,
        // description: ''
      },
      userId: [],
      fullName: '',
      dataRule: {
        userId: [
          { required: true, message: '分级管理员不能为空', trigger: 'click' }
        ]
      }
    }
  },
  methods: {
    init(id, fullName) {
      this.visible = true
      this.fullName = fullName
      this.userId = []
      this.dataForm = {
        userId: '',
        organizeId: '',
        thisLayerAdd: 0,
        thisLayerEdit: 0,
        thisLayerDelete: 0,
        subLayerAdd: 0,
        subLayerEdit: 0,
        subLayerDelete: 0
      }
      this.dataForm.organizeId = id || ''
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        getOrganizeTrator(id).then(res => {
          if (!res.data) return this.formLoading = false
          this.dataForm = res.data
          this.userId = this.dataForm.userId ? this.dataForm.userId.split(',') : []
          this.formLoading = false
        })
      })
    },
    onChange(val) {
      if (!val) return this.dataForm.userId = ''
      this.dataForm.userId = val.join(',')
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setOrganizeTrator(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close')
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
