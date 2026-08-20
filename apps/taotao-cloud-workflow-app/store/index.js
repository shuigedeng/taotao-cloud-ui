import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

/* 简化import引入 require.context(directory, useSubdirectories, regExp)directory: 要查找的文件路径
useSubdirectories: 是否查找子目录
regExp: 要匹配文件的正则*/
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	// set './app.js' => 'app'
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
	const value = modulesFiles(modulePath)
	modules[moduleName] = value.default
	return modules
}, {})

const store = new Vuex.Store({
	modules,
	getters
})

export default store
