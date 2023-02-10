import Vue from 'vue'
import App from './App.vue'

import 'amfe-flexible'
import '@/static/css/reset.css'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
