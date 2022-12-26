<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
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
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addVisible=true">
            <upload-btn url="/api/visualdev/OnlineDev/App/Model/Actions/ImportData"
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
          <el-table-column prop="state" label="状态" width="70" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.state == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.state==1?'正常':'停用'}}</el-tag>
            </template>
          </el-table-column>
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
                    <el-dropdown-item @click.native="preview(scope.row.id)">预览</el-dropdown-item>
                    <el-dropdown-item @click.native="copy(scope.row.id)">复制</el-dropdown-item>
                    <el-dropdown-item @click.native="exportModel(scope.row.id)">导出
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
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <AddBox :visible.sync="addVisible" @add="handleAdd" />
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false"
      :visible.sync="previewVisible" class="JNPF-dialog JNPF-dialog_center code-dialog" title="预览"
      width="400px" @opened="getQRimg">
      <div class="qrcode-img">
        <div id="qrcode" ref="qrCode"></div>
      </div>
      <p class="tip">打开手机APP扫码预览</p>
    </el-dialog>
  </div>
</template>

<script>
import Form from './Form'
import AddBox from '@/views/generator/AddBox'
import QRCode from 'qrcodejs2'
import mixin from '@/mixins/generator/index'
export default {
  name: 'onlineDev-appDesign',
  mixins: [mixin],
  components: { Form, AddBox },
  data() {
    return {
      query: { keyword: '', type: 2 },
      sort: 'appDesigner',
      previewVisible: false,
      qrCodeText: ''
    }
  },
  created() {
    this.getDictionaryData()
  },
  methods: {
    preview(id) {
      let text = { t: 'ADP', id }
      this.qrCodeText = JSON.stringify(text)
      this.previewVisible = true
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
    }
  }
}
</script>
<style lang="scss" scoped>
.code-dialog {
  ::v-deep {
    .el-dialog__body {
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