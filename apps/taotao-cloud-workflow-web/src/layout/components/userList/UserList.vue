<template>
  <div>
    <el-drawer title="内部聊天" :visible.sync="drawer" direction="rtl"
      class="contacts-drawer WORKFLOW-common-drawer" size="280px" :modal="true" :wrapperClosable="false"
      :before-close="handleClose" ref="drawer">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="消息" name="reply">
          <div class="userList replyList" v-loading="replyLoading && listQuery.currentPage==1">
            <div v-if="replyList.length">
              <div v-for="(item,i) in replyList" :key="i" class="userList-item"
                @click="readInfo(item,true)">
                <el-avatar :size="36" :src="define.comUrl+item.headIcon">
                </el-avatar>
                <div class="userList-txt">
                  <p class="title">
                    <span>{{item.realName}}/{{item.account}}</span>
                    <el-badge :value="item.unreadMessage" :hidden="!item.unreadMessage" />
                  </p>
                  <p class="name">
                    <span class="content">{{getMsgText(item.latestMessage,item.messageType)}}</span>
                    <span class="time">{{item.latestDate| toDateText()}}</span>
                  </p>
                </div>
                <!-- <el-badge :value="item.unreadMessage" :hidden="!item.unreadMessage"></el-badge> -->
              </div>
            </div>
            <p class="noData-txt" v-else>{{$t('common.noData')}}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="联系人" name="contacts">
          <el-input v-model="listQuery.keyword" placeholder="搜索：请输入关键词" clearable
            class="search-input">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search" title="搜索" />
          </el-input>
          <div class="userList" v-loading="loading && listQuery.currentPage==1" ref="userList">
            <div v-if="userList.length">
              <div v-for="(item,i) in userList" :key="i" class="userList-item"
                @click="readInfo(item)">
                <el-avatar :size="36" :src="define.comUrl+item.headIcon">
                </el-avatar>
                <div class="userList-txt">
                  <p class="title">{{item.realName}}/{{item.account}}</p>
                  <p class="name">
                    <span>{{item.department}}</span>
                  </p>
                </div>
              </div>
            </div>
            <p class="noData-txt" v-else>{{$t('common.noData')}}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <Im ref="WORKFLOWIm" append-to-body />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getImUser } from '@/api/permission/user'
