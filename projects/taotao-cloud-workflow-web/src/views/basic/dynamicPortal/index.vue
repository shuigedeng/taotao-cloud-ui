<template>
  <div class="dynamicPortal-container" v-loading="loading">
    <template v-if="!ajaxing">
      <template v-if="portalId">
        <PortalLayout :layout="layout" v-if="type===0" />
        <div class="custom-page" v-if="type===1">
          <component :is="currentView" v-if="linkType===0" />
          <embed :src="url" width="100%" height="100%" type="text/html" v-if="linkType===1" />
        </div>
      </template>
      <div class="portal-layout-nodata" v-else>
        <img src="@/assets/images/dashboard-nodata.png" alt="" class="layout-nodata-img">
        <p class="layout-nodata-txt">暂无数据</p>
      </div>
    </template>
  </div>
</template>

<script>
import { getAuthPortal } from '@/api/onlineDev/portal'
import PortalLayout from '@/components/VisualPortal/Layout'

export default {
  name: 'dynamicPortal',
  components: { PortalLayout },
  data() {
    return {
      portalId: '',
      layout: [],
      type: null,
      linkType: null,
      currentView: null,
      url: '',
      ajaxing: true,
      loading: false
    }
  },
  created() {
    this.portalId = this.$route.meta.relationId
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.layout = []
      if (!this.portalId) {
        this.loading = false
        this.ajaxing = false
        return
      }
      getAuthPortal(this.portalId).then(res => {
        this.type = res.data.type || 0
        this.linkType = res.data.linkType || 0
        this.url = res.data.customUrl
        if (res.data) {
          if (res.data.type === 1) {
            if (res.data.customUrl && res.data.customUrl !== 1) {
              this.currentView = (resolve) => require([`@/views/${res.data.customUrl}`], resolve)
            }
          } else {
            if (res.data.formData) {
              let formData = JSON.parse(res.data.formData)
              this.layout = formData.layout || []
            }
          }
        }
        this.ajaxing = false
        setTimeout(() => {
          this.loading = false
        }, 500);
      }).catch(() => {
        this.loading = false
        this.ajaxing = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dynamicPortal-container {
  width: 100%;
  height: 100%;
  background: #ebeef5;
  position: relative;
  .custom-page {
    width: 100%;
    height: 100%;
  }
  ::v-deep .layout-area {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
  }
  ::v-deep .vue-grid-layout {
    margin: -10px;
  }
  ::v-deep .el-scrollbar__view {
    overflow: hidden;
  }
}
</style>