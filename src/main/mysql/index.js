import Configs from '../../Configs.js'
import DefaultTables from './default_tables.js'
import query from './mysql_query.js'
import store from '../../renderer/store'

const log = require('electron-log')
const mysql = require('mysql')
const fs = require('fs')
const mysqlPool = mysql.createPool(JSON.parse(fs.readFileSync(Configs.DB_CONFIG_PATH, 'utf-8')).DB_CONF)

mysqlPool.on('acquire', function (conn) {
  console.log('Connection %d acquired' + conn.threadId)
})

mysqlPool.on('connection', function (conn) {
  conn.query('SET SESSION auto_increment_increment=1')
})

mysqlPool.on('enqueue', function () {
  console.log('Waiting for available connection slot')
})

mysqlPool.on('release', function (conn) {
  console.log('Connection %d released' + conn.threadId)
})

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

async function getConnection () {
  return new Promise(function(succ, fail) {
    const conn = mysqlPool.getConnection(function(err, conn) {
      if (err) {
        fail(err)
      } else {
        succ(conn)
      }
    })
  })
}

async function createDefaultTables() {
  var results = []
  var connection = null

  getConnection().then(function(conn) {
    log.info(conn)
    log.info(DefaultTables.TABLES)
    connection = conn
    const promises = DefaultTables.TABLES.map(async function(table, index) {
      conn.query(table, [], function(err, rows, fields) {
        if (!err) {
          results.push(rows)
        } else {
          log.info(err)
        }
      })
    })

    Promise.all(promises).then(function(ret) {
      log.info(ret)
    }).catch(function(err) {
      log.info(err)
    })
  }).catch(function(err) {
    log.info(err)
  }).finally(function() {
    if (connection) {
      connection.release()
    }
  })
}

async function select(sql, args) {
  log.info('select---')
  log.info(sql)
  log.info(args)

  var connection = null

  return new Promise(function(succ, fail) {
    getConnection().then(function(conn) {
      connection = conn
      conn.query(sql, args, function(err, results, fields) {
        if (err) {
          fail(err)
        } else {
          succ(results)
        }
      })
    }).catch(function(err) {
      fail(err)
    }).finally(function() {
      if (connection) {
        connection.release()
      }
    })
  })
}

async function selectOne(sql, args) {
  log.info(sql)
  log.info(args)

  var connection = null

  return new Promise(function(succ, fail) {
    getConnection().then(function(conn) {
      connection = conn
      conn.query(sql, args, function(err, results, fields) {
        if (err) {
          fail(err)
        } else {
          succ(results[0])
        }
      })
    }).catch(function(err) {
      fail(err)
    }).finally(function() {
      if (connection) {
        connection.release()
      }
    })
  })
}

async function update(sql, args) {
  log.info(sql)
  log.info(args)

  var connection = null

  return new Promise(function(succ, fail) {
    getConnection().then(function(conn) {
      connection = conn
      conn.query(sql, args, function(err, results, fields) {
        if (err) {
          fail(err)
        } else {
          succ(results)
        }
      })
    }).catch(function(err) {
      fail(err)
    }).finally(function() {
      if (connection) {
        connection.release()
      }
    })
  })
}

async function deleteRow(sql, args) {
  log.info(sql)
  log.info(args)

  var connection = null

  return new Promise(function(succ, fail) {
    getConnection().then(function(conn) {
      connection = conn
      conn.query(sql, args, function(err, results, fields) {
        if (err) {
          fail(err)
        } else {
          succ(results)
        }
      })
    }).catch(function(err) {
      fail(err)
    }).finally(function() {
      if (connection) {
        connection.release()
      }
    })
  })
}

async function insert(sql, args) {
  log.info(sql)
  log.info(args)

  var connection = null
  return new Promise(function(succ, fail) {
    getConnection().then(function(conn) {
      connection = conn
      conn.query(sql, args, function(err, results, fields) {
        if (err) {
          fail(err)
        } else {
          succ(results)
        }
      })
    }).catch(function(err) {
      fail(err)
    }).finally(function() {
      if (connection) {
        connection.release()
      }
    })
  })
}

