<template>
	<view>
		<ly-trees v-if="isReady" :props="props" :node-key="props.value" :load="loadNode" lazy :tree-data="treeData"
			show-node-icon :defaultNodeIcon="defaultNodeIcon" />
	</view>
</template>

<script>
	import LyTrees from '@/components/ly-tree/ly-tree-s.vue'
	import {
		getSubordinate
	} from '@/api/common.js'
	let _self;
	export default {
		components: {
			LyTrees
		},
		data() {
			return {
				isReady: false,
				props: {
					label: 'userName',
					isLeaf: 'isLeaf',
					value: "id",
					icon: 'avatar'
				},
				defaultNodeIcon: '../../../static/image/5.png',
				treeData: []
			}
		},
		onLoad() {
			_self = this
			this.isReady = true;
		},
		computed: {
			baseURL() {
				return this.define.baseURL
			}
		},
		methods: {
			loadNode(node, resolve) {
				if (node.level === 0) {
					getSubordinate(node.level).then(res => {
						let data = JSON.parse(JSON.stringify(res.data))
						data.map((o) => {
							o.avatar = _self.baseURL + o.avatar
							return data
						})
						resolve(data)
					})
				} else {
					getSubordinate(node.key).then(res => {
						let data = JSON.parse(JSON.stringify(res.data))
						data.map((o) => {
							o.avatar = _self.baseURL + o.avatar
							return data
						})
						resolve(data)
					})
				}
			}
		}
	}
</script>

<style>

</style>
