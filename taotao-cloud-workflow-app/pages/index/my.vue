<template>
	<view class="my-v" v-if="loading">
		<view class="u-flex user-box u-p-l-32 u-p-r-22 u-p-b-30">
			<view class="u-m-r-20">
				<u-avatar size="140" @click='chooseAvatar' :src='avatarSrc'></u-avatar>
			</view>
			<view class="u-flex-1 f-right" @click="personalPage('/pages/my/personalData/index')">
				<view class="u-font-18">{{baseInfo.realName}}</view>
				<view class="u-m-l-10 u-p-10">
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item title="我的组织" @click="openPage('/pages/my/business/index','Organize')">
					<text class="icon-ym icon-ym-zuzhi u-m-r-16 u-font-36" slot="icon" />
				</u-cell-item>
				<u-cell-item title="我的岗位" @click="openPage('/pages/my/business/index','Position')">
					<text class="icon-ym icon-ym-wf-outgoingApply u-m-r-16 u-font-36" slot="icon" />
				</u-cell-item>
				<u-cell-item title="我的下属" @click="openPage('/pages/my/subordinate/index')">
					<text class="icon-ym icon-ym-generator-section u-m-r-16 u-font-36" slot="icon" />
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<!-- #ifndef H5 -->
				<u-cell-item title="扫一扫" @click="scanCode()">
					<text class="icon-ym icon-ym-scanCode1 u-m-r-16 u-font-36" style="font-weight: bold;" slot="icon" />
				</u-cell-item>
				<!-- #endif -->
			</u-cell-group>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item title="账号安全" @click="openPage('/pages/my/accountSecurity/index')">
					<text class="icon-ym icon-ym-zhanghao u-m-r-16 u-font-36" slot="icon" />
				</u-cell-item>
			</u-cell-group>
		</view>
		<!-- #endif -->
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item title="设置" @click="openPage('/pages/my/settings/index')">
					<text class="icon-ym icon-ym-shezhi u-m-r-16 u-font-36" slot="icon" />
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import IndexMixin from './mixin.js'
	import {
		UpdateAvatar
	} from '@/api/common'
	import {
		UserSettingInfo
	} from '@/api/common'
	export default {
		mixins: [IndexMixin],
		data() {
			return {
				avatarSrc: '',
				baseInfo: {},
				loading: false
			}
		},
		computed: {
			baseURL() {
				return this.define.comUploadUrl
			},
			baseURL2() {
				return this.define.baseURL
			},
			token() {
				return this.$store.getters.token
			},
			report() {
				return this.define.report
			}
		},
		onShow() {
			UserSettingInfo().then(res => {
				this.baseInfo = res.data || {}
				this.avatarSrc = this.baseURL2 + this.baseInfo.avatar
				this.loading = true
			})
		},
		methods: {
			chooseAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: (res) => {
						let tempFilePaths = res.tempFilePaths[0]
						uni.uploadFile({
							url: this.baseURL + 'userAvatar',
							filePath: tempFilePaths,
							name: 'file',
							header: {
								'Authorization': this.token
							},
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								UpdateAvatar(data.data.name).then(res => {
									this.$u.toast('头像更换成功')
									this.avatarSrc = this.baseURL2 + data.data.url
								})
							},
							fail: (err) => {
								this.$u.toast('头像更换失败')
							}
						});
					}
				});
			},
			openPage(path, type) {
				if (!path) return
				let url = !!type ? path + '?majorType=' + type : path
				uni.navigateTo({
					url: url
				})
			},
			personalPage(path) {
				if (!path) return
				uni.navigateTo({
					url: path + '?baseInfo=' + encodeURIComponent(JSON
						.stringify(this.baseInfo))
				})
			},
			isJSON(str) {
				try {
					var obj = JSON.parse(str);
					if (typeof obj == 'object' && obj) {
						return true;
					} else {
						return false;
					}
				} catch (e) {
					return false;
				}
			},
			scanCode() {
				uni.scanCode({
					success: res => {
						if (this.isJSON(res.result)) {
							const result = JSON.parse(res.result)
							if (result.t === 'ADP') {
								uni.navigateTo({
									url: '/pages/apply/dynamicModel/index?isPreview=1&id=' + result
										.id,
									fail: (err) => {
										this.$u.toast("暂无此页面")
									}
								})
							}
							if (result.t === 'DFD') {
								let config = JSON.stringify(result)
								uni.navigateTo({
									url: '/pages/apply/dynamicModel/scanForm?config=' + config,
									fail: (err) => {
										this.$u.toast("暂无此页面")
									}
								})
							}
							if (result.t === 'WFP') {
								uni.navigateTo({
									url: '/pages/workFlow/scanForm/index?id=' + result
										.id,
									fail: (err) => {
										this.$u.toast("暂无")
									}
								})
							}
							if (result.t === 'report') {
								let url =
									`${this.report}/preview.html?id=${result.id}&token=${this.token}&page=1&from=menu`
								uni.navigateTo({
									url: '/pages/apply/externalLink/index?url=' + encodeURIComponent(
										url),
									fail: (err) => {
										this.$u.toast("暂无")
									}
								})
							}
						} else {
							uni.navigateTo({
								url: '/pages/my/scanResult/index?result=' + res.result,
								fail: (err) => {
									this.$u.toast("暂无此页面")
								}
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.my-v {
		.user-box {
			background-color: #fff;
		}

		.f-right {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			text-align: center;
		}
	}
</style>
