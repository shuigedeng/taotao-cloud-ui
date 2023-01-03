<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>差旅报销申请表</h1>
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
        <el-col :span="12" v-if="judgeShow('departmental')">
          <el-form-item label="所属部门" prop="departmental">
            <el-input v-model="dataForm.departmental" placeholder="所属部门" readonly
              :disabled="judgeWrite('departmental')"></el-input>
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
        <el-col :span="12" v-if="judgeShow('reimbursementId')">
          <el-form-item label="报销编码" prop="reimbursementId">
            <el-input v-model="dataForm.reimbursementId" placeholder="报销编码"
              :disabled="judgeWrite('reimbursementId')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('billsNum')">
          <el-form-item label="票据数" prop="billsNum">
            <el-input v-model="dataForm.billsNum" placeholder="票据数" type="number"
              :disabled="judgeWrite('billsNum')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('travelerUser')">
          <el-form-item label="出差人员" prop="travelerUser">
            <el-input v-model="dataForm.travelerUser" placeholder="出差人员"
              :disabled="judgeWrite('travelerUser')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('vehicleMileage')">
          <el-form-item label="车辆里程" prop="vehicleMileage">
            <el-input v-model="dataForm.vehicleMileage" placeholder="车辆里程" type="number"
              :disabled="judgeWrite('vehicleMileage')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('roadFee')">
          <el-form-item label="过路费" prop="roadFee">
            <el-input v-model="dataForm.roadFee" placeholder="过路费" type="number"
              :disabled="judgeWrite('roadFee')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('parkingRate')">
          <el-form-item label="停车费" prop="parkingRate">
            <el-input v-model="dataForm.parkingRate" placeholder="停车费" type="number"
              :disabled="judgeWrite('parkingRate')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('breakdownFee')">
          <el-form-item label="故障报修费" prop="breakdownFee">
            <el-input v-model="dataForm.breakdownFee" placeholder="故障报修费" type="number"
              :disabled="judgeWrite('breakdownFee')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('businessMission')">
          <el-form-item label="出差任务" prop="businessMission">
            <el-input v-model="dataForm.businessMission" placeholder="出差任务" type="textarea"
              :rows="3" :disabled="judgeWrite('businessMission')" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('setOutDate')">
          <el-form-item label="出发日期" prop="setOutDate">
            <el-date-picker v-model="dataForm.setOutDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('setOutDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('returnDate')">
          <el-form-item label="回归日期" prop="returnDate">
            <el-date-picker v-model="dataForm.returnDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('returnDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('destination')">
          <el-form-item label="目的地" prop="destination">
            <el-input v-model="dataForm.destination" placeholder="目的地"
              :disabled="judgeWrite('destination')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('planeTicket')">
          <el-form-item label="机票费" prop="planeTicket">
            <el-input v-model="dataForm.planeTicket" placeholder="机票费" type="number"
              :disabled="judgeWrite('planeTicket')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('fare')">
          <el-form-item label="车船费" prop="fare">
            <el-input v-model="dataForm.fare" placeholder="车船费" type="number"
              :disabled="judgeWrite('fare')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('getAccommodation')">
          <el-form-item label="住宿费用" prop="getAccommodation">
            <el-input v-model="dataForm.getAccommodation" placeholder="住宿费用" type="number"
              :disabled="judgeWrite('getAccommodation')">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('railTransit')">
          <el-form-item label="轨道交通费" prop="railTransit">
            <el-input v-model="dataForm.railTransit" placeholder="轨道交通费" type="number"
              :disabled="judgeWrite('railTransit')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('travelAllowance')">
          <el-form-item label="出差补助" prop="travelAllowance">
            <el-input v-model="dataForm.travelAllowance" placeholder="出差补助" type="number"
              :disabled="judgeWrite('travelAllowance')">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('mealAllowance')">
          <el-form-item label="餐补费用" prop="mealAllowance">
            <el-input v-model="dataForm.mealAllowance" placeholder="餐补费用" type="number"
              :disabled="judgeWrite('mealAllowance')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('other')">
          <el-form-item label="其他费用" prop="other">
            <el-input v-model="dataForm.other" placeholder="其他费用" type="number"
              :disabled="judgeWrite('other')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('total')">
          <el-form-item label="总计费用" prop="total">
            <el-input v-model="dataForm.total" placeholder="总计费用" type="number"
              :disabled="judgeWrite('total')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('reimbursementAmount')">
          <el-form-item label="报销金额" prop="reimbursementAmount">
            <el-input v-model="dataForm.reimbursementAmount" placeholder="报销金额" type="number"
              :disabled="judgeWrite('reimbursementAmount')">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('loanAmount')">
          <el-form-item label="借款金额" prop="loanAmount">
            <el-input v-model="dataForm.loanAmount" placeholder="借款金额" type="number"
              :disabled="judgeWrite('loanAmount')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('sumOfMoney')">
          <el-form-item label="补找金额" prop="sumOfMoney">
            <el-input v-model="dataForm.sumOfMoney" placeholder="补找金额" type="number"
              :disabled="judgeWrite('sumOfMoney')"></el-input>
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
  name: 'TravelReimbursement',
  data() {
    var checkStartTime = (rule, value, callback) => {
      if (!this.dataForm.returnDate) {
        callback()
      } else {
        if (this.dataForm.returnDate < value) {
          callback(new Error('出发日期应该小于回归日期'));
        } else {
          this.$refs.dataForm.validateField('endTime');
          callback()
        }
      }
    }
    var checkEndTime = (rule, value, callback) => {
      if (!this.dataForm.setOutDate) {
        callback()
      } else {
        if (this.dataForm.setOutDate > value) {
          callback(new Error('回归日期应该大于出发日期'));
        } else {
          callback()
        }
      }
    }
    return {
      billEnCode: 'WF_TravelReimbursementNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        applyUser: '',
        departmental: '',
        applyDate: '',
        reimbursementId: '',
        billsNum: '',
        travelerUser: '',
        vehicleMileage: '',
        roadFee: '',
        parkingRate: '',
        breakdownFee: '',
        businessMission: '',
        setOutDate: '',
        returnDate: '',
        destination: '',
        planeTicket: '',
        fare: '',
        getAccommodation: '',
        railTransit: '',
        travelAllowance: '',
        mealAllowance: '',
        other: '',
        total: '',
        reimbursementAmount: '',
        loanAmount: '',
        sumOfMoney: ''
      },
      dataRule: {
        destination: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        businessMission: [
          { required: true, message: '出差任务不能为空', trigger: 'change' },
        ],
        setOutDate: [
          { required: true, message: '出发时间不能为空', trigger: 'change' },
          { validator: checkStartTime, trigger: 'change' }
        ],
        returnDate: [
          { required: true, message: '回归时间不能为空', trigger: 'change' },
          { validator: checkEndTime, trigger: 'change' }
        ],
        flowTitle: [
          { required: true, message: '目的地不能为空', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.applyDate = new Date().getTime()
      this.dataForm.flowTitle = this.userInfo.userName + "的差旅报销申请表"
      this.dataForm.applyUser = this.userInfo.userName + '/' + this.userInfo.userAccount
      this.dataForm.departmental = this.userInfo.organizeName
    }
  }
}
</script>