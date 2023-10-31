'use strict'

import { app, ipcMain, BrowserWindow, Tray, Menu } from 'electron'
import path  from 'path'
import Configs from '../Configs.js'
import Constant from '../Constant.js'
import ErrorCode from '../ErrorCode.js'
import MySql from './mysql'
import query from './mysql/mysql_query.js'
import Express from './express'

// import Sqlite3 from './database'
// import Rabbitmq from './rabbitmq'
// import query from './database/query.js'

// import TcpServer from './tcp_server'
// import TcpClient from './tcp_client'
// import Db2Client from './db2'

const os = require('os')
const env = {...process.env, ELECTRON_VERSION:process.versions.electron}

const log = require('electron-log')
const { dialog } = require('electron')
const fs = require('fs')
const cp = require('child_process')

var processes = []
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  // env.DB_PROCESS_PATH = path.resolve(env.LOCALAPPDATA, Configs.DB_PATH)
} else {
  // env.DB_PROCESS_PATH = path.join(__dirname, 'database')
}

// Call interface server
// "nsis": {
//   "runAfterFinish": false
// }

// var interfaceProcess = cp.spawn('cmd', ['/c', 'start', '""', Configs.INTERFACE_FILE_NM], {cwd: Configs.INTERFACE_PATH})
var interfaceProcess = cp.spawn('cmd', ['/c', 'start', '""', Configs.INTERFACE_FILE_NM], {cwd: Configs.INTERFACE_PATH})
interfaceProcess.stdout.on('data', function(data) {
  log.info('stdout: ' + data)
})
interfaceProcess.stderr.on('data', function(data) {
  log.info('stderr: ' + data)
})
interfaceProcess.on('exit', function(data) {
  log.info('exit interfaceProcess : ' + data)
  // processes.splice(processes.indexOf(interfaceProcess), 1)
})

processes.push(interfaceProcess)

// 삼광 lis 모듈 로드
fs.access(Configs.SKMC_LIS_PATH, fs.constants.F_OK, function(err) {
  log.info('skmc lis : ' + err)
  if (!err) {
    var jarProcess = cp.exec('javaw -jar ' + Configs.SKMC_LIS_PATH, {}, function() {
      log.info('load lis jar')
    })

    processes.push(jarProcess)
  }
})

/** Sqlite3 */
// const sqlite3 = require('sqlite3').verbose()
// const sqliteChild = cp.fork(env.DB_PROCESS_PATH, [], {env: env})
//
// processes.push(sqliteChild)
//
// sqliteChild.on('message', function(message) {
//   try {
//     log.info('[on message] : ' + message.msg)
//     if (message.msg.includes('FAILED')) {
//       log.info(message.msg)
//     } else {
//       if (message.msg === 'SELECT_ALL_SUCCESS' || message.msg === 'SELECT_SUCCESS') {
//         log.info(message.succMsg)
//         mainWindow.webContents.send(message.succMsg, message.rows)
//       } else if (message.msg === 'INSERT_SUCCESS') {
//         log.info(message.succMsg)
//
//       } else if (message.msg === 'UPDATE_SUCCESS') {
//         log.info(message.succMsg)
//         log.info(message.rows)
//         if (message.succMsg === Constant.UPDATE_RBC_CLASSIFICATION ||
//             message.succMsg === Constant.SET_WBC_CUSTOM_LIST ||
//             message.succMsg === Constant.UPDATE_RBC_DEGREE ||
//             message.succMsg === Constant.UPDATE_NORMAL_RANGE ||
//             message.succMsg === Constant.UPDATE_RBC_CLASSIFICATION_SKMC) {
//           mainWindow.webContents.send(message.succMsg, message.rows)
//         }
//       } else if (message.msg === 'INIT_SUCCESS') {
//         addColumn()
//         insertSettings()
//       }
//     }
//   } catch (e) {
//     log.info(e)
//   }
// })

// sqliteChild.on('close', function() {
//   log.info('child close')
//
//   app.quit()
//   app.exit()
// })

// sqliteChild.on('close', function() {
//   log.info('child close')
//
//   app.quit()
//   app.exit()
// })

// sqliteChild.on('disconnect', function() {
//   log.info('disconnect')
// })
//
// sqliteChild.on('exit', function(code, signal) {
//   log.info('exit sqliteChild : ' + code + ':' + signal)
// })

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

/**
 * prototype
 */
Array.prototype.division = function (n) {
  var arr = this
  var len = arr.length
  var cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0)
  var tmp = []

  for (var i = 0; i < cnt; i++) {
    tmp.push(arr.splice(0, n))
  }

  return tmp
}

/**
 * Add column
 */
async function addColumn () {

}

/**
 * Default settings
 */
 async function insertSettings () {
   MySql.INSERT(query.INSERT_COMMON_CODE_GRP).then(function(ret) {
     log.info(ret)
   }).catch(function(err) {
     log.info(err)
   })

   MySql.INSERT(query.INSERT_COMMON_CODE).then(function(ret) {
     log.info(ret)
   }).catch(function(err) {
     log.info(err)
   })

   MySql.INSERT(query.INSERT_DEFAULT_HOT_KEY).then(function(ret) {
     log.info(ret)
   }).catch(function(err) {
     log.info(err)
   })

   MySql.INSERT(query.INSERT_WBC_CUSTOM_CLASS).then(function(ret) {
     log.info(ret)
   }).catch(function(err) {
     log.info(err)
   })

   MySql.INSERT(query.INSERT_DEFAULT_RBC_DEGREE).then(function(ret) {
     log.info(ret)
   }).catch(function(err) {
     log.info(err)
   })

   MySql.INSERT(query.INSERT_DEFAULT_NORMAL_RANAGE).then(function(ret) {
     log.info(ret)
   }).catch(function(err) {
     log.info(err)
   })

   MySql.INSERT(query.INSERT_DEFAULT_CLASS_ORDER).then(function(ret) {
     log.info(ret)
   }).catch(function(err) {
     log.info(err)
   })

   // sqliteChild.send({msg: 'INSERT', sql: query.INSERT_COMMON_CODE_GRP})
   // sqliteChild.send({msg: 'INSERT', sql: query.INSERT_COMMON_CODE})
   // sqliteChild.send({msg: 'INSERT', sql: query.INSERT_DEFAULT_HOT_KEY})
   // sqliteChild.send({msg: 'INSERT', sql: query.INSERT_WBC_CUSTOM_CLASS})
   // sqliteChild.send({msg: 'INSERT', sql: query.INSERT_DEFAULT_RBC_DEGREE})
   // sqliteChild.send({msg: 'INSERT', sql: query.INSERT_DEFAULT_NORMAL_RANAGE})
   // sqliteChild.send({msg: 'INSERT', sql: query.INSERT_DEFAULT_CLASS_ORDER})
 }

/**
 * Initial window options
 */
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    useContentSize: true,
    frame: false,
    resizable: false,
    webPreferences: {
      webSecurity: false,
      nativeWindowOpen: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
    // icon: '~@/assets/icons/icon.png'
  })

  mainWindow.loadURL(winURL)
  mainWindow.setMenuBarVisibility(false)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // white screen reload
  mainWindow.webContents.on('render-process-gone', function (event, detailed) {
    log.info("!crashed, reason: " + detailed.reason + ", exitCode = " + detailed.exitCode)
    if (detailed.reason == "crashed") {
      // relaunch app
      app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
      app.exit(0)
    }
  })
}

/**
 * insert wbc classification
 */
// function insertWbcClassification(payload) {
//   var params = JSON.parse(payload)
//   var tmpQuery = query.INSERT_WBC_CLASSIFICATION_ALL
//   var userInput = ''
//   var insertArgs = []
//
//   log.info(params)
//
//   if (params.wbcInfo.length > 0) {
//     params.wbcInfo.forEach(function(wbcItem, index) {
//       userInput += '(?,?,?,?,?,?,?,?,?,?)'
//       if (index + 1 < params.wbcInfo.length) {
//         userInput += ', '
//       }
//
//       insertArgs.push(params.cassetId)
//       insertArgs.push(params.slotId)
//       insertArgs.push(wbcItem.id)
//       insertArgs.push(wbcItem.name)
//       insertArgs.push(wbcItem.title)
//       insertArgs.push(wbcItem.count)
//       insertArgs.push(getDateTime())
//       insertArgs.push(params.userId)
//       insertArgs.push(getDateTime())
//       insertArgs.push(params.userId)
//
//     })
//
//     if (userInput !== '') {
//       tmpQuery = tmpQuery.replace('userInput', userInput)
//       sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
//     }
//   }
// }

/**
 * insert wbc classification hist
 */
// function insertWbcClassificationHist(payload) {
//   var params = JSON.parse(payload)
//   var tmpQuery = query.INSERT_WBC_CLASSIFICATION_HIST
//   var userInput = ''
//   var insertArgs = []
//
//   log.info(params)
//
//   if (params.wbcInfo.length > 0) {
//     params.wbcInfo.forEach(function(wbcItem, index) {
//       userInput += '(?,?,?,?,?,?,?,?,?,?)'
//       if (index + 1 < params.wbcInfo.length) {
//         userInput += ', '
//       }
//
//       insertArgs.push(params.cassetId)
//       insertArgs.push(params.slotId)
//       insertArgs.push(wbcItem.id)
//       insertArgs.push(wbcItem.name)
//       insertArgs.push(wbcItem.title)
//       insertArgs.push(wbcItem.count)
//       insertArgs.push(getDateTime())
//       insertArgs.push(params.userId)
//       insertArgs.push(getDateTime())
//       insertArgs.push(params.userId)
//
//     })
//
//     if (userInput !== '') {
//       tmpQuery = tmpQuery.replace('userInput', userInput)
//       sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
//     }
//   }
// }

/**
 * update normal cell
 */
// function updateIsNormalCell(payload) {
//   var params = JSON.parse(payload)
//   var args = []
//
//   args.push(params.isNormal)
//   args.push(params.slotId)
//
//   MySql.UPDATE(query.UPDATE_IS_NORMAL_CELL, args).then(function(ret) {
//     log.info(ret)
//   }).catch(function(err) {
//     log.info(err)
//   })
//
//   // sqliteChild.send({msg: 'UPDATE', sql: query.UPDATE_IS_NORMAL_CELL, args: updateArgs})
// }