async function insertWbcClassification(conn, params) {
  log.info('insertWbcClassification')

  return new Promise(function(succ, fail) {
    var wbcInfo = params.wbcInfo

    // wbc insert
    if (wbcInfo) {
      var sql = 'INSERT INTO PB_DB.TB_WBC_CLASSIFICATION VALUES (?,?,?,?,?,?,?,?,?,?)'
      var results = []

      const promises = wbcInfo.map(async function(wbcItem, index) {
        var args = []

        args.push(params.cassetId)
        args.push(params.slotId)
        args.push(wbcItem.id)
        args.push(wbcItem.name)
        args.push(wbcItem.title)
        args.push(wbcItem.count)
        args.push(getDateTime())
        args.push(params.userId)
        args.push(getDateTime())
        args.push(params.userId)

        log.info(sql)
        log.info(args)

        conn.query(sql, args, function(err, rows, fields) {
          if (!err) {
            results.push(rows)
          } else {
            fail(err)
          }
        })
      })

      Promise.all(promises).then(function(ret) {
        log.info(ret)
        succ(results)
      }).catch(function(err) {
        log.info(err)
        fail(err)
      })
    } else {
      fail(new Error('wbcInfo not found'))
    }
  })
}

async function insertWbcClassificationHist(conn, params) {
  return new Promise(function(succ, fail) {
    var wbcInfo = params.wbcInfo

    // wbc insert
    if (wbcInfo) {
      var sql = 'INSERT INTO PB_DB.TB_WBC_CLASSIFICATION_HIST VALUES (?,?,?,?,?,?,?,?,?,?)'
      var results = []

      const promises = wbcInfo.map(async function(wbcItem, index) {
        var args = []

        args.push(params.cassetId)
        args.push(params.slotId)
        args.push(wbcItem.id)
        args.push(wbcItem.name)
        args.push(wbcItem.title)
        args.push(wbcItem.count)
        args.push(getDateTime())
        args.push(params.userId)
        args.push(getDateTime())
        args.push(params.userId)

        conn.query(sql, args, function(err, rows, fields) {
          if (!err) {
            results.push(rows)
          } else {
            fail(err)
          }
        })
      })

      Promise.all(promises).then(function(ret) {
        log.info(ret)
        succ(results)
      }).catch(function(err) {
        log.info(err)
        log.info(sql)
        fail(err)
      })
    } else {
      fail(new Error('wbcInfo not found'))
    }
  })
}

async function insertWbcImages(conn, params) {
  return new Promise(function(succ, fail) {
    var wbcInfo = params.wbcInfo

    if (wbcInfo) {
      var sql = 'INSERT INTO PB_DB.TB_WBC_IMAGE_HIST VALUES (?,?,?,?,?,?,?,?,?)'
      var results = []

      wbcInfo.forEach(function(wbcItem, wbcIndex, array) {
        log.info('wbcItem.images : ' + JSON.stringify(wbcItem.images))

        if (wbcItem.images && wbcItem.images.length > 0) {
          const promises = wbcItem.images.map(function(image, imgIndex) {
            var args = []

            args.push(params.cassetId)
            args.push(params.slotId)
            args.push(image.fileName)
            args.push(wbcItem.id)
            args.push(wbcItem.id)
            args.push(getDateTime())
            args.push(params.userId)
            args.push(getDateTime())
            args.push(params.userId)

            log.info(sql)
            log.info(args)

            conn.query(sql, args, function(err, rows, fields) {
              if (!err) {
                results.push(rows)
              } else {
                fail(err)
              }
            })
          })

          Promise.all(promises).then(function(ret) {
            log.info('insertWbcImages : ' + ret)
          }).catch(function(err) {
            log.info('insertWbcImages err : ' + err)
            fail(err)
          })
        }

        if (wbcIndex + 1 === array.length) {
          succ(results)
        }
      })

    } else {
      fail(new Error('wbcInfo not found'))
    }
  })
}

