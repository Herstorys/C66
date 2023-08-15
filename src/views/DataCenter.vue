<template>
  <div class="data">
    <v-container fluid class="bg-white" style="height: 100%;">
      <v-row>
        <v-col cols="3">
          <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :elevation="isHovering ? 24 : 6">
              <v-card-text>
                <div style="height: 393px;">
                  <br><br>
                  <label style="font-size: x-large;">无障碍设施数量统计</label>
                  <br><br><br>
                  <label style="font-size: x-large;">
                    {{ facilities.length ? facilities.length : 0 }}
                  </label>
                  <br><br><br>
                  <label style="font-size: x-large;">问题反馈数量</label>
                  <br><br><br>
                  <label style="font-size: x-large;">
                    {{ feedbackQuestions.length ? feedbackQuestions.length : 0 }}
                  </label>
                  <br><br><br>
                  <label style="font-size: x-large;">待审核的无障碍设施数量</label>
                  <br><br><br>
                  <label style="font-size: x-large;">
                    {{ feedbackFacilities.length ? feedbackFacilities.length : 0 }}
                  </label>
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="4">
          <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :elevation="isHovering ? 24 : 6">
              <v-card-title style="font-size: xx-large;">无障碍设施类型占比</v-card-title>
              <v-card-text>
                <div id="pieChart" style="height: 360px;"></div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="5">
          <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :elevation="isHovering ? 24 : 6">
              <v-card-title style="font-size: xx-large;">无障碍设施类型数量</v-card-title>
              <v-card-text>
                <div id="barChart" style="height: 360px;"></div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :elevation="isHovering ? 24 : 6">
              <v-card-title style="font-size: xx-large;">用户反馈问题</v-card-title>
              <v-card-text>
                <div id="nightingleChart" style="height: 360px;"></div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="4">
          <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :elevation="isHovering ? 24 : 6">
              <v-card-title style="font-size: xx-large;">词云</v-card-title>
              <v-card-text>
                <div id="wordcloudChart" style="height: 360px;"></div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="4">
          <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :elevation="isHovering ? 24 : 6">
              <v-card-title style="font-size: xx-large;">用户反馈数量</v-card-title>
              <v-card-text>
                <div id="lineChart" style="height: 360px;"></div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { get_facilities } from '@/api/facilities';
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

//柱状图
var barChart;
var barOption;
const drawBarChart = () => {
  var barChartDom = document.getElementById('barChart');
  barChart = echarts.init(barChartDom);
  barOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
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
      name: '类别',
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        interval: 0,
      },
      nameTextStyle: {
        align: "center",
      }
    },
    yAxis: {
      name: "数量",
      type: 'value'
    },
    series: {
      name: '无障碍设施类型数量',
      type: 'bar',
      barWidth: '60%',
    }
  };
}

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
      orient: 'vertical',
      left: 'left',
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
  barOption.xAxis.data = classifications;
  barOption.series.data = counts;
  barOption && barChart.setOption(barOption, true);
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
      name: 'Nightingale Chart',
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
    "其他问题": 0,
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
    if (detail.includes("其他问题")) {
      issueCount["其他问题"]++;
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
  wordcloudOption.series.data = nightingleData;
  wordcloudOption && wordcloudChart.setOption(wordcloudOption, true);
});

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
    },
    grid: {
      left: '1%',
      right: '5%',
      bottom: '3%',
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
        interval: 0,
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
  drawBarChart();
  drawNightingleChart();
  drawWordcloudChart();
  drawLineChart();
})
</script>

<style scoped>
.data {
  position: absolute;
  bottom: 0px;
  text-align: center;
  width: 100%;
  height: 94%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
