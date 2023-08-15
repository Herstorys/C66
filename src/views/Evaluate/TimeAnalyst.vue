<template>
  <div id="timeSiler"></div>
</template>

<script setup>
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { useMapStore } from "@/store/mapStore";
import { toRaw, onMounted, onUnmounted } from "vue";
import { layerList } from "@/utils/layerConfig";
import webConfig from "@/webConfig";
import { uniqueRenderer, popupTemplate } from "@/utils/commonTemplate";
import { useLayerStore } from "@/store/layerStore";
const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);
const layerStore = useLayerStore();
const featureLayer = toRaw(layerStore.layer);

featureLayer.renderer = uniqueRenderer;
map.add(featureLayer);

const legend = new Legend({
  view: mapView,
  style: "card",
});
mapView.ui.add(legend, "bottom-right");

const timeSlider = new TimeSlider({
  view: mapView,
  timeVisible: true,
  mode: "cumulative-from-start",
  loop: true,
});

const layerlist = layerList(mapView, featureLayer);

featureLayer.when(() => {
  timeSlider.fullTimeExtent = featureLayer.timeInfo.fullTimeExtent;
})

onMounted(() => {
  timeSlider.container = document.getElementById("timeSiler");
})

onUnmounted(() => {
  map.remove(featureLayer);
  mapView.ui.remove([layerlist, legend]);
})
</script>
