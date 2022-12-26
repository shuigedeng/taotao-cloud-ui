<template>
  <el-dialog :title="!dataForm.id ? '新建连接' : '编辑连接'" :close-on-click-modal="false"
    :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px">
      <el-form-item label="连接驱动" prop="dbType">
        <el-select v-model="dataForm.dbType" placeholder="请选择" :disabled='!!dataForm.id'
          @change='handleChange'>
          <el-option v-for="item in dbOptions" :key="item.enCode" :label="item.fullName"
            :value="item.enCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="连接名称" prop="fullName">
        <el-input v-model="dataForm.fullName" placeholder="连接名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="主机地址" prop="host">
        <el-input v-model="dataForm.host" placeholder="主机地址" />
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model.number="dataForm.port" placeholder="端口" />
      </el-form-item>
      <el-form-item label="用户" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="用户" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" placeholder="密码" />
      </el-form-item>
      <!-- ==============不同数据库之间差异的部分================ -->
      <template v-if="dataForm.dbType==='MySQL'">
        <el-form-item label="库名" prop="serviceName">
          <el-input v-model="dataForm.serviceName" placeholder="库名">
            <el-button slot="append" @click="test" :loading="testLoad">测试连接</el-button>
          </el-input>
        </el-form-item>
      </template>
      <template
        v-if="dataForm.dbType==='SQLServer'||dataForm.dbType==='PostgreSQL'||dataForm.dbType==='KingbaseES'">
        <el-form-item label="库名" prop="serviceName">
          <el-input v-model="dataForm.serviceName" placeholder="库名"></el-input>
        </el-form-item>
        <el-form-item label="模式" prop="dbSchema">
          <el-input v-model="dataForm.dbSchema" :disabled="true"
            v-if="dataForm.dbType==='SQLServer'||dataForm.dbType==='PostgreSQL'">
            <el-button slot="append" @click="test" :loading="testLoad">测试连接</el-button>
          </el-input>
          <el-input v-model="dataForm.dbSchema" v-if="dataForm.dbType==='KingbaseES'">
            <el-button slot="append" @click="test" :loading="testLoad">测试连接</el-button>
          </el-input>
        </el-form-item>
      </template>
      <template v-if="dataForm.dbType==='Oracle'||dataForm.dbType==='DM8'">
        <el-form-item label="模式" prop="dbSchema">
          <el-input v-model="dataForm.dbSchema" :disabled="true" placeholder="与用户同名">
            <el-button slot="append" @click="test" :loading="testLoad">测试连接</el-button>
          </el-input>
        </el-form-item>
      </template>
      <template v-if="dataForm.dbType==='Oracle'">
        <el-form-item label="更多" prop="oracleExtend">
          <el-switch v-model="dataForm.oracleExtend"></el-switch>
        </el-form-item>
        <template v-if="dataForm.oracleExtend">
          <el-form-item label="连接方式" prop="oracleLinkType">
            <el-select v-model="dataForm.oracleLinkType" placeholder="请选择">
              <el-option label="SERVICE" value="SERVICE"></el-option>
              <el-option label="SID" value="SID"></el-option>
              <el-option label="SCHEMA" value="SCHEMA"></el-option>
              <el-option label="TNS" value="TNS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="oracleRole">
            <el-select v-model="dataForm.oracleRole" placeholder="请选择">
              <el-option label="Default" value="Default"></el-option>
              <el-option label="SYSDBA" value="SYSDBA"></el-option>
              <el-option label="SYSOPER" value="SYSOPER"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务名" prop="oracleService">
            <el-input v-model="dataForm.oracleService" placeholder="服务名"></el-input>
          </el-form-item>
        </template>
      </template>
      <!-- 暂时停用表空间，表空间是物理层分类一般不做操作（类似，静态资源放哪里，而用户只需要关心它展示端在哪个分类里，
            而不用关心实际它存储在哪里，navicat与数据库自带操作工具，也并没有指定表空间。），逻辑分类用模式。 -->
      <!--<el-form-item label="表空间" prop="tableSpace"
        v-if="dataForm.dbType==='DM8'||dataForm.dbType==='Oracle'">
        <el-input v-model="dataForm.tableSpace" placeholder="表空间">
          <el-button slot="append" @click="test" :loading="testLoad">测试连接</el-button>
        </el-input>
      </el-form-item>-->
      <el-form-item label="排序" prop="sortCode">
        <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode"
          controls-position="right" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
        {{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { DataSourceInfo, DataSourceUpdate, DataSourceCreate, TestDbConnection } from '@/api/systemData/dataSource'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        dbType: '',
        id: 0,
        fullName: '',
        host: '',
        port: '',
        userName: '',
        password: '',
        serviceName: '',
        dbSchema: '',
        tableSpace: '',
        sortCode: 0,
        enabledMark: 1,
        oracleExtend: false,
        oracleLinkType: '',
        oracleService: '',
        oracleRole: ''
      },
      dataRule: {
        dbType: [
          { required: true, message: '连接驱动不能为空', trigger: 'change' }
        ],
        fullName: [
          { required: true, message: '应用名称不能为空', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '主机地址不能为空', trigger: 'blur' },
        ],
        port: [
          { required: true, message: '端口不能为空', trigger: 'blur' },
          { pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: '请输入正确的端口号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '用户不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        serviceName: [
          { required: true, message: '库名不能为空', trigger: 'blur' }
        ],
        tableSpace: [
          { required: true, message: '表空间不能为空', trigger: 'blur' }
        ]
      },
      dbOptions: [],
      btnLoading: false,
      testLoad: false
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        const res = await this.$store.dispatch('base/getDictionaryData', { sort: 'dbType' })
        this.dbOptions = JSON.parse(JSON.stringify(res))
        if (this.dataForm.id) {
          DataSourceInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
          })
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? DataSourceUpdate : DataSourceCreate
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => { this.btnLoading = false })
        }
      })
    },
    handleChange(val) {
      let port = ''
      let dbSchema = ''
      switch (val) {
        case 'SQLServer':
          port = '1433'
          dbSchema = 'dbo'
          break;
        case 'MySQL':
          port = '3306'
          break;
        case 'Oracle':
          port = '1521'
          break;
        case 'DM8':
          port = '5236'
          break;
        case 'KingbaseES':
          port = '54321'
          dbSchema = 'public'
          break;
        case 'PostgreSQL':
          port = '5432'
          dbSchema = 'public'
          break;
        default:
          port = ''
          break;
      }
      this.dataForm.serviceName = '';
      this.dataForm.port = port
      this.dataForm.dbSchema = dbSchema
    },
    test() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.testLoad = true
          TestDbConnection(this.dataForm).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1500
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1500
              })
            }
            this.testLoad = false
          }).catch(() => {
            this.testLoad = false
          })
        }
      })
    }
  }
}
</script>
