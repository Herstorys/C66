<template>
  <!-- <div class="nav">
    <NavComponent></NavComponent>
  </div> -->
  <!-- <div class="map">
    <EsriMapView></EsriMapView>
  </div> -->
  <RouterView></RouterView>
  <!-- <NavigationView></NavigationView> -->
  <!-- <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </transition>
  </RouterView> -->
</template>

<script setup>
import NavComponent from '@/views/NavComponent.vue';
import EsriMapView from '@/components/EsriMapView.vue';
import NavigationView from './NavigationView.vue';


</script>

<style scoped>
.nav {
  height: 6%;
}

.map {
  height: 94%;
}
</style>
