<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <detail-main :dataForm="dataForm" :isSend="isSend" v-loading="loading" class="email-detail" />
    </div>
  </div>
</template>

<script>
import { EmailInfo } from '@/api/extend/email'
import DetailMain from './DetailMain'
export default {
  name: 'emailDetail',
  components: { DetailMain },
  data() {
    return {
      isSend: false,
      dataForm: {},
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init() {
      this.loading = true
      let id = this.$route.query.id
      if (id) {
        EmailInfo(id).then(res => {
          this.dataForm = res.data
          this.loading = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.email-detail {
  flex: 1;
  background: #fff;
  padding: 10px;
  overflow: auto;
}
</style>