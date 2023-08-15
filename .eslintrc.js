// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/prettier',
  ],
}
