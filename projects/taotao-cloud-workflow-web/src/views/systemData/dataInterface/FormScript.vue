<template>
  <el-dialog title="数据处理" :close-on-click-modal="false"
    class="WORKFLOW-dialog WORKFLOW-dialog_center form-script-dialog" lock-scroll append-to-body
    v-bind="$attrs" width="800px" :modal-append-to-body="false" v-on="$listeners" @open="onOpen">
    <div class="form-script-dialog-body">
      <div class="right-main">
        <div class="codeEditor">
          <WORKFLOWCodeEditor v-model="text" :options="options" ref="CodeEditor" />
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="onClose()">{{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import WORKFLOWCodeEditor from '@/components/WORKFLOWEditor/monaco'
export default {
  components: { WORKFLOWCodeEditor },
  props: ['value'],
  data() {
    return {
      text: '',
      options: {
        language: 'javascript'
      },
    }
  },
  methods: {
    onOpen() {
      this.text = this.value
      this.$nextTick(() => {
        this.$refs.CodeEditor.changeEditor({
          value: this.text,
          options: this.options
        })
      });
    },
    onClose() {
      this.$emit('updateScript', this.text)
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
