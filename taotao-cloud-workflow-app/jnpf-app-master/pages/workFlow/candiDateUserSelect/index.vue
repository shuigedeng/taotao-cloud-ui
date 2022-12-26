<template>
	<view class="candidateForm-v">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :sticky="true"
			:down="downOption" :up="upOption" :bottombar="false">
			<view class="treeSelect-search search-box_sticky">
				<u-search placeholder="请输入关键词搜索" v-model="keyword" height="72" :show-action="false"
					@change="search" bg-color="#f0f2f6" shape="square">
				</u-search>
				<view class="alreadySelect">
					<view class="alreadySelect__box u-flex-col">
						<view class="alreadySelect_hd u-flex">
							<view>已选</view>
							<view v-if="multiple" @click="setCheckAll" style="color: #2979ff;">清空列表
							</view>
						</view>
						<view class="select__box u-flex-col">
							<scroll-view scroll-y="true" style="max-height: 200px;">
								<view class="u-flex select__list">
									<u-tag closeable @close="delSelect(index)" v-for="(list,index) in selectList"
										:key="index" :text="list.userName" class="u-selectTag" />
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</view>
			<view class="mescroll_body">
				<view style="" class="lists_box">
					<view class="list-cell-txt u-border-bottom" v-for="(list,index) in list" :key="index"
						@click="onSelect(list)">
						<view class="u-font-30">{{list.userName}}</view>
					</view>
				</view>
			</view>
		</mescroll-body>
		<!-- 底部按钮 -->
		<view class="flowBefore-actions">
			<template>
				<u-button class="buttom-btn" @click="getResult('cancel')">
					{{'取消'}}
				</u-button>
				<u-button class="buttom-btn" type="primary" @click.stop="getResult('confirm')">
					{{'确定'}}
				</u-button>
			</template>
		</view>
	</view>
</template>

<script>
	import {
		CandidateUser
	} from '@/api/workFlow/flowBefore'
	import resources from '@/libs/resources.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				downOption: {
					use: true,
					auto: true
				},
				upOption: {
					page: {
						num: 0,
						size: 20,
						time: null
					},
					empty: {
						use: true,
						icon: resources.message.nodata,
						tip: "暂无数据",
						fixed: true,
						top: "300rpx",
					},
					textNoMore: '没有更多数据',
				},
				onLoadData: {},
				safeAreaInsetBottom: true,
				list: [],
				show: false,
				keyword: '',
				selectList: [],
				multiple: true
			}
		},
		onLoad(e) {
			this.show = true
			this.onLoadData = JSON.parse(decodeURIComponent(e.data));
			this.selectList = this.onLoadData.selectList
		},
		
		methods: {
			upCallback(page) {
				let query = {
					currentPage: page.num,
					pageSize: page.size,
					keyword: this.keyword,
					formData: this.onLoadData.formData,
					nodeCode: this.onLoadData.nodeId
				}
				CandidateUser(this.onLoadData.taskId || 0, query, {
					load: page.num == 1
				}).then(res => {
					this.mescroll.endSuccess(res.data.list.length);
					if (page.num == 1) this.list = [];
					const list = res.data.list;
					this.list = this.list.concat(list);
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
			search() {
				// 节流,避免输入过快多次请求
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(() => {
					this.list = [];
					this.mescroll.resetUpScroll();
				}, 300)
			},
			onSelect(list) {
				let flag = false;
				for (let i = 0; i < this.selectList.length; i++) {
					if (this.selectList[i].userId === list.userId) {
						flag = true;
						return
					}
				}!flag && this.selectList.push(list)
				this.selectList = this.selectList.map(o => ({
					nodeId: this.onLoadData.nodeId,
					...o
				}))
			},
			delSelect(index) {
				this.selectList.splice(index, 1);
			},
			close() {
				this.list = []
				this.$emit('input', false);
			},
			getResult(type) {
				if (type != 'confirm') return uni.navigateBack();
				uni.$emit(type, this.selectList,this.onLoadData.nodeId);
				uni.navigateBack()
			},
			setCheckAll(){
				this.selectList = []
				// uni.$emit('confirm', this.selectList);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/uview-ui/libs/css/style.components.scss";

	.candidateForm-v {
		padding-bottom: 88rpx;

		.treeSelect-search {
			padding: 20rpx 30rpx 20rpx;

			.alreadySelect {
				width: 100%;
				padding: 30rpx 0rpx 0;

				.alreadySelect__box {
					.alreadySelect_hd {
						width: 100%;
						height: 60rpx;
						justify-content: space-between;
					}

					.select__box {
						width: 100%;
						justify-content: center;

						.select__list {
							padding-top: 10rpx;
							justify-content: flex-start;
							flex-wrap: wrap;

							.u-selectTag {
								margin-bottom: 10rpx;
								margin-left: 10rpx;
							}
						}
					}
				}
			}
		}



		.lists_box {
			height: 100%;

			.list-cell-txt {
				// width: 100%;
				// height: 60rpx;
				// padding-left: 30rpx;
				// line-height: 60rpx;
				display: flex;
				box-sizing: border-box;
				width: 100%;
				padding: 20rpx 32rpx;
				overflow: hidden;
				color: $u-content-color;
				font-size: 28rpx;
				line-height: 24px;
				background-color: #fff;

				.department {
					color: #9A9A9A;
				}
			}
		}
	}
</style>
