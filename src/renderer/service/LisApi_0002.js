import axios from 'axios'

// [082_0002] start
const testUrl = 'http://emr012edu.cmcnu.or.kr/cmcnu/.live'
const realUrl = 'http://emr012.cmcnu.or.kr/cmcnu/.live'
const business_id = 'li'
// 병원 코드
const instcd = '012'
// 장비 코드 (LIS등록)
const eqmtcd = 'H59'
// [082_0001] end

// api test
const apiTest = 'http://localhost:8081/api/v1/cbcResult'

async function getCdcResults_0002(bcno) {
  return axios.get(realUrl, {
    params: {
      submit_id: 'TRLII00124',
      business_id: business_id,
      instcd: instcd,
      bcno: bcno
    }
  })
}

async function checkUserAuth_0002(empNo) {
  var url = realUrl + '?' +
    'submit_id=' + 'TRLII00104&' +
    'business_id=' + business_id + '&' +
    'instcd=' + instcd + '&' +
    'userid=' + empNo + '&'

  console.log(url)
  return axios.get(url)
}

async function uploadReport_0002(params) {
  var now = new Date()
  var year = "" + now.getFullYear()
  var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
  var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }

  var result = ''
  params.wbcInfo.forEach(function(wbcItem) {
    if (wbcItem.testCd !== null && wbcItem.testCd !== '') {
      result += wbcItem.testCd + encodeURIComponent('') +
                wbcItem.percent + encodeURIComponent('') +
                year + month + day + encodeURIComponent('')
    }
  })
  console.log(params)
  console.log(result)

  var url = realUrl + '?' +
    'submit_id=' + 'TXLII00101&' +
    'business_id=' + business_id + '&' +
    'ex_interface=' + params.empNo + '|' + instcd + '&' +
    'instcd=' + instcd + '&' +
    'userid=' + params.empNo + '&' +
    'eqmtcd=' + eqmtcd + '&' +
    'bcno=' + params.barcodeNo + '&' +
    'result=' + result + '&' +
    'testcont=' + 'MANUAL DIFFERENTIAL COUNT RESULT' + '&' +
    'testcontcd=' + '01' + '&' +
    'execdeptcd=' + 'H1'

    return axios.get(url)

  // return axios.get(testUrl, {
  //   params: {
  //     submit_id: 'TXLII00101',
  //     business_id: business_id,
  //     ex_interface: params.empNo + '|' + instcd,
  //     instcd: instcd,
  //     userId: params.empNo,
  //     eqmtcd: eqmtcd,
  //     bcno: params.barcodeNo,
  //     result: result
  //   }
  // })
}

export default {
  async getCdcResults_0002 (bcno) {
    return await getCdcResults_0002(bcno)
  },
  async checkUserAuth_0002 (empNo) {
    return await checkUserAuth_0002(empNo)
  },
  async uploadReport_0002 (params) {
    return await uploadReport_0002(params)
  }
}
