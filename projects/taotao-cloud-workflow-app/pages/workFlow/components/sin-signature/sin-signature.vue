<template>
	<view class="signature-wrap">
		<view class="img-wrap" @tap="showSignature()" @touchstart="touchSignature()">
			<text class="icon-ym icon-ym-signature">手写签名</text>
			<image :src="absPrevView" mode="scaleToFill" v-if="!!absPrevView"></image>
		</view>
		<view v-if="!disabled" v-show="show" class="signature-contain">
			<view class="signature-main" style="z-index: 3000;">
				<view class="signature-title"><text v-for="(t,i) in titles" :key="i">{{t}}</text></view>
				<canvas disable-scroll="true" class="signature" :class="cid" canvas-id="cvs" @touchstart="touchstart"
					@touchmove="touchmove" @touchend="touchend"></canvas>
				<view class="signature-btns">
					<view class="btn btn-cancel cu-btn bg-main margin-tb-sm text-white" @tap="cancelSignature()">
						<text>取</text><text>消</text>
					</view>
					<view class="btn btn-clear cu-btn bg-main margin-tb-sm text-white" @tap="clearSignature();">
						<text>清</text><text>空</text>
					</view>
					<view class="btn btn-ok cu-btn bg-main margin-tb-sm text-white" @tap="onOK()">
						<text>确</text><text>定</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var _utf8_encode = function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

	let base64encode = function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
				_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}
	export default {
		cxt: null,
		data() {
			return {
				VERSION: '1.0.0',
				cid: 'cvs',
				show: false,
				ctrl: null,
				listeners: [],
				prevView: '',

				draws: [],
				lines: [],
				line: null,
			};
		},
		props: {
			value: {
				default: '',
			},
			title: {
				type: String,
				default: '请签字',
			},
			disabled: {
				type: Boolean,
				default: false,
			}
		},
		watch: {
			value() {
				this.prevView = this.value;
			}
		},
		computed: {
			titles() {
				return this.title.split('')
			},
			absPrevView() {
				var pv = this.prevView;
				// if(pv){
				// 	pv = this.$wrapUrl(pv)
				// }
				return pv;
			}
		},
		mounted() {
			this.prevView = this.value;
		},
		methods: {
			onOK() {
				let data = this.ctrl.getValue();
				this.$emit('input', data);
				this.prevView = data;
				this.hideSignature();
				let f = this.listeners.shift();
				if (f) {
					f(data);
				}
			},
			touchSignature() {
				let sig = this.prevView
				if (!sig || !sig.length) {
					this.showSignature()
				}
			},
			showSignature() {
				if (this.disabled)
					return;
				if (!this.ctrl) {
					this.initCtrl();
				} else if (!this.show) {
					this.clearSignature();
					this.show = true;
				}
			},
			async getSyncSignature() {
				this.showSignature();
				return await new Promise(async (resolve, reject) => {
					this.listeners.push((res) => {
						resolve(res);
					});
				});
			},
			cancelSignature() {
				this.listeners.map((f) => {
					f(null);
				})
				this.hideSignature();
			},
			hideSignature() {
				this.ctrl && this.ctrl.clear();
				this.show = false;
			},
			clearSignature() {
				this.ctrl && this.ctrl.clear();
			},
			async initCtrl() {
				this.show = true;
				let cxt = uni.createCanvasContext(this.cid, this);
				this.cxt = cxt;
				// cxt.clearRect(0,0,c.width,c.height);
				this.ctrl = {
					width: 0,
					height: 0,
					clear: () => {
						this.lines = [];
						let info = uni.createSelectorQuery().in(this).select("." + this.cid);
						info.boundingClientRect((data) => {
							if (data) {
								cxt.clearRect(0, 0, data.width, data.height);
								if (data.width && data.height) {
									this.ctrl.width = data.width;
									this.ctrl.height = data.height;
								}
							}
						}).exec();
						this.redraw();
					},
					getValue: () => {
						if (!this.lines.length)
							return '';
						let svg = this._get_svg();
						// new Buff
						let b64 = base64encode(svg);
						let data = 'data:image/svg+xml;base64,' + b64;
						return data;
					},
				};
				this.$nextTick(function() {
					this.ctrl.clear();
				})
			},
			_get_svg() {
				let r = -90;
				let paths = [];
				let raww = this.ctrl.width;
				let rawh = this.ctrl.height;
				let width = Math.abs(r) != 90 ? raww : rawh;
				let height = Math.abs(r) == 90 ? raww : rawh;
				let cx = raww / 2;
				let cy = rawh / 2;
				let PI = Math.PI;
				let R = (r || 0) % 360;
				let cosv = Math.cos(R * PI / 180);
				let sinv = Math.sin(R * PI / 180);
				let dcx = (width - raww) / 2;
				let dcy = (height - rawh) / 2;
				let trans = function(p) {
					if (!R) {
						return p;
					} else {
						let nx = (p.x - cx) * cosv - (p.y - cy) * sinv + cx;
						let ny = (p.x - cx) * sinv + (p.y - cy) * cosv + cy;
						return {
							x: nx + dcx,
							y: ny + dcy
						};
					}
					return p;
				}
				this.lines.map(l => {
					if (l.points.length < 2) {
						return;
					}
					let sp = trans(l.start)
					let pts = [`M ${sp.x} ${Number(sp.y)}`];
					l.points.map(p => {
						let np = trans(p)
						pts.push(`L ${np.x} ${Number(np.y)}`);
					});
					paths.push(
						`<path stroke-linejoin="round" stroke-linecap="round" stroke-width="3" stroke="rgb(0,0,0)" fill="none" d="${pts.join(' ')}"/>`
					);
				})
				let svg =
					`<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}">${paths.join('\n')}</svg>`;
				return svg;
			},
			_get_svg_raw() {
				let paths = [];
				this.lines.map(l => {
					if (l.points.length < 2) {
						return;
					}
					let pts = [`M ${l.start.x} ${Number(l.start.y)}`];
					l.points.map(p => {
						pts.push(`L ${p.x} ${Number(p.y)}`);
					});
					paths.push(
						`<path stroke-linejoin="round" stroke-linecap="round" stroke-width="3" stroke="rgb(0,0,0)" fill="none" d="${pts.join(' ')}"/>`
					);
				})
				let width = this.ctrl.width;
				let height = this.ctrl.height;
				let svg =
					`<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}" transform="rotate(-90)">${paths.join('\n')}</svg>`;
				return svg;
			},
			_get_point(e) {
				return {
					x: e.changedTouches[0].x.toFixed(1),
					y: e.changedTouches[0].y.toFixed(1),
				}
			},
			touchstart(e) {
				let p = this._get_point(e);
				this.line = {
					start: p,
					points: [p],
				}
				this.lines.push(this.line);
			},
			touchmove(e) {
				let p = this._get_point(e);
				this.line.points.push(p)
				if (!this.tm) {
					this.tm = setTimeout(() => {
						this.redraw();
						this.tm = 0;
					}, 10)
				}
			},
			touchend(e) {
				let p = this._get_point(e);
				this.line.points.push(p)
				this.line.end = p
				this.redraw()
			},
			redraw() {
				let cxt = this.cxt;
				cxt.setStrokeStyle("#000");
				cxt.setLineWidth(3);
				var last = null;
				this.lines.map(l => {
					cxt.beginPath();
					if (l.points.length < 2) {
						return;
					}
					cxt.moveTo(l.start.x, l.start.y);
					l.points.map(p => {
						cxt.lineTo(p.x, p.y)
					})
					cxt.stroke()
				})

				cxt.draw()
			},
			canvasIdErrorCallback: function(e) {}
		}
	}