/**
 * update wbc image class
 */
function updateWbcImages(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.UPDATE_WBC_IMAGES_HIST
  var userInput = ''
  var updateArgs = []
  var tmpArray = []

  if (params.wbcInfo.length > 0) {
    // sqliteChild.send({msg: 'BEGIN'})

    params.wbcInfo.forEach(function(wbcItem, index) {

      // 파라메터 50개씩 분할 (sqlite max params 100)
      if (wbcItem.images !== null && typeof(wbcItem.images) !== 'undefined') {
        var divArray = wbcItem.images.division(50)
        divArray.forEach(function (divItem) {
          userInput = ''
          updateArgs = []

          updateArgs.push(wbcItem.id)
          updateArgs.push(params.cassetId)
          updateArgs.push(params.slotId)

          divItem.forEach(function(image, index) {
            userInput += 'FILE_NM = ' + '\'' + image + '\''
            if (index < (divItem.length - 1)) {
              userInput += ' OR '
            }
          })

          if (userInput !== '') {
            tmpQuery = query.UPDATE_WBC_IMAGES_HIST
            tmpQuery = tmpQuery.replace('userInput', userInput)

            var isCommit = 'N'
            if (index + 1 === params.wbcInfo.length) {
              isCommit = 'Y'
            }

            sqliteChild.send({msg: 'UPDATE', succMsg: 'UPDATE_WBC_IMAGES', sql: tmpQuery, args: updateArgs, isCommit: isCommit})
          }
        })
      }
    })
  }
}

/**
 * insert wbc images
 */
// function insertWbcImages(payload) {
//   var params = JSON.parse(payload)
//   var tmpQuery = query.INSERT_WBC_IMAGES_HIST
//   var userInput = ''
//   var insertArgs = []
//
//   log.info(params)
//
//   if (params.wbcInfo.length > 0) {
//     params.wbcInfo.forEach(function(wbcItem, index) {
//
//       // 파라메터 50개씩 분할 (sqlite max params 100)
//       if (wbcItem.images !== null && typeof(wbcItem.images) !== 'undefined') {
//         var divArray = wbcItem.images.division(50)
//         divArray.forEach(function (divItem) {
//           userInput = ''
//           insertArgs = []
//
//           divItem.forEach(function(image, index) {
//             userInput += '(?,?,?,?,?,?,?,?,?)'
//             if (index + 1 < divItem.length) {
//               userInput += ', '
//             }
//
//             insertArgs.push(params.cassetId)
//             insertArgs.push(params.slotId)
//             insertArgs.push(wbcItem.id)
//             insertArgs.push(image.fileName)
//             insertArgs.push(wbcItem.id)
//             insertArgs.push(getDateTime())
//             insertArgs.push(params.userId)
//             insertArgs.push(getDateTime())
//             insertArgs.push(params.userId)
//           })
//
//           if (userInput !== '') {
//             tmpQuery = query.INSERT_WBC_IMAGES_HIST
//             tmpQuery = tmpQuery.replace('userInput', userInput)
//             sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
//           }
//         })
//       }
//     })
//   }
// }

/**
 * insert rbc classification
 */
function insertRbcClassification(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.INSERT_RBC_CLASSIFICATION
  var userInput = ''
  var insertArgs = []

  log.info(params)

  params.rbcInfo.forEach(function (rbcItem, rbcIndex) {
    rbcItem.classInfo.forEach(function (classItem, classIndex) {
      userInput += '(?,?,?,?,?,?,?,?,?,?)'
      if (classIndex + 1 < rbcItem.classInfo.length) {
        userInput += ', '
      }

      insertArgs.push(params.cassetId)
      insertArgs.push(params.slotId)
      insertArgs.push(rbcItem.categoryId)
      insertArgs.push(classItem.classId)
      insertArgs.push(classItem.classNm)
      insertArgs.push(classItem.degree)
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)
    })

    if (rbcIndex + 1 < params.rbcInfo.length) {
      userInput += ', '
    }
  })

  if (userInput !== '') {
    tmpQuery = tmpQuery.replace('userInput', userInput)
    sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
  }
}

// function insertRbcClassificationHist(payload) {
//   var params = JSON.parse(payload)
//   var tmpQuery = query.INSERT_RBC_CLASSIFICATION_HIST
//   var userInput = ''
//   var insertArgs = []
//
//   log.info(params)
//
//   params.rbcInfo.forEach(function (rbcItem, rbcIndex) {
//     rbcItem.classInfo.forEach(function (classItem, classIndex) {
//       userInput += '(?,?,?,?,?,?,?,?,?,?)'
//       if (classIndex + 1 < rbcItem.classInfo.length) {
//         userInput += ', '
//       }
//
//       insertArgs.push(params.cassetId)
//       insertArgs.push(params.slotId)
//       insertArgs.push(rbcItem.categoryId)
//       insertArgs.push(classItem.classId)
//       insertArgs.push(classItem.classNm)
//       insertArgs.push(classItem.degree)
//       insertArgs.push(getDateTime())
//       insertArgs.push(params.userId)
//       insertArgs.push(getDateTime())
//       insertArgs.push(params.userId)
//     })
//
//     if (rbcIndex + 1 < params.rbcInfo.length) {
//       userInput += ', '
//     }
//   })
//
//   if (userInput !== '') {
//     tmpQuery = tmpQuery.replace('userInput', userInput)
//     sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
//   }
// }

/**
 * insert rbc category
 */
// function insertRbcCategories(payload) {
//   var params = JSON.parse(payload)
//   var tmpQuery = query.INSERT_RBC_CATEGORYES
//   var userInput = ''
//   var insertArgs = []
//
//   log.info(params)
//
//   if (params.rbcInfo.length > 0) {
//     params.rbcInfo.forEach(function(rbcItem, index) {
//       userInput += '(?,?,?,?,?,?,?,?)'
//       if (index + 1 < params.rbcInfo.length) {
//         userInput += ', '
//       }
//
//       insertArgs.push(params.cassetId)
//       insertArgs.push(params.slotId)
//       insertArgs.push(rbcItem.categoryId)
//       insertArgs.push(rbcItem.categoryNm)
//       insertArgs.push(getDateTime())
//       insertArgs.push(params.userId)
//       insertArgs.push(getDateTime())
//       insertArgs.push(params.userId)
//     })
//
//     if (userInput !== '') {
//       tmpQuery = tmpQuery.replace('userInput', userInput)
//       sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
//     }
//   }
// }

// function insertWholeSlidePath(payload) {
//   var params = JSON.parse(payload)
//   var args = []
//   var userInput = ''
//   var tmpQuery = query.INSERT_BF_WHOLE_SLIDE_PATH
//
//   if (params.lowPowerPath !== null && typeof(params.lowPowerPath) !== 'undefined') {
//     params.lowPowerPath.forEach(function (item, index) {
//       userInput += '(?,?,?,?,?,?,?,?,?)'
//       if (index + 1 < params.lowPowerPath.length) {
//         userInput += ', '
//       }
//       args.push(params.cassetId)
//       args.push(params.slotId)
//       args.push(item.seqNo)
//       args.push(item.path)
//       args.push(item.isHighPowerScan)
//       args.push(getDateTime())
//       args.push(params.userId)
//       args.push(getDateTime())
//       args.push(params.userId)
//     })
//
//     if (userInput !== '') {
//       tmpQuery = tmpQuery.replace('userInput', userInput)
//       sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: args})
//     }
//   }
// }

function getDateTime() {
  var now = new Date()
  var year = "" + now.getFullYear()
  var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
  var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
  var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
  var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
  var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }

  return year + month + day + hour + minute + second
}

/**
 * create progressbar window
 */
function createProgressBar() {
  progressBar = new ProgressBar({
    text: 'Preparing data...',
    detail: 'Wait...'
  })

  progressBar.on('completed', function() {
    log.info(`completed...`)
    progressBar.detail = 'Task completed. Exiting...'
  })

  progressBar.on('aborted', function() {
    log.info(`aborted...`)
  })
}

// single instance lock 요청
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    log.info('second-instance')
    log.info(mainWindow)

    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        log.info('isMinimized')
        mainWindow.restore()
      } else if (!mainWindow.isVisible()) {
        log.info('show')
        mainWindow.show()
      }
      mainWindow.focus()
    }
  })
}

/**
 * [ELECTRON EVENTS START]
 */
app.on('will-finish-launching', () => {
  log.info('will-finish-launching')
  processes.forEach(function(proc) {
    log.info('proc - ' + proc.pid)
  })
})

app.on('ready', () => {
  log.info('---- electron ready ----')
  log.info(path.join(__dirname, '../globalEnv.env'))
  log.info(`file://${__dirname}/index.html`)
  // log.info(env.LOCALAPPDATA)
  // 메인 윈도우 생성
  createWindow()
  updateCheck()

  // if (process.env.NODE_ENV !== 'production') {
  //   autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml')
  // }
  // else {
  //   if (fs.existsSync(Configs.DB_BACKUP_PATH)) {
  //     // 백업db 복구
  //     fs.copyFileSync(Configs.DB_BACKUP_PATH, Configs.DB_FILE_NAME)
  //
  //     // 파일 삭제
  //     fs.unlinkSync(Configs.DB_BACKUP_PATH)
  //   }
  // }
  // autoUpdater.checkForUpdatesAndNotify()
})

