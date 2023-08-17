<template>
  <v-card class="content">
    <v-card-title class="text-center">添加无障碍设施</v-card-title>
    <v-card-item>
      <v-file-input @update:model-value="onFileChange" v-model="files" accept="image/*" label="请输入图片"
        prepend-icon="mdi-image" multiple counter show-size>
        <template v-slot:selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip size="small" label color="primary" class="me-2">
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>
      <div class="image-container">
        <v-img v-for="(imageData, index) in selectedImages" :key="index" :src="imageData" class="image-item" />
      </div>
    </v-card-item>
    <v-card-actions>
      <v-btn>提交</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { upload_feedback_facilities } from '@/api/feedback';
import { ref } from 'vue'

const files = ref([]);
const selectedImages = ref([]);
const imageArray = ref([]);

const onFileChange = (selectedFiles) => {
  selectedImages.value = [];
  imageArray.value = [];
  for (const file of selectedFiles) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageArray.value.push(reader.result);
      if (imageArray.value.length === selectedFiles.length) {
        selectedImages.value = imageArray.value;
        // sendImagesToBackend(imageArray);
      }
    };
    reader.readAsDataURL(file);
  }
}

const sendImagesToBackend = (imageArray) => {
  console.log(imageArray);
  upload_feedback_facilities(imageArray).then((result) => {
    console.log(result.data);
  })
}

</script>

<style scoped>
.content {
  position: absolute;
  top: 80px;
  left: 20px;
  min-width: 500px;
  max-width: 700px;
  min-height: 500px;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.image-item {
  max-width: 100%;
  max-height: 100vh;
  margin: 5px;
  object-fit: contain;
}
</style>
