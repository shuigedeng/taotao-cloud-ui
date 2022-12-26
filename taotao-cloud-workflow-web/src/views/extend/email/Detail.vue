<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="isSend?'查看邮件 - 已发送':'查看邮件 - 收件箱'" />
        <div class="options">
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <detail-main :dataForm="dataForm" :isSend="isSend" v-loading="loading" />
    </div>
  </transition>
</template>

<script>
import { EmailInfo } from '@/api/extend/email'
import DetailMain from './DetailMain'
export default {
  components: { DetailMain },
  data() {
    return {
      isSend: false,
      dataForm: {},
      loading: false
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id, isSend, index) {
      this.isSend = isSend
      this.loading = true
      if (id) {
        EmailInfo(id).then(res => {
          this.dataForm = res.data
          this.loading = false
          if (!isSend) this.$emit('setRead', index)
        })
      }
    }
  }
}
</script>