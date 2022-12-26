<template>
  <el-row>
    <el-form-item label="控件标题">
      <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
    </el-form-item>
    <el-form-item label="占位提示">
      <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
    </el-form-item>
    <el-form-item label="控件栅格">
      <el-slider v-model="activeData.__config__.span" :max="24" :min="6" show-stops :step="2"
        show-tooltip />
    </el-form-item>
    <el-form-item label="标题宽度">
      <el-input-number v-model="activeData.__config__.labelWidth" placeholder="标题宽度" :min="0"
        :precision="0" controls-position="right" />
    </el-form-item>
    <el-form-item label="关联功能">
      <JNPF-TreeSelect :options="treeData" v-model="activeData.modelId" placeholder="请选择关联功能"
        lastLevel clearable @change="onModeIdChange" />
    </el-form-item>
    <el-form-item label="显示字段">
      <el-select v-model="activeData.relationField" placeholder="请选择显示字段"
        @visible-change="visibleChange" clearable>
        <el-option v-for="item in fieldOptions" :key="item.vmodel" :label="item.label"
          :value="item.vmodel" />
      </el-select>
    </el-form-item>
    <el-divider>列表字段</el-divider>
    <draggable :list="activeData.columnOptions" :animation="340" group="selectItem"
      handle=".option-drag">
      <div v-for="(item, index) in activeData.columnOptions" :key="index" class="select-item">
        <div class="select-line-icon option-drag">
          <i class="icon-ym icon-ym-darg" />
        </div>
        <el-select v-model="item.value" placeholder="请选择显示字段" @visible-change="visibleChange"
          clearable @change="onChange($event,item)">
          <el-option v-for="item in fieldOptions" :key="item.vmodel" :label="item.label"
            :value="item.vmodel" />
        </el-select>
        <div class="close-btn select-line-icon" @click="activeData.columnOptions.splice(index, 1)">
          <i class="el-icon-remove-outline" />
        </div>
      </div>
    </draggable>
    <div style="margin-left: 29px;">
      <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
        @click="addSelectItem">
        添加字段
      </el-button>
    </div>
    <el-divider>分页设置</el-divider>
    <el-form-item label="列表分页">
      <el-switch v-model="activeData.hasPage"></el-switch>
    </el-form-item>
    <el-form-item label="分页条数" label-width="80px">
      <el-radio-group v-model="activeData.pageSize">
        <el-radio-button :label="20">20条</el-radio-button>
        <el-radio-button :label="50">50条</el-radio-button>
        <el-radio-button :label="100">100条</el-radio-button>
        <el-radio-button :label="500">500条</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-divider />
    <el-form-item label="能否清空">
      <el-switch v-model="activeData.clearable" />
    </el-form-item>
    <el-form-item label="是否禁用">
      <el-switch v-model="activeData.disabled" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="activeData.__config__.required" />
    </el-form-item>
  </el-row>
</template>
<script>
import { getFeatureSelector, getFormDataFields } from '@/api/onlineDev/visualDev'
import draggable from 'vuedraggable'
import comMixin from './mixin'
export default {
  props: ['activeData'],
  mixins: [comMixin],
  components: { draggable },
  data() {
    return {
      treeData: [],
      fieldOptions: []
    }
  },
  created() {
    this.getFeatureSelector()
    this.getFieldOptions()
  },
  methods: {
    getFeatureSelector() {
      getFeatureSelector({ type: 1 }).then(res => {
        this.treeData = res.data.list
      })
    },
    getFieldOptions() {
      if (!this.activeData.modelId) return
      getFormDataFields(this.activeData.modelId).then(res => {
        this.fieldOptions = res.data.list
      })
    },
    visibleChange(val) {
      if (!val) return
      if (!this.activeData.modelId) this.$message.warning('请先选择关联功能')
    },
    onModeIdChange(val) {
      this.activeData.relationField = ''
      this.$emit('relationChange', this.activeData.__vModel__)
      if (!val) {
        this.fieldOptions = []
        return
      }
      this.getFieldOptions()
    },
    onChange(val, item) {
      const list = this.fieldOptions.filter(o => o.vmodel === val) || []
      if (!list.length) return
      const active = list[0]
      item.label = active.label
    },
    addSelectItem() {
      this.activeData.columnOptions.push({
        value: '',
        label: ''
      })
    }
  }
}
</script>