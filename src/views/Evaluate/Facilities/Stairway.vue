<template></template>

<script setup>
import { onUnmounted, toRaw } from "vue";
import { useMapStore } from "@/store/mapStore";
import { featureLayer, layerList } from "@/utils/layerConfig";
import { picRenderer } from "@/utils/commonTemplate";

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const stairwayLayer = featureLayer("无障碍楼梯", picRenderer);
map.add(stairwayLayer);
const layerlist = layerList(mapView, stairwayLayer);

onUnmounted(() => {
  map.remove(stairwayLayer);
  mapView.ui.remove(layerlist);
});
</script>

<style scoped></style>
