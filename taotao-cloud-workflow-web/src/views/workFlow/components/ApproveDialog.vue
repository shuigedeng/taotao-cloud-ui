<template>
  <el-dialog :title="eventType==='audit'?'审批通过':'审批拒绝'" :close-on-click-modal="false"
    :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll append-to-body
    width='600px'>
    <el-form label-width="130px" ref="dataForm" :model="dataForm">
      <template v-if="eventType==='audit'">
        <el-form-item :label="item.label" :prop="'candidateList.' + i + '.value'"
          v-for="(item,i) in dataForm.candidateList" :key="i" :rules="item.rules">
          <candidate-user-select v-model="item.value" multiple :placeholder="'请选择'+item.label"
            :taskId="taskId" :formData="formData" :nodeId="item.nodeId" />
        </el-form-item>
      </template>
      <el-form-item label="加签人员" v-if="eventType==='audit'&&properties&&properties.hasFreeApprover">
        <user-select v-model="freeApproverUserId" placeholder="请选择加签人员,不选即该节点审核结束" />
      </el-form-item>
      <el-form-item label="审批意见" prop="handleOpinion">
        <el-input v-model="dataForm.handleOpinion" placeholder="请输入审批意见（选填）" type="textarea"
          :rows="4" />
      </el-form-item>
      <el-form-item v-if="properties&&properties.hasSign">
        <div class="sign-main">
          <div class="sign-head">
            <div class="sign-tip">请在这里输入你的签名</div>
            <div class="sign-action">
              <el-button class="clear-btn" size="mini" @click="handleReset">清空</el-button>
              <el-button class="sure-btn" size="mini" @click="handleGenerate" :disabled="!!signImg">
                确定签名</el-button>
            </div>
          </div>
          <div class="sign-box">
            <vue-esign ref="esign" :height="330" v-if="!signImg" :lineWidth="5" />
            <img :src="signImg" alt="" v-if="signImg" class="sign-img">
          </div>
        </div>
      </el-form-item>
      <el-form-item label="抄送人员" prop="copyIds" v-if="properties&&properties.isCustomCopy">
        <user-select v-model="copyIds" placeholder="请选择" multiple />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="handleApproval()" :loading="btnLoading">
        {{$t('common.confirmButton')}}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import vueEsign from 'vue-esign'
import CandidateUserSelect from './CandidateUserSelect'
export default {
  components: { CandidateUserSelect, vueEsign },
  data() {
    return {
      visible: false,
      dataForm: {
        candidateList: [],
        handleOpinion: '',
      },
      copyIds: [],
      freeApproverUserId: '',
      signImg: '',
      btnLoading: false,
      properties: {},
      eventType: '',
      taskId: '',
      formData: {
        flowId: '',
        data: '{}'
      }
    }
  },
  methods: {
    init(properties, taskId, eventType, candidateList, flowId) {
      this.visible = true
      this.properties = properties
      this.taskId = taskId
      this.eventType = eventType || ''
      this.dataForm.candidateList = candidateList || []
      this.dataForm.handleOpinion = ''
      this.formData.flowId = flowId
      this.copyIds = []
      this.signImg = ''
      this.freeApproverUserId = ''
      this.$nextTick(() => {
        this.handleReset()
        this.$refs['dataForm'].resetFields()
      })
    },
    handleApproval() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.properties.hasSign && !this.signImg) {
            this.$message({
              message: '请签名',
              type: 'error'
            })
            return
          }
          let query = {
            handleOpinion: this.dataForm.handleOpinion,
            signImg: this.signImg,
            copyIds: this.copyIds.join(',')
          }
          if (this.dataForm.candidateList.length) {
            let candidateList = {}
            for (let i = 0; i < this.dataForm.candidateList.length; i++) {
              candidateList[this.dataForm.candidateList[i].nodeId] = this.dataForm.candidateList[i].value
            }
            query.candidateList = candidateList
          }
          if (this.eventType === 'audit' && this.properties.hasFreeApprover) {
            query = { freeApproverUserId: this.freeApproverUserId, ...query }
          }
          this.btnLoading = true
          this.$emit('submit', query)
        }
      })
    },
    closeDialog() {
      this.btnLoading = false
      this.visible = false
    },
    handleReset() {
      this.signImg = ''
      this.$nextTick(() => {
        this.$refs.esign && this.$refs.esign.reset()
      })
    },
    handleGenerate() {
      this.$refs.esign.generate().then(res => {
        if (res) this.signImg = res
      }).catch(err => {
        this.$message({
          message: '请签名',
          type: 'warning'
        })
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.sign-main {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  .sign-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #dcdfe6;
    .sign-tip {
      color: #606266;
      font-size: 12px;
    }
    .sign-action {
      display: flex;
      align-items: center;
      .clear-btn,
      .sure-btn {
        margin-left: 5px;
      }
    }
  }
  .sign-box {
    border-top: 0;
    height: 100px;
  }
  .sign-img {
    width: 100%;
  }
}
</style>