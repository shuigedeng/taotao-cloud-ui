<template>
  <el-row>
    <el-form-item label="控件栅格">
      <el-slider v-model="activeData.__config__.span" :max="24" :min="6" show-stops :step="2"
        show-tooltip />
    </el-form-item>
    <el-form-item label="风格类型">
      <el-radio-group v-model="activeData.type">
        <el-radio-button label="">默认</el-radio-button>
        <el-radio-button label="card">选项卡</el-radio-button>
        <el-radio-button label="border-card">卡片化</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="选项卡位置">
      <el-radio-group v-model="activeData['tab-position']">
        <el-radio-button label="top">顶部</el-radio-button>
        <el-radio-button label="left">左侧</el-radio-button>
        <el-radio-button label="right">右侧</el-radio-button>
        <el-radio-button label="bottom">底部</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-divider>标签页配置</el-divider>
    <draggable :list="activeData.__config__.children" :animation="340" group="selectItem"
      handle=".option-drag">
      <div v-for="(item, index) in activeData.__config__.children" :key="index" class="select-item">
        <div class="select-line-icon option-drag">
          <i class="icon-ym icon-ym-darg" />
        </div>
        <el-input v-model="item.title" placeholder="标签名称" size="small" />
        <div class="close-btn select-line-icon" @click="delItem(index,item)">
          <i class="el-icon-remove-outline" />
        </div>
      </div>
    </draggable>
    <div style="margin-left: 29px;">
      <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
        @click="addItem">
        添加标签页
      </el-button>
    </div>
  </el-row>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  props: ['activeData'],
  components: { draggable },
  data() {
    return {}
  },
  created() { },
  methods: {
    addItem() {
      this.activeData.__config__.children.push({
        title: 'New Tab',
        __config__: {
          children: []
        }
      })
    },
    delItem(index, item) {
      let list = this.activeData.__config__.children
      let length = list.length
      if (length < 2) {
        this.$message({
          message: '最后一项不能删除',
          type: 'warning'
        });
        return
      }
      this.$confirm('删除后不能撤销，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.activeData.__config__.active === item.name) {
          let nextTab = list[index + 1] || list[index - 1];
          if (nextTab) this.activeData.__config__.active = nextTab.name;
        }
        this.activeData.__config__.children.splice(index, 1)
      }).catch(() => { });
    }
  }
}
</script>