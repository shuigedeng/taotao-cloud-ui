<template>
  <div class="UploadFile-container">
    <template v-if="!detailed">
      <el-upload :action="define.comUploadUrl+'/'+type" :headers="uploadHeaders" ref="elUpload"
        :on-success="handleSuccess" :multiple="limit!==1" :show-file-list="false" :accept="accept"
        :before-upload="beforeUpload" :on-exceed="handleExceed" :disabled="disabled" :limit="limit">
        <el-button size="small" icon="el-icon-upload" :disabled="disabled">{{buttonText}}
        </el-button>
        <div slot="tip" class="el-upload__tip" v-show="showTip">
          只能上传不超过{{fileSize}}{{sizeUnit}}的{{acceptText}}文件
        </div>
      </el-upload>
    </template>
    <template v-if="fileList.length">
      <transition-group class="el-upload-list el-upload-list el-upload-list--text" tag="ul"
        name="el-list">
        <li class="el-upload-list__item is-success" v-for="(file,index) in fileList"
          :key="file.fileId" :class="{'el-upload-list__item_detail':detailed}">
          <a class="el-upload-list__item-name" @click="handleClick(file)">
            <i class="el-icon-document"></i>{{file.name}}
          </a>
          <i class="el-icon-view" @click="handlePreview(file)"></i>
          <i class="el-icon-download" @click="handleClick(file)"></i>
          <label class="el-upload-list__item-status-label" :class="{'disabled':disabled}">
            <i class="el-icon-upload-success el-icon-circle-check"></i>
          </label>
          <i class="el-icon-close" v-if="!disabled" @click="handleRemove(file,index)"></i>
        </li>
      </transition-group>
    </template>
    <Preview :visible.sync="previewVisible" :file="activeFile" />
  </div>
</template>

<script>
const units = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024
}
import { getDownloadUrl } from '@/api/common'
import Preview from './Preview'
export default {
  name: 'UploadFile',
  components: { Preview },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'annex'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showTip: {
      type: Boolean,
      default: false
    },
    detailed: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 0
    },
    accept: {
      type: String,
      default: '*'
    },
    buttonText: {
      type: String,
      default: '选择文件'
    },
    sizeUnit: {
      type: String,
      default: 'MB'
    },
    fileSize: {
      default: 5
    },
  },
  data() {
    return {
      fileList: this.value,
      previewVisible: false,
      activeFile: {},
      uploadHeaders: { Authorization: this.$store.getters.token }
    }
  },
  computed: {
    acceptText() {
      let txt = ''
      switch (this.accept) {
        case 'image/*':
          txt = '图片'
          break;
        case 'video/*':
          txt = '视频'
          break;
        case 'audio/*':
          txt = '音频'
          break;
        case '.xls,.xlsx':
          txt = 'excel'
          break;
        case '.doc,.docx':
          txt = 'word'
          break;
        case '.pdf':
          txt = 'pdf'
          break;
        case '.txt':
          txt = 'txt'
          break;
        default:
          txt = ''
          break;
      }
      return txt
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.fileList = val
        this.$nextTick(() => {
          if (!val.length) {
            this.$refs.elUpload && this.$refs.elUpload.uploadFiles.splice(0)
          } else {
            if (!this.$refs.elUpload) return
            this.$refs.elUpload.uploadFiles = val.map(o => ({
              ...o,
              uid: o.fileId
            }))
          }
        })
      }
    }
  },
  methods: {
    getType(filename) {
      const index1 = filename.lastIndexOf(".");
      const index2 = filename.length;
      const type = filename.substring(index1, index2);
      return type;
    },
    beforeUpload(file) {
      const unitNum = units[this.sizeUnit];
      if (!this.fileSize) return true
      let isRightSize = file.size / unitNum < this.fileSize
      if (!isRightSize) {
        this.$message.error(`文件大小超过${this.fileSize}${this.sizeUnit}`)
        return isRightSize;
      }
      let type = ''
      let isAccept = true
      if (this.accept === '.xls,.xlsx' || this.accept === '.doc,.docx' || this.accept === '.pdf' || this.accept === '.txt') {
        type = this.getType(file.name)
        isAccept = this.accept.indexOf(type) > -1
      } else if (this.accept === '*') { } else {
        type = file.type
        isAccept = new RegExp(this.accept).test(type)
      }
      if (!isAccept) {
        this.$message.error(`请选择${this.acceptText}类型的文件`)
        return isAccept;
      }
      return isRightSize && isAccept;
    },
    handleSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.fileList.push({
          name: file.name,
          fileId: res.data.name,
          fileVersionId: res.data.fileVersionId,
          url: res.data.url
        })
        this.$emit('input', this.fileList)
        this.$emit('change', this.fileList)
      } else {
        this.$refs.elUpload.uploadFiles.splice(fileList.length - 1, 1)
        fileList.filter(o => o.uid != file.uid)
        this.$emit('input', this.fileList)
        this.$emit('change', this.fileList)
        this.$message({ message: res.msg, type: 'error', duration: 1500 })
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制最多可以上传${this.limit}个文件`);
    },
    handleRemove(file, index) {
      this.fileList.splice(index, 1)
      this.$refs.elUpload.uploadFiles.splice(index, 1)
      this.$emit("input", this.fileList)
      this.$emit('change', this.fileList)
      // this.$confirm(`确定移除${file.name}？`, '提示').then(() => {
      // }).catch(() => { })
    },
    handleClick(file) {
      // 点击下载文件
      if (!file.fileId) return
      getDownloadUrl(this.type, file.fileId).then(res => {
        this.jnpf.downloadFile(res.data.url)
      })
    },
    handlePreview(file) {
      this.activeFile = file
      this.previewVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.el-upload-list__item {
  &.el-upload-list__item_detail:first-child {
    margin-top: 5px !important;
  }
  .el-upload-list__item-name {
    margin-right: 70px;
  }
  &:hover {
    .el-upload-list__item-status-label.disabled {
      display: block !important;
    }
  }
  .el-icon-download {
    display: inline-block;
    position: absolute;
    top: 5px;
    right: 25px;
    cursor: pointer;
    opacity: 0.75;
    color: #606266;
  }
  .el-icon-view {
    display: inline-block;
    position: absolute;
    top: 5px;
    right: 45px;
    cursor: pointer;
    opacity: 0.75;
    color: #606266;
  }
}
</style>