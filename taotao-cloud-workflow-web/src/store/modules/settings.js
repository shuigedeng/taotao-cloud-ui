import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import jnpf from '@/utils/jnpf'

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
  loginNeedCode: jnpf.storageGet('loginNeedCode') === null ? false : jnpf.storageGet('loginNeedCode'),
  showSettings: showSettings,
  tagsView: jnpf.storageGet('tagsView') === null ? tagsView : jnpf.storageGet('tagsView'),
  tagsIcon: jnpf.storageGet('tagsIcon') === null ? tagsIcon : jnpf.storageGet('tagsIcon'),
  showLanguage: jnpf.storageGet('showLanguage') === null ? showLanguage : jnpf.storageGet('showLanguage'),
  showSearch: jnpf.storageGet('showSearch') === null ? showSearch : jnpf.storageGet('showSearch'),
  useCache: jnpf.storageGet('useCache') === null ? useCache : jnpf.storageGet('useCache'),
  fixedHeader: jnpf.storageGet('fixedHeader') === null ? fixedHeader : jnpf.storageGet('fixedHeader'),
  sidebarLogo: jnpf.storageGet('sidebarLogo') === null ? sidebarLogo : jnpf.storageGet('sidebarLogo'),
  themeClass: jnpf.storageGet('themeClass') === null ? themeClass : jnpf.storageGet('themeClass'),
  slideClass: jnpf.storageGet('slideClass') === null ? slideClass : jnpf.storageGet('slideClass'),
  layoutType: jnpf.storageGet('layoutType') === null ? layoutType : jnpf.storageGet('layoutType'),
  sysConfig: jnpf.storageGet('sysConfig') === null ? sysConfig : jnpf.storageGet('sysConfig')
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
      jnpf.storageSet({
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