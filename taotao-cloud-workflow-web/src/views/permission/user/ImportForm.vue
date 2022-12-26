<template>
  <el-dialog title="批量导入" :close-on-click-modal="false" :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center JNPF-dialog-import" lock-scroll width="1000px">
    <el-steps :active="active" align-center>
      <el-step title="上传文件"></el-step>
      <el-step title="数据预览"></el-step>
      <el-step title="导入数据"></el-step>
    </el-steps>
    <div class="import-main" v-show="active==1">
      <div class="upload">
        <div class="up_left">
          <img src="@/assets/images/upload.png">
        </div>
        <div class="up_right">
          <p class="title">上传填好的数据表</p>
          <p class="tip">文件后缀名必须是xls或xlsx，文件大小不超过500KB，最多支持导入1000条数据</p>
          <el-upload :action="define.comUrl+'/api/permission/Users/Uploader'"
            :headers="{ Authorization: $store.getters.token}" :on-success="handleSuccess"
            :on-remove="handleRemove" :before-remove="beforeRemove" :on-change="handleChange"
            :file-list="fileList" accept=".xls,.xlsx" :before-upload="beforeUpload"
            class="upload-area">
            <el-button type="text">上传文件</el-button>
          </el-upload>
        </div>
      </div>
      <div class="upload">
        <div class="up_left">
          <img src="@/assets/images/import.png">
        </div>
        <div class="up_right">
          <p class="title">填写导入数据信息</p>
          <p class="tip">请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除</p>
          <el-button type="text" @click="templateDownload">下载模板</el-button>
        </div>
      </div>
    </div>
    <div class="import-main" v-show="active==2">
      <JNPF-table v-loading="listLoading" :data="list">
        <el-table-column prop="account" label="账户" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.account" />
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.realName" />
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.gender" />
          </template>
        </el-table-column>
        <el-table-column prop="email" label="电子邮箱" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.email" />
          </template>
        </el-table-column>
        <el-table-column prop="organizeId" label="所属组织" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.organizeId" />
          </template>
        </el-table-column>
        <el-table-column prop="managerId" label="直属主管" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.managerId" />
          </template>
        </el-table-column>
        <el-table-column prop="positionId" label="岗位" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.positionId" />
          </template>
        </el-table-column>
        <el-table-column prop="roleId" label="角色" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.roleId" />
          </template>
        </el-table-column>
        <el-table-column prop="sortCode" label="排序" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sortCode" />
          </template>
        </el-table-column>
        <el-table-column prop="enabledMark" label="状态" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.enabledMark" />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.description" />
          </template>
        </el-table-column>
        <el-table-column prop="nation" label="民族" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.nation" />
          </template>
        </el-table-column>
        <el-table-column prop="nativePlace" label="籍贯" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.nativePlace" />
          </template>
        </el-table-column>
        <el-table-column prop="entryDate" label="入职时间" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.entryDate" />
          </template>
        </el-table-column>
        <el-table-column prop="certificatesType" label="证件类型" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.certificatesType" />
          </template>
        </el-table-column>
        <el-table-column prop="certificatesNumber" label="证件号码" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.certificatesNumber" />
          </template>
        </el-table-column>
        <el-table-column prop="education" label="文化程度" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.education" />
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="出生年月" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.birthday" />
          </template>
        </el-table-column>
        <el-table-column prop="telePhone" label="办公电话" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.telePhone" />
          </template>
        </el-table-column>
        <el-table-column prop="landline" label="办公座机" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.landline" />
          </template>
        </el-table-column>
        <el-table-column prop="mobilePhone" label="手机号码" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mobilePhone" />
          </template>
        </el-table-column>
        <el-table-column prop="urgentContacts" label="紧急联系" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.urgentContacts" />
          </template>
        </el-table-column>
        <el-table-column prop="urgentTelePhone" label="紧急电话" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.urgentTelePhone" />
          </template>
        </el-table-column>
        <el-table-column prop="postalAddress" label="通讯地址" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.postalAddress" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="50">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn"
              @click="handleDel(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </JNPF-table>
    </div>
    <div class="import-main" v-show="active==3">
      <div class="success" v-if="!result.resultType">
        <img src="@/assets/images/success.png" alt="">
        <p class="success-title">批量导入成功</p>
        <p class="success-tip">您已成功导入{{result.snum}}条数据</p>
      </div>
      <div class="unsuccess" v-if="result.resultType">
        <el-alert title="错误提醒：导入失败数据展示" type="warning" show-icon :closable="false" />
        <div class="upload error-show">
          <div class="up_left">
            <img class="" src="@/assets/images/tip.png">
          </div>
          <div class="up_right">
            <p class="tip">正常数量条数：<el-link type="success" :underline="false">{{result.snum}}条
              </el-link>
            </p>
            <p class="tip">异常数量条数：<el-link type="danger" :underline="false">{{result.fnum}}条
              </el-link>
            </p>
          </div>
        </div>
        <div class="contips">
          <p>以下文件数据为导入异常数据</p>
          <el-button type="text" icon="el-icon-upload2" @click="exportExceptionData">导出异常数据
          </el-button>
        </div>
        <JNPF-table :data="resultList" height="280px">
          <el-table-column prop="account" label="账户" width="150" />
          <el-table-column prop="realName" label="姓名" width="150" />
          <el-table-column prop="gender" label="性别" width="150" />
          <el-table-column prop="email" label="电子邮箱" width="150" />
          <el-table-column prop="organizeId" label="所属组织" width="150" />
          <el-table-column prop="managerId" label="直属主管" width="150" />
          <el-table-column prop="positionId" label="岗位" width="150" />
          <el-table-column prop="roleId" label="角色" width="150" />
          <el-table-column prop="sortCode" label="排序" width="150" />
          <el-table-column prop="enabledMark" label="状态" width="150" />
          <el-table-column prop="description" label="说明" width="150" />
          <el-table-column prop="nation" label="民族" width="150" />
          <el-table-column prop="nativePlace" label="籍贯" width="150" />
          <el-table-column prop="entryDate" label="入职时间" width="150" />
          <el-table-column prop="certificatesType" label="证件类型" width="150" />
          <el-table-column prop="certificatesNumber" label="证件号码" width="150" />
          <el-table-column prop="education" label="文化程度" width="150" />
          <el-table-column prop="birthday" label="出生年月" width="150" />
          <el-table-column prop="telePhone" label="办公电话" width="150" />
          <el-table-column prop="landline" label="办公座机" width="150" />
          <el-table-column prop="mobilePhone" label="手机号码" width="150" />
          <el-table-column prop="urgentContacts" label="紧急联系" width="150" />
          <el-table-column prop="urgentTelePhone" label="紧急电话" width="150" />
          <el-table-column prop="postalAddress" label="通讯地址" width="150" />
        </JNPF-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()" v-if="active == 1">取 消</el-button>
      <el-button @click="prev" v-if="active == 2">上一步</el-button>
      <el-button @click="next" type="primary" v-if="active < 3" :loading="btnLoading"
        :disabled="active == 1 && !fileName">下一步
      </el-button>
      <el-button @click="cancel(true)" type="primary" v-else>关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { TemplateDownload, ImportData, ImportPreview, ExportExceptionData } from '@/api/permission/user'
