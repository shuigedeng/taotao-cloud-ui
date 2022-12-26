<template>
  <div class="app-container Profile-container">
    <el-tabs tab-position="left" style="height:100%" v-model="activeTab" class="profile-tabs">
      <el-tab-pane label="个人资料" name="user">
        <UserInfo ref="user" :user='user' v-if="visible.user" />
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="password">
        <Password ref="password" v-if="visible.password" />
      </el-tab-pane>
      <el-tab-pane disabled name="line"></el-tab-pane>
      <el-tab-pane label="我的下属" name="subordinate">
        <div class="JNPF-common-title mb-10">
          <h2 class="bold">我的下属</h2>
        </div>
        <div class="subordinate-list">
          <el-tree :data="treeData" :props="props" check-on-click-node node-key="id" lazy
            v-loading="loading" :load="loadNode" class="JNPF-common-el-tree subordinate-tree">
            <el-card class="subordinate-tree-node" shadow="never" slot-scope="{ data }">
              <el-avatar :size="50" :src="define.comUrl+ data.avatar"></el-avatar>
              <div class="text">
                <p>{{data.userName}}</p>
                <p>{{data.department}}{{data.position?'/'+data.position:''}}</p>
              </div>
            </el-card>
          </el-tree>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的组织" name="organize">
        <div class="JNPF-common-title mb-10">
          <h2 class="bold">我的组织
            <el-tooltip content="用户可以自行切换组织信息，我的组织默认只能进行单选" placement="right">
              <a class="el-icon-warning-outline"></a>
            </el-tooltip>
          </h2>
        </div>
        <div class="organize-list">
          <el-row :gutter="80" v-if="organizeList.length">
            <el-col :span="12" class="organize-item" v-for="(item,i) in organizeList" :key="i">
              <div class="organize-item-main" :class="{active:activeOrganize===item.id}"
                @click="changeMajor(item.id,'Organize')">
                <i class="icon-ym icon-ym-organization"></i>
                <p class="organize-name">{{item.fullName}}</p>
                <p class="btn">默认</p>
                <div class="icon-checked">
                  <i class="el-icon-check"></i>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-empty description="暂无数据" :image-size="120" v-else></el-empty>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的岗位" name="position">
        <div class="JNPF-common-title mb-10">
          <h2 class="bold">我的岗位
            <el-tooltip content="用户可以自行切换我的组织内的岗位信息，我的岗位默认只能进行单选" placement="right">
              <a class="el-icon-warning-outline"></a>
            </el-tooltip>
          </h2>
        </div>
        <div class="organize-list">
          <el-row :gutter="80" v-if="positionList.length">
            <el-col :span="12" class="organize-item" v-for="(item,i) in positionList" :key="i">
              <div class="organize-item-main" :class="{active:activePosition===item.id}"
                @click="changeMajor(item.id,'Position')">
                <i class="icon-ym icon-ym-wf-outgoingApply"></i>
                <p class="organize-name">{{item.fullName}}</p>
                <p class="btn">主岗</p>
                <div class="icon-checked">
                  <i class="el-icon-check"></i>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-empty description="暂无数据" :image-size="120" v-else></el-empty>
        </div>
      </el-tab-pane>
      <el-tab-pane label="系统权限" name="authorize" class="el-tab-pane-authorize">
        <Authorize ref="authorize" v-if="visible.authorize" />
      </el-tab-pane>
      <el-tab-pane label="系统日志" name="sysLog">
        <SysLog ref="sysLog" v-if="visible.sysLog" />
      </el-tab-pane>
    </el-tabs>
    <div class="head">
      <el-upload class="avatar-uploader" :action="define.comUploadUrl+'/userAvatar'"
        :headers="uploadHeaders" :on-success="handleSuccess" :show-file-list="false"
        accept="image/*">
        <div class="avatar-box">
          <el-avatar :size="50" :src="define.comUrl + user.avatar" class="avatar"
            v-if="user.avatar" />
          <div class="avatar-hover">更换头像</div>
        </div>
      </el-upload>
      <span class="username">{{user.realName}}</span>
    </div>
  </div>
</template>

<script>
import { UserSettingInfo, getSubordinate, UpdateAvatar, UpdateLanguage, getUserOrganizes, getUserPositions, setMajor } from '@/api/permission/userSetting'
import UserInfo from './components/UserInfo'
import Password from './components/Password'
import Authorize from './components/Authorize'
import SysLog from './components/SysLog'

