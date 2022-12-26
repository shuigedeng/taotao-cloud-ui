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
          <topOpts addText="新建报表" @add="addOrUpdateHandle()">
            <el-upload :action="define.reportServer+'/api/datareport/Data/Action/Import'"
              :headers="{ Authorization: $store.getters.token}" :on-success="handleSuccess"
              :before-upload="()=>{btnLoading = true}" :show-file-list="false" class="upload-btn">
              <el-button type="text" icon="el-icon-upload2" :loading="btnLoading">导入</el-button>
            </el-upload>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list">
          <el-table-column prop="fullName" label="名称" min-width="200" />
          <el-table-column prop="enCode" label="编码" width="200" />
          <el-table-column prop="categoryId" label="分类" width="150">
            <template slot-scope="scope">
              {{ scope.row.categoryId|getCategoryText(categoryList) }}
            </template>
          </el-table-column>
          <el-table-column prop="creatorUser" label="创建人" width="120" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat"
            width="120" />
          <el-table-column prop="lastModifyTime" label="最后修改时间" :formatter="jnpf.tableDateFormat"
            width="120" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{$t('common.moreBtn')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="handlePreview(scope.row.id, scope.row.fullName)">预览
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleCopy(scope.row.id)">复制</el-dropdown-item>
                    <el-dropdown-item @click.native="handleExport(scope.row.id)">导出
                    </el-dropdown-item>
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
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <Preview v-show="previewVisible" ref="Preview" @close="previewVisible=false" />
  </div>
</template>
<script>
import {
  getDataReportList,
  copyDataReport,
  delDataReport
} from '@/api/onlineDev/dataReport'
import { reportServer } from '@/utils/define'
import { getToken } from '@/utils/auth'
import Form from './Form'
import Preview from './Preview'

export default {
  components: {
    Form,
    Preview
  },
  name: 'onlineDev-dataReport',
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
      listLoading: false,
      btnLoading: false,
      formVisible: false,
      previewVisible: false,
      categoryList: [],
    }
  },
  filters: {
    getCategoryText(id, categoryList) {
      let item = categoryList.filter(o => o.id == id)[0]
      return item && item.fullName ? item.fullName : ''
    }
  },
  created() {
    this.getDictionaryData()
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
      getDataReportList(query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'ReportSort' }).then(res => {
        this.categoryList = JSON.parse(JSON.stringify(res))
        this.initData()
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delDataReport(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    handlePreview(id) {
      this.previewVisible = true
      this.$nextTick(() => {
        this.$refs.Preview.init(id)
      })
    },
    handleCopy(id) {
      this.$confirm('您确定要复制该报表, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        copyDataReport(id).then(res => {
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
      this.$confirm('您确定要导出该报表, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        const token = getToken()
        let link = document.createElement('a')
        link.href = `${reportServer}/api/datareport/Data/${id}/Actions/Export?token=${token}`
        link.click();
      }).catch(() => { });
    },
    handleSuccess(res) {
      this.btnLoading = false
      if (res.code == 200) {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1000
        })
        this.initData()
      } else {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-btn {
  display: inline-block;
  margin: 0 10px;
}
</style>