<template >
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :name="item.path" v-for="(item,i) in menuList" :key="i">
        <span slot="label" class="tab-menu-title" @click="handleClick(item)">
          <i :class="item.icon +' left-icon'"></i>
          {{generateTitle(item.vueName,item.fullName)}}</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { generateTitle } from '@/utils/i18n'
export default {
  data() {
    return {
      activeName: ''
    }
  },
  computed: {
    ...mapGetters(['menuList']),
    ...mapState({
      slideClass: state => state.settings.slideClass,
    })
  },
  created() {
    this.setDefault()
  },
  methods: {
    handleClick(item) {
      if (item.type === 1) {
        this.$store.commit('user/SET_LEFTMENULIST', item.children || [])
      } else if (item.type === 6 || (item.type === 7 && item.linkTarget === "_blank")) {
        window.open(item.path)
      } else {
        this.$router.push(item.path)
      }
    },
    setDefault() {
      const currPath = this.$route.path
      const modelId = this.$route.meta.modelId || ''
      if (!modelId) return
      for (let i = 0; i < this.menuList.length; i++) {
        const e = this.menuList[i];
        let boo = false
        const loop = data => {
          if (modelId === data.id) {
            boo = true
            this.activeName = e.path
            if (e.type === 1) this.$store.commit('user/SET_LEFTMENULIST', e.children || [])
            return
          }
          if (data.children && Array.isArray(data.children) && data.children.length) {
            for (let j = 0; j < data.children.length; j++) {
              loop(data.children[j])
            }
          }
        }
        loop(e)
        if (boo) break
      }
    },
    generateTitle
  },
}
</script>
<style lang="scss" scoped>
.top-menu {
  padding-right: 20px;
  ::v-deep .el-tabs {
    .el-tabs__header {
      height: 60px !important;
      margin: 0 !important;
      .el-tabs__nav {
        height: 60px;
        line-height: 60px;
        .el-tabs__active-bar {
          display: none;
        }
      }
    }
    .el-tabs__content {
      display: none;
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      line-height: 60px;
    }
    .el-tabs__item {
      height: 60px;
    }
  }

  .tab-menu-title {
    display: inline-block;
    line-height: 60px;
    height: 60px;
    display: flex;
    align-items: center;
  }
  .left-icon {
    font-size: 20px;
    width: 20px;
    margin-right: 10px;
  }
}
</style>