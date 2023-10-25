import lodash from 'lodash'

const INIT_TEST_HISTROY = {
  testHistoryList: Object.freeze([])
}
const state = INIT_TEST_HISTROY

const mutations = {
  SET_TEST_HISTORY (state, obj) {
    var cloneTestHistoryList = lodash.cloneDeep(state.testHistoryList)
    cloneTestHistoryList.push(obj)

    state.testHistoryList = Object.freeze(cloneTestHistoryList)
  },
  UPDATE_TEST_HISTORY (state, obj) {
    var cloneTestHistoryList = lodash.cloneDeep(state.testHistoryList)
    var index = cloneTestHistoryList.findIndex(function (item) {
      return item.slotInfo.slotId === params.obj.slotId
    })

    cloneTestHistoryList[index].slotInfo.barcodeNo = params.obj.barcodeNo
    cloneTestHistoryList[index].slotInfo.patientId = params.obj.patientId
    cloneTestHistoryList[index].slotInfo.patientNm = params.obj.patientNm

    state.testHistoryList = Object.freeze(cloneTestHistoryList)
  },
  UPDATE_SIGNED_STATE (state, obj) {
    var cloneTestHistoryList = lodash.cloneDeep(state.testHistoryList)
    var index = cloneTestHistoryList.findIndex(function (item) {
      return item.slotInfo.slotId === obj.slotId
    })

    var now = new Date()
    var year = "" + now.getFullYear()
    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
    var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
    var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
    var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }

    cloneTestHistoryList[index].signedState = 'Signed'
    cloneTestHistoryList[index].signedDate = year + month + day + hour + minute + second
    cloneTestHistoryList[index].signedUserId = obj.userId

    state.testHistoryList = Object.freeze(cloneTestHistoryList)
  },
  UPDATE_TEST_HISTORY_WBC_INFO (state, params) {
    var cloneTestHistoryList = lodash.cloneDeep(state.testHistoryList)
    var index = cloneTestHistoryList.findIndex(function (item) {
      return item.slotInfo.slotId === params.slotInfo.slotId
    })

    cloneTestHistoryList[index].wbcInfo = params.wbcInfo
    state.testHistoryList = Object.freeze(cloneTestHistoryList)

    // for (var i = 0; i < state.testHistoryList.length; i++) {
    //   if (state.testHistoryList[i].slotInfo.slotId === params.slotId) {
    //     state.testHistoryList[i].wbcInfo = []
    //
    //     for (var j = 0; j < params.list.length; j++) {
    //       if (params.list[j].count > 0) {
    //         state.testHistoryList[i].wbcInfo.push(params.list[j])
    //       }
    //     }
    //   }
    // }
  },
  DELETE_TEST_HISTORY (state, objList) {
    var cloneTestHistoryList = lodash.cloneDeep(state.testHistoryList)
    for (var i = 0; i < objList.length; i++) {
      for (var j = 0; j < cloneTestHistoryList.length; j++) {
        if (cloneTestHistoryList[j].slotInfo.slotId === objList[i].slotId) {
          cloneTestHistoryList.splice(j, 1)
          j = 0
        }
      }
    }

    state.testHistoryList = Object.freeze(cloneTestHistoryList)


    // for (var i = 0; i < objList.length; i++) {
    //   for (var j = 0; j < state.testHistoryList.length; j++) {
    //     if (state.testHistoryList[j].slotInfo.slotId === objList[i].slotId) {
    //       state.testHistoryList.splice(j, 1)
    //       j = 0
    //     }
    //   }
    // }
  },
  UPDATE_RBC_COMMENT (state, obj) {
    var cloneTestHistoryList = lodash.cloneDeep(state.testHistoryList)
    var index = cloneTestHistoryList.findIndex(function (item) {
      return item.slotInfo.slotId === obj.slotId
    })

    cloneTestHistoryList[index].rbcComment = obj.rbcComment

    state.testHistoryList = Object.freeze(cloneTestHistoryList)

    // for (var i = 0; i < state.testHistoryList.length; i++) {
    //   if (state.testHistoryList[i].slotInfo.slotId === obj.slotId) {
    //     state.testHistoryList[i].rbcComment = obj.rbcComment
    //   }
    // }
  },
  UPDATE_WBC_COMMENT (state, obj) {
    var cloneTestHistoryList = lodash.cloneDeep(state.testHistoryList)
    var index = cloneTestHistoryList.findIndex(function (item) {
      return item.slotInfo.slotId === obj.slotId
    })

    cloneTestHistoryList[index].wbcComment = obj.wbcComment

    state.testHistoryList = Object.freeze(cloneTestHistoryList)

    // for (var i = 0; i < state.testHistoryList.length; i++) {
    //   if (state.testHistoryList[i].slotInfo.slotId === obj.slotId) {
    //     state.testHistoryList[i].wbcComment = obj.wbcComment
    //   }
    // }
  }
}

const actions = {
  setTestHistory: (context, params) => {
    var testHistoryList = context.getters.getTestHistoryList
    var saveHistory = testHistoryList.find(function (item) {
      return item.slotInfo.slotId === params.slotInfo.slotId
    })

    if (!saveHistory) {
      params.signedState = 'Ready'
      params.signedDate = ''
      params.signedUserId = ''
      context.commit('SET_TEST_HISTORY', params)
    }
  },
  updateTestHistory: (context, params) => {
    context.commit('UPDATE_TEST_HISTORY', params)
  },
  updateSignedState: (context, obj) => {
    context.commit('UPDATE_SIGNED_STATE', testHistory)
  },
  updateTestHistoryWbcInfo: (context, params) => {
    var testHistoryList = context.getters.getTestHistoryList
    var saveHistory = lodash.cloneDeep(testHistoryList.find(function (item) {
      return item.slotInfo.slotId === params.slotId
    }))

    saveHistory.wbcInfo = []
    for (var i = 0; i < params.list.length; i++) {
      if (params.list[i].count > 0) {
        saveHistory.wbcInfo.push(params.list[i])
      }
    }

    context.commit('UPDATE_TEST_HISTORY_WBC_INFO', saveHistory)
  },
  deleteTestHistory: (context, objList) => {
    context.commit('DELETE_TEST_HISTORY', objList)
  },
  updateRbcComment: (context, obj) => {
    context.commit('UPDATE_RBC_COMMENT', obj)
  },
  updateWbcComment: (context, obj) => {
    context.commit('UPDATE_WBC_COMMENT', obj)
  }
}

const getters = {
  getTestHistoryList: state => {
    return state.testHistoryList
  },
  getTestHistory: state => (slotId) => {
    return state.testHistoryList.find(function (item) {
      return item.slotInfo.slotId === slotId
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
