const state = {
  userLog: []
}

const mutations = {
  SET_EVENT_LOG (state, obj) {
    state.userLog.push(obj)
  },
  REMOVE_EVENT_LOG (state, obj) {
    var date = new Date()
    date.setDate(date.getDate() - 30)

    var year = '' + date.getFullYear()
    var month = '' + (date.getMonth() + 1)
    var day = '' + date.getDate()
    var removeStr = ''

    if (month.length == 1) {
      month = '0' + month
    }

    if (day.length == 1) {
      day = '0' + day
    }

    removeStr = year + month + day

    state.userLog = state.userLog.filter(function(item) {
      var logDate = item.logDttm.substring(0, 8)
      if (logDate >= removeStr) {
        return item
      }
    })
  }
}

const actions = {
  setEventLog: (context, obj) => {
    context.commit('SET_EVENT_LOG', obj)
  },
  removeEventLog: (context, obj) => {
    context.commit('REMOVE_EVENT_LOG', obj)
  }
}

const getters = {
  getEventLog: state => {
    return state.userLog
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
