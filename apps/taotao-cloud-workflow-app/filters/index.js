// 代码生成器数据匹配
export function dynamicText(value, options) {
	if (!value) return ''
	if (Array.isArray(value)) {
		if (!options || !Array.isArray(options)) return value.join()
		let textList = []
		for (let i = 0; i < value.length; i++) {
			let item = options.filter(o => o.id == value[i])[0]
			if (!item || !item.fullName) {
				textList.push(value[i])
			} else {
				textList.push(item.fullName)
			}
		}
		return textList.join()
	}
	if (!options || !Array.isArray(options)) return value
	let item = options.filter(o => o.id == value)[0]
	if (!item || !item.fullName) return value
	return item.fullName
}

export function dynamicTreeText(value, options) {
	if (!value) return ''

	function transfer(data) {
		let textList = []

		function loop(data, id) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].id === id) {
					textList.push(data[i].fullName)
					break
				}
				if (data[i].children) loop(data[i].children, id)
			}
		}
		for (let i = 0; i < data.length; i++) {
			loop(options, data[i])
		}
		return textList.join()
	}
	if (!options || !Array.isArray(options)) return value.join()
	if (Array.isArray(value)) {
		let text = transfer(value)
		return text
	} else {
		if (!options || !Array.isArray(options)) return value
		let list = value.split()
		let text = transfer(list)
		return text
	}
}