export default {
  name: 'profile',
  components: { UserInfo, Password, Authorize, SysLog },
  data() {
    return {
      user: {},
      treeData: [],
      activeTab: '',
      organizeList: [],
      positionList: [],
      activeOrganize: '',
      activePosition: '',
      visible: {
        user: true,
        password: false,
        theme: false,
        authorize: false,
        sysLog: false,
      },
      props: {
        children: 'children',
        label: 'userName',
        isLeaf: 'isLeaf'
      },
      loading: false,
      nodeId: '0',
      uploadHeaders: { Authorization: this.$store.getters.token }
    }
  },
  watch: {
    activeTab(val) {
      for (let key of Object.keys(this.visible)) {
        this.visible[key] = false
      }
      this.visible[val] = true
      if (val === 'subordinate') {
        this.nodeId = '0'
        this.getSubordinate()
        return
      }
      if (val === 'organize') {
        this.getUserOrganizes()
        return
      }
      if (val === 'position') {
        this.getUserPositions()
        return
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      UserSettingInfo().then(res => {
        this.user = res.data
        this.activeTab = 'user'
      })
    },
    getSubordinate() {
      this.loading = true
      getSubordinate(this.nodeId).then(res => {
        this.treeData = res.data
        this.loading = false
      })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.nodeId = '0'
        return resolve(this.treeData)
      }
      this.nodeId = node.data.id
      getSubordinate(this.nodeId).then(res => {
        resolve(res.data)
      })
    },
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.updateAvatar(res.data)
      } else {
        this.$message({
          message: '上传失败',
          type: 'error',
          duration: 1000,
        })
      }
    },
    updateAvatar(data) {
      UpdateAvatar(data.name).then(res => {
        this.user.avatar = data.url
        this.$store.commit('user/SET_USERINFO_HEADICON', data.url)
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1000,
        })
      })
    },
    getUserOrganizes() {
      getUserOrganizes().then(res => {
        this.organizeList = res.data || []
        const list = this.organizeList.filter(o => o.isDefault)
        if (!list.length) return this.activeOrganize = ''
        const activeItem = list[0]
        this.activeOrganize = activeItem.id
      })
    },
    getUserPositions() {
      getUserPositions().then(res => {
        this.positionList = res.data || []
        const list = this.positionList.filter(o => o.isDefault)
        if (!list.length) return this.activePosition = ''
        const activeItem = list[0]
        this.activePosition = activeItem.id
      })
    },
    changeMajor(majorId, majorType) {
      if (this['active' + majorType] === majorId) return
      let query = {
        majorId,
        majorType
      }
      setMajor(query).then(res => {
        this['active' + majorType] = majorId
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose() {
            location.reload()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.Profile-container {
  position: relative;
  padding-top: 10px;
  .profile-tabs {
    ::v-deep .el-tabs__nav-scroll {
      padding-top: 70px;
    }
    ::v-deep .el-tabs__item {
      text-align: left !important;
    }
    ::v-deep .el-tabs__content {
      height: 100%;
      .el-tab-pane {
        height: 100%;
        overflow: auto;
        overflow-x: hidden;

        &.el-tab-pane-authorize {
          overflow: hidden;
        }
      }
    }
    ::v-deep #tab-line {
      height: 20px;
      width: 160px;
      &::after {
        position: absolute;
        width: 100%;
        height: 1px;
        background: #ddd;
        content: '';
        display: block;
        overflow: hidden;
        top: 10px;
        left: 0;
      }
    }
  }
  .head {
    position: absolute;
    left: 10px;
    top: 10px;
    height: 70px;
    width: 160px;
    padding-top: 10px;
    ::v-deep .avatar-uploader {
      display: inline-block;
      vertical-align: top;
      .avatar-hover {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 12px;
        display: none;
        overflow: hidden;
        width: 50px;
        height: 50px;
        text-align: center;
        border-radius: 50%;
        line-height: 50px;
        color: #fff;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.5);
      }
      &:hover {
        & .avatar-hover {
          display: block;
        }
      }
    }
    .avatar-box {
      position: relative;
    }
    .avatar {
      display: inline-block;
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 50%;
      vertical-align: top;
      margin-right: 10px;
    }
    .username {
      line-height: 50px;
      font-size: 12px;
    }
  }

  ::v-deep .el-select,
  ::v-deep .el-date-editor {
    width: 100%;
  }
  .subordinate-tree {
    height: 100%;
    margin: 0;
    .subordinate-tree-node {
      width: 260px;
    }
    ::v-deep .el-tree-node:focus > .el-tree-node__content {
      background-color: #fff;
    }
    ::v-deep .el-tree-node__expand-icon.el-icon-caret-right {
      font-size: 20px;
    }
    ::v-deep .el-tree-node__content {
      height: 80px;
      &:hover {
        background: #fff;
      }
    }
    ::v-deep .el-card__body {
      display: flex;
      padding: 10px 10px;
      align-items: center;
      .el-avatar {
        margin-right: 10px;
        flex-shrink: 0;
      }

      .text {
        font-size: 14px;
        width: calc(100% - 60px);
        p {
          line-height: 25px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
      }
    }
  }
  #pane-subordinate {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .subordinate-list {
      flex: 1;
      overflow: auto;
    }
  }
  .organize-list {
    width: 100%;
    padding: 50px;
    .organize-item {
      margin-bottom: 30px;
      .organize-item-main {
        height: 70px;
        position: relative;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        display: flex;
        align-items: center;
        padding: 0 20px;
        cursor: pointer;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
        color: #606266;
        &.active {
          border: 1px solid #1890ff;
          box-shadow: 0 0 6px rgba(6, 58, 108, 0.26);
          color: #1890ff;
          .btn,
          .icon-checked {
            display: block;
          }
        }
        .icon-ym {
          font-size: 24px;
          margin-right: 10px;
        }
        .organize-name {
          line-height: 24px;
          font-size: 14px;
        }
        .btn {
          display: none;
          position: absolute;
          right: 45px;
          bottom: 7px;
          font-size: 12px;
        }
        .icon-checked {
          display: none;
          width: 20px;
          height: 20px;
          border: 20px solid #1890ff;
          border-left: 20px solid transparent;
          border-top: 20px solid transparent;
          border-bottom-right-radius: 2px;
          position: absolute;
          transform: scale(0.9);
          right: -2px;
          bottom: -2px;
          i {
            position: absolute;
            top: -2px;
            left: -3px;
            font-size: 20px;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>