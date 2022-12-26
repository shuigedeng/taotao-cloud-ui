<template>
  <el-dialog title="按钮脚本" :close-on-click-modal="false"
    class="JNPF-dialog JNPF-dialog_center form-script-dialog" lock-scroll append-to-body
    v-bind="$attrs" width="800px" :modal-append-to-body="false" v-on="$listeners" @open="onOpen">
    <div class="form-script-dialog-body">
      <div class="right-main">
        <div class="codeEditor">
          <JNPFCodeEditor v-model="text" :options="options" ref="CodeEditor" />
        </div>
        <div class="tips">
          <p>支持JavaScript的脚本，参考编写脚本API</p>
          <p>data--列表当前行数据，index--列表当前行下标，request--异步请求(url,method,data)</p>
          <p>toast--消息提示，refresh--刷新页面</p>
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
import JNPFCodeEditor from '@/components/JNPFEditor/monaco'
export default {
  components: { JNPFCodeEditor },
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