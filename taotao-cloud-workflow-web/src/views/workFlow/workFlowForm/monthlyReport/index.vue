<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>月工作总结</h1>
      <span class="number">流程编码：{{dataForm.billNo}}</span>
    </div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px"
      :disabled="setting.readonly">
      <el-row>
        <el-col :span="12" v-if="judgeShow('flowTitle')">
          <el-form-item label="流程标题" prop="flowTitle">
            <el-input v-model="dataForm.flowTitle" placeholder="流程标题"
              :disabled="judgeWrite('flowTitle')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('flowUrgent')">
          <el-form-item label="紧急程度" prop="flowUrgent">
            <el-select v-model="dataForm.flowUrgent" placeholder="选择紧急程度"
              :disabled="judgeWrite('flowUrgent')">
              <el-option :key="item.value" :label="item.label" :value="item.value"
                v-for="item in flowUrgentOptions" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('applyUser')">
          <el-form-item label="创建人员" prop="applyUser">
            <el-input v-model="dataForm.applyUser" placeholder="创建人员" readonly
              :disabled="judgeWrite('applyUser')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('applyDate')">
          <el-form-item label="创建日期" prop="applyDate">
            <el-date-picker v-model="dataForm.applyDate" type="date" placeholder="创建日期"
              value-format="timestamp" format="yyyy-MM-dd" :editable="false" readonly
              :disabled="judgeWrite('applyDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('applyDept')">
          <el-form-item label="所属部门" prop="applyDept">
            <el-input v-model="dataForm.applyDept" placeholder="所属部门" readonly
              :disabled="judgeWrite('applyDept')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('applyPost')">
          <el-form-item label="所属职位" prop="applyPost">
            <el-input v-model="dataForm.applyPost" placeholder="所属职位" readonly
              :disabled="judgeWrite('applyPost')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('planEndTime')">
          <el-form-item label="完成时间" prop="planEndTime">
            <el-date-picker v-model="dataForm.planEndTime" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('planEndTime')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('overalEvaluat')">
          <el-form-item label="总体评价" prop="overalEvaluat">
            <el-input v-model="dataForm.overalEvaluat" placeholder="总体评价" type="textarea" :rows="3"
              :disabled="judgeWrite('overalEvaluat')" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('npworkMatter')">
          <el-form-item label="工作事项" prop="npworkMatter">
            <el-input v-model="dataForm.npworkMatter" placeholder="工作事项"
              :disabled="judgeWrite('npworkMatter')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('npfinishTime')">
          <el-form-item label="次月时间" prop="npfinishTime">
            <el-date-picker v-model="dataForm.npfinishTime" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('npfinishTime')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('nfinishMethod')">
          <el-form-item label="次月目标" prop="nfinishMethod">
            <el-input v-model="dataForm.nfinishMethod" placeholder="次月目标" type="textarea" :rows="3"
              :disabled="judgeWrite('nfinishMethod')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('fileJson')">
          <el-form-item label="相关附件" prop="fileJson">
            <JNPF-UploadFz v-model="fileList" type="workFlow" :disabled="judgeWrite('fileJson')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import comMixin from '../mixin';
export default {
  mixins: [comMixin],
  name: 'MonthlyReport',
  data() {
    return {
      billEnCode: 'WF_MonthlyReportNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        applyUser: '',
        applyDate: '',
        applyDept: '',
        applyPost: '',
        overalEvaluat: '',
        nfinishMethod: '',
        planEndTime: '',
        npfinishTime: '',
        npworkMatter: '',
        fileJson: ''
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.applyDate = new Date().getTime()
      this.dataForm.flowTitle = this.userInfo.userName + "的月工作总结"
      this.dataForm.applyUser = this.userInfo.userName + '/' + this.userInfo.userAccount
      this.dataForm.applyDept = this.userInfo.organizeName
      if (this.userInfo.positionIds && this.userInfo.positionIds.length) {
        let list = this.userInfo.positionIds.map(o => o.name)
        this.dataForm.applyPost = list.join(',')
      }
    }
  }
}
</script>