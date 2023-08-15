<template>
  <v-card class="mx-auto">
    <v-card-item>
      <div id="queryDiv">
        <label style="font-size: medium;">选择并绘制要查询的几何图形:</label>
        <br /><br />
        <div class="geometry-options">
          <v-btn class="esri-widget--button esri-icon-map-pin geometry-button" id="point-geometry-button" value="point"
            title="Query by point" @click="geometryButtonsClickHandler"></v-btn>
          <v-btn class="esri-widget--button esri-icon-polyline geometry-button" id="line-geometry-button" value="polyline"
            title="Query by line" @click="geometryButtonsClickHandler"></v-btn>
          <v-btn class="esri-widget--button esri-icon-polygon geometry-button" id="polygon-geometry-button"
            value="polygon" title="Query by polygon" @click="geometryButtonsClickHandler"></v-btn>
        </div>
        <br />
        <div class="tooltip">
          <label for="bufferNum" style="font-size: medium;">设置缓冲距离:</label>
          <div id="bufferNum"></div>
        </div>
        <br />
      </div>
    </v-card-item>
    <v-card-actions>
      <v-btn class="esri-button" id="clearGeometry" type="button" @click="clearGeometry">删除</v-btn>
    </v-card-actions>
  </v-card>
  <Teleport to="#buffer-analyst-container">
    <div id="chartResultDiv" class="animate__animated animate__fadeInRight" v-show="flag">
      <Chart :queryData="queryData" :xAxis="xAxis"></Chart>
    </div>
    <div id="tableDiv" class="animate__animated animate__fadeInUp" v-show="flag"></div>
  </Teleport>
</template>

<script setup>
import { onMounted, ref, toRaw, watch, onUnmounted } from 'vue';
import { useMapStore } from '@/store/mapStore';
import Chart from '@/views/Evaluate/Chart.vue';
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Slider from '@arcgis/core/widgets/Slider.js';
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Graphic from '@arcgis/core/Graphic.js';
import { uniqueRenderer, popupTemplate } from "@/utils/commonTemplate";
const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

import { useLayerStore } from '@/store/layerStore';
const layerStore = useLayerStore();
const facilityLayer = toRaw(layerStore.layer);

facilityLayer.renderer = uniqueRenderer;
map.add(facilityLayer)

const flag = ref(false);
const queryData = ref([]);
const xAxis = ref([]);

const sketchLayer = new GraphicsLayer();
const bufferLayer = new GraphicsLayer();
map.addMany([bufferLayer, sketchLayer]);

let layerView = null;
let bufferSize = 1000;
let featureTable = new FeatureTable({
  view: mapView,
  layer: facilityLayer,
  pageSize: 100,
});
mapView.when(() => {
  featureTable.tableTemplate = {
    columnTemplates: [
      {
        type: "field",
        fieldName: "OBJECTID",
        label: "序号",
      },
      {
        type: "field",
        fieldName: "classification",
        label: "类别",
      },
      {
        type: "field",
        fieldName: "evaluation",
        label: "评分",
      },
      {
        type: "field",
        fieldName: "address",
        label: "地址",
      },
      {
        type: "field",
        fieldName: "time",
        label: "时间",
      },
    ]
  }
})


mapView.whenLayerView(facilityLayer).then((layerViews) => {
  layerView = layerViews;
});

let sketchGeometry = null;
const sketchViewModel = new SketchViewModel({
  layer: sketchLayer,
  defaultUpdateOptions: {
    tool: "reshape",
    toggleToolOnClick: false
  },
  view: mapView,
});

sketchViewModel.on("create", (event) => {
  if (event.state === "complete") {
    sketchGeometry = event.graphic.geometry;
    runQuery();
  }
});

sketchViewModel.on("update", (event) => {
  if (event.state === "complete") {
    sketchGeometry = event.graphics[0].geometry;
    runQuery();
  }
});

function geometryButtonsClickHandler (event) {
  const geometryType = event.target.value;
  clearGeometry();
  sketchViewModel.create(geometryType);
}

const bufferNumSlider = new Slider({
  min: 100,
  max: 2000,
  steps: 1,
  visibleElements: {
    labels: true
  },
  precision: 0,
  labelFormatFunction: (value, type) => {
    return `${value.toString()}m`;
  },
  values: [1000]
});

