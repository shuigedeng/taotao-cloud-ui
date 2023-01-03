<template>
	<view class="workflow-barcode">
		<template v-if="barcode">
			<tki-barcode ref="barcode" :format="format" :cid="cid" :val="barcode" :opations="opations" onval
				:loadMake="loadMake" />
		</template>
	</view>
</template>
<script>
	import tkiBarcode from "./tki-barcode/tki-barcode.vue"
	let unique = 0

	export default {
		props: {
			dataType: {
				type: String,
				default: 'static'
			},
			format: {
				type: String,
				default: 'code128'
			},
			lineColor: {
				type: String,
				default: '#000'
			},
			background: {
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
			width: {
				type: Number,
				default: 4
			},
			height: {
				type: Number,
				default: 40
			},
			staticText: {
				type: String,
				default: ''
			}
		},
		components: {
			tkiBarcode
		},
		computed: {
			barcode() {
				if (this.dataType === 'static') {
					return this.staticText
				} else {
					return this.relationText
				}
			},
			opations() {
				return {
					format: this.format,
					width: this.width,
					height: this.height,
					displayValue: false,
					lineColor: this.lineColor,
					background: this.background
				}
			},
			loadMake() {
				let loadMake = false
				// #ifndef APP
				loadMake = true
				// #endif
				return loadMake
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
			// #ifdef APP
			setTimeout(() => {
				this.$refs.barcode._makeCode()
			}, 2000);
			// #endif
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
				return 'barcode_' + random + unique + String(time)
			}
		},
	}
</script>
<style lang="scss" scoped>
	.workflow-barcode {
		width: 100%;
		overflow: hidden;
		margin-bottom: -20rpx;
	}
</style>
