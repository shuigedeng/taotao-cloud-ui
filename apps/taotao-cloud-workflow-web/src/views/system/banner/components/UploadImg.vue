<template>
  <div class="singleImg-container">
    <el-upload class="img-uploader" :action="define.comUploadUrl + '/' + type" :show-file-list="false"
      :before-upload="beforeAvatarUpload" :on-success="handleSuccess" :headers="uploadHeaders" :accept="accept">
      <div class="icon-box">
        <i class="el-icon-plus img-uploader-icon"></i>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "SingleImg",
  props: {
    value: {
      type: String,
      default: "",
    },
    tip: {
      type: String,
      default: "上传图片",
    },
    type: {
      type: String,
      default: "annexpic",
    },
    accept: {
      type: String,
      default: 'image/png,image/jpeg,image/jpg'
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imageUrl: "",
      uploadHeaders: { Authorization: this.$store.getters.token },
    };
  },
  computed: {
    fileList() {
      return this.imageUrl ? [this.define.comUrl + this.imageUrl] : [];
    },
  },
  watch: {
    value(val) {
      this.imageUrl = val;
    },
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt3M = file.size / 1024 / 1024 <= 3;
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
      } else {
        this.$emit("update:uploadStatus", "true");
      }
      return isLt3M;
    },
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.imageUrl = res.data.url;
        this.$emit("input", res.data.url);
        this.$emit("update:uploadStatus", "false");
      } else {
        this.$message({ message: res.msg, type: "error", duration: 1500 });
        this.$emit("update:uploadStatus", "false");
      }
    },
    handlePictureCardPreview() {
      this.$refs.image && this.$refs.image.clickHandler();
    },
    handleRemove() {
      this.$emit("input", "");
    },
    uploadClick() {
      document.querySelector(".img-uploader .el-upload").click();
    },
  },
};
</script>
<style lang="scss" scoped>
.singleImg-container {
  width: 100px;
  height: 100px;

  .img-uploader {
    ::v-deep.el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409eff;
      }
    }
  }

  .icon-box {
    position: relative;

    .upload-tip {
      position: absolute;
      font-size: 14px;
      color: #8c939d;
      left: 0;
      right: 0;
      padding: 0 5px;
      bottom: 10px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
  }

  .img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 80px;
    text-align: center;
  }

  .el-upload-list {
    width: 100px;
    height: 100px;
    display: block;

    .el-upload-list__item,
    .el-image {
      width: 100px;
      height: 100px;
    }
  }
}
</style>