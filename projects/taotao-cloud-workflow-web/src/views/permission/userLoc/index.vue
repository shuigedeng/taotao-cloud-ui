<template>
  <div class="WORKFLOW-common-layout">
    <div class="WORKFLOW-common-layout-center">
      <el-row class="WORKFLOW-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input
                v-model="keyword"
                placeholder="请输入关键词查询"
                clearable
                @keyup.enter.native="search()"
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
      <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main">
        <div class="WORKFLOW-common-head">
          <div class="WORKFLOW-common-head-right">
            <el-tooltip
              effect="dark"
              :content="$t('common.refresh')"
              placement="top"
            >
              <el-link
                icon="icon-ym icon-ym-Refresh WORKFLOW-common-head-icon"
                :underline="false"
                @click="initData()"
              />
            </el-tooltip>
          </div>
        </div>
        <WORKFLOW-table v-loading="listLoading" :data="list">
          <el-table-column
            prop="creatorUserName"
            label="姓名"
            width="120"
            align="center"
          />
          <el-table-column
            prop="companyName"
            label="所属公司"
            min-width="110"
            align="center"
          />
          <el-table-column
            prop="deptName"
            label="部门"
            width="120"
            align="center"
          />
          <el-table-column
            prop="creatorTime"
            label="上一次定位时间"
            :formatter="workflow.tableDateFormat"
            width="150"
          />
          <el-table-column
            prop="detailAddress"
            label="上一次定位地点"
            min-width="150"
          />
        </WORKFLOW-table>
        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getList } from "@/api/permission/locUser";
export default {
  name: "permisson-userLoc",
  data() {
    return {
      keyword: "",
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: ""
      },
      logVisible: false,
      formVisible: false
    };
  },
  created() {
    this.initData();
  },
  methods: {
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: ""
      };
      this.initData();
    },
    reset() {
      this.keyword = "";
      this.search();
    },
    initData() {
      this.listLoading = true;
      let query = {
        ...this.listQuery,
        keyword: this.keyword
      };
      getList(query).then(res => {
        this.list = res.data.list;
        this.total = res.data.pagination.total;
        this.listLoading = false;
      });
    }
  }
};
</script>
