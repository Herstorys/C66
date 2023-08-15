<template>
  <!-- <v-card class="card animate__animated animate__fadeInLeft">
    <v-list>
      <RouterLink v-for="([title, to], i) in lists" :key="i" :to="{ name: to }" class="router-link-active">
        <v-list-item :key="i" :title="title" :value="title" rounded="lg"></v-list-item>
      </RouterLink>
    </v-list>
  </v-card> -->
  <RouterView></RouterView>
</template>

<script setup>

const lists = [
  ["基本信息", 'Info'],
  ["反馈", 'Feedback'],
  ["查询记录", 'History']
]
</script>

<style scoped>
.card {
  position: absolute;
  width: 200px;
  padding: 10px;
  border-radius: 8px;
  top: 70px;
  left: 30px;
}

.router-link-active {
  text-decoration: none;
  color: black;
}
</style>
