<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>发文单</h1>
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
        <el-col :span="12" v-if="judgeShow('hostUnit')">
          <el-form-item label="主办单位" prop="hostUnit">
            <el-input v-model="dataForm.hostUnit" placeholder="主办单位"
              :disabled="judgeWrite('hostUnit')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('title')">
          <el-form-item label="发文标题" prop="title">
            <el-input v-model="dataForm.title" placeholder="发文标题" :disabled="judgeWrite('title')">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('issuedNum')">
          <el-form-item label="发文字号" prop="issuedNum">
            <el-input v-model="dataForm.issuedNum" placeholder="发文字号"
              :disabled="judgeWrite('issuedNum')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('writingDate')">
          <el-form-item label="发文日期" prop="writingDate">
            <el-date-picker v-model="dataForm.writingDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('writingDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('shareNum')">
          <el-form-item label="份数" prop="shareNum">
            <el-input v-model="dataForm.shareNum" placeholder="份数"
              :disabled="judgeWrite('shareNum')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('mainDelivery')">
          <el-form-item label="主送" prop="mainDelivery">
            <el-input v-model="dataForm.mainDelivery" placeholder="主送"
              :disabled="judgeWrite('mainDelivery')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('copy')">
          <el-form-item label="抄送" prop="copy">
            <el-input v-model="dataForm.copy" placeholder="抄送" :disabled="judgeWrite('copy')">
            </el-input>
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
  name: 'LetterService',
  data() {
    return {
      billEnCode: 'WF_LetterServiceNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        shareNum: '',
        issuedNum: '',
        mainDelivery: '',
        title: '',
        hostUnit: '',
        writingDate: '',
        copy: '',
        fileJson: '',
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        writingDate: [
          { required: true, message: '发文日期不能为空', trigger: 'change' },
        ],
        shareNum: [
          { pattern: /^[1-9]\d*$/, message: '请输入正整数' }
        ]
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.flowTitle = this.userInfo.userName + "的发文单"
    }
  }
}
</script>