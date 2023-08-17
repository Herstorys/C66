<template>
  <div class="eFunction animate__animated animate__fadeInLeft">
    <v-card>
      <v-tabs v-model="tab" bg-color="primary" align-tabs="center" color="white">
        <v-tab value="ThermalMap" style="font-size: medium;">热力图分析</v-tab>
        <v-tab value="BufferAnalyst" style="font-size: medium;">缓冲区分析</v-tab>
        <v-tab value="CompareAnalyst" style="font-size: medium;">对比分析</v-tab>
        <v-tab value="TimeAnalyst" style="font-size: medium;">信息动态展示</v-tab>
        <v-tab value="RegionAnalyst" style="font-size: medium;">区域统计</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="ThermalMap">
          <div v-if="tab === 'ThermalMap'">
            <ThermalMap></ThermalMap>
          </div>
        </v-window-item>
        <v-window-item value="BufferAnalyst">
          <div v-if="tab === 'BufferAnalyst'">
            <BufferAnalyst></BufferAnalyst>
          </div>
        </v-window-item>
        <v-window-item value="CompareAnalyst">
          <div v-if="tab === 'CompareAnalyst'">
            <CompareAnalyst></CompareAnalyst>
          </div>
        </v-window-item>
        <v-window-item value="TimeAnalyst">
          <div v-if="tab === 'TimeAnalyst'">
            <TimeAnalyst></TimeAnalyst>
          </div>
        </v-window-item>
        <v-window-item value="RegionAnalyst">
          <div v-if="tab === 'RegionAnalyst'">
            <RegionAnalysis></RegionAnalysis>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
  <div id="thermal-map-container"></div>
  <div id="time-analyst-container"></div>
  <div id="buffer-analyst-container"></div>
  <div id="compare-analyst-container"></div>
</template>

<script setup>
import { ref } from 'vue';
import 'animate.css';
import BufferAnalyst from './Evaluate/BufferAnalyst.vue';
import ThermalMap from './Evaluate/ThermalMap.vue';
import CompareAnalyst from './Evaluate/CompareAnalyst.vue';
import TimeAnalyst from './Evaluate/TimeAnalyst.vue';
import RegionAnalysis from './Evaluate/RegionAnalysis.vue';

const tab = ref(null);
</script>

<style scoped>
.eFunction {
  position: absolute;
  top: 70px;
  left: 20px;
  width: 500px;
  z-index: 2;
}
</style>
