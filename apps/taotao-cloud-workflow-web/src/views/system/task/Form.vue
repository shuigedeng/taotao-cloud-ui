<template>
  <transition name="el-zoom-in-center">
    <div class="WORKFLOW-preview-main flow-form-main">
      <div class="WORKFLOW-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? '新建任务' : '编辑任务'" />
        <div class="options">
          <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
            {{$t('common.confirmButton')}}</el-button>
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <el-row class="main">
        <el-col :span="14" :offset="5">
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="mt-20"
            label-width="100px" @submit.native.prevent>
            <el-col :span="24">
              <el-form-item label="任务名称" prop="fullName">
                <el-input v-model="dataForm.fullName" placeholder="任务名称" maxlength="100">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务编码" prop="enCode">
                <el-input v-model="dataForm.enCode" placeholder="任务编码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Cron表达式" prop="executeContent.cron">
                <el-input v-model="dataForm.executeContent.cron" placeholder="Cron表达式" readonly>
                  <el-button slot="append" icon="el-icon-edit-outline" @click="showDialog">
                  </el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务类型" prop="executeType">
                <el-radio-group v-model="dataForm.executeType" @change="onExecuteTypeChange">
                  <el-radio label="1">Api数据</el-radio>
                  <el-radio label="2">SQL操作</el-radio>
                  <el-radio label="3">本地任务
                    <el-tooltip content="获取在程序中事先写好的本地方法" placement="top">
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <template v-if="dataForm.executeType=='1'||dataForm.executeType=='2'">
              <el-col :span="24">
                <el-form-item label="接口选择" prop="executeContent.interfaceId">
                  <interface-dialog v-model="dataForm.executeContent.interfaceId"
                    :title="dataForm.executeContent.interfaceName" :dataType="dataType"
                    @change="onFuncChange" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="请求参数" prop="executeContent.parameter">
                  <el-row v-for="(item,i) in dataForm.executeContent.parameter" :key="i"
                    class="mb-10">
                    <el-col :span="11">
                      <span
                        class="required-sign">{{item.required?'*':''}}</span>{{item.fieldName?item.field+'('+item.fieldName+')':item.field}}
                    </el-col>
                    <el-col :span="12" :offset="1">
                      <el-input v-model="item.value" placeholder="请求参数值" clearable />
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </template>
            <template v-if="dataForm.executeType=='3'">
              <el-col :span="24">
                <el-form-item label="方法选择" prop="executeContent.localHostTaskId">
                  <el-select v-model="dataForm.executeContent.localHostTaskId" placeholder="请选择"
                    @change="onLocalHostTaskIdChange">
                    <el-option v-for="item in taskOptions" :key="item.id" :label="item.fullName"
                      :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="24">
              <el-form-item label="任务说明" prop="description">
                <el-input v-model="dataForm.description" placeholder="任务说明" type="textarea"
                  :rows="3" />
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <el-dialog title="Cron表达式" :visible.sync="showCron" :close-on-click-modal="false"
        class="WORKFLOW-dialog WORKFLOW-dialog_center" lock-scroll append-to-body width="700px"
        @closed="showCrontab = false">
        <vcrontab ref="vcrontab" @hide="showCron=false" @fill="crontabFill"
          :expression="dataForm.executeContent.cron" v-if="showCrontab" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="showCron=false">{{$t('common.cancelButton')}}
          </el-button>
          <el-button type="warning" @click="resetCrontab">重 置</el-button>
          <el-button type="primary" @click="getCrontabValue">{{$t('common.confirmButton')}}
          </el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import { TimeTaskInfo, TimeTaskUpdate, TimeTaskCreate, getTaskMethods } from '@/api/system/timeTask'
import vcrontab from "vcrontab"
import InterfaceDialog from '@/components/Process/PropPanel/InterfaceDialog'

