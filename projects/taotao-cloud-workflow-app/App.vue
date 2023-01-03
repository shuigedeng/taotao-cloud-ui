<script>
	import chat from '@/libs/chat.js'
	import {
		versionUpgrade,
		getAppVersion
	} from '@/api/common.js'
	export default {
		onLaunch: function() {
			// #ifdef H5
			const token = uni.getStorageSync("token");
			if (!token) return
			chat.initSocket()
			// #endif
			//#ifdef APP-PLUS
			let modileSystem = uni.getSystemInfoSync().platform;
			let javaApk = 'https://cdn.workflowsoft.com/apk/Android-java-3.3.2.apk';
			let app_version = '';
			this.$nextTick(() => {
				const version = uni.getStorageSync('sysVersion')
				app_version = Number(version.replace(/[^0-9]/ig, "")) //version;
				if (app_version == 0) {
					getAppVersion().then(res => {
						let data = res.data.sysVersion || ''
						uni.setStorageSync('sysVersion',data)
						app_version = Number(data.replace(/[^0-9]/ig, ""))
					}).catch((err) => {})
				}
			})
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				versionUpgrade().then(res => {
					let resVersion = res.data.AppVersion || '';
					resVersion = Number(resVersion.replace(/[^0-9]/ig, ""))
					if (app_version < resVersion) {
						process.env.NODE_ENV === "production" ?
							uni.setStorageSync('isUpdate', 1) : uni.removeStorageSync('isUpdate')
						uni.showModal({ //提醒用户更新
							title: "立即更新版本",
							success: (res) => {
								if (res.confirm) {
									uni.removeStorageSync('isUpdate')
									let system = plus.os.name;
									if (system === 'Android') {
										let url = javaApk;
										plus.runtime.openURL(url)
										// uni.downloadFile({
										// 	//下载地址
										// 	url: url,
										// 	success: data => {
										// 		console.log(data)
										// 		if (data.statusCode === 200) {
										// 			plus.runtime.install(data
										// 				.tempFilePath, {
										// 					force: false
										// 				},
										// 				function() {
										// 					plus.runtime
										// 						.restart();
										// 				});
										// 		}
										// 	}
										// })
									} else {
										let appleId = devLanguage ? 1490797314 :
											1563667378;
										plus.runtime.launchApplication({
											action: `itms-apps://itunes.apple.com/cn/app/id${appleId}`
										}, function(e) {});
									}
								} else if (res.cancel) {
									if (modileSystem == 'ios') {
										plus.ios.import("UIApplication")
											.sharedApplication()
											.performSelector("exit")
									} else if (modileSystem == 'android') {
										plus.runtime.quit();
									}
								}
							}
						})
					}
				})
			})
			//#endif  
		},
		onShow: function() {

		},
		onHide: function() {

		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uview-ui/index.scss";
	@import "@/uview-ui/demo.scss";
	@import "@/assets/iconfont/ym/iconfont.css";
	@import "@/assets/iconfont/custom/iconfont.css";
	@import "@/assets/scss/common.scss";
</style>
