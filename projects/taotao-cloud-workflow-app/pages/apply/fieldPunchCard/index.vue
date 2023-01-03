<template>
	<view class="map-v">
		<view class="page-body">
			<view class="page-section page-section-gap">
				<!-- #ifndef H5 -->
				<map id="map" style="width: 100%; height: 500px;" :style="{height:height+'px'}" show-locatio="true"
					:latitude="latitude" :longitude="longitude" :markers="markers" :circles="circles">
				</map>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view id="container">
					<baidu-map :style="{width:map.width,height:map.height}" class="map"
						ak="Cz8TrZF4GRzFGT30HXhyhqbegYjQ4vE5" :zoom="map.zoom"
						:center="{lng: map.center.lng, lat: map.center.lat}" @ready="handler" :double-click-zoom="true"
						:pinch-to-zoom="true">
						<!--比例尺控件-->
						<bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
						<bm-marker :position="{lng: longitude, lat: latitude}" :dragging="false"></bm-marker>
						<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"
							@locationSuccess="locationSuccess"></bm-geolocation>
						<bm-circle :center="circlePath.center" :radius="circlePath.radius" stroke-color="blue"
							:stroke-opacity="0.5" :stroke-weight="2" :editing="false"></bm-circle>
						<bm-marker :position="center" :dragging="false"></bm-marker>
					</baidu-map>
				</view>
				<!-- #endif -->
			</view>

			<view class="exhibition-list u-p-l-32 u-p-r-32">
				<view class="u-border-bottom cell-navigate">
					<view class="txtBox">
						<view class="u-font-30">我的位置</view>
						<view class="u-font-24">{{locationcourier}}</view>
					</view>
				</view>
				<view class="u-border-bottom u-p-t-20 u-p-b-20">
					<view class="">备注</view>
					<view class="u-border-bottom u-p-b-20">
						<input v-model="description" placeholder="备注" />
					</view>
				</view>
				<view class="buttom-box">
					<u-button type="primary" @click="normalclockin">{{clockin}}</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import resources from '@/libs/resources.js'
	// #ifdef MP-WEIXIN
	import bmap from '@/pages/apply/fieldPunchCard/bmap/bmap-wx.min.js'
	var wxMarkerData = [];
	// #endif
	// #ifdef H5
	import BaiduMap from '@/pages/apply/fieldPunchCard/map/map/Map.vue'
	import BmScale from '@/pages/apply/fieldPunchCard/map/controls/Scale.vue'
	import BmMarker from '@/pages/apply/fieldPunchCard/map/overlays/Marker.vue'
	import BmCircle from '@/pages/apply/fieldPunchCard/map/overlays/Circle.vue'
	import BmGeolocation from '@/pages/apply/fieldPunchCard/map/controls/Geolocation.vue'
	// #endif
	export default {
		components: {
			// #ifdef H5
			BaiduMap,
			BmScale,
			BmMarker,
			BmCircle,
			BmGeolocation
			// #endif
		},
		data() {
			return {
				againlocation: resources.extend.againlocation,
				height: 0,
				imageInfo: {},
				locationcourier: '',
				description: '',
				latitude: 39.909,
				longitude: 116.39742,
				markers: [{
					latitude: 39.909,
					longitude: 116.39742,
				}, {
					latitude: 39.90,
					longitude: 116.39,
				}],
				clockin: "正常打卡",
				circles: [{
					latitude: 39.909,
					longitude: 116.39742,
					radius: 100,
					strokeWidth: 0.5,
					color: '#339AFFCC',
					fillColor: '#BAE6FD4D'
				}],
				rgcData: {},
				// #ifdef H5
				map: {
					center: {
						lng: 116.39742,
						lat: 39.909
					},
					zoom: 12,
					width: '100%',
					height: '710px'
				},
				circlePath: {
					center: {
						lng: 116.39742,
						lat: 39.909
					},
					radius: 500
				},
				center: {
					lng: 116.39742,
					lat: 39.909
				},
				// #endif
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					this.longitude = res.longitude;
					this.latitude = res.latitude;
					this.markers[0].longitude = res.longitude;
					this.markers[0].latitude = res.latitude;
					this.markers[1].longitude = res.longitude;
					this.markers[1].latitude = res.latitude;
					this.circles[0].longitude = res.longitude;
					this.circles[0].latitude = res.latitude;
					var point = new plus.maps.Point(res.longitude, res.latitude);
					plus.maps.Map.reverseGeocode(point, {}, (event) => {
						this.locationcourier = event.address;
					})
					this.plusgetLocation();
				}
			});
			// #endif
			// #ifdef MP-WEIXIN
			var BMap = new bmap.BMapWX({
				ak: 'Y5BfYPpsbZ5c1xx9vt480gcvzWSdzXhY'
			});
			var fail = function(data) {
				// console.log(data)
			};
			var success = (data) => {
				wxMarkerData = data.wxMarkerData;
				this.longitude = wxMarkerData[0].longitude;
				this.latitude = wxMarkerData[0].latitude;
				this.markers[0].longitude = wxMarkerData[0].longitude;
				this.markers[0].latitude = wxMarkerData[0].latitude;
				this.markers[1].longitude = wxMarkerData[0].longitude;
				this.markers[1].latitude = wxMarkerData[0].latitude;
				this.circles[0].longitude = wxMarkerData[0].longitude;
				this.circles[0].latitude = wxMarkerData[0].latitude;
				this.locationcourier = wxMarkerData[0].address;
			}
			// 发起regeocoding检索求 
			BMap.regeocoding({
				fail: fail,
				success: success,
				iconPath: resources.extend.location,
				iconTapPath: resources.extend.location
			});
			// #endif
		},
		mounted() {
			let _this = this;
			// 获取设备宽度
			uni.getSystemInfo({
				success: function(res) {
					_this.height = res.windowHeight;
				}
			});
			let exhibition = uni.createSelectorQuery().select(".exhibition-list");
			exhibition.boundingClientRect(data => {
				_this.height = _this.height - data.height;
			}).exec();
		},
		methods: {
			plusgetLocation() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						this.longitude = res.longitude;
						this.latitude = res.latitude;
						this.markers[1].longitude = res.longitude;
						this.markers[1].latitude = res.latitude;
						var point = new plus.maps.Point(res.longitude, res.latitude);
						plus.maps.Map.reverseGeocode(point, {}, (event) => {
							this.locationcourier = event.address;
						})
					}
				});
			},
			bmapregeocoding() {
				var BMap = new bmap.BMapWX({
					ak: 'Y5BfYPpsbZ5c1xx9vt480gcvzWSdzXhY'
				});
				var fail = function(data) {
					
				};
				var success = (data) => {
					wxMarkerData = data.wxMarkerData;
					this.longitude = wxMarkerData[0].longitude;
					this.latitude = wxMarkerData[0].latitude;
					this.markers[1].longitude = wxMarkerData[0].longitude;
					this.markers[1].latitude = wxMarkerData[0].latitude;
					this.locationcourier = wxMarkerData[0].address;
				}
				// 发起regeocoding检索求 
				BMap.regeocoding({
					fail: fail,
					success: success,
					iconPath: resources.extend.location,
					iconTapPath: resources.extend.location
				});
			},
			againLocation() {
				// #ifdef APP-PLUS
				this.plusgetLocation();
				// #endif
				// #ifdef MP-WEIXIN
				// 新建百度地图对象 
				this.bmapregeocoding();
				// #endif
			},
			normalclockin() {
				let data = {
					locationcourier: this.locationcourier,
					description: this.description,
					imageInfo: JSON.stringify(this.imageInfo)
				}
				uni.showModal({
					content: '表单数据内容：' + JSON.stringify(data),
					showCancel: false
				});
			},
			upimage() {
				uni.chooseImage({
					count: 1, //默认9
					sourceType: ['camera'], //从相册选择
					success: (res) => {
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: (image) => {
								this.imageInfo = {
									height: image.height,
									orientation: image.orientation,
									path: image.path,
									type: image.type,
									width: image.width,
									size: res.tempFiles[0].size
								}
							}
						});
					}
				});
			},
			
			// #ifdef H5
			//地图初始化
			handler({
				BMap,
				map
			}) {
				this.map.width = document.getElementById("container").clientWidth;
				this.map.height = this.height + 'px';
				var geoc = new BMap.Geocoder();
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition((r) => {
					this.longitude = r.longitude
					this.latitude = r.latitude
					this.circlePath.center = r.point;
					this.map.center = r.point;
					geoc.getLocation(r.point, (rs) => {
						var addComp = rs.addressComponents;
						this.locationcourier = addComp.province + addComp.city + addComp.district + addComp
							.street + addComp.streetNumber
					});
				}, {
					enableHighAccuracy: true
				})
			},
			//查看详情
			lookDetail(data, target) {
				this.infoWindow.show = true;
				this.infoWindow.info = data;
				this.activeName = data.name;
				//为弹窗口标题添加title
				this.$nextTick(() => {
					var win = document.querySelector(".BMap_bubble_title");
					win.title = this.activeName;
				})
				if (target == 'left') { //点击的是左侧列表项，则不需要滚动
					this.map.center = {
						lng: data.lng,
						lat: data.lat
					};
					this.map.zoom = 15;
					return;
				}
				//滚动到指定元素位置
				this.$nextTick(() => {
					var obj = document.querySelector(".active");
					var scrollTop = obj.offsetTop;
					this.$refs.box.scrollTop = scrollTop - 180;
				})
			},
			locationSuccess(e) {
				var addComp = e.addressComponent;
				this.center = e.point;
				this.latitude = e.point.lat;
				this.longitude = e.point.lng;
				this.locationcourier = addComp.province + addComp.city + addComp.district + addComp.street + addComp
					.streetNumber
			}
			// #endif
		}
	}
</script>

<style scoped>
	.cover-view-location {
		background: #FFFFFF;
	}

	.againlocation {
		position: relative;
		background: #FFFFFF;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		padding: 10rpx 16rpx;
	}

	.againlocation button {
		border: 0;
		background: #FFFFFF;
	}

	button::after {
		border: none;
	}

	.cover-view {
		position: absolute;
		top: calc(100% - 150rpx);
		left: calc(46% - 300rpx);
	}

	.againlocation-image {
		width: 60rpx;
		height: 60rpx;
	}

	.cell-navigate {
		width: 100%;
		height: 128rpx;
		overflow: hidden;
		/* padding: 16rpx 28rpx 16rpx 0; */
		padding-right: 28rpx;
		line-height: 48rpx;
		position: relative;
		display: flex;
		flex: 1;
		justify-content: space-between;
		align-items: center;
		/* background-color: #FFFFFF; */
	}

	.txtBox :last-child {
		color: #9a9a9a;
	}
</style>
