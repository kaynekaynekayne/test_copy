import lodash from 'lodash'

const INITAL_BF_STATE = {
  bfClassList: Object.freeze([{
    id: '01', title: 'NE', name: 'Neutrophil', count: 0, percent: 0, key: '', order: 1
  }, {
    id: '02', title: 'LY', name: 'Lymphocyte', count: 0, percent: 0, key: '', order: 2
  }, {
    id: '03', title: 'MO', name: 'Monocyte', count: 0, percent: 0, key: '', order: 3
  }, {
    id: '04', title: 'EO', name: 'Eosinophil', count: 0, percent: 0, key: '', order: 4
  }, {
    id: '05', title: 'BA', name: 'Basophil', count: 0, percent: 0, key: '', order: 5
  }, {
    id: '06', title: 'BL', name: 'Blast', count: 0, percent: 0, key: '', order: 6
  }, {
    id: '07', title: 'PC', name: 'Plasma cell', count: 0, percent: 0, key: '', order: 7
  }, {
    id: '08', title: 'NR', name: 'NRBC', count: 0, percent: 0, key: '', order: 8
  }, {
    id: '09', title: 'AR', name: 'Artifact(Smudge)', count: 0, percent: 0, key: '', order: 9
  }, {
    id: '10', title: 'MC', name: 'Malignant cell', count: 0, percent: 0, key: '', order: 10
  }, {
    id: '11', title: 'MT', name: 'Mesothelial cell', count: 0, percent: 0, key: '', order: 11
  }])
}
const state = lodash.cloneDeep(INITAL_BF_STATE)

const mutations = {
  UPDATE_BF_HOT_KEYS (state, list) {
    var cloneClassList = lodash.cloneDeep(state.bfClassList)

    for (var i = 0; i < cloneClassList.length; i++) {
      for (var j = 0; j < list.length; j++) {
        if (cloneClassList[i].id === list[j].id) {
          cloneClassList[i].key = list[j].key
        }
      }
    }

    state.bfClassList = Object.freeze(cloneClassList)
  },
  UPDATE_ORDER_BF (state, list) {
    var cloneClassList = lodash.cloneDeep(state.bfClassList)

    for (var i = 0; i < cloneClassList.length; i++) {
      for (var j = 0; j < list.length; j++) {
        if (cloneClassList[i].id === list[j].id) {
          cloneClassList[i].order = list[j].order
        }
      }
    }

    state.bfClassList = Object.freeze(cloneClassList)
  }
}

const actions = {
  updateBfHotKeys: (context, list) => {
    context.commit('UPDATE_BF_HOT_KEYS', list)
  },
  updateOrderBf: (context, list) => {
    context.commit('UPDATE_ORDER_BF', list)
  }
}

const getters = {
  getBfWbcClassList: state => {
    return state.bfClassList
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
