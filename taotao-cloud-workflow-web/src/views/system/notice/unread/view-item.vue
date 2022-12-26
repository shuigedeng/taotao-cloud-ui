<template>
  <div class="viewitem">
    <h1 class="title">{{ dataForm.title }}</h1>
    <div class="info">
      <span>{{ jnpf.dateFormat(dataForm.lastModifyTime) }}</span
      ><span>{{ dataForm.creatorUser }}</span>
    </div>
    <div class="main" v-html="dataForm.bodyText"></div>
    <div class="file-list" v-if="files.length">
      <JNPF-UploadFz v-model="files" disabled detailed />
    </div>
  </div>
</template>

<script>
export default {
  name: "viewitem",
  props: {
    dataForm: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      files: []
    };
  },
  watch: {
    dataForm(newValue, oldValue) {
      this.files = item.files ? JSON.parse(newValue.files) : [];
    }
  },
  methods: {}
};
</script>
