<template>
  <el-dialog title="新建" :close-on-click-modal="false" lock-scroll v-bind="$attrs" v-on="$listeners"
    class="WORKFLOW-dialog WORKFLOW-dialog_center" width="800px">
    <div class="add-main">
      <div class="add-item add-item-form" @click="add(1)">
        <i class="add-icon el-icon-document"></i>
        <div class="add-txt">
          <p class="add-title">表单</p>
          <p class="add-desc">纯表单设计</p>
        </div>
      </div>
      <div class="add-item add-item-list" @click="add(2)">
        <i class="add-icon icon-ym icon-ym-sysMenu"></i>
        <div class="add-txt">
          <p class="add-title">列表</p>
          <p class="add-desc">表单+列表设计</p>
        </div>
      </div>
      <div class="add-item" @click="add(3)">
        <i class="add-icon icon-ym icon-ym-generator-company"></i>
        <div class="add-txt">
          <p class="add-title">流程</p>
          <p class="add-desc">表单+列表+流程设计</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  methods: {
    add(type) {
      this.$emit('add', type)
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.WORKFLOW-dialog {
  ::v-deep .el-dialog__body {
    padding: 50px 30px !important;
  }
}
.add-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .add-item {
    width: 230px;
    height: 136px;
    background: #eff9ff;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 20px;
    &.add-item-form {
      background: #f1f5ff;
      .add-icon {
        background: #ccd9ff;
        color: #537eff;
      }
    }
    &.add-item-list {
      background: #fef3e6;
      .add-icon {
        background: #fce1bf;
        color: #ea986c;
      }
    }
    .add-icon {
      width: 56px;
      height: 56px;
      margin-right: 10px;
      background: #ceeaff;
      border-radius: 10px;
      color: #46adfe;
      flex-shrink: 0;
      font-size: 30px;
      line-height: 56px;
      text-align: center;
    }
    .add-txt {
      height: 56px;
      P {
        line-height: 28px;
      }
      .add-title {
        font-size: 18px;
        font-weight: bold;
      }
      .add-desc {
        color: #8d8989;
        font-size: 12px;
      }
    }
  }
}
</style>
