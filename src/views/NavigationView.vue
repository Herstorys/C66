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
import { layerList } from "@/utils/layerConfig";
import { useLayerStore } from '@/store/layerStore';

const layerStore = useLayerStore();
const facilityLayer = toRaw(layerStore.layer);
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

facilityLayer.renderer = uniqueRenderer;
map.add(facilityLayer);

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
  top: 71px;
  left: 15px;
  width: 20%;
  height: 80%;
  overflow: auto;
}

.nav {
  height: 6%;
}

.map {
  height: 94%;
}
</style>
