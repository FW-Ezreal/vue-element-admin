import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import { get, post, put, deleteAxios } from './utils/request'

import _ from 'lodash'
window._ = _

Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$put = put
Vue.prototype.$deleteAxios = deleteAxios

Vue.prototype.rrouter = router
Vue.prototype.sstore = store

Vue.prototype.sstore.dispatch('checkSession');

// set ElementUI lang to EN
Vue.use(ElementUI, { size: 'small'})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