async function insertRbcCategories(conn, params) {
  return new Promise(function(succ, fail) {
    var rbcInfo = params.rbcInfo
    var sql = 'INSERT INTO TB_RBC_CATEGORY VALUES (?,?,?,?,?,?,?,?)'
    var results = []

    if (rbcInfo && rbcInfo.length > 0) {
      const promises = rbcInfo.map(function(rbcItem) {
        var args = []

        args.push(params.cassetId)
        args.push(params.slotId)
        args.push(rbcItem.categoryId)
        args.push(rbcItem.categoryNm)
        args.push(getDateTime())
        args.push(params.userId)
        args.push(getDateTime())
        args.push(params.userId)

        conn.query(sql, args, function(err, rows, fields) {
          if (!err) {
            results.push(rows)
          } else {
            fail(err)
          }
        })
      })

      Promise.all(promises).then(function(ret) {
        log.info(results)
        succ(results)
      }).catch(function(err) {
        log.info(err)
        fail(err)
      })
    } else {
      fail(new Error('rbcInfo not found'))
    }
  })
}

async function insertRbcClassification(conn, params) {
  return new Promise(function(succ, fail) {
    var rbcInfo = params.rbcInfo

    if (rbcInfo && rbcInfo.length > 0) {
      var sql = 'INSERT INTO TB_RBC_CLASSIFICATION VALUES (?,?,?,?,?,?,?,?,?,?)'
      var results = []

      rbcInfo.forEach(function(rbcItem, rbcIndex, array) {
        const promises = rbcItem.classInfo.map(function(classItem, classIndex) {
          var args = []

          args.push(params.cassetId)
          args.push(params.slotId)
          args.push(rbcItem.categoryId)
          args.push(classItem.classId)
          args.push(classItem.classNm)
          args.push(classItem.degree)
          args.push(getDateTime())
          args.push(params.userId)
          args.push(getDateTime())
          args.push(params.userId)

          conn.query(sql, args, function(err, rows, fields) {
            if (!err) {
              results.push(rows)
            } else {
              fail(err)
            }
          })
        })

        Promise.all(promises).then(function(ret) {
          log.info('insertRbcClassification : ' + ret)
        }).catch(function(err) {
          log.info('insertRbcClassification err : ' + err)
          fail(err)
        })

        if (rbcIndex + 1 === array.length) {
          succ(results)
        }
      })
    } else {
      fail(new Error('rbcInfo not found'))
    }
  })
}

async function insertRbcClassificationHist(conn, params) {
  return new Promise(function(succ, fail) {
    var rbcInfo = params.rbcInfo

    if (rbcInfo && rbcInfo.length > 0) {
      var sql = 'INSERT INTO TB_RBC_CLASSIFICATION_HIST VALUES (?,?,?,?,?,?,?,?,?,?)'
      var results = []

      rbcInfo.forEach(function(rbcItem, rbcIndex, array) {
        const promises = rbcItem.classInfo.map(function(classItem, classIndex) {
          var args = []

          args.push(params.cassetId)
          args.push(params.slotId)
          args.push(rbcItem.categoryId)
          args.push(classItem.classId)
          args.push(classItem.classNm)
          args.push(classItem.degree)
          args.push(getDateTime())
          args.push(params.userId)
          args.push(getDateTime())
          args.push(params.userId)

          conn.query(sql, args, function(err, rows, fields) {
            if (!err) {
              results.push(rows)
            } else {
              fail(err)
            }
          })
        })

        Promise.all(promises).then(function(ret) {
          log.info('insertRbcClassificationHist : ' + ret)
        }).catch(function(err) {
          log.info('insertRbcClassificationHist err : ' + err)
          fail(err)
        })

        if (rbcIndex + 1 === array.length) {
          succ(results)
        }
      })
    } else {
      fail(new Error('rbcInfo not found'))
    }
  })
}

async function insertWholeSlidePath(conn, params) {
  return new Promise(function(succ, fail) {
    var lowPowerPath = params.lowPowerPath

    if (Configs.IS_BF_MODE_ON === 'Y' && lowPowerPath && lowPowerPath.length > 0) {
      var sql = 'INSERT INTO TB_BF_WHOLE_SLIDE_PATH VALUES (?,?,?,?,?,?,?,?,?)'
      var results = []

      const promises = lowPowerPath.map(async function(item, index) {
        var args = []

        args.push(params.cassetId)
        args.push(params.slotId)
        args.push(item.seqNo)
        args.push(item.path)
        args.push(item.isHighPowerScan)
        args.push(getDateTime())
        args.push(params.userId)
        args.push(getDateTime())
        args.push(params.userId)

        conn.query(sql, args, function(err, rows, fields) {
          if (!err) {
            results.push(rows)
          } else {
            fail(err)
          }
        })
      })

      Promise.all(promises).then(function(ret) {
        log.info(results)
        succ(results)
      }).catch(function(err) {
        log.info(err)
        fail(err)
      })
    } else {
      succ('')
    }
  })
}

