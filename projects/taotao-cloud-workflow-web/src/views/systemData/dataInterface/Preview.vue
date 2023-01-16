<template>
  <div class="WORKFLOW-preview-main">
    <div class="WORKFLOW-common-page-header">
      <el-page-header @back="goBack" content="接口预览" />
      <div class="options">
        <el-button @click="goBack">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <el-form ref="dataForm" class="main" label-position="top" v-loading="formLoading">
      <el-form-item label="Request URL">
        <el-input v-model="url">
          <template slot="prepend">GET</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Response body" class="value-item">
        <el-input v-model="responseData" type="textarea" :rows="30" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { previewDataInterface } from '@/api/systemData/dataInterface'

export default {
  data() {
    return {
      title: '',
      formLoading: false,
      responseData: '',
      url: '',
      options: {
        readOnly: true,
        language: 'json'
      }
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id, tenantId) {
      this.id = id || ''
      this.formLoading = true
      this.responseData = ''
      this.$nextTick(() => {
        this.url = `${this.define.comUrl}/api/system/DataInterface/${id}/Actions/Response` + (tenantId ? '?tenantId=' + tenantId : '')
        previewDataInterface(this.id).then(res => {
          let data = this.workflow.interfaceDataHandler(res.data)
          this.responseData = JSON.stringify(data, null, 4)
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      })

    },
  }
}
</script>
<style lang="scss" scoped>
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .value-item {
    flex: 1;
    margin-bottom: 0;
    ::v-deep .el-form-item__content {
      height: calc(100% - 32px);
      .el-textarea {
        height: 100%;
        .el-textarea__inner {
          height: 100%;
        }
      }
    }
  }
}
</style>