bufferNumSlider.on(
  ["thumb-change", "thumb-drag"],
  bufferVariablesChanged
);

function bufferVariablesChanged (event) {
  bufferSize = event.value;
  runQuery();
}

onMounted(() => {
  bufferNumSlider.container = "bufferNum";
  featureTable.container = document.getElementById("tableDiv");
})

function clearGeometry () {
  sketchGeometry = null;
  sketchViewModel.cancel();
  sketchLayer.removeAll();
  bufferLayer.removeAll();
  clearHighlighting();
  clearCharts();
  featureTable.highlightIds.removeAll();
}

const debouncedRunQuery = promiseUtils.debounce(() => {
  if (!sketchGeometry) {
    return;
  }

  updateBufferGraphic(bufferSize);
  return promiseUtils.eachAlways([
    queryStatistics(),
    updateLayer()
  ]);
});

function runQuery () {
  debouncedRunQuery().catch((error) => {
    if (error.name === "AbortError") {
      return;
    }

    console.error(error);
  });
}

let highlightHandle = null;
let ObjectIDS = ref([])

function clearHighlighting () {
  if (highlightHandle) {
    highlightHandle.remove();
    highlightHandle = null;
  }
}

function highlightBuildings (objectIds) {
  clearHighlighting();
  highlightHandle = layerView.highlight(objectIds);
}

function updateBufferGraphic (buffer) {
  // add a polygon graphic for the buffer
  if (buffer > 0) {
    const bufferGeometry = geometryEngine.geodesicBuffer(
      sketchGeometry,
      buffer,
      "meters"
    );
    if (bufferLayer.graphics.length === 0) {
      bufferLayer.add(
        new Graphic({
          geometry: bufferGeometry,
          symbol: sketchViewModel.polygonSymbol
        })
      );
    } else {
      bufferLayer.graphics.getItemAt(0).geometry = bufferGeometry;
    }
  } else {
    bufferLayer.removeAll();
  }
}

function updateLayer () {
  const query = layerView.createQuery();
  query.geometry = sketchGeometry;
  query.distance = bufferSize;
  return layerView.queryObjectIds(query).then(highlightBuildings);
}

function queryStatistics () {
  const query = layerView.createQuery();
  query.geometry = sketchGeometry;
  query.distance = bufferSize;

  return layerView.queryFeatures(query).then((result) => {
    queryData.value = []
    xAxis.value = []
    ObjectIDS.value = []

    const groupedData = {};
    result.features.forEach((feature) => {
      const attributes = feature.attributes;
      const classification = attributes.classification;
      const evaluation = attributes.evaluation;
      const objectId = attributes.OBJECTID;

      if (!groupedData[classification]) {
        groupedData[classification] = {
          classification: classification,
          evaluation: evaluation,
        };
      } else {
        groupedData[classification].evaluation += evaluation;
      }
      ObjectIDS.value.push(objectId)
    });

    for (const key in groupedData) {
      const element = groupedData[key];
      xAxis.value.push(element.classification);
      queryData.value.push({ name: element.classification, value: element.evaluation });
    }
    flag.value = true;
  }, console.error);
}

function clearCharts () {
  flag.value = false
}

watch(() => queryData.value, (newValue, oldValue) => {
  featureTable.highlightIds.removeAll()
  for (const id of ObjectIDS.value) {
    featureTable.highlightIds.add(id)
  }
})

onUnmounted(() => {
  clearGeometry();
  map.remove(sketchLayer);
  map.remove(bufferLayer);
  mapView.ui.remove(sketchViewModel);
})
</script>

<style scoped>
#chartResultDiv {
  position: absolute;
  background-color: aliceblue;
  top: 100px;
  right: 20px;
}

#tableDiv {
  position: absolute;
  background-color: aliceblue;
  bottom: 20px;
  left: 100px;
  width: 1000px;
  height: 300px;
}

.geometry-options {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.geometry-button {
  max-width: 120px;
  flex: 1;
  border-style: solid;
  border-width: 1px;
  border-image: none;
}

.geometry-button-selected {
  background: #4c4c4c;
  color: #fff;
}

#bufferNum {
  width: 90%;
  margin: 2.5em auto 0;
}
</style>
