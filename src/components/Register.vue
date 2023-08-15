<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="header">注册</div>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="state.username" :counter="10" label="用户名" required
                      :rules="[rules.required, rules.name]"></v-text-field>

        <v-text-field v-model="state.password" label="密码" required :counter="6"
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="visible = !visible"
                      :type="visible ? 'text' : 'password'" hint="最少6个字符"
                      :rules="[rules.required, rules.min]"></v-text-field>

        <v-text-field v-model="state.repeatPassword" label="确认密码" required :counter="6"
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="visible = !visible"
                      :type="visible ? 'text' : 'password'"
                      :rules="[rules.required, rules.min, rules.repeat]"></v-text-field>

        <v-btn class="btn" size="large" rounded="xl" @click="registers" :readonly="loading" :disabled="!form">
          注册
        </v-btn>
        <label class="login" for="password">已有账号？<a @click=login>点击登录</a></label>
      </v-form>
    </div>
  </div>
  <div class="square">
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
  <div class="circle">
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script setup>
import router from '@/router'
import {reactive, ref} from 'vue'
import {setToken} from "@/utils/setToken";
import {register} from '@/api/user.js';
import Message from "@/components/msgbox/Message.js";

const visible = ref(false)
const loading = ref(false)
const form = ref(false)
const isOK = ref(false)
const alertText = ref()

const state = reactive({
  username: '',
  password: '',
  repeatPassword: ''
})

const rules = {
  required: v => !!v || '必要的',
  name: v => v.length <= 10 || '用户名 3 到 10 个字符',
  min: v => v.length >= 6 || '最少6个字符',
  repeat: v => repeats(v)
}

function repeats(value) {
  if (value === '') {
    return '请再次输入密码'
  } else if (value !== state.password) {
    return '两次输入密码不一致'
  } else {
    return true
  }
}

function onSubmit() {
  if (!form.value) return
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}

function registers() {
  register(state).then(res => {
    console.log(res.data)
    if (res.status === 200) {
      Message({ type: 'success', message: res.data.msg });
      router.push({name: 'home'});// 跳转到home.vue
    } else {
      Message({ type: 'error', message: res.data.msg });
    }
  }).catch(error => {
    console.error(error)
  })
}

function login() { // 跳转到注册界面
  router.push({name: 'login'})
}

</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  background-image: linear-gradient(to right, #c2fbef, #a6c1ee);
}

.login-wrapper {
  background-color: #fff;
  width: 450px;
  height: 500px;
  border-radius: 15px;
  padding: 0 50px;
}

.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  line-height: 160px;
}

.login {
  display: flex;
  justify-content: flex-end;
  margin: 20px 5px 20px 5px;
}

a {
  text-decoration-line: none;
  color: #abc1ee;
}

/* 按钮 */
.btn {
  text-align: center;
  width: 100%;
  background-image: linear-gradient(to right, #c2fbef, #a6c1ee);
  color: aliceblue;
  border-style: hidden;
  border-radius: 15px;
}

.alert {
  position: absolute;
  width: auto;
  top: 10px;
}

ul li {
  position: absolute;
  border: 1px solid #fff;
  background-color: #fff;
  width: 30px;
  height: 30px;
  list-style: none;
  opacity: 0;
}

.square li {
  top: 40vh;
  left: 60vw;
  /* 执行动画：动画名 时长 线性的 无限次播放 */
  animation: square 10s linear infinite;
}

.square li:nth-child(2) {
  top: 80vh;
  left: 10vw;
  /* 设置动画延迟时间 */
  animation-delay: 2s;
}

.square li:nth-child(3) {
  top: 80vh;
  left: 85vw;
  /* 设置动画延迟时间 */
  animation-delay: 4s;
}

.square li:nth-child(4) {
  top: 10vh;
  left: 70vw;
  /* 设置动画延迟时间 */
  animation-delay: 6s;
}

.square li:nth-child(5) {
  top: 10vh;
  left: 10vw;
  /* 设置动画延迟时间 */
  animation-delay: 8s;
}

.circle li {
  bottom: 0;
  left: 15vw;
  /* 执行动画 */
  animation: circle 10s linear infinite;
}

.circle li:nth-child(2) {
  left: 35vw;
  /* 设置动画延迟时间 */
  animation-delay: 2s;
}

.circle li:nth-child(3) {
  left: 55vw;
  /* 设置动画延迟时间 */
  animation-delay: 6s;
}

.circle li:nth-child(4) {
  left: 75vw;
  /* 设置动画延迟时间 */
  animation-delay: 4s;
}

.circle li:nth-child(5) {
  left: 90vw;
  /* 设置动画延迟时间 */
  animation-delay: 8s;
}

/* 定义动画 */
@keyframes square {
  0% {
    transform: scale(0) rotateY(0deg);
    opacity: 1;
  }

  100% {
    transform: scale(5) rotateY(1000deg);
    opacity: 0;
  }
}

@keyframes circle {
  0% {
    transform: scale(0) rotateY(0deg);
    opacity: 1;
    bottom: 0;
    border-radius: 0;
  }

  100% {
    transform: scale(5) rotateY(1000deg);
    opacity: 0;
    bottom: 90vh;
    border-radius: 50%;
  }
}
</style>
