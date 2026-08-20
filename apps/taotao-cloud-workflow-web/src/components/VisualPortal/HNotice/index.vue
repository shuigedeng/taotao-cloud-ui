<template>
  <el-card shadow="never" class="portal-todoList-box">
    <div slot="header" class="portal-common-title">
      <span>{{title}}</span>
    </div>
    <div class="portal-todoList-box-body">
      <template v-if="list.length">
        <div class="item com-hover" @click="readInfo(item.id)" v-for="(item, i) in list" :key="i">
          <span class="name">{{item.fullName}}</span>
          <span class="time">{{item.creatorTime | toDate('yyyy-MM-dd')}}</span>
        </div>
      </template>
      <div class="portal-common-noData" v-else>
        <img src="@/assets/images/portal-nodata.png" alt="" class="noData-img">
        <p class="noData-txt">暂无数据</p>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" />
  </el-card>
</template>
<script>
import { getNotice } from '@/api/home'
import Form from '@/views/basic/messageRecord/Form'
export default {
  props: {
    title: { type: String, default: '' }
  },
  components: { Form },
  data() {
    return {
      formVisible: false,
      list: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getNotice().then(res => {
        this.list = res.data.list.slice(0, 7)
      })
    },
    readInfo(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    }
  }
}
</script>