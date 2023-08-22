<template>
  <v-card class="content">
    <v-card-title class="text-center">添加无障碍设施</v-card-title>
    <v-card-item>
      <v-file-input @update:model-value="onFileChange" accept="image/*" label="请输入图片" prepend-icon="mdi-image" multiple
        counter show-size>
        <template v-slot:selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip size="small" label color="primary" class="me-2">
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>
      <v-carousel v-show="showPhoto">
        <v-carousel-item v-for="(imageData, index) in files" :key="index" :src="imageData" cover></v-carousel-item>
      </v-carousel>
    </v-card-item>
    <v-row justify="space-between">
      <v-col cols="5">
        <v-btn @click="sendImagesToBackend" class="mt-2 elevation-4" color="blue" :loading="loading" block>
          提&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交
        </v-btn>
      </v-col>
      <v-col cols="5">
        <v-btn @click="showRecPic" class="mt-2 elevation-4" color="blue" :disabled="disabled" block>显示结果</v-btn>
      </v-col>
    </v-row>
  </v-card>
  <v-overlay v-model="overlay" class="align-center justify-center">
    <div style="display: grid;justify-items: center;">
      <v-card>
        <span v-show="loading" class="mb-4" style="font-size: xx-large;">识别中，请稍等！</span>
        <v-progress-linear :active="loading" :indeterminate="loading" color="deep-purple-accent-4"></v-progress-linear>
      </v-card>
      <span v-show="showPicture" class="mb-4" style="font-size: x-large;">
        识别成功{{ success_count }}张，识别失败{{ failure_count }}张！
      </span>
      <v-carousel class="photos" progress="primary" hide-delimiters v-show="showPicture">
        <v-carousel-item v-for="(imageData, index) in identifyFiles" :key="index" :src="imageData"
          cover></v-carousel-item>
      </v-carousel>
    </div>
  </v-overlay>
</template>

<script setup>
import { upload_feedback_facilities } from '@/api/feedback';
import Message from '@/components/msgbox/Message.js';
import ExifReader from 'exifreader';
import webConfig from '@/webConfig';
import Graphic from '@arcgis/core/Graphic';
import { createLayer } from '@/utils/layerConfig';
import { uniqueRenderer } from '@/utils/commonTemplate';
import { getExtent } from '@/utils/layerConfig';
import { onMounted, ref, toRaw, onUnmounted } from 'vue';
import { useMapStore } from '@/store/mapStore';
const mapStore = useMapStore();
const map = toRaw(mapStore.map);
const mapView = toRaw(mapStore.mapView);

const files = ref([]);
const showPhoto = ref(false);
const imageArray = ref([]);
const overlay = ref(false);
const loading = ref(false);
const disabled = ref(true);
const showPicture = ref(false);
const identifyFiles = ref([]);
const success_count = ref();
const failure_count = ref();

const onFileChange = async (selectedFiles) => {
  files.value = [];
  imageArray.value = [];
  for (let i = 0; i < selectedFiles.length; i++) {
    const tags = await ExifReader.load(selectedFiles[i]);
    const lon = tags['GPSLongitude'].description;
    const lat = tags['GPSLatitude'].description;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFiles[i]);
    reader.onload = (e) => {
      files.value.push(reader.result);
      imageArray.value.push({
        id: i,
        lon: lon,
        lat: lat,
        photo: reader.result
      });
    };
  }
  showPhoto.value = true;
}


const sendImagesToBackend = () => {
  overlay.value = true;
  loading.value = true;
  identifyFiles.value = [];
  upload_feedback_facilities(imageArray.value).then((result) => {
    const data = result.data;
    console.log(data);
    if (data.code === 0) {
      success_count.value = data.success_count;
      failure_count.value = data.failure_count;
      if (data.success_count > 0) {
        data.photos.forEach(element => {
          identifyFiles.value.push(webConfig.picURL + element.pic_url_after);
        });
        loading.value = false;
        showPicture.value = true;
        disabled.value = false;
        console.log(identifyFiles.value);
        newLayer(data.features);
        map.add(newFeatureLayer);
        mapView.goTo(newFeatureLayer.fullExtent).catch((error) => {
          console.error(error);
        });
      } else {
        loading.value = false;
        Message({ type: 'error', message: '识别失败！' });
      }
    } else {
      loading.value = false;
      Message({ type: 'error', message: '发送失败！' });
    }
  })
}

const newFeatureLayer = createLayer('新增无障碍设施', uniqueRenderer);
const newLayer = (newFeatures) => {
  let features = [];
  for (let item in newFeatures) {
    const data = newFeatures[item];
    const originalDate = new Date(data.time);
    const time = originalDate.getTime();

    const pData = new Graphic({
      attributes: {
        OBJECTID: item,
        classification: data.classification,
        evaluation: data.evaluation,
        address: data.address,
        time: time,
        pic_url_before: webConfig.picURL + data.pic_url_before,
        pic_url_after: webConfig.picURL + data.pic_url_after
      },
      geometry: { longitude: data.lon, latitude: data.lat, type: 'point' }
    });
    features.push(pData);
  }
  newFeatureLayer.fullExtent = getExtent(features);
  newFeatureLayer
    .applyEdits({
      addFeatures: features
    })
    .catch((error) => {
      console.log(error);
    });
}

const showRecPic = () => {
  overlay.value = true;
}

onUnmounted(() => {
  map.remove(newFeatureLayer);
})
</script>

<style scoped>
.content {
  position: absolute;
  top: 50px;
  left: 20px;
  padding: 10px;
  border-radius: 10px;
  min-width: 450px;
  max-width: 550px;
  /* min-height: 500px; */
}

.photos {
  width: 500px;
  /* height: 700px; */
}

.photos v-carousel-item img {
  height: 700px;
}
</style>
