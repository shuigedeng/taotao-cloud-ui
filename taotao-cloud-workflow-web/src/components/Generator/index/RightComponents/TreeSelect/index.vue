<template>
  <el-row>
    <el-form-item label="控件标题">
      <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
    </el-form-item>
    <el-form-item label="占位提示">
      <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
    </el-form-item>
    <template v-if="!activeData.__config__.isSubTable">
      <el-form-item label="控件栅格">
        <el-slider v-model="activeData.__config__.span" :max="24" :min="6" show-stops :step="2"
          show-tooltip />
      </el-form-item>
      <el-form-item label="标题宽度">
        <el-input-number v-model="activeData.__config__.labelWidth" placeholder="标题宽度" :min="0"
          :precision="0" controls-position="right" />
      </el-form-item>
    </template>
    <el-form-item label="控件宽度" v-if="activeData.__config__.isSubTable">
      <el-input-number v-model="activeData.__config__.columnWidth" placeholder="控件宽度" :min="0"
        :precision="0" controls-position="right" />
    </el-form-item>
    <el-form-item label="默认值">
      <JNPF-TreeSelect :options="activeData.options" v-model="activeData.__config__.defaultValue"
        placeholder="选择默认值" clearable :multiple="activeData.multiple"
        :props="activeData.props.props" :key="renderKey" />
    </el-form-item>
    <template>
      <el-divider>数据选项</el-divider>
      <el-form-item label="" label-width="40px">
        <el-radio-group v-model="activeData.__config__.dataType" size="small"
          style="text-align:center" @change="dataTypeChange">
          <el-radio-button label="static">静态数据</el-radio-button>
          <el-radio-button label="dictionary">数据字典</el-radio-button>
          <el-radio-button label="dynamic">远端数据</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <template v-if="activeData.__config__.dataType === 'static'">
        <!-- 级联选择静态树 -->
        <el-tree draggable :data="activeData.options" node-key="id" :expand-on-click-node="false"
          :render-content="renderContent" :props="props" />
        <div style="margin-left: 20px">
          <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
            @click="addTreeItem">添加父级</el-button>
        </div>
      </template>
      <template v-if="activeData.__config__.dataType === 'dictionary'">
        <el-form-item label="远端数据">
          <JNPF-TreeSelect :options="treeData" v-model="activeData.__config__.dictionaryType"
            placeholder="请选择数据字典" lastLevel clearable>
          </JNPF-TreeSelect>
        </el-form-item>
        <el-form-item label="存储字段">
          <el-select v-model="activeData.props.props.value" placeholder="请选择存储字段">
            <el-option label="id" value="id"></el-option>
            <el-option label="enCode" value="enCode"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="activeData.__config__.dataType === 'dynamic'">
        <el-form-item label="远端数据">
          <JNPF-TreeSelect :options="dataInterfaceSelector" v-model="activeData.__config__.propsUrl"
            placeholder="请选择远端数据" lastLevel lastLevelKey='categoryId' lastLevelValue='1'
            @change="propsUrlChange" clearable />
        </el-form-item>
        <el-form-item label="存储字段">
          <el-input v-model="activeData.props.props.value" placeholder="请输入存储字段"
            @change="onChange" />
        </el-form-item>
        <el-form-item label="显示字段">
          <el-input v-model="activeData.props.props.label" placeholder="请输入显示字段"
            @change="onChange" />
        </el-form-item>
        <el-form-item label="子级字段">
          <el-input v-model="activeData.props.props.children" placeholder="请输入子级字段"
            @change="onChange" />
        </el-form-item>
      </template>
      <el-divider />
    </template>
    <el-form-item label="能否清空">
      <el-switch v-model="activeData.clearable" />
    </el-form-item>
    <el-form-item label="能否搜索">
      <el-switch v-model="activeData.filterable" />
    </el-form-item>
    <el-form-item label="能否多选">
      <el-switch v-model="activeData.multiple" @change="onChange" />
    </el-form-item>
    <el-form-item label="是否禁用">
      <el-switch v-model="activeData.disabled" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="activeData.__config__.required" />
    </el-form-item>
    <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
  </el-row>
</template>
<script>

import comMixin from '../mixin';
import TreeNodeDialog from './TreeNodeDialog'
import { getDictionaryTypeSelector, getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceSelector, getDataInterfaceRes } from '@/api/systemData/dataInterface'
export default {
  props: ['activeData'],
  mixins: [comMixin],
  components: { TreeNodeDialog },
  data() {
    return {
      treeData: [],
      dataInterfaceSelector: [],
      dialogVisible: false,
      currentNode: {},
      props: {
        value: 'id',
        label: 'fullName',
        children: 'children',
      },
      renderKey: +new Date()
    }
  },
  watch: {
    'activeData.__config__.dictionaryType': function (val) {
      this.activeData.__config__.defaultValue = ''
      if (!val) {
        this.activeData.options = []
        return
      }
      getDictionaryDataSelector(val).then(res => {
        this.activeData.options = res.data.list
      })
    }
  },
  created() {
    this.getDictionaryType()
    this.getDataInterfaceSelector()
  },
  methods: {
    getDictionaryType() {
      getDictionaryTypeSelector().then(res => {
        this.treeData = res.data.list
      })
    },
    getDataInterfaceSelector() {
      getDataInterfaceSelector().then(res => {
        this.dataInterfaceSelector = res.data
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)}
              class="el-icon-plus"
              title="添加"
            ></i>
            <i on-click={() => this.remove(node, data)}
              class="el-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      )
    },
    addTreeItem() {
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = [] // 避免删除时报错
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    onChange() {
      this.renderKey = +new Date()
      this.activeData.__config__.renderKey = +new Date()
      this.activeData.__config__.defaultValue = this.activeData.multiple ? [] : ''
    },
    dataTypeChange(val) {
      this.activeData.__config__.defaultValue = ''
      this.activeData.options = []
      this.activeData.props.props.value = 'id'
      this.activeData.props.props.label = 'fullName'
      this.activeData.props.props.children = 'children'
      if (val === 'static') {
        this.activeData.__config__.dictionaryType = ''
        this.activeData.__config__.propsUrl = ''
      }
      if (val === 'dynamic') {
        this.activeData.__config__.dictionaryType = ''
      }
      if (val === 'dictionary') {
        this.activeData.__config__.propsUrl = ''
      }
    },
    propsUrlChange(val) {
      this.activeData.__config__.defaultValue = ''
      if (!val) {
        this.activeData.options = []
        return
      }
      getDataInterfaceRes(val).then(res => {
        let data = this.jnpf.interfaceDataHandler(res.data)
        if (Array.isArray(data)) {
          this.activeData.options = data
        } else {
          this.activeData.options = []
        }
      }).catch(() => {
        this.activeData.__config__.propsUrl = ''
        this.activeData.options = []
      })
    }
  }
}
</script>
<style lang="scss" scpoed>
.custom-tree-node {
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  .node-operation {
    float: right;
  }
  i[class*='el-icon'] + i[class*='el-icon'] {
    margin-left: 6px;
  }
  .el-icon-plus {
    color: #409eff;
  }
  .el-icon-delete {
    color: #157a0c;
  }
}
</style>