<template>
  <div class="WORKFLOW-common-layout">
    <div class="WORKFLOW-common-layout-center banner">
      <div class="banner-tips">
        <h3>banner图设置</h3>
        <p>
          最多支持配置4张banner图,图片仅限png、jpg、jpeg格式，尺寸
          <span class="blue">750px*380</span> px,大小
          <span class="blue">3M</span> 以内
        </p>
      </div>
      <div class="WORKFLOW-common-layout-main WORKFLOW-flex-main">
        <div class="banner-con">
          <div class="banner-con-list" v-loading="listLoading">
            <div v-for="(item, index) in list" :key="index">
              <el-card class="banner-con-item" v-if="index < list.length - 1">
                <div class="warp">
                  <div class="img-box">
                    <img :src="define.comUrl + item.url" alt="" />
                    <div class="cover">
                      <div class="cover-ctr">
                        <a href="javascript:;" @click="changePic(item, index)">
                          <i class="el-icon-edit-outline"></i>
                        </a>
                        <a
                          href="javascript:;"
                          @click="delBannerById(item)"
                          v-show="list.length > 2"
                        >
                          <i class="el-icon-delete"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="fun-bar">
                    <div class="notice" v-if="item.messageId">
                      <p>{{ item.messageName }}</p>
                      <div class="notice-ctr">
                        <i
                          class="el-icon-edit-outline"
                          @click="bindNotice(item)"
                        ></i>
                        <i class="el-icon-delete" @click="delNotice(item)"></i>
                      </div>
                    </div>
                    <div class="bind" v-else>
                      <el-button type="primary" @click="bindNotice(item)"
                        >关联公告</el-button
                      >
                    </div>
                  </div>
                </div>
              </el-card>
              <el-card
                v-else-if="list.length <= 4"
                class="banner-con-item add"
                shadow="hover"
              >
                <div class="add-ctr">
                  <el-button type="primary" @click="addBanner">
                    + 上传图片</el-button
                  >
                </div>
              </el-card>
            </div>
          </div>
          <div class="banner-upload" v-show="false">
            <single-img
              v-model="pic"
              ref="uploadBox"
              @input="imgURl"
              tip=""
              :uploadStatus.sync="listLoading"
            />
          </div>
        </div>
      </div>
    </div>
    <add-bind ref="addBind" @getList="initData"></add-bind>
  </div>
</template>
<script>
import {
  getBannerList,
  addOrUpdateBanner,
  delBanner,
} from "@/api/system/banner";
import singleImg from "./components/UploadImg";
import addBind from "./components/addBind";
export default {
  name: "system-notice",
  components: { singleImg, addBind },
  data() {
    return {
      list: [],
      total: 0,
      btnLoading: false,
      listLoading: false,
      currentIndex: -1,
      currentData: {},

      formVisible: false,
      viewVisible: false,
      pic: "",
      baseForm: [
        {
          id: "123123123",
          form: {},
        },
      ],
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    changePic(data, index) {
      this.currentIndex = index;
      this.currentData = data;
      this.$refs.uploadBox.uploadClick();
    },
    delBannerById(data) {
      let id = data.id;
      this.$confirm(`确认删除该图片`, "")
        .then(() => {
          console.log(
            "🚀 ~ file: index.vue ~ line 104 ~ this.$confirm ~ this.$confirm",
            id
          );
          this.deleteBanner(id);
        })
        .catch(() => {});
    },
    addBanner() {
      this.currentData = {
        id: "",
        messageId: "",
        messageName: "",
        url: "",
      };
      this.$refs.uploadBox.uploadClick();
    },
    delNotice(data) {
      this.currentData = data;
      this.$confirm(`确认解绑该公告`, "")
        .then(() => {
          let params = {
            banners: [
              {
                id: this.currentData.id,
                messageId: "",
                messageName: "",
                url: this.currentData.url,
              },
            ],
          };
          this.addOrUpdateBanner(params);
        })
        .catch(() => {});
    },
    initData() {
      this.listLoading = true;
      getBannerList()
        .then((res) => {
          let data = res.data;
          this.list = data;
          this.list.push({
            type: "add",
          });
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    addOrUpdateBanner(params) {
      this.listLoading = true;
      addOrUpdateBanner(params)
        .then((res) => {
          this.listLoading = false;
          this.initData();
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    deleteBanner(id) {
      this.listLoading = true;
      let params = {
        id: id,
      };
      delBanner(params)
        .then((res) => {
          // this.listLoading = false;
          this.initData();
        })
        .catch(() => {
          // this.listLoading = false;
        });
    },
    bindNotice(data) {
      this.$refs.addBind.openDialog(data);
    },
    imgURl(val) {
      let params = {
        banners: [
          {
            id: this.currentData.id,
            messageId: this.currentData.messageId,
            messageName: this.currentData.messageName,
            url: val,
          },
        ],
      };
      this.addOrUpdateBanner(params);
    },
  },
};
</script>

<style scoped lang="scss">
.banner {
  padding: 14px 10px;
  background-color: #fff;

  &-tips {
    padding: 0 20px;

    h3 {
      position: relative;
      font-size: 16px;
      height: 28px;
      line-height: 28px;
      margin-bottom: 5px;
      text-indent: 15px;
      &::after {
        display: block;
        content: " ";
        position: absolute;
        top: 4px;
        left: 0;
        width: 5px;
        height: 12px;
        background-color: #1890ff;
      }
    }
    > p {
      line-height: 18px;
      font-size: 12px;
      color: #666;
      text-indent: 15px;
      .blue {
        color: #1890ff;
      }
    }
  }
  &-con {
    .el-col {
      margin-bottom: 20px;
    }
    &-list {
      padding: 2px 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    &-item {
      position: relative;

      .el-col {
        width: 390px;
        height: 236px;
      }
      .add-ctr {
        padding-top: 100px;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
      .warp {
        .img-box {
          position: relative;
          width: 390px;
          height: 196px;
          &:hover {
            .cover {
              display: block;
            }
          }
          > img {
            display: block;
            width: 100%;
            height: 100%;
          }
          .cover {
            display: none;
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgba(0, 0, 0, 0.6);
            width: 100%;
            height: 236px;
            &-ctr {
              display: flex;
              flex-direction: row;
              padding-top: 96px;
              justify-content: center;
              > a {
                margin: 0 15px;
                display: block;
                width: 44px;
                height: 44px;
                line-height: 44px;
                border-radius: 44px;
                background-color: #7e7e7e;
                text-align: center;
                font-size: 20px;
                color: #fff;
                &:hover {
                  background-color: #1890ff;
                }
              }
            }
          }
        }
        .fun-bar {
          padding: 0 10px;
          .notice {
            display: flex;
            flex-direction: row;
            height: 40px;
            line-height: 40px;
            font-size: 12px;
            color: #333;
            justify-content: space-between;
            > p {
              width: 300px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &-ctr {
              font-size: 16px;
              i {
                cursor: pointer;
                &:nth-child(1) {
                  margin-right: 16px;
                }
                &:hover {
                  color: #1890ff;
                }
              }
            }
          }
          .bind {
            padding-top: 4px;
          }
        }
      }
    }
  }
}
::v-deep .el-card {
  margin: 10px;
  border-radius: 5px;
  box-sizing: border-box;
  &.is-hover-shadow {
    border: 2px dashed #ebeef5;
  }
  &__body {
    padding: 0;
    width: 390px;
    height: 236px;
  }
}
</style>
