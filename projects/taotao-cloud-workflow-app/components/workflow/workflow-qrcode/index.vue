<template>
	<view class="workflow-qrcode">
		<template v-if="qrcode">
			<tki-qrcode ref="qrcode" :cid="cid" :val="qrcode" :size="size" :background="colorLight"
				:foreground="colorDark" onval loadMake :showLoading="false" />
		</template>
	</view>
</template>
<script>
	import tkiQrcode from "./tki-qrcode/tki-qrcode.vue"
	let unique = 0

	export default {
		props: {
			dataType: {
				type: String,
				default: 'static'
			},
			colorLight: {
				type: String,
				default: '#000'
			},
			colorDark: {
				type: String,
				default: '#fff'
			},
			relationField: {
				type: String,
				default: ''
			},
			formData: {
				type: Object
			},
			size: {
				type: Number,
				default: 200
			},
			staticText: {
				type: String,
				default: ''
			}
		},
		components: {
			tkiQrcode
		},
		computed: {
			qrcode() {
				if (this.dataType === 'static') {
					return this.staticText
				} else if (this.dataType === 'relation') {
					return this.relationText
				} else {
					if (this.formData && this.dynamicModelExtra && this.dynamicModelExtra.id && this.dynamicModelExtra
						.modelId) {
						const json = {
							t: 'DFD',
							id: this.dynamicModelExtra.id,
							mid: this.dynamicModelExtra.modelId,
							mt: this.dynamicModelExtra.type,
							fid: this.dynamicModelExtra.flowId || '',
							pid: this.dynamicModelExtra.processId || '',
							ftid: this.dynamicModelExtra.taskId || '',
							opt: this.dynamicModelExtra.opType
						}
						return JSON.stringify(json)
					}
					return ''
				}
			},
			dynamicModelExtra() {
				return uni.getStorageSync('dynamicModelExtra') || null
			}
		},
		data() {
			return {
				cid: '',
				relationText: "",
			}
		},
		created() {
			this.cid = this.uuid()
		},
		watch: {
			formData: {
				handler: function(val) {
					if (val && this.dataType === 'relation' && this.relationField) {
						this.relationText = val[this.relationField]
					}
				},
				deep: true,
				immediate: true
			},
		},
		methods: {
			uuid() {
				const time = Date.now()
				const random = Math.floor(Math.random() * 1000000000)
				unique++
				return 'qrcode_' + random + unique + String(time)
			}
		},
	}
</script>
<style lang="scss" scoped>
	.workflow-qrcode {
		width: 100%;
		overflow: hidden;
		margin-bottom: -20rpx;
	}
</style>
