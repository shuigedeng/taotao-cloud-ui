<template>
  <div class="chart" style="width: 100%; height: 100%">
    <div class="chart-empty" v-if="pieData.length == 0">
      <el-empty description="暂无数据" :image-size="120"></el-empty>
    </div>
    <div id="pieChart" style="width: 100%; height: 100%"></div>
  </div>
  
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
export default {
  name: "pieChart",
  mixins: [resize],
  props: {
    pieData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    pieData: {
      handler(newVal, oldVal) {
        if (newVal !== undefined) {
          this.legendData = newVal.map((item) => item.name);
          this.initChart();
        }
      },
    },
  },
  data() {
    return {
      chart: null,
      legendData: [],
    };
  },
  created() {
    this.legendData = this.pieData.map((item) => item.name);
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
    initPage(){

      this.initChart();
    },
    initChart() {
      this.chart = echarts.init(document.getElementById("pieChart"));
      this.chart.setOption({
        grid: {
          x: 80,
          y: 60,
          x2: 50,
          y2: 80,
          borderWidth: 0,
        },
        legend: {
          bottom: 20,
          left: "center",
          data: this.legendData,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        series: [
          {
            type: "pie",
            radius: ["35%", "65%"],
            color: [
              "#7BE7E1",
              "#FBD651",
              "#FA8D41",
              "#F5B7B7",
              "#ACBFF1",
              "#36AAF2",
              "#2690FE",
            ],
            selectedMode: "single",
            data: this.pieData,
            label: {
              show: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
      console.log("🚀 ~ file: pieChart.vue ~ line 108 ~ initChart ~ this.option", this.option)
      window.onresize = this.chart.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
  .chart{
    position: relative;
    &-empty {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%; 
      padding-top:40px;
      box-sizing: border-box;
    }
  }
</style>
