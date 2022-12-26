<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center info">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form :model="listQuery" :rules="rules" ref="ruleForm" class="">
          <el-col :span="6">
            <el-form-item>
              <el-date-picker
                v-model="listQuery.time"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @clear="clearFun"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <JNPF-TreeSelect
                v-model="listQuery.companyId"
                :options="companyData"
                :clearable="true"
                placeholder="选择公司"
              />
            </el-form-item>
          </el-col>
        </el-form>
        <!-- <el-col :span="12" class="info-search">
          <a href="">导出报表</a>
        </el-col> -->
      </el-row>
      <div class="info-card">
        <div class="info-card-item" @click="handleClick('nucleicFilling')">
          <el-card class="info-card-item-con" shadow="hover">
            <div class="title">核酸填报</div>
            <div class="count">{{ mainData.nucleicFillingNum }}</div>
          </el-card>
        </div>
        <div class="info-card-item" @click="handleClick('staffChange')">
          <el-card class="info-card-item-con" shadow="hover">
            <div class="title">员工情况变化表</div>
            <div class="count">{{ mainData.staffChangeNum }}</div>
          </el-card>
        </div>
        <div class="info-card-item" @click="handleClick('leave')">
          <el-card class="info-card-item-con" shadow="hover">
            <div class="title">离开常驻地总数</div>
            <div class="count">{{ mainData.leaveNum }}</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="提交离开常驻地且通过审批"
              placement="top-end"
            >
              <div class="tips">?</div>
            </el-tooltip>
          </el-card>
        </div>
        <div class="info-card-item" @click="handleClick('return')">
          <el-card class="info-card-item-con" shadow="hover">
            <div class="title">返回常驻地总数</div>
            <div class="count">{{ mainData.returnNum }}</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="提交返回常驻地且通过审批"
              placement="top-end"
            >
              <div class="tips">?</div>
            </el-tooltip>
          </el-card>
        </div>
        <div class="info-card-item" @click="handleClick('rejectedApproval')">
          <el-card class="info-card-item-con" shadow="hover">
            <div class="title">被驳回审批</div>
            <div class="count">{{ mainData.rejectedApprovalNum }}</div>
          </el-card>
        </div>
        <div
          class="info-card-item"
          v-show="isSuper"
          @click="handleClick('noApprovalTask')"
        >
          <el-card class="info-card-item-con" shadow="hover">
            <div class="title">无流程位置变动人员</div>
            <div class="count">{{ mainData.noApprovalTaskNum }}</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="无离开流程发生省级位置变动"
              placement="top-end"
            >
              <div class="tips">?</div>
            </el-tooltip>
          </el-card>
        </div>
        <div class="info-card-item" @click="handleClick('noReturnStaff')">
          <div class="info-card-item-con">
            <div class="title">超期未归人员</div>
            <div class="count">{{ mainData.noReturnStaffNum }}</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="超返回日期仍驻留目的地人员"
              placement="top-end"
            >
              <div class="tips">?</div>
            </el-tooltip>
          </div>
        </div>
        <div class="info-card-item" @click="handleClick('noOverdueLeaveStaff')">
          <div class="info-card-item-con">
            <div class="title">超期未提交返回人员</div>
            <div class="count">{{ mainData.noOverdueLeaveStaffNum }}</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="返回后未提交返回流程"
              placement="top-end"
            >
              <div class="tips">?</div>
            </el-tooltip>
          </div>
        </div>
        <div class="info-card-item" @click="handleClick('noMatchDestination')">
          <div class="info-card-item-con">
            <div class="title">流程目的地不相符人员</div>
            <div class="count">
              {{ mainData.noMatchDestinationNum }}
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              content="超返回时间后前往目的地以外地区"
              placement="top-end"
            >
              <div class="tips">?</div>
            </el-tooltip>
          </div>
        </div>
        <div class="info-card-item" @click="handleClick('noReturnDestination')">
          <div class="info-card-item-con">
            <div class="title">未返回目的地销假人员</div>
            <div class="count">{{ mainData.noReturnDestinationNum }}</div>
          </div>
        </div>
      </div>
      <div class="JNPF-common-layout-main JNPF-flex-main info-chart">
        <div class="info-chart-item">
          <div class="info-chart-item-con">
            <div class="title">员工离开/返回常驻地趋势</div>
            <line-chart :lineData="lineData" v-if="lineData" />
          </div>
        </div>
        <div class="info-chart-item mini">
          <div class="info-chart-item-con">
            <div class="title">情况变化分布</div>
            <PieChart :pieData="pieData" v-if="pieData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import "moment/locale/zh-cn";
