<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main diySearch">
      <div class="JNPF-common-page-header diySearch-header">
        <el-page-header @back="goBack" content="未提交查询" />
        <div class="options">
          <!-- <el-button
            type="primary"
            :loading="btnLoading"
            @click="dataFormSubmit()"
          >
            {{ $t("common.confirmButton") }}</el-button
          > -->
          <el-button @click="goBack()">{{
            $t("common.cancelButton")
          }}</el-button>
          <el-button type="primary" :loading ='exportBtnLoading' @click="exportExcel()">导出</el-button>
        </div>
      </div>
      <div class="">
        <el-tabs v-model="listQuery.time" type="card" @tab-click="handleClick">
          <el-tab-pane
            :key="index"
            v-for="(item, index) in timeList"
            :label="item"
            :name="item"
          >
            <JNPF-table v-loading="listLoading" :data="list" max-height="100%">
              <el-table-column prop="creatorUserName" label="姓名" />
              <el-table-column prop="gender" label="性别" />
              <el-table-column prop="companyName" label="所属公司" />
              <el-table-column prop="deptName" label="所属部门" />
            </JNPF-table>
            <pagination
              :total="total"
              :page.sync="listQuery.currentPage"
              :limit.sync="listQuery.pageSize"
              @pagination="getPageTableList"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>
<style lang="scss" scoped>
@import "./index.scss";
</style>

<script>
import Logic from "./logic.js";
export default Logic;
</script>
