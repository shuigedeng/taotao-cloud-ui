import { getVisualDevList, Delete, Copy, exportData, exportAppData } from '@/api/onlineDev/visualDev'

export default {
  data() {
    return {
      list: [],
      category: '',
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      listLoading: false,
      formVisible: false,
      addVisible: false,
      categoryList: []
    }
  },
  created() {
    this.getDictionaryData()
    this.initData()
  },
  methods: {
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    reset() {
      this.query.keyword = ''
      this.category = ''
      this.search()
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: this.sort }).then((res) => {
        this.categoryList = res
      })
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        ...this.query,
        category: this.category
      }
      getVisualDevList(query).then(res => {
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
      }).catch(() => {});
    },
    copy(id) {
      this.$confirm('您确定要复制该功能表单, 是否继续?', '提示', {
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
      }).catch(() => {});
    },
    exportModel(id) {
      this.$confirm('您确定要导出该功能表单, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        let method = null
        if (this.query.type == 1) {
          method = exportData
        }
        if (this.query.type == 2) {
          method = exportAppData
        }
        method(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => {});
    },
    handleAdd(webType) {
      this.addOrUpdateHandle('', webType)
    },
    addOrUpdateHandle(id, webType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.categoryList, id, this.query.type, webType)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    }
  }
}