</script>

<style lang="scss">
	.signature-wrap {
		height: 100%;
		width: 100%;

		.img-wrap {
			width: 100%;
			display: flex;
			align-items: flex-start;
			text-align: left;
			align-content: flex-start;
			justify-content: flex-start;
			color: #2A79F9;
			flex-direction: column;

			image {
				width: 100%;
			}
		}
	}

	.signature-contain {
		z-index: 9000;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;

		.signature-main {
			background: white;
			flex-direction: row-reverse;
			display: flex;
			align-items: stretch;
			height: 101%;
			overflow: scroll;
		}

		.signature-title {
			font-weight: bold;
			font-size: 18px;
			display: flex;
			padding: 0 20rpx;
			flex-direction: column;
			justify-content: center;
			height: 100vh;
			color: $uni-text-color;

			text {
				transform: rotate(90deg);
			}
		}

		.signature {
			border: 1px dotted black;
			border-bottom: 1px dotted black;
			background: #FFF;
			margin: 10px 0;
			width: 90vw;
			height: 90vh;
			align-self: center;
			// pointer-events:none;
		}

		.signature-btns {
			display: flex;
			padding: 2px;
			// margin-right: 5px;
			flex-direction: column;

			.btn {
				flex-grow: 1;
				flex-shrink: 0;
				padding: 20rpx;
				font-size: 20px;
				margin: 0;
				text-align: center;
				text-decoration: none;
				height: 30vh;
				display: flex;
				align-content: center;
				justify-content: center;
				flex-direction: column;

				text {
					transform: rotate(90deg);
				}

				&+.btn {
					border-top: 1px solid #eee;
				}

				&.btn-clear {
					// background-color: #fc2a07;
					color: $uni-color-success;
				}

				&.btn-cancel {
					// background-color: #eff4f4;
					color: $uni-color-warning;
				}

				&.btn-ok {
					// background-color: $uni-color-success;
					color: $uni-color-primary;
				}
			}
		}
	}
</style>
