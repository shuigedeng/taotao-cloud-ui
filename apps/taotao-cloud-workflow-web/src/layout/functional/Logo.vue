<template>
  <div class="functional-logo-container">
    <router-link class="sidebar-logo-link" to="/">
      <img :src="define.comUrl + sysConfig.navigationIcon" class="sidebar-logo"
        v-if="sysConfig && sysConfig.navigationIcon" />

      <template v-else>
        <img src="@/assets/images/workflow2.png" class="sidebar-logo" v-if="slideClass === 'lightWhite'" />
        <img src="@/assets/images/workflow1.png" class="sidebar-logo" v-else />
      </template>
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SidebarLogo',
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
    }),
    sysConfig() {
      return this.$store.state.settings.sysConfig
    }
  },
}
</script>

<style lang="scss" scoped>
.functional-logo-container {
  width: 210px;
  height: 60px;
  line-height: 60px;
  background: #fff;
  text-align: center;
  overflow: hidden;
  flex-shrink: 0;

  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
