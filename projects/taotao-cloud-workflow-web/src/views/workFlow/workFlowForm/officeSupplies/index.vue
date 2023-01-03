<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>领用办公用品申请表</h1>
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
          <el-form-item label="申请人员" prop="applyUser">
            <el-input v-model="dataForm.applyUser" placeholder="申请人员" readonly
              :disabled="judgeWrite('applyUser')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('department')">
          <el-form-item label="所属部门" prop="department">
            <el-input v-model="dataForm.department" placeholder="所属部门" readonly
              :disabled="judgeWrite('department')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('applyDate')">
          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker v-model="dataForm.applyDate" type="date" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd" :editable="false" readonly
              :disabled="judgeWrite('applyDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('useStock')">
          <el-form-item label="领用仓库" prop="useStock">
            <el-input v-model="dataForm.useStock" placeholder="领用仓库"
              :disabled="judgeWrite('useStock')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('classification')">
          <el-form-item label="用品分类" prop="classification">
            <el-input v-model="dataForm.classification" placeholder="用品分类"
              :disabled="judgeWrite('classification')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('articlesName')">
          <el-form-item label="用品名称" prop="articlesName">
            <el-input v-model="dataForm.articlesName" placeholder="用品名称"
              :disabled="judgeWrite('articlesName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('articlesNum')">
          <el-form-item label="用品数量" prop="articlesNum">
            <el-input v-model="dataForm.articlesNum" placeholder="用品数量"
              :disabled="judgeWrite('articlesNum')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('articlesId')">
          <el-form-item label="用品编码" prop="articlesId">
            <el-input v-model="dataForm.articlesId" placeholder="用品编码"
              :disabled="judgeWrite('articlesId')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('applyReasons')">
          <el-form-item label="申请原因" prop="applyReasons">
            <el-input v-model="dataForm.applyReasons" placeholder="申请原因" type="textarea" :rows="3"
              :disabled="judgeWrite('applyReasons')" />
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
  name: 'OfficeSupplies',
  data() {
    return {
      billEnCode: 'WF_OfficeSuppliesNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        applyUser: '',
        department: '',
        applyDate: '',
        useStock: '',
        classification: '',
        articlesName: '',
        articlesNum: '',
        articlesId: '',
        applyReasons: '',
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        articlesNum: [
          { pattern: /^[1-9]\d*$/, message: '请输入正整数' }
        ]
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.applyDate = new Date().getTime()
      this.dataForm.flowTitle = this.userInfo.userName + "的领用办公用品申请表"
      this.dataForm.applyUser = this.userInfo.userName + '/' + this.userInfo.userAccount
      this.dataForm.department = this.userInfo.organizeName
    }
  }
}
</script>