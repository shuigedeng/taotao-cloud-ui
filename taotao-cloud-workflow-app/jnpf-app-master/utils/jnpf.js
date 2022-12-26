const jnpf = {
	goBack() {
		uni.navigateBack()
	},
	toDecimal(num) {
		if (num == null) {
			num = "0";
		}
		num = num.toString().replace(/\$|\,/g, '');
		if (isNaN(num))
			num = "0";
		var sign = (num == (num = Math.abs(num)));
		num = Math.floor(num * 100 + 0.50000000001);
		var cents = num % 100;
		num = Math.floor(num / 100).toString();
		if (cents < 10)
			cents = "0" + cents;
		for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
			num = num.substring(0, num.length - (4 * i + 3)) + '' +
			num.substring(num.length - (4 * i + 3));
		return (((sign) ? '' : '-') + num + '.' + cents);
	},
	getScriptFunc(str) {
		let func = null
		try {
			func = eval(str)
			return func
		} catch (error) {
			console.log(error);
			return false
		}
	},
	interfaceDataHandler(data) {
		if (!data.dataProcessing) return data.data
		const dataHandler = this.getScriptFunc(data.dataProcessing)
		if (!dataHandler) return data.data
		return dataHandler(data.data)
	},
}
export default jnpf
