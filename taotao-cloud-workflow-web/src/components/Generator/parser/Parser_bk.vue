<script>
import { deepClone } from '@/utils'
import render from '@/components/Generator/render/render.js'
import { ruleTrigger, dyOptionsList } from '@/components/Generator/generator/comConfig'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import request from '@/utils/request'

const layouts = {
  colFormItem(h, scheme) {
    const config = scheme.__config__
    const listeners = buildListeners.call(this, scheme)

    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    const Item = config.jnpfKey === 'cascader'
      ? <el-cascader v-model={this[this.formConf.formModel][scheme.__vModel__]} placeholder={scheme.placeholder} options={scheme.options}
        props={scheme.props} disabled={scheme.disabled} show-all-levels={scheme['show-all-levels']} separator={scheme.separator}
        style={scheme.style} clearable={scheme.clearable} filterable={scheme.filterable}
        onChange={val => this.onCascaderChange(val, scheme.on)} onBlur={val => this.onCascaderBlur(val, scheme.on)}
        key={scheme.__config__.renderKey}></el-cascader>
      : <render formData={this[this.formConf.formModel]} conf={scheme} {...{ on: listeners }} ref={config.rowType === 'table' ? scheme.__vModel__ : undefined}
        key={scheme.__config__.renderKey} />
    if (!config.noShow) {
      return (
        <el-col span={config.span}>
          <el-form-item label-width={labelWidth} prop={scheme.__vModel__} key={config.renderKey}
            label={config.showLabel ? config.label : ''}>
            {Item}
          </el-form-item>
        </el-col>
      )
    }
  },
  rowFormItem(h, scheme) {
    const listeners = buildListeners.call(this, scheme)
    if (scheme.__config__.jnpfKey === 'tab') {
      return (
        <el-col span={scheme.__config__.span} class="mb-10">
          <el-tabs type={scheme.type} tab-position={scheme['tab-position']} vModel={scheme.__config__.active} {...{ on: listeners }}>
            {
              scheme.__config__.children.map((item, i) => {
                let child = renderChildren.call(this, h, item)
                return (
                  <el-tab-pane key={item.name} label={item.title} >
                    <el-row>
                      {child}
                    </el-row>
                  </el-tab-pane>
                )
              })
            }
          </el-tabs>
        </el-col>
      )
    }
    if (scheme.__config__.jnpfKey === 'collapse') {
      return (
        <el-col span={scheme.__config__.span} class="mb-20">
          <el-collapse vModel={scheme.__config__.active} accordion={scheme.accordion} {...{ on: listeners }}>
            {
              scheme.__config__.children.map((item, i) => {
                let child = renderChildren.call(this, h, item)
                return (
                  <el-collapse-item key={item.name} title={item.title} name={item.name} >
                    <el-row>
                      {child}
                    </el-row>
                  </el-collapse-item>
                )
              })
            }
          </el-collapse>
        </el-col>
      )
    }
    let child = renderChildren.apply(this, arguments)
    if (scheme.__config__.jnpfKey === 'table') {
      if (!scheme.__config__.noShow) this.tableRefs[scheme.__vModel__] = scheme
      const param = { ...scheme, config: scheme }
      return layouts.colFormItem.call(this, h, param)
    }
    if (scheme.__config__.jnpfKey === 'card') {
      return (
        <el-col span={scheme.__config__.span} class="item-card">
          <el-card shadow={scheme.shadow} header={scheme.header} class="mb-20">
            {child}
          </el-card>
        </el-col>
      )
    }
    if (scheme.__config__.jnpfKey === 'row') {
      if (scheme.type === 'flex') {
        child = <el-row type={scheme.type} justify={scheme.justify} align={scheme.align}>
          {child}
        </el-row>
      }
      return (
        <el-col span={scheme.__config__.span}>
          <el-row gutter={scheme.gutter}>
            {child}
          </el-row>
        </el-col>
      )
    }
  }
}

