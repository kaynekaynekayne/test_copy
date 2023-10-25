import axios from 'axios'

async function uploadReport(params) {
  return axios.post(params.url, {
    barcodeNo: params.barcodeNo,
    userid: params.userId,
    deviceBarcode: params.deviceBarcode,
    resultMsg: params.resultMsg
  })
}

async function getCdcResults(params) {
  var url = params.url + '?' +
    'barcodeNo=' + params.barcodeNo + '&' +
    'deviceBarcode=' + params.deviceBarcode + '&' +
    'userid=' + params.userId

  return axios.get(url)
}

export default {
  async uploadReport (params) {
    return await uploadReport(params)
  },
  async getCdcResults (params) {
    return await getCdcResults(params)
  }
}
