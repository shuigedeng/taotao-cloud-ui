<template>
  <el-dialog :title="!dataForm.id ? '新建委托' : '编辑委托'" :close-on-click-modal="false"
    :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px"
      v-loading="loading">
      <el-form-item label="被委托人" prop="toUserId">
        <user-select v-model="dataForm.toUserId" placeholder="选择被委托人" @change="onChange" />
      </el-form-item>
      <el-form-item label="委托流程" prop="flowId">
        <el-select v-model="dataForm.flowId" placeholder="请选择流程" @change="handleChange" filterable>
          <el-option-group v-for="group in flowEngineList" :key="group.id"
            :label="group.fullName+'【'+group.num+'】'">
            <el-option v-for="item in group.children" :key="item.id"
              :label="item.fullName+'/'+item.enCode" :value="item.id">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="dataForm.startTime" type="date" placeholder="选择日期"
          value-format="timestamp" :editable='false' :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="dataForm.endTime" type="date" placeholder="选择日期"
          value-format="timestamp" :editable='false' :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="委托说明" prop="description">
        <el-input v-model="dataForm.description" placeholder="委托说明" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
        {{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { FlowDelegateInfo, Create, Update } from '@/api/workFlow/FlowDelegate'
import { FlowEngineListAll } from '@/api/workFlow/FlowEngine'
export default {
  data() {
    var checkStartTime = (rule, value, callback) => {
      if (!this.dataForm.endTime) {
        callback()
      } else {
        if (this.dataForm.endTime < value) {
          callback(new Error('开始日期应该小于结束日期'));
        } else {
          this.$refs.dataForm.validateField('endTime');
          callback()
        }
      }
    }
    var checkEndTime = (rule, value, callback) => {
      if (!this.dataForm.startTime) {
        callback()
      } else {
        if (this.dataForm.startTime > value) {
          callback(new Error('结束日期应该大于开始日期'));
        } else {
          callback()
        }
      }
    }
    return {
      visible: false,
      pickerOptions: {
        disabledDate: time => {
          return new Date(time).getTime() < new Date().getTime() - 86400000;
        }
      },
      dataForm: {
        id: '',
        toUserId: '',
        flowId: '',
        description: '',
        startTime: '',
        endTime: '',
        flowName: '',
        flowCategory: '',
        toUserName: ''
      },
      dataRule: {
        toUserId: [
          { required: true, message: '被委托人不能为空', trigger: 'click' }
        ],
        flowId: [
          { required: true, message: '委托流程不能为空', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'change' },
          { validator: checkStartTime, trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'change' },
          { validator: checkEndTime, trigger: 'change' }
        ],
      },
      loading: false,
      btnLoading: false,
      flowEngineList: []
    }
  },
  methods: {
    getFlowEngineList() {
      FlowEngineListAll().then((res) => {
        this.flowEngineList = res.data.list
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            FlowDelegateInfo(this.dataForm.id).then(res => {
              this.dataForm = res.data
            })
          }
          this.loading = false
        })
      })
    },
    init(id) {
      this.dataForm.id = id || ''
      this.visible = true
      this.loading = true
      this.getFlowEngineList()
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? Update : Create
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => { this.btnLoading = false })
        }
      })
    },
    handleChange(val) {
      if (!val) {
        this.dataForm.flowName = ''
        this.dataForm.flowCategory = ''
        return
      }
      let active = {}
      for (let i = 0; i < this.flowEngineList.length; i++) {
        const item = this.flowEngineList[i];
        if (item.children && item.children.length) {
          for (let j = 0; j < item.children.length; j++) {
            if (item.children[j].id === val) {
              active = item.children[j]
              break
            }
          }
        }
      }
      this.dataForm.flowName = active.fullName + '/' + active.enCode
      this.dataForm.flowCategory = active.category
    },
    onChange(id, selectedData) {
      if (!id) return this.dataForm.toUserName = ''
      this.dataForm.toUserName = selectedData.fullName
    }
  }
}
</script>