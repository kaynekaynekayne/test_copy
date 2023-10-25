import axios from 'axios'

// api test
const apiTest = 'http://localhost:8082/api/v1/'

async function sendDeviceUse(params, endPoint) {
  return axios.post(apiTest + endPoint, params)
}

async function getPolicy(params, endPoint) {
  return axios.get(apiTest + endPoint, {
    params: {
      siteCd: params.siteCd
    }
  })
}

async function sendErrorCode(params, endPoint) {
  return axios.post(apiTest + endPoint, {
    siteCd: params.siteCd,
    deviceBarcode: params.deviceBarcode,
    errorCd: params.errorCd,
    errorMsg: params.errorMsg,
    userId: params.userId
  })
}

export default {
  async sendDeviceUse (params, endPoint) {
    return await sendDeviceUse(params, endPoint)
  },
  async getPolicy (params, endPoint) {
    return await getPolicy(params, endPoint)
  },
  async sendErrorCode (params, endPoint) {
    return await sendErrorCode(params, endPoint)
  }
}
