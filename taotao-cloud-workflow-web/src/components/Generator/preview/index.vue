<template>
  <el-dialog v-bind="$attrs" :close-on-click-modal="false" :modal-append-to-body="false"
    append-to-body v-on="$listeners" @open="onOpen" @close="onClose"
    class="JNPF-dialog JNPF-dialog_center" title="预览" :width="formConf.generalWidth">
    <parser :form-conf="formConf" @submit="submitForm" :key="key" ref="dynamicForm" />
    <div slot="footer">
      <el-button @click="close">{{formConf.cancelButtonText||'取 消'}}</el-button>
      <el-button type="primary" @click="handelConfirm">{{formConf.confirmButtonText||'确 定'}}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Parser from '@/components/Generator/parser/Parser'
export default {
  components: { Parser },
  props: ['formData'],
  data() {
    return {
      key: +new Date(),
      formConf: {}
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    onOpen() {
      this.key = +new Date()
      this.formConf = this.formData
    },
    onClose() {
    },
    close(e) {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs.dynamicForm && this.$refs.dynamicForm.submitForm()
    },
    fillFormData(form, data) {
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          if (item.__vModel__) {
            const val = data[item.__vModel__]
            if (val !== undefined) item.__config__.defaultValue = val
          }
          if (item.__config__ && item.__config__.jnpfKey !== 'table' && item.__config__.children && Array.isArray(item.__config__.children)) {
            loop(item.__config__.children)
          }
        }
      }
      loop(form.fields)
    },
    submitForm(data, callback) {
      console.log('submitForm提交数据：', data)
      if (callback && typeof callback === "function") {
        callback()
      }
    },
  }
}
</script>