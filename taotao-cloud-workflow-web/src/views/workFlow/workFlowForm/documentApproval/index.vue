<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>文件签批意见表</h1>
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
        <el-col :span="12" v-if="judgeShow('fileName')">
          <el-form-item label="文件名称" prop="fileName">
            <el-input v-model="dataForm.fileName" placeholder="文件名称"
              :disabled="judgeWrite('fileName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('draftedPerson')">
          <el-form-item label="拟稿人" prop="draftedPerson">
            <el-input v-model="dataForm.draftedPerson" placeholder="拟稿人"
              :disabled="judgeWrite('draftedPerson')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('serviceUnit')">
          <el-form-item label="发文单位" prop="serviceUnit">
            <el-input v-model="dataForm.serviceUnit" placeholder="发文单位"
              :disabled="judgeWrite('serviceUnit')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('fillPreparation')">
          <el-form-item label="文件拟办" prop="fillPreparation">
            <el-input v-model="dataForm.fillPreparation" placeholder="文件拟办"
              :disabled="judgeWrite('fillPreparation')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('fillNum')">
          <el-form-item label="文件编码" prop="fillNum">
            <el-input v-model="dataForm.fillNum" placeholder="文件编码"
              :disabled="judgeWrite('fillNum')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('receiptDate')">
          <el-form-item label="收文日期" prop="receiptDate">
            <el-date-picker v-model="dataForm.receiptDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('receiptDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('fileJson')">
          <el-form-item label="相关附件" prop="fileJson">
            <JNPF-UploadFz v-model="fileList" type="workFlow" :disabled="judgeWrite('fileJson')" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('modifyOpinion')">
          <el-form-item label="修改意见" prop="modifyOpinion">
            <JNPF-Quill v-model="dataForm.modifyOpinion" :disabled="judgeWrite('modifyOpinion')" />
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
  name: 'DocumentApproval',
  data() {
    return {
      billEnCode: 'WF_DocumentApprovalNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        serviceUnit: '',
        draftedPerson: '',
        fillPreparation: '',
        fillNum: '',
        fileName: '',
        modifyOpinion: '',
        receiptDate: '',
        fileJson: '',
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        receiptDate: [
          { required: true, message: '收文日期不能为空', trigger: 'change' },
        ],
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.flowTitle = this.userInfo.userName + "的文件签批意见表"
    }
  }
}
</script>