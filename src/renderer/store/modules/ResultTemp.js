// 검색 결과 임시 저장 (이전, 다음)
import Constant from '../../../Constant.js'
import lodash from 'lodash'

const INIT_RESULT_TEMP = {
  resultList: []
}

const state = INIT_RESULT_TEMP

const mutations = {
  SET_RESULT_LIST (state, params) {
    state.resultList = params
  },
  CLEAR_RESULT_LIST (state) {
    state.resultList = []
  }
}

const actions = {
  setResultList: (context, params) => {
    context.commit('SET_RESULT_LIST', params)
  },
  clearResultList: (context) => {
    context.commit('CLEAR_RESULT_LIST')
  }
}

const getters = {
  getResultList: state => {
    return state.resultList
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
