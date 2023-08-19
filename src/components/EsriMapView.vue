<template>
  <div id="viewDiv"></div>
</template>

<script setup>
import { onMounted, toRaw } from "vue";
import { useMapStore } from "@/store/mapStore";

const mapStore = useMapStore();

onMounted(() => {
  toRaw(mapStore.mapView).container = document.getElementById('viewDiv');
});
</script>

<style scoped>
#viewDiv {
  width: 100%;
  height: 100%;
}
</style>
