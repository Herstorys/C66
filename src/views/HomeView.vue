<template>
  <div class="leftChart">
    <v-hover v-slot="{ isHovering, props }">
      <v-card v-bind="props" :elevation="isHovering ? 24 : 6">
        <v-card-item>
          <v-card-title class="text-center" style="font-size: x-large;">无障碍设施类型占比</v-card-title>
          <div id="pieChart" style="height: 410px;width:500px;"></div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-item>
          <v-card-title class="text-center" style="font-size: x-large;">词云</v-card-title>
          <div id="wordcloudChart" style="height: 410px;width:500px;"></div>
        </v-card-item>
      </v-card>
    </v-hover>
  </div>
  <div class="rightChart">
    <v-hover v-slot="{ isHovering, props }">
      <v-card v-bind="props" :elevation="isHovering ? 24 : 6">
        <v-card-item>
          <v-card-title class="text-center" style="font-size: x-large;">用户反馈问题</v-card-title>
          <div id="nightingleChart" style="height: 410px;width:500px;"></div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-item>
          <v-card-title class="text-center" style="font-size: x-large;">用户反馈数量</v-card-title>
          <div id="lineChart" style="height: 410px;width:500px;"></div>
        </v-card-item>
      </v-card>
    </v-hover>
  </div>
  <v-hover v-slot="{ isHovering, props }">
    <v-card class="timeSiler" v-bind="props" :elevation="isHovering ? 24 : 6">
      <v-card-item>
        <div id="timeSiler"></div>
      </v-card-item>
    </v-card>
  </v-hover>
</template>

<script setup>
import { get_facilities, get_word_data } from '@/api/facilities';
import { get_search_feedback, get_search_facilities } from '@/api/feedback';
import { ref, watch, onMounted } from 'vue';

import * as echarts from 'echarts/core';
import 'echarts-wordcloud';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent
} from 'echarts/components';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  GridComponent,
  BarChart,
  ToolboxComponent,
  LineChart,
  UniversalTransition,
]);

const facilities = ref([]);
const feedbackQuestions = ref([]);
const feedbackFacilities = ref([]);
const wordCloudData = ref();

get_facilities().then(res => {
  facilities.value = res.data;
}).catch(err => {
  console.log(err);
})

get_search_feedback().then(res => {
  feedbackQuestions.value = res.data;
}).catch(err => {
  console.log(err);
});

get_search_facilities().then(res => {
  feedbackFacilities.value = res.data;
}).catch(err => {
  console.log(err);
});

get_word_data().then(res => {
  const data = res.data;
  wordCloudData.value = data.map(element => {
    return { value: element.frequency, name: element.word }
  });
}).catch(err => {
  console.log(err);
});

//饼图
var pieChart;
var pieOption;
const drawPieChart = () => {
  var pieChartDom = document.getElementById('pieChart');
  pieChart = echarts.init(pieChartDom);
  pieOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      // orient: 'horizonal',
      top: 'bottom',
    },
    grid: {
      left: '0%',
      right: '4%',
      bottom: '0%',
      containLabel: true
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: {
      name: '无障碍设施类型占比',
      type: 'pie',
      radius: '50%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  };
}

const calFacilities = (data) => {
  const classificationCount = {};
  data.forEach(item => {
    const classification = item.classification;
    if (classificationCount[classification]) {
      classificationCount[classification]++;
    } else {
      classificationCount[classification] = 1;
    }
  });
  return classificationCount;
}

const facilitiesData = () => {
  const classificationCount = calFacilities(facilities.value);
  const pieData = Object.keys(classificationCount).map(classification => {
    return { value: classificationCount[classification], name: classification };
  });
  const classifications = Object.keys(classificationCount);
  const counts = Object.values(classificationCount);
  return [pieData, classifications, counts]
}

watch(facilities, () => {
  const [pieData, classifications, counts] = facilitiesData();
  pieOption.series.data = pieData;
  pieOption && pieChart.setOption(pieOption, true);
})

//南丁格尔图
var nightingleChart
var nightingleOption;
const drawNightingleChart = () => {
  var nightingleChartDom = document.getElementById('nightingleChart');
  nightingleChart = echarts.init(nightingleChartDom);
  nightingleOption = {
    legend: {
      top: 'bottom'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    grid: {
      left: '0%',
      right: '6%',
      bottom: '0%',
      containLabel: true
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: {
      name: '用户反馈问题类型',
      type: 'pie',
      radius: [30, 120],
      center: ['50%', '40%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
    }
  };
}

const countIssues = (data) => {
  const issueCount = {
    "破损问题": 0,
    "占道问题": 0,
    "不规范问题": 0,
    "其它问题": 0,
  };

  data.forEach(item => {
    const detail = item.detail;
    if (detail.includes("破损问题")) {
      issueCount["破损问题"]++;
    }
    if (detail.includes("占道问题")) {
      issueCount["占道问题"]++;
    }
    if (detail.includes("不规范问题")) {
      issueCount["不规范问题"]++;
    }
    if (detail.includes("其它问题")) {
      issueCount["其它问题"]++;
    }
  });

  return issueCount;
};

const convertToValueNameArray = (dataObj) => {
  const result = Object.keys(dataObj).map(issue => {
    return { value: dataObj[issue], name: issue };
  });

  return result;
};

//词云
var wordcloudChart;
var wordcloudOption;
const drawWordcloudChart = () => {
  var wordcloudChartDom = document.getElementById('wordcloudChart');
  wordcloudChart = echarts.init(wordcloudChartDom);
  wordcloudOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: {
      type: 'wordCloud',
      shape: 'circle',
      keepAspect: false,
      // maskImage: maskImage,
      left: 'center',
      top: 'center',
      width: '70%',
      height: '80%',
      right: null,
      bottom: null,
      sizeRange: [12, 60],
      rotationRange: [-90, 90],
      rotationStep: 45,
      gridSize: 8,
      drawOutOfBound: false,
      shrinkToFit: false,
      layoutAnimation: true,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function () {
          return 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')';
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          textShadowBlur: 10,
          textShadowColor: '#333'
        }
      },
    }
  }
}

watch(feedbackQuestions, () => {
  const issueCount = countIssues(feedbackQuestions.value);
  const nightingleData = convertToValueNameArray(issueCount);
  nightingleOption.series.data = nightingleData;
  nightingleOption && nightingleChart.setOption(nightingleOption, true);
  // wordcloudOption.series.data = nightingleData;
  // wordcloudOption && wordcloudChart.setOption(wordcloudOption, true);
});

watch(wordCloudData, () => {
  wordcloudOption.series.data = wordCloudData.value;
  wordcloudOption && wordcloudChart.setOption(wordcloudOption, true);
})

//折线图
var lineChart;
var lineOption;
const drawLineChart = () => {
  var lineChartDom = document.getElementById('lineChart');
  lineChart = echarts.init(lineChartDom);
  lineOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 'bottom'
    },
    grid: {
      left: '0%',
      right: '6%',
      bottom: '4%',
      containLabel: true
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: {
      name: '日期',
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        inside: false,
        rotate: 45,
      },
      nameTextStyle: {
        align: "center",
      }
    },
    yAxis: {
      name: '数量',
      type: 'value'
    },
    series: [
      {
        name: '反馈问题的数量',
        type: 'line',
        smooth: true,
      },
      {
        name: '反馈设施的数量',
        type: 'line',
        smooth: true,
      },
    ]
  };
}

