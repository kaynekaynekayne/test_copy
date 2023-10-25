import lodash from 'lodash'

const INIT_TEST_PAGE = {
  isRunning: false,
  runningIntervalId: null,
  timeCounter: 0,
  slideTimeCount: 0,
  workingIntervalId: null,
  userStop: false,
  rbcFields: Object.freeze(['Category', 'Class', 'Degree']),
  wbcFields: Object.freeze(['Class', 'Count', '%']),
  wbcCount: Object.freeze ([{ value: '100', text: '100 WBC' },
                            { value: '150', text: '150 WBC' },
                            { value: '200', text: '200 WBC' },
                            { value: '250', text: '250 WBC' },
                            { value: '300', text: '300 WBC' },
                            { value: '350', text: '350 WBC' },
                            { value: '400', text: '400 WBC' },
                            { value: '450', text: '450 WBC' },
                            { value: '500', text: '500 WBC' }]),
  testType: Object.freeze ([{ value: '01', text: 'PB standard(WBC Diff)' },
                            { value: '04', text: 'PB premium(PBS)' },
                            { value: '02', text: 'Body fluid default' },
                            { value: '03', text: 'Body fluid select' },
                            { value: '05', text: 'Quality Check' }]),
  stitchCount: Object.freeze ([{ value: '1', text: '1 stitch' },
                            { value: '2', text: '2 stitch' },
                            { value: '3', text: '3 stitch' },
                            { value: '4', text: '4 stitch' },
                            { value: '5', text: '5 stitch' }]),
  isRecoveryRun: false
}

const state = INIT_TEST_PAGE

const mutations = {
  UPDATE_RUNNING_STATE (state, isRunning) {
    state.isRunning = isRunning
  },
  SET_RUNNING_INTERVAL_ID (state, id) {
    state.runningIntervalId = id
  },
  UPDATE_WORKING_TIMER (state) {
    state.timeCounter++
  },
  SET_WORKING_TIMER (state, timeCount) {
    state.timeCounter = timeCount
  },
  SET_WORKING_INTERVAL_ID (state, id) {
    state.workingIntervalId = id
  },
  SET_SLIDE_TIMER (state, timeCount) {
    state.slideTimeCount = timeCount
  },
  UPDATE_SLIDE_TIMER (state) {
    state.slideTimeCount++
  },
  SET_USER_STOP (state, isUserStop) {
    state.userStop = isUserStop
  },
  SET_IS_RECOVERY_RUN (state, isRecoveryRun) {
    state.isRecoveryRun = isRecoveryRun
  }
}

const actions = {
  updateRunningState: (context, isRunning) => {
    context.commit('UPDATE_RUNNING_STATE', isRunning)
  },
  setRuningIntervalId: (context, id) => {
    context.commit('SET_RUNNING_INTERVAL_ID', id)
  },
  updateWorkingTimer: (context) => {
    context.commit('UPDATE_WORKING_TIMER')
  },
  setWorkingTimer: (context, timeCount) => {
    context.commit('SET_WORKING_TIMER', timeCount)
  },
  setWorkingIntervalId: (context, id) => {
    context.commit('SET_WORKING_INTERVAL_ID', id)
  },
  setSlideTimer: (context, timeCount) => {
    context.commit('SET_SLIDE_TIMER', timeCount)
  },
  updateSlideTimer: (context) => {
    context.commit('UPDATE_SLIDE_TIMER')
  },
  setUserStop: (context, isUserStop) => {
    context.commit('SET_USER_STOP', isUserStop)
  },
  setIsRecoveryRun: (context, isRecoveryRun) => {
    context.commit('SET_IS_RECOVERY_RUN', isRecoveryRun)
  }

}

const getters = {
  getRbcFields: state => {
    return state.rbcFields
  },
  getWbcFields: state => {
    return state.wbcFields
  },
  getRbcItems: state => {
    return state.rbcItems
  },
  getWbcItems: state => {
    return state.wbcItems
  },
  getWbcCount: state => {
    return state.wbcCount
  },
  getTestType: state => {
    return state.testType
  },
  getStitchCount: state => {
    return state.stitchCount
  },
  getRunningState: state => {
    return state.isRunning
  },
  getRunningIntervalId: state => {
    return state.runningIntervalId
  },
  getWorkingTimer: state => {
    return state.timeCounter
  },
  getWorkingIntervalId: state => {
    return state.workingIntervalId
  },
  getSlideTimeCount: state => {
    return state.slideTimeCount
  },
  getUserStop: state => {
    return state.userStop
  },
  getIsRecoveryRun: state => {
    return state.isRecoveryRun
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
