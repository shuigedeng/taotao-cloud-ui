<template>
  <div class="popupSelect-container">
    <div class="el-select" @click.stop="openDialog">
      <div class="el-select__tags" v-if="multiple" ref="tags"
        :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%', cursor: 'pointer' }">
        <span v-if="collapseTags && tagsList.length">
          <el-tag :closable="!selectDisabled" :size="collapseTagSize" type="info" @close="deleteTag($event, 0)"
            disable-transitions>
            <span class="el-select__tags-text">{{ tagsList[0].fullName }}</span>
          </el-tag>
          <el-tag v-if="tagsList.length > 1" :closable="false" type="info" disable-transitions>
            <span class="el-select__tags-text">+ {{ tagsList.length - 1 }}</span>
          </el-tag>
        </span>
        <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
          <el-tag v-for="(item, i) in tagsList" :key="item.id" :size="collapseTagSize" :closable="!selectDisabled"
            type="info" @close="deleteTag($event, i)" disable-transitions>
            <span class="el-select__tags-text">{{ item.fullName }}</span>
          </el-tag>
        </transition-group>
      </div>
      <el-input ref="reference" v-model="innerValue" type="text" :placeholder="currentPlaceholder"
        :disabled="selectDisabled" readonly :validate-event="false" :tabindex="(multiple) ? '-1' : null"
        @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false">
        <template slot="suffix">
          <i v-show="!showClose" :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up']"></i>
          <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close"
            @click="handleClearClick"></i>
        </template>
      </el-input>
    </div>
    <el-dialog title="选择用户" :close-on-click-modal="false" :visible.sync="visible"
      class="WORKFLOW-dialog WORKFLOW-dialog_center transfer-dialog" lock-scroll append-to-body width="800px"
      :modal-append-to-body="false" @close="onClose">
      <div class="transfer__body">
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <el-input placeholder="请输入关键词查询" v-model="keyword" @keyup.enter.native="getData" clearable
              class="search-input">
              <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
            </el-input>
          </div>
          <div class="transfer-pane__body">
            <el-tabs v-model="activeName" class="transfer-pane__body-tab">
              <el-tab-pane label="全部数据" name="all">
                <el-tree :data="treeData" :props="props" ref="selectTree1" :show-checkbox="true" check-on-click-node
                  @node-click="handleNodeClick" @check-change="checkChange" class="WORKFLOW-common-el-tree" node-key="id"
                  v-loading="loading" lazy :load="loadNode">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <i :class="data.icon"></i>
                    <span class="text">{{ node.label }}</span>
                  </span>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane label="当前组织" name="department">
                <el-tree :data="treeData2" :props="props" ref="selectTree2" :show-checkbox="true"
                  :expand-on-click-node="false" check-on-click-node @node-click="handleNodeClick2"
                  @check-change="checkChange" class="WORKFLOW-common-el-tree" node-key="id" v-loading="loading">
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <i class="icon-ym icon-ym-tree-user2"></i>
                    <span class="text">{{ node.label }}</span>
                  </span>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane label="我的下属" name="subordinates">
                <el-tree :data="treeData3" :props="props" :expand-on-click-node="false" ref="selectTree3"
                  :show-checkbox="true" check-on-click-node @node-click="handleNodeClick2" @check-change="checkChange"
                  class="WORKFLOW-common-el-tree" node-key="id" v-loading="loading">
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <i class="icon-ym icon-ym-tree-user2"></i>
                    <span class="text">{{ node.label }}</span>
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
              <div v-for="(item, index) in selectedData" :key="index" class="selected-item">
                <span>{{ item.fullName }}</span>
                <i class="el-icon-delete" @click="removeData(index)"></i>
              </div>
            </template>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('common.confirmButton') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getImUserSelector, getUserInfoList, getSubordinates, getOrganization } from '@/api/permission/user'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
