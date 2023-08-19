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
    <v-btn @click="sendImagesToBackend" class="mt-4 elevation-4" color="blue" block>
      提&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交
    </v-btn>
  </v-card>
  <v-overlay v-model="overlay" class="align-center justify-center">
    <v-carousel class="photos" progress="primary" hide-delimiters>
      <v-carousel-item v-for="(imageData, index) in identifyFiles" :key="index" :src="imageData" cover></v-carousel-item>
    </v-carousel>
  </v-overlay>
</template>

<script setup>
import { upload_feedback_facilities } from '@/api/feedback';
import { ref } from 'vue';
import ExifReader from 'exifreader';

const files = ref([]);
const showPhoto = ref(false);
const imageArray = ref([]);

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

const overlay = ref(false)
const identifyFiles = ref([])
const sendImagesToBackend = () => {
  upload_feedback_facilities(imageArray.value).then((result) => {
    const data = result.data.photos;
    data.forEach(element => {
      identifyFiles.value.push(element.photo);
    });
    overlay.value = true;
  })
}

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
