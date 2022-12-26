<template>
	<view class="workflow-wrap workflow-wrap-workflow">
		<u-form :model="dataForm" :rules="rules" ref="dataForm" :errorType="['toast']" label-position="left"
			label-width="150" label-align="left">
			<u-form-item label="流程标题" prop="flowTitle" :required="requiredList.flowTitle" v-if="judgeShow('flowTitle')">
				<u-input v-model="dataForm.flowTitle" placeholder="流程标题" :disabled="judgeWrite('flowTitle')"></u-input>
			</u-form-item>
			<u-form-item label="流程编码" prop="billNo" v-if="judgeShow('billNo')" :required="requiredList.billNo">
				<u-input v-model="dataForm.billNo" placeholder="流程编码" disabled></u-input>
			</u-form-item>
			<u-form-item label="紧急程度" prop="flowUrgent" v-if="judgeShow('flowUrgent')"
				:required="requiredList.flowUrgent">
				<workflow-select v-model="dataForm.flowUrgent" placeholder="请选择紧急程度" :options="flowUrgentOptions"
					:disabled="judgeWrite('flowUrgent')">
				</workflow-select>
			</u-form-item>
			<view class="workflow-card">
				<u-form-item label="客户名称" prop="customerName" v-if="judgeShow('customerName')"
					:required="requiredList.customerName">
					<u-input v-model="dataForm.customerName" placeholder="请输入客户名称"
						:disabled="judgeWrite('customerName')"></u-input>
				</u-form-item>
				<u-form-item label="联系人员" prop="contacts" v-if="judgeShow('contacts')"
					:required="requiredList.contacts">
					<u-input v-model="dataForm.contacts" placeholder="请输入联系人员" :disabled="judgeWrite('contacts')">
					</u-input>
				</u-form-item>
				<u-form-item label="开单日期" prop="setOutDate" v-if="judgeShow('setOutDate')"
					:required="requiredList.setOutDate">
					<workflow-date-time type="datetime" v-model="dataForm.setOutDate" placeholder="请输入开单日期"
						:disabled="judgeWrite('setOutDate')"></workflow-date-time>
				</u-form-item>
				<u-form-item label="联系电话" prop="contactPhone" v-if="judgeShow('contactPhone')"
					:required="requiredList.contactPhone">
					<u-input v-model="dataForm.contactPhone" placeholder="请输入联系电话"
						:disabled="judgeWrite('contactPhone')"></u-input>
				</u-form-item>
				<u-form-item label="客户地址" prop="customerAddres" v-if="judgeShow('customerAddres')"
					:required="requiredList.customerAddres">
					<u-input v-model="dataForm.customerAddres" placeholder="输入送客户地址"
						:disabled="judgeWrite('customerAddres')"></u-input>
				</u-form-item>
				<u-form-item label="业务人员" prop="salesman" v-if="judgeShow('salesman')"
					:required="requiredList.salesman">
					<u-input v-model="dataForm.salesman" placeholder="输入业务人员" :disabled="judgeWrite('salesman')">
					</u-input>
				</u-form-item>
				<u-form-item label="发票编号" prop="ticketNum" v-if="judgeShow('ticketNum')"
					:required="requiredList.ticketNum">
					<u-input v-model="dataForm.ticketNum" placeholder="输入发票编号" :disabled="judgeWrite('ticketNum')">
					</u-input>
				</u-form-item>
				<u-form-item label="发票类型" prop="invoiceType" v-if="judgeShow('invoiceType')"
					:required="requiredList.invoiceType">
					<workflow-select v-model="dataForm.invoiceType" placeholder="请选择发票类型" :options="invoiceTypeList"
						:disabled="judgeWrite('invoiceType')"></workflow-select>
				</u-form-item>
				<u-form-item label="付款方式" prop="paymentMethod" v-if="judgeShow('paymentMethod')"
					:required="requiredList.paymentMethod">
					<u-input v-model="dataForm.paymentMethod" placeholder="请输入付款方式"
						:disabled="judgeWrite('paymentMethod')">
					</u-input>
				</u-form-item>
				<u-form-item label="付款金额" prop="paymentMoney" v-if="judgeShow('paymentMoney')"
					:required="requiredList.paymentMoney">
					<u-input v-model="dataForm.paymentMoney" placeholder="输入付款金额"
						:disabled="judgeWrite('paymentMoney')"></u-input>
				</u-form-item>
				<u-form-item label="相关附件" prop="fileJson" v-if="judgeShow('fileJson')"
					:required="requiredList.fileJson">
					<workflow-file v-model="fileList" :disabled="judgeWrite('fileJson')" />
				</u-form-item>
				<u-form-item label="开单备注" prop="description" v-if="judgeShow('description')"
					:required="requiredList.description">
					<u-input v-model="dataForm.description" placeholder="输入开单备注" type="textarea"
						:disabled="judgeWrite('description')"></u-input>
				</u-form-item>
			</view>
			<view class="workflow-table" v-if="judgeShow('entryList')">
				<view class="workflow-table-item" v-for="(item,i) in dataForm.entryList" :key="i">
					<view class="workflow-table-item-title u-flex u-row-between">
						<text class="workflow-table-item-title-num">销售明细({{i+1}})</text>
						<view class="workflow-table-item-title-action"
							v-if="dataForm.entryList.length>1 && !judgeWrite('entryList')" @click="delItem(i)">删除
						</view>
					</view>
					<u-form-item label="商品名称" prop="dataForm.entryList[i].goodsName"
						v-if="judgeShow('entryList-goodsName')" :required="requiredList['entryList-goodsName']">
						<u-input v-model="dataForm.entryList[i].goodsName" placeholder="请输入商品名称"
							:disabled="judgeWrite('entryList-goodsName')"></u-input>
					</u-form-item>
					<u-form-item label="规格类型" prop="dataForm.entryList[i].specifications"
						v-if="judgeShow('entryList-specifications')"
						:required="requiredList['entryList-specifications']">
						<u-input v-model="dataForm.entryList[i].specifications" placeholder="请输入规格类型"
							:disabled="judgeWrite('entryList-specifications')"></u-input>
					</u-form-item>
					<u-form-item label="单位" prop="dataForm.entryList[i].unit" v-if="judgeShow('entryList-unit')"
						:required="requiredList['entryList-unit']">
						<u-input v-model="dataForm.entryList[i].unit" placeholder="请输入单位"
							:disabled="judgeWrite('entryList-unit')"></u-input>
					</u-form-item>
					<u-form-item label="数量" prop="dataForm.entryList[i].qty" v-if="judgeShow('entryList-qty')"
						:required="requiredList['entryList-qty']">
						<u-input v-model="dataForm.entryList[i].qty" placeholder="请输入数量" type="number"
							@input="count(dataForm.entryList[i])" :disabled="judgeWrite('entryList-qty')"></u-input>
					</u-form-item>
					<u-form-item label="单价" prop="dataForm.entryList[i].price" v-if="judgeShow('entryList-price')"
						:required="requiredList['entryList-price']">
						<u-input v-model="dataForm.entryList[i].price" placeholder="请输入单价" type="number"
							@input="count(dataForm.entryList[i])" :disabled="judgeWrite('entryList-price')"></u-input>
					</u-form-item>
					<u-form-item label="金额" prop="dataForm.entryList[i].amount" v-if="judgeShow('entryList-amount')"
						:required="requiredList['entryList-amount']">
						<u-input v-model="dataForm.entryList[i].amount" placeholder="请输入金额" disabled></u-input>
					</u-form-item>
					<u-form-item label="备注" prop="dataForm.entryList[i].description"
						v-if="judgeShow('entryList-description')" :required="requiredList['entryList-description']">
						<u-input v-model="dataForm.entryList[i].description" placeholder="请输入备注" type="textarea"
							:disabled="judgeWrite('entryList-description')"></u-input>
					</u-form-item>
				</view>
				<view class="workflow-table-addBtn" @click="addItem" v-if="!judgeWrite('entryList')">
					<u-icon name="plus" color="#2979ff"></u-icon>添加
				</view>
			</view>
		</u-form>
	</view>
