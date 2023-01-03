<template>
	<view class="candidateForm-v">
		<u-popup mode="left" :popup="false" v-model="value" length="auto" @close="close" width="100%">
			<view class="workflow-wrap workflow-wrap-form">
				<u-form :model="candidateForm" ref="candidateForm" :errorType="['toast']" label-position="left"
					label-width="150" label-align="left" class="workflow-form">
					<!-- 单行输入 -->
					<u-form-item prop="comInput" label-width="250" v-for="(item,index) in candidateForm.list"
						:key="index" :label="item.label">
						<u-input type="select" :select-open="item.selectShow" v-model="item.value"
							@click="openSelect(item)" placeholder="请选择审批候选人">
						</u-input>
					</u-form-item>
				</u-form>
				<view class="buttom-actions">
					<u-button class="buttom-btn" @click="cancel">取消</u-button>
					<u-button class="buttom-btn" type="primary" @click="submit">确定</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},

			candidateList: {
				type: Array,
				default: []
			},
			formData: {
				type: Object,
				default: {}
			},
			taskId: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				innerValue: '',
				candidateForm: {
					list: [],
				},

				nodeId: '',
				selectId: {},
				rules: {},
				selectList: [],
				selectVal: {}
			};
		},
		watch: {
			candidateList(val) {
				this.candidateForm.list = JSON.parse(JSON.stringify(val))
				this.candidateForm.list = this.candidateForm.list.map(o => ({
					...o,
					label: o.nodeName + '审批人',
					value: '',
					selectShow: false
				}))
			}
		},
		created() {
			uni.$on('confirm', (data, id) => {
				this.selectConfirm(data, id)
			})
		},
		onUnload() {
			uni.$off('confirm')
		},
		methods: {
			openSelect(item) {
				this.selectList = []
				for (let o in this.selectVal) {
					if (o === item.nodeId) this.selectList = this.selectVal[o]
				}
				item.formData = this.formData
				item.taskId = this.taskId
				item.selectList = !item.value ? [] : this.selectList
				uni.navigateTo({
					url: '/pages/workFlow/candiDateUserSelect/index?data=' + encodeURIComponent(JSON.stringify(
						item))
				})
			},

			selectConfirm(e, id) {
				let selectData = e;
				let selectVal = [];
				let val = [];
				let selectId = [];
				let nodeId = '';
				if (!selectData.length) {
					delete this.selectVal[id]
					delete this.selectId[id]
					for (let i = 0; i < this.candidateForm.list.length; i++) {
						if (id === this.candidateForm.list[i].nodeId) {
							this.candidateForm.list[i].value = ""
						}
					}
				}
				for (let i = 0; i < this.candidateForm.list.length; i++) {
					for (let o = 0; o < selectData.length; o++) {
						if (selectData[o].nodeId === this.candidateForm.list[i].nodeId) {
							nodeId = selectData[o].nodeId
							val.push(selectData[o].userName)
							selectVal.push(selectData[o])
							this.candidateForm.list[i].value = val.join(',')
							selectId.push(selectData[o].userId)
							this.$set(this.selectId, selectData[o].nodeId, selectId)
						}
					}
				}
				this.$set(this.selectVal, nodeId, selectVal)
			},


			submit() {
				for (let rules of this.candidateForm.list) {

					if (!rules.value) return this.$u.toast(
						`${rules.nodeName}不能为空`
					)
				}
				this.$emit('submitCandidate', this.selectId);
			},
			cancel() {
				this.close()
			},
			close() {
				this.$emit('input', false);
			}

		}
	};
</script>
<style lang="scss" scoped>
	.candidateForm-v {

		.workflow-wrap,
		.workflow-wrap-form {
			padding: 0;
		}
	}
</style>
