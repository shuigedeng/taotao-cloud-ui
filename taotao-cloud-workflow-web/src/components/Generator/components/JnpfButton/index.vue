<template>
  <div :class="'jnpf-button jnpf-button-'+align">
    <el-button v-bind="$attrs" v-on="$listeners">{{buttonText}}</el-button>
  </div>
</template>
<script>
export default {
  props: {
    align: {
      default: 'left'
    },
    buttonText: {
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.jnpf-button {
  width: 100%;
  &.jnpf-button-left {
    text-align: left;
  }
  &.jnpf-button-center {
    text-align: center;
  }
  &.jnpf-button-right {
    text-align: right;
  }
}
</style>