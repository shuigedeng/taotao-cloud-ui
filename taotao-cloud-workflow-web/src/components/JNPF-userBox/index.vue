<template>
  <el-dialog :title="'选择'+title" :close-on-click-modal="false" :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center JNPF-dialog-tree" lock-scroll append-to-body
    width='450px'>
    <el-input placeholder="输入姓名或者编号进行过滤" v-model="keyword" clearable @keyup.enter.native="getList">
      <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
    </el-input>
    <el-tree :data="treeData" :props="props" highlight-current :expand-on-click-node="false"
      check-on-click-node @node-click="handleNodeClick" class="JNPF-common-el-tree" node-key="id"
      v-loading="loading" lazy :load="loadNode">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <i :class="data.icon"></i>
        <span class="text">{{node.label}}</span>
      </span>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getImUserSelector } from '@/api/permission/user'
export default {
  name: 'UserBox',
  props: {
    title: {
      type: String,
      default: '审批人'
    }
  },
  data() {
    return {
      visible: false,
      id: '',
      nodeId: '0',
      props: {
        children: 'children',
        label: 'fullName',
        value: 'id',
        isLeaf: 'isLeaf'
      },
      treeData: [],
      loading: false,
      keyword: ''
    }
  },
  methods: {
    init() {
      this.visible = true
      this.keyword = ''
      this.nodeId = '0'
      this.getList()
    },
    getList() {
      this.loading = true
      if (this.keyword) this.nodeId = '0'
      getImUserSelector(this.nodeId, this.keyword).then(res => {
        this.treeData = res.data.list
        this.loading = false
      })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.nodeId = '0'
        return resolve(this.treeData)
      }
      this.nodeId = node.data.id
      getImUserSelector(this.nodeId).then(res => {
        resolve(res.data.list)
      })
    },
    handleNodeClick(data) {
      if (data.type !== 'user') return
      this.id = data.id
    },
    dataFormSubmit() {
      if (!this.id) {
        this.$message({
          message: `请选择${this.title}`,
          type: 'error',
          duration: 1000,
        })
        return
      }
      this.visible = false
      this.$emit('submit', this.id)
    },
  }
}
</script>