<template>
  <div class="comSelect-container">
    <WORKFLOW-TreeSelect :options="treeData" v-model="innerValue" :placeholder="placeholder"
      :clearable="clearable" :filterable="filterable" :disabled="disabled" v-on="$listeners"
      lastLevel lastLevelKey='type' :multiple="multiple" lastLevelValue='position'>
    </WORKFLOW-TreeSelect>
  </div>
</template>

<script>
export default {
  name: 'posSelect',
  props: ["value", "disabled", "placeholder", "multiple", "clearable", "filterable"],
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      treeData: [],
      innerValue: this.value
    }
  },
  methods: {
    async getData() {
      this.treeData = await this.$store.dispatch('base/getPositionTree')
    }
  },
  created() {
    this.getData()
  },
  watch: {
    innerValue(val) {
      // val && this.$emit('change', val)
    },
    value(val) {
      this.innerValue = val
    }
  }
}
</script>
<style lang="scss">
.comSelect-container {
  .el-select {
    width: 100%;
  }
}
</style>
