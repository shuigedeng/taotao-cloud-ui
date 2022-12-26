<template>
  <el-row>
    <el-form-item label="控件标题">
      <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
    </el-form-item>
    <el-form-item label="占位提示">
      <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
    </el-form-item>
    <template v-if="!activeData.__config__.isSubTable">
      <el-form-item label="控件栅格">
        <el-slider v-model="activeData.__config__.span" :max="24" :min="6" show-stops :step="2"
          show-tooltip />
      </el-form-item>
      <el-form-item label="标题宽度">
        <el-input-number v-model="activeData.__config__.labelWidth" placeholder="标题宽度" :min="0"
          :precision="0" controls-position="right" />
      </el-form-item>
    </template>
    <el-form-item label="控件宽度" v-if="activeData.__config__.isSubTable">
      <el-input-number v-model="activeData.__config__.columnWidth" placeholder="控件宽度" :min="0"
        :precision="0" controls-position="right" />
    </el-form-item>
    <el-form-item label="弹窗标题">
      <el-input v-model="activeData.popupTitle" placeholder="请输入弹窗标题" />
    </el-form-item>
    <el-form-item label="弹窗类型">
      <el-select v-model="activeData.popupType" placeholder="请选择弹窗类型">
        <el-option label="居中弹窗" value="dialog"></el-option>
        <el-option label="右侧弹窗" value="drawer"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="弹窗宽度">
      <el-select v-model="activeData.popupWidth" placeholder="请选择弹窗宽度">
        <el-option v-for="item in popupWidthOptions" :label="item" :value="item" :key="item" />
      </el-select>
    </el-form-item>
    <el-form-item label="远端数据">
      <JNPF-TreeSelect :options="dataInterfaceSelector" v-model="activeData.interfaceId"
        placeholder="请选择远端数据" lastLevel lastLevelKey='categoryId' lastLevelValue='1' clearable>
      </JNPF-TreeSelect>
    </el-form-item>
    <el-form-item label="存储字段">
      <el-input v-model="activeData.propsValue" placeholder="请输入存储字段" />
    </el-form-item>
    <el-form-item label="显示字段">
      <el-input v-model="activeData.relationField" placeholder="请输入显示字段" />
    </el-form-item>
    <el-divider>列表字段</el-divider>
    <draggable :list="activeData.columnOptions" :animation="340" group="selectItem"
      handle=".option-drag">
      <div v-for="(item, index) in activeData.columnOptions" :key="index" class="select-item">
        <div class="select-line-icon option-drag">
          <i class="icon-ym icon-ym-darg" />
        </div>
        <el-input v-model="item.label" placeholder="列名" size="small" />
        <el-input v-model="item.value" placeholder="字段" size="small" />
        <div class="close-btn select-line-icon" @click="activeData.columnOptions.splice(index, 1)">
          <i class="el-icon-remove-outline" />
        </div>
      </div>
    </draggable>
    <div style="margin-left: 29px;">
      <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
        @click="addSelectItem">
        添加字段
      </el-button>
    </div>
    <el-divider>分页设置</el-divider>
    <el-form-item label="列表分页">
      <el-switch v-model="activeData.hasPage"></el-switch>
    </el-form-item>
    <el-form-item label="分页条数" label-width="80px">
      <el-radio-group v-model="activeData.pageSize">
        <el-radio-button :label="20">20条</el-radio-button>
        <el-radio-button :label="50">50条</el-radio-button>
        <el-radio-button :label="100">100条</el-radio-button>
        <el-radio-button :label="500">500条</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-divider />
    <el-form-item label="能否清空">
      <el-switch v-model="activeData.clearable" />
    </el-form-item>
    <el-form-item label="是否禁用">
      <el-switch v-model="activeData.disabled" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="activeData.__config__.required" />
    </el-form-item>
  </el-row>
</template>
<script>
import comMixin from './mixin';
import draggable from 'vuedraggable'
import { getDataInterfaceSelector } from '@/api/systemData/dataInterface'
export default {
  props: ['activeData'],
  mixins: [comMixin],
  components: { draggable },
  data() {
    return {
      popupWidthOptions: ['600px', '800px', '1000px', '40%', '50%', '60%', '70%', '80%'],
      treeData: [],
      dataInterfaceSelector: []
    }
  },
  created() {
    this.getDataInterfaceSelector()
  },
  methods: {
    getDataInterfaceSelector() {
      getDataInterfaceSelector().then(res => {
        this.dataInterfaceSelector = res.data
      })
    },
    addSelectItem() {
      this.activeData.columnOptions.push({
        value: '',
        label: ''
      })
    }
  }
}
</script>