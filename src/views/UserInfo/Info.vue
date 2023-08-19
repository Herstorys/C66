<template>
  <div class="forms animate__animated animate__fadeInLeft">
    <v-card>
      <v-toolbar flat color="blue">
        <v-btn icon="mdi-account"></v-btn>
        <v-toolbar-title class="font-weight-light">
          用户信息
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="isEditing = !isEditing">
          <v-fade-transition leave-absolute>
            <v-icon v-if="isEditing">mdi-close</v-icon>
            <v-icon v-else>mdi-pencil</v-icon>
          </v-fade-transition>
        </v-btn>
      </v-toolbar>
      <v-form>
        <v-card-text>
          <v-text-field v-model="user.username" label="用户名" :disabled="!isEditing"></v-text-field>
          <v-text-field v-model="user.password" label="密码" :disabled="!isEditing"></v-text-field>
          <v-btn block rounded="xl" size="x-large">确认</v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const hasSaved = ref(false)
const isEditing = ref(null)
const user = {
  username: userStore.username,
  password: '',
}

</script>

<style scoped>
.forms {
  position: absolute;
  top: 50px;
  left: 20px;
  width: 400px;
  border-radius: 20px;
  background-color: aliceblue;
}
</style>
