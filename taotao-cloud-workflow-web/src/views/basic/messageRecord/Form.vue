<template>
  <el-dialog title="查看消息" :close-on-click-modal="false" :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center JNPF-dialog-notice" lock-scroll width="80%"
    append-to-body>
    <div class="notice-wrapper" v-loading="loading">
      <h1 class="title">{{info.title}}</h1>
      <div class="info">
        <span>{{info.lastModifyTime|toDate()}}</span><span>{{info.creatorUser}}</span>
      </div>
      <div class="main" v-html="info.bodyText"></div>
      <div class="file-list" v-if="files.length">
        <JNPF-UploadFz v-model="files" disabled detailed />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ReadInfo } from '@/api/system/message'
export default {
  data() {
    return {
      visible: false,
      loading: false,
      files: [],
      info: {}
    }
  },
  methods: {
    init(id) {
      this.visible = true
      this.loading = true
      ReadInfo(id).then(res => {
        this.info = res.data
        this.files = res.data.files ? JSON.parse(res.data.files) : []
        this.loading = false
      })
    }
  }
}
</script>