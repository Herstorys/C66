<template>
  <div class="navigation">
    <div class="title">城市无障碍出行系统</div>
    <div class="function">
      <RouterLink class="router-link-active" :to="{ name: 'Navigation' }">
        <v-btn>导航</v-btn>
      </RouterLink>
      <RouterLink class="router-link-active" :to="{ name: 'Evaluate' }">
        <v-btn>分析与评价</v-btn>
      </RouterLink>
      <RouterLink class="router-link-active" :to="{ name: 'DataCenter' }" v-if="router.hasRoute('DataCenter')">
        <v-btn>数据中心</v-btn>
      </RouterLink>
      <RouterLink class="router-link-active" :to="{ name: 'Manage' }" v-if="router.hasRoute('Manage')">
        <v-btn>管理中心</v-btn>
      </RouterLink>
    </div>
    <div class="user">
      <v-btn prepend-icon="mdi-account-circle">
        {{ userStore.username ? userStore.username : "用户中心" }}
        <v-menu activator="parent" open-on-hover>
          <v-list>
            <v-list-item v-for="(item, index) in lists" :key="index" :value="index">
              <RouterLink class="router-link-active" :to="{ name: item.to }">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </RouterLink>
            </v-list-item>
            <v-list-item @click="logout">退出登录</v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const router = useRouter();

const lists = [
  { title: "个人信息", to: 'Info' },
  { title: "反馈", to: 'Feedback' },
  { title: "反馈记录", to: 'History' },
]

const logout = () => {
  userStore.logout();
  localStorage.removeItem("user");
  setTimeout(() => {
    router.push({ name: 'login' })
  }, 2000)
}
</script>

<style scoped>
.navigation {
  /* position: fixed; */
  display: grid;
  grid-template-columns: 0.3fr 1fr 0.12fr;
  gap: 10px;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  background-color: #0D47A1;
  /* border-radius: 0px 0px 20px 20px; */
  width: 100%;
  height: 6%;
  /* z-index: 1; */
  /* opacity: 90%; */
}

.function {
  display: flex;
  justify-content: space-around;
  width: 500px;
}

.user {
  display: flex;
}

/* .button {
  border: none;
  color: #fff;
  background-image: linear-gradient(30deg, #4154fa, #4ce3f7);
  border-radius: 20px;
  background-size: 100% auto;
  font-family: inherit;
  font-size: 17px;
}

.button:hover {
  background-position: right center;
  background-size: 200% auto;
  -webkit-animation: pulse 2s infinite;
  animation: pulse512 1.5s infinite;
}

@keyframes pulse512 {
  0% {
    box-shadow: 0 0 0 0 #05bada66;
  }

  70% {
    box-shadow: 0 0 0 10px rgb(218 103 68 / 0%);
  }

  100% {
    box-shadow: 0 0 0 0 rgb(218 103 68 / 0%);
  }
} */

.title {
  font-size: 30px;
  color: white;
}

.router-link-active {
  text-decoration: none;
}
</style>
