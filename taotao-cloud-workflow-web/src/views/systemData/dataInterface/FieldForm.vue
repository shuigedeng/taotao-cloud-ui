<template>
  <el-dialog :title="!dataForm.id ? '新建参数' : '编辑参数'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll width="600px" append-to-body
    class="JNPF-dialog JNPF-dialog_center">
    <el-form ref="fieldForm" :model="dataForm" :rules="dataRule" label-width="80px">
      <el-form-item label="参数名称" prop="field">
        <el-input v-model="dataForm.field" placeholder="参数名称" />
      </el-form-item>
      <el-form-item label="参数说明" prop="fieldName">
        <el-input v-model="dataForm.fieldName" placeholder="参数说明" />
      </el-form-item>
      <el-form-item label="参数类型" prop="dataType">
        <el-select v-model="dataForm.dataType" placeholder="请选择参数类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="默认值" prop="defaultValue">
        <el-input v-model="dataForm.defaultValue" placeholder="默认值" />
      </el-form-item>
      <el-form-item label="必填" prop="required">
        <el-switch v-model="dataForm.required" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">
        {{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    var checkName = (rule, value, callback) => {
      let boo = true
      for (let i = 0; i < this.list.length; i++) {
        if (this.dataForm.field === this.list[i].field && this.dataForm.id !== this.list[i].id) {
          boo = false
          break
        }
      }
      if (boo) {
        callback()
      } else {
        callback(new Error('参数名称重复'));
      }
    }
    return {
      visible: false,
      type: 'add',
      dataForm: {
        id: '',
        defaultValue: '',
        field: '',
        dataType: '',
        required: 0,
        fieldName: ''
      },
      list: [],
      options: [
        { label: '字符串', value: 'varchar' },
        { label: '整型', value: 'int' },
        { label: '日期时间', value: 'datetime' },
        { label: '浮点', value: 'decimal' },
        { label: '长整型', value: 'bigint' },
        { label: '文本', value: 'text' }
      ],
      dataRule: {
        field: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        dataType: [
          { required: true, message: '请选择参数类型', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(dataForm, list) {
      this.visible = true
      this.list = list || []
      this.$nextTick(() => {
        if (dataForm) {
          this.type = 'edit'
          this.dataForm = JSON.parse(JSON.stringify(dataForm))
        } else {
          this.$refs['fieldForm'].resetFields()
          this.dataForm.id = this.jnpf.idGenerator()
          this.type = 'add'
        }
      })
    },
    dataFormSubmit() {
      this.$refs['fieldForm'].validate((valid) => {
        if (valid) {
          this.$emit('addParameter', this.type, this.dataForm)
          this.visible = false
        }
      })
    }
  }
}
</script>
