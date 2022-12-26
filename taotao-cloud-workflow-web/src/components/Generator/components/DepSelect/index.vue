<template>
  <div class="comSelect-container">
    <JNPF-TreeSelect :options="treeData" v-model="innerValue" v-on="$listeners" v-bind="$attrs"
      :lastLevel="lastLevel" lastLevelKey='type' lastLevelValue='department'>
    </JNPF-TreeSelect>
  </div>
</template>

<script>
export default {
  name: 'depSelect',
  props: {
    value: {
      default: ''
    },
    lastLevel: {
      type: Boolean,
      default: true
    }
  },
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
      this.treeData = await this.$store.dispatch('generator/getDepTree')
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