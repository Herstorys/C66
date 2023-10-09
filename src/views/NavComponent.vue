<template>
  <div class="navigation">
    <RouterLink class="router-link-active" to="/">
      <div class="title">城市无障碍出行服务系统</div>
    </RouterLink>
    <div class="function">
      <RouterLink class="router-link-active" :to="{ name: 'AddFacility' }">
        <v-btn title="添加无障碍设施">添加无障碍设施</v-btn>
      </RouterLink>
      <v-btn>分析与评价
        <v-menu activator="parent" open-on-hover>
          <v-list>
            <v-list-item v-for="(item, index) in evaluatelists" :key="index" :value="index">
              <RouterLink class="router-link-active" :to="{ name: item.to }">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </RouterLink>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <RouterLink class="router-link-active" :to="{ name: 'Navigation' }">
        <v-btn title="导航">导航</v-btn>
      </RouterLink>
      <RouterLink class="router-link-active" :to="{ name: 'Manage' }" v-if="userStore.isAdmin">
        <v-btn title="管理中心">管理中心</v-btn>
      </RouterLink>
      <v-btn>用户中心
        <v-menu activator="parent" open-on-hover>
          <v-list>
            <v-list-item v-for="(item, index) in userlists" :key="index" :value="index">
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

const userlists = [
  { title: "个人信息", to: 'Info' },
  { title: "问题反馈", to: 'Feedback' },
  // { title: "添加设施", to: 'AddFacility' },
  { title: "反馈记录", to: 'History' },
]

const evaluatelists = [
  { title: "热力图分析", to: 'ThermalMap' },
  { title: "缓冲区分析", to: 'BufferAnalyst' },
  { title: "对比分析", to: 'CompareAnalyst' },
  { title: "POI数据统计", to: 'POIAnalysis' },
  { title: "区域数据统计", to: 'RegionAnalysis' },
]

const logout = () => {
  userStore.logout();
  localStorage.removeItem("user");
  setTimeout(() => {
    router.push({ name: 'login' })
  }, 500)
}
</script>

<style scoped>
.navigation {
  display: grid;
  position: absolute;
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: space-evenly;
  background-color: #256edb;
  border-radius: 0 0 10px 10px;
  width: 600px;
  height: 100px;
  z-index: 1;
  left: 50%;
  transform: translate(-50%);
}

.function {
  display: flex;
  justify-content: space-around;
  width: 500px;
}

button {
  margin: 5px;
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
  color: black;
  text-decoration: none;
}
</style>
