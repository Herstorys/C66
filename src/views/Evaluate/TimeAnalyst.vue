<template>
  <v-card class="container animate__animated animate__fadeInLeft">
    <v-card-title class="text-center text-h5">数据动态展示</v-card-title>
    <div id="timeSiler"></div>
  </v-card>
</template>

<script setup>
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TimeExtent from "@arcgis/core/TimeExtent.js";
import { useMapStore } from "@/store/mapStore";
import { toRaw, onMounted, onUnmounted } from "vue";
import { layerList, getExtent } from "@/utils/layerConfig";
import { popupTemplate, uniqueRenderer } from '@/utils/commonTemplate';
import { getAllFacilities } from '@/utils/commonFunction';
const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const facilityLayer = new FeatureLayer({
  title: "无障碍设施",
  fields: [
    { name: 'OBJECTID', type: 'integer' },
    { name: 'classification', alias: '类别', type: 'string' },
    { name: 'evaluation', alias: '评分', type: 'double' },
    { name: 'address', alias: '地址', type: 'string' },
    { name: 'time', alias: '时间', type: 'date' },
    { name: 'pic_url_before', type: 'string' },
    { name: 'pic_url_after', type: 'string' }
  ],
  source: [],
  geometryType: 'point',
  spatialReference: {
    wkid: 4326
  },
  objectIdField: 'OBJECTID',
  renderer: uniqueRenderer,
  popupTemplate: popupTemplate,
  timeInfo: {
    startField: 'time',
    interval: {
      unit: 'days',
      value: 5
    },
    timeReference: {
      timeZone: "Etc/GMT",
    },
    trackIdField: ''
  },
  outFields: ['*']
});
const features = getAllFacilities();
features.then((result) => {
  let minTime = Infinity;
  let maxTime = -Infinity;
  result.forEach((res) => {
    const currentTime = res.attributes.time;

    if (currentTime < minTime) {
      minTime = currentTime;
    }

    if (currentTime > maxTime) {
      maxTime = currentTime;
    }
  })
  facilityLayer.fullExtent = getExtent(result);
  facilityLayer.applyEdits({
    addFeatures: result
  }).then(() => {
    facilityLayer.timeInfo.fullTimeExtent = new TimeExtent({
      start: minTime,
      end: maxTime
    })
    timeSlider.fullTimeExtent = facilityLayer.timeInfo.fullTimeExtent;
    map.add(facilityLayer);
  }).catch(error => {
    console.log(error)
  });
}).catch((error) => {
  console.log(error);
})

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

const layerlist = layerList(mapView, facilityLayer);

onMounted(() => {
  timeSlider.container = document.getElementById("timeSiler");
})

onUnmounted(() => {
  map.remove(facilityLayer);
  mapView.ui.remove([layerlist, legend]);
})
</script>

<style scoped>
.container {
  position: absolute;
  top: 70px;
  left: 20px;
  width: 450px;
  border-radius: 10px;
  background-color: aliceblue;
}
</style>