export default {
  name: 'userSelect',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    size: String,
  },
  data() {
    return {
      visible: false,
      keyword: '',
      activeName: '',
      nodeId: '',
      innerValue: '',
      loading: false,
      props: {
        children: 'children',
        label: 'fullName',
        isLeaf: 'isLeaf',
        disabled: (data) => {
          //return data.children && data.children != null && data.children.length > 0 ? true : false
          return data.hasChildren ? true : false
        }
      },
      treeData: [],
      treeData2: [],
      treeData3: [],
      selectedData: [],
      tagsList: [],
      inputHovering: false,
      inputWidth: 0,
      initialInputHeight: 0,
    }
  },
  watch: {
    value(val) {
      this.setDefault()
    },
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    activeName(val) {
      this.keyword = ''
      if (!val) return
      this.nodeId = '0'
      this.treeData = []
      this.treeData2 = []
      this.treeData3 = []
      this.getData()
    },
  },
  computed: {
    showClose() {
      let hasValue = this.multiple
        ? Array.isArray(this.value) && this.value.length > 0
        : this.value !== undefined && this.value !== null && this.value !== '';
      let criteria = this.clearable &&
        !this.selectDisabled &&
        this.inputHovering &&
        hasValue;
      return criteria;
    },
    currentPlaceholder() {
      if (this.multiple && Array.isArray(this.value) && this.value.length) {
        return ''
      } else {
        return this.placeholder
      }
    },
    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    selectSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1
        ? 'mini'
        : 'small';
    },
    userInfo() {
      return this.$store.getters.userInfo
    },
  },
  created() {
    this.setDefault()
  },

  mounted() {
    addResizeListener(this.$el, this.handleResize);

    const reference = this.$refs.reference;
    if (reference && reference.$el) {
      const sizeMap = {
        medium: 36,
        small: 32,
        mini: 28
      };
      const input = reference.$el.querySelector('input');
      this.initialInputHeight = input.getBoundingClientRect().height || sizeMap[this.selectSize];
    }
    if (this.multiple) {
      this.resetInputHeight();
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width;
      }
    });
    this.setDefault()
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
  },
  methods: {
    cbClickHandle(data) {
      if (!this.multiple) {
        this.$refs.selectTree1.setCheckedKeys([], false)
        this.$refs.selectTree2.setCheckedKeys([], false)
        this.$refs.selectTree3.setCheckedKeys([], false)
        this.$refs.selectTree1.setCheckedKeys([data.id], false)
        this.$refs.selectTree2.setCheckedKeys([data.id], false)
        this.$refs.selectTree3.setCheckedKeys([data.id], false)
      }
    },
    onClose() {
      this.activeName = ''
    },
    openDialog() {
      if (this.selectDisabled) return
      this.visible = true
      this.activeName = 'all'
      this.keyword = ''
      this.nodeId = '0'
      this.selectedData = []
      this.setDefault()
    },
    confirm() {
      if (this.multiple) {
        this.innerValue = ''
        this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        let selectedIds = this.selectedData.map(o => o.id)
        this.$emit('input', selectedIds)
        this.$emit('change', selectedIds, this.selectedData)
      } else {
        if (!this.selectedData.length) {
          this.innerValue = ''
          this.$emit('input', '')
          this.$emit('change', '', {})
          return
        }
        this.innerValue = this.selectedData[0].fullName
        let selectedIds = this.selectedData.map(o => o.id)
        this.$emit('input', selectedIds[0])
        this.$emit('change', selectedIds[0], this.selectedData[0])
      }
      this.visible = false
    },
    setDefault() {
      if (!this.value || !this.value.length) {
        this.innerValue = ''
        this.selectedData = []
        this.tagsList = []
        return
      }
      const arr = this.multiple ? this.value : [this.value]
      getUserInfoList(arr).then(res => {
        this.selectedData = res.data.list
        if (this.multiple) {
          this.innerValue = ''
          this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        } else {
          this.innerValue = this.selectedData.length ? this.selectedData[0].fullName : ''
        }
        this.$nextTick(() => {
          if (this.multiple) {
            this.resetInputHeight();
          }
        });
      })
    },
    getData() {

      if (this.activeName === 'all') {
        this.getAllList()
      } else if (this.activeName === 'department') {

        this.loading = true
        getOrganization({ keyword: this.keyword, organizeId: '0' }).then(res => {
          this.treeData2 = res.data
          this.loading = false
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
          this.$nextTick(() => {
            let ids = this.selectedData.map((item) => {
              return item.id
            })

            this.$refs.selectTree3.setCheckedKeys(ids, false)
          })
        })
      }

    },
    getAllList() {
      this.loading = true
      //if (this.keyword) this.nodeId = '0';
      // 普通员工改为只获取当前组织下的数据 超级管理员获取全部数据 by xyb
      if (this.userInfo.administrator) {
        this.nodeId = '0';
      } else {
        this.nodeId = this.userInfo.organizeId
      }

      getImUserSelector(this.nodeId, this.keyword).then(res => {
        this.treeData = res.data.list
        this.loading = false
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
    checkChange(data, status) {
      if (data.type !== 'user') return
      if (status) {
        this.handleNodeClick2(data)
      } else {
        this.removeData2(data);
      }

    },
    handleNodeClick(data) {
      // if (data.type !== 'user') return
      // this.handleNodeClick2(data)

    },
    handleNodeClick2(data) {

      const boo = this.selectedData.some(o => o.id === data.id)
      if (boo) return
      const item = {
        id: data.id,
        fullName: data.fullName
      }
      // this.multiple ? this.selectedData.push(item) : this.selectedData = [item]
      this.multiple ? this.selectedData.push(data) : this.selectedData = [data]
      this.cbClickHandle(data);
    },
    removeAll() {
      this.selectedData = []
      this.$refs.selectTree1.setCheckedKeys([], false)
      this.$refs.selectTree2.setCheckedKeys([], false)
      this.$refs.selectTree3.setCheckedKeys([], false)
    },
    removeData(index) {
      this.selectedData.splice(index, 1);
      let ids = this.selectedData.map((item) => {
        return item.id
      })
      this.$refs.selectTree1.setCheckedKeys(ids, false)
      this.$refs.selectTree2.setCheckedKeys(ids, false)
      this.$refs.selectTree3.setCheckedKeys(ids, false)
      // this.$refs.tree.setChecked(5, true)
    },
    removeData2(data) {
      let checkedData = this.selectedData.filter((item) => {
        return item.id != data.id;
      })
      this.selectedData = checkedData;
    },
    deleteTag(event, index) {
      this.selectedData.splice(index, 1)
      this.confirm()
      event.stopPropagation();
    },
    handleClearClick(event) {
      this.selectedData = []
      this.confirm()
      event.stopPropagation();
    },
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },
    resetInputHeight() {
      if (this.collapseTags) return;
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        let inputChildNodes = this.$refs.reference.$el.childNodes;
        let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
        const tags = this.$refs.tags;
        const tagsHeight = tags ? Math.round(tags.getBoundingClientRect().height) : 0;
        const sizeInMap = this.initialInputHeight || 40;
        input.style.height = this.selectedData.length === 0
          ? sizeInMap + 'px'
          : Math.max(
            tags ? (tagsHeight + (tagsHeight > sizeInMap ? 6 : 0)) : 0,
            sizeInMap
          ) + 'px';
      });
    },
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    }
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-tree .el-checkbox.is-disabled {
  display: none;
}
</style>
