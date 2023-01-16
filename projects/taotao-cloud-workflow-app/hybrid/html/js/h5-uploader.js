let mask = document.querySelector(".mask");
let fileDom = document.querySelector(".file");
let tis = document.querySelector(".tis");
let logoDom = document.querySelector(".logo");
let progress = document.querySelector(".tis-progress");
let cancel = document.querySelector(".cancel-btn");


let createUpload = (file, url, key='file', header = {},data = {}) => {
	// console.log(`
	// 上传地址:${url}\n
	// 上传附件:${file.name} 附件大小:${file.size}\n
	// 请求头:${JSON.stringify(header)}\n
	// 业务参数:${JSON.stringify(data)}
	// `);
	if (!url) {return;}
	tis.style.display = 'flex';
	
	let formData = new FormData();
	for (let keys in data) {formData.append(keys, data[keys]);}
	formData.append(key, file);
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	
	for (let keys in header) {
		xhr.setRequestHeader(keys, header[keys]);
	}
	xhr.upload.addEventListener("progress", function(event) {
		if(event.lengthComputable){
			let percent = Math.ceil(event.loaded * 100 / event.total) + "%";
			progress.innerText = `努力上传中..${percent}`;
		}
	}, false);
	
	xhr.ontimeout = function(){
		// xhr请求超时事件处理
		progress.innerText = '请求超时';
		setTimeout(()=>{
			tis.style.display = 'none';
			plus.webview.currentWebview().close();
		},1000);
	};
	
	xhr.onreadystatechange = (ev) => {
		if(xhr.readyState == 4) {
			if (xhr.status == 200) {
				progress.innerText = '上传成功';
				// console.log('服务端返回数据：'+xhr.responseText);
				location.href = `callback?fileName=${escape(file.name)}&str=${escape(xhr.responseText)}&fileSize=${escape(file.size)}`;
			}
			else {
				progress.innerText = '上传失败了';
				if (xhr.status == 0) {
					console.log('请检查请求头Content-Type与服务端是否匹配，并确认服务端已正确开启跨域');
				}
			}
			
			setTimeout(()=>{
				tis.style.display = 'none';
				plus.webview.currentWebview().close();
			},1000);
			
		}
	};
	xhr.send(formData);
	
	cancel.addEventListener("click", ()=>{
		xhr.abort();
		plus.webview.currentWebview().close();
	});
}


mask.addEventListener("click", () => {
	plus.webview.currentWebview().close();
});

document.addEventListener('UniAppJSBridgeReady', () => {
	let {url,key,header,formData,logo} = plus.webview.currentWebview();
	if (logo) {
		let img = document.createElement('img');
		img.src = logo;
		logoDom.appendChild(img);
	}
	
	fileDom.value = '';
	fileDom.addEventListener('change', (event) => {
		let file = fileDom.files[0];
		// 默认限制文件小于10M,可自行修改
		if(file.size > (1024*1024 * 10)) {
			plus.nativeUI.toast('单个文件请勿超过10M,请重新上传');
			return;
		}
		createUpload(file, url, key,header,formData);
	}, false);
});