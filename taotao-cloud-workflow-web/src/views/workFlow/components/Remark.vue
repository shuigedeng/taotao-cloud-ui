<template>
  <el-dialog
    title="备注"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    lock-scroll
    class="WORKFLOW-dialog WORKFLOW-dialog_center"
    width="600px"
  >
    <p class="ti">{{ remark.title }}</p>
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      :rules="dataRule"
      label-width="90px"
    >
      <el-form-item class="remark" label="" prop="remark">
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          maxlength="100"
          show-word-limit
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{
        $t("common.cancelButton")
      }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t("common.confirmButton") }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { saveRemark } from "@/api/workFlow/FlowBefore";

const remarkOrigin = {
  title: "当前暂无备注",
  remarkOperateDatetime: null,
  remarkOperateText: null,
  remarkOperateUserId: null,
  remarkOperateUsername: null
};
export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: "",
        remark: ""
      },
      pid: "",
      treeData: [],
      dataRule: {
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }]
      },
      remark: Object.assign({}, remarkOrigin)
    };
  },
  methods: {
    resetRemarkProperty() {
      this.remark = Object.assign({}, remarkOrigin);
    },
    async init(item) {
      this.visible = true;
      this.pid = item.processId || "";
      await this.$nextTick();
      this.$refs["dataForm"].resetFields();
      this.resetRemarkProperty();
      Object.assign(this.remark, item);
      if (this.remark.remarkOperateText) {
        this.dataForm.remark = this.remark.remarkOperateText;
        let { remarkOperateDatetime, remarkOperateUsername } = item;
        let timestr = this.workflow.dateFormat(remarkOperateDatetime);
        this.remark.title = `${remarkOperateUsername} ${timestr}`;
      }
    },
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          const formMethod = this.dataForm.id ? saveRemark : saveRemark;
          delete this.dataForm.id;
          formMethod(this.pid, this.dataForm)
            .then(res => {
              this.$message({
                message: res.msg,
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.btnLoading = false;
                  this.$emit("refresh");
                }
              });
            })
            .catch(() => {
              this.btnLoading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ti {
  margin-bottom: 20px;
}
.remark {
  margin-left: -90px;
  .el-textarea {
    height: 200px;
    ::v-deep .el-textarea__inner {
      height: 100%;
    }
  }
}
</style>
