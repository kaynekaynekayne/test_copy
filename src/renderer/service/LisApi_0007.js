import axios from 'axios'

const realUrl = 'http://localhost:18081/api/v1/'

async function getCdcResults_0007(bcno) {
  return axios.get(realUrl + 'order', {
    params: {
      barcodeNo: bcno
    }
  })
}

async function createOrder_0007(params) {
  return axios.post(realUrl + 'order', {
    barcodeNo: params.barcodeNo,
    resultCd: params.resultCd
  })
}

async function uploadReport_0007(params) {
  return axios.post(realUrl + 'upload', {
    barcodeNo: params.barcodeNo,
    morphologys: params.morphologys,
    remark: params.remark,
    yyCd: params.yyCd
  })
}

async function commitReport_0007(params) {
  return axios.post(realUrl + 'commit', {
    barcodeNo: params.barcodeNo,
    resultCd: params.resultCd,
    yyCd: params.yyCd
  })
}

async function getWorkList_0007(params) {
  return axios.post(realUrl + 'workList', {
    barcodeList: params.barcodeList
  })
}

async function getWorkList_Date_0007(params) {
  return axios.get(realUrl + 'workList', {
    params: {
      sheetDate: params.sheetDate
    }
  })
}

export default {
  async getCdcResults_0007 (bcno) {
    return await getCdcResults_0007(bcno)
  },
  async createOrder_0007 (params) {
    return await createOrder_0007(params)
  },
  async uploadReport_0007 (params) {
    return await uploadReport_0007(params)
  },
  async commitReport_0007 (params) {
    return await commitReport_0007(params)
  },
  async getWorkList_0007 (params) {
    return await getWorkList_0007(params)
  },
  async getWorkList_Date_0007 (params) {
    return await getWorkList_Date_0007(params)
  }
}
