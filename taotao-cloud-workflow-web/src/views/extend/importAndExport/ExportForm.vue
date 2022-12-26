<template>
  <el-dialog title="导出数据" :close-on-click-modal="false" :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center JNPF-dialog-export" lock-scroll width="600px">
    <el-form label-position="top">
      <el-form-item>
        <el-radio-group v-model="type">
          <el-radio :label="0">当前页面数据</el-radio>
          <el-radio :label="1">全部页面数据</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="export-line">
        <p slot="label" class="export-label">列表数据<span>请选择导出字段</span></p>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
          @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="columns" @change="handleCheckedChange">
          <el-checkbox v-for="item in columnList" :label="item.prop" :key="item.prop"
            class="column-item">
            {{item.label}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <p class="footer-tip">提示:系统将导出列表中选中的数据</p>
      <el-button @click="visible=false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="downLoad" :loading="btnLoading">导 出</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ExportExcel } from '@/api/extend/employee'
export default {
  data() {
    return {
      visible: false,
      btnLoading: false,
      type: 0,
      columns: [],
      columnList: [
        {
          label: "工号",
          prop: "enCode"
        },
        {
          label: "姓名",
          prop: "fullName"
        },
        {
          label: "性别",
          prop: "gender"
        },
        {
          label: "部门",
          prop: "departmentName"
        },
        {
          label: "岗位",
          prop: "positionName"
        },
        {
          label: "用工性质",
          prop: "workingNature"
        },
        {
          label: "身份证号",
          prop: "idNumber"
        },
        {
          label: "联系电话",
          prop: "telephone"
        },
        {
          label: "出生年月",
          prop: "birthday"
        },
        {
          label: "参加工作",
          prop: "attendWorkTime"
        },
        {
          label: "最高学历",
          prop: "education"
        },
        {
          label: "所学专业",
          prop: "major"
        },
        {
          label: "毕业院校",
          prop: "graduationAcademy"
        },
        {
          label: "毕业时间",
          prop: "graduationTime"
        },
        {
          label: "创建时间",
          prop: "creatorTime"
        },
      ],
      listQuery: {},
      checkAll: true,
      isIndeterminate: false
    }
  },
  methods: {
    init(listQuery) {
      this.visible = true
      this.checkAll = true
      this.isIndeterminate = false
      this.btnLoading = false
      this.listQuery = listQuery
      this.columns = this.columnList.map(o => o.prop)
    },
    handleCheckAllChange(val) {
      this.columns = val ? this.columnList.map(o => o.prop) : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnList.length;
    },
    downLoad() {
      if (!this.columns.length) return this.$message.warning(`请至少选择一个导出字段`)
      this.btnLoading = true
      let query = {
        ...this.listQuery,
        dataType: this.type,
        selectKey: this.columns.join(',')
      }
      ExportExcel(query).then(res => {
        this.btnLoading = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url)
        this.visible = false
      }).catch(() => { this.btnLoading = false })
    }
  }
}
</script>
