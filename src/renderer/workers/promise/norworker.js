import Configs from '../../../Configs.js'
import Constant from '../../../Constant.js'

const net = require('net')
const MAX_BUFF_LENGTH = 0xfffffff

var client = null
var bufList = []
var port = Configs.PORT
var addr = Configs.HOST_NAME
var bufStr = ''
var bodyLen = 0
var headerLength = 0

function onReceiveData (buff) {
  try {
    // var totalLength = Number(buff.toString().substring(0, 7))
    // var body = buff.toString().substring(7, buff.toString().length)
    //
    // console.log(body)
    //
    // if (isNaN(totalLength)) {
    //   bufStr += buff.toString()
    // } else {
    //   headerLength = totalLength
    //   bufStr += body
    // }
    // bodyLen = bufStr.length
    //
    // console.log('header length : ' + headerLength)
    // console.log('total length : ' + totalLength)
    // console.log('bodyLen : ' + bodyLen)
    //
    // if (headerLength == bodyLen) {
    //   self.postMessage({params: JSON.parse(bufStr)})
    //   bufStr = ''
    //   bodyLen = 0
    // }
    if (buff.indexOf('\n') === -1) {
      bufStr += buff.toString()
    } else {
      bufStr += buff.toString()

      self.postMessage({params: JSON.parse(bufStr.toString())})
      bufStr = ''
    }

  } catch (e) {
    bufStr = ''
    // bodyLen = 0
  }
}

async function initConnToServer (callback) {
  console.log('initConnToServer')
  
  if (!client || !client.writable) {
    client = new net.Socket()
    client.connect({port: port, host: addr, keepAlive: false}, callback)

    client.on('data', function (chunck) {
      try {
        onReceiveData(chunck)
        // client.end()
      } catch (e) {
        console.log('onDataError', e.message)
      }
    })
    client.on('end', function (e) {
      // console.log('connection end!!!')
    })
    client.on('error', function (e) {
      console.log(e.message)
      var errObj = {resultCd: '-100', resultMsg: '[nor]' + e.message, jobCmd: 'OTHER'}
      self.postMessage({params: errObj})
    })
  }

  // if (!client.connecting) {
  //   client.connect(port, addr)
  // }
}

async function sendToServer (requestObj) {
  // if (!client || client.destroyed) {
  //   await initConnToServer()
  // }
  //
  // if (requestObj && requestObj.length > 0) {
  //   if (client.connecting) {
  //     requestObj += '\n'
  //     client.write(requestObj)
  //   }
  // }

  console.log('send msg : ' + requestObj)
  if (!client || !client.writable) {
    await initConnToServer(function() {
      // console.log(requestObj)
      if (requestObj && requestObj.length > 0) {
        if (client.writable) {
          requestObj += '\n'
          client.write(requestObj)
        }
      }
    })
  } else {
    if (requestObj && requestObj.length > 0) {
      if (client.writable) {
        requestObj += '\n'
        console.log('write 2')
        client.write(requestObj)
      }
    }
  }
}

// function getConnection(connName) {
//   var client = net.connect({port: port, host: addr}, function() {
//     // this.setTimeout(500);
//     this.setEncoding('utf8');
//     this.on('data', function(data) {
//       try {
//         onReceiveData(data)
//       } catch (e) {
//         console.log('onDataError', e.message)
//       }
//       this.end();
//     });
//     this.on('end', function() {
//       console.log(connName + ' Client disconnected');
//     });
//     this.on('error', function(err) {
//       console.log('Socket Error: ', JSON.stringify(err));
//     });
//     this.on('timeout', function() {
//       console.log('Socket Timed Out');
//     });
//     this.on('close', function() {
//       console.log('Socket Closed');
//     });
//   });
//   return client;
// }
//
// function writeData(socket, data) {
//   var success = !socket.write(data);
//   if (!success){
//     (function(socket, data){
//       socket.once('drain', function(){
//         writeData(socket, data);
//       });
//     })(socket, data);
//   }
// }
//
// function sendToServer (requestObj) {
//   if (!client || client.destroyed) {
//     console.log('connnnnnn')
//     client = getConnection()
//   }
//
//   console.log(client)
//   writeData(client, requestObj)
// }

self.onmessage = function (event) {
  if (event.data.type === 'sendDataToServer') {
    sendToServer(event.data.params)
  }
}