app.on('window-all-closed', () => {
  log.info('window-all-closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', () => {
  cp.exec('taskkill /im ' + Configs.INTERFACE_FILE_NM + ' /f')
  cp.exec('taskkill /im ' + 'jqs.exe' + ' /f')
  cp.exec('taskkill /im ' + 'javaw.exe' + ' /f')
  cp.exec('taskkill /im ' + 'java.exe' + ' /f')

  processes.forEach(function(proc) {
    log.info('kill - ' + os.platform() + ':' + proc.pid)
    proc.kill()
  })
})

app.on('uncaughtException', (err) => {
  log.log(err)
})
// [ELECTRON EVENTS END]


/**
* [IPC RECEIVER START]
*/
// const net = require('net')
// var client = null
//
// function initConnToServer () {
//   log.info('initConnToServer')
//
//   if (!client) {
//     client = new net.Socket()
//     client.on('data', (chunck) => {
//       try {
//         log.info(chunck)
//       } catch (e) {
//         log.info('onDataError', e.message)
//       }
//     })
//     log.info('new connnnnnn')
//     if (!client.connecting) {
//       client.connect(11235, 'localhost')
//     }
//   }
//
//   log.info(client.connecting)
//   log.info(client.destroyed)
//   if (client.destroyed) {
//     client.connect(11235, 'localhost')
//   }
//
//   return client
// }
//
// ipcMain.on('SOCKET_TEST', (event, payload) => {
//   log.info(payload)
//
//   var client = initConnToServer()
//   log.info(client)
//
//   client.write(payload)
//
// })

ipcMain.on('SHUTDOWN', (event, payload) => {
  log.info('SHUTDOWN')

  app.quit()
  app.exit()
  // sqliteChild.send({msg: 'SHUTDOWN'})
})

// select folder
ipcMain.on('open-file-dialog-for-dir', async (event, pathType) => {
  const dir = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (dir) {
    var params = {
      path: dir[0],
      pathType: pathType
    }
    event.sender.send("selected-dir", params)
  }
})

// select db file
ipcMain.on('open-file-dialog-restore', async (event, pathType) => {
  const file = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'json', extension: ['json'] }
    ]
  })
  if (file) {
    // fs.copyFileSync(file[0], Configs.DB_FILE_NAME)
    event.sender.send("file-select", file)
  }
})

// save file
ipcMain.on('open-save-dialog', async (event, pathType) => {
  // dialog.showSaveDialog({}, (filename) => {
  //   if (filename) {
  //     log.info(filename)
  //     fs.copyFileSync(Configs.DB_FILE_NAME, filename + '.db')
  //     event.sender.send("backup-success", null)
  //   }
  // })
})

// 영상 이동시 insert replace 처리
ipcMain.on(Constant.INSERT_WBC_CLASSIFICATION, (event, payload) => {
  var params = JSON.parse(payload)

  MySql.UPDATE_CLASSIFICATION(params).then(function(ret) {
    log.info(ret)
  }).catch(function(err) {
    log.info(err)
  })

})

// 분석 결과 저장
ipcMain.on(Constant.SET_CLASSIFICATION, (event, payload) => {
  var params = JSON.parse(payload)

  // 분석 결과 저장
  MySql.INSERT_CLASSIFICATION(params).then(function(ret) {
    log.info('INSERT_CLASSIFICATION : ' + JSON.stringify(ret))
  }).catch(function(err) {
    log.info(err)
  })
})

// LIS----
ipcMain.on(Constant.SELECT_LIS_CODE, (event, payload) => {
  MySql.SELECT(query.SELECT_LIS_CODE).then(function(ret) {
    event.sender.send(Constant.SELECT_LIS_CODE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_LIS_CODE, null, err)
  })
})

ipcMain.on(Constant.SELECT_LIS_CODE_INHA, (event, payload) => {
  MySql.SELECT(query.SELECT_LIS_CODE).then(function(ret) {
    event.sender.send(Constant.SELECT_LIS_CODE_INHA, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_LIS_CODE_INHA, null, err)
  })
})

ipcMain.on(Constant.SELECT_LIS_CODE_RBC, (event, payload) => {
  MySql.SELECT(query.SELECT_LIS_CODE_RBC).then(function(ret) {
    event.sender.send(Constant.SELECT_LIS_CODE_RBC, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_LIS_CODE_RBC, null, err)
  })
})

ipcMain.on(Constant.SELECT_LIS_CODE_RBC_INHA, (event, payload) => {
  MySql.SELECT(query.SELECT_LIS_CODE_RBC).then(function(ret) {
    event.sender.send(Constant.SELECT_LIS_CODE_RBC_INHA, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_LIS_CODE_RBC_INHA, null, err)
  })
})

ipcMain.on(Constant.SELECT_WBC_RUNNING_COUNT, (event, payload) => {
  MySql.SELECT(query.SELECT_WBC_RUNNING_COUNT).then(function(ret) {
    event.sender.send(Constant.SELECT_WBC_RUNNING_COUNT, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_WBC_RUNNING_COUNT, null, err)
  })
})

ipcMain.on(Constant.UPDATE_LIS_CODE, (event, payload) => {
  var params = JSON.parse(payload)

  MySql.UPDATE_LIS_CODE(params).then(function(ret) {
    log.info(ret)
  }).catch(function(err) {
    log.info(err)
  })
})

ipcMain.on(Constant.GET_SKMC_RESULT_CD, (event, payload) => {
  MySql.SELECT(query.SELECT_SKMC_RESULT_CD).then(function(ret) {
    event.sender.send(Constant.GET_SKMC_RESULT_CD, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_SKMC_RESULT_CD, null, err)
  })
})

ipcMain.on(Constant.SET_SKMC_RESULT_CD, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.resultCd)
  args.push(params.resultCdNm)
  args.push(getDateTime())
  args.push(params.userId)
  args.push(getDateTime())
  args.push(params.userId)

  MySql.INSERT(query.INSERT_SKMC_RESULT_CD, args).then(function(ret) {
    event.sender.send(Constant.SET_SKMC_RESULT_CD, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SET_SKMC_RESULT_CD, null, err)
  })
})

ipcMain.on(Constant.REMOVE_SKMC_RESULT_CD, async (event, payload) => {
  try {
    var params = JSON.parse(payload)
    var args = []
    args.push(params.resultCd)

    await MySql.DELETE(query.DELETE_SKMC_RESULT_CD, args)
    await MySql.DELETE(query.DELETE_SKMC_FAVORITE_REMARK, args)
    await MySql.DELETE(query.DELETE_SKMC_FAVORITE_WBC, args)
    await MySql.DELETE(query.DELETE_SKMC_FAVORITE_RBC, args)
    await MySql.DELETE(query.DELETE_SKMC_FAVORITE_PLT, args)

    event.sender.send(Constant.REMOVE_SKMC_RESULT_CD, null, null)

  } catch (err) {
    event.sender.send(Constant.REMOVE_SKMC_RESULT_CD, null, err)
  }
})

ipcMain.on(Constant.GET_SKMC_REMARK, (event, payload) => {
  MySql.SELECT(query.SELECT_REMARK).then(function(ret) {
    event.sender.send(Constant.GET_SKMC_REMARK, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_SKMC_REMARK, null, err)
  })
})

ipcMain.on(Constant.SET_SKMC_REMARK, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.remarkCd)
  args.push(params.remarkContents)
  args.push(getDateTime())
  args.push(params.userId)
  args.push(getDateTime())
  args.push(params.userId)

  MySql.INSERT(query.INSERT_REMARK, args).then(function(ret) {
    event.sender.send(Constant.SET_SKMC_REMARK, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SET_SKMC_REMARK, null, err)
  })
})

ipcMain.on(Constant.REMOVE_SKMC_REMARK, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.remarkCd)

  MySql.DELETE(query.DELETE_REMARK, args).then(function(ret) {
    event.sender.send(Constant.REMOVE_SKMC_REMARK, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.REMOVE_SKMC_REMARK, null, err)
  })
})

