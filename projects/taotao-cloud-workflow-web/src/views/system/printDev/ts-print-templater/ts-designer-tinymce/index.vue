<template>
  <editor ref="mceEditor" :id="id" v-model="dataValue" v-bind="$attrs" :init="showInit"
    :plugins="showPlugins" :toolbar="showToolbar"
    tinymce-script-src="https://www.72crm.com/npm/tinymce/tinymce.min.js" v-on="$listeners" />
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

import plugins from './plugins'
import toolbar from './toolbar'

let unique = 0

export default {
  name: 'tsDesignerTinymce',
  components: {
    Editor
  },
  inheritAttrs: false,
  props: {
    value: String,
    init: Object,
    height: [String, Number],
    plugins: [String, Array],
    toolbar: [String, Array],
    menubar: [String, Array]
  },
  data() {
    return {
      id: this.uuid(),
      dataValue: '',
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      },
      showInit: {}
    }
  },
  computed: {
    editor() {
      return window.tinymce.get(this.id)
    },

    showToolbar() {
      return this.toolbar != undefined ? this.toolbar : toolbar
    },

    showPlugins() {
      return this.plugins != undefined ? this.plugins : plugins
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val != this.dataValue) {
          this.dataValue = val
        }
      },
      immediate: true,
      deep: true
    },
    dataValue() {
      this.$emit('input', this.dataValue)
    },
    init: {
      handler() {
        this.initTinymce()
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    initTinymce() {
      const initDefault = {
        skin: 'wukong',
        resize: false,
        branding: false,
        language: this.languageTypeList['zh'],
        menubar: this.menubar ? this.menubar : false,
        body_class: 'panel-body',
        image_advtab: true,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        // content_css: ['./static/tinymce/css/tiny-wukong.css'],
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: 'Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        quickbars_insert_toolbar: false,
        nonbreaking_force_tab: true,
        convert_urls: false,
        toolbar_mode: 'sliding',
        ...this.init
      }

      /**
       * statusbar 隐藏底部状态栏
       */

      if (this.height != undefined) {
        initDefault.height = this.height
      }
      this.showInit = initDefault

    },
    uuid() {
      const time = Date.now()
      const random = Math.floor(Math.random() * 1000000000)

      unique++

      return 'wukong_' + random + unique + String(time)
    }
  }
}
</script>

<style lang="scss">
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container ::v-deep .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.tox-tinymce-aux {
  z-index: 10001 !important;
}
.tox .tox-toolbar,
.tox .tox-toolbar__overflow,
.tox .tox-toolbar__primary {
  background-color: #fff !important;
}
</style>
