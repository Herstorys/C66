<template>
  <div class="login_container">
    <div class="login_box">
      <div class="header">登录</div>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="user.username" :counter="10" label="用户名" required
          :rules="[rules.required, rules.name]"></v-text-field>
        <v-text-field v-model="user.password" label="密码" required :counter="6"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="visible = !visible"
          :type="visible ? 'text' : 'password'" hint="最少6个字符" :rules="[rules.required, rules.min]"></v-text-field>
        <v-btn class="btn" size="large" rounded="xl" :readonly="loading" :disabled="!form" @click="logins">
          登录
        </v-btn>
        <label id="register" class="register" for="password">没有账号？<a @click="register">点击注册</a></label>
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { login } from '@/api/user.js';
import { useUserStore } from "@/store/user.js";
import Message from "@/components/msgbox/Message.js";
import { useRoute, useRouter } from 'vue-router';
import { dynamicRoutes } from '@/router/index';

const visible = ref(false)
const loading = ref(false)
const form = ref(false)

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const user = reactive({
  username: '',
  password: '',
})

function onSubmit () {
  if (!form.value) return
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}

const rules = {
  required: value => !!value || '必要的',
  name: value => value.length <= 10 || '用户名 3 到 10 个字符',
  min: v => v.length >= 6 || '最少6个字符',
}

const redirectTarget = route.query.redirect ? route.query.redirect : 'home';
const logins = () => {
  login(user).then(res => {
    if (res.data.code === 0) {
      if (res.data.role === 'admin') {
        userStore.setUserInfo(res.data.username, res.data.token, true);
        // dynamicRoutes.forEach(route => router.addRoute(route));
      } else {
        userStore.setUserInfo(res.data.username, res.data.token, false);
      }
      Message({ type: 'success', message: res.data.msg });
      setTimeout(() => {
        router.push({ name: redirectTarget });
      }, 2000);
    } else {
      Message({ type: 'error', message: res.data.msg });
    }
  }).catch(error => {
    console.error(error)
  })
}

function register () {
  router.push({ name: 'register' })
}
</script>

<style scoped>
.container {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
}

.login_container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  background-image: linear-gradient(to right, #c2fbef, #a6c1ee);
}

.login_box {
  background-color: #fff;
  width: 450px;
  height: 500px;
  border-radius: 15px;
  padding: 0 50px;
  position: relative;
  box-shadow: 6px 12px 60px rgba(0, 0, 0, 0.2);
}

.register {
  display: flex;
  justify-content: flex-end;
  margin: 20px 5px 20px 5px;
}

.btn {
  text-align: center;
  width: 100%;
  background-image: linear-gradient(to right, #c2fbef, #a6c1ee);
  color: #fff;
  font-size: 20px;
  border: none;
}

a {
  text-decoration-line: none;
  color: #abc1ee;
}

.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  line-height: 200px;
}
</style>
