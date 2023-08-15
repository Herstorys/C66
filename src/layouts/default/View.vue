<template>
  <v-layout>
    <v-app-bar>
      <NavComponent></NavComponent>
    </v-app-bar>
    <v-main class="main">
      <EsriMapView></EsriMapView>
      <RouterView></RouterView>
    </v-main>
  </v-layout>
</template>

<script setup>
import NavComponent from '../components/NavComponent.vue';
import EsriMapView from '../components/EsriMapView.vue';
</script>
