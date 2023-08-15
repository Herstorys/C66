<template>
  <v-card class="mx-auto">
    <v-card-item>
      <v-col cols="12">
        <v-autocomplete v-model="searchText1" :items="address" density="comfortable" aria-label="对比1" label="对比1"
          placeholder="江西理工大学(三江校区)创新创业学院" @update:model-value="updateModelValue" :readonly="loading"></v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-autocomplete v-model="searchText2" :items="address" density="comfortable" aria-label="对比2" label="对比2"
          placeholder="赣州市人民医院" @update:model-value="updateModelValue" :readonly="loading"></v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-autocomplete v-model="searchText3" :items="address" density="comfortable" aria-label="对比3" label="对比3"
          placeholder="赣州步步高新天地" @update:model-value="updateModelValue" :readonly="loading"></v-autocomplete>
      </v-col>
    </v-card-item>
    <v-card-actions>
      <v-btn :disabled="loading" :loading="loading" block class="text-none mb-3" color="indigo-darken-3" size="large"
        variant="flat" @click="startAnalysis" rounded="lg">
        开始分析
      </v-btn>
    </v-card-actions>
  </v-card>
  <Teleport to="#compare-analyst-container">
    <div id="main" class="animate__animated animate__fadeInRight" v-show="flag"></div>
  </Teleport>
</template>

<script setup>
import { toRaw, ref, onUnmounted } from 'vue';
import { useMapStore } from "@/store/mapStore";
import { get_address, get_evaluation } from "@/api/address";

import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';

import * as echarts from 'echarts/core';
import { TitleComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { RadarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { uniqueRenderer, textSymbol } from '@/utils/commonTemplate';

echarts.use([
  TitleComponent,
  LegendComponent,
  RadarChart,
  TooltipComponent,
  CanvasRenderer
]);

const mapStore = useMapStore();
const map = toRaw(mapStore.map)
const mapView = toRaw(mapStore.mapView)

import { useLayerStore } from '@/store/layerStore';
const layerStore = useLayerStore();
const facilityLayer = toRaw(layerStore.layer);
facilityLayer.renderer = uniqueRenderer;
map.add(facilityLayer);

const flag = ref(false)
const loading = ref(false)

const address = ref([]);
get_address().then((result) => {
  const datas = result.data;
  datas.map((value) => {
    address.value.push(value[0]);
  })
}).catch((error) => {
  console.log(error);
});

const searchText1 = ref();
const searchText2 = ref();
const searchText3 = ref();

const startAnalysis = async () => {
  loading.value = true;

  // 获取文本框内容
  const place1 = searchText1.value;
  const place2 = searchText2.value;
  const place3 = searchText3.value;

  // 发送请求获取数据
  const result1 = await get_evaluation(place1);
  const result2 = await get_evaluation(place2);
  const result3 = await get_evaluation(place3);

  // 统一处理数据
  const data1 = getEvaluation(result1.data);
  const data2 = getEvaluation(result2.data);
  const data3 = getEvaluation(result3.data);

  // 绘制雷达图
  drawRadarChart()
  calData([data1, data2, data3]);

  loading.value = false;
  flag.value = true;
}

const graphic = new Graphic();

const updateModelValue = async (value) => {
  const evaluation_result = await get_evaluation(value);
  if (evaluation_result.data && evaluation_result.data.length > 0) {
    const feature = evaluation_result.data[0];

    const point = new Point({
      longitude: feature.lon,
      latitude: feature.lat
    });
    // 添加图形到 mapView
    graphic.geometry = point;
    graphic.symbol = textSymbol;
    graphic.attributes = {
      address: feature.address
    };
    mapView.graphics.removeAll(); // 清除之前绘制的点
    mapView.graphics.add(graphic); // 添加新的点图形
    let opts = {
      duration: 3000
    };
    mapView.goTo({
      target: point,
      zoom: 18
    }, opts).catch((error) => {
      if (error.name != "AbortError") {
        console.error(error);
      }
    });
  }
}

const getEvaluation = (data) => {
  const accessibilityData = {};
  data.forEach(res => {
    if (accessibilityData[res.classification]) {
      accessibilityData[res.classification] += parseFloat((res.evaluation).toFixed(5));
    } else {
      accessibilityData[res.classification] = res.evaluation;
    }
  });
  for (const key in accessibilityData) {
    if (accessibilityData.hasOwnProperty(key)) {
      accessibilityData[key] = parseFloat(accessibilityData[key].toFixed(2));
    }
  }
  return accessibilityData
}
var myChart;
var option;
const drawRadarChart = () => {
  const chartDom = document.getElementById('main');
  myChart = echarts.init(chartDom);
  option = {
    title: {
      text: "无障碍设施对比分析图",
      left: 'center',
      textSymbol: {
        fontSize: 30
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 'bottom'
    },
    radar: {
      center: ['50%', '50%'],
      radius: 120,
      startAngle: 90,
      splitNumber: 5,
      shape: 'circle',
      axisName: {
        formatter: '【{value}】',
        color: '#428BD4'
      },
      splitArea: {
        areaStyle: {
          color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 10
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(211, 253, 250, 0.8)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(211, 253, 250, 0.8)'
        }
      },
      axisTick: {
        show: true,
        color: '#428BD4'
      }
    },
    series: {
      type: 'radar',
      emphasis: {
        lineStyle: {
          width: 4
        },
        areaStyle: {
          opacity: 0.4
        },// 区域填充样式
      },
      tooltip: {
        trigger: 'item'
      },
    },
  };
}

const calData = (searchData) => {
  const uniqueCategories = [];
  // 合并类别并计算总类别
  searchData.forEach(obj => {
    Object.keys(obj).forEach(category => {
      if (!uniqueCategories.includes(category)) {
        uniqueCategories.push(category);
      }
    });
  });
  const chartData = sortedData(searchData, uniqueCategories);
  option.radar.indicator = calIndicator(uniqueCategories, chartData);
  option.series.data = chartData.map((data, index) => ({
    value: Object.values(data),
    name: `对比${index + 1}`,
  }));
  myChart.setOption(option, true);
}

const calIndicator = (uniqueCategories, chartData) => {
  const classification = [];
  const max = maxValue(chartData)
  uniqueCategories.forEach(category => {
    classification.push({ name: category, max: max });
  });
  return classification;
};

const maxValue = (data) => {
  return data.reduce((max, obj) => {
    const values = Object.values(obj);
    const maxObjValue = Math.max(...values);
    return Math.max(max, maxObjValue);
  }, 0);
}

const sortedData = (data, order) => {
  return data.map(item => {
    const sortedItem = {};
    order.forEach(key => {
      sortedItem[key] = item.hasOwnProperty(key) ? item[key] : 0;
    });
    return sortedItem;
  })
};

onUnmounted(() => {
  // map.remove(facilityLayer);
  mapView.graphics.remove(graphic);
  // mapView.ui.remove();
})
</script>

<style scoped>
#main {
  background-color: aliceblue;
  position: absolute;
  top: 200px;
  right: 20px;
  width: 500px;
  height: 450px;
}
</style>
