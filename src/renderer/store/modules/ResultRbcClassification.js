import lodash from 'lodash'

const INITAL_RBC_STATE = {
  rbcClassList: Object.freeze([{
    categoryId: '01',
    categoryNm: 'Size',
    classInfo: Object.freeze([{
      classId: '01',
      classNm: 'Normal',
      degree: '0'
    }, {
      classId: '02',
      classNm: 'Macrocyte',
      degree: '0'
    }, {
      classId: '03',
      classNm: 'Microcyte',
      degree: '0'
    }, {
      classId: '04',
      classNm: 'Anisocytosis',
      degree: '0'
    }])
  }, {
    categoryId: '02',
    categoryNm: 'Chromia',
    classInfo: Object.freeze([{
      classId: '01',
      classNm: 'Normal',
      degree: '0'
    }, {
      classId: '02',
      classNm: 'Hyperchromic',
      degree: '0'
    }, {
      classId: '03',
      classNm: 'Hypochromic',
      degree: '0'
    }, {
      classId: '04',
      classNm: 'Polychromia',
      degree: '0'
    }])
  }, {
    categoryId: '03',
    categoryNm: 'Shape',
    classInfo: Object.freeze([{
      classId: '01',
      classNm: 'Normal',
      degree: '0'
    },
    {
      classId: '02',
      classNm: 'Poikilocytosis',
      degree: '0'
    },
    {
      classId: '03',
      classNm: 'Target Cell',
      degree: '0'
    },
    {
      classId: '04',
      classNm: 'Burr Cell',
      degree: '0'
    },
    {
      classId: '05',
      classNm: 'Acanthocyte',
      degree: '0'
    },
    {
      classId: '06',
      classNm: 'Ovalocyte',
      degree: '0'
    }, {
      classId: '07',
      classNm: 'Schistocyte',
      degree: '0'
    }, {
      classId: '08',
      classNm: 'Sickle Cell',
      degree: '0'
    }, {
      classId: '09',
      classNm: 'Stomatocyte',
      degree: '0'
    }, {
      classId: '10',
      classNm: 'Tear Drop Cell',
      degree: '0'
    }, {
      classId: '11',
      classNm: 'Spherocyte',
      degree: '0'
    }])
  },
  // {
  //   categoryId: '04',
  //   categoryNm: 'Platelet',
  //   classInfo: Object.freeze([{
  //     classId: '01',
  //     classNm: 'Giant Platelet',
  //     degree: '0'
  //   }])
  // },
  {
    categoryId: '05',
    categoryNm: 'Inclusion Body',
    classInfo: Object.freeze([{
      classId: '01',
      classNm: 'Howell-Jolly Body',
      degree: '0'
    }, {
      classId: '02',
      classNm: 'Basophilic Stippling',
      degree: '0'
    }])
  }]),
  malariaCount: 0,
  currentRbcResults: null
}

const state = lodash.cloneDeep(INITAL_RBC_STATE)

const mutations = {
  UPDATE_MALARIA_COUNT (state, count) {
    state.malariaCount = count
  },
  UPDATE_DEGREE (state, obj) {
    var cloneRbcClassList = lodash.cloneDeep(state.rbcClassList)
    var index = cloneRbcClassList.findIndex(function (item) {
      return item.categoryId === obj.categoryId
    })

    for (var i = 0; i < cloneRbcClassList[index].classInfo.length; i++) {
      for (var j = 0; j < obj.classInfo.length; j++) {
        if (cloneRbcClassList[index].classInfo[i].classId === obj.classInfo[j].classId) {
          cloneRbcClassList[index].classInfo[i].degree = obj.classInfo[j].degree
        }
      }
    }

    state.rbcClassList = Object.freeze(cloneRbcClassList)
  },
  INIT_RBC_DEGREE (state, obj) {
    var cloneRbcClassList = lodash.cloneDeep(state.rbcClassList)
    cloneRbcClassList.map(function (item) {
      for (var i = 0; i < item.classInfo.length; i++) {
        item.classInfo[i].degree = '0'
      }
    })

    state.rbcClassList = Object.freeze(cloneRbcClassList)
  },
  SET_CURRENT_RBC_RESULTS (state, obj) {
    state.currentRbcResults = obj
  }
}

const actions = {
  updateMalariaCount: (context, count) => {
    context.commit('UPDATE_MALARIA_COUNT', count)
  },
  updateDegree: (context, obj) => {
    context.commit('UPDATE_DEGREE', obj)
  },
  initRbcDegree: (context, obj) => {
    context.commit('INIT_RBC_DEGREE', obj)
  },
  setCurrentRbcResults: (context, obj) => {
    context.commit('SET_CURRENT_RBC_RESULTS', obj)
  }
}

const getters = {
  getRbcClassList: state => {
    return state.rbcClassList
  },
  getMalariaCount: state => {
    return state.malariaCount
  },
  getCurrentRbcResults: state => {
    return state.currentRbcResults
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
