/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import { VDataTable } from 'vuetify/labs/VDataTable';

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#0D47A1',
    surface: '#FFFFFF',
    primary: '#6200EE',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00'
  }
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      // myCustomLightTheme
      light: {
        colors: {
          primary: '#2979FF',
          secondary: '#5CBBF6'
        }
      }
    }
  },
  components: {
    VDataTable
  }
});
