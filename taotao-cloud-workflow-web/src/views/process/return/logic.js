import { getDepartmentSelector } from "@/api/permission/department";
import { getReturnPageList, returnExportData } from "@/api/process/index";
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
        originId: [],
        destinationId: [],
        flowStartTime: "",
        flowEndTime: "",
        returnStartTime: "",
        returnEndTime: "",
        status:'',
        currentPage:1,
        pageSize: 20
      },
      flowTime: [],
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
      showAll: false,
      addressLevel: 0, // 0:省， 1:省市，2:省市区，3:省市区-街道
      addressMultiple: true, //是否开起多选
      btnExportLoading: false,
      multipleSelection:[],
      formVisible:false,
      
    };
  },
  watch: {
    flowTime: function (val) {
      if (val == null) {
        this.flowTime = [];
      }
    },
    returnTime: function (val) {
      if (val == null) {
        this.returnTime = [];
      }
    },
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
    search() {
      let diffFlowDays = moment(this.flowTime[1]).diff(this.flowTime[0], "day");
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
      if (diffReturnDays > 30) {
        this.$message.error("返回时间不能超过30天");
        return false;
      } else {
        this.listQuery.returnStartTime = this.returnTime[0];
        this.listQuery.returnEndTime = this.returnTime[1];
      }
      this.listQuery.currentPage = 1;
      this.listQuery.pageSize = 20;
      this.getPageData();
    },
    reset() {
      this.listQuery.userIds = "";
      this.listQuery.companyId = "";
      this.listQuery.originId = [];
      this.listQuery.destinationId = [];
      this.listQuery.flowStartTime = "";
      this.listQuery.flowEndTime = "";
      this.listQuery.returnStartTime = "";
      this.listQuery.returnEndTime = "";
      this.listQuery.status = '';
      this.flowTime = [];
      this.returnTime = [];
      this.search();
    },
    refresh() {
      this.search();
    },
    getPageData() {
      let params = deepClone(this.listQuery);
      if(this.listQuery.originId !== undefined){
        params.originId = this.listQuery.originId[0];
      }else{
        params.originId = '';
      }
      
      if(this.listQuery.destinationId.length > 0){
        params.destinationId = this.listQuery.destinationId.flat().join(',');
      }else{
        params.destinationId = '';
      }
      this.listLoading = true;
      getReturnPageList(params)
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
        params.originId = this.listQuery.originId[0];
        params.destinationId = this.listQuery.destinationId.join(',');
        let res = await returnExportData(params);
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
