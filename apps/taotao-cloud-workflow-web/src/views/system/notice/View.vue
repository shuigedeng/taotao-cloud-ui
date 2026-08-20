<template>
  <el-dialog title="查看公告" :close-on-press-escape="false" :close-on-click-modal="false"
    :visible.sync="visible" class="WORKFLOW-dialog WORKFLOW-dialog_center WORKFLOW-dialog-notice" lock-scroll
    width="80%">
    <div class="notice-wrapper" v-loading="loading">
      <h1 class="title">{{dataForm.title}}</h1>
      <div class="info">
        <span>{{workflow.dateFormat(dataForm.lastModifyTime)}}</span><span>{{dataForm.creatorUser}}</span>
      </div>
      <div class="main" v-html="dataForm.bodyText"></div>
      <div class="file-list" v-if="files.length">
        <WORKFLOW-UploadFz v-model="files" disabled detailed />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getNoticeInfo } from '@/api/system/message'

export default {
  data() {
    return {
      visible: false,
      loading: false,
      files: [],
      dataForm: {
        id: '',
        title: '',
        creatorUser: '',
        creatorTime: Number,
        bodyText: ''
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id
      this.dataForm.bodyText = ''
      this.visible = true
      this.loading = true
      this.$nextTick(() => {
        getNoticeInfo(this.dataForm.id).then(res => {
          this.dataForm = res.data || {}
          this.files = res.data.files ? JSON.parse(res.data.files) : []
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>
