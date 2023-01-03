<template>
  <el-tabs tab-position="left" style="height: 100%;" v-model="activeTab" class="recordSummary">
    <el-tab-pane label="按部门汇总" name="1"></el-tab-pane>
    <el-tab-pane label="按岗位汇总" name="3"></el-tab-pane>
    <div class="recordSummary-list" v-loading="loading">
      <template v-if="list.length">
        <el-card class="recordSummary-item" v-for="(item,i) in list" :key="i">
          <div class="recordSummary-item-main">
            <div class="cap">{{item.fullName}}意见</div>
            <div class="content">
              <div class="child-item" v-for="(child,j) in item.list" :key="j">
                <template v-if="child.handleStatus==0">
                  <div class="child-item-title">
                    <div>{{item.fullName}} {{child.userName}} 于 {{child.handleTime | toDate()}}
                    </div>
                    <div class="status">
                      <el-link :underline="false" type="danger">审核拒绝</el-link>
                    </div>
                  </div>
                  <div class="child-item-option">
                    审批意见：{{child.handleOpinion}}
                  </div>
                </template>
                <template v-if="child.handleStatus==1">
                  <div class="child-item-title">
                    <div>{{item.fullName}} {{child.userName}} 于 {{child.handleTime | toDate()}}
                    </div>
                    <div class="status">
                      <el-link :underline="false" type="success">审核通过</el-link>
                    </div>
                  </div>
                  <div class="child-item-option">
                    审批意见：{{child.handleOpinion}}
                  </div>
                </template>
                <template v-if="child.handleStatus==2">
                  <div class="child-item-title">
                    <div>{{item.fullName}} {{child.userName}} 于 {{child.handleTime | toDate()}}
                    </div>
                    <div class="status">
                      <el-link :underline="false" type="primary">发起</el-link>
                    </div>
                  </div>
                </template>
                <template v-if="child.handleStatus==3">
                  <div class="child-item-title">
                    <div>{{item.fullName}} {{child.userName}} 于 {{child.handleTime | toDate()}}
                    </div>
                    <div class="status">
                      <el-link :underline="false" type="info">撤回</el-link>
                    </div>
                  </div>
                  <div class="child-item-option">
                    撤回原因：{{child.handleOpinion}}
                  </div>
                </template>
                <template v-if="child.handleStatus==4">
                  <div class="child-item-title">
                    <div>{{item.fullName}} {{child.userName}} 于 {{child.handleTime | toDate()}}
                    </div>
                    <div class="status">
                      <el-link :underline="false" type="danger">流程终止</el-link>
                    </div>
                  </div>
                  <div class=" child-item-option">
                    终止原因：{{child.handleOpinion}}
                  </div>
                </template>
                <template v-if="child.handleStatus==5">
                  <div class="child-item-title">
                    <div>{{item.fullName}} {{child.userName}} 于 {{child.handleTime | toDate()}}
                    </div>
                    <div class="status">
                      <el-link :underline="false" type="primary">指派</el-link>
                    </div>
                  </div>
                  <div class=" child-item-option">
                    指派人员：{{child.operatorId}}
                  </div>
                </template>
                <template v-if="child.handleStatus==6">
                  <div class="child-item-title">
                    <div>{{item.fullName}} {{child.userName}} 于 {{child.handleTime | toDate()}}
                    </div>
                    <div class="status">
                      <el-link :underline="false" type="primary">加签</el-link>
                    </div>
                  </div>
                  <div class=" child-item-option">
                    加签人员：{{child.operatorId}}
                  </div>
                </template>
                <template v-if="child.handleStatus==7">
                  <div class="child-item-title">
                    <div>{{item.fullName}} {{child.userName}} 于 {{child.handleTime | toDate()}}
                    </div>
                    <div class="status">
                      <el-link :underline="false" type="primary">转办</el-link>
                    </div>
                  </div>
                  <div class=" child-item-option">
                    转办人员：{{child.operatorId}}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </el-card>
      </template>
      <el-empty description="暂无数据" :image-size="120" v-else></el-empty>
    </div>
  </el-tabs>
</template>

<script>
import { getRecordList } from '@/api/workFlow/FlowBefore'
export default {
  name: 'comments',
  props: {
    id: { type: String, default: '' },
    summaryType: { default: '0' },
  },
  data() {
    return {
      list: [],
      activeTab: '1',
      loading: false
    }
  },
  watch: {
    activeTab(val) {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      const query = {
        category: this.activeTab,
        type: this.summaryType
      }
      getRecordList(this.id, query).then(res => {
        this.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.recordSummary {
  .el-tab-pane {
    height: 0;
  }
  ::v-deep .el-tabs__content {
    height: 100%;
    .recordSummary-list {
      height: 100%;
      overflow: hidden auto;
      padding: 50px 100px 0;
      .recordSummary-item {
        margin-bottom: 20px;
        .el-card__body {
          padding: 0;
          .recordSummary-item-main {
            display: flex;
            align-items: center;
            .cap {
              width: 150px;
              flex-shrink: 0;
              text-align: center;
              font-size: 14px;
            }
            .content {
              flex: 1;
              padding: 30px 50px;
              border-left: 1px solid #e4e7ed;
            }
            .child-item {
              margin-bottom: 20px;
              font-size: 14px;
              line-height: 30px;
              &:last-child {
                margin-bottom: 0;
              }
              .child-item-title {
                margin-bottom: 2px;
                display: flex;
                justify-content: space-between;
                .status {
                  flex-shrink: 0;
                  .el-link {
                    cursor: auto !important;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>