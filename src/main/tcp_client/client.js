const net = require('net')
const MAX_BUFF_LENGTH = 0xfffffff
const log = require('electron-log')

class TCPClient {
  constructor () {
    this.client = null
    this.bufList = []
    this.totalLenth = 0
    this.dataHandler = () => {
      process.send({ bufList: JSON.parse(this.bufList.toString()), totalLenth: this.totalLenth })
    }
    this.addr = ''
    this.port = null
  }

  // setup client
  setupClient (addr, port) {
    log.info('--setup client-- addr : ' + addr, 'port : ' + port)
    if (this.client && !this.client.destroyed) {
      this.client.destroy()
    }
    this.addr = addr
    this.port = port
  }
  // callback of receive data
  onReceiveData (buff) {
    try {
      log.info('receve----')
      this.bufList = []
      this.totalLenth = 0

      if (this.totalLenth + buff.length > MAX_BUFF_LENGTH) {
        this.bufList.shift()
      }
      this.bufList.push(buff)
      this.totalLenth += buff.length

      if (this.dataHandler) {
        this.dataHandler(this.bufList, this.totalLenth)
      }
    } catch (e) {
      this.bufList = []
      this.totalLenth = 0
      log.info(`Error on onReceiveData ${e.message}`)
    }
  }

  // init socket
  initConnToServer () {
    log.info('initConnToServer')

    if (!this.client) {
      this.client = new net.Socket()
      this.client.on('data', (chunck) => {
        try {
          this.onReceiveData(chunck)
        } catch (e) {
          log.info('onDataError', e.message)
        }
      })
      if (!this.client.connecting) {
        this.client.connect(this.port, this.addr)
      }
    }

    if (this.client.destroyed) {
      this.client.connect(this.port, this.addr)
    }
  }

  sendToServer (requestObj) {
    log.info('send to server')

    if (!this.client || this.client.destroyed) {
      this.initConnToServer()
    }

    if (requestObj && requestObj.length > 0) {
      this.client.write(requestObj)
    }
  }
}

const tcpClient = new TCPClient()
tcpClient.setupClient('localhost', 11235)

process.on('error', (err) => {
  log.info('-----error------')
  log.error(err)
})

process.on('uncaughtException', function (err) {
	//예상치 못한 예외 처리
	log.info('uncaughtException 발생 : ' + err)
  //에러가 발생하면 워커를 죽이기 전에 적절한 종료 프로세스를 수행한다.
	try {
		//3초 이내에 종료되었는지 확인한다
		var killtimer = setTimeout(function() {
			process.exit(99)
		}, 3000)

		//하지만 setTimeout을 현재 process와 독립적으로 동작하도록 레퍼런스 제거
		killtimer.unref()

    process.send({ bufList: {jobCmd: "OTHER", resultCd: "99999", resultMsg: err.message}, totalLenth: 0 })

		//적절한 처리
		log.info('에러 발생 : ' + err)

	} catch (exception) {
		log.info('Error!!!', exception.stack)
	}
})

process.on('message', (message) => {
  try {
    log.info('on message')
    log.info(message)

    switch (message.type) {
      case 'SETUP_CLIENT': {
        tcpClient.setupClient(message.payload.addr, message.payload.port)
        break
      }
      case 'SEND_DATA': {
        tcpClient.sendToServer(message.payload)
        break
      }
      case 'SHUTDOWN': {
        process.exit(100)
        break
      }
      default:
        throw new Error('Unrecognized message received by tcp client')
    }
  } catch (e) {
    log.info(e)
  }
})
