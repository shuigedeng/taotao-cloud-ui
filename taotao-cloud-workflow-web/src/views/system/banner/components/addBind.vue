<template>
  <el-dialog
    title="关联公告"
    :visible.sync="dialogVisible"
    width="1010px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="dialog-con">
      <div class="dialog-con-tips">
        <i class="el-icon-info"></i>
        <span>请选择您要关联的公告，关联后可通过首页banner图查看公告详情</span>
      </div>
      <el-table
        :data="list"
        @current-change="clickChange"
        v-loading="listLoading"
        style="width: 100%"
      >
        <el-table-column label="" width="50" align="center">
          <template slot-scope="scope">
            <el-radio v-model="tableRadio" :label="scope.row"><i></i></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="index"
          type="index"
          width="50"
          label="序号"
          align="center"
        />
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="creatorUser" label="发布人" width="180">
        </el-table-column>
        <el-table-column
          prop="lastModifyTime"
          label="发布时间"
          :formatter="jnpf.tableDateFormat"
          width="180"
        >
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.currentPage"
        :limit.sync="listQuery.pageSize"
        @pagination="initData"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <!-- <el-button type="primary" @click.stop="$emit('confirm')">确认关联</el-button> -->
      <el-button
        type="primary"
        @click.stop="confirm"
        :disabled="checkedData == null ? true : false"
        >确认关联</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { getNoticeList } from "@/api/system/message";
import { addOrUpdateBanner } from "@/api/system/banner";
export default {
  data() {
    return {
      dialogVisible: false,
      tableRadio: null,
      total: 0,
      listQuery: {
        keyword: "",
        currentPage: 1,
        pageSize: 10,
        enabledMark: 1,
      },
      checkedData: null,
      listLoading: false,
      bannerData: null,
      list: [],
    };
  },
  mounted() {},
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.tableRadio = null;
    },
    openDialog(data) {
      console.log("🚀 ~ file: addBind.vue ~ line 84 ~ openDialog ~ data", data);
      this.bannerData = data;
      this.dialogVisible = true;
      this.initData();
    },
    initData() {
      this.listLoading = true;
      getNoticeList(this.listQuery)
        .then((res) => {
          this.list = res.data.list;
          this.total = res.data.pagination.total;
          this.listLoading = false;
          this.btnLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.btnLoading = false;
        });
    },
    clickChange(item) {
      this.checkedData = item;
      this.tableRadio = item;
      console.log(
        "🚀 ~ file: addBind.vue ~ line 104 ~ clickChange ~ item",
        item
      );
    },
    confirm() {
      let params = {
        banners: [
          {
            id: this.bannerData.id,
            messageId: this.checkedData.id,
            messageName: this.checkedData.title,
            url: this.bannerData.url,
          },
        ],
      };
      addOrUpdateBanner(params).then((res) => {
        console.log(
          "🚀 ~ file: index.vue ~ line 107 ~ addOrUpdateBanner ~ res",
          res
        );
        this.$emit("getList");
        this.dialogVisible = false;
        this.tableRadio = null;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-con {
  &-tips {
    padding-left: 50px;
    height: 48px;
    line-height: 48px;
    background-color: #f4f4f5;
    font-size: 14px;
    color: #999;
    margin-bottom: 20px;
    > i {
      margin-right: 10px;
    }
  }
}
::v-deep .el-dialog__body {
  padding: 20px 60px;
}
</style>