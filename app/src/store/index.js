import { createStore } from 'vuex'

import app from './modules/app'

import getters from './getters'

export default createStore({
  modules: {
    app
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
