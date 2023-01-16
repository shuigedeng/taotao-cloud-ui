<template>
  <p class="groupTitle" :style="{'text-align':contentPosition}">{{content}}</p>
</template>
<script>
export default {
  name: 'groupTitle',
  props: {
    content: {
      type: String,
      default: ''
    },
    'content-position': {
      type: String,
      default: 'left'
    },
  }
}
</script>
<style lang="scss" scoped>
.groupTitle {
  border-bottom: 1px solid #ebeef5;
  color: #606266;
  font-size: 16px;
  line-height: 50px;
  font-weight: 600;
}
</style>