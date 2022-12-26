// 规则
const ruleTrigger = {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change',
  'el-color-picker': 'change',
  'JNPF-Quill': 'blur',
  "JNPF-Text": 'blur',
  "JNPF-Amount": 'change',
  "JNPF-UploadFz": 'change',
  "JNPF-UploadImg": 'change',
  "com-select": 'change',
  "dep-select": 'change',
  "pos-select": 'change',
  "user-select": 'change',
  "dic-select": 'change',
  "JNPF-Address": 'change',
}
// 动态options
const dyOptionsList = ['radio', 'checkbox', 'select', 'cascader', 'treeSelect']
// 不添加vModel
const noVModelList = ['divider', 'JNPFText', 'groupTitle', 'relationFormAttr', 'popupAttr', 'button', 'barcode', 'qrcode']
// 不可以添加到子表组件
const noTableAllowList = ['divider', 'JNPFText', 'groupTitle', 'button', 'barcode', 'qrcode', 'editor', 'uploadImg', 'radio', 'checkbox', 'createUser', 'createTime', 'modifyUser', 'modifyTime', 'currOrganize', 'currDept', 'currPosition', 'rate', 'slider', 'PsdInput', 'colorPicker']
// 不可以添加到列表展示
const noColumnShowList = ['PsdInput', 'colorPicker', 'rate', 'slider', 'divider', 'uploadImg', 'uploadFz', 'editor', 'JNPFText', 'relationFormAttr', 'popupAttr', 'groupTitle']
// 不可以添加到搜索
const noSearchList = [...noColumnShowList, 'switch', 'timeRange', 'dateRange', 'relationForm', 'popupSelect']
// 搜索时控件为input
const useInputList = ['comInput', 'textarea', 'JNPFText', 'billRule']
// 搜索时控件为日期选择器
const useDateList = ['createTime', 'modifyTime']
// 搜索时控件为下拉选择器
const useSelectList = ['radio', 'checkbox', 'select']
// 在线开发-功能设计/流程设计独有组件
const webPeculiarList = [{
  __config__: {
    jnpfKey: 'calculate',
    label: '计算公式',
    labelWidth: undefined,
    showLabel: true,
    required: false,
    tag: 'calculate',
    tagIcon: 'icon-ym icon-ym-generator-count',
    defaultValue: null,
    layout: 'colFormItem',
    span: 24,
    dragDisabled: false,
    tableName: '',
    noShow: false,
    regList: []
  },
  expression: []
}]
// 在线开发-功能设计/流程设计/移动设计独有组件
const onlinePeculiarList = [{
    __config__: {
      jnpfKey: 'qrcode',
      label: '二维码',
      labelWidth: undefined,
      showLabel: true,
      tag: 'jnpf-qrcode',
      tagIcon: 'icon-ym icon-ym-generator-qrcode',
      defaultValue: '',
      layout: 'colFormItem',
      span: 24,
      dragDisabled: false,
      tableName: '',
      regList: [],
    },
    colorDark: '#000',
    colorLight: '#fff',
    size: 100,
    dataType: 'static',
    staticText: '',
    relationField: '',
  },
  {
    __config__: {
      jnpfKey: 'barcode',
      label: '条形码',
      labelWidth: undefined,
      showLabel: true,
      tag: 'jnpf-barcode',
      tagIcon: 'icon-ym icon-ym-generator-barcode',
      defaultValue: '',
      layout: 'colFormItem',
      span: 24,
      dragDisabled: false,
      tableName: '',
      regList: [],
    },
    format: 'code128',
    lineColor: '#000',
    background: '#fff',
    width: 4,
    height: 40,
    dataType: 'static',
    staticText: '',
    relationField: '',
  },
]

export { ruleTrigger, dyOptionsList, noVModelList, noTableAllowList, noColumnShowList, noSearchList, webPeculiarList, onlinePeculiarList, useInputList, useDateList, useSelectList }