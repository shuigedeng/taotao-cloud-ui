<template>
  <div class="jnpf-barcode">
    <div v-if="barcode">
      <canvas :id="id" class="barcode"></canvas>
    </div>
  </div>
</template>
<script>
import JsBarcode from 'jsbarcode'
let unique = 0

export default {
  props: {
    dataType: {
      type: String,
      default: 'static'
    },
    format: {
      type: String,
      default: 'code128'
    },
    lineColor: {
      type: String,
      default: '#000'
    },
    background: {
      type: String,
      default: '#fff'
    },
    relationField: {
      type: String,
      default: ''
    },
    formData: {
      type: Object
    },
    width: {
      type: Number,
      default: 4
    },
    height: {
      type: Number,
      default: 40
    },
    staticText: {
      type: String,
      default: ''
    }
  },
  computed: {
    barcode() {
      if (this.dataType === 'static') {
        return this.staticText
      } else {
        return this.relationText
      }
    }
  },
  data() {
    return {
      id: '',
      relationText: "",
    }
  },
  created() {
    this.id = this.uuid()
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
    format() {
      this.getBarcode()
    },
    barcode() {
      this.$nextTick(() => {
        this.getBarcode()
      })
    },
    lineColor() {
      this.getBarcode()
    },
    background() {
      this.getBarcode()
    },
    width() {
      this.getBarcode()
    },
    height() {
      this.getBarcode()
    },
  },
  mounted() {
    this.getBarcode()
  },
  methods: {
    uuid() {
      const time = Date.now()
      const random = Math.floor(Math.random() * 1000000000)
      unique++
      return 'barcode_' + random + unique + String(time)
    },
    getBarcode() {
      if (!this.barcode) return
      let reg = /^[A-Za-z0-9]+$/
      if (!reg.test(this.barcode)) {
        return
      }
      JsBarcode("#" + this.id, this.barcode, {
        format: this.format,
        lineColor: this.lineColor,
        width: this.width,
        height: this.height,
        background: this.background,
        displayValue: false,
        margin: 5
      });
    }
  },
}
</script>
<style lang="scss" scoped>
.jnpf-barcode {
  width: 100%;
  padding: 0;
  overflow: hidden;
  min-height: 40px;
}
</style>