const processDataByDate = (data) => {
  const dateCountMap = {};

  data.forEach(item => {
    const dateString = new Date(item.time);
    const month = dateString.getUTCMonth() + 1;
    const day = dateString.getUTCDate();
    const date = month + '-' + day;
    if (dateCountMap[date]) {
      dateCountMap[date]++;
    } else {
      dateCountMap[date] = 1;
    }
  });

  const result = Object.keys(dateCountMap).map(dateString => {
    return { [dateString]: dateCountMap[dateString] };
  });

  return result;
};

const combineAndExtractDates = (array1, array2) => {
  const combinedArray = [...array1, ...array2];
  const uniqueDatesObject = combinedArray.reduce((obj, item) => {
    const date = Object.keys(item)[0];
    obj[date] = 1;
    return obj;
  }, {});
  const timeArray = Object.keys(uniqueDatesObject);
  const sortedTimeArray = timeArray.slice().sort(compareDates);

  return sortedTimeArray;
};

const compareDates = (dateString1, dateString2) => {
  var parts1 = dateString1.split('-');
  var parts2 = dateString2.split('-');
  var month1 = parseInt(parts1[0], 10);
  var day1 = parseInt(parts1[1], 10);
  var month2 = parseInt(parts2[0], 10);
  var day2 = parseInt(parts2[1], 10);

  if (month1 !== month2) {
    return month1 - month2;
  } else {
    return day1 - day2;
  }
}

const fillAndAlignArrays = (timeArray, array1, array2) => {
  const data1 = Object.fromEntries(array1.map(item => [Object.keys(item)[0], Object.values(item)[0]]));
  const data2 = Object.fromEntries(array2.map(item => [Object.keys(item)[0], Object.values(item)[0]]));

  const result1 = [];
  const result2 = [];

  timeArray.forEach(time => {
    result1.push({ [time]: data1[time] || 0 });
    result2.push({ [time]: data2[time] || 0 });
  });

  return [result1, result2];
}

function convertToArray (resultArray) {
  return resultArray.map(item => Object.values(item)[0]);
}

const calLineData = () => {
  const feedbackFacilitiesCount = processDataByDate(feedbackFacilities.value);
  const feedbackQuestionsCount = processDataByDate(feedbackQuestions.value);

  const times = combineAndExtractDates(feedbackFacilitiesCount, feedbackQuestionsCount);

  const [time1filledData, time2filledData] = fillAndAlignArrays(times, feedbackFacilitiesCount, feedbackQuestionsCount);

  const feedbackFacilitiesData = convertToArray(time1filledData);
  const feedbackQuestionsData = convertToArray(time2filledData);

  return [times, feedbackFacilitiesData, feedbackQuestionsData];
}

watch([feedbackFacilities, feedbackQuestions], () => {
  const [times, feedbackFacilitiesData, feedbackQuestionsData] = calLineData();

  lineOption.xAxis.data = times;
  lineOption.series[0].data = feedbackFacilitiesData;
  lineOption.series[1].data = feedbackQuestionsData;
  lineOption && lineChart.setOption(lineOption, true);
})

onMounted(() => {
  drawPieChart();
  drawNightingleChart();
  drawWordcloudChart();
  drawLineChart();
  timeSlider.container = document.getElementById("timeSiler");
})


import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TimeExtent from "@arcgis/core/TimeExtent.js";
import { useMapStore } from "@/store/mapStore";
import { toRaw, onUnmounted } from "vue";
import { getExtent } from "@/utils/layerConfig";
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
      value: 3
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

const timeSlider = new TimeSlider({
  view: mapView,
  timeVisible: true,
  mode: "cumulative-from-start",
  loop: true,
});

onUnmounted(() => {
  map.remove(facilityLayer);
})
</script>

<style scoped>
.leftChart {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 20px;
  left: 20px;
}

.rightChart {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 20px;
  right: 20px;
}

.timeSiler {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%);
  height: 200px;
  width: 700px;
}
</style>

