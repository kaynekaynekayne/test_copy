import lodash from 'lodash'
import CommonStore from './CommonStore.js'

const INITAL_WBC_STATE = {
  classList: Object.freeze([
  {
    id: '01', title: 'NE', name: 'Neutrophil', count: 0, percent: 0, key: '', order: 1
  }, {
    id: '71', title: 'NS', name: 'Neutrophil-Segmented', count: 0, percent: 0, key: '', order: 2
  }, {
    id: '72', title: 'NB', name: 'Neutrophil-Band', count: 0, percent: 0, key: '', order: 3
  }, {
    id: '02', title: 'ME', name: 'Metamyelocyte', count: 0, percent: 0, key: '', order: 4
  }, {
    id: '03', title: 'MY', name: 'Myelocyte', count: 0, percent: 0, key: '', order: 5
  }, {
    id: '04', title: 'PR', name: 'Promyelocyte', count: 0, percent: 0, key: '', order: 6
  }, {
    id: '05', title: 'LY', name: 'Lymphocyte', count: 0, percent: 0, key: '', order: 7
  }, {
    id: '61', title: 'LR', name: 'Reactive lymphocyte', count: 0, percent: 0, key: '', order: 8
  }, {
    id: '62', title: 'LA', name: 'Abnormal lymphocyte', count: 0, percent: 0, key: '', order: 9
  }, {
    id: '07', title: 'MO', name: 'Monocyte', count: 0, percent: 0, key: '', order: 10
  }, {
    id: '08', title: 'EO', name: 'Eosinophil', count: 0, percent: 0, key: '', order: 11
  }, {
    id: '09', title: 'BA', name: 'Basophil', count: 0, percent: 0, key: '', order: 12
  }, {
    id: '10', title: 'BL', name: 'Blast', count: 0, percent: 0, key: '', order: 13
  }, {
    id: '11', title: 'PC', name: 'Plasma cell', count: 0, percent: 0, key: '', order: 14
  }, {
    id: '12', title: 'NR', name: 'nRBC', count: 0, percent: 0, key: '', order: 15
  }, {
    id: '13', title: 'GP', name: 'Giant platelet', count: 0, percent: 0, key: '', order: 16
  }, {
    id: '14', title: 'PA', name: 'Platelet aggregation', count: 0, percent: 0, key: '', order: 17
  }, {
    id: '16', title: 'MA', name: 'Malaria', count: 0, percent: 0, key: '', order: 18
  }, {
    id: '15', title: 'AR', name: 'Artifact(Smudge)', count: 0, percent: 0, key: '', order: 19
  }]),
  wbcModifyWbcList: Object.freeze([]),
  currentWbcResults: null,
  beforeWbcResults: null,
  rollbackList: []
}
const state = lodash.cloneDeep(INITAL_WBC_STATE)

