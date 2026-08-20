<template>
  <el-col :span="12" style="padding-left:20px; overflow: auto;">
    <el-timeline reverse>
      <template v-for="(item, i) in list">
        <el-timeline-item :timestamp="item.handleTime | toDate()" placement="top" :key="i"
          v-if="item.handleStatus==0">
          <el-card>
            <el-row>
              <el-col :span='18'>
                <p class="timeline-cell">审核节点：{{item.nodeName}}</p>
              </el-col>
              <el-col :span='6'>
                <p class="timeline-cell" style="text-align:right">
                  <el-link :underline="false" type="danger">审核拒绝</el-link>
                </p>
              </el-col>
            </el-row>
            <p class="timeline-cell">审核人员：{{item.userName}}</p>
            <p class="timeline-cell" v-if="item.handleOpinion">
              审核意见：{{item.handleOpinion}}</p>
            <p class="timeline-cell" v-if="item.signImg">
              审核签名：<img :src="item.signImg" class="signImg"></p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="item.handleTime | toDate()" placement="top" :key="i"
          v-if="item.handleStatus==1">
          <el-card>
            <el-row>
              <el-col :span='18'>
                <p class="timeline-cell">审核节点：{{item.nodeName}}</p>
              </el-col>
              <el-col :span='6'>
                <p class="timeline-cell" style="text-align:right">
                  <el-link :underline="false" type="success">审核通过</el-link>
                </p>
              </el-col>
            </el-row>
            <p class="timeline-cell">审核人员：{{item.userName}}{{item.status==1?'(加签)':''}}</p>
            <p class="timeline-cell" v-if="item.handleOpinion">
              审核意见：{{item.handleOpinion}}</p>
            <p class="timeline-cell" v-if="item.signImg">
              审核签名：<img :src="item.signImg" class="signImg"></p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="item.handleTime | toDate()" placement="top" :key="i"
          v-if="item.handleStatus==2">
          <el-card>
            <p class="timeline-cell">发起人：{{item.userName}}</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="item.handleTime | toDate()" placement="top" :key="i"
          v-if="item.handleStatus==3">
          <el-card>
            <p class="timeline-cell">撤回节点：{{item.nodeName}}</p>
            <p class="timeline-cell">撤回人员：{{item.userName}}</p>
            <p class="timeline-cell">撤回原因：{{item.handleOpinion}}</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="item.handleTime | toDate()" placement="top" :key="i"
          v-if="item.handleStatus==4">
          <el-card>
            <el-row>
              <el-col :span='18'>
                <p class="timeline-cell">审核节点：{{item.nodeName}}</p>
              </el-col>
              <el-col :span='6'>
                <p class="timeline-cell" style="text-align:right">
                  <el-link :underline="false" type="danger">流程终止</el-link>
                </p>
              </el-col>
            </el-row>
            <p class="timeline-cell">执行人员：{{item.userName}}</p>
            <p class="timeline-cell">执行动作：终止</p>
            <p class="timeline-cell">终止原因：{{item.handleOpinion}}</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="item.handleTime | toDate()" placement="top" :key="i"
          v-if="item.handleStatus==5">
          <el-card>
            <el-row>
              <el-col :span='18'>
                <p class="timeline-cell">审核节点：{{item.nodeName}}</p>
              </el-col>
              <el-col :span='6'>
                <p class="timeline-cell" style="text-align:right">
                  <el-link :underline="false" type="primary">流程指派</el-link>
                </p>
              </el-col>
            </el-row>
            <p class="timeline-cell">执行人员：{{item.userName}}</p>
            <p class="timeline-cell">执行动作：指派</p>
            <p class="timeline-cell">指派人员：{{item.operatorId}}</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="item.handleTime | toDate()" placement="top" :key="i"
          v-if="item.handleStatus==6">
          <el-card>
            <el-row>
              <el-col :span='18'>
                <p class="timeline-cell">审核节点：{{item.nodeName}}</p>
              </el-col>
              <el-col :span='6'>
                <p class="timeline-cell" style="text-align:right">
                  <el-link :underline="false" type="primary">流程加签</el-link>
                </p>
              </el-col>
            </el-row>
            <p class="timeline-cell">执行人员：{{item.userName}}</p>
            <p class="timeline-cell">执行动作：加签</p>
            <p class="timeline-cell">加签人员：{{item.operatorId}}</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="item.handleTime | toDate()" placement="top" :key="i"
          v-if="item.handleStatus==7">
          <el-card>
            <el-row>
              <el-col :span='18'>
                <p class="timeline-cell">审核节点：{{item.nodeName}}</p>
              </el-col>
              <el-col :span='6'>
                <p class="timeline-cell" style="text-align:right">
                  <el-link :underline="false" type="primary">流程转办</el-link>
                </p>
              </el-col>
            </el-row>
            <p class="timeline-cell">执行人员：{{item.userName}}</p>
            <p class="timeline-cell">执行动作：转办</p>
            <p class="timeline-cell">转办人员：{{item.operatorId}}</p>
          </el-card>
        </el-timeline-item>
      </template>
      <el-timeline-item :timestamp="endTime | toDate()" placement="top" v-if='endTime'>
        <el-card>
          <p class="timeline-cell">流程结束</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-col>
</template>

<script>
export default {
  props: {
    list: { type: Array, default: [] },
    endTime: { type: Number, default: 0 },
  },
  name: 'recordList'
}
</script>
<style lang="scss" scoped>
.timeline-cell .el-link {
  cursor: auto !important;
}
</style>