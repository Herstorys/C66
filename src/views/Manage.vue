<template>
  <div class="manage animate__animated animate__fadeInRight">
    <v-card width="1100px">
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="one">无障碍设施管理</v-tab>
        <v-tab value="two">反馈问题管理</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="one">
            <FacilitiesTableVue></FacilitiesTableVue>
          </v-window-item>
          <v-window-item value="two">
            <FeedbackTableVue></FeedbackTableVue>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import FacilitiesTableVue from '@/components/FacilitiesTable.vue';
import FeedbackTableVue from '@/components/FeedbackTable.vue';
import { ref } from 'vue';
const tab = ref(null)
</script>

<style scoped>
.manage {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
