import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Viewer from 'v-viewer'
import CommonUtils from './CommonUtils.js'
import DragPlugin from './components/Plugins/drag.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './components/Style/style.css'
import 'viewerjs/dist/viewer.css'
import VModal from 'vue-js-modal'
import Toasted from 'vue-toasted'
import VueCryptojs from 'vue-cryptojs'
import VueCarousel from 'vue-carousel'
import InfiniteLoading from 'vue-infinite-loading'
import Grid from 'vue-js-grid'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import VueColumnsResizable from 'vue-columns-resizable'
import VueBarcodeScanner from 'vue-barcode-scanner'

// import VLazyImage from 'v-lazy-image/v2'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Viewer)
Vue.use(CommonUtils)
Vue.use(DragPlugin)
Vue.use(VModal, { dynamic: true })
Vue.use(Toasted)
Vue.use(VueCryptojs)
Vue.use(VueCarousel)
Vue.use(InfiniteLoading)
Vue.use(Grid)
Vue.use(VueLodash, { lodash: lodash })
Vue.use(VueColumnsResizable)
Vue.use(VueBarcodeScanner, {
  sensitivity: 200, // default is 100
  requiredAttr: true, // default is false
  // controlSequenceKeys: ['NumLock', 'Clear'], // default is null
  callbackAfterTimeout: true // default is false
})

Vue.prototype.EventBus = new Vue()
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  render: h => h(App),
  data () {
    return {
      transitionName: 'slide-left'
    }
  }
}).$mount('#app')
