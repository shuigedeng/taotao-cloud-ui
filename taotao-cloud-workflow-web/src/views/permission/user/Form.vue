<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main user-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? $t(`user.addUser`) : $t(`user.editUser`)" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            {{ $t('common.confirmButton') }}</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }} </el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px">
          <div class="JNPF-common-title mb-20">
            <h2 class="bold">基础信息</h2>
          </div>
          <el-row :gutter="20" class="custom-row">
            <el-col :sm="12" :xs="24">
              <el-form-item label="账户" prop="account">
                <el-input v-model="dataForm.account" placeholder="登录账号(电话号码)" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="dataForm.realName" placeholder="真实姓名" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="dataForm.gender" placeholder="选择性别">
                  <el-option v-for="item in genderTreeData" :key="item.enCode" :label="item.fullName"
                    :value="item.enCode" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="dataForm.email" placeholder="电子邮箱" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="单位名称" prop="organizeIdTree">
                <ComSelect v-model="dataForm.organizeIdTree" placeholder="选择单位名称" multiple @change="onOrganizeChange"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="直属主管" prop="managerId">
                <user-select v-model="dataForm.managerId" placeholder="选择直属主管" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item style="white-space: nowrap;" label="岗位、职务" prop="positionId">
                <el-select v-model="positionId" placeholder="选择岗位、职务" @change="onChange('positionId')"
                  @visible-change="visibleChange" multiple filterable clearable>
                  <el-option-group v-for="group in positionTreeData" :key="group.id"
                    :label="group.fullName + (group.num ? '【' + group.num + '】' : '')">
                    <el-option v-for="item in group.children" :key="group.id + item.id" :label="item.fullName"
                      :value="item.id">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="角色" prop="roleId">
                <el-select v-model="roleId" placeholder="选择角色" @change="onChange('roleId')"
                  @visible-change="visibleChange" multiple filterable clearable>
                  <el-option-group v-for="group in roleTreeData" :key="group.id"
                    :label="group.fullName + (group.num ? '【' + group.num + '】' : '')">
                    <el-option v-for="item in group.children" :key="group.id + item.id" :label="item.fullName"
                      :value="item.id">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="false">
              <el-form-item label="排序" prop="sortCode">
                <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号状态" prop="enabledMark">
                <el-select v-model="dataForm.enabledMark" placeholder="选择账号状态">
                  <el-option label="正常" :value="1" />
                  <el-option label="锁定" :value="2" />
                  <el-option label="禁用" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="说明" prop="description">
                <el-input v-model="dataForm.description" type="textarea" :rows="3" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="JNPF-common-title mb-20">
            <h2 class="bold">扩展信息</h2>
          </div>
          <el-row :gutter="20" class="custom-row">
            <el-col :span="24">
              <el-form-item label="头像" prop="headIcon">
                <el-upload class="avatar-uploader" :headers="uploadHeaders"
                  :action="define.comUploadUrl + '/userAvatar'" :show-file-list="false"
                  :on-success="handleAvatarSuccess" accept="image/*">
                  <img v-if="dataForm.headIcon" :src="define.comUrl + dataForm.headIcon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="民族" prop="nation">
                <!-- <el-select v-model="dataForm.nation" placeholder="选择民族" filterable>
                  <el-option v-for="item in nationTreeData" :key="item.id" :label="item.fullName"
                    :value="item.id" />
                </el-select> -->
                <el-input v-model="dataForm.nation" filterable placeholder="民族" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="籍贯" prop="nativePlace">
                <el-input v-model="dataForm.nativePlace" placeholder="籍贯" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="入职时间" prop="entryDate">
                <!-- <el-date-picker v-model="dataForm.entryDate" type="date" placeholder="选择入职时间" value-format="timestamp">
                </el-date-picker> -->
                <el-input v-model="dataForm.entryDate" filterable placeholder="入职时间" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="证件类型" prop="certificatesType">
                <!-- <el-select v-model="dataForm.certificatesType" placeholder="选择证件类型">
                  <el-option v-for="item in certificatesTypeTreeData" :key="item.id" :label="item.fullName"
                    :value="item.id" />
                </el-select> -->
                <el-input v-model="dataForm.certificatesType" filterable placeholder="证件类型" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="证件号码" prop="certificatesNumber">
                <el-input v-model="dataForm.certificatesNumber" placeholder="证件号码" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="文化程度" prop="education">
                <!-- <el-select v-model="dataForm.education" placeholder="选择文化程度">
                  <el-option v-for="item in educationTreeData" :key="item.id" :label="item.fullName" :value="item.id" />
                </el-select> -->
                <el-input v-model="dataForm.education" placeholder="文化程度" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24" v-show="false">
              <el-form-item label="出生年月" prop="birthday">
                <el-date-picker v-model="dataForm.birthday" type="date" placeholder="选择出生年月" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24" v-show="false">
              <el-form-item label="办公电话" prop="telePhone">
                <el-input v-model="dataForm.telePhone" placeholder="办公电话" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="固定电话" prop="landline">
                <el-input v-model="dataForm.landline" placeholder="固定电话" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="手机号码" prop="mobilePhone">
                <el-input v-model="dataForm.mobilePhone" placeholder="手机号码" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="紧急联系" prop="urgentContacts">
                <el-input v-model="dataForm.urgentContacts" placeholder="紧急联系人" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="紧急电话" prop="urgentTelePhone">
                <el-input v-model="dataForm.urgentTelePhone" placeholder="紧急联系人电话" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="通讯地址" prop="postalAddress">
                <el-input v-model="dataForm.postalAddress" type="textarea" :rows="3" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </transition>
