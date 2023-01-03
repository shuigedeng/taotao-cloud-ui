<template>
  <div class="singleImg-container">
    <div class="el-upload-list el-upload-list--picture-card" v-if="imageUrl">
      <li class="el-upload-list__item is-success">
        <el-image :src="define.comUrl+imageUrl" class="el-upload-list__item-thumbnail"
          :preview-src-list="fileList" :z-index="10000" ref="image">
        </el-image>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview()">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove()">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </li>
    </div>
    <el-upload class="img-uploader" :action="define.comUploadUrl+'/'+type" :show-file-list="false"
      :on-success="handleSuccess" :headers="uploadHeaders" accept="image/*" v-else>
      <div class="icon-box">
        <i class="el-icon-plus img-uploader-icon"></i>
        <p class="upload-tip" v-if="tip">{{tip}}</p>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'SingleImg',
  props: {
    value: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: '上传图片'
    },
    type: {
      type: String,
      default: 'annexpic'
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      imageUrl: '',
      uploadHeaders: { Authorization: this.$store.getters.token }
    }
  },
  computed: {
    fileList() {
      return this.imageUrl ? [this.define.comUrl + this.imageUrl] : []
    }
  },
  watch: {
    value(val) {
      this.imageUrl = val
    }
  },
  methods: {
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.imageUrl = res.data.url;
        this.$emit('input', res.data.url)
      } else {
        this.$message({ message: res.msg, type: 'error', duration: 1500 })
      }
    },
    handlePictureCardPreview() {
      this.$refs.image && this.$refs.image.clickHandler()
    },
    handleRemove() {
      this.$emit("input", '')
    }
  }
}
</script>
<style lang="scss" scoped>
.singleImg-container {
  width: 100px;
  height: 100px;
  .img-uploader {
    ::v-deep .el-upload {
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