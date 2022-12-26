<template>
  <el-dialog
    title="预警备注"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :append-to-body="true"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
    width="600px"
  >
    <el-form ref="dataForm" :model="dataForm" v-loading="formLoading">
      <el-form-item>
        <el-radio-group v-model="dataForm.remark.id">
          <el-radio
            v-for="(item, index) in radioData"
            :key="item.enCode"
            :label="item.id"
            @change="handleChange(item)"
            >{{ item.fullName }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="dataForm.remark.enCode == '099'">
        <el-input type="textarea" :rows="3" v-model="dataForm.remark.content" />
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
import {
  DictionaryData,
  changeRemark,
  DictionaryType,
} from "@/api/info/processDestinationNotMatch";
export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: "",
        remark: {
          id: "",
          content: "",
          enCode: "00",
        },
      },
      contentBk: "",
      FlowEnCode: "noMatchDestination",
      radioData: [],
      typeId: "",
    };
  },
  methods: {
    init(data) {
      DictionaryType().then((result) => {
        let dictionaryData = result.data.list;
        let typeId = dictionaryData.find((item) => {
          return item.enCode == this.FlowEnCode;
        }).id;
        DictionaryData(typeId).then((result) => {
          this.radioData = result.data.list;
        });
      });
      this.visible = true;
      this.dataForm.id = data.id || "";
      if (data.remark != null) {
        this.dataForm.remark = JSON.parse(data.remark);
      } else {
        this.dataForm.remark = {
          id: "",
          content: "",
          enCode: "00",
        };
      }
      if (this.dataForm.remark.enCode != "099") {
        this.dataForm.remark.content = "";
      }
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
    },
    dataFormSubmit() {
      if (this.dataForm.remark.enCode != "099") {
        this.dataForm.remark.content = this.contentBk;
      }
      let params = this.dataForm;
      params.remark = JSON.stringify(params.remark);
      this.btnLoading = true;
      changeRemark(params)
        .then((result) => {
          if (result.code == 200) {
            this.visible = false;
            this.btnLoading = false;
            this.$message({
              message: result.msg == "Success" ? "操作成功" : result.msg,
              type: "success",
              duration: 1500,
              onClose: () => {},
            });
            this.$emit("refreshDataList");
            this.getPageData();
          }
        })
        .catch((result) => {
          this.btnLoading = false;
        });
    },
    handleChange(data) {
      this.dataForm.remark.enCode = data.enCode;
      this.contentBk = data.fullName;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-radio {
  display: block;
  line-height: 32px;
}
</style>
