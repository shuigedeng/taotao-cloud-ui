<template>
  <el-dialog v-bind="$attrs" :close-on-click-modal="false" :modal-append-to-body="false"
    v-on="$listeners" @open="onOpen" fullscreen lock-scroll class="JNPF-full-dialog"
    :show-close="false" :modal="false" append-to-body>
    <div class="JNPF-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/jnpf.png" class="header-logo" />
        <p class="header-txt"> · 打印预览</p>
      </div>
      <div class="options">
        <el-button type="primary" size="small" @click="word">Word下载</el-button>
        <el-button type="primary" size="small" @click="print">打印</el-button>
        <el-button @click="closeDialog()">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <div ref="tsPrint" class="print-content" v-html="printTemplate" />
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { getData } from '@/api/system/printDev'
export default {
  props: ['id', 'formId', 'fullName'],
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() {
    return {
      data: {},
      printTemplate: '',
      recordList: [],
      loading: false
    }
  },
  methods: {
    onOpen() {
      if (!this.id) return
      this.printTemplate = ''
      this.data = {}
      this.loading = true
      let query = {
        id: this.id,
        formId: this.formId
      }
      getData(query).then(res => {
        if (!res.data) return
        this.printTemplate = res.data.printTemplate
        this.data = res.data.printData
        this.recordList = res.data.operatorRecordList || []
        this.$nextTick(() => {
          const tableList = this.$refs.tsPrint.getElementsByTagName('table')
          if (tableList.length) {
            for (let j = 0; j < tableList.length; j++) {
              const tableObj = tableList[j];
              let tds = []
              let newTable = []
              for (let i = 0; i < tableObj.rows.length; i++) {
                tds = tableObj.rows[i]
                const dataTag = this.isChildTable(tds.cells)
                if (dataTag) {
                  this.retrieveData(dataTag, tableObj, tds, newTable)
                } else {
                  newTable.push(tds)
                }
              }
              tableObj.getElementsByTagName('tbody')[0].innerHTML = ''
              for (let i = 0; i < newTable.length; i++) {
                tableObj.getElementsByTagName('tbody')[0].appendChild(newTable[i])
              }
            }
          }
        })
        this.replaceValue(this.data)
        this.replaceSysValue()
        this.loading = false
      })
    },
    isChildTable(cells) {
      let tableName = ''
      outer: for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        let spanList = cells[j].getElementsByTagName('span')
        if (!spanList.length) break outer;
        let hasChildTable = false
        inner: for (let j = 0; j < spanList.length; j++) {
          const spanEle = spanList[j];
          const dataTag = spanEle.getAttribute('data-tag') ? spanEle.getAttribute('data-tag').split('.')[0] : 'null'
          if (dataTag && dataTag !== 'null') {
            hasChildTable = true
            tableName = dataTag
            break inner
          }
        }
        if (hasChildTable) break outer;
      }
      return tableName
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
    shengchengtable(data, tds) {
      for (let key in data) {
        for (let j = 0; j < tds.cells.length; j++) {
          let spanList = tds.cells[j].getElementsByTagName('span')
          for (let i = 0; i < spanList.length; i++) {
            if (`{${key}}` === spanList[i].innerHTML) {
              spanList[i].innerHTML = data[key]
            }
          }
        }
      }
      return tds
    },
    retrieveData(dataTag, tableObj, tds, newTable) {
      for (let key in this.data) {
        if (key == dataTag) {
          for (let j = 0; j < this.data[key].length; j++) {
            newTable.push(this.shengchengtable(this.data[key][j], tds.cloneNode(true)))
          }
        }
      }
    },
    replaceSysValue() {
      const recordList = this.recordList.filter(o => o.handleStatus == 0 || o.handleStatus == 1)
      const systemPrinter = this.userInfo.userName + '/' + this.userInfo.userAccount
      const systemPrintTime = this.jnpf.toDate(new Date())
      let systemApprovalContent = ''
      if (recordList.length) {
        systemApprovalContent += '<table style="border-collapse: collapse; width: 100%;" border="1" data-mce-style="border-collapse: collapse; width: 100%;"><tbody><tr><td style="width:30%;" data-mce-style="width: 30%;">审批节点</td><td style="width: 70%;" data-mce-style="width: 70%;">审批内容</td></tr>'
        let content = ''
        for (let i = 0; i < recordList.length; i++) {
          const record = recordList[i];
          let desc = (record.userName || record.handleId) + '于' + this.jnpf.toDate(record.handleTime) + (record.handleStatus == 1 ? '审批通过' : '审批拒绝') + (record.handleOpinion ? '，审批意见：' + record.handleOpinion : '')
          content += `<tr><td style="width: 30%;" data-mce-style="width: 30%;"><span class="wk-print-tag-wukong wk-tiny-color--common" contenteditable="false">${record.nodeName}</span></td><td style="width: 70%;" data-mce-style="width: 70%;"><span class="wk-print-tag-wukong wk-tiny-color--common" contenteditable="false">${desc}</span></td></tr>`
        }
        systemApprovalContent += content
        systemApprovalContent += '</tbody></table>'
      }
      this.printTemplate = this.replaceAll(this.printTemplate, '{systemPrinter}', systemPrinter)
      this.printTemplate = this.replaceAll(this.printTemplate, '{systemPrintTime}', systemPrintTime)
      this.printTemplate = this.replaceAll(this.printTemplate, '{systemApprovalContent}', systemApprovalContent)
    },
    replaceValue(data) {
      for (let key in data) {
        this.printTemplate = this.replaceAll(this.printTemplate, `{${key}}`, data[key] || '')
        if (Array.isArray(data[key]) && data[key] && data[key].length) {
          this.replaceValue(data[key])
        }
      }
    },
    replaceAll(data, replace, value) {
      const lenr = replace.length
      const len = data.length
      let newData = ''
      let i = 0
      for (i; i < len; i++) {
        let k = 0
        let string = ''
        for (k; k < lenr; k++) {
          var n = i + k
          string += data[n]
        }
        if (string === replace) {
          newData += value
          i = i + lenr
        }
        newData += data[i]
      }
      return newData
    },
    word() {
      let print = this.$refs.tsPrint.innerHTML
      const blob = new Blob([print], {
        type: ''
      })
      const name = this.fullName ? `${this.fullName}.doc` : '下载文档.doc'
      this.downloadFile(blob, name)
    },
    downloadFile(data, name, type) {
      let blob = new Blob([data], {
        type: type || ''
      })
      let downloadElement = document.createElement('a')
      let href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = name
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(href)
    },
    print() {
      let print = this.$refs.tsPrint.innerHTML
      let newWindow = window.open('_blank')
      newWindow.document.body.innerHTML = print
      newWindow.print()
      newWindow.close()
    },
  }
}
</script>
<style lang="scss" scoped>
.print-content {
  background: white;
  padding: 40px 30px;
  margin: 0 auto;
  border-radius: 4px;
  width: 600px;
  height: 100%;
  overflow: auto;
}
</style>