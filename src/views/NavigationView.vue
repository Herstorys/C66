<template>
  <div id="directionDiv"></div>
</template>

<script setup>
import { onMounted, toRaw, onUnmounted } from "vue";
import { useMapStore } from '@/store/mapStore';
import Directions from "@arcgis/core/widgets/Directions";
import RouteLayer from "@arcgis/core/layers/RouteLayer";
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

import { upload_route } from '@/api/user';
import { useUserStore } from '@/store/user';
import webConfig from "@/webConfig";
import { uniqueRenderer } from "@/utils/commonTemplate";
import { createLayer, layerList, getExtent } from "@/utils/layerConfig";
import { getAllFacilities } from '@/utils/commonFunction';

const mapStore = useMapStore();
const userStore = useUserStore();
const map = toRaw(mapStore.map)
const mapView = toRaw(mapStore.mapView);

const routeLayer = new RouteLayer({
  url: webConfig.routeUrl,
  defaultSymbols: {
    directionLines: {
      type: "simple-line",
      color: [105, 220, 255],
      width: 7,
      cap: "round",
      join: "round"
    },
    directionPoints: {
      type: "simple-marker",
      size: 0
    },
    routeInfo: {
      type: "simple-line",
      width: 0
    }
  }
})
map.add(routeLayer)

const directionsWidget = new Directions({
  layer: routeLayer,
  view: mapView,
  maxStops: 2,
  visibleElements: {
    saveAsButton: false,
    saveButton: false
  },
});

reactiveUtils.watch(
  () => directionsWidget.lastRoute,
  () => {
    const searchRoute = {
      name: userStore.username,
      startPoint: '',
      endPoint: ''
    }
    directionsWidget.lastRoute.stops.forEach((stop) => {
      if (stop.sequence === 1) {
        searchRoute.startPoint = stop.name;
      } else if (stop.sequence === directionsWidget.lastRoute.stops.length) {
        searchRoute.endPoint = stop.name;
      }
    })
    upload_route(searchRoute).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    })
  }
);

const facilityLayer = createLayer('无障碍设施', uniqueRenderer);
const features = getAllFacilities();

features.then((result) => {
  facilityLayer.fullExtent = getExtent(result);
  facilityLayer.applyEdits({
    addFeatures: result
  }).then(() => {
    map.add(facilityLayer);
  }).catch(error => {
    console.log(error)
  });
}).catch((error) => {
  console.log(error);
})

const layerlist = layerList(mapView, facilityLayer);

onMounted(() => {
  directionsWidget.container = document.getElementById("directionDiv")
})

onUnmounted(() => {
  map.removeAll();
  mapView.ui.remove(layerlist);
})
</script>

<style scoped>
#directionDiv {
  position: absolute;
  top: 40px;
  left: 15px;
  width: 25%;
  height: 80%;
  overflow: auto;
}
</style>
