<template>
  <el-dialog
    title="图片详情"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    @closed="closed"
    lock-scroll
    class="JNPF-dialog JNPF-dialog_center"
    width="1200px"
  >
    <el-carousel indicator-position="outside" height="70vh">
      <el-carousel-item v-for="item in images" :key="item">
        <img class="thumb" :src="item" alt="" />
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      images: []
    };
  },
  methods: {
    async init(images) {
      this.visible = true;
      this.images = images;
      await this.$nextTick();
      let btns = document.getElementsByClassName("el-carousel__button");
      for (let index = 0; index < btns.length; index++) {
        const element = btns[index];
        const item = images[index];
        let bgstr = `url(${item}) no-repeat`;
        element.style.background = bgstr;
      }
    },
    closed() {
      this.$emit("closed");
    },
    beforeDestroy() {
      console.log("beforeDestroy called in method");
    }
  },

  beforeDestroy() {
    console.log("beforeDestroy called");
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

::v-deep .el-dialog__body {
  max-height: unset !important;
}
::v-deep .el-carousel__button {
  width: 39px;
  height: 39px;
}
::v-deep .el-carousel__indicators--outside button {
  opacity: 0.8;
}
::v-deep .el-carousel__indicator.is-active button {
  border: 1px solid $menuHover;
}
.thumb {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
