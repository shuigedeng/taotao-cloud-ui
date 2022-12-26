<template>
  <el-dialog
    title="查看公告"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center JNPF-dialog-notice"
    lock-scroll
    width="80%"
  >
    <div class="notice-wrapper" v-loading="loading">
      <div class="sh">
        <p>{{ titles }}</p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{
        $t("common.cancelButton")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { notReadInfo } from "@/api/system/message";
import viewItem from "./view-item.vue";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      list: [],
      titles: "-"
    };
  },
  components: {
    viewItem
  },
  methods: {
    async init(titles) {
      this.visible = true;
      this.loading = true;
      await this.$nextTick();
      this.titles = titles;
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .sh {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding-top: 20px;
}
</style>
