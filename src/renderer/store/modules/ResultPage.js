import Constant from '../../../Constant.js'
import lodash from 'lodash'

const INIT_RESULT_PAGE = {
  searchOptions: {
    searchType: Object.freeze([
      { value: '01', text: 'Patient ID' },
      { value: '02', text: 'Barcode ID' },
      { value: '03', text: 'Name' }
    ]),
    signedState: Object.freeze([
      { value: '00', text: 'All' },
      { value: '01', text: 'Signed' },
      { value: '02', text: 'Ready' }
    ]),
    wbcTotalSort: Object.freeze([
      { value: '00', text: '-' },
      { value: '01', text: 'DESC' },
      { value: '02', text: 'ASC' }
    ]),
    searchTypeCd: '02',
    searchText: '',
    startDate: '',
    endDate: '',
    // 체크 박스
    wbcClassList: [],
    nrCount: 0,
    wbcTotalSortCd: '00'
  },
  // classification item
  classificationItem: {
    item: null,
    limit: 0
  },
  dspList: null,
  sortType: 'analysis'
}

const state = INIT_RESULT_PAGE

const mutations = {
  UPDATE_SEARCH_OPTIONS (state, params) {
    state.searchOptions.searchTypeCd = params.searchTypeCd
    state.searchOptions.searchText = params.searchText
    state.searchOptions.startDate = params.startDate
    state.searchOptions.endDate = params.endDate
    state.searchOptions.wbcClassList = params.wbcClassList
    state.searchOptions.nrCount = params.nrCount
    state.searchOptions.wbcTotalSortCd = params.wbcTotalSortCd

  },
  SET_CLASSIFICATION_ITEM (state, params) {
    state.classificationItem.item = params.item
    state.classificationItem.limit = params.limit
  },
  ADD_DSP_LIST (state, dspList) {
    state.dspList = dspList
  },
  SET_SORT_TYPE (state, value) {
    state.sortType = value
  }
}

const actions = {
  updateSearchOption: (context, params) => {
    context.commit('UPDATE_SEARCH_OPTIONS', params)
  },
  setClassificationItem: (context, params) => {
    context.commit('SET_CLASSIFICATION_ITEM', params)
  },
  addDspList: (context, dspList) => {
    context.commit('ADD_DSP_LIST', dspList)
  },
  setSortType: (context, value) => {
    context.commit('SET_SORT_TYPE', value)
  }

}

const getters = {
  getSearchOptions: state => {
    return state.searchOptions
  },
  getClassificationItem: state => {
    return state.classificationItem
  },
  getDspList: state => {
    return state.dspList
  },
  getSortType: state => {
    return state.sortType
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
