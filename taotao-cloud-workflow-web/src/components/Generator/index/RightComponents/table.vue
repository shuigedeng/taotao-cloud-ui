<template>
  <el-row>
    <el-form-item label="显示标题">
      <el-switch v-model="activeData.__config__.showTitle" />
    </el-form-item>
    <el-form-item v-if="activeData.actionText !== undefined" label="动作文字">
      <el-input v-model="activeData.actionText" placeholder="请输入动作文字" />
    </el-form-item>
    <el-form-item label="是否合计">
      <el-switch v-model="activeData['show-summary']" />
    </el-form-item>
    <el-form-item label="合计字段" v-if="activeData['show-summary']">
      <el-select v-model="activeData.summaryField" multiple placeholder="请选择合计字段">
        <template v-for="(item,i) in activeData.__config__.children">
          <el-option :key="i" :label="item.__config__.label" :value="item.__vModel__"
            v-if="['comInput','numInput','calculate'].includes(item.__config__.jnpfKey)" />
        </template>
      </el-select>
    </el-form-item>
  </el-row>
</template>
<script>
export default {
  props: ['activeData'],
  data() {
    return {}
  },
  created() { },
  methods: {}
}
</script>