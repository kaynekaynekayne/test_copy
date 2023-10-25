const state = {
  userList: [],
  currentUser: {},
  loginHistory: []
}

const mutations = {
  ADD_USER (state, userObj) {
    state.userList.push(userObj)
  },
  SET_CURRENT_USER (state, userObj) {
    state.currentUser = userObj
    state.loginHistory.push(userObj)

    // 로그인 일시 업데이트
    for (var i = 0; i < state.userList.length; i++) {
      if (state.userList[i].userId === userObj.userId) {
        state.userList[i].loginDttm = userObj.loginTimeStr
        state.userList[i].modifyDttm = userObj.loginTimeStr
      }
    }

    state.loginHistory = state.loginHistory.sort(function (a, b) {
      var itemB = new Date(b.loginTime.replace(' ', 'T'))
      var itemA = new Date(a.loginTime.replace(' ', 'T'))
      return itemB.getTime() - itemA.getTime()
    })
  },
  UPDATE_USER (state, userObj) {
    for (var i = 0; i < state.userList.length; i++) {
      if (state.userList[i].userId === userObj.userId) {
        state.userList[i].authCd = userObj.authCd
        state.userList[i].authNm = userObj.authNm
        state.userList[i].userName = userObj.userName
        state.userList[i].isAvailable = userObj.isAvailable
        state.userList[i].modifyDttm = userObj.modifyDttm
        state.userList[i].empNo = userObj.empNo
      }
    }
  },
  DELETE_USER (state, userId) {
    for (var i = 0; i < state.userList.length; i++) {
      if (state.userList[i].userId === userId) {
        state.userList.splice(i, 1)
      }
    }
  },
  ADD_USER_LIST (state, userList) {
    state.userList = []

    userList.forEach(function (item) {
      var userData = {
        userId: item.USER_ID,
        encPassword: item.ENC_PWD,
        userName: item.USER_NM,
        empNo: item.EMP_NO,
        position: item.POSITION,
        authCd: item.AUTH_CD,
        createDttm: item.CREATE_DTTM,
        modifyDttm: item.MODIFY_DTTM,
        isAvailable: item.IS_AVAILABLE,
        loginDttm: item.LOGIN_DTTM
      }

      state.userList.push(userData)
    })
  }
}

const actions = {
  // db -> vue store
  addUserList: (context, userList) => {
    context.commit('ADD_USER_LIST', userList)
  },
  addUser: (context, userObj) => {
    context.commit('ADD_USER', userObj)
    // var users = context.getters.getUserList
    //
    // for (var i = 0; i < users.length; i++) {
    //   if (users[i].userId === userObj.userId) {
    //     return false
    //   }
    // }
    //
    // context.commit('ADD_USER', userObj)
    // return true
  },
  setCurrentUser: (context, userObj) => {
    context.commit('SET_CURRENT_USER', userObj)
  },
  updateUser: (context, userObj) => {
    context.commit('UPDATE_USER', userObj)
  },
  deleteUser: (context, userId) => {
    context.commit('DELETE_USER', userId)
  }
}

const getters = {
  getUserList: state => {
    return state.userList
  },
  getUser: state => (userId) => {
    for (var i = 0; i < state.userList.length; i++) {
      if (state.userList[i].userId === userId ) {
        return state.userList[i]
      }
    }

    return null
  },
  getCurrentUser: state => {
    return state.currentUser
  },
  getLoginHistory: state => {
    return state.loginHistory
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
