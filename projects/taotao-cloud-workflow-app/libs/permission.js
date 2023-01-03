export default {
	inserted(columnData, permissionList, menuId) {
		let btnsList = columnData.btnsList
		let columnBtnsList = columnData.columnBtnsList
		const useBtnPermission = columnData.useBtnPermission
		const useColumnPermission = columnData.useColumnPermission
		const useFormPermission = columnData.useFormPermission
		const useBtnPermissionList = [...btnsList, ...columnBtnsList]
		let newArr = [];
		let columnList = [];
		let formList = [];
		let currentMenu = {}
		let btn_list = ['detail', 'edit', 'add', 'remove']
		let labelS = {}
		useBtnPermissionList.map((o)=>{
			if(btn_list.includes(o.value)){
				labelS['btn_'+o.value]  =  o.label
			}
		})
		let handle = {}
		let isMenu = permissionList.filter((o) => {
			if (o.modelId === menuId) {
				return currentMenu = o
			}
		})
		if (useBtnPermission) {
			if (!!isMenu.length) {
				for (let i = 0; i < useBtnPermissionList.length; i++) {
					inner: for (let j = 0; j < currentMenu.button.length; j++) {
						if ('btn_' + useBtnPermissionList[i].value === currentMenu.button[j].enCode) {
							newArr.push(currentMenu.button[j].enCode)
							break inner
						}
					}
				}
			}
		} else {
			for (let i = 0; i < useBtnPermissionList.length; i++) {
				inner: for (let j = 0; j < btn_list.length; j++) {
					if (useBtnPermissionList[i].value === btn_list[j]) {
						newArr.push('btn_' + useBtnPermissionList[i].value)
						break inner
					}
				}
			}
		}

		if (useColumnPermission) {
			if (!!isMenu.length) {
				columnData.columnList.forEach((o, i) => {
					currentMenu.column.forEach((m, j) => {
						if (o.prop === m.enCode) {
							columnList.push(o)
						}
					})
				})
			}
		} else {
			columnList = columnData.columnList
		}

		if (useFormPermission) {
			if (!!isMenu.length) {
				formList = currentMenu.form
			}
		}
		handle = {
			labelS,
			btnAllow: newArr,
			columnAllow: columnList,
			formAllow: {
				formList,
				useFormPermission,
				menuId
			}
		}
		return handle
	}
}
