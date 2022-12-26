import Vue from 'vue'
import App from './App'
import store from './store'
import share from '@/utils/share.js'
import uView from '@/uview-ui'
import setPermission from '@/libs/codeGeneration.js'
Vue.use(uView)
Vue.mixin(share)
Vue.prototype.$setPermission = setPermission
import * as filters from '@/filters'
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

// 添加实例属性
Object.assign(Vue.prototype, {
	define: require("./utils/define").default,
	request: require("./utils/request").default,
	jnpf: require("./utils/jnpf").default,
	$store: store
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
