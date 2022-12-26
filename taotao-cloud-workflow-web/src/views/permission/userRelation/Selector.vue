<template>
  <el-dialog :title="pageTitle" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll append-to-body
    class="JNPF-dialog JNPF-dialog_center transfer-dialog" width="800px">
    <userTransfer v-model="dataForm.userIds" ref="userTransfer" multiple />
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getUserRelationList, createUserRelation } from '@/api/permission/userRelation'
import userTransfer from '@/components/JNPF-userTransfer'

export default {
  components: { userTransfer },
  data() {
    return {
      visible: false,
      btnLoading: false,
      pageTitle: '',
      dataForm: {
        objectId: '',
        objectType: '',
        userIds: []
      },
    }
  },
  methods: {
    init(id, fullName, type) {
      this.visible = true
      this.dataForm.objectId = id
      this.dataForm.objectType = type
      this.dataForm.userIds = []
      this.$nextTick(() => {
        if (type === 'Position') {
          this.pageTitle = this.$t(`position.postMember`) + '- ' + fullName
        } else if (type === 'Role') {
          this.pageTitle = this.$t(`role.roleMember`) + ' - ' + fullName
        } else if (type === 'Group') {
          this.pageTitle = '组内成员 - ' + fullName
        }
        this.$refs.userTransfer && (this.$refs.userTransfer.allLoading = true)
        getUserRelationList(this.dataForm.objectId).then(res => {
          this.dataForm.userIds = res.data.ids
          this.$refs.userTransfer && this.$refs.userTransfer.init()
        })
      })
    },
    dataFormSubmit() {
      this.btnLoading = true
      createUserRelation(this.dataForm).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.btnLoading = false
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>