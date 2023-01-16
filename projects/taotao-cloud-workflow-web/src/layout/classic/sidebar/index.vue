<template>
  <div :class="classObj">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :unique-opened="true"
        :collapse-transition="false" mode="vertical" :default-openeds="defaultOpeneds">
        <sidebar-item v-for="route in menuList" :key="route.enCode" :item="route"
          :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      defaultOpeneds: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar',
      'menuList'
    ]),
    ...mapState({
      slideClass: state => state.settings.slideClass,
    }),
    classObj() {
      return {
        [this.slideClass]: true,
        'has-logo': this.showLogo
      };
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if (meta.activeMenu) {
      //   return meta.activeMenu
      // }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.setDefaultOpeneds()
  },
  methods: {
    setDefaultOpeneds() {
      const currPath = this.$route.path
      if (currPath === '/home' || currPath === '/dashboard' || currPath === '/404') {
        if (this.menuList.length && this.menuList[0].type === 1) {
          this.defaultOpeneds.push(this.menuList[0].path)
        }
      }
    },
  },
}
</script>
<style lang="scss" >
@import '../../../styles/variables.scss';
@import '../../../styles/sidebar.scss';
</style>