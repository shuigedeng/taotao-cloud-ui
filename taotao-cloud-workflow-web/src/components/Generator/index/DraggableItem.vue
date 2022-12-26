<script>
import draggable from 'vuedraggable'
import render from '@/components/Generator/render/render'
import { dyOptionsList } from '@/components/Generator/generator/comConfig'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

let activeData = {}
const components = {
  itemBtns(h, element, index, parent) {
    const { copyItem, deleteItem } = this.$listeners
    return [
      <span class="drawing-item-copy" title="复制" onClick={event => {
        copyItem(element, parent); event.stopPropagation()
      }}>
        <i class="el-icon-copy-document" />
      </span>,
      <el-popconfirm title="确定删除该组件？" class="drawing-item-delete" onConfirm={event => {
        deleteItem(index, parent)
      }}>
        <span title="删除" slot="reference" style="width:100%;height:100%;display:inline-block">
          <i class="el-icon-delete" />
        </span>
      </el-popconfirm>
    ]
  }
}
const layouts = {
  colFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const config = element.__config__
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    const Item = config.jnpfKey === 'cascader'
      ? <el-cascader v-model={config.defaultValue} placeholder={element.placeholder} options={element.options}
        props={element.props} disabled={element.disabled} show-all-levels={element['show-all-levels']} separator={element.separator}
        style={element.style} clearable={element.clearable} filterable={element.filterable} key={config.renderKey}></el-cascader>
      : <render key={config.renderKey} conf={element} onInput={event => { this.$set(config, 'defaultValue', event) }} />
    return (
      <el-col span={config.span} class={className}
        nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
        <el-form-item label-width={labelWidth}
          label={config.showLabel ? config.label : ''} required={config.required}>
          {Item}
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  rowFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const { put, end } = this.$attrs
    const className = this.activeId === element.__config__.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    if (element.__config__.jnpfKey === 'tab') {
      return (
        <el-col span={element.__config__.span}>
          <el-row gutter={element.__config__.gutter} class={className}
            nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
            <el-tabs type={element.type} tab-position={element['tab-position']} vModel={element.__config__.active}>
              {
                element.__config__.children.map((item, i) => {
                  let child = renderChildren.apply(this, [h, item, i, element])
                  let childgroup = { name: 'componentsGroup', put: (...arg) => put(...arg, item) }
                  const onChildEnd = (...arg) => end(...arg, activeData, item)
                  let tip = ''
                  if (!item.__config__.children.length) {
                    tip = <div class="table-tip tab-tip">请将组件拖到此区域(可拖多个组件)</div>
                  }
                  return (
                    <el-tab-pane key={item.name} label={item.title} >
                      <el-col >
                        {tip}
                        <el-row gutter={element.__config__.gutter} style="padding-top:15px">
                          <draggable list={item.__config__.children} animation={340} group={childgroup} onEnd={onChildEnd} class="drag-wrapper">
                            {child}
                          </draggable>
                        </el-row>
                      </el-col>
                    </el-tab-pane>
                  )
                })
              }
            </el-tabs>
            {components.itemBtns.apply(this, arguments)}
          </el-row>
        </el-col>
      )
    }
    if (element.__config__.jnpfKey === 'collapse') {
      return (
        <el-col span={element.__config__.span}>
          <el-row gutter={element.__config__.gutter} class={className}
            nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
            <el-collapse vModel={element.__config__.active} accordion={element.accordion}>
              {
                element.__config__.children.map((item, i) => {
                  let child = renderChildren.apply(this, [h, item, i, element])
                  let childgroup = { name: 'componentsGroup', put: (...arg) => put(...arg, item) }
                  const onChildEnd = (...arg) => end(...arg, activeData, item)
                  let tip = ''
                  if (!item.__config__.children.length) {
                    tip = <div class="table-tip card-tip">请将组件拖到此区域(可拖多个组件)</div>
                  }
                  return (
                    <el-collapse-item key={item.name} title={item.title} name={item.name} >
                      <el-col style="position:relative">
                        {tip}
                        <el-row gutter={element.__config__.gutter} style="padding-top:15px">
                          <draggable list={item.__config__.children} animation={340} group={childgroup} onEnd={onChildEnd} class="drag-wrapper">
                            {child}
                          </draggable>
                        </el-row>
                      </el-col>
                    </el-collapse-item>
                  )
                })
              }
            </el-collapse>
            {components.itemBtns.apply(this, arguments)}
          </el-row>
        </el-col>
      )
    }
    let child = renderChildren.apply(this, arguments)
    const group = { name: 'componentsGroup', put: (...arg) => put(...arg, element) }
    const onEnd = (...arg) => end(...arg, activeData, element)
    if (element.__config__.jnpfKey === 'row') {
      if (element.type === 'flex') {
        child = <el-row type={element.type} justify={element.justify} align={element.align}>
          {child}
        </el-row>
      }
      let tip = ''
      if (!element.__config__.children.length) {
        tip = <div class="table-tip">请将组件拖到此区域(可拖多个组件)</div>
      }
      return (
        <el-col span={element.__config__.span}>
          <el-row gutter={element.__config__.gutter} class={className}
            nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
            <span class="component-name">{element.__config__.componentName}</span>
            {tip}
            <draggable list={element.__config__.children} animation={340} group={group} onEnd={onEnd} class="drag-wrapper" style="margin-top:20px">
              {child}
            </draggable>
            {components.itemBtns.apply(this, arguments)}
          </el-row>
        </el-col>
      )
    }
    if (element.__config__.jnpfKey === 'table') {
      let tip = ''
      if (!element.__config__.children.length) {
        tip = <div class="table-tip">请将组件拖到此区域(可拖多个组件)</div>
      }
      return (
        <el-col span={element.__config__.span}>
          <el-row gutter={element.__config__.gutter} class={className + ' drawing-row-item-table'}
            nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
            <span class="component-name">{element.__config__.label}</span>
            {tip}
            <el-form label-position="top">
              <draggable list={element.__config__.children} animation={340} group={group} class="drag-wrapper table-wrapper table-wrapper-web" onEnd={onEnd} clone={cloneComponent}>
                {child}
              </draggable>
            </el-form>
            {components.itemBtns.apply(this, arguments)}
          </el-row>
        </el-col>
      )
    }
    if (element.__config__.jnpfKey === 'card') {
      let tip = ''
      if (!element.__config__.children.length) {
        tip = <div class="table-tip card-tip">请将组件拖到此区域(可拖多个组件)</div>
      }
      return (
        <el-col span={element.__config__.span}>
          <el-row gutter={element.__config__.gutter} class={className}
            nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
            <el-card shadow={element.shadow} header={element.header}>
              <el-col>
                <el-row gutter={element.__config__.gutter}
                  nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
                  {tip}
                  <draggable list={element.__config__.children} animation={340} group={group} onEnd={onEnd} class="drag-wrapper">
                    {child}
                  </draggable>
                </el-row>
              </el-col>
            </el-card>
            {components.itemBtns.apply(this, arguments)}
          </el-row>
        </el-col>
      )
    }
  }
}
function cloneComponent(origin) {
  activeData = origin
}

