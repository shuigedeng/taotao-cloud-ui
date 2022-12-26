import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import workflow from '@/utils/workflow'

const {
  showSettings,
  tagsView,
  tagsIcon,
  showLanguage,
  showSearch,
  useCache,
  fixedHeader,
  sidebarLogo,
  themeClass,
  slideClass,
  layoutType,
  sysConfig
} = defaultSettings

const state = {
  theme: variables.theme,
  loginNeedCode: workflow.storageGet('loginNeedCode') === null ? false : workflow.storageGet('loginNeedCode'),
  showSettings: showSettings,
  tagsView: workflow.storageGet('tagsView') === null ? tagsView : workflow.storageGet('tagsView'),
  tagsIcon: workflow.storageGet('tagsIcon') === null ? tagsIcon : workflow.storageGet('tagsIcon'),
  showLanguage: workflow.storageGet('showLanguage') === null ? showLanguage : workflow.storageGet('showLanguage'),
  showSearch: workflow.storageGet('showSearch') === null ? showSearch : workflow.storageGet('showSearch'),
  useCache: workflow.storageGet('useCache') === null ? useCache : workflow.storageGet('useCache'),
  fixedHeader: workflow.storageGet('fixedHeader') === null ? fixedHeader : workflow.storageGet('fixedHeader'),
  sidebarLogo: workflow.storageGet('sidebarLogo') === null ? sidebarLogo : workflow.storageGet('sidebarLogo'),
  themeClass: workflow.storageGet('themeClass') === null ? themeClass : workflow.storageGet('themeClass'),
  slideClass: workflow.storageGet('slideClass') === null ? slideClass : workflow.storageGet('slideClass'),
  layoutType: workflow.storageGet('layoutType') === null ? layoutType : workflow.storageGet('layoutType'),
  sysConfig: workflow.storageGet('sysConfig') === null ? sysConfig : workflow.storageGet('sysConfig')
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
      workflow.storageSet({
        [key]: value
      })
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