/**
 * update normal cell
 */
async function updateIsNormalCell(conn, params) {
  return new Promise(function(succ, fail) {
    var sql = query.UPDATE_IS_NORMAL_CELL
    var args = []

    args.push(params.isNormal)
    args.push(params.slotId)

    log.info('updateIsNormalCell')
    log.info(sql)
    log.info(args)

    conn.query(sql, args, function(err, rows, fields) {
      if (!err) {
        succ(rows)
      } else {
        fail(err)
      }
    })
  })
}

async function updateClassification(params) {

  var connection = null

  return new Promise(function(succ, fail) {
    getConnection().then(function(conn) {
      connection = conn
      conn.beginTransaction(function(err) {
        if (!err) {
          var promises = [
            insertWbcClassification(conn, params),
            updateIsNormalCell(conn, params)
          ]

          Promise.all(promises).then(function(ret) {
            conn.commit()
            succ('success')

          }).catch(function(err) {
            log.info(err)
            if (conn) {
              conn.rollback()
            }
            fail(err)
          })
        } else {
          log.info(err)
          if (conn) {
            conn.rollback()
          }
          fail(err)
        }
      })
    }).catch(function(err) {
      log.info(err)
      if (connection) {
        connection.rollback()
      }
      fail(err)
    }).finally(function() {
      if (connection) {
        connection.release()
      }
    })
  })
}

// 분석결과 저장
async function insertClassification(params) {

  var connection = null

  return new Promise(function(succ, fail) {
    getConnection().then(function(conn) {
      connection = conn
      conn.beginTransaction(function(err) {
        if (!err) {
          var promises = [
            // wbc
            insertWbcClassification(conn, params),
            insertWbcClassificationHist(conn, params),
            insertWbcImages(conn, params),

            // rbc
            insertRbcCategories(conn, params),
            insertRbcClassification(conn, params),
            insertRbcClassificationHist(conn, params),

            // bf
            insertWholeSlidePath(conn, params)
          ]

          log.info('promises : ' + promises)
          Promise.all(promises).then(function(ret) {
            log.info('ret :' + JSON.stringify(ret))
            conn.commit()
            succ('success')

          }).catch(function(err) {
            log.info(err)
            if (conn) {
              conn.rollback()
            }
            fail(err)
          })
        } else {
          log.info(err)
          if (conn) {
            conn.rollback()
          }
          fail(err)
        }
      })
    }).catch(function(err) {
      log.info(err)
      if (connection) {
        connection.rollback()
      }
      fail(err)
    }).finally(function() {
      if (connection) {
        connection.release()
      }
    })
  })
}

async function insertLisCode (conn, params) {
  return new Promise(function(succ, fail) {
    // insert lis test code
    var sql = query.INSERT_LIS_CODE
    var results = []

    const promises = params.codeList.map(async function(item) {
      if (typeof(item.code) !== 'undefined') {
        var args = []

        args.push(item.value)
        args.push(item.code.trim())
        args.push(item.text)
        args.push(item.minCount)
        args.push(getDateTime())
        args.push(params.userId)
        args.push(getDateTime())
        args.push(params.userId)

        // update params
        args.push(item.code.trim())
        args.push(item.text)
        args.push(item.minCount)
        args.push(getDateTime())
        args.push(params.userId)

        conn.query(sql, args, function(err, rows, fields) {
          if (!err) {
            results.push(rows)
          }
        })
      }
    })

    Promise.all(promises).then(function(ret) {
      log.info(results)
      succ(results)
    }).catch(function(err) {
      log.info(err)
      fail(err)
    })
  })
}