import echarts from "echarts";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import CountTo from "vue-count-to";
import { getDepartmentSelector } from "@/api/permission/department";
import { getInfo, isSuper } from "@/api/info/index";
export default {
  components: {
    LineChart,
    PieChart,
    CountTo,
  },
  data() {
    return {
      companyData: [],
      currentDate: moment(new Date()).format("YYYY-MM-DD"),
      lineData: null,
      pieData: null,
      listQuery: {
        companyId: "",
        start: moment(new Date()).format("YYYY-MM-DD"),
        end: moment(new Date()).format("YYYY-MM-DD"),
        time: [
          moment(new Date()).format("YYYY-MM-DD"),
          moment(new Date()).format("YYYY-MM-DD"),
        ],
      },
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      ruleForm: {
        companyId: "",
        start: "",
        end: "",
        time: null,
      },
      isSuper: false,
      mainData: {},
      rules: {},
    };
  },
  watch: {
    "listQuery.companyId": function (val) {
      this.getPageData();
    },
    "listQuery.time": function (val) {
      if (val == null) {
        this.listQuery.start = this.currentDate;
        this.listQuery.end = this.currentDate;
        this.listQuery.time = [this.currentDate, this.currentDate];
      } else {
        this.getPageData();
      }
    },
  },
  created() {
    this.initPage();
    console.log(
      "🚀 ~ file: index.vue ~ line 222 ~ created ~ this.$store.getters.userInfo",
      this.$store.getters.userInfo
    );
  },
  mounted() {},
  methods: {
    initPage() {
      let id = 0;
      let administrator = this.$store.getters.userInfo.administrator;
      getDepartmentSelector(id).then((result) => {
        let data = result.data.list;
        for (let i = 0; i < data.length; i++) {
          delete data[i].children;
        }
        this.companyData = data;
      });
      isSuper().then((result) => {
        if (administrator && result.data) {
          this.isSuper = true;
        }
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
      getInfo(this.listQuery).then((result) => {
        this.mainData = result.data;
        this.lineData = result.data.riskData;
        this.pieData = result.data.staffChange;
      });
    },
    handleClick(type) {
      switch (type) {
        case "noApprovalTask":
          this.$router.push({
            path: "/info/noApprovalTask",
            query: {
              companyId: this.listQuery.companyId,
              time: this.listQuery.time.join(","),
            },
          });
          break;
        case "noReturnStaff":
          this.$router.push({
            path: "/info/overduePerson",
            query: {
              companyId: this.listQuery.companyId,
              time: this.listQuery.time.join(","),
            },
          });
          break;
        case "noOverdueLeaveStaff":
          this.$router.push({
            path: "/info/returnProcessNotSubmitted",
            query: {
              companyId: this.listQuery.companyId,
              time: this.listQuery.time.join(","),
            },
          });
          break;
        case "noMatchDestination":
          this.$router.push({
            path: "/info/processDestinationNotMatch",
            query: {
              companyId: this.listQuery.companyId,
              time: this.listQuery.time.join(","),
            },
          });
          break;
        case "noReturnDestination":
          this.$router.push({
            path: "/info/nonResumptionLeave",
            query: {
              companyId: this.listQuery.companyId,
              time: this.listQuery.time.join(","),
            },
          });
          break;
        case "nucleicFilling":
          this.$router.push({
            path: "/model/lxhsjctb",
            query: {
              // companyId: this.listQuery.companyId,
              // time: this.listQuery.time.join(","),
            },
          });
          break;
        case "staffChange":
          this.$router.push({
            path: "/model/ygycqkbhtb",
            query: {
              // companyId: this.listQuery.companyId,
              // time: this.listQuery.time.join(","),
            },
          });
          break;
        case "leave":
          this.$router.push({
            path: "/workFlow/flowMonitor",
            query: {
              // companyId: this.listQuery.companyId,
              // time: this.listQuery.time.join(","),
            },
          });
          break;
        case "leave":
          this.$router.push({
            path: "/workFlow/flowMonitor",
            query: {
              // companyId: this.listQuery.companyId,
              // time: this.listQuery.time.join(","),
            },
          });
          break;
        case "return":
          this.$router.push({
            path: "/workFlow/flowMonitor",
            query: {
              // companyId: this.listQuery.companyId,
              // time: this.listQuery.time.join(","),
            },
          });
          break;
        case "rejectedApproval":
          this.$router.push({
            path: "/workFlow/flowMonitor",
            query: {
              // companyId: this.listQuery.companyId,
              // time: this.listQuery.time.join(","),
            },
          });
          break;
      }
    },
    clearFun() {
      console.log(
        "🚀 ~ file: index.vue ~ line 312 ~ clearFun ~ this.listQuery",
        this.listQuery
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.info {
  &-search {
    text-align: right;
    height: 32px;
    line-height: 32px;
  }
  &-card {
    background-color: #fff;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    &-item {
      width: 20%;
      aspect-ratio: 25 / 11;
      padding: 10px;
      box-sizing: border-box;
      &-con {
        position: relative;
        background: red;
        height: 100%;
        padding: 20px 0 0 20px;
        box-sizing: border-box;
        border-radius: 5px;
        cursor: pointer;
        .tips {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 20px;
          background-color: #ffffff;
          text-align: center;
          color: #666666;
          font-size: 14px;
          cursor: pointer;
        }
        .title {
          position: relative;
          padding: 0 10px 0 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 30px;
          background-color: #ffffff;
          display: inline-block;
          font-size: 14px;
          color: #666666;
          &::before {
            display: block;
            content: "";
            position: absolute;
            left: 10px;
            top: 10px;
            width: 10px;
            height: 10px;
            border-radius: 10px;
          }
        }
        .count {
          padding-top: 20px;
          font-size: 26px;
          line-height: 36px;
        }
      }

      &:nth-child(1) {
        .info-card-item-con {
          background: rgba(167, 222, 219, 0.45);
          border: 1px solid #a7dedb;
          .title::before {
            background: #a7dedb;
          }
        }
      }
      &:nth-child(2) {
        .info-card-item-con {
          background: rgba(167, 222, 182, 0.45);
          border: 1px solid #a7deb6;
          .title::before {
            background: #a7deb6;
          }
        }
      }
      &:nth-child(3) {
        .info-card-item-con {
          background: rgba(172, 191, 241, 0.45);
          border: 1px solid #acbff1;
          .title::before {
            background: #acbff1;
          }
        }
      }
      &:nth-child(4) {
        .info-card-item-con {
          background: rgba(240, 181, 140, 0.45);
          border: 1px solid #f0b58c;
          .title::before {
            background: #f0b58c;
          }
        }
      }
      &:nth-child(5) {
        .info-card-item-con {
          background: rgba(245, 183, 183, 0.45);
          border: 1px solid #f5b7b7;
          .title::before {
            background: #f5b7b7;
          }
        }
      }
      &:nth-child(6) {
        .info-card-item-con {
          background: #a7dedb;
          .title::before {
            background: #a7dedb;
          }
        }
      }
      &:nth-child(7) {
        .info-card-item-con {
          background: #a7deb6;
          .title::before {
            background: #a7deb6;
          }
        }
      }
      &:nth-child(8) {
        .info-card-item-con {
          background: #acbff1;
          .title::before {
            background: #acbff1;
          }
        }
      }
      &:nth-child(9) {
        .info-card-item-con {
          background: #f0b58c;
          .title::before {
            background: #f0b58c;
          }
        }
      }
      &:nth-child(10) {
        .info-card-item-con {
          background: #f5b7b7;
          .title::before {
            background: #f5b7b7;
          }
        }
      }
    }
  }
  &-chart {
    margin-top: 10px;
    background: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    &-item {
      width: 60%;
      height: 100%;
      padding-right: 5px;
      box-sizing: border-box;
      cursor: pointer;
      &-con {
        position: relative;
        height: 100%;
        background-color: #ffffff;
        .title {
          position: absolute;
          left: 20px;
          top: 20px;
          height: 24px;
          line-height: 24px;
          text-indent: 30px;
          background: url("../../assets/images/info-icon.png") left top
            no-repeat;
          background-size: 24px 24px;
          font-size: 16px;
          color: #000c15;
        }
      }
      &.mini {
        padding-right: 0;
        padding-left: 5px;
        width: 40%;
        .title {
          background: url("../../assets/images/info-icon2.png") left top
            no-repeat;
          background-size: 24px 24px;
        }
      }
    }
  }
}
::v-deep .el-card__body {
  padding: 0;
}
</style>
