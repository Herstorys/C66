<template>
  <div id="containerDiv" class="esri-widget">
    <span id="title" class="esri-widget"></span>
    <div id="slider"></div>
  </div>
  <div id="tableDiv" class="animate__animated animate__fadeInUp"></div>
</template>

<script setup>
import { get_poi_data } from '@/api/evaluate';
import Legend from "@arcgis/core/widgets/Legend.js";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import { useMapStore } from "@/store/mapStore";
import { toRaw, onMounted, onUnmounted } from "vue";
import { getExtent } from "@/utils/layerConfig";
const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const facilityLayer = new FeatureLayer({
  title: "",
  fields: [
    { name: 'OBJECTID', type: 'integer' },
    { name: 'address', alias: '地址', type: 'string' },
    { name: 'poi_class', alias: '大类', type: 'string' },
    { name: 'poi_township', alias: '街道', type: 'string' },
    { name: 'total_evaluation', alias: '总评分', type: 'double' },
    { name: 'Parking', alias: '无障碍停车位', type: 'double' },
    { name: 'Toilet', alias: '无障碍厕所', type: 'double' },
    { name: 'Slope', alias: '无障碍坡道', type: 'double' },
    { name: 'Stairway', alias: '无障碍楼梯', type: 'double' },
    { name: 'Elevator', alias: '无障碍电梯', type: 'double' },
    { name: 'TactilePaving', alias: '盲道', type: 'double' },
    { name: 'CurbRamp', alias: '缘石坡道', type: 'double' },
  ],
  source: [],
  geometryType: 'point',
  spatialReference: {
    wkid: 4326
  },
  objectIdField: 'OBJECTID',
  popupTemplate: {
    title: "{address}",
    content: [
      {
        type: "media",
        mediaInfos: [
          {
            title: "{address}",
            caption: "无障碍设施总评分：{total_evaluation}",
            type: "pie-chart",
            value: {
              fields: [
                "Parking",
                "Toilet",
                "Slope",
                "Stairway",
                "Elevator",
                "TactilePaving",
                "CurbRamp",
              ],
            }
          }
        ]
      },
      {
        type: 'fields',
        fieldInfos: [
          {
            fieldName: 'OBJECTID',
            label: 'ID'
          },
          {
            fieldName: 'poi_township',
            label: '街道'
          },
          {
            fieldName: 'address',
            label: '地址'
          },
          {
            fieldName: 'poi_class',
            label: '大类'
          },
          {
            fieldName: 'total_evaluation',
            label: '总评分'
          },
          {
            fieldName: 'Parking',
            label: '无障碍停车位'
          },
          {
            fieldName: 'Toilet',
            label: '无障碍厕所'
          },
          {
            fieldName: 'Slope',
            label: '无障碍坡道'
          }, {
            fieldName: 'Stairway',
            label: '无障碍楼梯'
          }, {
            fieldName: 'Elevator',
            label: '无障碍电梯'
          }, {
            fieldName: 'TactilePaving',
            label: '盲道'
          }, {
            fieldName: 'CurbRamp',
            label: '缘石坡道'
          },
        ]
      },
    ]
  },
  outFields: ['*']
});
const POIDatas = get_poi_data();

POIDatas.then((result) => {
  const datas = result.data;
  let features = [];
  for (let item in datas) {
    const data = datas[item];
    const pData = new Graphic({
      attributes: {
        OBJECTID: Number(item) + 1,
        address: data.address,
        poi_class: data.poi_class,
        poi_township: data.poi_township,
        total_evaluation: data.total_evaluation,
        Parking: data.Parking,
        Toilet: data.Toilet,
        Slope: data.Slope,
        Stairway: data.Stairway,
        Elevator: data.Elevator,
        TactilePaving: data.TactilePaving,
        CurbRamp: data.CurbRamp,
      },
      geometry: { longitude: data.lon, latitude: data.lat, type: 'point' }
    });
    features.push(pData);
  }
  facilityLayer.fullExtent = getExtent(features);
  facilityLayer
    .applyEdits({
      addFeatures: features
    }).then(() => {
      featureTable.refresh();
    })
    .catch((error) => {
      console.log(error);
    });
  map.add(facilityLayer);
})

const featureTable = new FeatureTable({
  view: mapView,
  layer: facilityLayer
})

// onMounted(() => {
//   featureTable.container = document.getElementById("tableDiv");
// })

const legend = new Legend({
  view: mapView
});
mapView.ui.add(legend, "bottom-right");

import * as sizeRendererCreator from "@arcgis/core/smartMapping/renderers/size.js";
import histogram from "@arcgis/core/smartMapping/statistics/histogram";
import SizeSlider from "@arcgis/core/widgets/smartMapping/SizeSlider.js";

const sizeParams = {
  layer: facilityLayer,
  view: mapView,
  valueExpression: "$feature.total_evaluation",
  legendOptions: {
    title: "无障碍设施总评分"
  },
  minValue: 0,
  maxValue: 30,
  outlineOptimizationEnabled: true,
  sizeOptimizationEnabled: true
};


let rendererResult = null;
mapView.when(() => {
  featureTable.container = "tableDiv";
  sizeRendererCreator
    .createContinuousRenderer(sizeParams)
    .then((response) => {
      rendererResult = response;
      facilityLayer.renderer = rendererResult.renderer;

      return histogram({
        layer: facilityLayer,
        valueExpression: sizeParams.valueExpression,
        view: mapView,
        minValue: sizeParams.minValue,
        maxValue: sizeParams.maxValue,
        numBins: 50
      });
    })
    .then((histogramResult) => {
      const sizeSlider = SizeSlider.fromRendererResult(
        rendererResult,
        histogramResult
      );
      sizeSlider.container = "slider";

      const iconColor = rendererResult.renderer.classBreakInfos[0].symbol.color;
      sizeSlider.style.trackFillColor = iconColor;

      sizeSlider.labelFormatFunction = (value) => {
        return value.toFixed(1);
      };
      sizeSlider.viewModel.precision = 1;
      sizeSlider.histogramConfig.standardDeviation = null;
      mapView.ui.add("containerDiv", "top-right");
      const titleElement = document.getElementById("title");
      titleElement.innerText = sizeParams.legendOptions.title;

      const changeEventHandler = () => {
        const renderer = facilityLayer.renderer.clone();
        const sizeVariable = renderer.visualVariables[0];
        renderer.visualVariables = [
          sizeSlider.updateVisualVariable(sizeVariable)
        ];
        facilityLayer.renderer = renderer;
      };

      sizeSlider.on(
        ["thumb-change", "thumb-drag", "min-change", "max-change"],
        changeEventHandler
      );
    })
    .catch((error) => {
      console.error("There was an error: ", error);
    });
});

onUnmounted(() => {
  map.remove(facilityLayer);
  mapView.ui.remove([legend, "containerDiv"])
})
</script>

<style scoped>
#containerDiv {
  background-color: white;
  padding: 3px;
  text-align: center;
  min-width: 260px;
}

#title {
  font-size: 14pt;
}

#tableDiv {
  position: absolute;
  bottom: 20px;
  left: 100px;
  width: 1000px;
  height: 300px;
  border-radius: 10px;
}
</style>
