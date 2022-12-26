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
    <el-form-item label="默认值">
      <el-select v-model="activeData.__config__.defaultValue" placeholder="选择默认值" clearable
        :multiple="activeData.multiple" filterable>
        <el-option v-for="(item,i) in activeData.__slot__.options" :key="i"
          :label="item[activeData.__config__.props.label]"
          :value="item[activeData.__config__.props.value]">
        </el-option>
      </el-select>
    </el-form-item>
    <el-divider>数据选项</el-divider>
    <el-form-item label="" label-width="40px">
      <el-radio-group v-model="activeData.__config__.dataType" size="small"
        style="text-align:center" @change="dataTypeChange">
        <el-radio-button label="static">静态数据</el-radio-button>
        <el-radio-button label="dictionary">数据字典</el-radio-button>
        <el-radio-button label="dynamic">远端数据</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <template v-if="activeData.__config__.dataType==='static'">
      <draggable :list="activeData.__slot__.options" :animation="340" group="selectItem"
        handle=".option-drag">
        <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
          <div class="select-line-icon option-drag">
            <i class="icon-ym icon-ym-darg" />
          </div>
          <el-input v-model="item.fullName" placeholder="选项名" size="small" />
          <el-input v-model="item.id" placeholder="选项值" size="small" />
          <div class="close-btn select-line-icon"
            @click="activeData.__slot__.options.splice(index, 1)">
            <i class="el-icon-remove-outline" />
          </div>
        </div>
      </draggable>
      <div style="margin-left: 29px;">
        <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
          @click="addSelectItem">
          添加选项
        </el-button>
      </div>
    </template>
    <template v-if="activeData.__config__.dataType === 'dictionary'">
      <el-form-item label="远端数据">
        <JNPF-TreeSelect :options="dicOptions" v-model="activeData.__config__.dictionaryType"
          placeholder="请选择数据字典" lastLevel clearable>
        </JNPF-TreeSelect>
      </el-form-item>
      <el-form-item label="存储字段">
        <el-select v-model="activeData.__config__.props.value" placeholder="请选择存储字段">
          <el-option label="id" value="id"></el-option>
          <el-option label="enCode" value="enCode"></el-option>
        </el-select>
      </el-form-item>
    </template>
    <template v-if="activeData.__config__.dataType === 'dynamic'">
      <el-form-item label="远端数据">
        <JNPF-TreeSelect :options="dataInterfaceOptions" v-model="activeData.__config__.propsUrl"
          placeholder="请选择远端数据" lastLevel lastLevelKey='categoryId' lastLevelValue='1'
          @change="propsUrlChange" clearable>
        </JNPF-TreeSelect>
      </el-form-item>
      <el-form-item label="存储字段">
        <el-input v-model="activeData.__config__.props.value" placeholder="请输入存储字段" />
      </el-form-item>
      <el-form-item label="显示字段">
        <el-input v-model="activeData.__config__.props.label" placeholder="请输入显示字段" />
      </el-form-item>
    </template>
    <el-divider />
    <!-- <el-form-item label="显示标签">
      <el-switch v-model="activeData.__config__.showLabel" />
    </el-form-item> -->
    <el-form-item label="能否清空">
      <el-switch v-model="activeData.clearable" />
    </el-form-item>
    <el-form-item label="能否搜索">
      <el-switch v-model="activeData.filterable" />
    </el-form-item>
    <el-form-item label="能否多选">
      <el-switch v-model="activeData.multiple" @change="multipleChange" />
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
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
export default {
  props: ['activeData', 'dictionaryOptions', 'dataInterfaceOptions'],
  mixins: [comMixin],
  components: { draggable },
  data() {
    return {

    }
  },
  computed: {
    dicOptions() {
      return this.dictionaryOptions
    },
    interfaceOptions() {
      return this.dataInterfaceOptions
    },
  },
  watch: {
    'activeData.__config__.dictionaryType': function (val) {
      if (!val) {
        this.activeData.__slot__.options = []
        return
      }
      getDictionaryDataSelector(val).then(res => {
        this.activeData.__slot__.options = res.data.list
      })
    }
  },
  methods: {
    addSelectItem() {
      this.activeData.__slot__.options.push({
        fullName: '',
        id: ''
      })
    },
    dataTypeChange(val) {
      this.activeData.__config__.defaultValue = this.activeData.multiple ? [] : ''
      this.activeData.__slot__.options = []
      this.activeData.__config__.props.value = 'id'
      this.activeData.__config__.props.label = 'fullName'
      if (val === 'static') {
        this.activeData.__config__.dictionaryType = ''
        this.activeData.__config__.propsUrl = ''
      }
      if (val === 'dynamic') {
        this.activeData.__config__.dictionaryType = ''
      }
      if (val === 'dictionary') {
        this.activeData.__config__.propsUrl = ''
      }
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '')
    },
    dictionaryTypeChange() {
      this.activeData.__config__.defaultValue = this.activeData.multiple ? [] : ''
    },
    propsUrlChange(val) {
      if (!val) {
        this.activeData.__slot__.options = []
        return
      }
      this.activeData.__config__.defaultValue = this.activeData.multiple ? [] : ''
      getDataInterfaceRes(val).then(res => {
        let data = this.jnpf.interfaceDataHandler(res.data)
        if (Array.isArray(data)) {
          this.activeData.__slot__.options = data
        } else {
          this.activeData.__slot__.options = []
        }
      }).catch(() => {
        this.activeData.__config__.propsUrl = ''
        this.activeData.__slot__.options = []
      })
    }
  }
}
</script>