ipcMain.on(Constant.SET_SKMC_FAVORITE, async (event, payload) => {
  var params = JSON.parse(payload)
  var rbcArgs = []
  var wbcArgs = []
  var pltArgs = []

  try {
    // RBC
    rbcArgs.push(params.resultCd)
    rbcArgs.push(params.rbcSize)
    rbcArgs.push(params.rbcChromia)
    rbcArgs.push(params.anisocytosis)
    rbcArgs.push(params.poikilocytosis)
    rbcArgs.push(params.elliptocyte)
    rbcArgs.push(params.buurCell)
    rbcArgs.push(params.targetCell)
    rbcArgs.push(params.spherocyte)
    rbcArgs.push(params.schistocyte)
    rbcArgs.push(params.dimorphism)
    rbcArgs.push(params.rouleaux)
    rbcArgs.push(params.polychromasia)
    rbcArgs.push(params.baso)
    rbcArgs.push(params.hjBody)
    rbcArgs.push(params.nucleatedRbc)
    rbcArgs.push(params.rbcOthers)
    rbcArgs.push(getDateTime())
    rbcArgs.push(params.userId)
    rbcArgs.push(getDateTime())
    rbcArgs.push(params.userId)
    // duplicate key
    rbcArgs.push(params.rbcSize)
    rbcArgs.push(params.rbcChromia)
    rbcArgs.push(params.anisocytosis)
    rbcArgs.push(params.poikilocytosis)
    rbcArgs.push(params.elliptocyte)
    rbcArgs.push(params.buurCell)
    rbcArgs.push(params.targetCell)
    rbcArgs.push(params.spherocyte)
    rbcArgs.push(params.schistocyte)
    rbcArgs.push(params.dimorphism)
    rbcArgs.push(params.rouleaux)
    rbcArgs.push(params.polychromasia)
    rbcArgs.push(params.baso)
    rbcArgs.push(params.hjBody)
    rbcArgs.push(params.nucleatedRbc)
    rbcArgs.push(params.rbcOthers)
    rbcArgs.push(getDateTime())
    rbcArgs.push(params.userId)

    await MySql.INSERT(query.INSERT_SKMC_RESULT_FAVORITE_RBC, rbcArgs)

    // WBC
    wbcArgs.push(params.resultCd)
    wbcArgs.push(params.wbcNumber)
    wbcArgs.push(params.wbcTocxicgranule)
    wbcArgs.push(params.wbcTocxicVacuole)
    wbcArgs.push(params.wbcDohleBody)
    wbcArgs.push(params.wbcLsMaturation)
    wbcArgs.push(params.nSegmentation)
    wbcArgs.push(params.wbcOthers)
    wbcArgs.push(getDateTime())
    wbcArgs.push(params.userId)
    wbcArgs.push(getDateTime())
    wbcArgs.push(params.userId)
    // duplicate key
    wbcArgs.push(params.wbcNumber)
    wbcArgs.push(params.wbcTocxicgranule)
    wbcArgs.push(params.wbcTocxicVacuole)
    wbcArgs.push(params.wbcDohleBody)
    wbcArgs.push(params.wbcLsMaturation)
    wbcArgs.push(params.nSegmentation)
    wbcArgs.push(params.wbcOthers)
    wbcArgs.push(getDateTime())
    wbcArgs.push(params.userId)

    await MySql.INSERT(query.INSERT_SKMC_RESULT_FAVORITE_WBC, wbcArgs)

    // PLT
    pltArgs.push(params.resultCd)
    pltArgs.push(params.plateletNumber)
    pltArgs.push(params.plateletSize)
    pltArgs.push(params.clumping)
    pltArgs.push(getDateTime())
    pltArgs.push(params.userId)
    pltArgs.push(getDateTime())
    pltArgs.push(params.userId)
    // duplicate
    pltArgs.push(params.plateletNumber)
    pltArgs.push(params.plateletSize)
    pltArgs.push(params.clumping)
    pltArgs.push(getDateTime())
    pltArgs.push(params.userId)

    await MySql.INSERT(query.INSERT_SKMC_RESULT_FAVORITE_PLT, pltArgs)

    // Remark
    var deleteArgs = []
    deleteArgs.push(params.resultCd)

    await MySql.DELETE(query.DELETE_SKMC_FAVORITE_REMARK, deleteArgs)

    if (params.remark) {
      params.remark.forEach(async function(item, index) {
        var remarkArgs = []
        remarkArgs.push(params.resultCd)
        remarkArgs.push(item.remarkCd)
        remarkArgs.push(index)
        remarkArgs.push(item.text)
        remarkArgs.push(getDateTime())
        remarkArgs.push(params.userId)
        remarkArgs.push(getDateTime())
        remarkArgs.push(params.userId)
        // duplicate
        remarkArgs.push(item.remarkCd)
        remarkArgs.push(index)
        remarkArgs.push(item.text)
        remarkArgs.push(getDateTime())
        remarkArgs.push(params.userId)

        await MySql.INSERT(query.INSERT_SKMC_FAVORITE_REMARK, remarkArgs)
      })
    }

    event.sender.send(Constant.SET_SKMC_FAVORITE, null, null)

  } catch (err) {
    event.sender.send(Constant.SET_SKMC_FAVORITE, null, err)
  }
})

ipcMain.on(Constant.GET_SKMC_FAVORITE, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.resultCd)
  args.push(params.resultCd)

  MySql.SELECT_ONE(query.SELECT_SKMC_FAVORITE, args).then(function(ret) {
    event.sender.send(Constant.GET_SKMC_FAVORITE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_SKMC_FAVORITE, null, err)
  })
})

ipcMain.on(Constant.GET_TEST_BARCODES, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  MySql.SELECT(query.SELECT_TEST_BARCODES, args).then(function(ret) {
    event.sender.send(Constant.GET_TEST_BARCODES, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_TEST_BARCODES, null, err)
  })
})

// CBC----
ipcMain.on(Constant.SELECT_CBC_CODE, (event, payload) => {
  MySql.SELECT(query.SELECT_CBC_CODE).then(function(ret) {
    event.sender.send(Constant.SELECT_CBC_CODE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_CBC_CODE, null, err)
  })
})

ipcMain.on(Constant.SELECT_CBC_CODE_INHA, (event, payload) => {
  MySql.SELECT(query.SELECT_CBC_CODE).then(function(ret) {
    event.sender.send(Constant.SELECT_CBC_CODE_INHA, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_CBC_CODE_INHA, null, err)
  })
})

ipcMain.on(Constant.UPDATE_CBC_CODE, (event, payload) => {
  var params = JSON.parse(payload)

  log.info(params.codeList)
  params.codeList.forEach(function(item, index) {
    if (typeof(item.testCd) !== 'undefined') {
      var args = []

      args.push(item.cd)
      args.push(item.testCd.trim())
      args.push(item.testNm)
      args.push(item.isSelected)
      args.push(getDateTime())
      args.push(params.userId)
      args.push(getDateTime())
      args.push(params.userId)

      MySql.INSERT(query.INSERT_CBC_CODE, args).then(function(ret) {
        event.sender.send(Constant.UPDATE_CBC_CODE, ret, null)
      }).catch(function(err) {
        event.sender.send(Constant.UPDATE_CBC_CODE, null, err)
      })
    }
  })
})

// lis connection path
ipcMain.on(Constant.SELECT_LIS_CONN_PATH, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.deviceBarcode)

  MySql.SELECT_ONE(query.SELECT_LIS_CONN_PATH, args).then(function(ret) {
    event.sender.send(Constant.SELECT_LIS_CONN_PATH, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_LIS_CONN_PATH, null, err)
  })
})

ipcMain.on(Constant.SELECT_LIS_CONN_PATH_INHA, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.deviceBarcode)

  MySql.SELECT_ONE(query.SELECT_LIS_CONN_PATH, args).then(function(ret) {
    event.sender.send(Constant.SELECT_LIS_CONN_PATH_INHA, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_LIS_CONN_PATH_INHA, null, err)
  })
})

ipcMain.on(Constant.UPDATE_LIS_CONN_PATH, (event, payload) => {
  var params = JSON.parse(payload)
  var insertHistArgs = []

  insertHistArgs.push(params.deviceBarcode)
  insertHistArgs.push(params.lisFilePath.trim())
  insertHistArgs.push(params.lisUrl.trim())
  insertHistArgs.push(params.lisTypeCd)
  insertHistArgs.push(params.cbcFilePath)
  insertHistArgs.push(params.cbcUrl)
  insertHistArgs.push(params.cbcTypeCd)
  insertHistArgs.push(getDateTime())
  insertHistArgs.push(params.userId)
  insertHistArgs.push(getDateTime())
  insertHistArgs.push(params.userId)

  MySql.INSERT(query.UPDATE_LIS_CONN_PATH, insertHistArgs).then(function(ret) {
    event.sender.send(Constant.UPDATE_LIS_CONN_PATH, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_LIS_CONN_PATH, null, err)
  })
})

ipcMain.on(Constant.UPDATE_CHECKED_CELL, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.isChecked)
  args.push(params.slotId)

  MySql.UPDATE(query.UPDATE_IS_CHECKED_CELL, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_CHECKED_CELL, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_CHECKED_CELL, null, err)
  })
})

ipcMain.on(Constant.SET_LOCK_SLIDE, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.cassetId)
  args.push(params.slotId)
  args.push(params.userId)
  args.push(params.machineId)
  args.push(params.hostIp)
  args.push(params.localIp)
  args.push(params.lockState)
  args.push(getDateTime())
  args.push(getDateTime())
  args.push(params.userId)
  args.push(getDateTime())
  args.push(params.userId)

  //update
  args.push(params.lockState)
  args.push(params.userId)


  MySql.INSERT(query.INSERT_VIEWER_LOCK, args).then(function(ret) {
    event.sender.send(Constant.SET_LOCK_SLIDE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SET_LOCK_SLIDE, null, err)
  })
})

// 테스트 결과 저장
ipcMain.on(Constant.SET_TEST_HISTORY, (event, payload) => {
  var params = JSON.parse(payload)
  var cassetId = params.cassetId
  var userId = params.userId

  var insertHistArgs = []
  insertHistArgs.push(cassetId)
  insertHistArgs.push(params.slotId)
  insertHistArgs.push(params.slotNo)
  insertHistArgs.push(params.barcodeNo.replace(/ /g, ''))
  insertHistArgs.push(params.patientId)
  insertHistArgs.push(params.patientNm)
  insertHistArgs.push(params.orderDttm)
  insertHistArgs.push(params.stateCd)
  insertHistArgs.push(params.malariaCount)
  insertHistArgs.push(params.pltCount)
  insertHistArgs.push(params.analyzedDttm)
  insertHistArgs.push(params.birthDay)
  insertHistArgs.push(params.gender)
  insertHistArgs.push(params.testType)
  insertHistArgs.push('Ready')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push(params.maxWbcCount)
  insertHistArgs.push(params.maxRbcCount)
  insertHistArgs.push(params.slotId)
  insertHistArgs.push(params.tactTime)
  insertHistArgs.push(params.isNsNbIntegration)
  insertHistArgs.push(params.isNormal)
  insertHistArgs.push('N')
  insertHistArgs.push(getDateTime())
  insertHistArgs.push(userId)
  insertHistArgs.push(getDateTime())
  insertHistArgs.push(userId)

  // duplicate key update
  insertHistArgs.push(params.slotNo)
  insertHistArgs.push(params.barcodeNo.replace(/ /g, ''))
  insertHistArgs.push(params.patientId)
  insertHistArgs.push(params.patientNm)
  insertHistArgs.push(params.orderDttm)
  insertHistArgs.push(params.stateCd)
  insertHistArgs.push(params.malariaCount)
  insertHistArgs.push(params.pltCount)
  insertHistArgs.push(params.analyzedDttm)
  insertHistArgs.push(params.birthDay)
  insertHistArgs.push(params.gender)
  insertHistArgs.push(params.testType)
  insertHistArgs.push('Ready')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push(params.maxWbcCount)
  insertHistArgs.push(params.maxRbcCount)
  insertHistArgs.push(params.slotId)
  insertHistArgs.push(params.tactTime)
  insertHistArgs.push(params.isNsNbIntegration)
  insertHistArgs.push(params.isNormal)
  insertHistArgs.push('N')
  insertHistArgs.push(getDateTime())
  insertHistArgs.push(userId)

  MySql.INSERT(query.INSERT_TEST_HISTORY, insertHistArgs).then(function(ret) {
    event.sender.send(Constant.SET_TEST_HISTORY, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SET_TEST_HISTORY, null, err)
  })
})

