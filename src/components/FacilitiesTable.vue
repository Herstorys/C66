<template>
  <v-table fixed-header height="300px" hover>
    <thead>
      <tr>
        <th></th>
        <th class="text-center">类别</th>
        <th class="text-center">评分</th>
        <th class="text-center">上传时间</th>
        <th class="text-center">上传地址</th>
        <th class="text-center">原始图片</th>
        <th class="text-center">识别后的图片</th>
        <th class="text-center">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index" @click="handleRowClick(item)">
        <td>{{ index + 1 }}</td>
        <td>{{ item.classification }}</td>
        <td>{{ item.evaluation }}</td>
        <td>{{ formattedTime(item.time) }}</td>
        <td>{{ item.address }}</td>
        <td>
          <img :src="item.pic_url_before" alt="原始图片" style="max-width: 100px; max-height: 100px;"
            @click="showEnlargedImg(item.pic_url_before)" data-action="enlarge">
        </td>
        <td>
          <img :src="item.pic_url_after" alt="识别后的图片" style="max-width: 100px; max-height: 100px;"
            @click="showEnlargedImg(item.pic_url_after)" data-action="enlarge">
        </td>
        <td style="width: 220px;">
          <v-btn @click="addFacility(item)" color="success" prepend-icon="mdi-check-circle"
            data-action="enlarge">通过</v-btn>&nbsp;
          <v-btn @click="deleteFacility(item)" color="error" prepend-icon="mdi-delete-forever"
            data-action="enlarge">删除</v-btn>
        </td>
      </tr>
    </tbody>
    <v-overlay v-model="overlay" contained class="align-center justify-center">
      <v-card width="200" class="text-center">
        <template v-slot:text>
          确定要删除该条记录吗？
        </template>
        <v-card-actions class="align-center justify-center">
          <v-btn color="success" @click="confirmDel">确定</v-btn>&nbsp;&nbsp;
          <v-btn @click="overlay = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </v-table>
  <v-overlay v-model="enlargedImgModal" class="align-center justify-center">
    <img :src="enlargedImgUrl" alt="放大图片" style="max-height: 600px;" />
  </v-overlay>
</template>

<script setup>
import { ref, toRaw, onUnmounted } from 'vue';
import { useMapStore } from "@/store/mapStore";
import { get_search_facilities, add_facilities, delete_facilities } from '@/api/feedback';
import Message from '@/components/msgbox/Message.js';
import { formattedTime } from '@/utils/commonFunction';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import webConfig from '@/webConfig';

const mapStore = useMapStore();
const map = toRaw(mapStore.map)
const mapView = toRaw(mapStore.mapView)

const data = ref([]);
const isShow = ref(false)
const overlay = ref(false)
const deleteItemId = ref(null);

get_search_facilities().then(result => {
  data.value = result.data.map(item => {
    return {
      ...item,
      pic_url_before: webConfig.picURL + item.pic_url_before,
      pic_url_after: webConfig.picURL + item.pic_url_after,
    }
  });
}).catch(error => {
  console.log(error);
})

const addFacility = (item) => {
  console.log(item);
  add_facilities(item.id).then(res => {
    if (res.data.code === 0) {
      isShow.value = true
      Message({ type: 'success', message: res.data.msg });
      const index = data.value.findIndex((el) => el.id === item.id);
      if (index !== -1) {
        data.value.splice(index, 1);
      }
    } else {
      isShow.value = true
      Message({ type: 'error', message: res.data.msg });
    }
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    overlay.value = false
    setTimeout(() => {
      isShow.value = false;
    }, 2000);
  })
}

const deleteFacility = (item) => {
  overlay.value = true
  deleteItemId.value = item.id
}

const confirmDel = () => {
  if (deleteItemId.value) {
    delete_facilities(deleteItemId.value).then(res => {
      if (res.data.code === 0) {
        isShow.value = true
        Message({ type: 'success', message: res.data.msg });
        const index = data.value.findIndex((el) => el.id === deleteItemId.value);
        if (index !== -1) {
          data.value.splice(index, 1);
        }
      } else {
        isShow.value = true
        Message({ type: 'error', message: res.data.msg });
      }
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      deleteItemId.value = null
      overlay.value = false
      setTimeout(() => {
        isShow.value = false;
      }, 2000);
    })
  }
}

const handleRowClick = (item) => {
  console.log(item.address);
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
    zoom: 18
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
