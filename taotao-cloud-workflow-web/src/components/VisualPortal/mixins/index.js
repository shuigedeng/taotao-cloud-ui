import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

export default {
  mixins: [resize],
  props: {
    title: { type: String, default: '' },
    dataType: { type: String, default: 'static' },
    propsApi: { type: String, default: '' },
    option: { type: Object, default: () => {} }
  },
  data() {
    return {
      chart: null,
      currOption: {},
      isEmpty: false
    }
  },
  mounted() {
    if (this.dataType === 'dynamic') {
      if (!this.propsApi) return
      getDataInterfaceRes(this.propsApi).then(res => {
        let data = this.jnpf.interfaceDataHandler(res.data)
        this.currOption = data
        this.resetChart()
      })
    } else {
      this.currOption = this.option
      this.initChart()
    }
  },
  watch: {
    option: {
      handler(val) {
        this.currOption = val
        this.resetChart()
      },
      deep: true
    },
    dataType(val) {
      if (val !== 'dynamic') {
        this.currOption = this.option
        this.resetChart()
      }
    },
    propsApi(val) {
      if (this.dataType === 'static') return
      if (!val) return
      getDataInterfaceRes(val).then(res => {
        this.currOption = res.data
        this.resetChart()
      })
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart)
      this.chart.setOption(this.currOption)
      setTimeout(() => {
        this.$nextTick(() => {
          this.chart.resize();
        })
      }, 50);
    },
    resetChart() {
      this.isEmpty = JSON.stringify(this.currOption) === "{}"
      this.chart && this.chart.dispose()
      this.chart = null
      if (!this.isEmpty) this.initChart()
    }
  },
  beforeDestroy() {
    if (!this.chart) return
    this.chart.dispose()
    this.chart = null
  }
}