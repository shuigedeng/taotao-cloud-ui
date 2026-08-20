<template>
  <el-card shadow="never" class="portal-todoList-box">
    <div slot="header" class="portal-common-title">
      <span>{{title}}</span>
    </div>
    <div class="portal-todoList-box-body">
      <template v-if="list.length">
        <a class="item com-hover" @click="goDetail(item)" v-for="(item, i) in list" :key="i">
          <span class="name">{{item.fullName}}</span>
          <span class="time">{{item.creatorTime | toDate('yyyy-MM-dd')}}</span>
        </a>
      </template>
      <div class="portal-common-noData" v-else>
        <img src="@/assets/images/portal-nodata.png" alt="" class="noData-img">
        <p class="noData-txt">暂无数据</p>
      </div>
    </div>
  </el-card>
</template>
<script>
import { getFlowTodo } from '@/api/home'
export default {
  props: {
    title: { type: String, default: '' }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getFlowTodo().then(res => {
        this.list = res.data.list.slice(0, 7)
      })
    },
    goDetail(item) {
      let config = JSON.stringify(item)
      const Base64 = require('js-base64').Base64
      this.$router.push('/workFlowDetail?config=' + encodeURIComponent(Base64.encode(config)))
    }
  }
}
</script>