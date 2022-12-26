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
            <el-form-item label="关键字">
              <el-input
                v-model="keyword"
                placeholder="请输入关键字"
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
          <div></div>
          <div class="JNPF-common-head-right">
            <el-tooltip
              effect="dark"
              :content="$t('common.refresh')"
              placement="top"
            >
              <el-link
                icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
                :underline="false"
                @click="initData()"
              />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list">
          <el-table-column
            prop="realName"
            label="姓名"
          />
          <el-table-column
            prop="companyName"
            label="所属公司"
          />
          <el-table-column
            prop="lastLogTime"
            label="上一次登录时间"
            min-width="110"
            :formatter="jnpf.tableDateFormat"
          />
          <el-table-column
            prop="lastLogIp"
            label="IP"
          />
          <el-table-column
            prop="lastLogCity"
            label="解析地址"
          />
          <el-table-column
            prop="lastLogUseragent"
            label="设备"
          />
          <el-table-column
            prop="days"
            label="距离上一次登录天数"
          />
        </JNPF-table>
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
import { getList } from "@/api/system/login";
export default {
  name: "system-login",
  data() {
    return {
      companyId: [],
      keyword: "",
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
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
        sidx: "",
      };
      this.initData();
    },
    reset() {
      this.companyId = [];
      this.keyword = "";
      this.search();
    },
    initData() {
      this.listLoading = true;
      let query = {
        ...this.listQuery,
        keyword: this.keyword,
        companyId: this.companyId[0],
      };
      getList(query).then((res) => {
        this.list = res.data.list;
        this.total = res.data.pagination.total;
        this.listLoading = false;
      });
    },
  },
};
</script>
