<template></template>

<script setup>
import { onUnmounted, toRaw } from "vue";
import { useMapStore } from "@/store/mapStore";
import { featureLayer, layerList } from "@/utils/layerConfig";
import { picRenderer } from "@/utils/commonTemplate";

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const tolietLayer = featureLayer("无障碍厕所", picRenderer);
map.add(tolietLayer);
const layerlist = layerList(mapView, tolietLayer);

onUnmounted(() => {
  map.remove(tolietLayer);
  mapView.ui.remove(layerlist);
});
</script>

<style scoped></style>