</template>

<script>
import { getPositionByOrganize } from '@/api/permission/position'
import { getRoleByOrganize } from '@/api/permission/role'
import { getGroupSelector } from '@/api/permission/group'
import { createUser, updateUser, getUserInfo } from '@/api/permission/user'

export default {
  data() {
    return {
      visible: false,
      btnLoading: false,
      dataForm: {
        id: '',
        sortCode: 0,
        enabledMark: 1,
        account: '',
        realName: '',
        organizeId: '',
        organizeIdTree: [],
        managerId: '',
        positionId: '',
        roleId: '',
        groupId: '',
        description: '',
        headIcon: '',
        gender: null,
        nation: '',
        nativePlace: '',
        entryDate: null,
        certificatesType: '',
        certificatesNumber: '',
        education: '',
        birthday: null,
        telePhone: '',
        landline: '',
        mobilePhone: '',
        email: '',
        urgentContacts: '',
        urgentTelePhone: '',
        postalAddress: ''
      },
      roleId: [],
      groupId: [],
      positionId: [],
      positionTreeData: [],
      roleTreeData: [],
      groupTreeData: [],
      genderTreeData: [],
      nationTreeData: [],
      educationTreeData: [],
      certificatesTypeTreeData: [],
      uploadHeaders: { Authorization: this.$store.getters.token },
      formLoading: false,
      genderProps: {
        value: 'enCode',
        label: 'fullName'
      },
      dataRule: {
        account: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { validator: this.formValidate('userAccount', '账户名称只能是数字英文'), trigger: 'blur' },
          { max: 50, message: '账户名称最多为50个字符！', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { validator: this.formValidate('fullName', '真实姓名不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '真实姓名最多为50个字符！', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        organizeIdTree: [
          { required: true, message: '请选择单位名称', trigger: 'change', type: 'array' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.visible = true
      this.dataForm.id = id || ''
      this.roleId = []
      this.groupId = []
      this.positionId = []
      this.dataForm.organizeIdTree = []
      this.$nextTick(() => {
        this.formLoading = true
        this.$refs['dataForm'].resetFields()
        // 获取分组下拉列表
        getGroupSelector().then(res => {
          this.groupTreeData = res.data
        })
        // 获取民族
        this.$store.dispatch('base/getDictionaryData', { sort: 'Nation' }).then(res => {
          this.nationTreeData = res
          // 获取学历
          this.$store.dispatch('base/getDictionaryData', { sort: 'Education' }).then(res => {
            this.educationTreeData = res
          })
          // 获取证件类型
          this.$store.dispatch('base/getDictionaryData', { sort: 'certificateType' }).then(res => {
            this.certificatesTypeTreeData = res
          })
          // 获取性别
          this.$store.dispatch('base/getDictionaryData', { sort: 'sex' }).then(res => {
            let result = res.filter(item => {
              return item.fullName != "保密";
            })
            this.genderTreeData = result
          })
        })
        if (this.dataForm.id) {
          getUserInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            if (this.dataForm.roleId) this.roleId = this.dataForm.roleId.split(',')
            if (this.dataForm.groupId) this.groupId = this.dataForm.groupId.split(',')
            if (this.dataForm.positionId) this.positionId = this.dataForm.positionId.split(',')
            if (this.dataForm.organizeIdTree && this.dataForm.organizeIdTree.length) {
              this.getOptionsByOrgIds(this.dataForm.organizeIdTree)
            }
            this.formLoading = false
          }).catch(() => this.formLoading = false)
        } else {
          this.formLoading = false
        }
      })
    },
    goBack() {
      this.$emit('close')
    },
    onChange(key) {
      this.dataForm[key] = this[key].join()
    },
    onOrganizeChange(val) {
      this.dataForm.positionId = ''
      this.dataForm.roleId = ''
      this.dataForm.organizeId = ''
      this.positionId = []
      this.roleId = []
      if (!val || !val.length) return
      this.getOptionsByOrgIds(val)
    },
    getOptionsByOrgIds(organizeIdTree) {
      const organizeIds = organizeIdTree.map(o => o[o.length - 1])
      this.dataForm.organizeId = organizeIds.join()
      getPositionByOrganize(organizeIds).then(res => {
        this.positionTreeData = res.data.list.filter(o => o.children && Array.isArray(o.children) && o.children.length)
      })
      getRoleByOrganize(organizeIds).then(res => {
        this.roleTreeData = res.data.list.filter(o => o.children && Array.isArray(o.children) && o.children.length)
      })
    },
    visibleChange(val) {
      if (!val) return
      if (!this.dataForm.organizeIdTree || !this.dataForm.organizeIdTree.length) this.$message.warning('请先选择所属组织')
    },
    handleAvatarSuccess(res) {
      if (res.code === 200 && res.data && res.data.url) {
        this.dataForm.headIcon = res.data.url
      } else {
        this.$message.error('头像上传失败');
      }
    },
    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateUser : createUser
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-form {
  .main {
    padding: 10px 30px 0;
  }

  ::v-deep.el-select,
  ::v-deep.el-cascader,
  ::v-deep.el-date-editor {
    width: 100%;
  }

  ::v-deep.avatar-uploader {
    .el-upload {
      border: 1px dashed #dcdfe6;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .el-upload:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }

  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
}

.JNPF-common-layout {
  .JNPF-common-layout-left {
    width: 350px;
  }
}
</style>