const mutations = {
  UPDATE_WBC_COUNT (state, obj) {
    var cloneClassList = lodash.cloneDeep(state.classList)
    var index = cloneClassList.findIndex(function (item) {
      return item.id === obj.id
    })

    cloneClassList[index].count = obj.count
    cloneClassList[index].percent = obj.percent

    state.classList = Object.freeze(cloneClassList)
  },
  INIT_WBC_COUNT (state, obj) {
    var cloneClassList = lodash.cloneDeep(state.classList)
    cloneClassList.map(function (item) {
      item.count = 0
      item.percent = 0
    })
    state.classList = Object.freeze(cloneClassList)
  },
  SET_WBC_IMAGE_HIST (state, obj) {
    var cloneWbcModifyWbcList = lodash.cloneDeep(state.wbcModifyWbcList)
    cloneWbcModifyWbcList.push(obj)
    state.wbcModifyWbcList = Object.freeze(cloneWbcModifyWbcList)
  },
  INIT_WBC_IMAGE_HIST (state, obj) {
    var cloneWbcModifyWbcList = lodash.cloneDeep(state.wbcModifyWbcList)
    cloneWbcModifyWbcList = []
    state.wbcModifyWbcList = Object.freeze(cloneWbcModifyWbcList)
  },
  SET_WBC_CUSTOM_LIST (state, obj) {
    var cloneClassList = lodash.cloneDeep(state.classList)

    cloneClassList = obj
    state.classList = Object.freeze(cloneClassList)
  },
  UPDATE_HOT_KEYS (state, list) {
    var cloneClassList = lodash.cloneDeep(state.classList)

    for (var i = 0; i < cloneClassList.length; i++) {
      for (var j = 0; j < list.length; j++) {
        if (cloneClassList[i].id === list[j].id) {
          cloneClassList[i].key = list[j].key
        }
      }
    }

    state.classList = Object.freeze(cloneClassList)
  },
  UPDATE_ORDER (state, list) {
    var cloneClassList = lodash.cloneDeep(state.classList)

    for (var i = 0; i < cloneClassList.length; i++) {
      for (var j = 0; j < list.length; j++) {
        if (cloneClassList[i].id === list[j].id) {
          cloneClassList[i].order = list[j].order
        }
      }
    }

    state.classList = Object.freeze(cloneClassList)
  },
  SET_CURRENT_WBC_RESULTS (state, obj) {
    state.currentWbcResults = obj
  },
  SET_BEFORE_WBC_RESULTS (state, obj) {
    state.beforeWbcResults = obj
  },
  SET_ROLLBCAK_LIST (state, list) {
    state.rollbackList = list
  }
}

const actions = {
  updateWbcCount: (context, obj) => {
    context.commit('UPDATE_WBC_COUNT', obj)
  },
  initWbcCount: (context, obj) => {
    context.commit('INIT_WBC_COUNT', obj)
  },
  setWbcImageHist: (context, obj) => {
    context.commit('SET_WBC_IMAGE_HIST', obj)
  },
  initWbcImageHist: (context, obj) => {
    context.commit('INIT_WBC_IMAGE_HIST', obj)
  },
  setWbcClassList: (context, obj) => {
    context.commit('SET_WBC_CUSTOM_LIST', obj)
  },
  updateHotKeys: (context, list) => {
    context.commit('UPDATE_HOT_KEYS', list)
  },
  updateOrder: (context, list) => {
    context.commit('UPDATE_ORDER', list)
  },
  setCurrentWbcResults: (context, obj) => {
    context.commit('SET_CURRENT_WBC_RESULTS', obj)
  },
  setBeforeWbcResults: (context, obj) => {
    context.commit('SET_BEFORE_WBC_RESULTS', obj)
  },
  setRollbackList: (context, obj) => {
    context.commit('SET_ROLLBCAK_LIST', obj)
  }
}

const getters = {
  getWbcClassList: (state, getters, rootState, rootGetters) => (isNsNbIntegration) => {
    var classList = []

    if (isNsNbIntegration === 'Y' || isNsNbIntegration === true) {
      classList = state.classList.filter(function(item) {
        return item.id !== '71' && item.id !== '72'
      })
    } else {
      classList = state.classList.filter(function(item) {
        return item.id !== '01'
      })
    }
    return classList
  },
  getWbcClassListAll: state => {
    return state.classList
  },
  getWbcImageHist: state => (userId) => {
    var now = new Date()
    var year = "" + now.getFullYear()
    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }

    // 오늘 변경한 건만
    var modifyList = state.wbcModifyWbcList.filter(function (item) {
      var date = item.modifyDttm.split(' ')[0]
      return (item.userId === userId) && (date.replace(/-/gi, '') === year + month + day)
    })

    modifyList = modifyList.sort(function (a, b) {
      return b.seqNo - a.seqNo
    })

    return modifyList
  },
  getCurrentWbcResults: state => {
    return state.currentWbcResults
  },
  getBeforeWbcResults: state => {
    return state.beforeWbcResults
  },
  getRollbackList: state => {
    return state.rollbackList
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
