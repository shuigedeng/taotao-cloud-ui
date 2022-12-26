<template>
  <el-row>
    <el-form-item label="控件标题">
      <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
    </el-form-item>
    <el-form-item label="控件栅格">
      <el-slider v-model="activeData.__config__.span" :max="24" :min="6" show-stops :step="2"
        show-tooltip />
    </el-form-item>
    <el-form-item label="标题宽度">
      <el-input-number v-model="activeData.__config__.labelWidth" placeholder="标题宽度" :min="0"
        :precision="0" controls-position="right" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-checkbox-group v-model="activeData.__config__.defaultValue" :min="activeData.min"
        :max="activeData.max">
        <el-checkbox :label="item[activeData.__config__.props.value]"
          v-for="(item,i) in activeData.__slot__.options" :key="i">
          {{item[activeData.__config__.props.label]}}</el-checkbox>
      </el-checkbox-group>
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
        <JNPF-TreeSelect :options="treeData" v-model="activeData.__config__.dictionaryType"
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
        <JNPF-TreeSelect :options="dataInterfaceSelector" v-model="activeData.__config__.propsUrl"
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
    <el-form-item label="选项样式">
      <el-radio-group v-model="activeData.__config__.optionType">
        <el-radio-button label="default">
          默认
        </el-radio-button>
        <el-radio-button label="button">
          按钮
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if=" activeData.__config__.optionType === 'default'" label="是否带边框">
      <el-switch v-model="activeData.__config__.border" />
    </el-form-item>
    <el-form-item v-if="activeData.__config__.optionType === 'button' ||
                activeData.__config__.border" label="组件尺寸">
      <el-radio-group v-model="activeData.size">
        <el-radio-button label="medium">
          中等
        </el-radio-button>
        <el-radio-button label="small">
          较小
        </el-radio-button>
        <el-radio-button label="mini">
          迷你
        </el-radio-button>
      </el-radio-group>
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
import { getDictionaryTypeSelector, getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceSelector, getDataInterfaceRes } from '@/api/systemData/dataInterface'
export default {
  props: ['activeData'],
  mixins: [comMixin],
  components: { draggable },
  data() {
    return {
      treeData: [],
      dataInterfaceSelector: []
    }
  },
  created() {
    this.getDictionaryType()
    this.getDataInterfaceSelector()
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
    getDictionaryType() {
      getDictionaryTypeSelector().then(res => {
        this.treeData = res.data.list
      })
    },
    getDataInterfaceSelector() {
      getDataInterfaceSelector().then(res => {
        this.dataInterfaceSelector = res.data
      })
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({
        fullName: '',
        id: ''
      })
    },
    dataTypeChange(val) {
      this.activeData.__config__.defaultValue = []
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
    dictionaryTypeChange() {
      this.activeData.__config__.defaultValue = []
    },
    propsUrlChange(val) {
      if (!val) {
        this.activeData.__slot__.options = []
        return
      }
      this.activeData.__config__.defaultValue = []
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