<template>
  <div class="WORKFLOW-common-layout">
    <div class="WORKFLOW-common-layout-center ">
      <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main sms">
        <el-form ref="baseForm" :model="baseForm" label-width="100px">
            <el-form-item label="短信提示开关">
                <el-switch
                    v-model="baseForm.value"
                    @change = "change"
                    active-value="1"
                    inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="">
                </el-switch>
            </el-form-item>
        </el-form>
        <div class="sms-tips">
            <p>关闭短信提示开关后，系统将不再对以下行为进行短信推送：<br />1、员工发生省市级位置变动（中、高风险区除外）<br />2、员工无流程的外出行为<br />3、返回常驻地提示</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  smsSwitch,
  smsAddOrUpdate,
} from '@/api/system/sysConfig'
export default {
  name: "system-sms",
  components: { },
  data() {
    return {
        baseForm:{
            id:'',
            value:'0'
        },
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    initData() {
      this.listLoading = true;
      this.$nextTick(() => {
        smsSwitch().then(res => {
          if(res.data){
            this.baseForm.value = res.data.value;
            this.baseForm.id =  res.data.id;
          }else{
            this.baseForm.id = '';
            this.baseForm.value = '0';
          }
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      })
    },
    change(val){
        smsAddOrUpdate(this.baseForm).then((res)=>{
            if(res.code=='200'){
                this.$message({
                    message: '保存成功',
                    type: 'success',
                    duration: 1500,
                })
            }
        })
    }
  },
};
</script>

<style scoped lang="scss">
.sms {
    padding: 20px 10px;
    .el-form {
        padding: 0 20px;
    }
    &-tips {
        padding: 0 22px;
        font-size:14px;
        color: #999999;
        line-height:24px;
    }
}
</style>
