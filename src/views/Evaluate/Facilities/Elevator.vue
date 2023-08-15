<template></template>

<script setup>
import { onUnmounted, toRaw } from "vue";
import { useMapStore } from "@/store/mapStore";
import { featureLayer, layerList } from "@/utils/layerConfig";
import { picRenderer } from "@/utils/commonTemplate";

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const elevatorLayer = featureLayer("无障碍电梯", picRenderer);
map.add(elevatorLayer);
const layerlist = layerList(mapView, elevatorLayer);

onUnmounted(() => {
  map.remove(elevatorLayer);
  mapView.ui.remove(layerlist);
});
</script>

<style scoped></style>
