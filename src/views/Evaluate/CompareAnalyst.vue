<template>
  <div class="container animate__animated animate__fadeInLeft">
    <v-card class="mx-auto">
      <v-card-title class="text-center text-h5">对比分析</v-card-title>
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
        <v-btn :disabled="loading" :loading="loading" block class="text-none mb-3" color="blue" size="large"
          variant="flat" @click="startAnalysis" rounded="lg">
          开始分析
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <v-card class="chart animate__animated animate__fadeInRight" v-show="flag">
    <div id="radarChart" style="width: 500px;height: 420px;"></div>
    <div id="lineChart" style="width: 500px;height: 430px;"></div>
  </v-card>
</template>

<script setup>
import { toRaw, ref, onUnmounted } from 'vue';
import { useMapStore } from "@/store/mapStore";
import { get_address, get_evaluation } from "@/api/evaluate";

import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';

import * as echarts from 'echarts/core';
import { TitleComponent, LegendComponent, TooltipComponent, ToolboxComponent, GridComponent, } from 'echarts/components';
import { RadarChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { createLayer } from '@/utils/layerConfig';
import { UniversalTransition } from 'echarts/features';
import { uniqueRenderer, textSymbol } from '@/utils/commonTemplate';
import { getAllFacilities } from '@/utils/commonFunction';


echarts.use([
  TitleComponent,
  LegendComponent,
  RadarChart,
  TooltipComponent,
  CanvasRenderer,
  ToolboxComponent,
  GridComponent,
  LineChart,
  UniversalTransition,
]);

const mapStore = useMapStore();
const map = toRaw(mapStore.map)
const mapView = toRaw(mapStore.mapView)

// import { useLayerStore } from '@/store/layerStore';
// const layerStore = useLayerStore();
// const facilityLayer = toRaw(layerStore.layer);
// facilityLayer.renderer = uniqueRenderer;
// map.add(facilityLayer);

const flag = ref(false)
const loading = ref(false)

const featureLayer = createLayer("无障碍设施", uniqueRenderer);

const features = getAllFacilities();

features.then((result) => {
  featureLayer.applyEdits({
    addFeatures: result
  }).catch(error => {
    console.log(error);
  });
})
featureLayer.renderer = uniqueRenderer;
map.add(featureLayer);

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
  drawRadarChart();
  drawLineChart();
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
var radarChart;
var radarOption;
const drawRadarChart = () => {
  const chartDom = document.getElementById('radarChart');
  radarChart = echarts.init(chartDom);
  radarOption = {
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
  radarOption.radar.indicator = calIndicator(uniqueCategories, chartData);
  radarOption.series.data = chartData.map((data, index) => ({
    value: Object.values(data),
    name: `对比${index + 1}`,
  }));
  radarChart.setOption(radarOption, true);

  const lineData = chartData.map((data, index) => (
    Object.values(data)
  ));
  const lineXAixs = chartData.map((data) => (
    Object.keys(data)
  ));

  lineOption.xAxis.data = lineXAixs[0];
  lineOption.series[0].data = lineData[0];
  lineOption.series[1].data = lineData[1];
  lineOption.series[2].data = lineData[2];
  lineChart.setOption(lineOption, true);
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

var lineChart;
var lineOption;
const drawLineChart = () => {
  var chartDom = document.getElementById('lineChart');
  lineChart = echarts.init(chartDom);
  lineOption = {
    color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      top: 'bottom'
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      name: '类别',
      boundaryGap: false,
      axisLabel: {
        interval: 0,
        inside: false,
        formatter: function (value) {
          return value.split('').join('\n')
        }
      },
      nameTextStyle: {
        align: "center",
      },
    },
    yAxis: {
      type: 'value',
      name: '评分',
    },
    series: [
      {
        name: '对比1',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)'
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '对比2',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(0, 221, 255)'
            },
            {
              offset: 1,
              color: 'rgb(77, 119, 255)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: '对比3',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(55, 162, 255)'
            },
            {
              offset: 1,
              color: 'rgb(116, 21, 219)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
      },
    ]
  };
}


onUnmounted(() => {
  map.remove(featureLayer);
  mapView.graphics.remove(graphic);
  // mapView.ui.remove();
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

.chart {
  background-color: aliceblue;
  position: absolute;
  top: 70px;
  right: 20px;
  border-radius: 10px;
}
</style>
