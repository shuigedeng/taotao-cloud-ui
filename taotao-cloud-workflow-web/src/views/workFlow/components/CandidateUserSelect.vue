<template>
  <div class="popupSelect-container">
    <div class="el-select" @click.stop="openDialog">
      <div class="el-select__tags" v-if="multiple" ref="tags"
        :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%',cursor:'pointer' }">
        <span v-if="collapseTags && tagsList.length">
          <el-tag :closable="!selectDisabled" :size="collapseTagSize" type="info"
            @close="deleteTag($event, 0)" disable-transitions>
            <span class="el-select__tags-text">{{ tagsList[0].userName }}</span>
          </el-tag>
          <el-tag v-if="tagsList.length > 1" :closable="false" type="info" disable-transitions>
            <span class="el-select__tags-text">+ {{ tagsList.length - 1 }}</span>
          </el-tag>
        </span>
        <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
          <el-tag v-for="(item,i) in tagsList" :key="item.userId" :size="collapseTagSize"
            :closable="!selectDisabled" type="info" @close="deleteTag($event, i)"
            disable-transitions>
            <span class="el-select__tags-text">{{ item.userName }}</span>
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
    <el-dialog title="候选人员" :close-on-click-modal="false" :visible.sync="visible"
      class="JNPF-dialog JNPF-dialog_center transfer-dialog" lock-scroll append-to-body
      width="800px" :modal-append-to-body="false" @close="onClose">
      <div class="transfer__body">
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <el-input placeholder="请输入关键词查询" v-model="listQuery.keyword"
              @keyup.enter.native="search" clearable class="search-input">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
          <div class="transfer-pane__body left-pane">
            <div class="single-list" ref="candidate">
              <template v-if="list.length">
                <div v-for="(item, index) in list" :key="index" class="selected-item"
                  @click="handleNodeClick(item)">
                  <span>{{ item.userName}}</span>
                </div>
              </template>
              <el-empty description="暂无数据" :image-size="120" v-else></el-empty>
            </div>
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
                <span>{{ item.userName}}</span>
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
import { CandidateUser } from '@/api/workFlow/FlowBefore'
import { getUserInfoList } from '@/api/permission/user'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
export default {
  name: 'CandidateUser',
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
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    taskId: {
      type: String,
      default: ''
    },
    nodeId: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    size: String,
  },
  data() {
    return {
      visible: false,
      innerValue: '',
      loading: false,
      listQuery: {
        keyword: '',
        currentPage: 1,
        pageSize: 20,
      },
      total: 0,
      list: [],
      listLoading: true,
      selectedData: [],
      tagsList: [],
      inputHovering: false,
      inputWidth: 0,
      initialInputHeight: 0,
      finish: false,
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
    onClose() { },
    clear() {
      if (this.disabled) return
      this.innerValue = ''
      this.selectedData = []
      this.$emit('input', '')
      this.$emit('change', '', '')
    },
    openDialog() {
      if (this.disabled) return
      this.visible = true
      this.finish = false
      this.listQuery.keyword = ''
      this.$nextTick(() => {
        this.bindScroll()
        this.search()
        this.setDefault()
      })
    },
    confirm() {
      if (this.multiple) {
        this.innerValue = ''
        this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        let selectedIds = this.selectedData.map(o => o.userId)
        this.$emit('input', selectedIds)
        this.$emit('change', selectedIds, this.selectedData)
      } else {
        if (!this.selectedData.length) {
          this.innerValue = ''
          this.$emit('input', '')
          this.$emit('change', '', {})
          return
        }
        this.innerValue = this.selectedData[0].userName
        let selectedIds = this.selectedData.map(o => o.userId)
        this.$emit('input', selectedIds[0])
        this.$emit('change', selectedIds[0], this.selectedData[0])
      }
      this.visible = false
    },
    bindScroll() {
      let _this = this,
        vBody = _this.$refs.candidate;
      vBody.addEventListener("scroll", function () {
        if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 200 && !_this.listLoading && !_this.finish) {
          _this.listQuery.currentPage += 1
          _this.initData()
        }
      });
    },
    search() {
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.list = []
      this.finish = false
      this.initData()
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        formData: this.formData,
        nodeCode: this.nodeId
      }
      CandidateUser(this.taskId || 0, query).then((res) => {
        if (res.data.list.length < this.listQuery.pageSize) {
          this.finish = true
        }
        this.list = [...this.list, ...res.data.list]
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    handleNodeClick(item) {
      const boo = this.selectedData.some(o => o.userId === item.userId)
      if (boo) return
      this.multiple ? this.selectedData.push(item) : this.selectedData = [item]
    },
    removeAll() {
      this.selectedData = []
    },
    removeData(index) {
      this.selectedData.splice(index, 1)
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
        this.selectedData = res.data.list.map(o => ({
          userId: o.id,
          userName: o.fullName
        }))
        if (this.multiple) {
          this.innerValue = ''
          this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        } else {
          this.innerValue = this.selectedData.length ? this.selectedData[0].userName : ''
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