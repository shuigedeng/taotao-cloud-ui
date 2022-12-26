<script>
export default {
  name: 'jnpf-table-column',
  functional: true,
  render(createElement, context) {
    const list = context.props && context.props.columns || []
    const list2 = context.props && context.props.columnList || []
    let slots = []
    for (let i = 0; i < list2.length; i++) {
      inner: for (let j = 0; j < list.length; j++) {
        if (list[j].componentOptions && list[j].componentOptions.propsData && list2[i].prop === list[j].componentOptions.propsData.prop && list2[i].columnVisible) {
          slots.push(list[j])
          break inner
        }
      }
    }
    let noPropList = list.filter(item => item.componentOptions && item.componentOptions.propsData && !item.componentOptions.propsData.prop)
    let noPropList1 = noPropList.filter(item => item.componentOptions.propsData.label !== '操作')
    let noPropList2 = noPropList.filter(item => item.componentOptions.propsData.label === '操作')
    return [...noPropList1, ...slots, ...noPropList2]
  }
}
</script>