import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'
// import { createSharedMutations } from 'vuex-electron'

import modules from './modules'
// import CommonStore from './modules/CommonStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState()
    // createPersistedState({
    //   paths: ['CommonStore']
    // })
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
