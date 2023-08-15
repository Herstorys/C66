<template>
  <div>
    <!-- <v-card class="mx-auto">
      <v-card-title>地址</v-card-title>
      <v-card-item> -->
        <v-row>
          <v-col cols="4">
            <v-autocomplete v-model="selectedProvince" :items="provinceItems" @update:model-value="handleProvinceChange"
              label="省份" min-width="200" />
          </v-col>
          <v-col cols="4">
            <v-autocomplete v-model="selectedCity" :items="cityItems" @update:model-value="handleCityChange" label="城市"
              min-width="200" />
          </v-col>
          <v-col cols="4">
            <v-autocomplete v-model="selectedDistrict" :items="districtItems" label="区县" min-width="200" />
          </v-col>
          <!-- @update:model-value="handleDistrictChange" -->
          <!-- <v-col cols="3">
            <v-autocomplete v-model="selectedStreet" :items="streetItems" label="乡镇" min-width="200" />
          </v-col> -->
        </v-row>
        <v-text-field v-model="location" label="具体地址" :rules="rules" hide-details="auto"></v-text-field>
      <!-- </v-card-item>
    </v-card> -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

import addressData from '@/assets/pcas.json';

const address = ref();
const emits = defineEmits(['uploadAddress'])
const rules = [value => !!value || '必需！'];

const location = ref(null)
const selectedProvince = ref(null)
const selectedCity = ref(null)
const selectedDistrict = ref(null)
// const selectedStreet = ref(null)

const provinceItems = computed(() => Object.keys(addressData))

const cityItems = computed(() => selectedProvince.value
  ? Object.keys(addressData[selectedProvince.value])
  : []
)

const districtItems = computed(() => selectedProvince.value && selectedCity.value
  ? Object.keys(addressData[selectedProvince.value][selectedCity.value])
  : []
)

// const streetItems = computed(() => selectedProvince.value && selectedCity.value && selectedDistrict.value
//   ? addressData[selectedProvince.value][selectedCity.value][selectedDistrict.value]
//   : []
// )

const handleProvinceChange = () => {
  selectedCity.value = null;
  selectedDistrict.value = null;
  // selectedStreet.value = null;
}
const handleCityChange = () => {
  selectedDistrict.value = null;
  // selectedStreet.value = null;
}

// const handleDistrictChange = () => {
//   selectedStreet.value = null;
// }

watch([selectedProvince, selectedCity, selectedDistrict, location], val => {
  address.value = selectedProvince.value + selectedCity.value + selectedDistrict.value + location.value
  emits('uploadAddress', address)
})
</script>

<style scoped></style>
