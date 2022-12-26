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
            <el-form-item label="所属分类">
              <el-select v-model="category" placeholder="请选择所属分类" clearable>
                <el-option v-for="item in categoryList" :key="item.id" :label="item.fullName"
                  :value="item.id">
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
          <topOpts @add="dialogVisible=true" addText="新建门户">
            <upload-btn url="/api/visualdev/Portal/Model/Actions/ImportData"
              @on-success="initData" />
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list">
          <el-table-column prop="fullName" label="名称" show-overflow-tooltip min-width="200" />
          <el-table-column prop="enCode" label="编码" width="200" />
          <el-table-column prop="category" label="分类" width="150" />
          <el-table-column prop="creatorUser" label="创建人" width="120" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat"
            width="120" />
          <el-table-column prop="lastModifyTime" label="最后修改时间" :formatter="jnpf.tableDateFormat"
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
              <tableOpts @edit="addOrUpdateHandle(scope.row.type,scope.row.id)"
                @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="preview(scope.row.id)">预览</el-dropdown-item>
                    <el-dropdown-item @click.native="copy(scope.row.id)">复制</el-dropdown-item>
                    <el-dropdown-item @click.native="exportTemplate(scope.row.id)">导出
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="distribute(scope.row.id)">授权</el-dropdown-item>
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
    <Form v-if="formVisible" ref="form" @close="closeForm" />
    <Form1 v-if="form1Visible" ref="form1" @close="closeForm1" />
    <Preview :visible.sync="previewVisible" :id="activeId" />
    <Transfer ref="transfer" :visible.sync="transferShow" :id="transferId" />
    <el-dialog title="新建门户" :visible.sync="dialogVisible"
      class="JNPF-dialog JNPF-dialog-add JNPF-dialog_center" lock-scroll width="600px">
      <div class="add-main">
        <div class="add-item add-item-sys" @click="addOrUpdateHandle(1)">
          <i class="add-icon icon-ym icon-ym-customUrl"></i>
          <div class="add-txt">
            <p class="add-title">自定义路径</p>
            <p class="add-desc">配置静态页面地址</p>
          </div>
        </div>
        <div class="add-item" @click="addOrUpdateHandle(0)">
          <i class="add-icon icon-ym icon-ym-pageDesign"></i>
          <div class="add-txt">
            <p class="add-title">页面设计</p>
            <p class="add-desc">拖拽生成门户</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPortalList, Delete, Copy, exportTemplate } from '@/api/onlineDev/portal'
import Form from './Form'
import Form1 from './Form1'
import Preview from './IndexPreview'
import Transfer from './Transfer'
export default {
  name: 'onlineDev-visualPortal',
  components: { Form, Form1, Preview, Transfer },
  data() {
    return {
      list: [],
      keyword: '',
      category: '',
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      activeId: '',
      transferId: '',
      dialogVisible: false,
      previewVisible: false,
      transferShow: false,
      listLoading: false,
      formVisible: false,
      form1Visible: false,
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
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'portalDesigner' }).then((res) => {
        this.categoryList = res
      })
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        keyword: this.keyword,
        category: this.category
      }
      getPortalList(query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
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
    copy(id) {
      this.$confirm('您确定要复制该门户, 是否继续?', '提示', {
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
    preview(id) {
      if (!id) return
      this.activeId = id
      this.previewVisible = true
    },
    exportTemplate(id) {
      this.$confirm('您确定要导出该门户, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportTemplate(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    distribute(id) {
      this.transferId = id
      this.transferShow = true
    },
    addOrUpdateHandle(type, id) {
      this.dialogVisible = false
      const key = type === 1 ? 'form1' : 'form'
      const time = type === 1 && !id ? 300 : 0
      setTimeout(() => {
        this[key + 'Visible'] = true
        this.$nextTick(() => {
          this.$refs[key].init(this.categoryList, id)
        })
      }, time);
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) this.initData()
    },
    closeForm1(isRefresh) {
      this.form1Visible = false
      if (isRefresh) this.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
.JNPF-dialog-add {
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
</style>