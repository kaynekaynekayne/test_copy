import axios from 'axios'

const testUrl = 'http://localhost:54604/'
const realUrl = 'http://128.1.70.50:8085/'

async function getCdcResults_0011(params) {
  return axios.post(params.url + '/api/MifMain/Order', {
    machine: params.machine,
    episode: params.episode
  })
}

async function uploadReport_0011(params) {
  return axios.post(params.url + '/api/MifMain/File', {
    machine: params.machine,
    episode: params.episode,
    result: params.result
  })
}

export default {
  async getCdcResults_0011 (params) {
    return await getCdcResults_0011(params)
  },
  async uploadReport_0011 (params) {
    return await uploadReport_0011(params)
  }
}
