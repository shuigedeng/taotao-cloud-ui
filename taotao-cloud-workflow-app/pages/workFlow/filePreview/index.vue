<template>
	<view>
		<web-view :src="fileUrl"></web-view>
	</view>
</template>

<script>
	import {
		getDownloadUrl
	} from '@/api/common'
	export default {
		data() {
			return {
				fileUrl: ''
			}
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: e.name
			})
			this.getFileUrl(e.fileId)
		},
		methods: {
			getFileUrl(fileId) {
				getDownloadUrl('workFlow', fileId).then(res => {
					this.fileUrl = this.define.baseURL + res.data.url;
				})
			}
		}
	}
</script>
