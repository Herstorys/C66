// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';

// Utilities
import {defineConfig} from 'vite';
import {fileURLToPath, URL} from 'node:url';

// const replacePath = '^' + process.env.VITE_APP_BASE_URL;
// const port = parseInt(process.env.VITE_APP_PORT) || 3000;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {transformAssetUrls}
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true
    })
  ],
  // define: {
  //   'import.meta.env.VITE_BASE_URL':
  //     mode === 'development' ? 'http://127.0.0.1:3000' : 'http://123.60.90.20'
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
  },
  server: {
    // 端口号
    port: 3000,
    // 监听所有地址
    host: '0.0.0.0',
    // 服务启动时是否自动打开浏览器
    open: true,
    // 允许跨域
    cors: true,
    // 自定义代理规则
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:666', // 访问数据的计算机域名
        changeOrigin: true, // 开启代理,
        pathRewrite: {
          // 重写代理规则，/api开头，代理到/
          '^/api': ''
          // 例：/api/user/login代理到
          // http://localhost:5000/user/login
        }
      }
    }
  },
});
