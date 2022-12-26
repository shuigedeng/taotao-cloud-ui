<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left" v-if="columnData.type === 2">
      <div class="JNPF-common-title" v-if="columnData.treeTitle">
        <h2>{{ columnData.treeTitle }}</h2>
      </div>
      <el-tree
        :data="treeData"
        :props="treeProps"
        default-expand-all
        highlight-current
        ref="treeBox"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        class="JNPF-common-el-tree"
        :node-key="treeProps.value"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <i :class="data.icon"></i>
          <span class="text">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <div class="JNPF-common-layout-center">
      <Search
        ref="Search"
        :list="columnData.searchList"
        @reset="reset"
        @search="search"
      />
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div v-if="isPreview || !columnData.useBtnPermission">
            <el-button
              :type="i == 0 ? 'primary' : 'text'"
              :icon="item.icon"
              @click="headBtnsHandel(item.value)"
              v-for="(item, i) in columnData.btnsList"
              :key="i"
            >
              {{ item.label }}</el-button
            >
            <el-button v-show="isShowDiyBtn" type="primary" @click="diySearch"
              >未提交查询</el-button
            >
          </div>
          <div v-else>
            <el-button
              :type="i == 0 ? 'primary' : 'text'"
              :icon="item.icon"
              v-has="'btn_' + item.value"
              @click="headBtnsHandel(item.value)"
              v-for="(item, i) in columnData.btnsList"
              :key="i"
            >
              {{ item.label }}</el-button
            >
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip
              effect="dark"
              :content="$t('common.refresh')"
              placement="top"
            >
              <el-link
                icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
                :underline="false"
                @click="initData()"
              />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table
          v-loading="listLoading"
          :data="list"
          row-key="id"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: '' }"
          @sort-change="sortChange"
          :has-c="hasBatchBtn"
          @selection-change="handleSelectionChange"
          v-if="refreshTable"
        >
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :align="item.align"
            :width="item.width"
            :key="i"
            :sortable="item.sortable ? 'custom' : item.sortable"
            v-for="(item, i) in columnList"
          />
          <el-table-column
            prop="flowState"
            label="状态"
            width="100"
            v-if="config.webType == 3"
          >
            <template slot-scope="scope" v-if="!scope.row.top">
              <el-tag v-if="scope.row.flowState == 1">等待审核</el-tag>
              <el-tag type="success" v-else-if="scope.row.flowState == 2"
                >审核通过</el-tag
              >
              <el-tag type="danger" v-else-if="scope.row.flowState == 3"
                >审核驳回</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.flowState == 4"
                >流程撤回</el-tag
              >
              <el-tag type="info" v-else-if="scope.row.flowState == 5"
                >审核终止</el-tag
              >
              <el-tag type="info" v-else>等待提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            :width="operationWidth"
            v-if="columnBtnsList.length || customBtnsList.length"
          >
            <template slot-scope="scope" v-if="!scope.row.top">
              <template v-if="isPreview || !columnData.useBtnPermission">
                <template v-for="(item, i) in columnBtnsList">
                  <template v-if="item.value == 'edit'">
                    <el-button
                      size="mini"
                      type="text"
                      :key="i"
                      :disabled="
                        config.webType == 3 &&
                        [1, 2, 5].indexOf(scope.row.flowState) > -1
                      "
                      @click="columnBtnsHandel(item.value, scope.row)"
                    >
                      {{ item.label }}</el-button
                    >
                  </template>
                  <template v-else-if="item.value == 'remove'">
                    <el-button
                      size="mini"
                      type="text"
                      :key="i"
                      class="JNPF-table-delBtn"
                      :disabled="
                        config.webType == 3 &&
                        [1, 2, 3, 5].indexOf(scope.row.flowState) > -1
                      "
                      @click="columnBtnsHandel(item.value, scope.row)"
                    >
                      {{ item.label }}</el-button
                    >
                  </template>
                  <template v-else-if="item.value == 'detail'">
                    <el-button
                      size="mini"
                      type="text"
                      :key="i"
                      :disabled="config.webType == 3 && !scope.row.flowState"
                      @click="columnBtnsHandel(item.value, scope.row)"
                    >
                      {{ item.label }}</el-button
                    >
                  </template>
                  <template v-else>
                    <el-button
                      size="mini"
                      type="text"
                      :key="i"
                      @click="customBtnsHandel(item, scope.row, scope.$index)"
                    >
                      {{ item.label }}</el-button
                    >
                  </template>
                </template>
                <template v-if="customBtnsList.length">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t("common.moreBtn")
                        }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(item, i) in customBtnsList"
                        :key="i"
                        @click.native="
                          customBtnsHandel(item, scope.row, scope.$index)
                        "
                      >
                        {{ item.label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </template>
              <template v-else>
                <template v-for="(item, i) in columnBtnsList">
                  <template v-if="item.value == 'edit'">
                    <el-button
                      size="mini"
                      type="text"
                      :key="i"
                      :disabled="
                        config.webType == 3 &&
                        [1, 2, 5].indexOf(scope.row.flowState) > -1
                      "
                      @click="columnBtnsHandel(item.value, scope.row)"
                      v-has="'btn_' + item.value"
                    >
                      {{ item.label }}</el-button
                    >
                  </template>
                  <template v-else-if="item.value == 'remove'">
                    <el-button
                      size="mini"
                      type="text"
                      :key="i"
                      class="JNPF-table-delBtn"
                      :disabled="
                        config.webType == 3 &&
                        [1, 2, 3, 5].indexOf(scope.row.flowState) > -1
                      "
                      @click="columnBtnsHandel(item.value, scope.row)"
                      v-has="'btn_' + item.value"
                    >
                      {{ item.label }}</el-button
                    >
                  </template>
                  <template v-else-if="item.value == 'detail'">
                    <el-button
                      size="mini"
                      type="text"
                      :key="i"
                      :disabled="config.webType == 3 && !scope.row.flowState"
                      @click="columnBtnsHandel(item.value, scope.row)"
                      v-has="'btn_' + item.value"
                    >
                      {{ item.label }}</el-button
                    >
                  </template>
                  <template v-else>
                    <el-button
                      size="mini"
                      type="text"
                      :key="i"
                      v-has="item.value"
                      @click="customBtnsHandel(item, scope.row, scope.$index)"
                    >
                      {{ item.label }}</el-button
                    >
                  </template>
                </template>
                <template v-if="customBtnsList.length">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t("common.moreBtn")
                        }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(item, i) in customBtnsList"
                        :key="i"
                        @click.native="
                          customBtnsHandel(item, scope.row, scope.$index)
                        "
                        v-has="item.value"
                        >{{ item.label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </template>
            </template>
          </el-table-column>
        </JNPF-table>
        <template v-if="columnData.type !== 3 && columnData.hasPage">
          <pagination
            :total="total"
            :page.sync="listQuery.currentPage"
            :limit.sync="listQuery.pageSize"
            @pagination="initData"
          />
        </template>
      </div>
    </div>
    <FlowBox v-if="flowVisible" ref="FlowBox" @close="closeFlow" />
    <Form v-show="formVisible" ref="Form" @refreshDataList="refresh" />
    <Detail
      v-show="detailVisible"
      ref="Detail"
      @close="detailVisible = false"
    />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <DiySearch v-if="diySearchVisible" ref="DiySearch" @closeDiySearch="diySearchVisible = false"/>
  </div>
</template>

<script>
import {
  getModelList,
  deleteModel,
  batchDelete,
  exportModel,
} from "@/api/onlineDev/visualDev";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import { getDataInterfaceRes } from "@/api/systemData/dataInterface";
import { getColumnsByModuleId } from "@/api/common";
import request from "@/utils/request";
import Form from "./Form";
import FlowBox from "@/views/workFlow/components/FlowBox";
import Detail from "./detail";
import DiySearch from "./components/diySearch/index.vue";
import ExportBox from "./ExportBox";
import Search from "./Search";
import moment from "moment";
import "moment/locale/zh-cn";
export default {
  name: "dynamicModel",
  components: { Form, ExportBox, Search, Detail, FlowBox ,DiySearch },
  props: ["config", "modelId", "isPreview"],
  data() {
    return {
      keyword: "",
      treeProps: {
        children: "children",
        label: "fullName",
        value: "id",
      },
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
        menuId: "",
        json: "",
      },
      defaultListQuery: {
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
      flowVisible: false,
      formVisible: false,
      detailVisible: false,
      importBoxVisible: false,
      exportBoxVisible: false,
      
      treeData: [],
      treeActiveId: "",
      columnData: {
        columnBtnsList: [],
      },
      formData: {},
      columnList: [],
      columnBtnsList: [],
      customBtnsList: [],
      hasBatchBtn: false,
      refreshTable: true,
      multipleSelection: [],
      settingsColumnList: [],
      // by xyb
      diySearchVisible: false,
      isShowDiyBtn: false, //自定义按钮
    };
  },
  computed: {
    operationWidth() {
      const customWidth = this.customBtnsList.length ? 50 : 0;
      return this.columnBtnsList.length * 50 + customWidth;
    },
  },
  created() {
    if (this.$route.path.indexOf("lxhsjctb") != -1) {
      this.isShowDiyBtn = true;
    }
    this.init();
  },
  methods: {
    diySearch() {
      // by xyb
      let obj = {}
      let dataList = this.$refs.Search._data.searchList;
      for (let i = 0; i < dataList.length; i++) {
        const e = dataList[i]
        if (e.value) {
          if (Array.isArray(e.value)) {
            if (e.value.length) obj[e.__vModel__] = e.value
          } else {
            obj[e.__vModel__] = e.value
          }
        }
      }
      if(obj.hasOwnProperty('user_id')){
        obj.userIds = obj.user_id.join(',');
      }
      let json = JSON.stringify(obj) === "{}" ? '' : JSON.stringify(obj)
      
      if(json.indexOf("sampling_time") === -1){
        this.$message.error('核酸检测采样时间不能为空')
        return false;
      }
      let searchData = JSON.parse(json);
      let diffDays = moment(searchData.sampling_time[1]).diff(searchData.sampling_time[0], 'day')
      if(diffDays > 30){
        this.$message.error('核酸检测采样时间不能超过30天');
        return false;
      }
      this.diySearchVisible = true;
      this.$nextTick(() => {
        this.$refs.DiySearch.init(json);
      })
    },
    async init() {
      this.listQuery.menuId = this.$route.meta.modelId;
      this.refreshTable = false;
      if (!this.config.columnData || !this.config.formData) return;
      this.columnData = JSON.parse(this.config.columnData);
      if (this.columnData.type === 3) {
        this.columnData.columnList = this.columnData.columnList.filter(
          (o) => o.prop != this.columnData.groupField
        );
      }
      this.hasBatchBtn = this.columnData.btnsList.some(
        (o) => o.value == "batchRemove"
      );
      this.$nextTick(() => {
        this.refreshTable = true;
      });
      this.formData = JSON.parse(this.config.formData);
      this.customBtnsList = this.columnData.customBtnsList || [];
      this.columnBtnsList = this.columnData.columnBtnsList || [];
      this.listLoading = true;
      if (this.isPreview) this.listQuery.menuId = "270579315303777093";
      let res = await getColumnsByModuleId(this.listQuery.menuId);
      this.settingsColumnList = res.data || [];
      this.getColumnList();
      if (this.isPreview) return (this.listLoading = false);
      this.listQuery.pageSize = this.columnData.pageSize;
      this.listQuery.sort = this.columnData.sort;
      this.listQuery.sidx = this.columnData.defaultSidx;
      this.defaultListQuery.pageSize = this.columnData.pageSize;
      this.defaultListQuery.sort = this.columnData.sort;
      this.defaultListQuery.sidx = this.columnData.defaultSidx;
      if (this.columnData.type === 3 || !this.columnData.hasPage)
        this.listQuery.pageSize = 10000;
      if (this.columnData.type === 2) {
        this.treeProps.value = this.columnData.treePropsValue || "id";
        this.treeProps.label = this.columnData.treePropsLabel || "fullName";
        this.treeProps.children =
          this.columnData.treePropsChildren || "children";
        this.getTreeView();
      } else {
        this.initData();
      }
    },
    initData() {
      if (this.isPreview) return;
      this.listLoading = true;
      getModelList(this.modelId, this.listQuery).then((res) => {
        this.list = res.data.list;
        if (this.columnData.type !== 3 && this.columnData.hasPage)
          this.total = res.data.pagination.total;
        this.listLoading = false;
      });
    },
    getTreeView() {
      if (this.columnData.treeDataSource === "dictionary") {
        if (!this.columnData.treeDictionary) return;
        getDictionaryDataSelector(this.columnData.treeDictionary).then(
          (res) => {
            this.treeData = res.data.list;
            this.initData();
          }
        );
      }
      if (this.columnData.treeDataSource === "organize") {
        this.$store.dispatch("generator/getDepTree").then((res) => {
          this.treeData = res;
          this.initData();
        });
      }
      if (this.columnData.treeDataSource === "department") {
        this.$store.dispatch("generator/getDepTree").then((res) => {
          this.treeData = res;
          this.initData();
        });
      }
      if (this.columnData.treeDataSource === "api") {
        if (!this.columnData.treePropsUrl) return;
        getDataInterfaceRes(this.columnData.treePropsUrl).then((res) => {
          let data = this.jnpf.interfaceDataHandler(res.data);
          if (Array.isArray(data)) {
            this.treeData = data;
          } else {
            this.treeData = [];
          }
          this.initData();
        });
      }
    },
    getColumnList() {
      if (this.isPreview) {
        this.columnList = this.columnData.columnList.map((o) => ({
          ...o,
          visible: true,
        }));
        return;
      }
      let columnPermissionList = [];
      if (!this.columnData.useColumnPermission) {
        columnPermissionList = this.columnData.columnList;
      } else {
        const permissionList = this.$store.getters.permissionList;
        const modelId = this.$route.meta.modelId;
        const list = permissionList.filter((o) => o.modelId === modelId);
        const columnList = list[0] && list[0].column ? list[0].column : [];
        for (let i = 0; i < this.columnData.columnList.length; i++) {
          inner: for (let j = 0; j < columnList.length; j++) {
            if (this.columnData.columnList[i].prop === columnList[j].enCode) {
              columnPermissionList.push(this.columnData.columnList[i]);
              break inner;
            }
          }
        }
      }
      this.columnList = columnPermissionList;
    },
    getNodePath(node) {
      let fullPath = [];
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data);
        if (node.parent) loop(node.parent);
      };
      loop(node);
      return fullPath;
    },
    handleNodeClick(data, node) {
      if (this.treeActiveId == data[this.treeProps.value]) return;
      this.treeActiveId = data[this.treeProps.value];
      this.$refs.Search.treeReset();
      let json = {};
      if (this.columnData.treeDataSource === "organize") {
        const nodePath = this.getNodePath(node);
        const currValue = nodePath.map((o) => o[this.treeProps.value]);
        json = { [this.columnData.treeRelation]: currValue };
      } else {
        json = { [this.columnData.treeRelation]: data[this.treeProps.value] };
      }
      this.search(JSON.stringify(json));
    },
    handleDel(id) {
      this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
        type: "warning",
      })
        .then(() => {
          deleteModel(this.modelId, id).then((res) => {
            this.$message({
              type: "success",
              message: res.msg,
              duration: 1000,
              onClose: () => {
                this.initData();
              },
            });
          });
        })
        .catch(() => {});
    },
    addOrUpdateHandle(id) {
      debugger;
      if (this.config.webType == 3) {
        let data = {
          id: id || "",
          enCode: this.config.flowEnCode,
          flowId: this.config.flowId,
          formType: 2,
          type: 1,
          opType: "-1",
          modelId: this.modelId,
          isPreview: this.isPreview,
        };
        this.flowVisible = true;
        this.$nextTick(() => {
          this.$refs.FlowBox.init(data);
        });
      } else {
        this.formVisible = true;
        this.$nextTick(() => {
          this.$refs.Form.init(
            this.formData,
            this.modelId,
            id,
            this.isPreview,
            this.columnData.useFormPermission
          );
        });
      }
    },
    headBtnsHandel(key) {
      if (key === "add") {
        this.addOrUpdateHandle();
      }
      if (key == "download") {
        this.exportBoxVisible = true;
        this.$nextTick(() => {
          this.$refs.ExportBox.init(this.columnList);
        });
      }
      if (this.isPreview) return;
      if (key === "batchRemove") {
        this.batchRemove();
      }
    },
    handleSelectionChange(val) {
      const res = val.map((item) => item.id);
      this.multipleSelection = res;
    },
    batchRemove() {
      if (!this.multipleSelection.length) {
        this.$message({
          type: "error",
          message: "请选择一条数据",
          duration: 1500,
        });
        return;
      }
      this.$confirm("您确定要删除这些数据吗, 是否继续?", "提示", {
        type: "warning",
      })
        .then(() => {
          batchDelete(this.modelId, this.multipleSelection).then((res) => {
            this.$message({
              type: "success",
              message: res.msg,
              duration: 1500,
              onClose: () => {
                this.initData();
              },
            });
          });
        })
        .catch(() => {});
    },
    download(data) {
      if (this.isPreview)
        return this.$message({
          message: "功能预览不支持数据导出",
          type: "warning",
        });
      let query = { ...this.listQuery, ...data };
      exportModel(this.modelId, query).then((res) => {
        if (!res.data.url) return;
        this.jnpf.downloadFile(res.data.url);
        this.$refs.ExportBox.visible = false;
        this.exportBoxVisible = false;
      });
    },
    columnBtnsHandel(key, row) {
      if (key === "edit") {
        this.addOrUpdateHandle(row.id);
      }
      if (key === "detail") {
        this.goDetail(row.id, row);
      }
      if (key == "remove") {
        this.handleDel(row.id);
      }
    },
    goDetail(id, row) {
      if (this.config.webType == 3) {
        let data = {
          id,
          enCode: this.config.flowEnCode,
          flowId: this.config.flowId,
          formType: 2,
          type: 1,
          opType: 0,
          modelId: this.modelId,
          isPreview: this.isPreview,
          status: row.flowState,
        };
        this.flowVisible = true;
        this.$nextTick(() => {
          this.$refs.FlowBox.init(data);
        });
      } else {
        this.detailVisible = true;
        this.$nextTick(() => {
          this.$refs.Detail.init(
            this.formData,
            this.modelId,
            id,
            this.columnData.useFormPermission
          );
        });
      }
    },
    sortChange({ column, prop, order }) {
      this.listQuery.sort = order == "ascending" ? "asc" : "desc";
      this.listQuery.sidx = !order ? "" : prop;
      this.initData();
    },
    refresh(isRefresh) {
      this.formVisible = false;
      if (isRefresh) this.initData();
    },
    closeFlow(isRefresh) {
      this.flowVisible = false;
      if (isRefresh) this.initData();
    },
    reset() {
      this.listQuery.sort = this.defaultListQuery.sort;
      this.listQuery.sidx = this.defaultListQuery.sidx;
      if (this.columnData.type === 2) {
        let obj = { [this.columnData.treeRelation]: this.treeActiveId };
        let json = this.treeActiveId ? JSON.stringify(obj) : "";
        this.search(json);
      } else {
        this.search("");
      }
    },
    search(json) {
      if (this.isPreview) return;
      if (!json) this.$refs.treeBox && this.$refs.treeBox.setCurrentKey(null);
      this.listQuery.json = json;
      this.listQuery.currentPage = 1;
      this.initData();
    },
    customBtnsHandel(item, row, index) {
      const parameter = {
        data: row,
        index,
        request: this.request,
        toast: this.$message,
        refresh: this.initData,
      };
      const func = this.jnpf.getScriptFunc.call(this, item.func);
      if (!func) return;
      func.call(this, parameter);
    },
    request(url, method, data) {
      if (!url) return;
      return request({
        url: url,
        method: method || "GET",
        data: data || {},
      });
    },
  },
};
</script>
