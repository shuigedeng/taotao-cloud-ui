<template>
  <div class="popupSelect-container">
    <div class="el-select" @click.stop="openDialog">
      <div class="el-select__tags" v-if="multiple" ref="tags"
        :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%',cursor:'pointer' }">
        <span v-if="collapseTags && tagsList.length">
          <el-tag :closable="!selectDisabled" :size="collapseTagSize" type="info"
            @close="deleteTag($event, 0)" disable-transitions>
            <span class="el-select__tags-text">{{ tagsList[0] }}</span>
          </el-tag>
          <el-tag v-if="tagsList.length > 1" :closable="false" type="info" disable-transitions>
            <span class="el-select__tags-text">+ {{ tagsList.length - 1 }}</span>
          </el-tag>
        </span>
        <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
          <el-tag v-for="(item,i) in tagsList" :key="item" :size="collapseTagSize"
            :closable="!selectDisabled" type="info" @close="deleteTag($event, i)"
            disable-transitions>
            <span class="el-select__tags-text">{{ item }}</span>
          </el-tag>
        </transition-group>
      </div>
      <el-input ref="reference" v-model="innerValue" type="text" :placeholder="currentPlaceholder"
        :disabled="selectDisabled" readonly :validate-event="false"
        :tabindex="(multiple) ? '-1' : null" @mouseenter.native="inputHovering = true"
        @mouseleave.native="inputHovering = false">
        <template slot="suffix">
          <i v-show="!showClose"
            :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up']"></i>
          <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close"
            @click="handleClearClick"></i>
        </template>
      </el-input>
    </div>
    <el-dialog title="省市区" :close-on-click-modal="false" :visible.sync="visible"
      class="JNPF-dialog JNPF-dialog_center transfer-dialog" lock-scroll append-to-body
      width="800px" :modal-append-to-body="false" @close="onClose">
      <div class="transfer__body">
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <span>全部数据</span>
          </div>
          <div class="transfer-pane__body">
            <el-tree :data="treeData" :props="props" check-on-click-node
              @node-click="handleNodeClick" class="JNPF-common-el-tree" node-key="id"
              v-loading="loading" lazy :load="loadNode">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i :class="data.icon"></i>
                <span class="text">{{node.label}}</span>
              </span>
            </el-tree>
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
                <span>{{item}}</span>
                <i class="el-icon-delete" @click="removeData(index)"></i>
              </div>
            </template>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible=false">{{$t('common.cancelButton')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('common.confirmButton')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProvinceSelector, GetAreaByIds } from '@/api/system/province'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
export default {
  name: 'JNPF-Address',
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
      default: () => []
    },
    level: {
      type: Number,
      default: 2
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
      default: false
    },
    size: String,
  },
  data() {
    return {
      treeData: [],
      visible: false,
      loading: false,
      nodeId: '',
      innerValue: '',
      props: {
        children: 'children',
        label: 'fullName',
        isLeaf: 'isLeaf'
      },
      selectedData: [],
      selectedIds: [],
      tagsList: [],
      inputHovering: false,
      inputWidth: 0,
      initialInputHeight: 0,
    }
  },
  computed: {
    showClose() {
      let hasValue = Array.isArray(this.value) && this.value.length > 0
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
  },
  created() {
    this.nodeId = '-1'
    this.initData()
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
  watch: {
    value(val) {
      this.setDefault()
    },
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
  },
  methods: {
    onClose() { },
    clear() {
      if (this.selectDisabled) return
      this.innerValue = ''
      this.selectedData = []
      this.selectedIds = []
      this.tagsList = []
      this.$emit('input', [])
      this.$emit('change', [], [])
    },
    openDialog() {
      if (this.selectDisabled) return
      this.visible = true
      this.nodeId = '-1'
      this.setDefault()
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.nodeId = '-1'
        return resolve(this.treeData)
      }
      this.nodeId = node.data.id
      getProvinceSelector(this.nodeId).then(res => {
        const list = res.data.list.map(value => ({
          ...value,
          isLeaf: node.level >= this.level ? true : value.isLeaf
        }));
        resolve(list);
      })
    },
    initData() {
      this.loading = true
      getProvinceSelector(this.nodeId).then(res => {
        this.treeData = res.data.list.map(value => ({
          ...value,
          isLeaf: 0 >= this.level ? true : value.isLeaf
        }));
        this.loading = false
      })
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    handleNodeClick(data, node) {
      if (!node.isLeaf) return
      const nodePath = this.getNodePath(node)
      let currId = nodePath.map(o => o.id)
      let currData = nodePath.map(o => o.fullName).join(' / ')
      if (this.multiple) {
        const boo = this.selectedIds.some(o => o.join(' / ') === currId.join(' / '))
        if (boo) return
        this.selectedIds.push(currId)
        this.selectedData.push(currData)
      } else {
        this.selectedIds = [currId]
        this.selectedData = [currData]
      }
    },
    removeAll() {
      this.selectedData = []
      this.selectedIds = []
    },
    removeData(index) {
      this.selectedData.splice(index, 1)
      this.selectedIds.splice(index, 1)
    },
    confirm() {
      let selectedData = []
      for (let i = 0; i < this.selectedIds.length; i++) {
        let item = []
        let selectedNames = this.selectedData[i].split(' / ')
        for (let j = 0; j < this.selectedIds[i].length; j++) {
          item.push({
            id: this.selectedIds[i][j],
            fullName: selectedNames[j],
          })
        }
        selectedData.push(item)
      }
      if (this.multiple) {
        this.innerValue = ''
        this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        this.$emit('input', this.selectedIds)
        this.$emit('change', this.selectedIds, selectedData)
      } else {
        this.innerValue = this.selectedData.join(',')
        this.$emit('input', this.selectedIds[0])
        this.$emit('change', this.selectedIds[0], selectedData[0])
      }
      this.visible = false
    },
    setDefault() {
      if (!this.value || !this.value.length) {
        this.innerValue = ''
        this.selectedIds = []
        this.selectedData = []
        this.tagsList = []
        return
      }
      let selectedIds = this.multiple ? this.value : [this.value]
      GetAreaByIds(selectedIds).then(res => {
        this.selectedIds = JSON.parse(JSON.stringify(selectedIds))
        this.selectedData = res.data.map(o => o.join(' / '))
        if (this.multiple) {
          this.innerValue = ''
          this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        } else {
          this.innerValue = this.selectedData.join(',')
        }
        this.$nextTick(() => {
          if (this.multiple) {
            this.resetInputHeight();
          }
        });
      })
    },
    deleteTag(event, index) {
      this.selectedData.splice(index, 1)
      this.selectedIds.splice(index, 1)
      this.confirm()
      event.stopPropagation();
    },
    handleClearClick(event) {
      this.selectedData = []
      this.selectedIds = []
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
  }
}
</script>