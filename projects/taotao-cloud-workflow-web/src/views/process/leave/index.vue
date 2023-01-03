<template>
  <div class="WORKFLOW-common-layout">
    <div class="WORKFLOW-common-layout-center">
      <el-row class="WORKFLOW-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="发起人员">
              <user-select
                v-model="listQuery.userIds"
                placeholder="选择发起人员"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属公司">
              <WORKFLOW-TreeSelect
                v-model="listQuery.companyId"
                clearable
                :options="companyData"
                placeholder="选择公司"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="流程发起地">
              <WORKFLOWAddress
                v-model="listQuery.flowStartAddressId"
                placeholder="请选择流程目的地"
                :level="addressLevel"
                class="item"
                clearable
              />
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="流程目的地">
                <WORKFLOWAddress
                  v-model="listQuery.flowDestinationIds"
                  placeholder="请选择流程目的地"
                  :level="addressLevel"
                  :multiple="addressMultiple"
                  class="item"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="离开事由">
                <el-select
                  v-model="listQuery.reason"
                  placeholder="选择流程状态"
                  clearable
                >
                  <el-option
                    v-for="(item, i) in reasonList"
                    :key="i"
                    :label="item.fullName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="流程状态">
                <el-select
                  v-model="listQuery.status"
                  placeholder="选择流程状态"
                  clearable
                >
                  <el-option
                    v-for="(item, i) in statusList"
                    :key="i"
                    :label="item.fullName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发起时间">
                <el-date-picker
                  v-model="flowTime"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="离开时间">
                <el-date-picker
                  v-model="leaveTime"
                  type="datetimerange"
                  range-separator="至"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="返回时间">
                <el-date-picker
                  v-model="returnTime"
                  type="datetimerange"
                  range-separator="至"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t("common.search") }}</el-button
              >
              <el-button icon="el-icon-refresh-right" @click="reset()"
                >{{ $t("common.reset") }}
              </el-button>
              <el-button
                type="text"
                icon="el-icon-arrow-down"
                @click="showAll = true"
                v-if="!showAll"
                >展开</el-button
              >
              <el-button
                type="text"
                icon="el-icon-arrow-up"
                @click="showAll = false"
                v-else
              >
                收起</el-button
              >
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main">
        <div class="WORKFLOW-common-head">
          <div>
              <el-button
              type="primary"
              @click="handleExport"
              :loading="btnExportLoading"
              icon="el-icon-s-order"
              >导出</el-button
            >
          </div>
          <div class="WORKFLOW-common-head-right">
            <el-tooltip
              effect="dark"
              :content="$t('common.refresh')"
              placement="top"
            >
              <el-link
                icon="icon-ym icon-ym-Refresh WORKFLOW-common-head-icon"
                :underline="false"
                @click="refresh()"
              />
            </el-tooltip>
          </div>
        </div>
        <WORKFLOW-table v-loading="listLoading" :data="list" max-height="100%">
            <el-table-column prop="username" label="人员" />
            <el-table-column prop="companyName" label="所属公司" />
            <el-table-column prop="origin" label="流程发起地" />
            <el-table-column prop="destination" label="流程目的地" />
            <el-table-column prop="flowTime" label="发起时间" />
            <el-table-column prop="leaveTime" label="离开时间" />
            <el-table-column prop="returnTime" label="返回时间" />
            <el-table-column prop="reason" label="离开事由" />
            <el-table-column prop="creatorUserName" label="流程状态">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status==2">审核通过</el-tag>
              <el-tag type="danger" v-else-if="scope.row.status==3">审核驳回</el-tag>
              <el-tag type="warning" v-else-if="scope.row.status==4">流程撤回</el-tag>
              <el-tag type="info" v-else-if="scope.row.status==5">审核终止</el-tag>
              <el-tag v-else-if="scope.row.status==0">等待提交</el-tag>
              <el-tag type="primary" v-else>等待审核</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </WORKFLOW-table>
        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="getPageData"
        />
      </div>
    </div>
    <FlowBox v-if="formVisible" ref="FlowBox" @close="closeForm" />
  </div>
</template>
<style lang="scss" scoped>
@import "./index.scss";
</style>

<script>
import Logic from "./logic";
export default Logic;
</script>
