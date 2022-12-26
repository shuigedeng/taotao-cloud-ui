<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <div class="JNPF-common-layout-main JNPF-flex-main onoff">
                <div class="onoff-tips">
                    <p>*关闭短信开关后，系统将不再对其发送短信，<a @click="checkDetail">点击查看</a>短信发送条件</p>
                </div>
                <div class="onoff-main">
                    <el-switch 
                        v-for="(item,index) in switchData"
                        :key = "index"
                        style="display: block"
                        v-model="switchData[index].value"
                        active-value="1"
                        inactive-value="0"
                        active-color="#13ce66"
                        :active-text="showTitle(item.type)"
                        @change = "switchChange(switchData[index])"
                        >
                    </el-switch>
                    <!-- <el-switch
                        style="display: block"
                        v-model="value1"
                        active-value="1"
                        inactive-value="0"
                        active-color="#13ce66"
                        active-text="员工发生省市级位置改变"
                        >
                    </el-switch>
                    <el-switch
                        style="display: block"
                        v-model="value2"
                        active-value="1"
                        inactive-value="0"
                        active-color="#13ce66"
                        active-text="员工无流程发生省市级位置改变"
                        >
                    </el-switch>
                    <el-switch
                        style="display: block"
                        v-model="value3"
                        active-value="1"
                        inactive-value="0"
                        active-color="#13ce66"
                        active-text="员工临近离开常驻地返回时间"
                        >
                    </el-switch>
                    <el-switch
                        style="display: block"
                        v-model="value4"
                        active-value="1"
                        inactive-value="0"
                        active-color="#13ce66"
                        active-text="审批短信"
                        >
                    </el-switch>
                    <el-switch
                        style="display: block"
                        v-model="value5"
                        active-value="1"
                        inactive-value="0"
                        active-color="#13ce66"
                        active-text="公告通知短信"
                        >
                    </el-switch>
                    <el-switch
                        style="display: block"
                        v-model="value6"
                        active-value="1"
                        inactive-value="0"
                        active-color="#13ce66"
                        active-text="公告未查看短信"
                        >
                    </el-switch> -->
                </div>
            </div>
        </div>
        <detail ref="detail"></detail>
    </div>
</template>
<script>
import detail from "./components/detail";
import {smsSwitch ,addOrUpdate} from "@/api/message/message"
export default {
    name: "message-onoff",
    components: { detail },
    data() {
        return{
            switchData:[],
        }
    },
    created() {

    },
    mounted() {
        this.initPage();
    },
    methods: {
        checkDetail(){
            this.$refs.detail.openDialog();
        },
        initPage(){
            const _this= this;
            _this.switchData = [];
            smsSwitch().then(result => {
                let data = result.data;
                for(let key in data){
                    _this.switchData.push(data[key])
                }

            })
        },
        showTitle(code){
            switch (code){
                case 'APPROVAL_SWITCH': 
                    return '审批短信'
                    break;
                case 'MESSAGE_NOT_VIEWED_SWITCH':
                    return '公告未查看短信'
                    break;
                case 'MESSAGE_SWITCH':
                    return '公告通知短信'
                    break;
                case 'POSITION_CHANGE_SWITCH':
                    return '员工发生省市级位置改变'
                    break;
                case 'NO_PROCESS_POSITION_CHANGE_SWITCH':
                    return '员工无流程发生省市级位置改变'
                    break;
                case 'RETURN_TO_CHONGQING_MANAGER_SWITCH':
                    return '员工临近离开常驻地返回时间'
                    break;
                default:
                    return code;
                    break;
            }
            
        },
        switchChange(data){
            let params = {
                id : data.id,
                type : data.type,
                value : data.value
            }
            addOrUpdate(params).then(result =>{
                if(result.code == 200){
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    })
                }
            })
        }
    }
}
</script>
<style scoped lang="scss">
.onoff {
    padding: 30px;

    &-tips{
        font-size:14px;
        color: #666;
        a {
            color:#409efe;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    .el-switch {
        margin: 20px 0;
    }
}
::v-deep .el-switch__label{
    color: #999;
}
</style>