function renderChildren(h, element, index, parent) {
  const config = element.__config__
  if (!Array.isArray(config.children)) return null
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout]
    if (layout) {
      return layout.call(this, h, el, i, config.children)
    }
    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.element.__config__.layout}匹配的layout`)
}

function buildOptions(element) {
  const config = element.__config__
  if (dyOptionsList.indexOf(config.jnpfKey) > -1) {
    let isTreeSelect = config.jnpfKey === 'treeSelect' || config.jnpfKey === 'cascader'
    if (config.dataType === 'dictionary') {
      if (!config.dictionaryType) return
      getDictionaryDataSelector(config.dictionaryType).then(res => {
        isTreeSelect ? element.options = res.data.list : element.__slot__.options = res.data.list
      })
    }
    if (config.dataType === 'dynamic') {
      if (!config.propsUrl) return
      getDataInterfaceRes(config.propsUrl).then(res => {
        let data = this.jnpf.interfaceDataHandler(res.data)
        if (Array.isArray(data)) {
          isTreeSelect ? element.options = data : element.__slot__.options = data
        } else {
          isTreeSelect ? element.options = [] : element.__slot__.options = []
        }
      })
    }
  }
  if (config.children && Array.isArray(config.children)) {
    for (let i = 0; i < config.children.length; i++) {
      buildOptions(config.children[i])
    }
  }
}

export default {
  components: {
    render,
    draggable
  },
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    // buildOptions(this.element)
    const layout = layouts[this.element.__config__.layout]

    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList)
    }
    return layoutIsNotFound.call(this)
  }
}
</script>