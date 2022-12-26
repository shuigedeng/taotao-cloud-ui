<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" content="新建流程" />
        <div class="options">
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs tab-position="left" style="height:100%" v-model="category" class="flow-tabs">
          <el-tab-pane label="全部流程" name=""></el-tab-pane>
          <el-tab-pane :label="item.fullName" :name="item.enCode" v-for="item in categoryList"
            :key="item.enCode"></el-tab-pane>
          <div class="box">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item label="关键词">
                    <el-input v-model="keyword" placeholder="请输入关键词查询" clearable
                      @keyup.enter.native="search()" />
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
            <div class="list" ref="infiniteBody"
              v-loading="listLoading && listQuery.currentPage==1">
              <el-row :gutter="20" v-if="list.length">
                <el-col :span="6" v-for="(item,i) in list" :key="i" class="item"
                  @click.native="jump(item)">
                  <el-card shadow="hover">
                    <div class="box-icon" :style="{backgroundColor:item.iconBackground||'#008cff'}">
                      <i :class="item.icon"></i>
                    </div>
                    <span class="title">{{item.fullName}}</span>
                  </el-card>
                </el-col>
              </el-row>
              <el-empty description="暂无数据" :image-size="120" v-else></el-empty>
            </div>
          </div>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { FlowEnginePageList } from '@/api/workFlow/FlowEngine'
export default {
  data() {
    return {
      keyword: '',
      category: '',
      listQuery: {
        currentPage: 1,
        pageSize: 50,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      finish: false,
      list: [],
      listLoading: true,
      categoryList: []
    }
  },
  watch: {
    category(val) {
      this.reset()
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init() {
      this.getDictionaryData()
      this.$nextTick(() => {
        this.bindScroll()
      })
    },
    reset() {
      this.keyword = ''
      this.search()
    },
    search() {
      this.list = []
      this.finish = false
      this.listQuery = {
        currentPage: 1,
        pageSize: 50,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    bindScroll() {
      let _this = this,
        vBody = _this.$refs.infiniteBody;
      vBody.addEventListener("scroll", function () {
        if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 200 && !_this.listLoading && !_this.finish) {
          _this.listQuery.currentPage += 1
          _this.initData()
        }
      });
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        keyword: this.keyword,
        category: this.category == 0 ? '' : this.category
      }
      FlowEnginePageList(query).then((res) => {
        if (res.data.list.length < this.listQuery.pageSize) {
          this.finish = true
        }
        this.list = [...this.list, ...res.data.list]
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'WorkFlowCategory' }).then((res) => {
        this.categoryList = res
      })
    },
    jump(item) {
      if (!item.enCode) {
        this.$message({
          type: 'error',
          message: '流程不存在'
        });
        return
      }
      this.$emit('choiceFlow', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #606266;
  .flow-tabs {
    ::v-deep .el-tabs__item {
      text-align: left !important;
      width: 160px !important;
    }
    ::v-deep .el-tabs__content {
      height: 100%;

      .el-tab-pane {
        height: 0;
        display: none !important;
      }
    }
  }
  ::v-deep .is-horizontal {
    display: none;
  }
  ::v-deep .el-scrollbar__view {
    overflow: hidden;
  }
  .box {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .list {
    flex: 1;
    margin-top: 10px;
    overflow: hidden auto;
    .item {
      margin-bottom: 20px;
      cursor: pointer;
      ::v-deep .el-card__body {
        display: flex;
        align-items: center;
        padding: 15px;
      }
      .box-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        text-align: center;
        background-color: #ccc;
        display: inline-block;
        margin-right: 15px;
        i {
          text-align: center;
          font-size: 36px;
          color: #fff;
          line-height: 48px;
        }
      }
      .title {
        display: inline-block;
        width: calc(100% - 63px);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        font-size: 14px;
      }
    }
  }
}
</style>