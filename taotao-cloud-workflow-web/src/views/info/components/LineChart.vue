<template>
  <div class="chart" style="width: 100%; height: 100%">
    <div class="chart-empty" v-if="lineData.length == 0">
      <el-empty description="暂无数据" :image-size="120"></el-empty>
    </div>
    <div id="chart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
export default {
  name: "chart",
  mixins: [resize],
  props: {
    lineData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    lineData: {
      handler(newVal, oldVal) {
        if (newVal !== undefined) {
          // this.legendData = newVal.map((item) => item.name);
          this.initPage();
        }
      },
    },
  },
  data() {
    return {
      chart: null,
      legendData: [],
      xAxisData: [],
      seriesData1: [],
      seriesData2: [],
    };
  },
  mounted() {
    this.initPage();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initPage() {
      this.xAxisData = this.lineData.map((item) => item.name);
      this.seriesData1 = this.lineData.map((item) => item.value);
      this.seriesData2 = this.lineData.map((item) => item.value1);
      console.log(
        "🚀 ~ file: LineChart.vue ~ line 52 ~ initPage ~ this.seriesData ",
        this.seriesData
      );
      console.log(
        "🚀 ~ file: LineChart.vue ~ line 49 ~ initPage ~ this.xAxisData",
        this.xAxisData
      );
      console.log(
        "🚀 ~ file: LineChart.vue ~ line 50 ~ initPage ~ this.lineData",
        this.lineData
      );
      this.initChart();
    },
    initChart() {
      this.chart = echarts.init(document.getElementById("chart"));
      this.chart.setOption({
        grid: {
          x: 80,
          y: 80,
          x2: 50,
          y2: 80,
          borderWidth: 0,
        },
        legend: {
          data: ["员工离开常住地", "员工返回常住地"],
          bottom: 20,
          left: "center",
          icon: "roundRect",
        },
        tooltip: {
          trigger: "axis",
        },
        color: ["#3465E7", "#F68E00"],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xAxisData,
          axisLine: {
            show: false, //是否显示x轴
            lineStyle: {},
          },
          axisTick: {
            show: false, //是否显示刻度
          },
          // X轴的字体样式
          axisLabel: {
            show: true, //这行代码控制着坐标轴y轴的文字是否显示
            textStyle: {
              color: "#666", //X轴上的字体颜色
              fontSize: "12", // X轴字体大小
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false, //是否显示y轴
            lineStyle: {
              // color: '#000', // y坐标轴的轴线颜色
              // width: 1, //这里是坐标轴的宽度,可以去掉
            },
          },
          axisTick: {
            show: false, //是否显示刻度
          },
          // y轴的字体样式
          axisLabel: {
            show: true, //这行代码控制着坐标轴y轴的文字是否显示
            textStyle: {
              color: "#666", //y轴上的字体颜色
              fontSize: "12", // y轴字体大小
            },
          },
        },
        series: [
          {
            name: "员工离开常住地",
            type: "line",
            data: this.seriesData1,
            areaStyle: {
              opacity: 0.1,
            },
          },
          {
            name: "员工返回常住地",
            type: "line",
            data: this.seriesData2,
            areaStyle: {
              opacity: 0.1,
            },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            // xAxisIndex: [0],
            min: 6,
            max: 6,
            // startValue: income.data.length - 11,
            // endValue: income.data.length,
          },
        ],
      });
      window.onresize = this.chart.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  position: relative;
  &-empty {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-top: 40px;
    box-sizing: border-box;
  }
}
</style>
