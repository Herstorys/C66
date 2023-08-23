<template>
  <v-table fixed-header height="300px" hover>
    <thead>
      <tr>
        <th></th>
        <th class="text-center">用户名</th>
        <th class="text-center">上传时间</th>
        <th class="text-center">上传地址</th>
        <th class="text-center">信息</th>
        <th class="text-center">图片</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in feedbackData" :key="index" @click="handleRowClick(item)">
        <td class="text-center">{{ index + 1 }}</td>
        <td class="text-center">{{ item.username }}</td>
        <td class="text-center">{{ formattedTime(item.time) }}</td>
        <td class="text-center">{{ item.address }}</td>
        <td class="text-center">{{ item.detail }}</td>
        <td>
          <img :src="item.pic_url" alt="反馈问题的图片" style="max-width: 100px; max-height: 100px;"
            @click="showEnlargedImg(item.pic_url)" data-action="enlarge">
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-overlay v-model="enlargedImgModal" class="align-center justify-center">
    <img :src="enlargedImgUrl" alt="放大图片" style="max-height: 600px;" />
  </v-overlay>
</template>

<script setup>
import { ref, toRaw, onUnmounted } from 'vue';
import { useMapStore } from "@/store/mapStore";
import { get_search_feedback } from '@/api/feedback';
import { formattedTime } from '@/utils/commonFunction';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import webConfig from '@/webConfig';

const mapStore = useMapStore();
const map = toRaw(mapStore.map)
const mapView = toRaw(mapStore.mapView)

const feedbackData = ref();

get_search_feedback().then(result => {
  feedbackData.value = result.data.map(item => {
    return {
      ...item,
      pic_url: webConfig.picURL + item.pic_url
    }
  });
}).catch(error => {
  console.log(error);
})

const handleRowClick = (item) => {
  // 获取点击事件的来源元素
  const action = event.target.getAttribute('data-action');
  // 如果来源是点击图片放大的事件，则阻止事件冒泡，避免触发单击行事件
  if (action === 'enlarge') {
    event.stopPropagation();
    return;
  }
  mapView.graphics.removeAll()
  const point = new Point({
    longitude: item.lon,
    latitude: item.lat
  })
  const textSymbol = {
    type: "text",
    color: "#7A003C",
    text: "\ue61d",
    font: {
      size: 24,
      family: "CalciteWebCoreIcons"
    }
  };
  const graphic = new Graphic({
    geometry: point,
    attributes: {
      classification: item.classification,
      address: item.address
    },
    symbol: textSymbol
  });
  mapView.graphics.add(graphic)
  mapView.goTo({
    target: point,
    zoom: 18, // 设置缩放级别以便更好地看到该点
  })
}

// 放大图片的相关逻辑
const enlargedImgModal = ref(false); // 控制放大图片模态框的显示状态
const enlargedImgUrl = ref(''); // 放大图片的URL

const showEnlargedImg = (url) => {
  enlargedImgUrl.value = url;
  enlargedImgModal.value = true;
};

onUnmounted(() => {
  mapView.graphics.removeAll();
})
</script>

<style scoped>
tr:hover {
  background-color: #dfdfdf;
}
</style>
