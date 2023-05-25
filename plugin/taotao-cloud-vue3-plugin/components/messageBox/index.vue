<template>
  <div class="confirm-box" v-if="showMessage">
    <div class="confirm">
      <div class="content">
        {{ confirmObj.content }}
      </div>
      <!-- 弹框描述 -->
      <div v-if="confirmObj.description" class="description">
        {{ confirmObj.description }}
      </div>
      <div class="confirm-btn">
        <div class="btn border" @click="cancel" v-if="confirmObj.cancelText">{{ confirmObj.cancelText }}</div>
        <div
          class="btn primary"
          :class="{ 'border-l': confirmObj.cancelText, 'block-btn': !confirmObj.cancelText }"
          @click="sure"
        >
          {{ confirmObj.confirmText || '确定' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 接收props
const props = defineProps({
  myProvide: {
    type: Function,
    required: true
  },
})
const showMessage = ref(false)  // 控制弹窗显示/隐藏
const confirmObj = ref({})  // 弹窗内容接收对象
let callback = () => {} // 存储resolve

const showConfirm = (obj) => {
  confirmObj.value = obj
  showMessage.value = true
  return new Promise((resolve) => {
    callback = resolve
  })
}
const cancel = () => {
  callback('cancel')
  showMessage.value = false
}
const sure = () => {
  callback('confirm')
  showMessage.value = false
}

onMounted(() => {
  props.myProvide('$confirm', showConfirm)  // confirm前加$标记全局变量
})

</script>

<style lang="less">
.pop-mask-overflow {
  overflow: hidden;
}
.confirm-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000000;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  .confirm {
    width: 600px;
    padding: 80px 60px 72px;
    background: #fff;
    border-radius: 2px;
  }
  .content {
    font-size: 40px;
    line-height: 56px;
    color: #000;
  }
  .description {
    margin-top: 32px;
    font-size: 28px;
    font-weight: 300;
    color: #555555;
    font-family: PingFangSC-Light, PingFang SC;
  }
  .confirm-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    margin-top: 80px;
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      width: 224px;
      font-size: 28px;
      line-height: 40px;
      color: #000;
      &.border {
        border: 1px solid #333;
      }
      &.primary {
        background: #000000;
        color: #fff;
      }

      &.block-btn {
        width: 100%;
      }
    }
  }
}
</style>
