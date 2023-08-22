/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from '@/plugins';

import '@arcgis/core/assets/esri/themes/light/main.css';

const app = createApp(App);
// app.config.globalProperties.getENV = import.meta.env;
registerPlugins(app);

app.mount('#app');
