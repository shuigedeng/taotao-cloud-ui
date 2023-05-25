import FirstComponent from "./components/frist-component/index.vue";
import Confirm  from "./components/messageBox/index.vue";
import {createApp} from 'vue'

import type { App } from "vue"
// 插件选项的类型
interface Options {
  // 文本高亮选项
  highlight?: {
    // 默认背景色
    backgroundColor: string
  }
}

/**
 * 插件主要的场景
 * 通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。
 * 通过 app.provide() 使一个资源可被注入进整个应用。
 * 向 app.config.globalProperties 中添加一些全局实例属性或方法
 * 一个可能上述三种都包含了的功能库 (例如 vue-router)
 * ----------------------------------------------
 * const app = createApp(App);
 * import plugin from './plugins'
 * app.use(plugin, {small: 16, large: 32, default: 48});
 *
 * <script>
 *     import {inject} from "vue";
 *     export default {
 *         name: "MyBanner",
 *         mounted() {
 *             const clickMe = inject('clickMe');
 *             clickMe();
 *         }
 *     }
 * </script>
 */




export default {
  install: (app, options) => {
    console.log("我的第一个插件")

    // 添加全局方法
    app.config.globalProperties.$Alert  = (val) => {
      alert(`我是弹出的内容 ${val}`)
    }

    // 添加全局属性
    app.config.globalProperties.$Info = {
      code: 200,
      msg: "数据接收"
    }

    //添加全局组件
    app.component('first-component', FirstComponent);

    //添加全局指令
    app.directive("font-size", (el, binding, vnode) => {
      var size = 16;
      switch (binding.arg) {
        case "small":
          size = options.small;
          break;
        case "large":
          size = options.large;
          break;
        default:
          size = options.defaut;
          break;
      }
      el.style.fontSize = size + "px";
    });

    const clickMe = () => {
      console.log("==========clickMe=========")
    }
    // 通过provide 添加一个全局属性
    app.provide('clickMe', clickMe);

    const myProvide = app.provide
    // 需要使用应用根组建提供的provide，确保子节点都可以通过inject使用
    createApp(Confirm, {
      myProvide
    }).mount('#messageBox')

    /**
     * createApp(App)
     *    // 自定义插件
     *   .use(directive, {
     *     highlight: {
     *       backgroundColor: "#ddd",
     *     },
     *   })
     *   .mount("#app")
     */
    /**
     * 权限控制
     * @description 用于在功能按钮上绑定权限，没权限时会销毁或隐藏对应 DOM 节点
     * @tips 指令传入的值是管理员的组别 id
     * @example <div v-permission="1">
     */
    app.directive("permission", (el, binding) => {
      // 假设 1 是管理员组别的 id ，则无需处理
      if (binding.value === 1) return
      // 其他情况认为没有权限，需要隐藏掉界面上的 DOM 元素
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      } else {
        el.style.display = "none"
      }
    })
    /**
     * 文本高亮
     * @description 用于给指定的 DOM 节点添加背景色，搭配文本内容形成高亮效果
     * @tips 指令传入的值需要是合法的 CSS 颜色名称或者 Hex 值
     * @example <div v-highlight="`cyan`">
     */
    app.directive("highlight", (el, binding) => {
      // 获取默认颜色
      let defaultColor = "unset"
      if (
        Object.prototype.toString.call(options) === "[object Object]" &&
        options?.highlight?.backgroundColor
      ) {
        defaultColor = options.highlight.backgroundColor
      }
      // 设置背景色
      el.style.backgroundColor =
        typeof binding.value === "string" ? binding.value : defaultColor
    })

  }
};
