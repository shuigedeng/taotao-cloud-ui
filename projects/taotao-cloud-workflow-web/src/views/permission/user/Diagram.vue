<template>
  <transition name="el-zoom-in-center">
    <div class="WORKFLOW-preview-main user-form">
      <div class="WORKFLOW-common-page-header">
        <el-page-header @back="goBack" content="组织架构图" />
        <div class="options">
          <el-button @click="goBack">{{$t('common.cancelButton')}} </el-button>
        </div>
      </div>
      <div class="main" v-loading="loading">
        <organization-chart :datasource="ds"></organization-chart>
      </div>
    </div>
  </transition>
</template>

<script>
import { getDepartmentSelector } from '@/api/permission/department'
import OrganizationChart from 'vue-organization-chart'
import 'vue-organization-chart/dist/orgchart.css'

export default {
  components: {
    OrganizationChart
  },
  data() {
    return {
      loading: false,
      ds: {}
    }
  },
  methods: {
    init() {
      this.loading = true
      getDepartmentSelector().then(res => {
        let data = res.data.list
        let _this = this
        const loop = list => {
          for (let i = 0; i < list.length; i++) {
            _this.$set(list[i], 'name', list[i].fullName)
            if (list[i].children && Array.isArray(list[i].children) && list[i].children.length) {
              loop(list[i].children)
            }
          }
        }
        loop(data)
        this.$nextTick(() => {
          if (data.length >= 1) {
            data = {
              name: '组织架构图',
              children: data
            }
          }
          this.ds = data
          this.loading = false
        })
      }).catch(() => { this.loading = false })
    },
    goBack() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding-bottom: 0;
  overflow: hidden;
}
::v-deep .orgchart-container {
  height: 100%;
  border: none !important;
  padding: 0;
  width: 100%;
  .orgchart {
    background: none !important;
    padding: 0;
    .node {
      &:hover {
        background-color: transparent !important;
      }
      .title {
        background-color: #1890ff;
      }
      .content {
        border: 1px solid #1890ff;
      }
    }
  }
  .orgchart .lines {
    .rightLine {
      border-right: 1px solid #1890ff;
    }
    .leftLine {
      border-left: 1px solid #1890ff;
    }
    .topLine {
      border-top: 2px solid #1890ff;
    }
    .downLine {
      background-color: #1890ff;
    }
  }
}
</style>
