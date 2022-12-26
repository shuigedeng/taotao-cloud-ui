<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <FlowBox v-if="formVisible" ref="FlowBox" @close="closeForm" />
        <el-empty description="暂无数据" :image-size="120" v-else></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import FlowBox from '../components/FlowBox'
import { checkInfo } from '@/api/workFlow/FlowBefore'
const Base64 = require('js-base64').Base64
export default {
  name: 'workFlowDetail',
  components: { FlowBox },
  data() {
    return {
      formVisible: false
    }
  },
  created() {
    this.initData()
  },
  watch: {
    config: {
      handler(val) {
        this.toDetail()
      },
      deep: true
    },
  },
  computed: {
    config() {
      return this.$route.query.config
    }
  },
  methods: {
    initData() {
      this.toDetail()
    },
    toDetail() {
      // type 1-我发起的 2-待办 3-抄送
      if (!this.config) return this.formVisible = false
      let item = JSON.parse(Base64.decode(this.config))
      let data = {
        id: item.processId,
        enCode: item.enCode,
        flowId: item.flowId,
        formType: item.formType,
        opType: item.type == 1 ? 0 : item.type == 2 ? 1 : item.type,
        taskNodeId: item.taskNodeId,
        taskId: item.taskOperatorId,
        hideCancelBtn: true
      }
      if (item.type == 2) {
        checkInfo(item.taskOperatorId).then(res => {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.FlowBox.init(data)
          })
        }).catch(() => {
          this.formVisible = false
          this.closeForm()
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.FlowBox.init(data)
        })
      }
    },
    closeForm() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.back()
    }
  }
}
</script>