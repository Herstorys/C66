<template>
  <div class="container animate__animated animate__fadeInLeft">
    <v-card class="filter">
      <v-card-title class="text-center text-h5">区域分析</v-card-title>
      <v-card-subtitle style="font-size: large;color: black;">筛选条件:</v-card-subtitle>
      <div class="filter-container">
        <v-select v-model:model-value="facilityType" :items="items" label="选择筛选类型" style="width: 200px;"></v-select>
      </div>
      <div class="filter-container">
        <v-select v-model="operator" :items="operators" label="选择操作符"></v-select>
        <v-text-field v-model="filterNumber" min="0" label="筛选值" :rules="rules" placeholder="20"></v-text-field>
      </div>
      <div class="btns">
        <v-btn @click="reset" style="margin: 5px;">重置</v-btn>
        <v-btn @click="filter" style="margin: 5px;">筛选</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Legend from '@arcgis/core/widgets/Legend';
import { onMounted, ref, toRaw, watch, onUnmounted } from 'vue';
import { useMapStore } from '@/store/mapStore';
import webConfig from '@/webConfig';

const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const items = [
  { title: '无障碍设施水平评分', value: 'SUM_eval' },
  { title: '无障碍厕所', value: 'baf_cesuo' },
  { title: '无障碍电梯', value: 'baf_dianti' },
  { title: '无障碍楼梯', value: 'baf_louti' },
  { title: '无障碍坡道', value: 'baf_podao' },
  { title: '无障碍停车位', value: 'baf_park' },
  { title: '缘石坡道', value: 'baf_yspd' },
  { title: '盲道', value: 'baf_md' },
]

const operators = [{ title: '大于', value: '>' }, { title: '小于', value: '<' }]

const rules = [
  value => !!value || '请先填写筛选数值！',
]
const facilityType = ref(items[0].value);
const operator = ref(operators[0].value);
const filterNumber = ref(20);

const regionUrl = webConfig.regionUrl;

const regionLayer = new FeatureLayer({
  title: "区域统计分析图例",
  url: regionUrl,
  renderer: {
    type: "pie-chart",
    size: 10,
    attributes: [
      {
        field: "baf_cesuo",
        color: "#00a8e1",
        label: "无障碍厕所",
      },
      {
        field: "baf_dianti",
        color: "#99cc00",
        label: "无障碍电梯",
      },
      {
        field: "baf_louti",
        color: "#e30039",
        label: "无障碍楼梯",
      },
      {
        field: "baf_podao",
        color: "#fcd300",
        label: "无障碍坡道",
      },
      {
        field: "baf_park",
        color: "#800080",
        label: "无障碍停车位",
      },
      {
        field: "baf_yspd",
        color: "#00994e",
        label: "缘石坡道",
      },
      {
        field: "baf_md",
        color: "#ff6600",
        label: "盲道",
      },
    ],
    backgroundFillSymbol: {
      color: [127, 127, 127, 0.2],
      outline: {
        width: 1,
        color: [255, 255, 255, 0.3]
      }
    },
    outline: {
      width: 1.5,
      color: "grey"
    },
    visualVariables: [
      {
        type: "size",
        valueExpression: "$feature.SUM_eval",
        minDataValue: 10,
        maxDataValue: 110,
        minSize: 12,
        maxSize: 48
      }
    ]
  },
  popupTemplate: {
    title: "{ASCRIPTION}",
    content: [
      {
        type: "media",
        mediaInfos: [
          {
            title: "{NAME}",
            caption: "无障碍设施总评分：{SUM_eval}",
            altText: "该地区暂时没有无障碍设施记录！",
            type: "pie-chart",
            value: {
              fields: [
                "baf_cesuo",
                "baf_dianti",
                "baf_louti",
                "baf_podao",
                "baf_park",
                "baf_yspd",
                "baf_md",
              ],
            }
          }
        ]
      },
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "baf_cesuo",
            label: "无障碍厕所数量",
            format: {
              digitSeparator: true,
            },
          },
          {
            fieldName: "baf_dianti",
            label: "无障碍电梯数量",
            format: {
              digitSeparator: true,
            },
          },
          {
            fieldName: "baf_louti",
            label: "无障碍楼梯数量",
            format: {
              digitSeparator: true,
            },
          },
          {
            fieldName: "baf_podao",
            label: "无障碍坡道数量",
            format: {
              digitSeparator: true,
            },
          },
          {
            fieldName: "baf_park",
            label: "无障碍停车位数量",
            format: {
              digitSeparator: true,
            },
          },
          {
            fieldName: "baf_yspd",
            label: "缘石坡道数量",
            format: {
              digitSeparator: true,
            },
          },
          {
            fieldName: "baf_md",
            label: "盲道数量",
            format: {
              digitSeparator: true,
            },
          },
        ]
      },
    ],
  }
});
map.add(regionLayer);

const legend = new Legend({
  view: mapView
});
mapView.ui.add(legend, "bottom-right");

const filter = () => {
  let filterStr = "(" + facilityType.value + ")" + operator.value + filterNumber.value;
  console.log(filterStr);
  regionLayer.featureEffect = {
    filter: {
      where: filterStr
    },
    excludedEffect: "opacity(20%)"
  };
}

const reset = () => {
  regionLayer.featureEffect = null;
  operator.value = null;
  facilityType.value = null;
  filterNumber.value = null;
}

onUnmounted(() => {
  map.remove(regionLayer);
  mapView.ui.remove(legend);
})
</script>

<style scoped>
.container {
  position: absolute;
  top: 70px;
  left: 20px;
  width: 450px;
  border-radius: 20px;
  background-color: aliceblue;
}

.filter {
  padding: 10px;
}

.filter-container {
  display: flex;
}

.btns {
  float: right;
}

#error {
  color: red;
  display: none;
}
</style>
