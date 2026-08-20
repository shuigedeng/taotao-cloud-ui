<template>
  <div class="transfer__body" v-loading="allLoading" :style="{height}">
    <div class="transfer-pane">
      <div class="transfer-pane__tools">
        <el-input placeholder="输入关键词进行搜索" v-model="keyword" @keyup.enter.native="getData" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
      </div>
      <div class="transfer-pane__body">
        <el-tabs v-model="activeName" class="transfer-pane__body-tab">
          <el-tab-pane label="全部数据" name="all">
            <el-tree :data="treeData" :props="props" ref="selectTree1" :show-checkbox="true" check-on-click-node
              @node-click="handleNodeClick" @check-change="checkChange" class="WORKFLOW-common-el-tree user-transfer-el-tree" node-key="id"
              v-loading="loading" lazy :load="loadNode">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i :class="data.icon"></i>
                <span class="text">{{node.label}}</span>
              </span>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="当前组织" name="department">
            <el-tree :data="treeData2" :props="props" ref="selectTree2" :show-checkbox="true" :expand-on-click-node="false"
              check-on-click-node @check-change="checkChange" @node-click="handleNodeClick2" class="WORKFLOW-common-el-tree"
              node-key="id" v-loading="loading">
              <span class="custom-tree-node" slot-scope="{ node }">
                <i class="icon-ym icon-ym-tree-user2"></i>
                <span class="text">{{node.label}}</span>
              </span>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="我的下属" name="subordinates">
            <el-tree :data="treeData3" :props="props" ref="selectTree3" :show-checkbox="true" :expand-on-click-node="false"
              check-on-click-node @check-change="checkChange" @node-click="handleNodeClick2" class="WORKFLOW-common-el-tree"
              node-key="id" v-loading="loading">
              <span class="custom-tree-node" slot-scope="{ node }">
                <i class="icon-ym icon-ym-tree-user2"></i>
                <span class="text">{{node.label}}</span>
              </span>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="transfer-pane">
      <div class="transfer-pane__tools">
        <span>已选</span>
        <el-button @click="removeAll" type="text">清空列表</el-button>
      </div>
      <div class="transfer-pane__body shadow right-pane">
        <template>
          <div v-for="(item, index) in selectedData" :key=" index" class="selected-item">
            <span>{{ item.fullName}}</span>
            <i class="el-icon-delete" @click="removeData(index)"></i>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getImUserSelector, getUserInfoList, getSubordinates, getOrganization } from '@/api/permission/user'