// image path update
ipcMain.on(Constant.UPDATE_IMAGE_HIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.destClassId)
  args.push(params.cassetId)
  args.push(params.slotId)
  args.push(params.fileName)

  MySql.UPDATE(query.UPDATE_IMAGE_HIST, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_IMAGE_HIST, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_IMAGE_HIST, null, err)
  })
})

ipcMain.on(Constant.UPDATE_WBC_COMMENT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.obj.wbcComment)
  args.push(params.obj.slotId)

  MySql.UPDATE(query.UPDATE_WBC_COMMENT, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_WBC_COMMENT, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_WBC_COMMENT, null, err)
  })
})

ipcMain.on(Constant.UPDATE_RBC_COMMENT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.obj.rbcComment)
  args.push(params.obj.slotId)

  MySql.UPDATE(query.UPDATE_RBC_COMMENT, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_RBC_COMMENT, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_RBC_COMMENT, null, err)
  })
})

ipcMain.on(Constant.UPDATE_RBC_CLASSIFICATION_SKMC, (event, payload) => {
  var paramsList = JSON.parse(payload)

  paramsList.forEach(function(item) {
    var args = []
    args.push(item.degree)
    args.push(item.cassetId)
    args.push(item.slotId)
    args.push(item.categoryId)
    args.push(item.classId)

    MySql.UPDATE(query.UPDATE_RBC_CLASSIFICATION_SKMC, args).then(function(ret) {
      log.info(ret)
    }).catch(function(err) {
      log.info(err)
    })
  })
})

ipcMain.on(Constant.UPDATE_RBC_CLASSIFICATION, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  log.info(params)
  args.push(params.degree)
  args.push(params.cassetId)
  args.push(params.slotId)
  args.push(params.categoryId)
  args.push(params.classId)

  MySql.UPDATE(query.UPDATE_RBC_CLASSIFICATION, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_RBC_CLASSIFICATION, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_RBC_CLASSIFICATION, null, err)
  })
})

ipcMain.on(Constant.ALL_TEST_HISTORY_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  var searchQuery = query.SEARCH_TEST_HISTORY_LIST_ALL

  args.push(Number(params.limit))

  if (params.jsonList !== null && params.jsonList.length > 0) {
    var tmpStr = ''

    params.jsonList.forEach(function(item, index) {
      tmpStr += `'` + item.SLOT_ID + `'`

      if ((params.jsonList.length - 1) !== (index)) {
        tmpStr += ','
      }
    })

    searchQuery += `\n AND TA.SLOT_ID IN (%s)`
    searchQuery = searchQuery.replace('%s', tmpStr)
  } else {
    if (params.searchText !== '') {
      if (params.searchType === '01') {
        searchQuery += '\n AND TA.PATIENT_ID LIKE ' + `'%` + params.searchText + `%'`
      } else if (params.searchType === '02') {
        searchQuery += '\n AND TA.BARCODE_NO LIKE ' + `'%` + params.searchText + `%'`
      } else if (params.searchType === '03') {
        searchQuery += '\n AND TA.PATIENT_NM LIKE ' + `'%` + params.searchText + `%'`
      }
    }

    if (params.startDate !== '' && params.endDate !== '') {
      searchQuery += `\n AND SUBSTR(TA.ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')`

      args.push(params.startDate)
      args.push(params.endDate)
    }

    if (Number(params.nrCount) > 0) {
      searchQuery += `\n AND TA.NR_COUNT <= ?`
      args.push(params.nrCount)
    }

    if (params.wbcClassList.length > 0) {
      var tmpStr = ''
      params.wbcClassList.forEach(function(value, index) {
        tmpStr += `'` + value + `'`

        if ((params.wbcClassList.length - 1) !== (index)) {
          tmpStr += ','
        }
      })

      searchQuery += `\n AND TA.SLOT_ID IN (SELECT IFNULL(MIN(SLOT_ID), 0) AS SLOT_ID
                                          FROM TB_WBC_CLASSIFICATION
                                         WHERE TA.CASSET_ID = CASSET_ID
                                           AND TA.SLOT_ID = SLOT_ID
                                           AND COUNT > 0
                                           AND CLASS_ID IN (%s)
                                          GROUP BY SLOT_ID)`
      searchQuery = searchQuery.replace('%s', tmpStr)
    }
  }

  if (params.wbcTotalSortCd === '01') {
    searchQuery += `\n ORDER BY TA.WBC_TOTAL DESC`
  } else if (params.wbcTotalSortCd === '02') {
    searchQuery += `\n ORDER BY TA.WBC_TOTAL ASC`
  } else {
    searchQuery += '\n ORDER BY TA.ANALYZE_DTTM DESC'
  }

  log.info(searchQuery)

  MySql.SELECT(searchQuery, args).then(function(ret) {
    event.sender.send(Constant.ALL_TEST_HISTORY_LIST, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.ALL_TEST_HISTORY_LIST, null, err)
  })
})

ipcMain.on(Constant.UPDATE_ORDER, (event, payload) => {
  var params = JSON.parse(payload)
  var testType = '01'

  if (params.testType !== '01' || params.testType !== '02') {
    testType = '02'
  }

  params.wbcClassList.forEach(function(wbcItem) {
    var args = []
    args.push(wbcItem.ORDER_NO)
    args.push(params.userId)
    args.push(wbcItem.CLASS_ID)
    args.push(testType)

    MySql.UPDATE(query.UPDATE_CLASS_ORDER, args).then(function(ret) {
      event.sender.send(Constant.UPDATE_ORDER, ret, null)
    }).catch(function(err) {
      event.sender.send(Constant.UPDATE_ORDER, null, err)
    })
  })
})

ipcMain.on(Constant.GET_WBC_COUNT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.cassetId)
  args.push(params.slotId)

  if (params.testType === '01' || params.testType === '04') {
    args.push('01')
  } else {
    args.push('02')
  }

  MySql.SELECT(query.SELECT_WBC_CLASSIFICATION_SLIDE, args).then(function(ret) {
    event.sender.send(Constant.GET_WBC_COUNT, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_WBC_COUNT, null, err)
  })
})

ipcMain.on(Constant.GET_TEST_HISTORY, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)

  MySql.SELECT_ONE(query.SELECT_TEST_HISTORY, args).then(function(ret) {
    log.info('GET_TEST_HISTORY : '  + ret)
    event.sender.send(Constant.GET_TEST_HISTORY, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_TEST_HISTORY, null, err)
  })
})

ipcMain.on(Constant.SELECT_EMP_NO, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.userId)

  MySql.SELECT_ONE(query.SELECT_EMP_NO, args).then(function(ret) {
    event.sender.send(Constant.SELECT_EMP_NO, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_EMP_NO, null, err)
  })
})

ipcMain.on(Constant.UPDATE_TEST_HISTORY, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.barcodeNo.replace(/ /g, ''))
  args.push(params.patientId)
  args.push(params.patientNm)
  args.push(getDateTime())
  args.push(params.userId)
  args.push(params.cassetId)
  args.push(params.slotId)

  MySql.UPDATE(query.UPDATE_TEST_HISTORY_PATIENT, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_TEST_HISTORY, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_TEST_HISTORY, null, err)
  })
})

ipcMain.on(Constant.DELETE_TEST_HISTORY, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  var userInput = ''
  var tmpQuery = query.DELETE_TEST_HISTORY

  params.forEach(function (item, index) {
    userInput += '?'
    if (index + 1 < params.length) {
      userInput += ', '
    }
    args.push(item.SLOT_ID)

    if (args.length > 900) {
      tmpQuery = tmpQuery.replace('userInput', userInput)
      sqliteChild.send({msg: 'DELETE', sql: tmpQuery, args: args})
      userInput = ''
      args = []
    }
  })

  tmpQuery = tmpQuery.replace('userInput', userInput)

  MySql.DELETE(tmpQuery, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_TEST_HISTORY, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_TEST_HISTORY, null, err)
  })
})

ipcMain.on(Constant.GET_RBC_COUNT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)
  args.push(params.slotId)

  MySql.SELECT(query.SELECT_RBC_CLASSIFICATION, args).then(function(ret) {
    event.sender.send(Constant.GET_RBC_COUNT, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_RBC_COUNT, null, err)
  })
})

ipcMain.on(Constant.GET_RBC_COUNT_INHA, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)
  args.push(params.slotId)

  MySql.SELECT(query.SELECT_RBC_CLASSIFICATION, args).then(function(ret) {
    event.sender.send(Constant.GET_RBC_COUNT_INHA, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_RBC_COUNT_INHA, null, err)
  })
})

ipcMain.on(Constant.GET_RBC_COUNT_SKMC, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)
  args.push(params.slotId)

  MySql.SELECT(query.SELECT_RBC_CLASSIFICATION, args).then(function(ret) {
    event.sender.send(Constant.GET_RBC_COUNT_SKMC, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_RBC_COUNT_SKMC, null, err)
  })
})

ipcMain.on(Constant.GET_RBC_COUNT_HIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)
  args.push(params.slotId)

  MySql.SELECT(query.SELECT_RBC_CLASSIFICATION_HIST, args).then(function(ret) {
    event.sender.send(Constant.GET_RBC_COUNT_HIST, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_RBC_COUNT_HIST, null, err)
  })
})

ipcMain.on(Constant.GET_WBC_HIST_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.cassetId)
  args.push(params.slotId)

  if (params.testType === '01' || params.testType === '04') {
    args.push('01')
  } else {
    args.push('02')
  }

  MySql.SELECT(query.SELECT_WBC_CLASSIFICATION_HIST, args).then(function(ret) {
    event.sender.send(Constant.GET_WBC_HIST_LIST, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_WBC_HIST_LIST, null, err)
  })
})

ipcMain.on(Constant.GET_WBC_MODIFY_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)

  MySql.SELECT(query.SELECT_WBC_MODIFY_LIST, args).then(function(ret) {
    event.sender.send(Constant.GET_WBC_MODIFY_LIST, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_WBC_MODIFY_LIST, null, err)
  })
})