function renderFrom(h) {
  const { formConfCopy } = this
  return (
    <el-row gutter={formConfCopy.gutter} class={formConfCopy.formStyle}>
      <el-form
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this[formConfCopy.formModel] }}
        rules={this[formConfCopy.formRules]}
      >
        {renderFormItem.call(this, h, formConfCopy.fields)}
        {
          // {formConfCopy.formBtns && formBtns.call(this, h)}
        }
      </el-form>
    </el-row>
  )
}

function formBtns(h) {
  return <el-col>
    <el-form-item size="large">
      <el-button type="primary" onClick={this.submitForm}>提交</el-button>
      <el-button onClick={this.resetForm}>重置</el-button>
    </el-form-item>
  </el-col>
}

function renderFormItem(h, elementList) {
  return elementList.map(scheme => {
    const config = scheme.__config__
    const layout = layouts[config.layout]

    if (layout) {
      return layout.call(this, h, scheme)
    }
    throw new Error(`没有与${config.layout}匹配的layout`)
  })
}

function renderChildren(h, scheme) {
  const config = scheme.__config__
  if (!Array.isArray(config.children)) return null
  return renderFormItem.call(this, h, config.children)
}

function setValue(event, config, scheme) {
  this.$set(config, 'defaultValue', event)
  this.$set(this[this.formConf.formModel], scheme.__vModel__, event)
}

function buildListeners(scheme) {
  const config = scheme.__config__
  const listeners = {}
  if (scheme.on) {
    // 响应 组件事件
    Object.keys(scheme.on).forEach(key => {
      const str = scheme.on[key];
      const func = this.jnpf.getScriptFunc.call(this, str);
      if (!func) return
      listeners[key] = params => {
        if (key === 'change') {
          let data = ''
          if (['select', 'radio', 'checkbox'].includes(config.jnpfKey)) {
            const options = scheme.__slot__.options
            if (scheme.multiple || config.jnpfKey === 'checkbox') {
              let _data = []
              outer: for (let i = 0; i < params[0].length; i++) {
                inner: for (let j = 0; j < options.length; j++) {
                  if (params[0][i] === options[j][config.props.value]) {
                    _data.push(options[j])
                    break inner
                  }
                }
              }
              data = _data
            } else {
              let _data = {}
              for (let i = 0; i < options.length; i++) {
                if (params[0] === options[i][config.props.value]) {
                  _data = options[i]
                  break
                }
              }
              data = _data
            }
          } else if (config.jnpfKey === 'numInput') {
            data = params[0]
          } else {
            data = params.length > 1 ? params[1] : params[0]
          }
          func.call(this, { data, ...this.parameter })
        } else {
          func.call(this, { data: params[0], ...this.parameter })
        }
      }
    })
  }
  // 响应 render.js 中的 vModel $emit('input', val)
  listeners.input = event => setValue.call(this, event, config, scheme)

  return listeners
}

