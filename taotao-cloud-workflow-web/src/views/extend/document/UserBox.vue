<template>
  <el-dialog title="共享文件" :close-on-click-modal="false" :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center transfer-dialog" lock-scroll width='800px'>
    <userTransfer v-model="checkedKeys" ref="userTransfer" multiple />
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ShareCreate, ShareUserList } from '@/api/extend/document'
import userTransfer from '@/components/JNPF-userTransfer'
export default {
  components: { userTransfer },
  data() {
    return {
      visible: false,
      documentId: '',
      treeData: [],
      checkedKeys: [],
    }
  },
  methods: {
    init(id) {
      if (!id) return
      this.documentId = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs.userTransfer && (this.$refs.userTransfer.allLoading = true)
        ShareUserList(this.documentId).then(res => {
          let list = res.data.list.map(o => o.shareUserId)
          this.checkedKeys = list.length ? list : []
          this.$refs.userTransfer && this.$refs.userTransfer.init()
        })
      })
    },
    dataFormSubmit() {
      if (!this.checkedKeys.length) {
        this.$message({
          message: '请选择共享人员',
          type: 'error',
          duration: 1000,
        })
        return
      }
      ShareCreate(this.documentId, this.checkedKeys.join(',')).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refresh')
          }
        })
      })
    }
  }
}
</script>