<template>
  <transition name="el-zoom-in-center">
    <div class="WORKFLOW-preview-main flow-form-main">
      <div class="WORKFLOW-common-page-header">
        <el-page-header @back="goBack" :content="title" />
      </div>
      <div class="WORKFLOW-common-layout">
        <div class="WORKFLOW-common-layout-center">
          <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main">
            <div class="WORKFLOW-common-head">
              <div>
                <el-button
                  type="primary"
                  @click="handleExport"
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
                    @click="reset()"
                  />
                </el-tooltip>
              </div>
            </div>
            <WORKFLOW-table v-loading="listLoading" :data="list" max-height="100%">
              <el-table-column
                prop="username"
                label="姓名"
                min-width="110"
                show-overflow-tooltip
              />
              <el-table-column
                prop="num"
                label="未查看条数"
                min-width="110"
                show-overflow-tooltip
              />
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="toDetail(scope.row)"
                    >查看详情</el-button
                  >
                </template>
              </el-table-column>
            </WORKFLOW-table>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { notReadInfo, exportData } from "@/api/system/message";

export default {
  name: "system-notice-unread",
  data() {
    return {
      title: "详情",
      list: [],
      total: 0,
      btnLoading: false,
      listLoading: true,
      listQuery: {
        keyword: "",
        currentPage: 1,
        pageSize: 20,
      },
      formVisible: false,
      companyId: "",
    };
  },
  created() {},
  methods: {
    async toDetail(item) {
      let { titles } = item;
      this.$emit("showView", titles);
    },
    goBack(isRefresh) {
      this.$emit("close", isRefresh);
    },
    async init(companyId) {
      this.companyId = companyId;
      this.initData();
    },
    async handleExport() {
      this.pageLoading = true;
      try {
        let query = {
          companyId: this.companyId,
        };
        let res = await exportData(query);
        this.workflow.downloadFile(res.data.url);
        this.pageLoading = false;
      } catch (e) {
        //TODO handle the exception
        this.pageLoading = false;
      }
    },
    async initData() {
      this.listLoading = true;
      await notReadInfo({ companyId: this.companyId })
        .then((res) => {
          this.list = res.data;
          this.listLoading = false;
          this.btnLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.btnLoading = false;
        });
    },
    handleView(id) {
      this.viewVisible = true;
      this.$nextTick(() => {
        this.$refs.View.init(id);
      });
    },
    search() {
      this.listQuery.currentPage = 1;
      this.listQuery.pageSize = 20;
      this.listQuery.sort = "desc";
      this.initData();
    },
    reset() {
      this.search();
    },
  },
};
</script>
