<template>
	<view>
		<template v-if="config.formType == 1">
			<crmOrder ref="form" @eventReceiver="eventReceiver" v-if="config.enCode==='crmOrder'" />
			<leaveApply ref="form" @eventReceiver="eventReceiver" v-if="config.enCode==='leaveApply'" />
			<salesOrder ref="form" @eventReceiver="eventReceiver" v-if="config.enCode==='salesOrder'" />
		</template>
		<template v-else>
			<dynamicForm ref="form" @eventReceiver="eventReceiver" @setBtnLoad="setBtnLoad" />
		</template>
	</view>
</template>

<script>
	import dynamicForm from '@/pages/workFlow/workFlowForm/dynamicForm'
	import salesOrder from '@/pages/workFlow/workFlowForm/salesOrder'
	import leaveApply from '@/pages/workFlow/workFlowForm/leaveApply'
	import crmOrder from '@/pages/workFlow/workFlowForm/crmOrder'
	export default {
		components: {
			crmOrder,
			dynamicForm,
			leaveApply,
			salesOrder
		},
		props: {
			config: {
				type: Object,
				default: () => {}
			},
		},
		methods: {
			eventReceiver(formData, eventType) {
				this.$emit('eventReceiver', formData, eventType)
			},
			setBtnLoad(val) {
				this.$emit('setBtnLoad', val)
			}
		}
	}
</script>
