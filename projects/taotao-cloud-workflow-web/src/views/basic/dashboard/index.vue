<template>
  <div class="dashboard-container" v-loading="loading">
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
    <Setting ref="Setting" @refresh="refresh" />
    <el-button type="primary" icon="el-icon-arrow-left" size="large" class="setting-btn"
      @click="$refs.Setting.init(portalId)"></el-button>
  </div>
</template>

<script>
import { getAuthPortal } from '@/api/onlineDev/portal'
import Setting from './Setting'
import PortalLayout from '@/components/VisualPortal/Layout'
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  components: { Setting, PortalLayout },
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
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.portalId = this.userInfo.portalId
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
    },
    refresh(id) {
      if (!id) return
      this.portalId = id
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-container {
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
  .setting-btn {
    position: absolute;
    top: 200px;
    right: -10px;
    height: 40px;
    width: 40px;
    text-align: center;
    padding: 0;
    border-radius: 20px 0 0 20px;
    z-index: 100;
    ::v-deep i {
      font-size: 20px;
      font-weight: 580;
    }
  }
  ::v-deep .vue-grid-layout {
    margin: -10px;
  }
  ::v-deep .el-scrollbar__view {
    overflow: hidden;
  }
}
</style>