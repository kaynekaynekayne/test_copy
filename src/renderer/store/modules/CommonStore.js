import Constant from '../../../Constant.js'
import lodash from 'lodash'
import api from '../../service'

// 공통 코드 정의
const INIT_COMMON_STATE = {
  commonCodeList: Object.freeze([
    { grpCd: '00', grpNm: 'User position', cd: '00', cdNm: 'Position' },
    { grpCd: '00', grpNm: 'User position', cd: '01', cdNm: 'Executive advisor' },
    { grpCd: '00', grpNm: 'User position', cd: '02', cdNm: 'General manager' },
    { grpCd: '00', grpNm: 'User position', cd: '03', cdNm: 'Chief' },
    { grpCd: '00', grpNm: 'User position', cd: '04', cdNm: 'Assistant manager' },
    { grpCd: '00', grpNm: 'User position', cd: '05', cdNm: 'Staff' },
    { grpCd: '01', grpNm: 'User authorization', cd: '01', cdNm: 'Normal' },
    { grpCd: '01', grpNm: 'User authorization', cd: '02', cdNm: 'Admin' },
    { grpCd: '01', grpNm: 'User authorization', cd: '03', cdNm: 'Developer' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '0', cdNm: 'Empty' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '1', cdNm: 'Ready' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '2', cdNm: 'Analyzing' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '3', cdNm: 'Complete' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '4', cdNm: 'Error' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '9', cdNm: 'Scan' },
    { grpCd: '03', grpNm: 'Processing code', cd: '01', cdNm: 'Cassette Loaded.'},
    { grpCd: '03', grpNm: 'Processing code', cd: '02', cdNm: 'PB/BM Sequence Start.'},
    { grpCd: '03', grpNm: 'Processing code', cd: '03', cdNm: 'Cassette Scanning......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '04', cdNm: 'Cassette Scanned.'},
    { grpCd: '03', grpNm: 'Processing code', cd: '05', cdNm: 'Loading Slide #'},
    { grpCd: '03', grpNm: 'Processing code', cd: '06', cdNm: 'Barcode Scanned : '},
    { grpCd: '03', grpNm: 'Processing code', cd: '07', cdNm: 'Low Power Slide Scanning......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '08', cdNm: 'Low Power Slide Scan Complete.'},
    { grpCd: '03', grpNm: 'Processing code', cd: '09', cdNm: 'Dispensing Immersion Oil......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '10', cdNm: 'High Power Slide Scanning......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '11', cdNm: 'RBC Classification Processing......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '11', cdNm: 'WBC Classification Processing......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '12', cdNm: 'Unloading Slide #'},
    { grpCd: '03', grpNm: 'Processing code', cd: '13', cdNm: 'Cassette Complete'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '01', cdNm: 'PB smear'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '02', cdNm: 'BM smear'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '03', cdNm: 'Touch print'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '04', cdNm: 'BM biopsy'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '05', cdNm: 'Clot section'},
    { grpCd: '05', grpNm: 'Cell count', cd: '01', cdNm: '100 count'},
    { grpCd: '05', grpNm: 'Cell count', cd: '02', cdNm: '200 count'},
    { grpCd: '05', grpNm: 'Cell count', cd: '03', cdNm: '300 count'},
    { grpCd: '05', grpNm: 'Cell count', cd: '04', cdNm: '400 count'},
    { grpCd: '05', grpNm: 'Cell count', cd: '05', cdNm: '500 count'},
    { grpCd: '06', grpNm: 'General stain', cd: '01', cdNm: 'Wright stain'},
    { grpCd: '06', grpNm: 'General stain', cd: '02', cdNm: 'Giemsa stain'},
    { grpCd: '06', grpNm: 'General stain', cd: '03', cdNm: 'Wright & Giemsa stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '04', cdNm: 'Iron stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '05', cdNm: 'Trichrome stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '06', cdNm: 'Myeloperoxidase stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '07', cdNm: 'NSE stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '08', cdNm: 'NSE stain after NaFinhibition'},
    { grpCd: '07', grpNm: 'Special stain', cd: '09', cdNm: 'Reticulin stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '10', cdNm: 'PAS stain'},
    { grpCd: '08', grpNm: 'Immuno stain', cd: '11', cdNm: 'CD 3'},
    { grpCd: '08', grpNm: 'Immuno stain', cd: '12', cdNm: 'CD 5'},
    { grpCd: '08', grpNm: 'Immuno stain', cd: '13', cdNm: 'CD 20'},
    { grpCd: '08', grpNm: 'Immuno stain', cd: '14', cdNm: 'CD 79a'},
    { grpCd: '09', grpNm: 'Sampling stain', cd: '01', cdNm: 'Single'},
    { grpCd: '09', grpNm: 'Sampling stain', cd: '02', cdNm: 'Both'},
    { grpCd: '10', grpNm: 'Gender', cd: '01', cdNm: 'Male'},
    { grpCd: '10', grpNm: 'Gender', cd: '02', cdNm: 'Female'},
    { grpCd: '11', grpNm: 'Test Type', cd: '01', cdNm: 'PB'},
    { grpCd: '11', grpNm: 'Test Type', cd: '02', cdNm: 'BF(Default)'},
    { grpCd: '11', grpNm: 'Test Type', cd: '03', cdNm: 'BF(Select)'},
    { grpCd: '11', grpNm: 'Test Type', cd: '04', cdNm: 'Premium'},
    { grpCd: '12', grpNm: 'Signed state', cd: '01', cdNm: 'Signed'},
    { grpCd: '12', grpNm: 'Signed state', cd: '02', cdNm: 'Ready'},
    { grpCd: '13', grpNm: 'Log type', cd: '00', cdNm: 'User log'},
    { grpCd: '13', grpNm: 'Log type', cd: '01', cdNm: 'System log'},
    { grpCd: '14', grpNm: 'Slot state', cd: '00', cdNm: 'Empty'},
    { grpCd: '14', grpNm: 'Slot state', cd: '01', cdNm: 'Ready'},
    { grpCd: '14', grpNm: 'Slot state', cd: '02', cdNm: 'Scan'},
    { grpCd: '14', grpNm: 'Slot state', cd: '03', cdNm: 'Analyzing'},
    { grpCd: '14', grpNm: 'Slot state', cd: '04', cdNm: 'Complete'},
    { grpCd: '14', grpNm: 'Slot state', cd: '05', cdNm: 'Error'}
  ]),
  defaultRbcDegree: [{
    categoryId: '01',
    classId: '02',
    degree1: 5,
    degree2: 10,
    degree3: 20
  }, {
    categoryId: '01',
    classId: '03',
    degree1: 5,
    degree2: 10,
    degree3: 20
  }, {
    categoryId: '01',
    classId: '04',
    degree1: 5,
    degree2: 10,
    degree3: 20
  }, {
    categoryId: '02',
    classId: '02',
    degree1: 5,
    degree2: 10,
    degree3: 20
  }, {
    categoryId: '02',
    classId: '03',
    degree1: 5,
    degree2: 10,
    degree3: 20
  }, {
    categoryId: '02',
    classId: '04',
    degree1: 5,
    degree2: 10,
    degree3: 20
  }, {
    categoryId: '03',
    classId: '03',
    degree1: 2.5,
    degree2: 5,
    degree3: 20
  }, {
    categoryId: '03',
    classId: '04',
    degree1: 2.5,
    degree2: 5,
    degree3: 20
  }, {
    categoryId: '03',
    classId: '05',
    degree1: 2.5,
    degree2: 5,
    degree3: 20
  }, {
    categoryId: '03',
    classId: '06',
    degree1: 2.5,
    degree2: 5,
    degree3: 20
  }, {
    categoryId: '03',
    classId: '07',
    degree1: 0.5,
    degree2: 1,
    degree3: 2
  }, {
    categoryId: '03',
    classId: '08',
    degree1: 0.5,
    degree2: 1,
    degree3: 2
  }, {
    categoryId: '03',
    classId: '09',
    degree1: 2.5,
    degree2: 5,
    degree3: 20
  }, {
    categoryId: '03',
    classId: '10',
    degree1: 2.5,
    degree2: 5,
    degree3: 20
  }, {
    categoryId: '03',
    classId: '11',
    degree1: 2.5,
    degree2: 5,
    degree3: 20
  }, {
    categoryId: '05',
    classId: '01',
    degree1: 1,
    degree2: 2,
    degree3: 3
  }, {
    categoryId: '05',
    classId: '02',
    degree1: 2.5,
    degree2: 5,
    degree3: 20
  }],
  wbcNormalRange: null,
  normalRange: [{
    classId: '01',
    min: 42,
    max: 85,
    unit: '%'
  }, {
    classId: '02',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '03',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '04',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '05',
    min: 11,
    max: 49,
    unit: '%'
  }, {
    classId: '61',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '62',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '07',
    min: 0,
    max: 9,
    unit: '%'
  }, {
    classId: '08',
    min: 0,
    max: 6,
    unit: '%'
  }, {
    classId: '09',
    min: 0,
    max: 2,
    unit: '%'
  }, {
    classId: '10',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '11',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '12',
    min: 0,
    max: 100,
    unit: 'Count'
  }, {
    classId: '13',
    min: 0,
    max: 100,
    unit: 'Count'
  }, {
    classId: '14',
    min: 0,
    max: 100,
    unit: 'Count'
  }, {
    classId: '15',
    min: 0,
    max: 100,
    unit: 'Count'
  }, {
    classId: '16',
    min: 0,
    max: 100,
    unit: 'Count'
  }],
  settings: {
    // id, pass 저장
    isRememberMe: false,
    saveId: '',
    savePassword: '',
    maxOilCount: 1000,
    currentOilCount: 0,
    howellJollyDirName: '19_Howell_jolly',
    malariaDirName: '43_InclusionBody_Malaria',
    noMalariaDirName: '44_InclusionBody_NoMalaria',
    rbcClassDirName: '03_RBC_Classification',
    rbcImageDirName: '02_RBC_Image',
    barcodeDirName: '00_Barcode_Image',
    wbcClassDirName: '01_WBC_Classification',
    bfDirName: '02_LowPower_Image',
    bfHighDirName: '03_HighPower_Image',
    bfClassDirName: '05_BF_Classification',
    pbiaRootPath: 'D:/IA_Proc',
    pbAnalysisType: '100',
    stitchCount: '1',
    positionMargin: '0',
    wbcPositionMargin: '0',
    pltPositionMargin: '0',
    bfAnalysisType: '100',
    runningMode: '00',
    isMarker: false,
    testTypeCd: '01',
    sizeSildeValue: 50,
    brightnessSlideValue: 100,
    redValue: 0,
    greenValue: 0,
    blueValue: 0,
    rbcBrightnessSlideValue: 100,
    rbcRedValue: 0,
    rbcGreenValue: 0,
    rbcBlueValue: 0,
    modelWbcReportPrint: [],
    rbcSize: [],
    rbcChromia: [],
    rbcShape: [],
    rbcPlatelet: [],
    rbcInclusion: [],
    isShowModalBarcode: false,
    isNsNbIntegration: false,
    isAlarm: false,
    isCbcShow: false,
    wbcRgbValues: [],
    hostIp: 'http://127.0.0.1:18088',
    kumcCbcPath: 'C:/Users/user/Desktop/IA_MSG/CBC',  // 고대 CBC
    rbcPrint: 'N',
    alarmCount: 30
  },
  // system info id
  systemTimeId: null,
  isPauseState: false,
  siteCd: '0001',
  deviceBarcode: '',
  skmcLisResults: null,
  customClass: null,
  sysInfo: null,
  backendData: null
}

const state = INIT_COMMON_STATE

const mutations = {
  UPDATE_REMEMBER_STATE (state, obj) {
    console.log(state)
    state.settings.isRememberMe = obj.isRememberMe
    state.settings.saveId = obj.saveId
    state.settings.savePassword = obj.savePassword
  },
  UPDATE_ROOT_PATH (state, path) {
    state.settings.pbiaRootPath = path
  },
  UPDATE_OIL_COUNT (state, cnt) {
    state.settings.currentOilCount = cnt
  },
  INIT_OIL_COUNT (state) {
    state.settings.currentOilCount = state.settings.maxOilCount
  },
  SET_SYSTEM_TIME_ID (state, id) {
    state.systemTimeId = id
  },
  UPDATE_ANALYSIS_TYPE (state, obj) {
    state.settings.pbAnalysisType = obj.pbAnalysisType
    state.settings.bfAnalysisType = obj.bfAnalysisType
    state.settings.stitchCount = obj.stitchCount
    state.settings.positionMargin = obj.positionMargin
    state.settings.wbcPositionMargin = obj.wbcPositionMargin
    state.settings.pltPositionMargin = obj.pltPositionMargin
  },
  UPDATE_RUNNING_MODE (state, obj) {
    state.settings.runningMode = obj.runningMode
  },
  UPDATE_MARKER_STATE (state, isShow) {
    state.settings.isMarker = isShow
  },
  SET_PAUSE_STATE (state, isPause) {
    state.isPauseState = isPause
  },
  UPDATE_TEST_TYPE (state, value) {
    state.settings.testTypeCd = value
  },
  SET_SIZE_SLIDE_VALUE (state, value) {
    state.settings.sizeSildeValue = value
  },
  SET_BRIGHTNESS_SLIDE_VALUE (state, value) {
    state.settings.brightnessSlideValue = value
  },
  SET_RED_VALUE (state, value) {
    state.settings.redValue = value
  },
  SET_GREEN_VALUE (state, value) {
    state.settings.greenValue = value
  },
  SET_BLUE_VALUE (state, value) {
    state.settings.blueValue = value
  },
  SET_RGB_VALUE (state, obj) {
    var isFind = state.settings.wbcRgbValues.find(function(item) {
      return item.id === obj.id
    })

    if (typeof(isFind) !== 'undefined') {
      state.settings.wbcRgbValues.forEach(function(item) {
        if (item.id === obj.id) {
          item.redValue = obj.redValue
          item.greenValue = obj.greenValue
          item.blueValue = obj.blueValue
        }
      })
    } else {
      state.settings.wbcRgbValues.push(obj)
    }
  },
  SET_RBC_BRIGHTNESS_SLIDE_VALUE (state, value) {
    console.log(value)
    state.settings.rbcBrightnessSlideValue = value
  },
  SET_RBC_RED_VALUE (state, value) {
    state.settings.rbcRedValue = value
  },
  SET_RBC_GREEN_VALUE (state, value) {
    state.settings.rbcGreenValue = value
  },
  SET_RBC_BLUE_VALUE (state, value) {
    state.settings.rbcBlueValue = value
  },
  SET_WBC_REPORT_PRINT (state, array) {
    state.settings.modelWbcReportPrint = array
  },
  SET_RBC_REPORT_PRINT (state, value) {
    state.settings.rbcPrint = value
  },
  SET_ALARM_COUNT (state, value) {
    console.log(value)
    state.settings.alarmCount = value
  },
  SET_RBC_SIZE (state, array) {
    state.settings.rbcSize = array
  },
  SET_RBC_CHROMIA (state, array) {
    state.settings.rbcChromia = array
  },
  SET_RBC_SHAPE (state, array) {
    state.settings.rbcShape = array
  },
  PUSH_RBC_SHAPE (state, classId) {
    state.settings.rbcShape.push(classId)
  },
  POP_RBC_SHAPE (state, classId) {
    state.settings.rbcShape.splice(state.settings.rbcShape.indexOf(classId), 1)
  },
  SET_RBC_PLATELET (state, array) {
    state.settings.rbcPlatelet = array
  },
  PUSH_RBC_PLATELET (state, classId) {
    state.settings.rbcPlatelet.push(classId)
  },
  POP_RBC_PLATELET (state, classId) {
    state.settings.rbcPlatelet.splice(state.settings.rbcPlatelet.indexOf(classId), 1)
  },
  SET_RBC_INCLUSION (state, array) {
    state.settings.rbcInclusion = array
  },
  PUSH_RBC_INCLUSION (state, classId) {
    state.settings.rbcInclusion.push(classId)
  },
  POP_RBC_INCLUSION (state, classId) {
    state.settings.rbcInclusion.splice(state.settings.rbcInclusion.indexOf(classId), 1)
  },
  SET_IS_SHOW_MODAL_BARCODE (state, isShowModalBarcode) {
    state.settings.isShowModalBarcode = isShowModalBarcode
  },
  SET_IS_NS_NB_INTEGRATION (state, isNsNbIntegration) {
    state.settings.isNsNbIntegration = isNsNbIntegration
  },
  SET_IS_ALARM (state, isAlarm) {
    state.settings.isAlarm = isAlarm
  },
  SET_IS_CBC_SHOW (state, isCbcShow) {
    state.settings.isCbcShow = isCbcShow
  },
  SET_SITE_CD (state, siteCd) {
    state.siteCd = siteCd
  },
  SET_DEVICE_BARCODE (state, deviceBarcode) {
    state.deviceBarcode = deviceBarcode
  },
  UPDATE_NORMAL_RANGE (state, rangeObj) {
    state.normalRange = rangeObj
  },
  SET_HOST_IP (state, hostIp) {
    state.settings.hostIp = hostIp
  },
  SET_WBC_NORMAL_RANGE (state, range) {
    state.wbcNormalRange = range
  },
  SET_SKMC_LIS_RESULTS (state, results) {
    state.skmcLisResults = results
  },
  SET_CUSTOM_CLASS (state, obj) {
    state.customClass = obj
  },
  SET_SYS_INFO (state, obj) {
    state.sysInfo = obj
  },
  SET_BACKEND_DATA (state, obj) {
    state.backendData = obj
  }
  // PB_GET_FILES (state, obj) {
  //   console.log(state)
  //   api.PbIaGetFiles({
  //     url: state.settings.hostIp,
  //     path: state.settings.pbiaRootPath + '/' + '20230630134412_00_31805552100',
  //     endPoint: 'api/v1/images'
  //   }).then(function(ret) {
  //     console.log(ret)
  //   }).catch(function(err) {
  //     console.log(err)
  //   })
  // }
}

const actions = {
  // ID, PASSWORD 저장 여부 업데이트
  updateRememberState: (context, obj) => {
    context.commit('UPDATE_REMEMBER_STATE', obj)
  },
  // updateRunningPath: (context, path) => {
  //   context.commit('UPDATE_RUNNING_PATH', path)
  // },
  // updateResultPathWbc: (context, path) => {
  //   context.commit('UPDATE_RESULT_PATH_WBC', path)
  // },
  // updateResultPathRbc: (context, path) => {
  //   context.commit('UPDATE_RESULT_PATH_RBC', path)
  // },
  // updateBarcodePath: (context, path) => {
  //   context.commit('UPDATE_BARCODE_PATH', path)
  // },
  updateRootPath: (context, path) => {
    context.commit('UPDATE_ROOT_PATH', path)
  },
  // 오일 카운트 update
  updateOilCount: (context, cnt) => {
    context.commit('UPDATE_OIL_COUNT', cnt)
  },
  // 오일 카운트 초기화
  initOilCount: (context) => {
    context.commit('INIT_OIL_COUNT')
  },
  setSystemTimeId: (context, id) => {
    context.commit('SET_SYSTEM_TIME_ID', id)
  },
  updateAnalysisType: (context, obj) => {
    context.commit('UPDATE_ANALYSIS_TYPE', obj)
  },
  updateRunningMode: (context, obj) => {
    context.commit('UPDATE_RUNNING_MODE', obj)
  },
  updateMarkerState: (context, isShow) => {
    context.commit('UPDATE_MARKER_STATE', isShow)
  },
  setPauseState: (context, isPause) => {
    context.commit('SET_PAUSE_STATE', isPause)
  },
  updateTestType: (context, value) => {
    context.commit('UPDATE_TEST_TYPE', value)
  },
  setSizeSlideValue: (context, value) => {
    context.commit('SET_SIZE_SLIDE_VALUE', value)
  },
  setBrightnessSlideValue: (context, value) => {
    context.commit('SET_BRIGHTNESS_SLIDE_VALUE', value)
  },
  setRedValue: (context, value) => {
    context.commit('SET_RED_VALUE', value)
  },
  setGreenValue: (context, value) => {
    context.commit('SET_GREEN_VALUE', value)
  },
  setBlueValue: (context, value) => {
    context.commit('SET_BLUE_VALUE', value)
  },
  setRgbValue: (context, obj) => {
    context.commit('SET_RGB_VALUE', obj)
  },
  setRbcBrightnessSlideValue: (context, value) => {
    context.commit('SET_RBC_BRIGHTNESS_SLIDE_VALUE', value)
  },
  setRbcRedValue: (context, value) => {
    context.commit('SET_RBC_RED_VALUE', value)
  },
  setRbcGreenValue: (context, value) => {
    context.commit('SET_RBC_GREEN_VALUE', value)
  },
  setRbcBlueValue: (context, value) => {
    context.commit('SET_RBC_BLUE_VALUE', value)
  },
  setRbcSize: (context, array) => {
    context.commit('SET_RBC_SIZE', array)
  },
  setWbcReportPrint: (context, array) => {
    context.commit('SET_WBC_REPORT_PRINT', array)
  },
  setRbcReportPrint: (context, value) => {
    context.commit('SET_RBC_REPORT_PRINT', value)
  },
  setAlarmCount: (context, value) => {
    context.commit('SET_ALARM_COUNT', value)
  },
  setRbcChromia: (context, array) => {
    context.commit('SET_RBC_CHROMIA', array)
  },
  setRbcShape: (context, array) => {
    context.commit('SET_RBC_SHAPE', array)
  },
  setRbcPlatelet: (context, array) => {
    context.commit('SET_RBC_PLATELET', array)
  },
  setRbcInclusion: (context, array) => {
    context.commit('SET_RBC_INCLUSION', array)
  },
  pushRbcShape: (context, classId) => {
    context.commit('PUSH_RBC_SHAPE', classId)
  },
  pushRbcPlatelet: (context, classId) => {
    context.commit('PUSH_RBC_PLATELET', classId)
  },
  pushRbcInclusion: (context, classId) => {
    context.commit('PUSH_RBC_INCLUSION', classId)
  },
  popRbcShape: (context, classId) => {
    context.commit('POP_RBC_SHAPE', classId)
  },
  popRbcPlatelet: (context, classId) => {
    context.commit('POP_RBC_PLATELET', classId)
  },
  popRbcInclusion: (context, classId) => {
    context.commit('POP_RBC_INCLUSION', classId)
  },
  setIsShowModalBarcode: (context, isShowModalBarcode) => {
    context.commit('SET_IS_SHOW_MODAL_BARCODE', isShowModalBarcode)
  },
  setIsNsNbIntegration: (context, isNsNbIntegration) => {
    context.commit('SET_IS_NS_NB_INTEGRATION', isNsNbIntegration)
  },
  setIsAlarm: (context, isAlarm) => {
    context.commit('SET_IS_ALARM', isAlarm)
  },
  setIsCbcShow: (context, isCbcShow) => {
    context.commit('SET_IS_CBC_SHOW', isCbcShow)
  },
  setSiteCd: (context, siteCd) => {
    context.commit('SET_SITE_CD', siteCd)
  },
  setDeviceBarcode: (context, deviceBarcode) => {
    context.commit('SET_DEVICE_BARCODE', deviceBarcode)
  },
  updateNormalRange: (context, rangeObj) => {
    context.commit('UPDATE_NORMAL_RANGE', rangeObj)
  },
  setHostIp: (context, hostIp) => {
    context.commit('SET_HOST_IP', hostIp)
  },
  setWbcNormalRange: (context, range) => {
    context.commit('SET_WBC_NORMAL_RANGE', range)
  },
  setSkmcLisResults: (context, results) => {
    context.commit('SET_SKMC_LIS_RESULTS', results)
  },
  setCustomClass: (context, obj) => {
    context.commit('SET_CUSTOM_CLASS', obj)
  },
  setSysInfo: (context, obj) => {
    context.commit('SET_SYS_INFO', obj)
  },
  setBackendData: (context, obj) => {
    context.commit('SET_BACKEND_DATA', obj)
  }
}

const getters = {
  getCommonCodeList: (state, getters) => (grpCd) => {
    var list = []

    for (var i = 0; i < state.commonCodeList.length; i++) {
      if (state.commonCodeList[i].grpCd === grpCd) {
        list.push(state.commonCodeList[i])
      }
    }

    return list
  },
  getCommonCode: (state, getters) => (grpCd, cd) => {
    var obj = {}

    for (var i = 0; i < state.commonCodeList.length; i++) {
      if (state.commonCodeList[i].grpCd === grpCd && state.commonCodeList[i].cd === cd) {
        obj = state.commonCodeList[i]
      }
    }

    return obj
  },
  getSettings: (state, getters) => {
    return state.settings
  },
  getSystemTimeId: (state) => {
    return state.systemTimeId
  },
  getMarkerState: (state) => {
    return state.settings.isMarker
  },
  getPauseState: (state) => {
    return state.isPauseState
  },
  getSizeSlideValue: (state) => {
    return state.settings.sizeSildeValue
  },
  getBrightnessSlideValue: (state) => {
    return state.settings.brightnessSlideValue
  },
  getRedValue: (state) => {
    return state.settings.redValue
  },
  getGreenValue: (state) => {
    return state.settings.greenValue
  },
  getBlueValue: (state) => {
    return state.settings.blueValue
  },
  getRgbValue: (state) => {
    if (state.settings.wbcRgbValues.length <= 0) {
      state.settings.wbcRgbValues.push({
        redValue: 0,
        greenValue: 0,
        blueValue: 0,
        id: '',
        title: ''
      })
    }
    return state.settings.wbcRgbValues
  },
  getRbcBrightnessSlideValue: (state) => {
    return state.settings.rbcBrightnessSlideValue
  },
  getRbcRedValue: (state) => {
    return state.settings.rbcRedValue
  },
  getRbcGreenValue: (state) => {
    return state.settings.rbcGreenValue
  },
  getRbcBlueValue: (state) => {
    return state.settings.rbcBlueValue
  },
  getWbcReportPrint: (state) => {
    return state.settings.modelWbcReportPrint
  },
  getRbcReportPrint: (state) => {
    return state.settings.rbcPrint
  },
  getAlarmCount: (state) => {
    return state.settings.alarmCount
  },
  getRbcSize: (state) => {
    return state.settings.rbcSize
  },
  getRbcChromia: (state) => {
    return state.settings.rbcChromia
  },
  getRbcShape: (state) => {
    return state.settings.rbcShape
  },
  getRbcPlatelet: (state) => {
    return state.settings.rbcPlatelet
  },
  getRbcInclusion: (state) => {
    return state.settings.rbcInclusion
  },
  getIsShowModalBarcode: (state) => {
    return state.settings.isShowModalBarcode
  },
  getIsNsNbIntegration: (state) => {
    return state.settings.isNsNbIntegration
  },
  getIsAlarm: (state) => {
    return state.settings.isAlarm
  },
  getIsCbcShow: (state) => {
    return state.settings.isCbcShow
  },
  getSiteCd: (state) => {
    return state.siteCd
  },
  getDeviceBarcode: (state) => {
    return state.deviceBarcode
  },
  getDefaultRbcDegree: (state) => {
    return state.defaultRbcDegree
  },
  getNormalRange: (state) => {
    return state.normalRange
  },
  getHostIp: (state) => {
    return state.settings.hostIp
  },
  getKumcCbcPath: (state) => {
    return state.settings.kumcCbcPath
  },
  getWbcNormalRange: (state) => {
    return state.wbcNormalRange
  },
  getSkmcLisResults: (state) => {
    return state.skmcLisResults
  },
  getCustomClass: (state) => {
    return state.customClass
  },
  getSysInfo: (state) => {
    return state.sysInfo
  },
  getBackendData: (state) => {
    return state.backendData
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
