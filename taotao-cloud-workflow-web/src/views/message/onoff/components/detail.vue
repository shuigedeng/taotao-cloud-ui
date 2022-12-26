<template>
    <el-dialog title="短信发送条件" :visible.sync="dialogVisible" width="1010px" :before-close="handleClose" :close-on-click-modal="false">
        <div class="dialog-con">
            <el-table :data="tableData" border :span-method="objectSpanMethod">
                <el-table-column prop="type" label="短信类型" width="200"></el-table-column>
                <el-table-column prop="name" label="接收人" width="100"></el-table-column>
                <el-table-column prop="content" label="内容" ></el-table-column>
                <el-table-column prop="condition" label="条件" width="280"></el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false,
            tableData:[
                {
                    type:"员工发生省市级位置改变",
                    name:"员工",
                    content: "集团疫情防控工作组提示：您已进入XXX境内，请做好防护措施，遵守当地疫情防控政策。",
                    condition:"无中高风险区短信"
                },
                {
                    type:"员工发生省市级位置改变",
                    name:"员工",
                    content: "集团疫情防控工作组提示：您已进入XXX境内，该地区存在中、高风险区，请做好防护措施，遵守当地疫情防控政策。",
                    condition:"有中高风险区短信"
                },
                {
                    type:"员工无流程发生省市级位置改变",
                    name:"员工",
                    content: "您已进入XXX境内，请注意核对您的离开常驻地审批流程",
                    condition:""
                },
                {
                    type:"员工无流程发生省市级位置改变",
                    name:"管理员",
                    content: "您单位员工XXX进入XXX境内，系统未查询到该员工的离开常驻地审批流程",
                    condition:""
                },
                {
                    type:"员工临近离开常驻地返回时间",
                    name:"员工",
                    content: "今天为您的返回常驻地日期，请做好行程安排",
                    condition:"当天早上10点钟"
                },
                {
                    type:"员工临近离开常驻地返回时间",
                    name:"管理员",
                    content: "本周您单位以下人员将返回常驻地：XXX、XXX、XXX",
                    condition:"每周一上午10点发送本周返回常驻地员工"
                },
                {
                    type:"员工临近离开常驻地返回时间",
                    name:"管理员",
                    content: "您单位本周新增返回常驻地人员如下：XXX、XXX、XXX",
                    condition:"每天上午10点发送新增本周返回常驻地员工"
                },
                {
                    type:"审批短信",
                    name:"发起人",
                    content: "您发起的（离开/返回常驻地）流程已于YYYY-MM-DD hh:mm:ss完成审批。（疫情防控系统）",
                    condition:"审批通过通知"
                },
                {
                    type:"审批短信",
                    name:"发起人",
                    content: "您发起的（离开/返回常驻地）流程被驳回。（疫情防控系统）",
                    condition:"审批驳回通知"
                },
                {
                    type:"审批短信",
                    name:"审批人",
                    content: "由XXX发起的（离开常驻地）流程于YYYY-MM-DD hh:mm:ss交由您处理。（疫情防控系统）",
                    condition:"有多级审批时只对流程当前审批人发送"
                },
                {
                    type:"审批短信",
                    name:"抄送人",
                    content: "由XXX发起的（离开常驻地）流程已于YYYY-MM-DD hh:mm:ss完成审批，请知晓。（疫情防控系统）",
                    condition:"离开流程结束后的抄送提示"
                },
                {
                    type:"审批短信",
                    name:"抄送人",
                    content: "由XXX发起的（返回常驻地）流程于YYYY-MM-DD hh:mm:ss交由您处理。（疫情防控系统）",
                    condition:"返回流程只要管理员审批"
                },
                {
                    type:"公告短信",
                    name:"全部",
                    content: "集团疫情防控工作组提示：请登陆疫情防控系统查看",
                    condition:"发送公共自动短信通知"
                },
                {
                    type:"自定义短信",
                    name:"全部",
                    content: "集团管理员可自定义编辑短信发送",
                    condition:"发送公共自动短信通知"
                },
                {
                    type:"公告未查看短信",
                    name:"全部",
                    content: "集团疫情防控工作组提示：截止到YYYY-MM-DD hh点，您有xx条公告未查看，请登录疫情防控系统查看。",
                    condition:"每天下午6点发送"
                }
            ],
            typeArr:[], //全并type
            typeIndex:0, //全并type 索引
            nameArr:[], //全并name
            nameIndex:0, //全并name 索引
        }
    },
    mounted() {
        this.merge();
    },
    methods: {
        handleClose() {
            this.dialogVisible = false;
        },
        openDialog() {
            this.dialogVisible = true;
            // this.initData();
        },
        mergeInit(){
            //初始化合并数组
            this.typeArr = [];
            this.typeIndex = 0;
            this.nameArr = [];
            this.nameIndex = 0;
        },
        merge(){
            //合并表格
            this.mergeInit();
            let data = this.tableData;
            if(data.length > 0){
                for(let i = 0; i < data.length; i++){
                    if(i===0){
                        // 第一行必须存在，以第一行为基础
                        this.typeArr.push(1);
                        this.typeIndex = 0;
                        this.nameArr.push(1);
                        this.nameIndex = 0;
                    }else{
                        // 判断当前元素与上一元素是否相同
                        if(data[i].type == data[i-1].type){
                            this.typeArr[this.typeIndex] += 1;
                            this.typeArr.push(0);
                        }else{
                            this.typeArr.push(1);
                            this.typeIndex = i;
                        }
                        // 合并，注意if 条件以前列为准
                        if(data[i].type == data[i-1].type && data[i].name == data[i-1].name){
                            this.nameArr[this.nameIndex] += 1;
                            this.nameArr.push(0);
                        }else{
                            this.nameArr.push(1);
                            this.nameIndex = i;
                        }

                    }
                }
            }
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }){
            if(columnIndex === 0){
                const row1 = this.typeArr[rowIndex];
                const col1 = row1 > 0 ? 1 : 0;
                return {
                    rowspan: row1,
                    colspan: col1
                }
            }else if (columnIndex === 1){
                const row2 = this.nameArr[rowIndex];
                const col2 = row2 > 0 ? 1 : 0;
                return {
                    rowspan: row2,
                    colspan: col2
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    ::v-deep .el-dialog__body {
        padding: 10px 20px 30px;
    }
    ::v-deep .el-table--small td {
        padding: 5px 0;
    }
</style>