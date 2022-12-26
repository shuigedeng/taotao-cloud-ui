import { getDepartmentSelector } from "@/api/permission/department";
import { getLeavePageList, leaveExportData } from "@/api/process/index";
import FlowBox from "@/views/workFlow/components/FlowBox";
import { deepClone } from '@/utils'
import moment from "moment";
import "moment/locale/zh-cn";
export default {
  components: { FlowBox },
  data() {
    return {
      companyData: [],
      list: [],
      total: 0,
      btnLoading: false,
      listLoading: false,
      listQuery: {
        userIds: "",
        companyId: "",
        flowStartAddressId: [],
        flowDestinationIds: [],
        flowStartTime: "",
        flowEndTime: "",
        leaveStartTime: "",
        leaveEndTime: "",
        returnStartTime: "",
        returnEndTime: "",
        status:'',
        reason:null,
        currentPage:1,
        pageSize: 20
      },
      flowTime: [],
      leaveTime: [],
      returnTime: [],
      statusList: [
        {
          id: 0,
          fullName: "等待提交",
        },
        {
          id: 1,
          fullName: "等待审核",
        },
        {
          id: 2,
          fullName: "审核通过",
        },
        {
          id: 3,
          fullName: "审核驳回",
        },
        {
          id: 4,
          fullName: "流程撤回",
        },
        {
          id: 5,
          fullName: "审核终止",
        },
      ],
      reasonList: [
        {
          id: 1,
          fullName: "因公出差",
        },
        {
          id: 2,
          fullName: "因私请假",
        },
      ],
      showAll: false,
      addressLevel: 0, // 0:省， 1:省市，2:省市区，3:省市区-街道
      addressMultiple: true, //是否开起多选
      btnExportLoading: false,
      multipleSelection:[],
      formVisible:false,
      // pickerMinDate1:'',
      // pickerOptions1:this.limitTime1(),
      // pickerMinDate2:'',
      // pickerOptions2:this.limitTime2(),
      // pickerMinDate3:'',
      // pickerOptions3:this.limitTime3(),
    };
  },
  watch: {
    // "listQuery.userId": function (val) {
    //   this.listQuery.userIds[0] = val;
    // },
    flowTime: function (val) {
      if (val == null) {
        this.flowTime = [];
      }
    },
    leaveTime: function (val) {
      if (val == null) {
        this.leaveTime = [];
      }
    },
    returnTime: function (val) {
      if (val == null) {
        this.returnTime = [];
      }
    },
    // flowDestinationIds:function (val) {
    //     if(val == null) {
    //         this.listQuery.flowDestinationIds = [];
    //     }else{
    //         this.listQuery.flowDestinationIds = val.flat();
    //     }
    // }
  },
  created() {
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
    // limitTime3() {
    //   return {
    //     onPick: (obj) => {
    //       this.pickerMinDate3 = new Date(obj.minDate).getTime();
    //     },
    //     disabledDate: (time) => {
    //       if (this.pickerMinDate3) {
    //         const day1 = 29 * 24 * 3600 * 1000;
    //         let maxTime = this.pickerMinDate3 + day1;
    //         let minTime = this.pickerMinDate3 - day1;
    //         // return time.getTime() > maxTime || time.getTime()<minTime || time.getTime() > Date.now()-1 * 24 * 3600 * 1000
    //         return time.getTime() > maxTime || time.getTime() < minTime;
    //       }
    //     },
    //   };
    // },
    search() {
      let diffFlowDays = moment(this.flowTime[1]).diff(this.flowTime[0], "day");
      let diffLeaveDays = moment(this.leaveTime[1]).diff(
        this.leaveTime[0],
        "day"
      );
      let diffReturnDays = moment(this.returnTime[1]).diff(
        this.returnTime[0],
        "day"
      );
      if (diffFlowDays > 30) {
        this.$message.error("发起时间不能超过30天");
        return false;
      } else {
        this.listQuery.flowStartTime = this.flowTime[0];
        this.listQuery.flowEndTime = this.flowTime[1];
      }
      if (diffLeaveDays > 30) {
        this.$message.error("离开时间不能超过30天");
        return false;
      } else {
        this.listQuery.leaveStartTime = this.leaveTime[0];
        this.listQuery.leaveEndTime = this.leaveTime[1];
      }
      if (diffReturnDays > 30) {
        this.$message.error("返回时间不能超过30天");
        return false;
      } else {
        this.listQuery.returnStartTime = this.returnTime[0];
        this.listQuery.returnEndTime = this.returnTime[1];
      }
    //   this.listQuery.flowDestinationIds = this.flowDestinationIds.flat()
      this.listQuery.currentPage = 1;
      this.listQuery.pageSize = 20;
      this.getPageData();
    },
    reset() {
      this.listQuery.userIds = "";
      this.listQuery.companyId = "";
      this.listQuery.flowStartAddressId = [];
      this.listQuery.flowDestinationIds = [];
      this.listQuery.flowStartTime = "";
      this.listQuery.flowEndTime = "";
      this.listQuery.leaveStartTime = "";
      this.listQuery.leaveEndTime = "";
      this.listQuery.returnStartTime = "";
      this.listQuery.returnEndTime = "";
      this.listQuery.status = '';
      this.listQuery.reason = null;
      this.flowTime = [];
      this.leaveTime = [];
      this.returnTime = [];
      this.search();
    },
    refresh() {
      this.search();
    },
    getPageData() {
      let params = deepClone(this.listQuery);
      if(this.listQuery.flowStartAddressId !== undefined){
        params.flowStartAddressId = this.listQuery.flowStartAddressId[0];
      }else{
        params.flowStartAddressId = '';
      }
      if(this.listQuery.flowDestinationIds.length > 0){
        params.flowDestinationIds = this.listQuery.flowDestinationIds.flat().join(',');
      }else{
        params.flowDestinationIds = '';
      }
      this.listLoading = true;
      getLeavePageList(params)
        .then((res) => {
          this.list = res.data.list;
          this.total = res.data.pagination.total;
          this.btnLoading = false;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          this.btnLoading = false;
        });
    },
    checkDetail(item) {
      let data = {
        enCode:item.enCode || '',
        flowId:item.flowId || '',
        id: item.id,
        formType: item.formType || 2,
        status: item.status,
        opType: 4,
        hasCancel: true,
        readonly: true,
      }
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.FlowBox.init(data);
      });
    },
    async handleExport() {
       this.btnExportLoading = true;
       try {
        let params = deepClone(this.listQuery);
        params.flowStartAddressId = this.listQuery.flowStartAddressId[0];
        params.flowDestinationIds = this.listQuery.flowDestinationIds.join(',');
        let res = await leaveExportData(params);
        this.jnpf.downloadFile(res.data.url);
        this.btnExportLoading = false;
       } catch (e) {
        this.btnExportLoading = false;
       }
    },
    closeForm(isRefresh) {
      this.formVisible = false;
      if (isRefresh) this.refresh();
    },
  },
};
