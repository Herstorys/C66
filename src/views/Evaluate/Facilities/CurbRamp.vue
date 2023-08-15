<template></template>

<script setup>
import { onUnmounted, toRaw } from "vue";
import { useMapStore } from "@/store/mapStore";
import { featureLayer, layerList } from "@/utils/layerConfig";
import { picRenderer } from "@/utils/commonTemplate";

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const curbRammpLayer = featureLayer("缘石坡道", picRenderer);
map.add(curbRammpLayer);
const layerlist = layerList(mapView, curbRammpLayer);

onUnmounted(() => {
  map.remove(curbRammpLayer);
  mapView.ui.remove(layerlist);
});
</script>

<style scoped></style>
