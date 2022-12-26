<template>
  <el-dialog :title="!dataForm.id?'新建分组':'编辑分组'" :close-on-click-modal="false"
    :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" v-loading="formLoading"
      label-width="100px">
      <el-form-item label="分组名称" prop="fullName">
        <el-input v-model="dataForm.fullName" placeholder="输入分组名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="分组编码" prop="enCode">
        <el-input v-model="dataForm.enCode" placeholder="输入分组编码" />
      </el-form-item>
      <el-form-item label="分组类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择分组类型">
          <el-option v-for="item in typeOptions" :key="item.id" :label="item.fullName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sortCode">
        <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="说明" prop="description">
        <el-input v-model="dataForm.description" type="textarea" :rows="3" />
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
import { getGroupInfo, createGroup, updateGroup } from '@/api/permission/group'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      typeOptions: [],
      dataForm: {
        id: '',
        fullName: '',
        enCode: '',
        type: '',
        sortCode: 0,
        description: ''
      },
      dataRule: {
        fullName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { validator: this.formValidate('fullName', '分组名称不能含有特殊符号'), trigger: 'blur' }
        ],
        enCode: [
          { required: true, message: '请输入分组编码', trigger: 'blur' },
          { validator: this.formValidate('enCode', '分组编码只能输入英文、数字和小数点且小数点不能放在首尾'), trigger: 'blur' },
          { max: 50, message: '分组编码最多为50个字符！', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择分组类型', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || ''
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$store.dispatch('base/getDictionaryData', { sort: 'groupType' }).then(res => {
          this.typeOptions = res
        })
        if (this.dataForm.id) {
          getGroupInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
          })
        }
      })
      this.formLoading = false
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateGroup : createGroup
          formMethod(this.dataForm).then(res => {
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