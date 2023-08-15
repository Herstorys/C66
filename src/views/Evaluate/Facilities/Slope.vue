<template>
</template>

<script setup>
import { onUnmounted, toRaw } from "vue";
import { useMapStore } from "@/store/mapStore";
import { featureLayer, layerList } from "@/utils/layerConfig";
import { picRenderer } from "@/utils/commonTemplate";

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const slopeLayer = featureLayer("无障碍坡道", picRenderer);
map.add(slopeLayer);
const layerlist = layerList(mapView, slopeLayer);

onUnmounted(() => {
  map.remove(slopeLayer);
  mapView.ui.remove(layerlist);
});
</script>

<style scoped>

</style>
