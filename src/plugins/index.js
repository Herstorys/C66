/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import router from '../router';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { useMapStore } from '@/store/mapStore';
import msgbox from '@/components/msgbox/index';
import esriConfig from '@arcgis/core/config';
import webConfig from '@/webConfig';

esriConfig.assetsPath = '/assets';
esriConfig.apiKey = webConfig.apiKey;

export function registerPlugins(app) {
  loadFonts();
  const pinia = createPinia();
  const piniaPluginPersistedstate = createPersistedState();
  pinia.use(piniaPluginPersistedstate);
  app.use(vuetify).use(pinia).use(router).use(msgbox);
  const mapStore = useMapStore();
  mapStore.initializeMap();
}
