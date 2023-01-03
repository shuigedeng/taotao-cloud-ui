<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
const beforeUnload = function (e) {
  e = e || window.event
  if (e || window.event) e.returnValue = 1;
  return 1;
}
export default {
  name: 'App',
  mounted() {
    // this.$nextTick(() => {
    //   window.addEventListener('beforeunload', beforeUnload)
    // })
  },
  beforeDestroy() {
    // window.removeEventListener('beforeunload', beforeUnload)
  }
}
</script>