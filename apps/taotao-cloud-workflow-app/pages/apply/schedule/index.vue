<template>
	<view class="calendar-v">
		<calendar :lunar="true" :showMonth="true" @change="change" @monthSwitch="monthSwitch" @initdate="initdate" />
		<view class="calendar-b">
			<view class="lunar workflow-card u-m-t-20">
				{{changedate}}
			</view>
			<view v-for="(item,index) in scheduleList" :key="index" class="schedule-item">
				<u-swipe-action :index="index" :show="item.show" @click="removeList" @open="open" :options="options"
					@content-click="goDetail(item.id)">
					<view class="calendar-listBox u-flex-col">
						<text class="startTime u-m-b-15 u-font-24">
							{{item.startTime | date('yyyy-mm-dd hh:MM:ss')}} - {{item.endTime | date('yyyy-mm-dd hh:MM:ss')}}
						</text>
						<view class="content">{{item.content}}</view>
					</view>
				</u-swipe-action>
			</view>
		</view>
		<view class="com-addBtn" @click="goDetail()">
			<u-icon name="plus" size="60" color="#fff" />
		</view>
	</view>
</template>

<script>
	import calendar from './calendar/uni-calendar.vue'
	import {
		getScheduleList,
		delSchedule
	} from '@/api/apply/schedule.js'
	export default {
		components: {
			calendar
		},
		data() {
			return {
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: "#007AFF"
				},
				changedate: '',
				scheduleList: [],
				exhibitionList: [],
				startDate: '',
				endDate: '',
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			}
		},
		methods: {
			/* 初始化请求 */
			initdate(cale, nowDate) {
				let canlender = cale.canlender;
				let weeks = cale.weeks;
				for (let i = 0; i < canlender.length; i++) {
					if (canlender[i].fullDate === nowDate.fullDate) {
						this.changedate = '农历  ' + canlender[i].lunar.IMonthCn + canlender[i].lunar.IDayCn;
						break;
					}
				}
				let data = {
					weeks: weeks,
					canlender: canlender
				}
				this.handleScheduleList(data)
			},
			handleScheduleList(data) {
				let canlender = data.canlender
				let startTime = this.startDate = canlender[0].lunar.cYear + '-' + canlender[0].lunar.cMonth + '-' +
					canlender[0].lunar
					.cDay;
				let endTime = this.endDate = canlender[canlender.length - 1].lunar.cYear + '-' + canlender[canlender
						.length - 1].lunar
					.cMonth + '-' + canlender[canlender.length - 1].lunar.cDay;
				let query = {
					startTime: startTime,
					endTime: endTime,
					dateTime: data.fulldate
				}
				getScheduleList(query).then(res => {

					let signList = res.data.signList;
					if (res.data.todayList) {
						this.scheduleList = res.data.todayList.map(o => ({
							...o,
							show: false
						}));
					}

					for (let i = 0; i < 6; i++) {
						for (let j = 0; j < data.weeks[i].length; j++) {

							let cYear = data.weeks[i][j].lunar.cYear < 10 ? '0' + data.weeks[i][j].lunar
								.cYear : data.weeks[i][j].lunar.cYear;
							let cMonth = data.weeks[i][j].lunar.cMonth < 10 ? '0' + data.weeks[i][j].lunar
								.cMonth : data.weeks[i][j].lunar.cMonth;
							let cDay = data.weeks[i][j].lunar.cDay < 10 ? '0' + data.weeks[i][j].lunar
								.cDay : data.weeks[i][j].lunar.cDay;
							let date = parseInt(cYear + '' + cMonth + '' + cDay)

							// let date = this.$u.date(data.weeks[i][j].lunar.cYear + '-' + data.weeks[i][j].lunar
							// 	.cMonth + '-' + data.weeks[i][j].lunar.cDay, 'yyyymmdd')
							data.weeks[i][j].isSign = signList[date] == 0 ? false : true;
						}
					}
				})
			},
			change(e) {
				let weeks = e.cale.weeks;
				let canlender = e.cale.canlender;
				let lunar = e.lunar;
				this.changedate = '农历  ' + lunar.IMonthCn + lunar.IDayCn;
				let data = {
					weeks: weeks,
					canlender: canlender,
					lunar: lunar,
					fulldate: e.fulldate
				}
				this.handleScheduleList(data)
			},
			monthSwitch(e) {},
			goDetail(id) {
				const url = './form' + (id ? '?id=' + id : '')
				uni.navigateTo({
					url: url
				})
			},
			open(index) {
				this.scheduleList[index].show = true;
				this.scheduleList.map((val, idx) => {
					if (index != idx) this.scheduleList[idx].show = false;
				})
			},
			removeList(index, index1) {
				const item = this.scheduleList[index];
				delSchedule(item.id).then(res => {
					this.scheduleList[index].show = false;
					this.$u.toast('删除成功')
					this.scheduleList.splice(index, 1);
					this.$router.go(0)
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.calendar-v {
		.calendar-b {
			.lunar {
				background-color: #FFFFFF;
				padding: 40rpx 32rpx;
				margin-bottom: 20rpx;
			}

			.calendar-listBox {
				padding: 16rpx 32rpx;
				background-color: #FFFFFF;

				.startTime {
					color: #9a9a9a;
				}
			}
		}

		.schedule-item {
			width: 100%;
			margin-bottom: 20rpx;
		}
	}
</style>
