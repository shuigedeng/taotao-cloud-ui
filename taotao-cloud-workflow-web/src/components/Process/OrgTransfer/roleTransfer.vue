<template>
  <div class="transfer__body" v-loading="allLoading" :style="{height}">
    <div class="transfer-pane">
      <div class="transfer-pane__tools">
        <el-input placeholder="输入关键词进行搜索" v-model="keyword" @keyup.enter.native="search" clearable>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <div class="transfer-pane__body">
        <el-tabs v-model="activeName" class="transfer-pane__body-tab">
          <el-tab-pane label="全局" name="all">
            <el-tree :data="treeData" :props="props" ref="tree1" default-expand-all
              :filter-node-method="filterNode" :expand-on-click-node="false" check-on-click-node
              @node-click="handleNodeClick" class="JNPF-common-el-tree" node-key="onlyId"
              v-loading="loading">
              <span class="custom-tree-node" slot-scope="{ node,data }">
                <i :class="data.icon" />
                <span class="text">{{node.label}}</span>
              </span>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="组织" name="organize">
            <el-tree :data="treeData2" :props="props" ref="tree2" default-expand-all
              :filter-node-method="filterNode" :expand-on-click-node="false" check-on-click-node
              @node-click="handleNodeClick" class="JNPF-common-el-tree" node-key="onlyId"
              v-loading="loading">
              <span class="custom-tree-node" slot-scope="{ node,data }">
                <i :class="data.icon" />
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
export default {
  name: 'JNPF-userTransfer',
  data() {
    return {
      allLoading: false,
      loading: false,
      activeName: '',
      treeData: [],
      treeData2: [],
      selectedData: [],
      allList: [],
      props: {
        children: 'children',
        label: 'fullName'
      },
      keyword: '',
      ids: []
    }
  },
  props: {
    height: {
      type: String,
      default: "380px"
    },
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
      this.search()
    }
  },
  methods: {
    init() {
      this.selectedData = []
      this.ids = []
      this.keyword = ''
      this.activeName = 'all'
      this.getList()
    },
    getSelectList() {
      this.allLoading = true
      if (!this.value.length) return this.allLoading = false
      let list = []
      for (let i = 0; i < this.value.length; i++) {
        inner: for (let j = 0; j < this.allList.length; j++) {
          if (this.value[i] === this.allList[j].id) {
            list.push(this.allList[j])
            break inner
          }
        }
      }
      this.selectedData = list
      this.ids = this.selectedData.map(o => o.id)
      this.allLoading = false
    },
    search() {
      const tree = this.activeName === 'organize' ? 'tree2' : 'tree1'
      this.$refs[tree].filter(this.keyword)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    },
    getList() {
      this.loading = true
      this.$store.dispatch('base/getRoleTree').then(res => {
        this.treeData = res.filter(o => o.id === '1')
        this.treeData2 = res.filter(o => o.id !== '1')
        this.$store.dispatch('base/getRoleList').then(res => {
          this.allList = res
          this.getSelectList()
          this.loading = false
        })
      })
    },
    handleNodeClick(data) {
      if (data.type !== 'role') return
      const boo = this.selectedData.some(o => o.id === data.id)
      if (boo) return
      const item = {
        id: data.id,
        fullName: data.fullName
      }
      this.multiple ? this.selectedData.push(item) : this.selectedData = [item]
      this.multiple ? this.ids.push(item.id) : this.ids = [item.id]
      this.$emit('input', this.ids)
      this.$emit('getValue', this.ids, this.selectedData)
    },
    removeAll() {
      this.selectedData = []
      this.ids = []
      this.$emit('input', this.ids)
      this.$emit('getValue', this.ids, this.selectedData)
    },
    removeData(index) {
      this.selectedData.splice(index, 1)
      this.ids.splice(index, 1)
      this.$emit('input', this.ids)
      this.$emit('getValue', this.ids, this.selectedData)
    },
  }
};
</script>
<style lang="scss" scoped>
.transfer-pane__body-tab {
  ::v-deep .el-tabs__item {
    width: 50% !important;
  }
}
</style>