import { getIMReply } from '@/api/system/message'
import Im from './Im'
export default {
  name: 'UserList',
  components: { Im },
  data() {
    return {
      drawer: false,
      activeTab: 'reply',
      userList: [],
      replyList: [],
      loading: false,
      replyLoading: false,
      visible: false,
      finish: false,
      listQuery: {
        keyword: '',
        currentPage: 1,
        pageSize: 20
      }
    }
  },
  created() { },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    activeTab(val) {
      if (val === 'contacts' && !this.userList.length) {
        this.getUserList()
      }
    }
  },
  methods: {
    init() {
      this.finish = false
      this.drawer = true
      this.listQuery.currentPage = 1
      this.listQuery.keyword = ''
      this.activeTab = 'reply'
      this.userList = []
      this.replyList = []
      this.getReplyList()
      this.$nextTick(() => {
        this.bindScroll()
      })
    },
    bindScroll() {
      let _this = this,
        vBody = _this.$refs.userList;
      vBody.addEventListener("scroll", function () {
        if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 300 && !_this.loading && !_this.finish) {
          _this.listQuery.currentPage += 1
          _this.getUserList()
        }
      });
    },
    getReplyList() {
      this.replyLoading = true
      getIMReply().then(res => {
        this.replyList = res.data.list
        this.replyLoading = false
      })
    },
    getUserList() {
      this.loading = true
      getImUser(this.listQuery).then(res => {
        if (res.data.list.length < this.listQuery.pageSize) this.finish = true
        this.userList = [...this.userList, ...res.data.list]
        this.loading = false
      })
    },
    search() {
      this.userList = []
      this.finish = false
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.getUserList()
    },
    updateReply(data, isAdd) {
      let boo = false
      const len = this.replyList.length
      for (let i = 0; i < len; i++) {
        if (data.formUserId === this.replyList[i].id) {
          if (isAdd) this.replyList[i].unreadMessage += 1
          this.replyList[i].latestMessage = data.formMessage
          this.replyList[i].messageType = data.messageType
          this.replyList[i].latestDate = data.latestDate
          boo = true
          break
        }
      }
      if (boo) return
      if (isAdd) data.unreadMessage = 1
      data.latestMessage = data.formMessage
      data.id = data.formUserId
      this.replyList.unshift(data)
    },
    updateLatestMessage(data) {
      let boo = false
      const len = this.replyList.length
      for (let i = 0; i < len; i++) {
        if (data.toUserId === this.replyList[i].id) {
          this.replyList[i].latestMessage = data.toMessage
          this.replyList[i].messageType = data.messageType
          this.replyList[i].latestDate = data.latestDate
          boo = true
          break
        }
      }
      if (boo) return
      const item = {
        account: data.toAccount,
        headIcon: data.toHeadIcon,
        id: data.toUserId,
        latestDate: data.latestDate,
        latestMessage: data.toMessage,
        messageType: data.messageType,
        realName: data.toRealName,
        unreadMessage: 0
      }
      this.replyList.unshift(item)
    },
    toggleBlink() {
      const boo = this.replyList.some(o => o.unreadMessage)
      this.$emit('changeTwinkle', boo)
    },
    readInfo(item, isReply) {
      let socket = this.$store.getters.socket
      let updateReadMessage = {
        method: "UpdateReadMessage",
        formUserId: item.id,
        token: this.$store.getters.token
      }
      socket.send(JSON.stringify(updateReadMessage));
      if (isReply) {
        item.unreadMessage = 0
      } else {
        for (let i = 0; i < this.replyList.length; i++) {
          if (item.id === this.replyList[i].id) {
            this.replyList[i].unreadMessage = 0
            break
          }
        }
      }
      this.toggleBlink()
      this.$refs.WORKFLOWIm.list = []
      //获取消息列表
      var messageList = {
        method: "MessageList",
        toUserId: item.id,
        formUserId: this.userInfo.userId,
        token: this.$store.getters.token,
        currentPage: 1,
        pageSize: 30,
        sord: "desc"
      }
      socket.send(JSON.stringify(messageList));
      this.$refs.WORKFLOWIm.init(item)
    },
    getMsgText(text, type) {
      let message = ''
      switch (type) {
        case 'voice':
          message = '[语音]'
          break;
        case 'image':
          message = '[图片]'
          break;
        default:
          message = text
          break;
      }
      return message
    },
    handleClose(done) {
      this.$refs.WORKFLOWIm.closeIM()
      let vBody = this.$refs.userList;
      vBody.removeEventListener("scroll", function () { });
      done();
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts-drawer {
  ::v-deep .el-tabs {
    height: 100%;
    .el-tabs__header {
      margin-bottom: 0 !important;
    }

    .el-tabs__item {
      width: 50%;
      text-align: center;
      color: #303133 !important;
    }

    .el-tabs__nav {
      width: 100%;
    }
    .el-tabs__content {
      height: calc(100% - 40px);
    }
    .el-tab-pane {
      height: 100%;
      overflow: hidden;
    }
  }
  .noData-txt {
    font-size: 14px;
    color: #909399;
    line-height: 20px;
    text-align: center;
    padding-top: 20px;
  }
  .search-input {
    ::v-deep .el-input__inner {
      border-radius: 0;
      border-right: none;
      border-left: none;
      border-top: none;
    }
    .el-input__icon {
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    }
  }
  ::v-deep .el-drawer__header {
    border: none;
  }
  ::v-deep .el-drawer__body {
    overflow: hidden;
    .userList {
      overflow: auto;
      overflow-x: hidden;
      position: relative;
      height: calc(100% - 32px);
      &.replyList {
        height: 100%;
        .title {
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 20px;
        }
      }
      .el-badge {
        margin-top: 10px;
      }
      ::v-deep .el-loading-mask {
        top: 100px;
      }
    }
    .userList-item {
      position: relative;
      display: block;
      padding: 0 20px;
      background-color: #fff;
      border-bottom: 1px solid #f5f7f9;
      height: 60px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .offLine {
        filter: grayscale(1);
      }
      &:hover {
        background-color: #f5f7f9;
      }
      .userList-txt {
        margin-left: 14px;
        overflow: hidden;
        flex: 1;
        padding-top: 1px;
        .title {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
          line-height: 20px;
        }
        .name {
          font-size: 12px;
          color: #999;
          .content {
            display: inline-block;
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .time {
            float: right;
          }
        }
      }
    }
  }
}
</style>
