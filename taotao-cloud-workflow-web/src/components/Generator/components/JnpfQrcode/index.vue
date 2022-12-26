<template>
  <div class="jnpf-qrcode">
    <div ref="qrcode" class="qrcode"></div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'

export default {
  props: {
    dataType: {
      type: String,
      default: 'static'
    },
    colorLight: {
      type: String,
      default: '#000'
    },
    colorDark: {
      type: String,
      default: '#fff'
    },
    size: {
      type: Number,
      default: 40
    },
    relationField: {
      type: String,
      default: ''
    },
    staticText: {
      type: String,
      default: ''
    },
    formData: {
      type: Object
    },
  },
  data() {
    return {
      relationText: '',
    }
  },
  computed: {
    qrcode() {
      if (this.dataType === 'static') {
        return this.staticText
      } else if (this.dataType === 'relation') {
        return this.relationText
      } else {
        if (this.formData && this.dynamicModelExtra && this.dynamicModelExtra.id && this.dynamicModelExtra.modelId) {
          const json = {
            t: 'DFD',
            id: this.dynamicModelExtra.id,
            mid: this.dynamicModelExtra.modelId,
            mt: this.dynamicModelExtra.type,
            fid: this.dynamicModelExtra.flowId || '',
            pid: this.dynamicModelExtra.processId || '',
            ftid: this.dynamicModelExtra.taskId || '',
            opt: this.dynamicModelExtra.opType
          }
          return JSON.stringify(json)
        }
        return ''
      }
    },
    dynamicModelExtra() {
      return this.$store.state.generator.dynamicModelExtra || null
    }
  },
  watch: {
    formData: {
      handler: function (val) {
        if (val && this.dataType === 'relation' && this.relationField) {
          this.relationText = val[this.relationField]
        }
      },
      deep: true,
      immediate: true
    },
    qrcode() {
      this.$nextTick(() => {
        this.getQRimg()
      })
    },
    colorLight() {
      this.getQRimg()
    },
    colorDark() {
      this.getQRimg()
    },
    size() {
      this.getQRimg()
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getQRimg()
    })
  },
  methods: {
    getQRimg() {
      if (!this.qrcode || !this.$refs.qrcode) return this.$refs.qrcode.innerHTML = ""
      this.$refs.qrcode.innerHTML = ""
      let qrcode = new QRCode(this.$refs.qrcode, {
        width: this.size,
        height: this.size,
        text: this.qrcode, // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        colorDark: this.colorDark,
        colorLight: this.colorLight,
        correctLevel: QRCode.CorrectLevel.L //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.jnpf-qrcode {
  width: 100%;
  padding: 0;
  min-height: 40px;
  max-width: 100% !important;
  ::v-deep img {
    max-width: 100% !important;
  }
}
</style>