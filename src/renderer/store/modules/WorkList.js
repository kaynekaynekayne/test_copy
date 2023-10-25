import lodash from 'lodash'

const INITAL_WORK_LIST_STATE = {
  workList: [],
  selectOrderId: ''
}
const state = lodash.cloneDeep(INITAL_WORK_LIST_STATE)

const mutations = {
  SET_WORK_LIST (state, objList) {
    state.workList = []
    state.workList = state.workList.concat(objList)
    state.selectOrderId = state.workList[0].SLOT_ID
  },
  ADD_WORK_LIST (state, objList) {
    state.workList = state.workList.concat(objList)
  },
  DELETE_WORK_LIST (state, obj) {
    var idx = state.workList.findIndex(function(workItem) {
      return workItem.SLOT_ID === obj.SLOT_ID
    })

    if (idx > -1) {
      state.workList.splice(idx, 1)
    }

  },
  INIT_WORK_LIST (state, obj) {
    state.workList = []
  },
  UPDATE_WORK_LIST (state, obj) {
    var tmpList = []
    for (var i = 0; i < obj.list.length; i++) {
      if (obj.list[i].count > 0) {
        tmpList.push(obj.list[i])
      }
    }

    // 기존 있음
    for (var i = 0; i < state.workList.length; i++) {
      if (state.workList[i].SLOT_ID === obj.SLOT_ID) {
        state.workList[i].wbcInfo = tmpList
      }
    }
  },
  UPDATE_WORK_LIST_BM (state, obj) {
    var tmpList = []
    for (var i = 0; i < obj.list.length; i++) {
      if (obj.list[i].count > 0) {
        tmpList.push(obj.list[i])
      }
    }

    // 기존 있음
    for (var i = 0; i < state.workList.length; i++) {
      if (state.workList[i].SLOT_ID === obj.SLOT_ID) {
        state.workList[i].bmInfo = tmpList
      }
    }
  },
  UPDATE_SELECT_ORDER_ID (state, slotId) {
    state.selectOrderId = slotId
  },
  UPDATE_SIGNED_WORK_LIST (state, obj) {
    for (var i = 0; i < state.workList.length; i++) {
      if (state.workList[i].SLOT_ID === obj.SLOT_ID) {
        var now = new Date()
        var year = "" + now.getFullYear()
        var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
        var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
        var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
        var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
        var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }

        state.workList[i].signedState = 'Signed'
        state.workList[i].signedDate = year + month + day + hour + minute + second
        state.workList[i].signedUserId = obj.userId
      }
    }
  }
}

const actions = {
  setWorkList: (context, objList) => {
    context.commit('SET_WORK_LIST', objList)
  },
  deleteWorkList: (context, obj) => {
    context.commit('DELETE_WORK_LIST', obj)
  },
  initWorkList: (context, obj) => {
    context.commit('INIT_WORK_LIST', obj)
  },
  updateWorkList: (context, obj) => {
    context.commit('UPDATE_WORK_LIST', obj)
  },
  updateSelectOrderId: (context, slotId) => {
    context.commit('UPDATE_SELECT_ORDER_ID', slotId)
  },
  addWorkList: (context, objList) => {
    context.commit('ADD_WORK_LIST', objList)
  },
  updateWorkListBm: (context, obj) => {
    context.commit('UPDATE_WORK_LIST_BM', obj)
  },
  updateSignedWorkList: (context, obj) => {
    context.commit('UPDATE_SIGNED_WORK_LIST', obj)
  }
}

const getters = {
  getWorkList: state => {
    return state.workList
  },
  getSelectOrderId: state => {
    return state.selectOrderId
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
