<template>
  <el-row>
    <el-form-item label="控件标题">
      <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
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
      <el-select v-model="activeData.relationField" placeholder="请选择关联功能" clearable
        @change="onRelationFieldChange">
        <el-option v-for="(item,i) in options" :key="i" :label="item.__config__.label"
          :value="item.prop" />
      </el-select>
    </el-form-item>
    <el-form-item label="关联字段">
      <el-select v-model="activeData.showField" placeholder="请选择关联字段"
        @visible-change="visibleChange" clearable>
        <el-option v-for="item in fieldOptions" :key="item.vmodel" :label="item.label"
          :value="item.vmodel" />
      </el-select>
    </el-form-item>
  </el-row>
</template>
<script>
import { getFormDataFields } from '@/api/onlineDev/visualDev'
import comMixin from './mixin'
import { getDrawingList } from '@/components/Generator/utils/db'
export default {
  props: ['activeData'],
  mixins: [comMixin],
  data() {
    return {
      options: [],
      fieldOptions: [],
    }
  },
  methods: {
    getOptions() {
      const drawingList = getDrawingList() || []
      let list = []
      const loop = (data, parent) => {
        if (!data) return
        if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
          loop(data.__config__.children, data)
        }
        if (Array.isArray(data)) data.forEach(d => loop(d, parent))
        if (data.__config__ && data.__config__.jnpfKey) {
          if (data.__config__.jnpfKey === 'relationForm' && data.__vModel__) {
            list.push(data)
          }
        }
      }
      loop(drawingList)
      this.options = list.map(o => ({
        ...o,
        prop: o.__config__ && o.__config__.tableName ? o.__vModel__ + '_jnpfTable_' + o.__config__.tableName + (o.__config__.isSubTable ? '0' : "1") : o.__vModel__
      }))
      this.getFieldOptions()
    },
    getFieldOptions() {
      if (!this.activeData.relationField || !this.options.length) return
      let list = this.options.filter(o => o.prop === this.activeData.relationField)
      if (!list.length) return
      let item = list[0]
      if (!item.modelId) return
      getFormDataFields(item.modelId).then(res => {
        this.fieldOptions = res.data.list
      })
    },
    onRelationFieldChange(val) {
      this.activeData.showField = ''
      if (!val) return this.fieldOptions = []
      this.getFieldOptions()
    },
    visibleChange(val) {
      if (!val) return
      if (!this.activeData.relationField) this.$message.warning('请先选择关联功能')
    }
  }
}
</script>