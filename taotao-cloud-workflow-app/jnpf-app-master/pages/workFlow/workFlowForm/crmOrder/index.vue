<template>
	<view class="jnpf-wrap jnpf-wrap-workflow">
		<u-form :model="dataForm" :rules="rules" ref="dataForm" :errorType="['toast']" label-position="left"
			label-width="150" label-align="left" v-show="hide">
			<u-form-item label="订单编码" prop="orderCode" v-if="judgeShow('orderCode')" :required="requiredList.orderCode">
				<u-input v-model="dataForm.orderCode" placeholder="订单编码" disabled></u-input>
			</u-form-item>
			<u-form-item label="客户名称" prop="customerId" :required="requiredList.customerName"
				v-if="judgeShow('customerName')">
				<jnpf-tree-select v-model="dataForm.customerId" placeholder="请选择客户名称" :options="customerOptions"
					@change="onCustomerChange" :props="props" :disabled="judgeWrite('customerName')">
				</jnpf-tree-select>
			</u-form-item>
			<u-form-item label="业务人员" prop="salesmanId" :required="requiredList.salesmanId"
				v-if="judgeShow('salesmanId')">
				<jnpf-org-select v-model="dataForm.salesmanId" placeholder="请选择业务人员" @change="onChange"
					:disabled="judgeWrite('salesmanId')">
				</jnpf-org-select>
			</u-form-item>
			<u-form-item label="订单日期" prop="orderDate" :required="requiredList.orderDate" v-if="judgeShow('orderDate')">
				<jnpf-date-time type="date" placeholder="请选择订单日期" v-model="dataForm.orderDate"
					:disabled="judgeWrite('orderDate')"></jnpf-date-time>
			</u-form-item>
			<view class="jnpf-card">
				<u-form-item label="付款方式" prop="paymentMode" :required="requiredList.paymentMode"
					v-if="judgeShow('paymentMode')">
					<jnpf-select v-model="dataForm.paymentMode" placeholder="请选择付款方式" :options="options"
						:disabled="judgeWrite('paymentMode')">
					</jnpf-select>
				</u-form-item>
				<u-form-item label="付款金额" prop="receivableMoney" v-if="judgeShow('receivableMoney')"
					:required="requiredList.receivableMoney">
					<u-input v-model="dataForm.receivableMoney" type="number" placeholder="付款金额"
						:disabled="judgeWrite('receivableMoney')"></u-input>
				</u-form-item>
				<u-form-item label="定金比率" prop="earnestRate" v-if="judgeShow('earnestRate')"
					:required="requiredList.earnestRate">
					<u-input v-model="dataForm.earnestRate" type="number" placeholder="请输入定金比率"
						:disabled="judgeWrite('earnestRate')"></u-input>
				</u-form-item>
				<u-form-item label="预付定金" prop="prepayEarnest" v-if="judgeShow('prepayEarnest')"
					:required="requiredList.prepayEarnest">
					<u-input v-model="dataForm.prepayEarnest" type="number" placeholder="请输入预付定金"
						:disabled="judgeWrite('prepayEarnest')"></u-input>
				</u-form-item>
				<u-form-item label="运输方式" prop="transportMode" v-if="judgeShow('transportMode')"
					:required="requiredList.transportMode">
					<jnpf-select v-model="dataForm.transportMode" placeholder="请选择付款方式" :options="transportOptions"
						:disabled="judgeWrite('transportMode')">
					</jnpf-select>
				</u-form-item>
				<u-form-item label="发货日期" prop="deliveryDate" v-if="judgeShow('deliveryDate')"
					:required="requiredList.deliveryDate">
					<jnpf-date-time type="date" placeholder="请选择发货日期" v-model="dataForm.deliveryDate"
						:disabled="judgeWrite('deliveryDate')"></jnpf-date-time>
				</u-form-item>
				<u-form-item label="发货地址" prop="deliveryAddress" v-if="judgeShow('deliveryAddress')"
					:required="requiredList.deliveryAddress">
					<u-input v-model="dataForm.deliveryAddress" type="textarea" placeholder="请输入发货地址"
						:disabled="judgeWrite('deliveryAddress')"></u-input>
				</u-form-item>
				<u-form-item label="订单备注" prop="description" v-if="judgeShow('description')"
					:required="requiredList.description">
					<u-input v-model="dataForm.description" type="textarea" placeholder="请输入订单备注"
						:disabled="judgeWrite('description')"></u-input>
				</u-form-item>
				<u-form-item label="相关附件" prop="fileJson" :required="requiredList.fileJson">
					<jnpf-file v-model="fileList" :disabled="judgeWrite('fileJson')" />
				</u-form-item>
			</view>
			<view class="jnpf-table" v-if="judgeShow('goodsList')">
				<view class="jnpf-table-item" v-for="(item,i) in dataForm.goodsList" :key="i">
					<view class="jnpf-table-item-title u-flex u-row-between">
						<text class="jnpf-table-item-title-num">商品添购({{i+1}})</text>
						<view class="jnpf-table-item-title-action"
							v-if="dataForm.goodsList.length>1 && !judgeWrite('goodsList')" @click="delGoods(i)">删除
						</view>
					</view>
					<u-form-item label="商品名称" prop="dataForm.goodsList[i].goodsId"
						:required="requiredList['goodsList-goodsId']">
						<jnpf-tree-select v-model="dataForm.goodsList[i].goodsId" placeholder="请选择商品名称"
							:options="goodsOptions" @change="onGoodsChange($event,i)" :props="props"
							:disabled="judgeWrite('goodsList')">
						</jnpf-tree-select>
					</u-form-item>
					<u-form-item label="规格型号" prop="dataForm.goodsList[i].specifications"
						:required="requiredList['goodsList-specifications']">
						<u-input v-model="dataForm.goodsList[i].specifications" placeholder="规格型号"
							:disabled="judgeWrite('goodsList')"></u-input>
					</u-form-item>
					<u-form-item label="单位" prop="dataForm.goodsList[i].unit"
						:required="requiredList['goodsList-unit']">
						<u-input v-model="dataForm.goodsList[i].unit" placeholder="单位"
							:disabled="judgeWrite('goodsList')"></u-input>
					</u-form-item>
					<u-form-item label="数量" prop="dataForm.goodsList[i].qty" :required="requiredList['goodsList-qty']">
						<u-input v-model="dataForm.goodsList[i].qty" placeholder="数量" type="number"
							@input="count(dataForm.goodsList[i])" :disabled="judgeWrite('goodsList')"></u-input>
					</u-form-item>
					<u-form-item label="单价" prop="dataForm.goodsList[i].price"
						:required="requiredList['goodsList-price']">
						<u-input v-model="dataForm.goodsList[i].price" placeholder="单价" type="number"
							@input="count(dataForm.goodsList[i])" :disabled="judgeWrite('goodsList')"></u-input>
					</u-form-item>
					<u-form-item label="金额" prop="dataForm.goodsList[i].amount"
						:required="requiredList['goodsList-amount']">
						<u-input v-model="dataForm.goodsList[i].amount" placeholder="金额" disabled></u-input>
					</u-form-item>
					<u-form-item label="折扣%" prop="dataForm.goodsList[i].discount"
						:required="requiredList['goodsList-discount']">
						<u-input v-model="dataForm.goodsList[i].discount" placeholder="折扣" type="number"
							@input="count(dataForm.goodsList[i])" :disabled="judgeWrite('goodsList')"></u-input>
					</u-form-item>
					<u-form-item label="税率%" prop="dataForm.goodsList[i].cess"
						:required="requiredList['goodsList-cess']">
						<u-input v-model="dataForm.goodsList[i].cess" placeholder="税率" type="number"
							@input="count(dataForm.goodsList[i])" :disabled="judgeWrite('goodsList')"></u-input>
					</u-form-item>
					<u-form-item label="实际单价" prop="dataForm.goodsList[i].actualPrice"
						:required="requiredList['goodsList-actualPrice']">
						<u-input v-model="dataForm.goodsList[i].actualPrice" placeholder="实际单价" disabled></u-input>
					</u-form-item>
					<u-form-item label="实际金额" prop="dataForm.goodsList[i].actualAmount"
						:required="requiredList['goodsList-actualAmount']">
						<u-input v-model="dataForm.goodsList[i].actualAmount" placeholder="实际金额" disabled></u-input>
					</u-form-item>
					<u-form-item label="备注" prop="dataForm.goodsList[i].description"
						:required="requiredList['goodsList-description']">
						<u-input v-model="dataForm.goodsList[i].description" placeholder="备注" type="textarea"
							:disabled="judgeWrite('goodsList')"></u-input>
					</u-form-item>
				</view>
				<view class="jnpf-table-addBtn" @click="addGoods" v-if="!judgeWrite('goodsList')">
					<u-icon name="plus" color="#2979ff"></u-icon>商品添购
				</view>
			</view>
			<view class="jnpf-table" v-if="judgeShow('collectionPlanList')">
				<view class="jnpf-table-item" v-for="(item,i) in dataForm.collectionPlanList" :key="i">
					<view class="jnpf-table-item-title u-flex u-row-between">
						<text class="jnpf-table-item-title-num">收款计划({{i+1}})</text>
						<view class="jnpf-table-item-title-action" v-if="dataForm.collectionPlanList.length>1"
							@click="delPlan(i)">删除
						</view>
					</view>
					<u-form-item label="收款日期" prop="dataForm.collectionPlanList[i].receivableDate"
						:required="requiredList['collectionPlanList-receivableDate']">
						<jnpf-date-time type="date" placeholder="请选择收款日期"
							v-model="dataForm.collectionPlanList[i].receivableDate"
							:disabled="judgeWrite('collectionPlanList')"></jnpf-date-time>
					</u-form-item>
					<u-form-item label="收款比率%" prop="dataForm.collectionPlanList[i].receivableRate"
						:required="requiredList['collectionPlanList-receivableRate']">
						<u-input v-model="dataForm.collectionPlanList[i].receivableRate" placeholder="收款比率"
							type="number" :disabled="judgeWrite('collectionPlanList')"></u-input>
					</u-form-item>
					<u-form-item label="收款金额" prop="dataForm.collectionPlanList[i].receivableMoney"
						:required="requiredList['collectionPlanList-receivableMoney']">
						<u-input v-model="dataForm.collectionPlanList[i].receivableMoney" placeholder="收款金额"
							type="number" :disabled="judgeWrite('collectionPlanList')"></u-input>
					</u-form-item>
					<u-form-item label="收款方式" prop="dataForm.collectionPlanList[i].receivableMode"
						:required="requiredList['collectionPlanList-receivableMode']">
						<jnpf-select v-model="dataForm.collectionPlanList[i].receivableMode" placeholder="请选择收款方式"
							:options="options" :disabled="judgeWrite('collectionPlanList')">
						</jnpf-select>
					</u-form-item>
					<u-form-item label="收款摘要" prop="dataForm.collectionPlanList[i].abstract"
						:required="requiredList['collectionPlanList-abstract']">
						<u-input v-model="dataForm.collectionPlanList[i].abstract" placeholder="收款摘要" type="textarea"
							:disabled="judgeWrite('collectionPlanList')">
						</u-input>
					</u-form-item>
				</view>
				<view class="jnpf-table-addBtn" @click="addPlan" v-if="!judgeWrite('collectionPlanList')">
					<u-icon name="plus" color="#2979ff"></u-icon>收款计划
				</view>
			</view>
		</u-form>
	</view>
