import moment from "moment";
import "moment/locale/zh-cn";
import { ExportData, getPageList } from '@/api/extra.js'
import { deepClone } from '@/utils'
export default {
  data() {
    return {
      listQuery:{
        time:'',
        keyword: "",
        currentPage: 1,
        pageSize: 20
      },
      btnLoading:false,
      exportBtnLoading:false,
      timeList:[],
      listLoading:false,
      list:[],
      total: 0,
    };
  },
  watch: {},
  created() {
    
  },
  methods: {
    goBack() {
      this.$emit("closeDiySearch", false);
    },
    init(json){
      let data = JSON.parse(json)
      this.listQuery = data;
      console.log("🚀 ~ file: logic.js ~ line 33 ~ init ~ data", data)
      if(data.hasOwnProperty('company_id')){
        this.listQuery.companyId = data.company_id[0];
      }
      this.listQuery.time = moment(parseInt(data.sampling_time[0])).format('YYYY-MM-DD');
      let diffDays = moment(data.sampling_time[1]).diff(data.sampling_time[0], 'day');
      // console.log ('相差天数是-------->',diffDays);
      for(let i = 0; i < diffDays+1; i++){
        this.timeList.push(moment(data.sampling_time[0]).add(i,'days').format('YYYY-MM-DD'))
      }
      this.getPageTableList();
    },
    handleClick(){
      this.listQuery.currentPage = 1;
      this.getPageTableList();
    },
    getPageTableList(){
      getPageList(this.listQuery).then((res) => {
        this.list = res.data.list;
        this.total = res.data.pagination.total;
        this.listLoading = false;
      })
      .catch(() => {
        this.listLoading = false;
      });
    },
    exportExcel(){
      this.exportBtnLoading = true;
      let params = deepClone(this.listQuery);
      params.startTime = this.timeList[0];
      params.endTime = this.timeList[this.timeList.length - 1];
      delete params.time;
      delete params.sampling_time;
      ExportData(params).then((res) => {
        this.jnpf.downloadFile(res.data.url);
        this.exportBtnLoading = false;
      }).catch(() => {
        this.exportBtnLoading = false;
      })
    }
  },
};