<template>
  <el-scrollbar class="layout-area">
    <template v-if="layout.length">
      <grid-layout :layout.sync="layout" :row-height="40" :is-draggable="false"
        :is-resizable="false">
        <grid-item v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
          :i="item.i" :key="item.i" static>
          <Todo v-if="item.workflowKey==='todo'" :title="item.title" />
          <CommonFunc v-if="item.workflowKey==='commonFunc'" :title="item.title" :list="item.list" />
          <TodoList v-if="item.workflowKey==='todoList'" :title="item.title" />
          <HNotice v-if="item.workflowKey==='notice'" :title="item.title" />
          <HEmail v-if="item.workflowKey==='email'" :title="item.title" />
          <DataBoard v-if="item.workflowKey==='dataBoard'" :title="item.title" :list="item.list" />
          <HBarChart v-if="item.workflowKey==='barChart'" :title="item.title" :option="item.option"
            :dataType="item.dataType" :propsApi="item.propsApi" />
          <HAnnularChart v-if="item.workflowKey==='annularChart'" :title="item.title"
            :option=" item.option" :dataType="item.dataType" :propsApi="item.propsApi" />
          <HAreaChart v-if="item.workflowKey==='areaChart'" :title="item.title" :option="item.option"
            :dataType="item.dataType" :propsApi="item.propsApi" />
          <HLineChart v-if="item.workflowKey==='lineChart'" :title="item.title" :option="item.option"
            :dataType="item.dataType" :propsApi="item.propsApi" />
          <HPieChart v-if="item.workflowKey==='pieChart'" :title="item.title" :option="item.option"
            :dataType="item.dataType" :propsApi="item.propsApi" />
          <HRadarChart v-if="item.workflowKey==='radarChart'" :title="item.title" :option="item.option"
            :dataType="item.dataType" :propsApi="item.propsApi" />
          <div class="mask" v-if="mask"></div>
        </grid-item>
      </grid-layout>
    </template>
    <div class="portal-layout-nodata" v-else>
      <img src="@/assets/images/dashboard-nodata.png" alt="" class="layout-nodata-img">
      <p class="layout-nodata-txt">暂无数据</p>
    </div>
  </el-scrollbar>
</template>

<script>
import {
  Todo,
  CommonFunc,
  TodoList,
  HNotice,
  HEmail,
  DataBoard,
  HBarChart,
  HAnnularChart,
  HAreaChart,
  HLineChart,
  HPieChart,
  HRadarChart
} from "@/components/VisualPortal"
import VueGridLayout from 'vue-grid-layout'
export default {
  props: {
    layout: { type: Array, default: () => [] },
    mask: { type: Boolean, default: false },
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    Todo,
    CommonFunc,
    TodoList,
    HNotice,
    HEmail,
    DataBoard,
    HBarChart,
    HAnnularChart,
    HAreaChart,
    HLineChart,
    HPieChart,
    HRadarChart
  },
}
</script>
<style lang="scss" scoped>
.layout-area {
  height: 100%;
  overflow: hidden;
  ::v-deep .el-scrollbar__wrap {
    margin-bottom: 0 !important;
    overflow-x: auto;
  }
  ::v-deep .el-scrollbar__bar.is-horizontal > div {
    display: none;
  }
  ::v-deep .el-card {
    width: 100%;
    height: 100%;
    .el-card__body {
      padding: 0;
    }
  }
  .vue-grid-item {
    position: relative;
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  }
}
</style>