ipcMain.on(Constant.GET_WBC_MODIFY_LIST_ALL, (event, payload) => {
  var params = JSON.parse(payload)
  var tmpQuery = query.SELECT_WBC_MODIFY_LIST_ALL
  var args = []
  var idStr = ''

  log.info(params)

  if (params !== null) {
    params.forEach(function(item, index) {
      idStr += `'` + item.SLOT_ID + `'`
      if (params.length !== index + 1) {
        idStr += ','
      }
    })
  }

  args.push(idStr)

  MySql.SELECT(tmpQuery, args).then(function(ret) {
    event.sender.send(Constant.GET_WBC_MODIFY_LIST_ALL, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_WBC_MODIFY_LIST_ALL, null, err)
  })
})

ipcMain.on(Constant.GET_BF_MODIFY_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)

  MySql.SELECT(query.SELECT_WBC_BF_MODIFY_LIST, args).then(function(ret) {
    event.sender.send(Constant.GET_BF_MODIFY_LIST, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_BF_MODIFY_LIST, null, err)
  })
})

ipcMain.on(Constant.UPDATE_SIGNED_STATE, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.state)
  args.push(getDateTime())
  args.push(params.userId)
  args.push(getDateTime())
  args.push(params.userId)
  args.push(params.slotId)

  MySql.UPDATE(query.UPDATE_SIGNED_STATE, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_SIGNED_STATE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_SIGNED_STATE, null, err)
  })
})

ipcMain.on(Constant.UPDATE_MALARIA_COUNT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.malariaCount)
  args.push(params.userId)
  args.push(params.slotId)

  MySql.UPDATE(query.UPDATE_MALARIA_COUNT, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_MALARIA_COUNT, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_MALARIA_COUNT, null, err)
  })
})

ipcMain.on(Constant.GET_TEST_HISTORY_LIST, (event, payload) => {
  
  log.info(payload)
  //{"limit":0,"size":150,"searchType":"02","searchText":"","startDate":"","endDate":"","wbcClassList":[],"nrCount":0,"wbcTotalSortCd":"00"}

  var params = JSON.parse(payload)
  var args = []
  var searchQuery = query.SEARCH_TEST_HISTORY_LIST

  args.push(Number(params.limit))
  args.push(Number(params.size))

  if (params.searchText !== '') {
    if (params.searchType === '01') {
      searchQuery += '\n AND PATIENT_ID LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '02') {
      searchQuery += '\n AND BARCODE_NO LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '03') {
      searchQuery += '\n AND PATIENT_NM LIKE ' + `'%` + params.searchText + `%'`
    }
  }

  if (params.startDate !== '' && params.endDate !== '') {
    searchQuery += `\n AND SUBSTR(ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')`
    args.push(params.startDate)
    args.push(params.endDate)
  } else {
    args.push('1900-01-01')
    args.push('9999-12-31')
  }

  if (Number(params.nrCount) > 0) {
    searchQuery += `\n AND NR_COUNT <= ?`
    args.push(params.nrCount)
  }

  var tmpStr = ''
  if (params.wbcClassList.length > 0) {
    params.wbcClassList.forEach(function(value, index) {
      tmpStr += `'` + value + `'`

      if ((params.wbcClassList.length - 1) !== (index)) {
        tmpStr += ','
      }
    })

    searchQuery += `\n AND SLOT_ID IN (SELECT IFNULL(MIN(SLOT_ID), 0) AS SLOT_ID
                                          FROM TB_WBC_CLASSIFICATION SB
                                         WHERE CASSET_ID = SB.CASSET_ID
                                           AND SLOT_ID = SB.SLOT_ID
                                           AND COUNT > 0
                                           AND CLASS_ID IN (%s)
                                          GROUP BY SB.SLOT_ID)`
    searchQuery = searchQuery.replace('%s', tmpStr)
  }

  if (params.wbcTotalSortCd === '01') {
    searchQuery += `\n ORDER BY WBC_TOTAL DESC`
  } else if (params.wbcTotalSortCd === '02') {
    searchQuery += `\n ORDER BY WBC_TOTAL ASC`
  } else {
    searchQuery += `\n ORDER BY ANALYZE_DTTM DESC`
  }

  log.info(searchQuery)

  MySql.SELECT(searchQuery, args).then(function(ret) {
    event.sender.send(Constant.GET_TEST_HISTORY_LIST, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_TEST_HISTORY_LIST, null, err)
  })
})

ipcMain.on(Constant.GET_TEST_HISTORY_PREV, (event, payload) => {
  log.info('GET_TEST_HISTORY_PREV')
  var params = JSON.parse(payload)
  var args = []
  var searchQuery = query.SEARCH_TEST_HISTORY_LIST

  if (params.searchText !== '') {
    if (params.searchType === '01') {
      searchQuery += '\n AND PATIENT_ID LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '02') {
      searchQuery += '\n AND BARCODE_NO LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '03') {
      searchQuery += '\n AND PATIENT_NM LIKE ' + `'%` + params.searchText + `%'`
    }
  }

  if (params.startDate !== '' && params.endDate !== '') {
    searchQuery += `\n AND SUBSTR(ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')`

    args.push(params.startDate)
    args.push(params.endDate)
  }

  if (Number(params.nrCount) > 0) {
    searchQuery += `\n AND NR_COUNT <= ?`
    args.push(params.nrCount)
  }

  var tmpStr = ''
  if (params.wbcClassList.length > 0) {
    params.wbcClassList.forEach(function(value, index) {
      tmpStr += `'` + value + `'`

      if ((params.wbcClassList.length - 1) !== (index)) {
        tmpStr += ','
      }
    })

    searchQuery += `\n AND SLOT_ID IN (SELECT IFNULL(MIN(SB.SLOT_ID), 0) AS SLOT_ID
                                          FROM TB_WBC_CLASSIFICATION SB
                                         WHERE CASSET_ID = SB.CASSET_ID
                                           AND SLOT_ID = SB.SLOT_ID
                                           AND COUNT > 0
                                           AND CLASS_ID IN (%s)
                                          GROUP BY SB.SLOT_ID)`
    searchQuery = searchQuery.replace('%s', tmpStr)
  }

  var order = ''
  if (params.wbcTotalSortCd === '01') {
    searchQuery += `\n ORDER BY WBC_TOTAL DESC`
    order = `ORDER BY WBC_TOTAL DESC`
  } else if (params.wbcTotalSortCd === '02') {
    searchQuery += `\n ORDER BY WBC_TOTAL ASC`
    order = `ORDER BY WBC_TOTAL ASC`
  } else {
    searchQuery += `\n ORDER BY ANALYZE_DTTM DESC`
    order = `ORDER BY ANALYZE_DTTM DESC`
  }

  var prevQuery = query.SEARCH_TEST_HISTORY_LIST
  prevQuery += `\n AND SLOT_ID = `
  prevQuery += `\n (SELECT PREV_SLOT_ID`
  prevQuery += `\n FROM (SELECT * `
  prevQuery += `\n , LAG(SLOT_ID, 1, NULL) OVER (` + order + `) PREV_SLOT_ID`
  prevQuery += `\n , LEAD(SLOT_ID, 1, NULL) OVER (` + order + `) NEXT_SLOT_ID`
  prevQuery += `\n FROM (` + searchQuery + `)`
  prevQuery += `\n )`
  prevQuery += `\n WHERE SLOT_ID = ?`
  prevQuery += `\n )`

  args.push(params.slotId)

  log.info(prevQuery)

  MySql.SELECT(prevQuery, args).then(function(ret) {
    event.sender.send(Constant.GET_TEST_HISTORY_PREV, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_TEST_HISTORY_PREV, null, err)
  })
})

ipcMain.on(Constant.GET_TEST_HISTORY_NEXT, (event, payload) => {
  log.info('GET_TEST_HISTORY_NEXT')
  var params = JSON.parse(payload)
  var args = []
  var searchQuery = query.SEARCH_TEST_HISTORY_LIST

  if (params.searchText !== '') {
    if (params.searchType === '01') {
      searchQuery += '\n AND PATIENT_ID LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '02') {
      searchQuery += '\n AND BARCODE_NO LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '03') {
      searchQuery += '\n AND PATIENT_NM LIKE ' + `'%` + params.searchText + `%'`
    }
  }

  if (params.startDate !== '' && params.endDate !== '') {
    searchQuery += `\n AND SUBSTR(ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')`

    args.push(params.startDate)
    args.push(params.endDate)
  }

  if (Number(params.nrCount) > 0) {
    searchQuery += `\n AND NR_COUNT <= ?`
    args.push(params.nrCount)
  }

  var tmpStr = ''
  if (params.wbcClassList.length > 0) {
    params.wbcClassList.forEach(function(value, index) {
      tmpStr += `'` + value + `'`

      if ((params.wbcClassList.length - 1) !== (index)) {
        tmpStr += ','
      }
    })

    searchQuery += `\n AND SLOT_ID IN (SELECT IFNULL(MIN(SB.SLOT_ID), 0) AS SLOT_ID
                                          FROM TB_WBC_CLASSIFICATION SB
                                         WHERE CASSET_ID = SB.CASSET_ID
                                           AND SLOT_ID = SB.SLOT_ID
                                           AND COUNT > 0
                                           AND CLASS_ID IN (%s)
                                          GROUP BY SB.SLOT_ID)`
    searchQuery = searchQuery.replace('%s', tmpStr)
  }

  var order = ''
  if (params.wbcTotalSortCd === '01') {
    searchQuery += `\n ORDER BY WBC_TOTAL DESC`
    order = `ORDER BY WBC_TOTAL DESC`
  } else if (params.wbcTotalSortCd === '02') {
    searchQuery += `\n ORDER BY WBC_TOTAL ASC`
    order = `ORDER BY WBC_TOTAL ASC`
  } else {
    searchQuery += `\n ORDER BY ANALYZE_DTTM DESC`
    order = `ORDER BY ANALYZE_DTTM DESC`
  }

  var nextQuery = query.SEARCH_TEST_HISTORY_LIST
  nextQuery += `\n AND SLOT_ID = `
  nextQuery += `\n (SELECT NEXT_SLOT_ID`
  nextQuery += `\n FROM (SELECT * `
  nextQuery += `\n , LAG(SLOT_ID, 1, NULL) OVER (` + order + `) PREV_SLOT_ID`
  nextQuery += `\n , LEAD(SLOT_ID, 1, NULL) OVER (` + order + `) NEXT_SLOT_ID`
  nextQuery += `\n FROM (` + searchQuery + `)`
  nextQuery += `\n )`
  nextQuery += `\n WHERE SLOT_ID = ?`
  nextQuery += `\n )`

  args.push(params.slotId)

  log.info(nextQuery)

  MySql.SELECT(nextQuery, args).then(function(ret) {
    event.sender.send(Constant.GET_TEST_HISTORY_NEXT, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_TEST_HISTORY_NEXT, null, err)
  })
})

