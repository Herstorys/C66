<template>
  <div class="container animate__animated animate__fadeInLeft">
    <v-card>
      <v-card-title class="text-center text-h5">热力图分析</v-card-title>
      <v-card-item>
        <v-card-subtitle>添加图层</v-card-subtitle>
        <div class="btn">
          <v-btn v-for="(item, index) in items" :key="index" @click="addLayer(item.name)" style="margin: 6px;">
            {{ item.name }}</v-btn>
        </div>
      </v-card-item>
      <v-card-item>
        <v-card-subtitle>操作</v-card-subtitle>
        <div class="btn">
          <v-btn @click="renderLayer" style="margin: 6px;">符号化</v-btn>
          <v-btn @click="removeLayer" style="margin: 6px;">移除图层</v-btn>
        </div>
      </v-card-item>
    </v-card>
  </div>
</template>

<script setup>
import { toRaw, onUnmounted, ref } from "vue";
import { useMapStore } from '@/store/mapStore';
import { createLayer, featureLayer, getExtent } from "@/utils/layerConfig";
import { heatmapRenderer, uniqueRenderer, renderer } from '@/utils/commonTemplate';
import { getAllFacilities } from '@/utils/commonFunction';

import LayerList from "@arcgis/core/widgets/LayerList.js";
import Legend from "@arcgis/core/widgets/Legend.js";

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const facilityLayer = createLayer('无障碍设施', uniqueRenderer);
const features = getAllFacilities();

features.then((result) => {
  facilityLayer.fullExtent = getExtent(result);
  facilityLayer.applyEdits({
    addFeatures: result
  }).then((result) => {
    // console.log(result);
    // facilityLayer.renderer = heatmapRenderer;
    // map.add(facilityLayer);
  }).catch(error => {
    console.log(error)
  });
}).catch((error) => {
  console.log(error);
})

// const curbRammpLayer = featureLayer("缘石坡道", renderer('/缘石坡道.png'));

// const tactilePavingLayer = featureLayer("盲道", renderer('/盲道.png'));

// const elevatorLayer = featureLayer("无障碍电梯", renderer('/无障碍电梯.png'));

// const parkLayer = featureLayer("无障碍停车位", renderer('/无障碍停车位.png'));

// const slopeLayer = featureLayer("无障碍坡道", renderer('/无障碍坡道.png'));

// const stairwayLayer = featureLayer("无障碍楼梯", renderer('/无障碍楼梯.png'));

// const tolietLayer = featureLayer("无障碍厕所", renderer('/无障碍厕所.png'));

// const items = [
//   { name: "全部无障碍设施", layer: facilityLayer },
//   { name: "盲道", layer: tactilePavingLayer },
//   { name: "缘石坡道", layer: curbRammpLayer },
//   { name: "无障碍电梯", layer: elevatorLayer },
//   { name: "无障碍停车位", layer: parkLayer },
//   { name: "无障碍坡道", layer: slopeLayer },
//   { name: "无障碍楼梯", layer: stairwayLayer },
//   { name: "无障碍厕所", layer: tolietLayer },
// ]

const items = [
  { name: "全部无障碍设施" },
  { name: "盲道" },
  { name: "缘石坡道" },
  { name: "无障碍电梯" },
  { name: "无障碍停车位" },
  { name: "无障碍坡道" },
  { name: "无障碍楼梯" },
  { name: "无障碍厕所" },
]

// 定义一个变量来存储当前选中的图层
let selectedLayer = null;

// 添加图层的点击事件处理程序
const addLayer = (layerName) => {
  if (map && layerName === "全部无障碍设施") {
    map.add(facilityLayer);
    selectedLayer = facilityLayer;
  } else if (map && layerName) {
    const layer = featureLayer(layerName, renderer(`/${layerName}.png`));
    map.add(layer);
    selectedLayer = layer;
  } else {
    console.error("地图或图层引用丢失。");
  }
}

const renderLayer = () => {
  if (selectedLayer) {
    selectedLayer.renderer = heatmapRenderer;
  } else {
    console.error("未选择图层进行符号化。");
  }
}

const removeLayer = () => {
  if (map && selectedLayer) {
    map.remove(selectedLayer);
    selectedLayer = null;
  } else {
    console.error("地图或图层引用丢失或未选择图层。");
  }
}

const legend = new Legend({
  view: mapView,
  style: "card",
});
mapView.ui.add(legend, "bottom-right");

//图层控制控件
async function defineActions (event) {
  const item = event.item;
  await item.layer.when();
  item.actionsSections = [
    [
      {
        title: "缩放到图层范围",
        className: "esri-icon-zoom-out-fixed",
        id: "full-extent"
      }
    ],
    [
      {
        title: "增加透明度",
        className: "esri-icon-up",
        id: "increase-opacity"
      },
      {
        title: "减小透明度",
        className: "esri-icon-down",
        id: "decrease-opacity"
      }
    ]
  ];
}

const layerList = new LayerList({
  view: mapView,
  listItemCreatedFunction: defineActions
});
//添加控件事件
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
  }
});

mapView.ui.add(layerList, "top-right");


// 监听mapView在不同的缩放比例的事件
// mapView.watch("scale", (scale) => {
//   var zoomLevel = mapView.scale;
//   if (selectedLayer.visible == true) {
//     if (zoomLevel > 300000) {
//       selectedLayer.visible = false;
//     }
//     else if (zoomLevel < 600) {
//       // featureLayer1.visible = true;
//       selectedLayer.renderer = uniqueRenderer;
//     }
//     else {
//       selectedLayer.visible = true;
//       selectedLayer.renderer = heatmapRenderer;
//     }
//   }
//   else if (600 < zoomLevel && zoomLevel < 300000) {
//     selectedLayer.visible = true;
//     selectedLayer.renderer = heatmapRenderer;
//   }
// });

onUnmounted(() => {
  // map.remove(facilityLayer);
  // facilityLayer.renderer = uniqueRenderer;
  mapView.ui.remove([layerList, legend])
})
</script>

<style scoped>
.container {
  position: absolute;
  top: 70px;
  left: 20px;
  width: 400px;
  border-radius: 20px;
  background-color: aliceblue;
}

.btn {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
