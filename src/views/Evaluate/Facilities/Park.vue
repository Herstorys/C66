<template></template>

<script setup>
import { onUnmounted, toRaw } from "vue";
import { useMapStore } from "@/store/mapStore";
import { featureLayer, layerList } from "@/utils/layerConfig";
import { picRenderer } from "@/utils/commonTemplate";

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const parkLayer = featureLayer("无障碍停车位", picRenderer);
map.add(parkLayer);
const layerlist = layerList(mapView, parkLayer);

onUnmounted(() => {
  map.remove(parkLayer);
  mapView.ui.remove(layerlist);
});
</script>

<style scoped></style>
