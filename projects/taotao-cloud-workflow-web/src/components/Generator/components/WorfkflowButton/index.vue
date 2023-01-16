<template>
  <div :class="'workflow-button workflow-button-'+align">
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
.workflow-button {
  width: 100%;
  &.workflow-button-left {
    text-align: left;
  }
  &.workflow-button-center {
    text-align: center;
  }
  &.workflow-button-right {
    text-align: right;
  }
}
</style>
