<template>
  <el-dialog v-bind="$attrs" :close-on-click-modal="false" :modal-append-to-body="false"
    v-on="$listeners" @open="onOpen" fullscreen lock-scroll class="WORKFLOW-full-dialog"
    :show-close="false" :modal="false">
    <div class="WORKFLOW-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/workflow.png" class="header-logo" />
        <p class="header-txt"> · 门户预览</p>
      </div>
      <div class="options">
        <el-button @click="closeDialog()">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <div class="main" style="padding:0" v-loading="loading">
      <div class="custom-page" v-if="type===1">
        <component :is="currentView" v-if="linkType===0" />
        <embed :src="url" width="100%" height="100%" type="text/html" v-if="linkType===1" />
      </div>
      <PortalLayout :layout="layout" mask v-if="type===0" />
    </div>
  </el-dialog>
</template>

<script>
import { getPortalInfo } from '@/api/onlineDev/portal'
import PortalLayout from '@/components/VisualPortal/Layout'
export default {
  props: ['id'],
  components: { PortalLayout },
  data() {
    return {
      layout: [],
      type: null,
      linkType: null,
      currentView: null,
      url: '',
      loading: false
    }
  },
  methods: {
    onOpen() {
      this.loading = true
      this.layout = []
      getPortalInfo(this.id).then(res => {
        this.type = res.data.type || 0
        this.linkType = res.data.linkType || 0
        this.url = res.data.customUrl
        if (!res.data) return this.loading = false
        if (res.data.type === 1) {
          if (!res.data.customUrl && this.linkType === 1) return
          this.currentView = (resolve) => require([`@/views/${res.data.customUrl}`], resolve)
        } else {
          if (!res.data.formData) return
          let formData = JSON.parse(res.data.formData)
          this.layout = formData.layout || []
        }
        this.loading = false
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-page {
  padding: 10px;
  height: 100%;
  width: 100%;
}
</style>
