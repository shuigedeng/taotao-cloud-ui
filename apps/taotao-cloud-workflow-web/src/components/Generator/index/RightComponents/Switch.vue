<template>
  <el-row>
    <el-form-item label="控件标题">
      <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
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
    <el-form-item label="开启展示值">
      <el-input v-model="activeData.activeTxt" placeholder="请输入开启展示值" />
    </el-form-item>
    <el-form-item label="关闭展示值">
      <el-input v-model="activeData.inactiveTxt" placeholder="请输入关闭展示值" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-switch v-model="activeData.__config__.defaultValue"
        :active-value="activeData['active-value']" :inactive-value="activeData['inactive-value']" />
    </el-form-item>
    <!-- <el-form-item label="显示标签">
      <el-switch v-model="activeData.__config__.showLabel" />
    </el-form-item> -->
    <!-- <el-form-item label="开启颜色">
      <el-color-picker v-model="activeData['active-color']" />
    </el-form-item>
    <el-form-item label="关闭颜色">
      <el-color-picker v-model="activeData['inactive-color']" />
    </el-form-item> -->
    <el-form-item label="是否禁用">
      <el-switch v-model="activeData.disabled" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="activeData.__config__.required" />
    </el-form-item>
  </el-row>
</template>
<script>
import comMixin from './mixin'
export default {
  props: ['activeData'],
  mixins: [comMixin],
  data() {
    return {}
  },
  created() { },
  methods: {}
}
</script>