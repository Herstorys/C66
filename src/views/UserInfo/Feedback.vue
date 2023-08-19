<template>
  <v-card class="cards animate__animated animate__fadeInLeft">
    <v-card-title class="text-center">无障碍设施问题反馈</v-card-title>
    <v-form ref="feedbackForm" @submit.prevent="submitForm">
      <v-file-input @update:model-value="onFileChange" accept="image/*" label="图片" class="mt-4"
        prepend-icon="mdi-image"></v-file-input>
      <dist-picker @uploadAddress="uploadAddress"></dist-picker>
      <v-select v-model="feedbackQuestions" :items="questions" density="compact" label="请输入反馈信息" class="mt-4" multiple
        chips></v-select>
      <v-checkbox-btn v-model="enabled" label="其他问题"></v-checkbox-btn>
      <v-textarea v-model="otherQuestions" :disabled="!enabled" hide-details label="请输入反馈信息" placeholder='最多输入50个字'
        class="mt-4" rows="3"></v-textarea>
      <v-btn type="submit" color="blue" class="mt-4 elevation-4" block>
        确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import DistPicker from '@/components/DistPicker.vue';
import { upload_feedback_question } from '@/api/feedback.js';
import Message from '@/components/msgbox/Message.js';
import { useUserStore } from '@/store/user'

const enabled = ref(false)

const questions = ["占道问题", "破损问题", "不规范问题"]

const feedbackForm = ref()
const feedbackQuestions = ref()
const otherQuestions = ref()
const detail = ref()

const address = ref()
const uploadAddress = (val) => {
  address.value = val
}

const imageData = ref('')
const onFileChange = () => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      // console.log(reader);
      // 将图片文件转换为 Base64 编码并赋值给 imageData
      imageData.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

const isShow = ref(false)
const userStore = useUserStore()

const submitForm = () => {
  const selectedQuestions = feedbackQuestions.value || [];
  const otherText = otherQuestions.value ? `其他问题：${otherQuestions.value}` : '';
  detail.value = [...selectedQuestions, otherText].join(';');
  if (feedbackForm.value.validate()) {
    const formData = {
      username: userStore.username,
      detail: detail.value,
      picture: imageData.value,
      address: address.value.value,
    }
    upload_feedback_question(formData).then((result) => {
      if (result.data.code === 0) {
        Message({ type: 'success', message: result.data.msg });
      } else {
        Message({ type: 'error', message: result.data.msg });
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setTimeout(() => {
        isShow.value = false;
      }, 2000);
    })
  }
}
</script>

<style scoped>
.cards {
  position: absolute;
  background-color: #fff;
  top: 50px;
  left: 20px;
  min-width: 500px;
  padding: 10px;
  border-radius: 8px;
}
</style>