</template>

<script>
	import comMixin from '../mixin'
	import {
		getGoodsList,
		getCustomerList,
		Info,
		Create,
		Update
	} from '@/api/apply/order'
	export default {
		name: 'crmOrder',
		mixins: [comMixin],
		data() {
			return {
				hide: false,
				billEnCode: 'OrderNumber',
				dataForm: {
					id: '',
					customerName: '',
					salesmanId: '',
					orderDate: '',
					orderCode: '',
					paymentMode: '',
					receivableMoney: '',
					earnestRate: '',
					prepayEarnest: '',
					transportMode: '',
					deliveryDate: '',
					deliveryAddress: '',
					description: '',
					customerId: '',
					salesmanName: '',
					goodsList: [],
					collectionPlanList: [],
					fileJson: ''
				},
				rules: {
					customerId: [{
						required: true,
						message: '客户名称不能为空',
						trigger: 'input'
					}],
					salesmanId: [{
						required: true,
						message: '业务人员不能为空',
						trigger: 'input'
					}],
					orderDate: [{
						required: true,
						message: '订单日期不能为空',
						trigger: 'change',
						type: 'number'
					}],
					paymentMode: [{
						required: true,
						message: '付款方式不能为空',
						trigger: 'input'
					}]
				},
				options: [{
					id: '现金',
					fullName: '现金'
				}, {
					id: '转帐',
					fullName: '转帐'
				}, {
					id: '汇票',
					fullName: '汇票'
				}],
				transportOptions: [{
					id: '快递',
					fullName: '快递'
				}, {
					id: '物流',
					fullName: '物流'
				}, {
					id: '配送',
					fullName: '配送'
				}, {
					id: '自提',
					fullName: '自提'
				}],
				props: {
					label: 'text',
					value: 'id',
					children: 'children'
				},
				goodsOptions: [],
				customerOptions: []
			}
		},
		created() {
			uni.showLoading({
				title: '正在加载.....',
				mask: true
			});
			setTimeout(() => {
				this.hide = true
				this.initData()
				uni.hideLoading()
			}, 800)
		},
		methods: {
			selfGetInfo() {
				Info(this.setting.id).then(res => {
					this.dataForm = res.data
					if (this.dataForm.fileJson) {
						this.fileList = JSON.parse(this.dataForm.fileJson)
					}
				})
			},
			selfSubmit() {
				this.dataForm.status = this.eventType === 'submit' ? 0 : 1
				if (this.eventType === 'save') return this.selfHandleRequest()
				uni.showModal({
					title: '提示',
					content: '您确定要提交当前流程吗？',
					success: res => {
						if (res.confirm) {
							this.selfHandleRequest()
						}
					}
				})
			},
			selfHandleRequest() {
				if (!this.dataForm.id) delete(this.dataForm.id)
				const formMethod = this.dataForm.id ? Update : Create
				formMethod(this.dataForm).then(res => {
					uni.showToast({
						title: res.msg,
						complete: () => {
							setTimeout(() => {
								uni.$emit('refresh')
								uni.navigateBack()
							}, 1500)
						}
					})
				})
			},
			initData() {
				getGoodsList().then(res => {
					this.goodsOptions = res.data.list
				})
				getCustomerList().then(res => {
					this.customerOptions = res.data.list
				})
			},
			selfInit() {
				this.addGoods()
				this.addPlan()
			},
			onChange(e) {
				const user = e[0]
				this.dataForm.salesmanName = user.fullName
			},
			addGoods() {
				const item = {
					goodsId: '',
					goodsCode: '',
					goodsName: '',
					specifications: '',
					unit: '',
					qty: '',
					price: '',
					amount: '',
					discount: null,
					cess: null,
					actualPrice: '',
					actualAmount: '',
					description: ''
				}
				this.dataForm.goodsList.push(item)
			},
			delGoods(index) {
				this.dataForm.goodsList.splice(index, 1)
			},
			addPlan() {
				const item = {
					receivableDate: '',
					receivableRate: '',
					receivableMoney: '',
					receivableMode: '',
					abstract: ''
				}
				this.dataForm.collectionPlanList.push(item)
			},
			delPlan(index) {
				this.dataForm.collectionPlanList.splice(index, 1)
			},
			onGoodsChange(e, i) {
				const goods = e[0]
				this.dataForm.goodsList[i] = {
					goodsId: goods.id,
					goodsCode: goods.code,
					goodsName: goods.text,
					specifications: goods.specifications,
					unit: goods.unit,
					qty: 1,
					price: goods.price,
					amount: goods.price,
					discount: 100,
					cess: 0,
					actualPrice: goods.price,
					actualAmount: goods.price,
					description: ''
				}
				this.$forceUpdate()
			},
			onCustomerChange(e) {
				const customer = e[0]
				this.dataForm.customerName = customer.text
			},
			count(row) {
				//金额 = 数量*单价
				row.amount = this.jnpf.toDecimal(parseFloat(row.price) * parseFloat(row.qty))
				//折扣价 = (单价*折扣)
				var discountPrice = row.price * (row.discount / 100);
				//实际单价 = 折扣价 * (1 + (税率 / 100))
				row.actualPrice = this.jnpf.toDecimal(discountPrice * (1 + (row.cess / 100)));
				//实际金额
				row.actualAmount = this.jnpf.toDecimal(parseFloat(row.actualPrice) * parseFloat(row
					.qty))
				this.$forceUpdate()
			}
		}
	}
</script>
