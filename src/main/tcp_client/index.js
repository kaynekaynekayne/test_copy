// // const SEND_DATA = 'SEND_DATA'
// // const SETUP_CLIENT = 'SETUP_CLIENT'
// // const log = require('electron-log')
// // const app = require("electron").app
// // let path = require('path')
// // let cluster = require('cluster')
// // let os = require('os')
// // let tcpProcess = null
// // // sysinfo 프로세스 분리
// // let sysInfoProcess = null
// // let _event = null
//
// // // 워커 스케쥴을 OS에 맡긴다.
// // cluster.schedulingPolicy = cluster.SCHED_NONE
// //
// // //워커 스케쥴을 Round Robin 방식으로 한다.
// // cluster.schedulingPolicy = cluster.SCHED_RR
// //
// // cluster.setupMaster({
// //   exec: path.join(__dirname, "client.js"),
// //   silent: false
// // })
// //
// // if (cluster.isMaster) {
// //   tcpProcess = cluster.fork().on('message', function (message) {
// //     log.info(tcpProcess.process.pid + 'received tcp message : ' + message.bufList.jobCmd)
// //     log.info(tcpProcess.process.pid + 'received tcp message : ' + message.totalLenth)
// //     _event.sender.send('RECEIVE_DATA', message.bufList)
// //   })
// //
// //   sysInfoProcess = cluster.fork().on('message', function (message) {
// //     log.info(sysInfoProcess.process.pid + 'received sysinfo message : ' + message.bufList.jobCmd)
// //     log.info(sysInfoProcess.process.pid + 'received sysinfo message : ' + message.totalLenth)
// //     _event.sender.send('RECEIVE_DATA_SYSINFO', message.bufList)
// //   })
// //
// //   // worker disconnect,
// // 	cluster.on('disconnect', function (worker) {
// // 		// worker info
// // 		// log.info('[worker disconnected] ' + worker.id)
// // 		// fork child process
// // 		// forkWorker(worker)
// //
// // 		// log.info('[new worker forked!] : ' + worker.id)
// // 	})
// //
// //   cluster.on('online', function (worker) {
// //     log.info('created worker id : ' + worker.process.pid)
// //     // worker.send({ type: SETUP_CLIENT, payload: { addr: process.env.HOST_NAME, port: process.env.PORT } })
// //   })
// //
// //   cluster.on('exit', function (worker, code, signal) {
// //     log.info('dead worker id : ' + worker.process.pid)
// //     log.info('dead worker exit code : ' + code)
// //     log.info('dead worker signal : ' + signal)
// //
// //     if (code == 99) {
// //       //종료 코드가 1인 경우, 워커 재생성 uncaughtException
// //       forkWorker(worker)
// //     } else if (code == 100) {
// //       //종료 코드가 100인 경우, shutdown
// //       for (var id in cluster.workers) {
// //           cluster.workers[id].disconnect()
// //           setTimeout(() => {
// //             cluster.workers[id].kill()
// //           }, 2000)
// //       }
// //
// //       app.exit(0)
// //     }
// //   })
// //
// //   function forkWorker (worker) {
// //     if (worker.id === tcpProcess.id) {
// //       tcpProcess = cluster.fork().on('message', function (message) {
// //         log.info(tcpProcess.process.pid + 'received tcp message : ' + message.bufList.jobCmd)
// //         log.info(tcpProcess.process.pid + 'received tcp message : ' + message.totalLenth)
// //         _event.sender.send('RECEIVE_DATA', message.bufList)
// //       })
// //     } else if (worker.id === sysInfoProcess.id) {
// //       sysInfoProcess = cluster.fork().on('message', function (message) {
// //         log.info(sysInfoProcess.process.pid + 'received sysinfo message : ' + message.bufList.jobCmd)
// //         log.info(sysInfoProcess.process.pid + 'received sysinfo message : ' + message.totalLenth)
// //         _event.sender.send('RECEIVE_DATA_SYSINFO', message.bufList)
// //       })
// //     }
// //   }
// // }
// //
// // module.exports = {
// //   // init tcp client
// //   // setupClient: (addr, port) => {
// //   //   tcpProcess.send({ type: SETUP_CLIENT, payload: { addr, port } })
// //   // },
// //   // send string or buffer to server
// //   sendDataToServer: (event, data) => {
// //     _event = event
// //
// //     if (JSON.parse(data).jobCmd === 'SYSINFO') {
// //       sysInfoProcess.send({ type: SEND_DATA, payload: data })
// //     } else if (JSON.parse(data).jobCmd === 'SHUTDOWN') {
// //       //마스터가 워커들에게 종료 예고 메시지 전송
// //       for (var id in cluster.workers) {
// //         cluster.workers[id].send({type: 'SHUTDOWN', from: 'master'})
// //       }
// //     } else {
// //       tcpProcess.send({ type: SEND_DATA, payload: data })
// //     }
// //   }
// // }
//
// import { app, ipcMain, BrowserWindow, Tray, Menu } from 'electron'
//
// const net = require('net')
// const log = require('electron-log')
//
// var _event = null
// var client = null
//
// console.log("TCP_CLIENT")
//
// function getConnection(connName, hostIp, callback) {
//   if (!client || !client.writable) {
//     client = new net.Socket()
//     client.connect({port: 8099, host: hostIp, keepAlive: false}, callback)
//
//     client.on('data', function (chunck) {
//       try {
//         client.end()
//         console.log('send VIEWER_TCP_SEND')
//         _event.sender.send('VIEWER_TCP_SEND', chunck)
//
//       } catch (e) {
//         console.log('onDataError', e.message)
//       }
//     })
//     client.on('end', function (e) {
//       console.log('connection end!!!')
//     })
//     client.on('error', function (e) {
//       console.log(e.message)
//       console.log(ipcMain)
//       _event.sender.send('VIEWER_TCP_ERROR', e)
//     })
//     client.on('timeout', function() {
//       console.log('Socket Timed Out')
//     })
//     client.on('close', function() {
//       console.log('Socket Closed')
//     })
//   }
// }
//
// function writeData(socket, data) {
//   var success = !socket.write(data)
//   console.log(socket)
//   console.log(success)
//
//   if (!success) {
//     (function(socket, data) {
//       socket.once('drain', function() {
//         writeData(socket, data)
//       })
//     })(socket, data)
//   }
// }
//
// export default {
//   async sendDataToServer (event, param) {
//     console.log('sendDataToServer host ip: ' + param.hostIp)
//     _event = event
//
//     if (!client || !client.writable) {
//       getConnection('viewerTcp', param.hostIp, function() {
//         console.log(client)
//         writeData(client, JSON.stringify(param))
//       })
//     } else {
//       writeData(client, JSON.stringify(param))
//     }
//   }
// }
