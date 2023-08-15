<template>
  <div id="barChart" class="chart"></div>
  <div id="pieChart" class="chart"></div>
  <!-- <div id="radarChart" class="chart"></div> -->
</template>

<script setup>
import * as echarts from 'echarts/core';
import {
  ToolboxComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  GridComponent
} from 'echarts/components';
import { PieChart, BarChart, LineChart, RadarChart } from 'echarts/charts';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import { onMounted, watch } from 'vue';

echarts.use([
  ToolboxComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  RadarChart,
  GridComponent,
  LineChart,
  UniversalTransition,
  BarChart]
);

const props = defineProps({ queryData: Array, xAxis: Array })

let pieChart;
let pieOption;
const drawPieChart = () => {
  const chartDom = document.getElementById('pieChart');
  pieChart = echarts.init(chartDom);
  pieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      left: 'center',
      top: 'bottom'
    },
    series: {
      name: '无障碍设施',
      type: 'pie',
      radius: [20, 120],
      center: ['50%', '43%'],
      roseType: 'radius',
      itemStyle: {
        borderRadius: 5
      },
      label: {
        show: false
      },
    }
  };
}

watch(() => props.queryData, (newValue, oldValue) => {
  const data = props.queryData;
  const xData = props.xAxis;
  const chartData = data.map(item => {
    return {
      name: item.name,
      value: parseFloat(item.value.toFixed(2))
    }
  })
  pieOption.series.data = chartData;
  pieOption && pieChart.setOption(pieOption, true);
  barOption.xAxis.data = xData;
  barOption.series.data = chartData;
  barOption && barChart.setOption(barOption, true);
})

let radarChart;
const drawRadarChart = () => {
  let radarOption;
  radarOption = {
    title: {
      text: 'Proportion of Browsers',
      subtext: 'Fake Data',
      top: 10,
      left: 10
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll',
      bottom: 10,
    },
    visualMap: {
      top: 'middle',
      right: 10,
      color: ['red', 'yellow'],
      calculable: true
    },
    radar: {
      indicator: [
        { name: 'IE8-' },
      ]
    },
    series: props.queryData
  };
  if (radarChart != null && radarChart !== "" && radarChart !== undefined) {
    radarChart.dispose()
  }
  const chartDom = document.getElementById('radarChart');
  radarChart = echarts.init(chartDom);
  radarChart.setOption(radarOption);
}

let barChart;
let barOption;
const drawBarChart = () => {
  const chartDom = document.getElementById('barChart');
  barChart = echarts.init(chartDom);
  barOption = {
    title: {
      text: '无障碍设施评分',
      left: 'center'
    },
    legend: {
      top: 'bottom'
    },
    grid: {
      left: '4%',
      bottom: '8%',
      containLabel: true
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}'
    },
    xAxis: {
      name: '类别',
      type: 'category',
      axisTick: {
        inside: true,
      },
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: {
      name: '评分',
      type: 'value'
    },
    series: {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' }
          ])
        }
      },
    }
  };
}

onMounted(() => {
  drawBarChart()
  drawPieChart()
  // drawRadarChart()
});
</script>

<style scoped>
.chart {
  width: 500px;
  height: 340px;
}
</style>
