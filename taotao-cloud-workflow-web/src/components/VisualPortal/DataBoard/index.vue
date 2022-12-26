<template>
  <el-row :gutter="10" class="dataBoard" type="flex" justify="space-between">
    <el-col class="dataBoard-item" v-for="(item,i) in realList" :key="i">
      <el-card shadow="never">
        <div class="dataBoard-body">
          <i :class="item.icon+' dataBoard-body-item dataBoard-body-item'+(i+1)"></i>
          <div class="text">
            <p class="num">{{item.num}}</p>
            <p class="name">{{item.fullName}}</p>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
export default {
  props: {
    title: { type: String, default: '' },
    list: { type: Array, default: () => [] }
  },
  data() {
    return {
      realList: []
    }
  },
  created() {
    this.dealData()
  },
  watch: {
    list: {
      handler(val) {
        this.dealData()
      },
      deep: true
    }
  },
  methods: {
    dealData() {
      let list = JSON.parse(JSON.stringify(this.list))
      for (let i = 0; i < list.length; i++) {
        if (list[i].dataType === 'dynamic') {
          list[i].num = ''
          if (!list[i].propsApi) continue
          getDataInterfaceRes(list[i].propsApi).then(res => {
            list[i].num = this.jnpf.interfaceDataHandler(res.data)
          })
        }
      }
      this.realList = list
    }
  }
}
</script>
<style lang="scss" scoped>
.dataBoard {
  height: 100%;
  overflow: hidden;
  .dataBoard-item {
    height: 100%;
  }
  ::v-deep .el-card {
    width: 100%;
    height: 100%;
    .el-card__body {
      padding: 0;
      height: 100%;
    }
  }
  .dataBoard-body {
    padding-left: 30px;
    height: 100%;
    display: flex;
    align-items: center;
    .dataBoard-body-item {
      width: 66px;
      height: 66px;
      margin-right: 16px;
      border-radius: 50%;
      text-align: center;
      line-height: 66px;
      font-size: 36px;
      flex-shrink: 0;
      &.dataBoard-body-item1 {
        background: #f2ebfb;
        color: #7b1ae1;
      }
      &.dataBoard-body-item2 {
        background: #edf8fe;
        color: #4ab8ff;
      }
      &.dataBoard-body-item3 {
        background: #fff7e4;
        color: #ff8b58;
      }
      &.dataBoard-body-item4 {
        background: #fff2f5;
        color: #fc5b87;
      }
      &.dataBoard-body-item5 {
        background: rgba(51, 185, 50, 0.1);
        color: #33b932;
      }
      &.dataBoard-body-item6 {
        background: rgba(255, 59, 59, 0.1);
        color: #ff3b3b;
      }
    }
    .text {
      display: inline-block;
      height: 56px;
      .num {
        font-size: 20px;
        line-height: 36px;
        height: 36px;
      }
      .name {
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>