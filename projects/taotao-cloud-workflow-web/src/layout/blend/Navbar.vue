<template>
  <div class="navbar" :class="slideClass">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />
    <Menu class="main-menu top-menu" />
    <NavbarRight />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'
import NavbarRight from '../components/NavbarRight'
import Menu from './menu'
export default {
  components: { Hamburger, NavbarRight, Menu },
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
    }),
    ...mapGetters(['sidebar'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .hamburger-container {
    line-height: 60px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .top-menu {
    flex: 1;
    overflow: hidden;
    height: 60px;
  }
}
</style>