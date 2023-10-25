import Constant from '../../../Constant.js'
import lodash from 'lodash'

const INIT_ORDER_LIST = {
  orderList: Object.freeze([])
}

const state = INIT_ORDER_LIST

const mutations = {
  SET_ORDER_LIST (state, obj) {
    var cloneOrderList = lodash.cloneDeep(state.orderList)
    cloneOrderList.push(obj)

    state.orderList = Object.freeze(cloneOrderList)
    console.log(state.orderList)
  },
  INIT_ORDER_LIST (state, obj) {
    state.orderList = Object.freeze([])
  },
  UPDATE_ORDER_LIST (state, obj) {
    var cloneOrderList = lodash.cloneDeep(state.orderList)
    var index = cloneOrderList.findIndex(function (item) {
      return item.cassetId === obj.cassetId && item.slotInfo.slotNo === obj.slotInfo.slotNo
    })

    cloneOrderList[index].slotInfo = obj.slotInfo
    cloneOrderList[index].malariaCount = obj.malariaCount
    cloneOrderList.splice(index, 1, cloneOrderList[index])

    console.log(cloneOrderList)
    console.log(obj)

    state.orderList = Object.freeze(cloneOrderList)
  },
  UPDATE_ORDER_STATE (state, obj) {
    var cloneOrderList = lodash.cloneDeep(state.orderList)
    cloneOrderList[obj.orderIndex].state = obj.runningState

    cloneOrderList.splice(obj.orderIndex, 1, cloneOrderList[obj.orderIndex])
    state.orderList = Object.freeze(cloneOrderList)
  }
}

const actions = {
  setOrderList: (context, obj) => {
    var orderList = context.getters.getOrderList

    if (obj.iCasStat !== '999999999999') {
      // 저장 여부 체크
      var saveOrder = orderList.find(function (item) {
        return item.cassetId === obj.cassetId && item.slotInfo.slotNo === obj.slotInfo.slotNo
      })

      // 저장
      if (!saveOrder) {
        context.commit('SET_ORDER_LIST', obj)
      }
      // else {
      //   context.commit('UPDATE_ORDER_LIST', obj)
      //   var iCasStat = obj.iCasStat
      //
      //   // 전체 슬롯 상태 update
      //   for (var i = 0; i < orderList.length; i++) {
      //     for (var j = 0; j < 12; j++) {
      //       if (Number(orderList[i].slotInfo.slotNo) === j+1) {
      //         var runningState = context.getters.getCommonCode(Constant.GET_CODE_LIST_USER_CASSETE_STATE, iCasStat.charAt(j)).cdNm
      //         var obj = {
      //           orderIndex: i,
      //           runningState: runningState
      //         }
      //         context.commit('UPDATE_ORDER_STATE', obj)
      //
      //         if (runningState === 'Complete') {
      //           context.dispatch(Constant.SET_TEST_HISTORY, orderList[i])
      //         }
      //       }
      //     }
      //   }
      // }
    }
  },
  initOrderList: (context, obj) => {
    context.commit('INIT_ORDER_LIST', obj)
  }
}

const getters = {
  getOrderList: state => {
    return state.orderList
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
