<template>
  <el-dialog title="提交审核" :close-on-click-modal="false"
    class="JNPF-dialog JNPF-dialog_center form-script-dialog" lock-scroll append-to-body
    v-bind="$attrs" width="600px" :modal-append-to-body="false" v-on="$listeners" @open="onOpen">
    <el-form label-width="130px" ref="candidateForm" :model="candidateForm">
      <el-form-item :label="item.label" :prop="'candidateList.' + i + '.value'"
        v-for="(item,i) in candidateForm.candidateList" :key="i" :rules="item.rules">
        <candidate-user-select v-model="item.value" multiple :placeholder="'请选择'+item.label"
          :taskId="taskId" :formData="formData" :nodeId="item.nodeId" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="submitCandidate()">{{$t('common.confirmButton')}}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import CandidateUserSelect from './CandidateUserSelect'
export default {
  components: { CandidateUserSelect },
  props: ['candidateList', 'taskId', 'formData'],
  data() {
    return {
      candidateForm: {
        candidateList: []
      }
    }
  },
  methods: {
    onOpen() {
      this.candidateForm.candidateList = this.candidateList.map(o => ({
        ...o,
        label: o.nodeName + '审批人',
        value: [],
        rules: [{ required: true, message: `${o.nodeName}审批人不能为空`, trigger: 'click' }]
      }))
      this.$nextTick(() => {
        this.$refs['candidateForm'].resetFields()
      })
    },
    submitCandidate() {
      this.$refs['candidateForm'].validate((valid) => {
        if (valid) {
          let candidateList = {}
          for (let i = 0; i < this.candidateForm.candidateList.length; i++) {
            candidateList[this.candidateForm.candidateList[i].nodeId] = this.candidateForm.candidateList[i].value
          }
          this.$emit('submitCandidate', candidateList)
        }
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
  }
}
</script>