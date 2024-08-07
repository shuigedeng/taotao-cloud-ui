<template>
  <div class="WORKFLOW-common-layout">
    <div class="WORKFLOW-common-layout-center">
      <el-row class="WORKFLOW-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="query.keyword" placeholder="请输入关键词查询" clearable
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
      <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main">
        <div class="WORKFLOW-common-head">
          <topOpts @add="addOrUpdateHandle('',3)" addText="新建模板"></topOpts>
          <div class="WORKFLOW-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh WORKFLOW-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <WORKFLOW-table v-loading="listLoading" :data="list">
          <el-table-column prop="fullName" label="名称" show-overflow-tooltip min-width="200" />
          <el-table-column prop="enCode" label="编码" width="200" />
          <el-table-column prop="category" label="分类" width="150" />
          <el-table-column prop="creatorUser" label="创建人" width="120" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="workflow.tableDateFormat"
            width="120" />
          <el-table-column prop="lastModifyTime" label="最后修改时间" :formatter="workflow.tableDateFormat"
            width="120" />
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="copy(scope.row.id)">复制模板</el-dropdown-item>
                    <el-dropdown-item @click.native="download(scope.row)">下载代码</el-dropdown-item>
                    <el-dropdown-item @click.native="preview(scope.row)">预览代码</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </WORKFLOW-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <Preview v-if="previewVisible" ref="preview" @close="previewVisible=false" />
    <DownloadForm v-if="downloadFormVisible" ref="downloadForm"
      @close="downloadFormVisible=false" />
  </div>
</template>

<script>
import Form from './Form'
import DownloadForm from '../DownloadForm'
import Preview from '../Preview'
import mixin from '@/mixins/generator/index'
export default {
  name: 'generator-flowForm',
  mixins: [mixin],
  components: { Form, DownloadForm, Preview },
  data() {
    return {
      query: { keyword: '', type: 3 },
      previewVisible: false,
      downloadFormVisible: false,
      sort: 'flowForm'
    }
  },
  methods: {
    download(row) {
      this.downloadFormVisible = true
      this.$nextTick(() => {
        this.$refs.downloadForm.init(row.tables, row.id, 3)
      })
    },
    preview(row) {
      this.previewVisible = true
      this.$nextTick(() => {
        this.$refs.preview.init(row.tables, row.id)
      })
    }
  }
}
</script>
