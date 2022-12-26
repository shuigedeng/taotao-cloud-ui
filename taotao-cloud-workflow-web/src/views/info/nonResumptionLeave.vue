<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="5">
            <el-form-item label="所属公司">
              <JNPF-TreeSelect
                v-model="listQuery.companyId"
                :options="companyData"
                placeholder="选择公司"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预警时间">
              <el-date-picker
                v-model="listQuery.time"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="人员搜索">
              <el-input
                v-model="listQuery.keyword"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="状态">
              <el-select
                v-model="listQuery.status"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
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
              <el-button
                @click="handleExport"
                :loading="btnExportLoading"
                icon="el-icon-s-order"
                >导出</el-button
              >
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
                @click="reset()"
              />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" max-height="100%">
          <el-table-column prop="creatorUserName" label="姓名" />
          <el-table-column label="性别" width="100" prop="gender">
            <!-- <template slot-scope="scope">
                  <p>{{ scope.row.gender == 1 ? "男" : "女" }}</p>
                </template> -->
          </el-table-column>
          <el-table-column prop="companyName" label="所属公司" width="220" />
          <!-- <el-table-column prop="deptName" label="所属部门" /> -->
          <el-table-column label="状态">
            <template slot-scope="scope">
              <p :class="scope.row.status == 1 ? 'red' : 'blue'">
                {{ scope.row.statusName }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="flowTaskStartTime" label="流程发起时间" />
          <el-table-column prop="flowTaskAddress" label="流程目的地" />
          <el-table-column prop="creatorTime" label="预警时间" />
          <el-table-column prop="address" label="实际销假地点" />
          <el-table-column prop="approvalName" label="审批人" />
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="checkFlow(scope.row)"
                >查看流程</el-button
              >
              <el-button
                size="mini"
                type="text"
                :class="scope.row.status == 1 ? '' : 'JNPF-table-delBtn'"
                @click="handleWarn(scope.row)"
                >{{
                  scope.row.status == 1 ? "解除预警" : "取消解除"
                }}</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="handleRemark(scope.row)"
                >备注</el-button
              >
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="getPageData"
        />
      </div>
      <RemarkForm
        v-if="remarkFormVisible"
        ref="RemarkForm"
        @refreshDataList="getPageData"
      />
    </div>
  </div>
</template>
<script>
import { getDepartmentSelector } from "@/api/permission/department";
import { getPageList, ExportData, changeStatus } from "@/api/info/nonResumptionLeave";
import RemarkForm from "./components/NrlForm";
export default {
  components: {
    RemarkForm,
  },
  data() {
    return {
      companyData: [],
      list: [],
      total: 0,
      btnLoading: false,
      btnExportLoading: false,
      remarkFormVisible: false,
      listLoading: false,
      statusList: [
        { value: "1", label: "未解除" },
        { value: "2", label: "已解除" },
      ],
      listQuery: {
        companyId: "",
        keyword: "",
        time: "",
        start: "",
        end: "",
        status: "",
      },
    };
  },
  created() {
    // this.listQuery.companyId = this.$route.query.companyId;
    // this.listQuery.time = this.$route.query.time.split(',');
    if (this.$route.query.hasOwnProperty("time")) {
      this.listQuery.time = this.$route.query.time.split(",");
    }
    if (this.$route.query.hasOwnProperty("companyId")) {
      this.listQuery.companyId = this.$route.query.companyId;
    }
    this.initPage();
  },
  mounted() {},
  methods: {
    initPage() {
      let id = 0;
      getDepartmentSelector(id).then((result) => {
        let data = result.data.list;
        for (let i = 0; i < data.length; i++) {
          delete data[i].children;
        }
        this.companyData = data;
      });
      this.getPageData();
    },
    getPageData() {
      if (this.listQuery.time == null) {
        this.listQuery.start = "";
        this.listQuery.end = "";
      } else {
        this.listQuery.start = this.listQuery.time[0];
        this.listQuery.end = this.listQuery.time[1];
      }
      this.listLoading = true;
      getPageList(this.listQuery)
        .then((res) => {
          this.list = res.data.list;
          this.total = res.data.pagination.total;
          this.btnLoading = false;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.btnLoading = false;
        });
    },
    checkFlow(data) {
      let routeData = this.$router.resolve({
        path: "/workFlow/flowMonitor",
        query: {
          creatorUserId: data.creatorUserId,
        },
      })
      window.open(routeData.href,'_blank');
    },
    async handleExport() {
      this.btnExportLoading = true;
      try {
        let query = {
          ...this.listQuery,
        };
        let res = await ExportData(query);
        this.jnpf.downloadFile(res.data.url);
        this.btnExportLoading = false;
      } catch (e) {
        //TODO handle the exception
        this.btnExportLoading = false;
      }
    },
    search() {
      this.listQuery.currentPage = 1;
      this.listQuery.pageSize = 20;
      this.getPageData();
    },
    reset() {
      this.listQuery.keyword = "";
      this.listQuery.companyId = "";
      this.listQuery.time = "";
      this.listQuery.start = "";
      this.listQuery.end = "";
      this.listQuery.status = "";
      this.search();
    },
    handleWarn(data) {
      let msg =
        data.status == 1
          ? "您确定要解除该预警吗, 是否继续?"
          : "您确定要取消解除该预警吗, 是否继续?";
      this.$confirm(msg, "提示", {
        type: "warning",
      })
        .then(() => {
          // this.asyncDel(index, id);
          let params = {
            id: data.id,
            status: data.status == 1 ? "2" : "1",
          };
          changeStatus(params).then((result) => {
            if (result.code == 200) {
              this.$message({
                message: result.msg == "Success" ? "操作成功" : result.msg,
                type: "success",
                duration: 1500,
                onClose: () => {
                  // this.testBtnLoading = false
                  // this.testVisible = false
                },
              });
              this.getPageData();
            }
          });
        })
        .catch(() => {});
    },
    handleRemark(data) {
      this.remarkFormVisible = true;
      this.$nextTick(() => {
        this.$refs.RemarkForm.init(data);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.red {
  color: #ff3a3a;
}
.blue {
  color: #1890ff;
}
</style>
