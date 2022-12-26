let setPermission = {
	permissionList:uni.getStorageSync('permissionList') || [],
	hasP(enCode,menuIds) {
		if (!menuIds) return false
		const list = setPermission.permissionList.filter(o => o.modelId === menuIds)
		if (!list.length) return false
		const columnList = list[0] && list[0].column ? list[0].column : []
		if (!columnList.length) return false
		const hasPermission = columnList.some(column => column.enCode === enCode)
		if (hasPermission) return true
		return false
	  },
	  hasFormP(enCode,menuIds) {
	    if (!menuIds) return false
		const list = setPermission.permissionList.filter(o => o.modelId === menuIds)
		if (!list.length) return false
		const formList = list[0] && list[0].form ? list[0].form : []
		if (!formList.length) return false
		const hasPermission = formList.some(form => form.enCode === enCode)
		if (hasPermission) return true
		return false
	  },
	  hasBtnP(enCode,menuIds) {
		  if (!menuIds) return false
		  const list = setPermission.permissionList.filter(o => o.modelId === menuIds)
		  if (!list.length) return false
		  const btnList = list[0] && list[0].button ? list[0].button : []
		  if (!btnList.length) return false
		  const hasPermission = btnList.some(btn => btn.enCode === enCode)
		  if (hasPermission) return true
		  return false
	  }
}
export default setPermission