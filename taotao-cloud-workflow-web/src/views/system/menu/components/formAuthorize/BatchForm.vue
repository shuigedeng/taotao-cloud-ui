<template>
  <el-dialog title="批量新增" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px"
      label-position="top" v-loading="formLoading">
      <div class="json-demo">
        <pre>
          // 示例
          [
            {
              "fullName":"名称",
              "enCode":"fullName"
            }
          ]
        </pre>
      </div>
      <el-form-item label="字段Json" prop="formJson">
        <div class="formCodeEditor">
          <JNPFCodeEditor :options="options" v-model="content" ref="CodeEditor" />
        </div>
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
import { batchCreateForm } from '@/api/system/formAuthorize'
import JNPFCodeEditor from '@/components/JNPFEditor/monaco'

export default {
  components: { JNPFCodeEditor },
  data() {
    return {
      options: {
        readOnly: false,
        language: 'json'
      },
      visible: false,
      formLoading: false,
      btnLoading: false,
      content: '',
      dataForm: {
        moduleId: '',
        formJson: []
      },
      dataRule: {}
    }
  },
  methods: {
    init(moduleId) {
      this.dataForm.moduleId = moduleId
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.content = ''
        this.$refs['dataForm'].resetFields()
        this.$refs.CodeEditor.changeEditor({
          value: '',
          options: this.options
        })
        this.formLoading = false
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const rtnData = this.content
          if (!rtnData) return this.$message.warning('请输入字段JSON')
          const fixedRtnData = rtnData.replace(/("\w+":)(?=[},])/g, '$1null')
          const jsonData = JSON.parse(fixedRtnData)
          this.dataForm.formJson = jsonData
          this.btnLoading = true
          batchCreateForm(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.content = ''
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => { this.btnLoading = false })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.formCodeEditor {
  width: 100%;
  height: 260px;
  margin: 0;
  padding: 0;
  border: 1px solid #c0c4cc;
  overflow: hidden;
}
.json-demo {
  width: 100%;
  background: #f4f4f5;
  border-radius: 4px;
  color: #909399;
  padding-top: 10px;
  pre {
    margin-left: -40px;
    font-size: 12px;
  }
}
</style>