<template>
  <span>
    <el-tooltip :content="$t('common.columnSettings')" placement="top">
      <el-link icon="icon-ym icon-ym-options JNPF-common-head-icon" :underline="false"
        @click="showDrawer" />
    </el-tooltip>
    <el-drawer title="列表显示设置" :visible.sync="drawerVisible" :wrapperClosable="false" size="320px"
      append-to-body class="JNPF-common-drawer columnSettings-drawer">
      <div class="JNPF-flex-main">
        <div class="columnSetting-head">
          <span>表头设置</span>
          <el-link type="primary" :underline="false" @click="reset()">恢复默认</el-link>
        </div>
        <el-scrollbar class="column-list" v-loading="loading">
          <template v-if="list.length">
            <draggable :list="list" :animation="340" handle=".column-item-icon" @end="setColumn">
              <div class="column-item" v-for="item in list" :key="item.prop">
                <div class="column-item-label">
                  <i class="icon-ym icon-ym-darg column-item-icon"></i>
                  <span>{{item.label}}</span>
                </div>
                <el-switch v-model="item.visible" size="small" @change="setColumn" />
              </div>
            </draggable>
          </template>
          <el-empty description="暂无数据" :image-size="120" v-else></el-empty>
        </el-scrollbar>
      </div>
    </el-drawer>
  </span>
</template>

<script>
import draggable from 'vuedraggable'
import { setColumnsByModuleId } from '@/api/common'
export default {
  name: 'ColumnSettings',
  components: { draggable },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      drawerVisible: false,
      defaultList: [],
      list: []
    }
  },
  computed: {
    currMenuId() {
      return this.$route.meta.modelId || ''
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          this.list = JSON.parse(JSON.stringify(val))
          this.defaultList = JSON.parse(JSON.stringify(val))
        } else {
          this.list = []
          this.defaultList = []
        }
      },
      deep: true
    }
  },
  mounted() {
    this.list = this.value || []
  },
  methods: {
    showDrawer() {
      this.drawerVisible = true
    },
    reset() {
      this.list = this.list.map(o => ({ ...o, visible: true }))
      this.setColumn()
    },
    setColumn() {
      this.loading = true
      const query = {
        moduleId: this.currMenuId,
        fieldList: JSON.stringify(this.list)
      }
      setColumnsByModuleId(query).then(res => {
        this.$emit('change', this.list)
        this.loading = false
      }).catch(() => {
        this.list = JSON.parse(JSON.stringify(this.defaultList))
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.columnSettings-drawer {
  .JNPF-flex-main {
    overflow: hidden;
  }
  .columnSetting-head {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 14px;
    color: #303133;
  }
  .column-list {
    height: calc(100% - 46px);
    padding: 0 2px;
    .column-item {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 22px 0 0;
      font-size: 14px;
      color: #303133;
      cursor: pointer;
      &:hover {
        background: #f2f4f6;
      }
      &.sortable-chosen {
        border: 1px dashed #1890ff;
      }
      .column-item-icon {
        width: 14px;
        margin-right: 8px;
        color: #909399;
        cursor: move;
        font-size: 20px;
      }
      .el-switch {
        transform: scale(0.8);
      }
      .column-item-label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>