import {
	mapGetters
} from "vuex"

export default {
	computed: {
		...mapGetters(['badgeNum']),
	},
	onShow() {
		this.setTabBarBadge()
	},
	methods: {
		setTabBarBadge() {
			const badgeNum = this.badgeNum
			if (badgeNum) {
				uni.setTabBarBadge({
					index: 0,
					text: badgeNum > 99 ? '99+' : badgeNum.toString()
				});
			} else {
				uni.removeTabBarBadge({
					index: 0
				});
			}
		}
	}
}
