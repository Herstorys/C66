<template>
  <transition name="down">
    <div class="msgbox" :style="style[type]" v-if="isShow">
      <i :class="style[type].icon"></i>
      <span class="text">{{ message }}</span>
    </div>
  </transition>
</template>
<script>
import { onMounted, ref } from 'vue'
export default {
  name: 'msgbox',
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      // warn 警告  error 错误  success 成功
      default: 'warn'
    }
  },
  setup () {
    // 定义一个对象，包含三种情况的样式，对象key就是类型字符串
    const style = {
      warn: {
        icon: 'icon ion-alert-circled',
        color: '#E6A23C',
        backgroundColor: 'rgb(253, 246, 236)',
        borderColor: 'rgb(250, 236, 216)'
      },
      error: {
        icon: 'icon ion-close-circled',
        color: '#F56C6C',
        backgroundColor: 'rgb(254, 240, 240)',
        borderColor: 'rgb(253, 226, 226)'
      },
      success: {
        icon: 'icon ion-checkmark-circled',
        color: '#67C23A',
        backgroundColor: 'rgb(240, 249, 235)',
        borderColor: 'rgb(225, 243, 216)'
      }
    }

    const isShow = ref(false)
    onMounted(() => {
      isShow.value = true
    })
    return { style, isShow }
  }
}
// import { ref, onMounted } from 'vue';

// const props = defineProps({
//   message: {
//     type: String,
//     default: ''
//   },
//   type: {
//     type: String,
//     default: 'warn'
//   },
// });

// const style = {
//   warn: {
//     icon: 'mdi-alert-circle',
//     iconColor: '#E6A23C',
//     backgroundColor: 'rgb(253, 246, 236)',
//     borderColor: 'rgb(250, 236, 216)'
//   },
//   error: {
//     icon: 'mdi-alert-outline',
//     iconColor: '#F56C6C',
//     backgroundColor: 'rgb(254, 240, 240)',
//     borderColor: 'rgb(253, 226, 226)'
//   },
//   success: {
//     icon: 'mdi-checkbox-marked-circle-outline',
//     iconColor: '#67C23A',
//     backgroundColor: 'rgb(240, 249, 235)',
//     borderColor: 'rgb(225, 243, 216)'
//   }
// }

// const isShow = ref(false);

// onMounted(() => {
//   isShow.value = true;
// });
</script>
<style scoped lang="less">
// 动画效果
.down {
  &-enter {
    &-from {
      transform: translateY(-100px);
      opacity: 0;
    }

    &-active {
      transition: all 0.5s;
    }

    &-to {
      transform: none;
      opacity: 1;
    }
  }
}

.msgbox {
  width: 300px;
  height: 50px;
  position: fixed;
  z-index: 9999;
  left: 50%;
  margin-left: -150px;
  top: 100px;
  line-height: 50px;
  padding: 0 25px;
  border: 1px solid #e4e4e4;
  background: #f5f5f5;
  color: #999;
  border-radius: 4px;

  i {
    margin-right: 4px;
    vertical-align: middle;
  }

  .text {
    vertical-align: middle;
  }
}
</style>
