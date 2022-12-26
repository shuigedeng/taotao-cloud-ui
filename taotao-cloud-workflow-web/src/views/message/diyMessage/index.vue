<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <div class="JNPF-common-layout-main JNPF-flex-main diy">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="">
                    <el-form-item label="接收人">
                        <el-col :span="10">
                            <!-- <el-select 
                                v-model="value1" 
                                filterable 
                                clearable
                                multiple 
                                size="" 
                                placeholder="请选择">
                                <el-option
                                v-for="item in companyData"
                                :key="item.id"
                                :label="item.fullName"
                                :value="item.id">
                                </el-option>
                            </el-select> -->
                            <JNPF-TreeSelect v-model="ruleForm.ids" :options="companyData" multiple placeholder="全部公司" />
                        </el-col>
                    </el-form-item>
                    <div class="diy-tips">
                        <p>*您可以自定义编辑发送短信，中文英文标点符号全部计算为一个字。签名【中国四联】共计6字。</p>
                        <p>&nbsp;按一条计费规则：字数≤70字。</p>
                        <p>&nbsp;按多条计费规则：字数>70字，按照67字/条计费。多条计费但在手机上呈现成一条完整内容。</p>
                    </div>
                    <el-form-item prop="content">
                        <el-col :span="12">
                            <el-input type="textarea" :rows="10" v-model.trim="ruleForm.content"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item class="diy-ctr">
                        <el-row :span="12">
                            <el-col :span="10">
                                <p>共计 {{count}} 个，共计 {{nums}} 条</p>
                            </el-col>
                            <el-col :span="2">
                                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import { getDepartmentSelector } from '@/api/permission/department'
import { sendUsers } from "@/api/message/message"
export default {
    data() {
        return {
            companyData:[],
            value1:'',
            count:0,
            nums: 0,
            ruleForm: {
                ids: [],
                content:''
            },
            rules: {
                content: [
                    { required: true, message: '请输入自定义短信内容', trigger: 'blur' },
                ],
            }
        };
    },
    watch: {
        'ruleForm.content':function(val){
            this.count = val.length;
            let fl = val.length + 6;
            if(fl > 70){
                this.nums = Math.ceil(fl / 67)
            }else {
                this.nums = 1;
            }
        }
    },
    mounted() {
        this.initPage();
    },
    methods: {
        // submitForm(){
        //     if(this.ruleForm.content.length > 0){
        //         console.log("🚀 ~ file: index.vue ~ line 49 ~ submitForm ~ this.ruleForm", this.ruleForm)
        //     }
            
        // },
        initPage(){
            let id = 0;
            getDepartmentSelector(id).then(result =>{
                let data = result.data.list;
                for(let i = 0; i < data.length; i++){
                    delete data[i].children
                }
                this.companyData = data;
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    sendUsers(this.ruleForm).then(result => {
                        if(result.code == 200){
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.$refs[formName].resetFields();
                            this.$set(this.ruleForm,'ids',[]);
                        }
                    })
                        
                }
            });
        },
    //   resetForm(formName) {
    //     this.$refs[formName].resetFields();
    //   }
    }
}
</script>
<style lang="scss" scoped>
    .diy{
        padding: 30px 20px;
        &-ctr {
            text-align: right;
        }
        &-tips {
            padding-bottom:20px;
            line-height:24px;
            > p{
                font-size: 14px;
                color: #666;
            }
        }
    }
</style>