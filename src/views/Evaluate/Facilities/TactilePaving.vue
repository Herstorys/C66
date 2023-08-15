<template></template>

<script setup>
import { onUnmounted, toRaw } from "vue";
import { useMapStore } from "@/store/mapStore";
import { featureLayer, layerList } from "@/utils/layerConfig";
import { picRenderer } from "@/utils/commonTemplate";

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const tactilePavingLayer = featureLayer("盲道", picRenderer);
map.add(tactilePavingLayer);
const layerlist = layerList(mapView, tactilePavingLayer);

onUnmounted(() => {
  map.remove(tactilePavingLayer);
  mapView.ui.remove(layerlist);
});
</script>

<style scoped></style>
