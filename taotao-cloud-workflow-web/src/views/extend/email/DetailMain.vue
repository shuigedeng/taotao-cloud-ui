<template>
  <el-form ref="dataForm" :model="dataForm" label-width="80px" size="mini" class="main">
    <el-form-item label-width="10px">
      <h4 class="text">{{dataForm.subject}}</h4>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="发件人">
      <el-link :underline="false" class="text" type="success">
        {{isSend?dataForm.sender: dataForm.senderName + "&lt;" + dataForm.sender + ">"}}
      </el-link>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="时间">
      <p class="text" v-if="isSend">{{dataForm.creatorTime|toDate()}}</p>
      <p class="text" v-if="!isSend">{{dataForm.fdate|toDate()}}</p>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="收件人">
      <p class="text">{{isSend?dataForm.recipient:dataForm.mAccount}}</p>
    </el-form-item>
    <el-divider></el-divider>
    <template v-if="dataForm.cc">
      <el-form-item label="抄送人" prop="cc">
        <p>{{dataForm.cc}}</p>
      </el-form-item>
      <el-divider></el-divider>
    </template>
    <template v-if="dataForm.bcc">
      <el-form-item label="密送人" prop="bcc">
        <p class="text">{{dataForm.bcc}}</p>
      </el-form-item>
      <el-divider></el-divider>
    </template>
    <template v-if="fileList.length">
      <el-form-item label="附件">
        <ul class="el-upload-list el-upload-list--text">
          <li class="el-upload-list__item" v-for="(item,i) in fileList" :key="i"
            @click="download(item.fileId)">
            <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{item.name}}
            </a>
          </li>
        </ul>
      </el-form-item>
      <el-divider></el-divider>
    </template>
    <el-form-item label-width="10px">
      <p class="content" v-html="dataForm.bodyText"></p>
    </el-form-item>
  </el-form>
</template>

<script>
import { getDownloadUrl } from '@/api/common'
export default {
  props: ['dataForm', 'isSend'],
  data() {
    return {}
  },
  computed: {
    fileList() {
      return this.dataForm.attachment ? JSON.parse(this.dataForm.attachment) : []
    }
  },
  methods: {
    download(id) {
      getDownloadUrl('mail', id).then(res => {
        this.workflow.downloadFile(res.data.url)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
  ::v-deep .el-divider--horizontal {
    margin: 5px 0;
  }
  .text {
    word-break: break-all;
  }
  h4.text {
    font-size: 15px;
  }
  ::v-deep .el-upload-list__item:first-child {
    margin-top: 3px;
  }
}
</style>
