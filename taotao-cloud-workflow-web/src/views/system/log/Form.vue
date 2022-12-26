<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <el-form label-width="100px" class="main">
        <el-form-item label-width="0" class="value-item">
          <el-input v-model="data" type="textarea" :rows="30" />
        </el-form-item>
      </el-form>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      data: '',
      title: '异常描述'
    }
  },
  methods: {
    init(data, title) {
      this.data = data || ''
      this.title = title
      this.visible = true
    },
    goBack() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  .value-item {
    flex: 1;
    margin-bottom: 0;
    ::v-deep .el-form-item__content {
      height: 100%;
      .el-textarea {
        height: 100%;
        .el-textarea__inner {
          height: 100%;
        }
      }
    }
  }
}
</style>