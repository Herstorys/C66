<template>
  <div class="forms animate__animated animate__fadeInLeft">
    <v-card>
      <v-toolbar flat color="purple">
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
          <v-text-field v-for="(name, i) in info" :label="name" :key="i" :disabled="!isEditing"></v-text-field>
          <v-btn block rounded="xl" size="x-large">确认</v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = [
  "用户名", "密码", "地址", "邮箱", "手机号"
]

const hasSaved = ref(false)
const isEditing = ref(null)


</script>

<style scoped>
.forms {
  position: absolute;
  top: 70px;
  left: 20px;
  width: 400px;
  border-radius: 20px;
  background-color: aliceblue;
}
</style>
