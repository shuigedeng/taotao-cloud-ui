<template>
  <transition name="el-zoom-in-center">
    <div class="WORKFLOW-preview-main">
      <div class="WORKFLOW-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? '新建公告' : '编辑公告'" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            {{$t('common.confirmButton')}}</el-button>
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" v-loading="formLoading"
        label-width="60px" class="main">
        <el-form-item label="用户" prop="toUserIds">
          <user-select v-model="toUserIds" placeholder="全部用户" multiple clearable />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title" placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <WORKFLOW-UploadFz v-model="files" />
        </el-form-item>
        <el-form-item label="正文" prop="bodyText">
          <WORKFLOWQuill v-model="dataForm.bodyText" />
        </el-form-item>
      </el-form>
    </div>
  </transition>
</template>

<script>
import WORKFLOWQuill from '@/components/WORKFLOWEditor/quill'
import { createNotice, updateNotice, getNoticeInfo } from '@/api/system/message'

export default {
  components: { WORKFLOWQuill },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        toUserIds: '',
        title: '',
        files: '',
        bodyText: ''
      },
      toUserIds: [],
      files: [],
      dataRule: {
        title: [
          { required: true, message: '公告标题不能为空', trigger: 'blur' }
        ],
        bodyText: [
          { required: true, message: '公告内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id) {
      this.dataForm.id = id || 0
      this.files = []
      this.toUserIds = []
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getNoticeInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.files = res.data.files ? JSON.parse(res.data.files) : []
            this.toUserIds = res.data.toUserIds ? res.data.toUserIds.split(',') : []
          })
        }
        this.formLoading = false
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.dataForm.files = JSON.stringify(this.files)
          this.dataForm.toUserIds = this.toUserIds.join(',')
          const formMethod = this.dataForm.id ? updateNotice : createNotice
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refreshDataList')
                this.goBack()
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.WORKFLOW-preview-main {
  .content {
    ::v-deep {
      p {
        line-height: 30px;
        img {
          display: block;
          margin-right: auto;
          margin-left: auto;
        }
      }
    }
  }
  .vab-quill-content {
    ::v-deep {
      .el-form-item__content {
        line-height: normal;
      }
    }
  }
}
</style>
