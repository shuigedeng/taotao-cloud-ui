<template>
  <div class="numRange">
    <el-input-number v-model="min" :controls="false" placeholder="最小值" @change="onChange" />
    <span class="separator">-</span>
    <el-input-number v-model="max" :controls="false" placeholder="最大值" @change="onChange" />
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ["value"],
  name: 'numRange',
  data() {
    return {
      min: undefined,
      max: undefined
    }
  },
  watch: {
    value(val) {
      if (Array.isArray(val) && val.length === 2) {
        this.min = val[0]
        this.max = val[1]
      } else {
        this.min = undefined
        this.max = undefined
      }
    }
  },
  methods: {
    onChange() {
      if ((!this.min && this.min !== 0) && (!this.max && this.max !== 0)) return this.$emit('change', [])
      this.$emit('change', [this.min, this.max])
    }
  }
}
</script>
<style lang="scss" scoped>
.numRange {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 220px;
  .el-input-number {
    flex: 1;
    width: auto;
    ::v-deep .el-input__inner {
      text-align: left;
    }
  }
  .separator {
    margin: 0 5px;
    flex-shrink: 0;
  }
}
</style>