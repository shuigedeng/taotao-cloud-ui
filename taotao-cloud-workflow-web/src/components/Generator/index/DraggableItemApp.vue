<script>
import draggable from 'vuedraggable'
import render from '@/components/Generator/render/render'

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
    const __vModel__ = element.__vModel__
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    if (config.jnpfKey === 'JNPFText') {
      return (
        <el-col span={config.span} class={className}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <el-form-item label-width={labelWidth}
            label={config.showLabel ? config.label : ''} required={config.required}>
            {config.defaultValue}
          </el-form-item>
          {components.itemBtns.apply(this, arguments)}
        </el-col>
      )
    }
    if (config.jnpfKey === 'groupTitle') {
      return (
        <el-col span={config.span} class={className}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <el-form-item label-width="0">{element.content}</el-form-item>
          {components.itemBtns.apply(this, arguments)}
        </el-col>
      )
    }
    if (config.jnpfKey === 'barcode') {
      return (
        <el-col span={config.span} class={className}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <el-form-item label-width={labelWidth}
            label={config.showLabel ? config.label : ''} required={config.required}>
            <jnpf-barcode format={element.format} lineColor={element.lineColor} background={element.background} width={element.width} height={element.height} staticText={element.staticText}></jnpf-barcode>
          </el-form-item>
          {components.itemBtns.apply(this, arguments)}
        </el-col>
      )
    }
    if (config.jnpfKey === 'qrcode') {
      return (
        <el-col span={config.span} class={className}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <el-form-item label-width={labelWidth}
            label={config.showLabel ? config.label : ''} required={config.required}>
            <jnpf-qrcode size={element.size} colorLight={element.colorLight} colorDark={element.colorDark} staticText={element.staticText}></jnpf-qrcode>
          </el-form-item>
          {components.itemBtns.apply(this, arguments)}
        </el-col>
      )
    }
    if (config.jnpfKey === 'button') {
      return (
        <el-col span={config.span} class={className}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <el-form-item label-width="0">
            <jnpf-button align={element.align} buttonText={element.buttonText} type={element.type} disabled={element.disabled}></jnpf-button>
          </el-form-item>
          {components.itemBtns.apply(this, arguments)}
        </el-col>
      )
    }
    return (
      <el-col span={config.span} class={className}
        nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
        <el-form-item label-width={labelWidth}
          label={config.showLabel ? config.label : ''} required={config.required}>
          {__vModel__}
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
          <el-row gutter={element.__config__.gutter} class={className} style="padding-top:30px"
            nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
            <span class="component-name">{element.__config__.componentName}</span>
            {tip}
            <draggable list={element.__config__.children} animation={340} group={group} onEnd={onEnd} class="drag-wrapper">
              {child}
            </draggable>
            {components.itemBtns.apply(this, arguments)}
          </el-row>
        </el-col>
      )
    }
    if (element.__config__.jnpfKey === 'card') {
      let tip = ''
      if (!element.__config__.children.length) {
        tip = <div class="table-tip">请将组件拖到此区域(可拖多个组件)</div>
      }
      return (
        <el-col span={element.__config__.span}>
          <el-row gutter={element.__config__.gutter} class={className} style="padding-top:30px"
            nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
            <span class="component-name">{element.__config__.label}</span>
            {tip}
            <draggable list={element.__config__.children} animation={340} group={group} onEnd={onEnd} class="drag-wrapper">
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
          <el-row gutter={element.__config__.gutter} class={className} style="padding-top:30px"
            nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
            <span class="component-name">{element.__config__.label}</span>
            {tip}
            <draggable list={element.__config__.children} animation={340} group={group} class="drag-wrapper table-wrapper" onEnd={onEnd} clone={cloneComponent}>
              {child}
            </draggable>
            {components.itemBtns.apply(this, arguments)}
            {
              // <div style="text-align: center;background: white;color: #4e79ff;padding: .4rem 1rem;">
              //   <i class="el-icon-plus"></i> {element.actionText}
              // </div>
            }
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
    const layout = layouts[this.element.__config__.layout]

    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList)
    }
    return layoutIsNotFound.call(this)
  }
}
</script>