</template>

<script>
	import comMixin from '../mixin'
	export default {
		name: 'SalesOrder',
		mixins: [comMixin],
		data() {
			return {
				billEnCode: 'WF_SalesOrderNo',
				dataForm: {
					flowTitle: '',
					billNo: '',
					flowUrgent: 1,
					customerAddres: '',
					contactPhone: '',
					description: '',
					fileJson: '',
					salesman: '',
					paymentMoney: '',
					paymentMethod: '',
					invoiceType: '',
					setOutDate: '',
					contacts: '',
					customerName: '',
					entryList: [{
						goodsName: '',
						specifications: '',
						unit: '',
						qty: '',
						price: '',
						amount: '',
						description: ''
					}]
				},
				invoiceTypeList: [{
						fullName: "普通发票",
						id: "普通发票",
						checked: false
					},
					{
						fullName: "专业发票",
						id: "专业发票",
						checked: false
					},
					{
						fullName: "其他",
						id: "其他",
						checked: false
					}
				],
			}
		},
		methods: {
			selfInit(data) {
				this.dataForm.flowTitle = this.userInfo.userName + "的销售订单";
			},
			/* 添加子表 */
			addItem() {
				const item = {
					goodsName: '',
					specifications: '',
					unit: '',
					qty: '',
					price: '',
					amount: '',
					description: ''
				}
				this.dataForm.entryList.push(item)

			},
			/* 删除子表 */
			delItem(index) {
				uni.showModal({
					title: '提示',
					content: '确定删除销售明细(' + (index + 1) + ')?',
					success: (res) => {
						if (res.confirm) {
							this.dataForm.entryList.splice(index, 1)
						}
					}
				})
			},

			/* 计算价格 */
			count(row) {
				//金额 = 数量*单价
				row.amount = this.workflow.toDecimal(parseFloat(row.price) * parseFloat(row.qty))
				//折扣价 = (单价*折扣)
				var discountPrice = row.price * (row.discount / 100);
				//实际单价 = 折扣价 * (1 + (税率 / 100))
				row.actualPrice = this.workflow.toDecimal(discountPrice * (1 + (row.cess / 100)));
				//实际金额
				row.actualAmount = this.workflow.toDecimal(parseFloat(row.actualPrice) * parseFloat(row
					.qty))
				this.$forceUpdate()
			},
		}
	}
</script>

<style>

</style>