export default {
  name: 'WORKFLOW-userTransfer',
  data() {
    return {
      allLoading: false,
      loading: false,
      activeName: '',
      treeData: [],
      treeData2: [],
      treeData3: [],
      selectedData: [],
      props: {
        children: 'children',
        label: 'fullName',
        isLeaf: 'isLeaf',
        disabled: (data) => {  // by xyb
          return data.hasChildren ? true : false
        }
      },
      keyword: '',
      nodeId: '0',
      ids: []
    }
  },
  props: {
    height: {
      type: String,
      default: "380px"
    },
    // allLoading: {
    //   type: Boolean,
    //   default: false
    // },
    value: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    activeName(val) {
      this.keyword = ''
      if (!val) return
      this.nodeId = '0'
      this.treeData = []
      this.treeData2 = []
      this.treeData3 = []
      this.getData()
    }
  },
  methods: {
    cbClickHandle(data) { // by xyb
      if (!this.multiple) {
        this.$refs.selectTree1.setCheckedKeys([], false)
        this.$refs.selectTree2.setCheckedKeys([], false)
        this.$refs.selectTree3.setCheckedKeys([], false)
        this.$refs.selectTree1.setCheckedKeys([data.id], false)
        this.$refs.selectTree2.setCheckedKeys([data.id], false)
        this.$refs.selectTree3.setCheckedKeys([data.id], false)
      }
    },
    init() {
      this.selectedData = []
      this.ids = []
      this.keyword = ''
      this.activeName = ''
      this.nodeId = '0'
      this.$nextTick(() => {
        this.activeName = 'all'
        this.getSelectList()
      })
    },
    getData() {
      if (this.activeName === 'all') {
        this.getList()
      } else if (this.activeName === 'department') {
        this.loading = true
        getOrganization({ keyword: this.keyword, organizeId: '0' }).then(res => {
          this.treeData2 = res.data
          this.loading = false

          // by xyb
          this.$nextTick(() => {
            let ids = this.selectedData.map((item) => {
              return item.id
            })
            // this.$refs.selectTree1.setCheckedKeys(ids, false)
            this.$refs.selectTree2.setCheckedKeys(ids, false)
            // this.$refs.selectTree3.setCheckedKeys(ids, false)
          })
        })
      } else {
        this.loading = true
        getSubordinates(this.keyword).then(res => {
          this.treeData3 = res.data
          this.loading = false

          // by xyb
          this.$nextTick(() => {
            let ids = this.selectedData.map((item) => {
              return item.id
            })
            this.$refs.selectTree3.setCheckedKeys(ids, false)
          })
        })
      }
    },
    getSelectList() {
      this.allLoading = true
      if (!this.value.length) return this.allLoading = false
      getUserInfoList(this.value).then(res => {
        this.selectedData = res.data.list
        this.ids = this.selectedData.map(o => o.id)
        this.allLoading = false
      })
    },
    getList() {
      this.loading = true
      if (this.keyword) this.nodeId = '0'
      getImUserSelector(this.nodeId, this.keyword).then(res => {
        this.treeData = res.data.list
        this.loading = false
        // by xyb
        this.$nextTick(() => {
          let ids = this.selectedData.map((item) => {
            return item.id
          })
          this.$refs.selectTree1.setCheckedKeys(ids, false)
        })
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
    checkChange(data, status) {  // by xyb
      if (data.type !== 'user') return
      if (status) {
        this.handleNodeClick2(data)
      } else {
        this.removeData2(data);
      }
    },
    handleNodeClick(data) {
      if (data.type !== 'user') return
      const boo = this.selectedData.some(o => o.id === data.id)
      if (boo) return
      const item = {
        id: data.id,
        fullName: data.fullName
      }
      //by xyb
      // this.multiple ? this.selectedData.push(item) : this.selectedData = [item]
      // this.multiple ? this.ids.push(item.id) : this.ids = [item.id]
      this.multiple ? this.selectedData.push(data) : this.selectedData = [data]
      this.multiple ? this.ids.push(data.id) : this.ids = [data.id]
      this.$emit('input', this.ids)
      this.$emit('getValue', this.ids, this.selectedData)
    },
    handleNodeClick2(data) {
      const boo = this.selectedData.some(o => o.id === data.id)
      if (boo) return
      const item = {
        id: data.id,
        fullName: data.fullName
      }
      //by xyb
      // this.multiple ? this.selectedData.push(item) : this.selectedData = [item]
      // this.multiple ? this.ids.push(item.id) : this.ids = [item.id]
      this.multiple ? this.selectedData.push(data) : this.selectedData = [data]
      this.multiple ? this.ids.push(data.id) : this.ids = [data.id]
      this.$emit('input', this.ids)
      this.$emit('getValue', this.ids, this.selectedData)
    },
    removeAll() {
      this.selectedData = []
      this.ids = []
      this.$emit('input', this.ids)
      this.$emit('getValue', this.ids, this.selectedData)
      // by xyb
      this.$refs.selectTree1.setCheckedKeys([], false)
      this.$refs.selectTree2.setCheckedKeys([], false)
      this.$refs.selectTree3.setCheckedKeys([], false)
    },
    removeData(index) {
      this.selectedData.splice(index, 1)
      this.ids.splice(index, 1)
      this.$emit('input', this.ids)
      this.$emit('getValue', this.ids, this.selectedData)

      // by xyb

      let ids = this.selectedData.map((item) => {
        return item.id
      })
      this.$refs.selectTree1.setCheckedKeys(ids, false)
      this.$refs.selectTree2.setCheckedKeys(ids, false)
      this.$refs.selectTree3.setCheckedKeys(ids, false)
    },
    removeData2(data){ //by xyb
      let checkedData = this.selectedData.filter((item) => {
        return item.id != data.id;
      })
      this.selectedData = checkedData;
    }
  }
};
</script>
<style lang="scss">

</style>
