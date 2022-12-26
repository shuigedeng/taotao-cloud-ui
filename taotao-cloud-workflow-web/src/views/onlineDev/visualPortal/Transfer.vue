
<template>
  <el-dialog title="选择角色" :close-on-click-modal="false"
    class="JNPF-dialog JNPF-dialog_center transfer-dialog" lock-scroll append-to-body
    v-bind="$attrs" width="800px" :modal-append-to-body="false" v-on="$listeners" @open="onOpen">
    <roleTransfer v-model="selectedData" ref="roleTransfer" multiple />
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeTransfer">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getModelData, setModelData } from '@/api/permission/authorize'
import { getRoleSelector } from '@/api/permission/role'
import roleTransfer from '@/components/Process/OrgTransfer/roleTransfer'

export default {
  name: 'transfer',
  components: { roleTransfer },
  props: {
    id: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      selectedData: [],
      treeData: [],
      loading: false,
    }
  },
  methods: {
    onOpen() {
      this.dataInit()
    },
    closeTransfer() {
      this.$emit('update:visible', false)
    },
    confirm() {
      let query = { itemType: 'portal', objectType: 'Role', objectId: this.selectedData }
      setModelData(this.id, query).then(res => {
        this.$message({
          type: 'success',
          message: res.msg,
          duration: 1000,
          onClose: () => {
            this.closeTransfer()
          }
        });
      })
    },
    async dataInit() {
      this.loading = true
      this.selectedData = []
      getModelData(this.id, 'Role').then(res => {
        this.selectedData = res.data.ids
        this.$nextTick(() => {
          this.$refs.roleTransfer && this.$refs.roleTransfer.init()
        })
        this.loading = false
      })
    },
  }
}
</script>