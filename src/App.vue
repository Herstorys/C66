<template>
  <div id="app">
    <!-- <NavComponent></NavComponent> -->
    <RouterView name="nav" class="nav"></RouterView>
    <RouterView name="map" class="map"></RouterView>
    <!-- <EsriMapView></EsriMapView> -->
    <RouterView></RouterView>
  </div>
</template>

<script setup>
import NavComponent from '@/views/NavComponent.vue';
import EsriMapView from '@/components/EsriMapView.vue';
</script>
<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
}
</style>
