<template>
  <el-dialog v-bind="$attrs" :close-on-click-modal="false" :modal-append-to-body="false"
    v-on="$listeners" @open="onOpen" fullscreen lock-scroll class="JNPF-full-dialog"
    :show-close="false" :modal="false">
    <div class="JNPF-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/jnpf.png" class="header-logo" />
        <p class="header-txt"> · 打印预览</p>
      </div>
      <div class="options">
        <!-- <el-button type="primary" size="small" @click="word">Word下载</el-button> -->
        <el-button type="primary" size="small" @click="print">打印</el-button>
        <el-button @click="closeDialog()">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <div ref="tsPrint" class="print-content" v-html="data" />
    </div>
  </el-dialog>
</template>

<script>
import { getPrintDevInfo } from '@/api/system/printDev'
export default {
  props: ['id'],
  data() {
    return {
      data: '',
      loading: false
    }
  },
  methods: {
    onOpen() {
      this.loading = true
      getPrintDevInfo(this.id).then(res => {
        this.data = res.data.printTemplate
        this.loading = false
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
    word() {
      let print = this.$refs.tsPrint.innerHTML
      const blob = new Blob([print], {
        type: ''
      })
      const name = '下载文档.doc'
      this.downloadFile(blob, name)
    },
    downloadFile(data, name, type) {
      let blob = new Blob([data], {
        type: type || ''
      })
      let downloadElement = document.createElement('a')
      let href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = name
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(href)
    },
    print() {
      let print = this.$refs.tsPrint.innerHTML
      let newWindow = window.open('_blank')
      newWindow.document.body.innerHTML = print
      newWindow.print()
      newWindow.close()
    },
  }
}
</script>
<style lang="scss" scoped>
.print-content {
  background: white;
  padding: 40px 30px;
  margin: 0 auto;
  border-radius: 4px;
  width: 600px;
  height: 100%;
  overflow: hidden;
}
</style>