export default {
  data() {
    return {
      visible: false,
      btnLoading: false,
      listLoading: false,
      fileName: '',
      fileList: [],
      active: 1,
      list: [],
      resultList: [],
      result: {
        resultType: 0,
        snum: 0,
        fnum: 0
      }
    }
  },
  methods: {
    prev() {
      if (this.active == 1) return
      this.active--
    },
    next() {
      if (this.active == 2) {
        if (!this.list.length) return this.$message({ message: '导入数据为空', type: 'warning' })
        this.btnLoading = true
        ImportData({ list: this.list }).then(res => {
          this.result = res.data
          this.resultList = res.data.failResult
          this.btnLoading = false
          this.active++
        }).catch(() => { this.btnLoading = false })
      }
      if (this.active == 1) {
        if (!this.fileList.length || !this.fileName) return this.$message({ message: '请先上传文件', type: 'warning' })
        this.btnLoading = true
        ImportPreview({ fileName: this.fileName }).then(res => {
          this.list = res.data.dataRow
          this.btnLoading = false
          this.active++
        }).catch(() => { this.btnLoading = false })
      }
    },
    cancel(isRefresh) {
      this.visible = false
      if (isRefresh) this.$emit('refresh')
    },
    init() {
      this.active = 1
      this.fileList = []
      this.fileName = ''
      this.visible = true
    },
    handleDel(index) {
      this.list.splice(index, 1)
    },
    templateDownload() {
      TemplateDownload().then(res => {
        this.jnpf.downloadFile(res.data.url)
      })
    },
    exportExceptionData() {
      ExportExceptionData({ list: this.resultList }).then(res => {
        this.jnpf.downloadFile(res.data.url)
      })
    },
    beforeUpload(file) {
      let isRightSize = file.size / 1024 < 500
      if (!isRightSize) this.$message.error(`文件大小不能超过500KB`)
      return isRightSize
    },
    handleRemove(file, fileList) {
      this.fileList = []
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).catch(() => { })
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.fileList = fileList.slice(-1)
        this.fileName = res.data.name
      } else {
        this.fileList = fileList.filter(o => o.uid != file.uid)
        this.$message({ message: res.msg, type: 'error', duration: 1000 })
      }
    }
  }
}
</script>