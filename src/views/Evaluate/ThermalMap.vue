<template>
  <div></div>
</template>

<script setup>
import { toRaw, onUnmounted } from "vue";
import { useMapStore } from '@/store/mapStore';
import { heatmapRenderer, uniqueRenderer } from '@/utils/commonTemplate';
import { useLayerStore } from '@/store/layerStore';
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Legend from "@arcgis/core/widgets/Legend.js";

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);
const layerStore = useLayerStore();
const featureLayer = toRaw(layerStore.layer);

featureLayer.renderer = heatmapRenderer;
map.add(featureLayer);

const legend = new Legend({
  view: mapView,
  style: "card",
});
mapView.ui.add(legend, "bottom-right");

//图层控制控件
async function defineActions (event) {
  const item = event.item;

  await item.layer.when();
  if (item.title === "无障碍设施分布") {
    item.actionsSections = [
      [
        {
          title: "Go to full extent",
          className: "esri-icon-zoom-out-fixed",
          id: "full-extent"
        }
      ],
      [
        {
          title: "Increase opacity",
          className: "esri-icon-up",
          id: "increase-opacity"
        },
        {
          title: "Decrease opacity",
          className: "esri-icon-down",
          id: "decrease-opacity"
        }
      ]
    ];
  }
}

//添加控件事件
const layerList = new LayerList({
  view: mapView,
  listItemCreatedFunction: defineActions
});

layerList.on("trigger-action", (event) => {
  var visibleLayer = event.item.layer;
  const id = event.action.id;

  if (id === "full-extent") {
    mapView.goTo(visibleLayer.fullExtent)
      .catch((error) => {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });
  } else if (id === "increase-opacity") {
    if (visibleLayer.opacity < 1) {
      visibleLayer.opacity += 0.25;
    }
  } else if (id === "decrease-opacity") {
    if (visibleLayer.opacity > 0) {
      visibleLayer.opacity -= 0.25;
    }
  } else if (id === "set-opacity") {
    visibleLayer.opacity -= 0.2;
    if (visibleLayer.opacity <= 0) {
      visibleLayer.opacity += 1.2;
    }
  }
});

mapView.ui.add(layerList, "top-right");


// //监听mapView在不同的缩放比例的事件
// mapView.watch("scale", (scale) => {
//   var zoomLevel = mapView.scale;
//   if (featureLayer.visible == true) {
//     if (zoomLevel > 300000) {
//       featureLayer.visible = false;
//     }
//     else if (zoomLevel < 600) {
//       // featureLayer1.visible = true;
//       featureLayer.renderer = uniqueRenderer;
//     }
//     else {
//       featureLayer.visible = true;
//       featureLayer.renderer = heatmapRenderer;
//     }
//   }
//   else if (600 < zoomLevel && zoomLevel < 300000) {
//     featureLayer.visible = true;
//     featureLayer.renderer = heatmapRenderer;
//   }
// });

onUnmounted(() => {
  // map.remove(featureLayer);
  featureLayer.renderer = uniqueRenderer;
  mapView.ui.remove([layerList, legend])
})
</script>

<style scoped></style>
