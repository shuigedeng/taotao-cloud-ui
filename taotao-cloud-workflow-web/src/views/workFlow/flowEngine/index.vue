<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="流程分类">
              <el-select v-model="category" placeholder="请选择流程分类" clearable>
                <el-option v-for="item in categoryList" :key="item.enCode" :label="item.fullName"
                  :value="item.enCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="dialogVisible=true">
            <upload-btn url="/api/workflow/Engine/FlowEngine/Actions/ImportData"
              @on-success="reset()" />
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list">
          <el-table-column prop="fullName" label="流程名称" min-width="150" />
          <el-table-column prop="enCode" label="流程编码" width="200" />
          <el-table-column prop="category" label="流程分类" width="150" />
          <el-table-column prop="formType" label="表单类型" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.formType == 1? "系统表单" : "自定义表单" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="流程类型" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.type == 0? "发起流程" : "功能流程" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="visibleType" label="可见范围" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.visibleType ==  0 ? "全部可见" : "部分可见" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat"
            width="120" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column prop="enabledMark" label="状态" width="70" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.enabledMark==1?'正常':'停用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id,scope.row.formType)"
                @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="preview(scope.row)">
                      表单预览</el-dropdown-item>
                    <el-dropdown-item @click.native="previewApp(scope.row.id)">
                      移动预览</el-dropdown-item>
                    <el-dropdown-item @click.native="copy(scope.row.id)">
                      复制流程</el-dropdown-item>
                    <el-dropdown-item @click.native="handleExport(scope.row.id)">
                      导出流程</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <preview v-if="previewVisible" ref="preview" @close="previewVisible=false" />
    <el-dialog title="新建表单" :visible.sync="dialogVisible" class="JNPF-dialog JNPF-dialog_center"
      lock-scroll width="600px">
      <div class="add-main">
        <div class="add-item add-item-sys" @click="addFlow(1)">
          <i class="add-icon el-icon-document"></i>
          <div class="add-txt">
            <p class="add-title">系统表单</p>
            <p class="add-desc">关联系统原有表单，便捷设计</p>
          </div>
        </div>
        <div class="add-item" @click="addFlow(2)">
          <i class="add-icon icon-ym icon-ym-generator-company"></i>
          <div class="add-txt">
            <p class="add-title">自定义表单</p>
            <p class="add-desc">自定义设计流程表单</p>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false"
      :visible.sync="previewAppVisible" class="JNPF-dialog JNPF-dialog_center code-dialog"
      title="预览" width="400px" @opened="getQRimg">
      <div class="qrcode-img">
        <div id="qrcode" ref="qrCode"></div>
      </div>
      <p class="tip">打开手机APP扫码预览</p>
    </el-dialog>
  </div>
</template>

<script>
import { FlowEngineList, Delete, Release, Stop, Copy, exportData } from '@/api/workFlow/FlowEngine'
import Form from './Form'
import preview from '../components/Preview'
import QRCode from 'qrcodejs2'
export default {
  name: 'workFlow-flowEngine',
  components: { Form, preview },
  data() {
    return {
      keyword: '',
      category: '',
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      list: [],
      listLoading: true,
      dialogVisible: false,
      formVisible: false,
      previewVisible: false,
      previewAppVisible: false,
      qrCodeText: '',
      categoryList: []
    }
  },
  created() {
    this.getDictionaryData()
    this.initData()
  },
  methods: {
    reset() {
      this.keyword = ''
      this.category = ''
      this.search()
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        keyword: this.keyword,
        category: this.category
      }
      FlowEngineList(query).then((res) => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'WorkFlowCategory' }).then((res) => {
        this.categoryList = res
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: res.msg
          });
        })
      }).catch(() => { });
    },
    addFlow(formType) {
      this.dialogVisible = false
      this.addOrUpdateHandle('', formType)
    },
    // 新增 / 修改
    addOrUpdateHandle(id, formType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.categoryList, id, formType)
      })
    },
    copy(id) {
      this.$confirm('您确定要复制该流程, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        Copy(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => { });
    },
    handleExport(id) {
      this.$confirm('您确定要导出该流程, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportData(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    preview(row) {
      let data = {
        enCode: row.enCode,
        fullName: row.fullName,
        formType: row.formType,
        flowId: row.id
      }
      this.previewVisible = true
      this.$nextTick(() => {
        this.$refs.preview.init(data)
      })
    },
    previewApp(id) {
      let text = { t: 'WFP', id }
      this.qrCodeText = JSON.stringify(text)
      this.previewAppVisible = true
    },
    getQRimg() {
      if (!this.qrCodeText) return
      this.$refs.qrCode.innerHTML = "";
      let qrcode = new QRCode(this.$refs.qrCode, {
        width: 260,
        height: 260,
        text: this.qrCodeText,
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleUpdate(row) {
      if (row.enabledMark) {
        this.$confirm('您确定要停止当前流程吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          Stop(row.id).then(res => {
            row.enabledMark = 0
            this.$message({
              type: 'success',
              message: res.msg
            });
          })
        }).catch(() => { });
      } else {
        this.$confirm('您确定要发布当前流程吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          Release(row.id).then(res => {
            row.enabledMark = 1
            this.$message({
              type: 'success',
              message: res.msg
            });
          })
        }).catch(() => { });
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.JNPF-dialog {
  ::v-deep .el-dialog__body {
    padding: 50px 30px !important;
  }
}
.add-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .add-item {
    width: 255px;
    height: 136px;
    background: #eff9ff;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 20px;
    &.add-item-sys {
      background: #f1f5ff;
      .add-icon {
        background: #ccd9ff;
        color: #537eff;
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
.code-dialog {
  ::v-deep {
    .el-dialog__body {
      padding: 20px 50px 2px !important;
      .qrcode-img {
        width: 300px;
        height: 300px;
        padding: 20px;
      }
      .tip {
        text-align: center;
        font-size: 18px;
        margin-top: 10px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>