export default {
  components: {
    render
  },
  props: {
    formConf: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      formConfCopy: deepClone(this.formConf),
      [this.formConf.formModel]: {},
      [this.formConf.formRules]: {},
      options: {},
      tableRefs: {}
    }
    this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel])
    this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules])
    this.buildOptions(data.formConfCopy.fields, data.options)
    this.$nextTick(() => {
      this.onLoad(data.formConfCopy)
    })
    return data
  },
  provide() {
    return {
      parameter: this.parameter
    }
  },
  computed: {
    parameter() {
      return {
        formData: this[this.formConf.formModel],
        setFormData: this.setFormData,
        setShowOrHide: this.setShowOrHide,
        setRequired: this.setRequired,
        setDisabled: this.setDisabled,
        request: this.request,
        getFieldOptions: this.getFieldOptions,
        setFieldOptions: this.setFieldOptions
      }
    }
  },
  methods: {
    initFormData(componentList, formData) {
      this.$store.commit('generator/UPDATE_RELATION_DATA', {})
      componentList.forEach(cur => {
        const config = cur.__config__
        if (cur.__vModel__) formData[cur.__vModel__] = config.defaultValue
        if (cur.__config__.jnpfKey == 'table') return
        if (config.children) this.initFormData(config.children, formData)
      })
    },
    buildOptions(componentList, data) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (dyOptionsList.indexOf(config.jnpfKey) > -1) {
          let isTreeSelect = config.jnpfKey === 'treeSelect' || config.jnpfKey === 'cascader'
          if (config.dataType === 'dictionary') {
            if (!config.dictionaryType) return
            getDictionaryDataSelector(config.dictionaryType).then(res => {
              isTreeSelect ? cur.options = res.data.list : cur.__slot__.options = res.data.list
              isTreeSelect ? data[cur.__vModel__ + 'Options'] = cur.options : data[cur.__vModel__ + 'Options'] = cur.__slot__.options
            })
          } else if (config.dataType === 'dynamic') {
            if (!config.propsUrl) return
            getDataInterfaceRes(config.propsUrl).then(res => {
              let realData = this.jnpf.interfaceDataHandler(res.data)
              if (Array.isArray(realData)) {
                isTreeSelect ? cur.options = realData : cur.__slot__.options = realData
              } else {
                isTreeSelect ? cur.options = [] : cur.__slot__.options = []
              }
              isTreeSelect ? data[cur.__vModel__ + 'Options'] = cur.options : data[cur.__vModel__ + 'Options'] = cur.__slot__.options
            })
          } else {
            isTreeSelect ? data[cur.__vModel__ + 'Options'] = cur.options : data[cur.__vModel__ + 'Options'] = cur.__slot__.options
          }
        }
        if (config.jnpfKey === 'comSelect') {
          this.$store.dispatch('generator/getCompanyTree').then(res => {
            data[cur.__vModel__ + 'Options'] = res
          })
        }
        if (config.jnpfKey === 'depSelect') {
          this.$store.dispatch('generator/getDepTree').then(res => {
            data[cur.__vModel__ + 'Options'] = res
          })
        }
        if (config.jnpfKey === 'posSelect') {
          this.$store.dispatch('base/getPositionTree').then(res => {
            data[cur.__vModel__ + 'Options'] = res
          })
        }
        if (config.children && config.jnpfKey !== 'table') this.buildOptions(config.children, data)
      })
    },
    buildRules(componentList, rules) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (!Array.isArray(config.regList)) config.regList = []
        if (config.required) {
          const required = { required: config.required, message: cur.placeholder }
          if (Array.isArray(config.defaultValue)) {
            required.type = 'array'
            required.message = `请至少选择一个${config.label}`
          }
          required.message === undefined && (required.message = `${config.label}不能为空`)
          config.regList.push(required)
        }
        rules[cur.__vModel__] = config.regList.map(item => {
          item.pattern && (item.pattern = eval(item.pattern))
          item.trigger = config.trigger || 'blur'
          return item
        })
        if (config.children && config.jnpfKey !== 'table') this.buildRules(config.children, rules)
      })
    },
    onLoad(formConfCopy) {
      if (!formConfCopy || !formConfCopy.funcs || !formConfCopy.funcs.onLoad) return
      const onLoadFunc = this.jnpf.getScriptFunc.call(this, formConfCopy.funcs.onLoad)
      if (!onLoadFunc) return
      onLoadFunc(this.parameter)
    },
    resetForm() {
      this.$store.commit('generator/UPDATE_RELATION_DATA', {})
      this.formConfCopy = deepClone(this.formConf)
      this.$refs[this.formConf.formRef].resetFields()
      Object.keys(this.tableRefs).forEach(vModel => {
        this.$refs[vModel] && this.$refs[vModel].$children && this.$refs[vModel].$children[0].resetTable()
      })
    },
    checkTableData() {
      let valid = true
      Object.keys(this.tableRefs).forEach(vModel => {
        if (this.$refs[vModel] && this.$refs[vModel].$children) {
          const res = this.$refs[vModel].$children[0].submit()  // 返回false或表单数据
          res ? (this[this.formConf.formModel][vModel] = res) : (valid = false)
        }
      })
      return valid
    },
    request(url, method, data) {
      if (!url) return
      return request({
        url: url,
        method: method || 'GET',
        data: data || {}
      })
    },
    getFieldOptions(prop) {
      if (!prop) return []
      const isChildTable = prop.indexOf('.') > -1
      if (isChildTable) {
        const list = prop.split('.')
        if (this.$refs[list[0]] && this.$refs[list[0]].$children[0]) {
          let res = this.$refs[list[0]].$children[0].getTableFieldOptions(list[1])
          return res
        } else {
          return []
        }
      } else {
        return this.options[prop + 'Options'] || []
      }
    },
    setFormData(prop, value) {
      if (!prop) return
      const isChildTable = prop.indexOf('.') > -1
      if (isChildTable) {
        const list = prop.split('.')
        if (this.$refs[list[0]] && this.$refs[list[0]].$children[0]) {
          this.$refs[list[0]].$children[0].setTableFormData(list[1], value)
        }
      } else {
        this.comSet('defaultValue', prop, value)
        this[this.formConf.formModel][prop] = value
      }
    },
    setShowOrHide(prop, value) {
      const newVal = !!value
      const isChildTable = prop.indexOf('.') > -1
      if (!isChildTable) {
        this.comSet('noShow', prop, !newVal)
      }
    },
    setRequired(prop, value) {
      const newVal = !!value
      const isChildTable = prop.indexOf('.') > -1
      if (!isChildTable) {
        this.comSet('required', prop, newVal)
        this.buildRules(this.formConfCopy.fields, this[this.formConf.formRules])
      }
    },
    setDisabled(prop, value) {
      const newVal = !!value
      const isChildTable = prop.indexOf('.') > -1
      if (!isChildTable) {
        this.comSet('disabled', prop, newVal)
      }
    },
    setFieldOptions(prop, value) {
      const newVal = Array.isArray(value) ? value : []
      const isChildTable = prop.indexOf('.') > -1
      if (!isChildTable) {
        this.comSet('options', prop, newVal)
      }
    },
    comSet(field, prop, value) {
      if (!prop) return
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          if (item.__vModel__ && item.__vModel__ === prop) {
            switch (field) {
              case 'disabled':
                this.$set(item, field, value)
                break;
              case 'options':
                if (dyOptionsList.indexOf(item.__config__.jnpfKey) > -1) {
                  let isTreeSelect = item.__config__.jnpfKey === 'treeSelect' || item.__config__.jnpfKey === 'cascader'
                  isTreeSelect ? item.options = value : item.__slot__.options = value
                }
                break;
              default:
                this.$set(item.__config__, field, value)
                break;
            }
            item.__config__.renderKey = +new Date() + item.__vModel__
            break;
          }
          if (item.__config__ && item.__config__.jnpfKey !== 'table' && item.__config__.children && Array.isArray(item.__config__.children)) {
            loop(item.__config__.children)
          }
        }
      }
      loop(this.formConfCopy.fields)
    },
    beforeSubmit() {
      let valid = true
      if (!this.formConfCopy || !this.formConfCopy.funcs || !this.formConfCopy.funcs.beforeSubmit) return valid
      const func = this.jnpf.getScriptFunc.call(this, this.formConfCopy.funcs.beforeSubmit)
      if (!func) return valid
      valid = func(this.parameter)
      return valid
    },
    afterSubmit() {
      if (!this.formConfCopy || !this.formConfCopy.funcs || !this.formConfCopy.funcs.afterSubmit) return
      const func = this.jnpf.getScriptFunc.call(this, this.formConfCopy.funcs.afterSubmit)
      if (!func) return
      func(this.parameter)
    },
    submitForm() {
      const isTableValid = this.checkTableData()
      const beforeSubmitValid = this.beforeSubmit()
      if (!beforeSubmitValid) return false
      this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) return false
        if (!isTableValid) return false
        // 触发submit事件
        this.$emit('submit', this[this.formConf.formModel], this.afterSubmit)
        return true
      })
    },
    onCascaderChange(data, on) {
      if (!on || !on.change) return
      const func = this.jnpf.getScriptFunc.call(this, on.change)
      if (!func) return
      func.call(this, { data, ...this.parameter })
    },
    onCascaderBlur(data, on) {
      if (!on || !on.blur) return
      const func = this.jnpf.getScriptFunc.call(this, on.blur)
      if (!func) return
      func.call(this, { data, ...this.parameter })
    }
  },
  render(h) {
    return renderFrom.call(this, h)
  }
}
</script>