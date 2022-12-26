<template>
  <div class="app-container JNPF-flex-main authorize-container">
    <div class="JNPF-common-head">
      <div class="el-page-header__content">权限批量设置</div>
      <div class="btn-group">
        <el-dropdown style="margin-right: 8px">
          <el-button plain>
            {{$t('authorize.operation')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleCheck('checkAll')"> {{$t('authorize.checkAll')}}
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleCheck('cancelCheckAll')">
              {{$t('authorize.deselectAll')}}</el-dropdown-item>
            <el-dropdown-item @click.native="setAllExpand('open')">{{$t('authorize.expandAll')}}
            </el-dropdown-item>
            <el-dropdown-item @click.native="setAllExpand('close')">{{$t('authorize.foldAll')}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button :disabled="active <= 0 || treeLoading" @click="handlePrevStep">
          {{$t('common.prev')}}</el-button>
        <el-button :disabled="active >= 5 || treeLoading" @click="handleNextStep">
          {{$t('common.next')}}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="active < 5"
          @click="handleConfirm()">{{$t('common.confirmButton')}}</el-button>
      </div>
    </div>
    <el-steps :active="active" finish-status="success" simple>
      <el-step :title="$t('authorize.menuPermission')"></el-step>
      <el-step :title="$t('authorize.buttonPermission')"></el-step>
      <el-step :title="$t('authorize.listPermission')"></el-step>
      <el-step :title="$t('authorize.formPermission')"></el-step>
      <el-step :title="$t('authorize.dataPermission')"></el-step>
      <el-step :title="$t('authorize.selectRoles')"></el-step>
    </el-steps>
    <div class="authorize-bd">
      <div v-if="active < 5">
        <el-tree :data="authorizeTreeData" ref="authorizeTree" v-loading="treeLoading" show-checkbox
          default-expand-all node-key="id" :check-strictly="checkStrictly" check-on-click-node
          :props="defaultProps" :expand-on-click-node="false" @check-change="selectTreeNodeClick">
          <span slot-scope="{ node, data }">
            <i :class="data.icon" />
            <span style="padding-left: 4px;">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div class="authorize-selectbox" v-else>
        <el-tree :data="roleTreeAllData" ref="roleTree" v-loading="roleTreeLoading" show-checkbox
          default-expand-all node-key="onlyId" :props="defaultProps" check-on-click-node
          :expand-on-click-node="false" @check-change="selectTreeNodeClick">
          <span slot-scope="{ node, data }">
            <i :class="data.icon" />
            <span style="padding-left: 4px;">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoleSelector } from '@/api/permission/role'
import { getAuthorizeValues, updateBatchAuthorize } from '@/api/permission/authorize'

export default {
  name: 'permission-authorize',
  data() {
    return {
      active: 0,
      roleTreeLoading: false,
      treeLoading: false,
      btnLoading: false,
      checkStrictly: true,
      objectId: 0,
      params: {
        type: 'module',
        moduleIds: ''
      },
      dataForm: {
        roleIds: [],
        module: [],
        button: [],
        column: [],
        form: [],
        resource: []
      },
      roleTreeAllData: [],
      roleAllIds: [],
      positionTreeData: [],
      authorizeTreeData: [],
      moduleAuthorizeTree: [],
      buttonAuthorizeTree: [],
      columnAuthorizeTree: [],
      formAuthorizeTree: [],
      resourceAuthorizeTree: [],
      moduleAllData: [],
      buttonAllData: [],
      columnAllData: [],
      formAllData: [],
      resourceAllData: [],
      moduleIdsTemp: [],
      defaultProps: { // 配置项（必选）
        value: 'id',
        label: 'fullName',
        children: 'children',
        disabled: 'disabled'
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      Object.assign(this.$data, this.$options.data())
      this.getAuthorizeList()
    },
    getRoleList() {
      this.roleTreeLoading = true
      getRoleSelector().then(res => {
        let ids = []
        const loop = list => {
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            ids.push(item.onlyId)
            if (item.children && item.children.length) {
              loop(item.children)
            }
          }
        }
        loop(res.data.list)
        this.roleAllIds = ids
        this.roleTreeAllData = res.data.list
        this.roleTreeLoading = false
      }).catch(() => {
        this.roleTreeLoading = false
      })
    },
    getAuthorizeList() {
      this.treeLoading = true
      this.authorizeTreeData = []
      getAuthorizeValues(this.objectId, this.params).then(res => {
        switch (this.active) {
          case 0:
            this.moduleAuthorizeTree = res.data.list
            this.moduleAllData = res.data.all
            this.authorizeTreeData = this.moduleAuthorizeTree
            const moduleIds = [...this.moduleIdsTemp, ...res.data.ids]
            this.dataForm.module = [...new Set(moduleIds)]
            this.moduleIdsTemp = this.dataForm.module
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.module)
            break
          case 1:
            this.buttonAuthorizeTree = res.data.list
            this.buttonAllData = res.data.all
            this.authorizeTreeData = this.buttonAuthorizeTree
            this.dataForm.button = [...this.dataForm.button, ...res.data.ids, ...this.moduleIdsTemp]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.button)
            break
          case 2:
            this.columnAuthorizeTree = res.data.list
            this.columnAllData = res.data.all
            this.authorizeTreeData = this.columnAuthorizeTree
            this.dataForm.column = [...this.dataForm.column, ...res.data.ids, ...this.moduleIdsTemp]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.column)
            break
          case 3:
            this.formAuthorizeTree = res.data.list
            this.formAllData = res.data.all
            this.authorizeTreeData = this.formAuthorizeTree
            this.dataForm.form = [...this.dataForm.form, ...res.data.ids, ...this.moduleIdsTemp]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.form)
            break
          case 4:
            this.resourceAuthorizeTree = res.data.list
            this.resourceAllData = res.data.all
            this.authorizeTreeData = this.resourceAuthorizeTree
            this.dataForm.resource = [...this.dataForm.resource, ...res.data.ids, ...this.moduleIdsTemp]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.resource)
            break
        }
        this.checkStrictly = false
        this.treeLoading = false
      }).catch(() => {
        this.treeLoading = false
      })
    },
    // 全选/全不选
    handleCheck(val) {
      if (val === 'checkAll') {
        switch (this.active) {
          case 0:
            this.$refs.authorizeTree.setCheckedKeys(this.moduleAllData)
            break
          case 1:
            this.$refs.authorizeTree.setCheckedKeys(this.buttonAllData)
            break
          case 2:
            this.$refs.authorizeTree.setCheckedKeys(this.columnAllData)
            break
          case 3:
            this.$refs.authorizeTree.setCheckedKeys(this.formAllData)
            break
          case 4:
            this.$refs.authorizeTree.setCheckedKeys(this.resourceAllData)
            break
          case 5:
            this.$refs.roleTree.setCheckedKeys(this.roleAllIds)
        }
      }
      if (val === 'cancelCheckAll') {
        if (this.active === 5) {
          this.$refs.roleTree.setCheckedKeys([])
        } else {
          this.$refs.authorizeTree.setCheckedKeys([])
        }
      }
    },
    // 折叠 展开
    setAllExpand(state) {
      let result
      if (state === 'open') {
        result = true
      }
      if (state === 'close') {
        result = false
      }
      let nodes
      if (this.active === 5) {
        nodes = this.$refs.roleTree.store.nodesMap
      } else {
        nodes = this.$refs.authorizeTree.store.nodesMap
      }
      for (let i in nodes) {
        nodes[i].expanded = result
      }
    },
    // 上一步
    handlePrevStep() {
      this.active -= 1
      this.handleInitData()
    },
    // 下一步
    handleNextStep() {
      if (this.active++ > 5) this.active = 0
      this.handleInitData()
    },
    handleInitData() {
      this.checkStrictly = true
      this.treeLoading = true
      switch (this.active) {
        case 0:
          this.params.type = 'module'
          break
        case 1:
          this.params.type = 'button'
          this.params.moduleIds = (this.moduleIdsTemp).toString()
          break
        case 2:
          this.params.type = 'column'
          this.params.moduleIds = (this.moduleIdsTemp).toString()
          break
        case 3:
          this.params.type = 'form'
          this.params.moduleIds = (this.moduleIdsTemp).toString()
          break
        case 4:
          this.params.type = 'resource'
          this.params.moduleIds = (this.moduleIdsTemp).toString()
          break
        case 5:
          this.getRoleList()
          this.$nextTick(() => {
            this.$refs.roleTree.setCheckedKeys(this.dataForm.roleIds)
          })
          break
      }
      if (this.active !== 5) {
        this.getAuthorizeList()
      } else {
        this.treeLoading = false
      }
    },
    // 设置数据
    selectTreeNodeClick() {
      let dataIds = []
      if (this.active !== 5) {
        const parentIds = this.$refs.authorizeTree.getHalfCheckedKeys()
        const childrenIds = this.$refs.authorizeTree.getCheckedKeys()
        const newIds = [...parentIds, ...childrenIds]
        dataIds = [...new Set(newIds)]
      }
      switch (this.active) {
        case 0:
          this.dataForm.module = dataIds
          this.moduleIdsTemp = this.dataForm.module
          break
        case 1:
          this.dataForm.button = dataIds
          break
        case 2:
          this.dataForm.column = dataIds
          break
        case 3:
          this.dataForm.form = dataIds
          break
        case 4:
          this.dataForm.resource = dataIds
          break
        case 5:
          let nodes = this.$refs.roleTree.getCheckedNodes()
          this.dataForm.roleIds = nodes.map(o => o.id)
          break
      }
    },
    handleConfirm() {
      this.btnLoading = true
      updateBatchAuthorize(this.dataForm).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.btnLoading = false
            this.active = 0
            this.initData()
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.authorize-container {
  padding: 0;
  .el-steps {
    border-radius: 0;
  }
}
.authorize-bd {
  padding: 20px;
  height: calc(100% - 50px);
  font-size: 14px;
  overflow: auto;
  overflow-x: hidden;
}
</style>
