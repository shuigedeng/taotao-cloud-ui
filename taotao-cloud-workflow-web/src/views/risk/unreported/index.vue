<template>
  <div class="WORKFLOW-common-layout">
    <div class="WORKFLOW-common-layout-center" v-loading="pageLoading">
      <el-row class="WORKFLOW-common-search-box" :gutter="16">
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
            <el-form-item label="预警时间">
              <el-date-picker
                v-model="pickerVal"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                clearable
                :editable="false"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预警人员">
              <el-input
                v-model="username"
                placeholder="请输入预警人员"
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
            prop="creatorTime"
            label="预警时间"
            width="160"
            align="center"
          />
          <el-table-column
            prop="address"
            label="预警详情"
            width="500"
            align="center"
          />
        </WORKFLOW-table>
        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
        <carousel
          v-if="carouselVisible"
          ref="carousel"
          @closed="carouselVisible = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getunList, unexportData } from "@/api/risk";
import carousel from "../components/carousel.vue";
export default {
  name: "risk-reported",
  data() {
    return {
      companyId: [],
      pickerVal: [],
      start: "",
      end: "",
      username: "",
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
      carouselVisible: false,
      carouselImages: [],
      pageLoading: false,
    };
  },
  components: {
    carousel,
  },
  created() {
    this.initData();
  },
  methods: {
    async handleExport() {
      this.pageLoading = true;
      try {
        let query = {
          ...this.listQuery,
          username: this.username,
          start: this.start,
          end: this.end,
          companyId: this.companyId[0],
        };
        let res = await unexportData(query);
        this.workflow.downloadFile(res.data.url);
        this.pageLoading = false;
      } catch (e) {
        //TODO handle the exception
        this.pageLoading = false;
      }
    },
    async toImgDetail(data) {
      this.carouselVisible = true;
      await this.$nextTick();
      let file = data.file;
      let images = file.split("|");
      images = images.map((item) => {
        return `${this.define.comUrl}${item}`;
      });
      this.$refs.carousel.init(images);
    },
    search() {
      if (this.pickerVal && this.pickerVal.length) {
        this.start = this.pickerVal[0];
        this.end = this.pickerVal[1];
      } else {
        this.start = "";
        this.end = "";
      }
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      };
      this.initData();
    },
    reset() {
      this.start = "";
      this.end = "";
      this.pickerVal = [];
      this.companyId = [];
      this.username = "";
      this.search();
    },
    initData() {
      this.listLoading = true;
      let query = {
        ...this.listQuery,
        username: this.username,
        start: this.start,
        end: this.end,
        companyId: this.companyId[0],
      };
      getunList(query).then((res) => {
        this.list = res.data.list;
        this.total = res.data.pagination.total;
        this.listLoading = false;
      });
    },
  },
};
</script>