ipcMain.on(Constant.SET_WBC_CELL_POSITION, (event, payload) => {
  var params = JSON.parse(payload)
  var userInput = ''
  var args = []
  var tmpQuery = query.INSERT_WBC_CELL_POSITION

  if (params.slotInfo) {
    params.slotInfo.forEach(function(slot, slotIndex) {
      slot.positionInfo.forEach(function(position, index) {
        args.push(params.cassetId)
        args.push(slot.slotId)
        args.push(position.fileId)
        args.push(position.fileName)
        args.push(position.posX1)
        args.push(position.posY1)
        args.push(position.posX2)
        args.push(position.posY2)
        args.push(position.orgWidth)
        args.push(position.orgHeight)
        args.push(getDateTime())
        args.push(params.userId)
        args.push(getDateTime())
        args.push(params.userId)

        userInput += '(?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        if (((index + 1) % 50) === 0) {
          tmpQuery = tmpQuery.replace('userInput', userInput)
          sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: args})
          args = []
          userInput = ''
        } else {
          if ((index + 1 < slot.positionInfo.length)) {
            userInput += ', '
          } else {
            tmpQuery = tmpQuery.replace('userInput', userInput)
            sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: args})
            args = []
            userInput = ''
          }
        }
      })
    })
  }
})

// get cell position
ipcMain.on(Constant.GET_WBC_CELL_POSITION, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)

  MySql.SELECT(query.SELECT_WBC_CELL_POSITION, args).then(function(ret) {
    event.sender.send(Constant.GET_WBC_CELL_POSITION, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_WBC_CELL_POSITION, null, err)
  })
})

ipcMain.on(Constant.SET_USER, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.userId)
  args.push(params.userName)
  args.push(params.empNo)
  args.push(params.position)
  args.push(params.authCd)
  args.push(params.encPassword)
  args.push(params.isAvailable)
  args.push('')
  args.push(getDateTime())
  args.push(params.userId)
  args.push(getDateTime())
  args.push(params.userId)

  var result = {}

  MySql.SELECT_ONE(query.IS_REGIST_USER, [params.userId]).then(function(ret) {
    log.info('IS_REGIST : ' + ret.IS_REGIST)
    if (!ret.IS_REGIST) {
      MySql.INSERT(query.INSERT_USER, args).then(function(ret) {
        event.sender.send(Constant.SET_USER, ret, null)
      }).catch(function(err) {
        event.sender.send(Constant.SET_USER, null, err)
      })
    } else {
      event.sender.send(Constant.SET_USER, ret, null)
    }
  })
})

ipcMain.on(Constant.GET_USER_LIST, (event, payload) => {
  MySql.SELECT(query.SELECT_USER_LIST).then(function(ret) {
    log.info(ret)
    event.sender.send(Constant.GET_USER_LIST, ret, null)
  }).catch(function(err) {
    log.info(err)
    event.sender.send(Constant.GET_USER_LIST, null, err)
  })
})

ipcMain.on(Constant.UPDATE_LOGIN_DTTM, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(getDateTime())
  args.push(getDateTime())
  args.push(params.userId)

  log.info('send message')

  MySql.UPDATE(query.UPDATE_USER_DTTM, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_LOGIN_DTTM, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_LOGIN_DTTM, null, err)
  })
})

ipcMain.on(Constant.UPDATE_USER, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.authCd)
  args.push(params.userName)
  args.push(params.isAvailable)
  args.push(params.empNo)
  args.push(getDateTime())
  args.push(params.userId)

  MySql.UPDATE(query.UPDATE_USER, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_USER, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_USER, null, err)
  })
})

ipcMain.on(Constant.DELETE_USER, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.userId)

  MySql.DELETE(query.DELETE_USER, args).then(function(ret) {
    event.sender.send(Constant.DELETE_USER, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.DELETE_USER, null, err)
  })
})

ipcMain.on(Constant.GET_BF_WHOLE_SLIDE_PATH, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)

  MySql.SELECT(query.SELECT_BF_WHOLE_SLIDE_PATH, args).then(function(ret) {
    event.sender.send(Constant.GET_BF_WHOLE_SLIDE_PATH, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_BF_WHOLE_SLIDE_PATH, null, err)
  })
})

ipcMain.on(Constant.SELECT_RBC_DEGREE, (event, payload) => {
  MySql.SELECT(query.SELECT_RBC_DEGREE).then(function(ret) {
    event.sender.send(Constant.SELECT_RBC_DEGREE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_RBC_DEGREE, null, err)
  })
})

ipcMain.on(Constant.SELECT_WBC_HOT_KEY, (event, payload) => {
  MySql.SELECT(query.SELECT_WBC_HOT_KEY).then(function(ret) {
    event.sender.send(Constant.SELECT_WBC_HOT_KEY, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_WBC_HOT_KEY, null, err)
  })
})

// normal range [
ipcMain.on(Constant.GET_NORMAL_RANGE, (event, payload) => {
  MySql.SELECT(query.SELECT_NORMAL_RANGE).then(function(ret) {
    event.sender.send(Constant.GET_NORMAL_RANGE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_NORMAL_RANGE, null, err)
  })
})

ipcMain.on(Constant.RESET_NORMAL_RANGE, (event, payload) => {
  var params = JSON.parse(payload)

  log.info(params)

  params.forEach(function(item) {
    var args = []

    args.push(item.min)
    args.push(item.max)
    args.push(item.unit)
    args.push(item.analysisType)
    args.push(item.classId)

    MySql.UPDATE(query.UPDATE_NORMAL_RANGE, args).then(function(ret) {
      event.sender.send(Constant.UPDATE_NORMAL_RANGE, ret, null)
    }).catch(function(err) {
      event.sender.send(Constant.UPDATE_NORMAL_RANGE, null, err)
    })
  })
})

ipcMain.on(Constant.UPDATE_NORMAL_RANGE, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.min)
  args.push(params.max)
  args.push(params.unit)
  args.push(params.analysisType)
  args.push(params.classId)

  MySql.UPDATE(query.UPDATE_NORMAL_RANGE, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_NORMAL_RANGE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_NORMAL_RANGE, null, err)
  })
})
// normal range ]

ipcMain.on(Constant.UPDATE_HOT_KEYS, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.key)
  args.push('01')
  args.push(params.id)

  MySql.UPDATE(query.UPDATE_HOT_KEYS, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_HOT_KEYS, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_HOT_KEYS, null, err)
  })
})

ipcMain.on(Constant.SELECT_BF_HOT_KEY, (event, payload) => {

  MySql.SELECT(query.SELECT_BF_HOT_KEY).then(function(ret) {
    event.sender.send(Constant.SELECT_BF_HOT_KEY, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_BF_HOT_KEY, null, err)
  })
})

ipcMain.on(Constant.UPDATE_BF_HOT_KEYS, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.key)
  args.push('02')
  args.push(params.id)

  MySql.UPDATE(query.UPDATE_HOT_KEYS, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_BF_HOT_KEYS, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_BF_HOT_KEYS, null, err)
  })
})

ipcMain.on(Constant.UPDATE_RBC_DEGREE, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.degree1)
  args.push(params.degree2)
  args.push(params.degree3)
  args.push(params.categoryId)
  args.push(params.classId)

  MySql.UPDATE(query.UPDATE_RBC_DEGREE, args).then(function(ret) {
    event.sender.send(Constant.UPDATE_RBC_DEGREE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.UPDATE_RBC_DEGREE, null, err)
  })
})

ipcMain.on(Constant.SELECT_WBC_CUSTOM_CLASS, (event, payload) => {
  MySql.SELECT(query.SELECT_WBC_CUSTOM_CLASS).then(function(ret) {
    event.sender.send(Constant.SELECT_WBC_CUSTOM_CLASS, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.SELECT_WBC_CUSTOM_CLASS, null, err)
  })
})

ipcMain.on(Constant.SET_WBC_CUSTOM_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  log.info(params.wbcCustomList)

  params.wbcCustomList.forEach(function(item) {
    var args = []
    args.push(item.CLASS_TITLE)
    args.push(item.CLASS_NM)
    args.push(item.CLASS_ID)

    MySql.UPDATE(query.UPDATE_WBC_CUSTOM_CLASS, args).then(function(ret) {
      event.sender.send(Constant.SET_WBC_CUSTOM_LIST, ret, null)
    }).catch(function(err) {
      event.sender.send(Constant.SET_WBC_CUSTOM_LIST, null, err)
    })

    var hotArgs = []
    hotArgs.push(item.CLASS_TITLE)
    hotArgs.push(item.CLASS_NM)
    hotArgs.push('01')
    hotArgs.push(item.CLASS_ID)

    MySql.UPDATE(query.UPDATE_HOT_KEY_CLASS, hotArgs).then(function(ret) {
      event.sender.send(Constant.UPDATE_HOT_KEYS, ret, null)
    }).catch(function(err) {
      event.sender.send(Constant.UPDATE_HOT_KEYS, null, err)
    })
  })
})

