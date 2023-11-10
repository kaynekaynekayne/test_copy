// import PromiseWorker from 'promise-worker'
import NorWorker from 'worker-loader!./norworker'
// import SysWorker from 'worker-loader!./sysworker'
import Constant from '../../../Constant.js'

const norWorker = new NorWorker()
// const sysWorker = new SysWorker()

const sendDataToServer = function (content, data) {
  norWorker.postMessage({type: 'sendDataToServer', params: data})
  console.log(content);
  console.log(data);
  // if (JSON.parse(data).jobCmd === 'SYSINFO') {
  //   sysWorker.postMessage({type: 'sendDataToServerSys', params: data})
  // } else {
  //   norWorker.postMessage({type: 'sendDataToServer', params: data})
  // }
}

norWorker.onmessageerror = function(event) {
  event.preventDefault()
}

// sysWorker.onmessageerror = function(event) {
//   event.preventDefault()
// }

export default {
  sendDataToServer,
  norWorker
  // sysWorker
}
