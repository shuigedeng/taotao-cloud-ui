<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="所属公司">
              <com-select
                v-model="companyId"
                placeholder="选择所属公司"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t("common.search") }}</el-button
              >
              <el-button icon="el-icon-refresh-right" @click="reset()"
                >{{ $t("common.reset") }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div class="JNPF-common-head-right">
            <el-tooltip
              effect="dark"
              :content="$t('common.refresh')"
              placement="top"
            >
              <el-link
                icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
                :underline="false"
                @click="reset()"
              />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" max-height="100%">
          <el-table-column
            prop="companyName"
            label="公司名称"
            min-width="110"
            show-overflow-tooltip
          />
          <el-table-column
            prop="num"
            label="未查看公告人数"
            min-width="110"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="toDetail(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>
    <detail
      v-if="detailVisible"
      ref="detail"
      @close="closeDetail"
      @showView="showView"
    />
    <ViewNotice v-if="viewVisible" ref="View" />
  </div>
</template>

<script>
import { notReadList, exportData } from "@/api/system/message";
import detail from "./detail.vue";
import ViewNotice from "./view.vue";

export default {
  name: "system-notice-unread",
  components: { detail, ViewNotice },
  data() {
    return {
      list: [],
      total: 0,
      btnLoading: false,
      listLoading: true,
      listQuery: {
        keyword: "",
        currentPage: 1,
        pageSize: 20
      },
      detailVisible: false,
      viewVisible: false,
      companyId: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async showView(title) {
      this.viewVisible = true;
      await this.$nextTick();
      this.$refs.View.init(title);
    },
    closeDetail(isRefresh) {
      this.detailVisible = false;
    },
    async toDetail(item) {
      let { companyId } = item;
      this.detailVisible = true;
      await this.$nextTick();
      this.$refs.detail.init(companyId);
    },
    async handleExport() {
      this.pageLoading = true;
      try {
        let query = {
          companyId: this.companyId[0]
        };
        let res = await exportData(query);
        this.jnpf.downloadFile(res.data.url);
        this.pageLoading = false;
      } catch (e) {
        //TODO handle the exception
        this.pageLoading = false;
      }
    },
    initData() {
      this.listLoading = true;
      notReadList({ ...this.listQuery, companyId: this.companyId[0] })
        .then(res => {
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
      this.companyId = [];
      this.search();
    }
  }
};
</script>