ipcMain.on(Constant.DELETE_BACKUP_DATA, async (event, payload) => {
  var params = JSON.parse(payload)

  try {
    if (params.backupList !== null && typeof(params.backupList) !== 'undefined') {
      await MySql.BEGIN_TRANSACTION()

      params.backupList.forEach(async function (item, index, array) {
        var insertArgs = []
        insertArgs.push(item.CASSET_ID)
        insertArgs.push(item.SLOT_ID)
        insertArgs.push('Y')
        insertArgs.push(getDateTime())
        insertArgs.push('')
        insertArgs.push(getDateTime())
        insertArgs.push(params.userId)
        insertArgs.push(getDateTime())
        insertArgs.push(params.userId)

        await MySql.INSERT(query.INSERT_BACKUP_HIST, insertArgs)

        var deleteArgs = []
        deleteArgs.push(item.CASSET_ID)
        deleteArgs.push(item.SLOT_ID)

        await MySql.DELETE(query.DELETE_BACKUP_TEST_HISTORY, deleteArgs)

        if (index + 1 === array.length) {
          await MySql.COMMIT()
          event.sender.send(Constant.DELETE_BACKUP_DATA, params.backupList, null)
        }
      })
    }
  } catch (err) {
    log.info(err)
    await MySql.ROLLBACK()
    event.sender.send(Constant.DELETE_BACKUP_DATA, null, err)
  }
})

ipcMain.on(Constant.RESTORE_BACKUP_DATA, async (event, payload) => {
  var params = JSON.parse(payload)

  try {
    if (params !== null && typeof(params) !== 'undefined') {
      await MySql.BEGIN_TRANSACTION()

      params.restoreList.forEach(async function (item, index, array) {
        var insertRestoreArgs = []
        insertRestoreArgs.push(item.CASSET_ID)
        insertRestoreArgs.push(item.SLOT_ID)
        insertRestoreArgs.push('N')
        insertRestoreArgs.push('')
        insertRestoreArgs.push(getDateTime())
        insertRestoreArgs.push(getDateTime())
        insertRestoreArgs.push(params.userId)
        insertRestoreArgs.push(getDateTime())
        insertRestoreArgs.push(params.userId)

        await MySql.INSERT(query.INSERT_BACKUP_HIST, insertRestoreArgs)

        var insertHistArgs = []
        insertHistArgs.push(item.CASSET_ID)
        insertHistArgs.push(item.SLOT_ID)
        insertHistArgs.push(item.SLOT_NO)
        insertHistArgs.push(item.BARCODE_NO)
        insertHistArgs.push(item.PATIENT_ID)
        insertHistArgs.push(item.PATIENT_NM)
        insertHistArgs.push(item.ORDER_DTTM)
        insertHistArgs.push(item.STATE_CD)
        insertHistArgs.push(item.MALARIA_COUNT)
        insertHistArgs.push(item.PLT_COUNT)
        insertHistArgs.push(item.ANALYZE_DTTM)
        insertHistArgs.push(item.BIRTHDAY)
        insertHistArgs.push(item.GENDER)
        insertHistArgs.push(item.TEST_TYPE)
        insertHistArgs.push(item.SIGNED_STATE)
        insertHistArgs.push(item.SIGNED_DTTM)
        insertHistArgs.push(item.SIGNED_USER_ID)
        insertHistArgs.push(item.WBC_COMMENT)
        insertHistArgs.push(item.RBC_COMMENT)
        insertHistArgs.push(item.MAX_WBC_COUNT)
        insertHistArgs.push(item.MAX_RBC_COUNT)
        insertHistArgs.push(item.SERIAL_NO)
        insertHistArgs.push(item.TACT_TIME)
        insertHistArgs.push(item.IS_NS_NB_INTEGRATION)
        insertHistArgs.push(item.IS_NORMAL)
        insertHistArgs.push(item.IS_CHECKED)
        insertHistArgs.push(item.CREATE_DTTM)
        insertHistArgs.push(item.CREATE_ID)
        insertHistArgs.push(item.MODIFY_DTTM)
        insertHistArgs.push(item.MODIFY_ID)

        // duplicate key update
        insertHistArgs.push(item.SLOT_NO)
        insertHistArgs.push(item.BARCODE_NO)
        insertHistArgs.push(item.PATIENT_ID)
        insertHistArgs.push(item.PATIENT_NM)
        insertHistArgs.push(item.ORDER_DTTM)
        insertHistArgs.push(item.STATE_CD)
        insertHistArgs.push(item.MALARIA_COUNT)
        insertHistArgs.push(item.PLT_COUNT)
        insertHistArgs.push(item.ANALYZE_DTTM)
        insertHistArgs.push(item.BIRTHDAY)
        insertHistArgs.push(item.GENDER)
        insertHistArgs.push(item.TEST_TYPE)
        insertHistArgs.push(item.SIGNED_STATE)
        insertHistArgs.push(item.SIGNED_DTTM)
        insertHistArgs.push(item.SIGNED_USER_ID)
        insertHistArgs.push(item.WBC_COMMENT)
        insertHistArgs.push(item.RBC_COMMENT)
        insertHistArgs.push(item.MAX_WBC_COUNT)
        insertHistArgs.push(item.MAX_RBC_COUNT)
        insertHistArgs.push(item.SLOT_ID)
        insertHistArgs.push(item.TACT_TIME)
        insertHistArgs.push(item.IS_NS_NB_INTEGRATION)
        insertHistArgs.push(item.IS_NORMAL)
        insertHistArgs.push(item.IS_CHECKED)
        insertHistArgs.push(item.MODIFY_DTTM)
        insertHistArgs.push(item.MODIFY_ID)

        await MySql.INSERT(query.INSERT_TEST_HISTORY, insertHistArgs)

        if (index + 1 === array.length) {
          await MySql.COMMIT()
          event.sender.send(Constant.RESTORE_BACKUP_DATA, params.restoreList, null)
        }
      })
    }
  } catch (err) {
    log.info(err)
    await MySql.ROLLBACK()
    event.sender.send(Constant.RESTORE_BACKUP_DATA, null, err)
  }
})

ipcMain.on(Constant.GET_BACKUP_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.backupStartDate)
  args.push(params.backupEndDate)

  MySql.SELECT(query.SELECT_BACKUP_LIST, args).then(function(ret) {
    event.sender.send(Constant.GET_BACKUP_LIST, ret, null)

  }).catch(function(err) {
    event.sender.send(Constant.GET_BACKUP_LIST, null, err)
  })
})

ipcMain.on(Constant.GET_LOCK_STATE, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.cassetId)
  args.push(params.slotId)

  MySql.SELECT_ONE(query.CHECK_SLIDE_LOCK_STATE, args).then(function(ret) {
    event.sender.send(Constant.GET_LOCK_STATE, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_LOCK_STATE, null, err)
  })
})

ipcMain.on(Constant.GET_IMAGE_ROLLBACK_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.cassetId)
  args.push(params.slotId)

  MySql.SELECT(query.SELECT_IMAGE_ROLLBACK, args).then(function(ret) {
    event.sender.send(Constant.GET_IMAGE_ROLLBACK_LIST, ret, null)
  }).catch(function(err) {
    event.sender.send(Constant.GET_IMAGE_ROLLBACK_LIST, null, err)
  })
})


ipcMain.on('send_print', (event, payload) => {
  console.log(mainWindow.webContents)
  mainWindow.webContents.print()
})

ipcMain.on('INIT_DATABASE', (event, payload) => {
  MySql.CREATE_DEFAULT_TABLES().then(function(ret) {
    console.log('CREATE_DEFAULT_TABLES : ' + ret)
    insertSettings()

  }).catch(function(err) {
    console.log(err)
  })

  // var dbPath = payload.dbPath.substring(0, payload.dbPath.lastIndexOf('/')) + '/' + Configs.DB_FILE_NAME
  // sqliteChild.send({msg: 'INIT', path: dbPath})

  // let networkDrive = require('windows-network-drive')
  //
  // networkDrive.find('\\\\Desktop-8ljrjpo\\d').then(function(result) {
  //   log.info(result)
  // })

  // networkDrive.mount(dbPath, "F", undefined, undefined).then(function(result) {
  //   log.info('mount result')
  //   log.info(result)
  //
  //   log.info(networkDrive.list())
  // })

  // var dbPath = payload.dbPath.substring(0, payload.dbPath.lastIndexOf('/')) + '/UIMD_Data/UI_DB/pb.db'
  // sqliteChild.send({msg: 'INIT', path: dbPath})
})
// [IPC RECEIVER END]

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

function updateCheck () {
  try {
    const { autoUpdater } = require('electron-updater')
    const ProgressBar = require('electron-progressbar')
    let progressBar = null

    autoUpdater.logger = log
    autoUpdater.logger.transports.file.level = 'info'

    autoUpdater.on('checking-for-update', () => {
      log.info('checking-for-update')
    })

    autoUpdater.on('update-available', (info) => {
      log.info('update-available')
    })

    autoUpdater.on('update-not-available', () => {
      progressBar.setCompleted()
      log.info('update-not-available')
    })

    autoUpdater.on('download-progress', (progressObj) => {
      let logMessage = 'Download speed : ' + progressObj.bytesPerSecond
      logMessage = logMessage + ' - Downloaded ' + progressObj.percent.toFixed(2) + '%'
      logMessage = logMessage + ' (' + progressObj.transferred + ' /' + progressObj.total + ')'
      log.info(logMessage)

      progressBar.detail = logMessage
    })

    autoUpdater.on('update-downloaded', (info) => {
      progressBar.setCompleted()

      const option = {
        type: 'question',
        buttons: ['Update', 'Exit'],
        defaultId: 0,
        title: 'IA-UPDATER',
        message: 'A new version has been downloaded. Please restart the application to apply the update.'
      }

      // dialog.showMessageBox(option, (response) => {
      //   fs.copyFile(Configs.DB_FILE_NAME, Configs.DB_BACKUP_PATH, function(err) {
      //     log.info('copy : ' + err)
      //   })
      //
      //   if (response === 0) {
      //     autoUpdater.quitAndInstall()
      //   } else {
      //     app.quit()
      //   }
      // })
    })

    autoUpdater.on('error', (err) => {
      log.error('update-error')
      log.error(err)
    })
  } catch (err) {
    log.info(err.message)
  }

}