export default {
  components: { vcrontab, InterfaceDialog },
  data() {
    return {
      showCron: false,
      showCrontab: true,
      dataForm: {
        id: '',
        fullName: '',
        enCode: '',
        executeType: '1',
        description: '',
        executeContent: {
          cron: '',
          interfaceId: '',
          interfaceName: '',
          parameter: [],
          localHostTaskId: '',
        }
      },
      dataRule: {
        fullName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' },
        ],
        enCode: [
          { required: true, message: '任务编码不能为空', trigger: 'blur' },
          { validator: this.formValidate('enCode', '任务编码只能输入英文、数字和小数点且小数点不能放在首尾'), trigger: 'blur' },
        ],
        'executeContent.cron': [
          { required: true, message: 'Cron表达式不能为空', trigger: 'click' }
        ],
        'executeContent.interfaceId': [
          { required: true, message: '接口选择不能为空', trigger: 'click' }
        ],
        'executeContent.localHostTaskId': [
          { required: true, message: '方法选择不能为空', trigger: 'change' }
        ]
      },
      formVisible: false,
      btnLoading: false,
      taskOptions: []
    }
  },
  computed: {
    dataType() {
      let dataType = 0
      if (this.dataForm.executeType === '1') dataType = 3
      if (this.dataForm.executeType === '2') dataType = 1
      return dataType
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id) {
      this.dataForm = {
        id: '',
        fullName: '',
        enCode: '',
        executeType: '1',
        description: '',
        executeContent: {
          cron: '',
          interfaceId: '',
          interfaceName: '',
          parameter: [],
          localHostTaskId: '',
        }
      }
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        getTaskMethods().then(res => {
          this.taskOptions = res.data || []
          if (this.dataForm.id) {
            TimeTaskInfo(this.dataForm.id).then(res => {
              this.dataForm = res.data
              this.dataForm.executeContent = JSON.parse(res.data.executeContent)
            })
          }
        })
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.executeType === '1' || this.dataForm.executeType === '2') {
            let boo = false
            for (let i = 0; i < this.dataForm.executeContent.parameter.length; i++) {
              const item = this.dataForm.executeContent.parameter[i]
              if (item.required && !item.value) {
                this.$message.error(`${item.field}的参数值为必填`)
                boo = true
                break
              }
            }
            if (boo) return
          }
          this.btnLoading = true
          let executeContent = JSON.stringify(this.dataForm.executeContent)
          let query = { ...this.dataForm, executeContent }
          const formMethod = this.dataForm.id ? TimeTaskUpdate : TimeTaskCreate
          formMethod(query).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => { this.btnLoading = false })
        }
      })
    },
    onFuncChange(id, row) {
      this.dataForm.executeContent.interfaceName = row.fullName
      this.dataForm.executeContent.parameter = row.templateJson.map(o => ({
        ...o,
        value: ''
      }))
    },
    onExecuteTypeChange() {
      this.dataForm.executeContent.interfaceId = ''
      this.dataForm.executeContent.interfaceName = ''
      this.dataForm.executeContent.parameter = []
      this.dataForm.executeContent.localHostTaskId = ''
    },
    onLocalHostTaskIdChange(val) {
      if (!val) return
      let list = this.taskOptions.filter(o => o.id === val)
      if (!list.length) return
      let item = list[0]
      if (!item.cron) return
      this.dataForm.executeContent.cron = item.cron
    },
    getCrontabValue() {
      this.$refs.vcrontab && this.$refs.vcrontab.submitFill()
    },
    resetCrontab() {
      this.$refs.vcrontab && this.$refs.vcrontab.clearCron()
    },
    crontabFill(value) {
      this.dataForm.executeContent.cron = value
    },
    showDialog() {
      this.showCron = true
      this.showCrontab = true
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 10px 10px 0 !important;
}
::v-deep .popup-main {
  .pop_btn {
    display: none !important;
  }
  .popup-result:nth-child(2) {
    margin-bottom: 2px;
  }
}
.delBtn {
  text-align: right;
}
</style>