async function insertLisCodeRbc (conn, params) {
  return new Promise(function(succ, fail) {
    // insert lis test code
    var sql = query.INSERT_LIS_CODE_RBC
    var results = []

    const promises = params.codeListRbc.map(async function(item) {
      if (typeof(item.code) !== 'undefined') {
        var args = []

        args.push(item.categoryId)
        args.push(item.classId)
        args.push(item.code.trim())
        args.push(item.categoryNm)
        args.push(item.classNm)
        args.push(getDateTime())
        args.push(params.userId)
        args.push(getDateTime())
        args.push(params.userId)

        // update params
        args.push(item.code.trim())
        args.push(item.categoryNm)
        args.push(item.classNm)
        args.push(getDateTime())
        args.push(params.userId)

        conn.query(sql, args, function(err, rows, fields) {
          if (!err) {
            results.push(rows)
          }
        })
      }
    })

    Promise.all(promises).then(function(ret) {
      log.info(results)
      succ(results)
    }).catch(function(err) {
      log.info(err)
      fail(err)
    })
  })
}

async function insertRunningCount (conn, params) {
  return new Promise(function(succ, fail) {
    var sql = query.INSERT_LIS_CODE_RBC
    var results = []

    const promises = params.wbcRunningCount.map(async function(item, index) {
      var args = []

      args.push(item.id)
      args.push(item.min)
      args.push(item.max)
      args.push(item.wbcCount)
      args.push(getDateTime())
      args.push(params.userId)
      args.push(getDateTime())
      args.push(params.userId)

      //update
      args.push(item.min)
      args.push(item.max)
      args.push(item.wbcCount)
      args.push(getDateTime())
      args.push(params.userId)

      conn.query(sql, args, function(err, rows, fields) {
        if (!err) {
          results.push(rows)
        }
      })
    })

    Promise.all(promises).then(function(ret) {
      log.info(results)
      succ(results)
    }).catch(function(err) {
      log.info(err)
      fail(err)
    })
  })
}

async function updateLisCode(params) {

  var connection = null

  return new Promise(function(succ, fail) {
    getConnection().then(function(conn) {
      connection = conn
      conn.beginTransaction(function(err) {
        if (!err) {
          var promises = [
            insertLisCode(conn, params),
            insertLisCodeRbc(conn, params),
            insertRunningCount(conn, params)
          ]

          Promise.all(promises).then(function(ret) {
            conn.commit()
            succ('success')

          }).catch(function(err) {
            log.info(err)
            if (conn) {
              conn.rollback()
            }
            fail(err)
          })

        } else {
          if (conn) {
            conn.rollback()
          }
          fail(err)
        }
      })
    }).catch(function(err) {
      log.info(err)
      if (connection) {
        connection.rollback()
      }
      fail(err)
    }).finally(function() {
      if (connection) {
        connection.release()
      }
    })
  })


  // try {
  //   await conn.beginTransaction()
  //
  //   await conn.insertLisCode(conn, params)
  //   await conn.insertLisCodeRbc(conn, params)
  //   await conn.insertRunningCount(conn, params)
  //
  //   await conn.commit()
  //
  //   return 'success'
  //
  // } catch (err) {
  //   if (conn) {
  //     conn.rollback()
  //   }
  //
  //   return err
  //
  // } finally {
  //   if (conn) {
  //     conn.release()
  //   }
  // }
}

async function beginTransaction(conn) {
  try {
    await conn.beginTransaction()
  } catch (err) {
    return err
  }
}

async function commit(conn) {
  try {
    await conn.commit()
  } catch (err) {
    return err
  }
}

async function rollback(conn) {
  try {
    await conn.rollback()
  } catch (err) {
    return err
  }
}

export default {
  async GET_CONNECTION () {
    return getConnection()
  },
  async CREATE_DEFAULT_TABLES () {
    return await createDefaultTables()
  },
  async SELECT (sql, args) {
    return await select(sql, args)
  },
  async SELECT_ONE (sql, args) {
    return await selectOne(sql, args)
  },
  async UPDATE (sql, args) {
    return await update(sql, args)
  },
  async DELETE (sql, args) {
    return await deleteRow(sql, args)
  },
  async INSERT (sql, args) {
    return await insert(sql, args)
  },
  async INSERT_CLASSIFICATION (params) {
    return await insertClassification(params)
  },
  async UPDATE_CLASSIFICATION (params) {
    return await updateClassification(params)
  },
  async UPDATE_LIS_CODE (params) {
    return await updateLisCode(params)
  },
  async BEGIN_TRANSACTION () {
    return await beginTransaction()
  },
  async COMMIT () {
    return await commit()
  },
  async ROLLBACK () {
    return await rollback()
  }
}
