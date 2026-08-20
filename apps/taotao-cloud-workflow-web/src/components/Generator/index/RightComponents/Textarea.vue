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
    <el-form-item label="默认值">
      <el-input :value="setDefaultValue(activeData.__config__.defaultValue)" placeholder="请输入默认值"
        @input="onDefaultValueInput" />
    </el-form-item>
    <el-form-item v-if="activeData.autosize" label="最小行数">
      <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="最小行数"
        controls-position="right" />
    </el-form-item>
    <el-form-item v-if="activeData.autosize" label="最大行数">
      <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="最大行数"
        controls-position="right" />
    </el-form-item>
    <el-form-item label="最多输入">
      <el-input v-model="activeData.maxlength" placeholder="请输入字符长度" type="number">
        <template slot="append">个字符</template>
      </el-input>
    </el-form-item>
    <!-- <el-form-item label="显示标签">
      <el-switch v-model="activeData.__config__.showLabel" />
    </el-form-item> -->
    <!-- <el-form-item label="输入统计">
      <el-switch v-model="activeData['show-word-limit']" />
    </el-form-item> -->
    <!-- <el-form-item label="能否清空">
      <el-switch v-model="activeData.clearable" />
    </el-form-item> -->
    <el-form-item label="是否只读">
      <el-switch v-model="activeData.readonly" />
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
import comMixin from './mixin';
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