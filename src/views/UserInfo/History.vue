<template>
  <div class="history animate__animated animate__fadeInRight">
    <v-card width="1100px">
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="one">路径查询记录</v-tab>
        <v-tab value="two">用户反馈记录</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="one">
            <v-table fixed-header height="300px">
              <thead>
                <tr>
                  <th></th>
                  <th class="text-center">用户名</th>
                  <th class="text-center">查询时间</th>
                  <th class="text-center">起点</th>
                  <th class="text-center">终点</th>
                  <!-- <th class="text-center">图片</th> -->
                </tr>
              </thead>
              <tbody>
                <!-- @click="handleRowClick(item)" -->
                <tr v-for="(item, index) in userRoutes" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.username }}</td>
                  <td>{{ formattedTime(item.time) }}</td>
                  <td>{{ item.startPoint }}</td>
                  <td>{{ item.endPoint }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
          <v-window-item value="two">
            <v-table fixed-header height="300px">
              <thead>
                <tr>
                  <th></th>
                  <th class="text-center">用户名</th>
                  <th class="text-center">反馈问题</th>
                  <th class="text-center">上传地址</th>
                  <th class="text-center">上传时间</th>
                  <th class="text-center">图片</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in userFeedbackData" :key="index" @click="handleRowClick(item)">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.username }}</td>
                  <td>{{ item.detail }}</td>
                  <td>{{ item.address }}</td>
                  <td>{{ formattedTime(item.time) }}</td>
                  <td>
                    <img :src="item.pic_url" alt="反馈问题的图片" style="max-width: 100px; max-height: 100px;"
                      @click="showEnlargedImg(item.pic_url)" data-action="enlarge">
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
    <v-overlay v-model="enlargedImgModal" class="align-center justify-center">
      <img :src="enlargedImgUrl" alt="放大图片" style="max-height: 600px;" />
    </v-overlay>
  </div>
</template>

<script setup>
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import { get_search_user_feedback, get_user_routes } from '@/api/feedback';
import { useMapStore } from '@/store/mapStore';
import { useUserStore } from '@/store/user'
import { ref, toRaw, onUnmounted } from 'vue';
import { textSymbol } from '@/utils/commonTemplate';
import webConfig from '@/webConfig';

const userStore = useUserStore();
const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const tab = ref(null)
const userFeedbackData = ref()
const userRoutes = ref()

get_search_user_feedback(userStore.username).then(result => {
  userFeedbackData.value = result.data.map((item) => {
    return {
      ...item,
      pic_url: webConfig.picURL + item.pic_url,
    }
  });
  console.log(userFeedbackData.value);
}).catch(error => {
  console.log(error);
})

get_user_routes(userStore.username).then(result => {
  userRoutes.value = result.data
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
  mapView.graphics.removeAll();
  const point = new Point({
    longitude: item.lon,
    latitude: item.lat
  })
  const graphic = new Graphic({
    geometry: point,
    attributes: {
      address: item.address
    },
    symbol: textSymbol
  });
  mapView.graphics.add(graphic)
  let opts = {
    duration: 3000
  };
  mapView.goTo({
    target: point,
    zoom: 17
  }, opts).catch((error) => {
    if (error.name != "AbortError") {
      console.error(error);
    }
  });
}

// 计算属性用于处理时间格式转换
const formattedTime = (time) => {
  const dateObj = new Date(time);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

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
.history {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 1100px;
}

tr:hover {
  background-color: #dfdfdf;
}
</style>
