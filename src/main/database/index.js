// electron version load for sqlite3(node-pre-gyp)

// process.versions.electron = process.env.ELECTRON_VERSION

const sqlite3 = require('sqlite3').verbose()
const log = require('electron-log')
let db = null
let dbRootPath = null

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

async function connect () {
  log.info('db connect : ' + JSON.stringify(db))

  if ((!db || !db.open) && dbRootPath !== null) {
    db = new sqlite3.Database(dbRootPath, (err) => {
      if (err) {
        log.info(err.message)

      } else {
        log.info('Connected to the mydb database.')
        db.run('PRAGMA cache_size=10000;', [], (err, arg) => {
          if (err) {
            log.info(err)
          }
        })

        db.run(`CREATE TABLE IF NOT EXISTS TB_TEST_HISTORY (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , SLOT_NO           TEXT
              , BARCODE_NO        TEXT
              , PATIENT_ID        TEXT
              , PATIENT_NM        TEXT
              , ORDER_DTTM        TEXT
              , STATE_CD          TEXT
              , MALARIA_COUNT     TEXT
              , PLT_COUNT         TEXT
              , ANALYZE_DTTM      TEXT
              , BIRTHDAY          TEXT
              , GENDER            TEXT
              , TEST_TYPE         TEXT
              , SIGNED_STATE      TEXT
              , SIGNED_DTTM       TEXT
              , SIGNED_USER_ID    TEXT
              , WBC_COMMENT       TEXT
              , RBC_COMMENT       TEXT
              , MAX_WBC_COUNT     TEXT
              , MAX_RBC_COUNT     TEXT
              , SERIAL_NO         TEXT
              , TACT_TIME         TEXT
              , IS_NS_NB_INTEGRATION    TEXT
              , IS_NORMAL         TEXT
              , IS_CHECKED        TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_TEST_HISTORY ON TB_TEST_HISTORY (
              SLOT_ID
              , CASSET_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_CLASSIFICATION (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , CLASS_ID          TEXT
              , CLASS_NM          TEXT
              , CLASS_TITLE       TEXT
              , COUNT             TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_WBC_CLASSIFICATION ON TB_WBC_CLASSIFICATION (
              SLOT_ID
              , CASSET_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_CLASSIFICATION_HIST (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , CLASS_ID          TEXT
              , CLASS_NM          TEXT
              , CLASS_TITLE       TEXT
              , COUNT             TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_WBC_CLASSIFICATION_HIST ON TB_WBC_CLASSIFICATION_HIST (
              SLOT_ID
              , CASSET_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_RBC_CATEGORY (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , CATEGORY_ID       TEXT
              , CATEGORY_NM       TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, CATEGORY_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_RBC_CATEGORY ON TB_RBC_CATEGORY (
              SLOT_ID
              , CASSET_ID
              , CATEGORY_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_RBC_CLASSIFICATION (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , CATEGORY_ID       TEXT
              , CLASS_ID          TEXT
              , CLASS_NM          TEXT
              , DEGREE            TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, CATEGORY_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_RBC_CLASSIFICATION ON TB_RBC_CLASSIFICATION (
              SLOT_ID
              , CASSET_ID
              , CATEGORY_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_RBC_CLASSIFICATION_HIST (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , CATEGORY_ID       TEXT
              , CLASS_ID          TEXT
              , CLASS_NM          TEXT
              , DEGREE            TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, CATEGORY_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_RBC_CLASSIFICATION_HIST ON TB_RBC_CLASSIFICATION_HIST (
              SLOT_ID
              , CASSET_ID
              , CATEGORY_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_BF_WHOLE_SLIDE_PATH (
              CASSET_ID            TEXT
              , SLOT_ID            TEXT
              , SEQ_NO             TEXT
              , PATH               TEXT
              , IS_HIGH_POWER_SCAN TEXT
              , CREATE_DTTM        TEXT
              , CREATE_ID          TEXT
              , MODIFY_DTTM        TEXT
              , MODIFY_ID          TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, SEQ_NO)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_BF_WHOLE_SLIDE_PATH ON TB_BF_WHOLE_SLIDE_PATH (
              SLOT_ID
              , CASSET_ID
              , SEQ_NO
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_USER_AUTHORITY (
              AUTH_CD             TEXT
              , AUTH_NM           TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(AUTH_CD)
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_USER (
              USER_ID             TEXT
              , USER_NM           TEXT
              , EMP_NO            TEXT
              , POSITION          TEXT
              , AUTH_CD           TEXT
              , ENC_PWD           TEXT
              , IS_AVAILABLE      TEXT
              , LOGIN_DTTM        TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(USER_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_USER ON TB_USER (
              USER_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_IMAGE_HIST (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , CLASS_ID          TEXT
              , FILE_NM           TEXT
              , CURRENT_CLASS_ID  TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, CLASS_ID, FILE_NM)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_WBC_IMAGE_HIST ON TB_WBC_IMAGE_HIST (
              SLOT_ID
              , CASSET_ID
              , CLASS_ID
              , FILE_NM
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_RBC_DEGREE_VAL (
              CATEGORY_ID         TEXT
              , CLASS_ID          TEXT
              , DEGREE_1          REAL
              , DEGREE_2          REAL
              , DEGREE_3          REAL
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CATEGORY_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_RBC_DEGREE_VAL ON TB_RBC_DEGREE_VAL (
              CATEGORY_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_HOT_KEY (
              HOT_KEY_TYPE        TEXT
              , CLASS_ID          TEXT
              , CLASS_TITLE       TEXT
              , CLASS_NM          TEXT
              , HOT_KEY           TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(HOT_KEY_TYPE, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_HOT_KEY ON TB_HOT_KEY (
              HOT_KEY_TYPE
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_COMMON_CODE_GRP (
              GRP_CD              TEXT
              , GRP_NM            TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(GRP_CD)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_COMMON_CODE_GRP ON TB_COMMON_CODE_GRP (
              GRP_CD
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_COMMON_CODE (
              GRP_CD              TEXT
              , CD                TEXT
              , CD_NM             TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(GRP_CD, CD)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_COMMON_CODE ON TB_COMMON_CODE (
              GRP_CD
              , CD
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_CUSTOM_CLASS (
              CLASS_ID            TEXT
              , CLASS_TITLE       TEXT
              , CLASS_NM          TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_WBC_CUSTOM_CLASS ON TB_WBC_CUSTOM_CLASS (
              CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_LIS_CONN_PATH (
              DEVICE_BARCODE      TEXT
              , LIS_FILE_PATH     TEXT
              , LIS_URL           TEXT
              , LIS_CONN_TYPE_CD  TEXT
              , CBC_FILE_PATH     TEXT
              , CBC_URL           TEXT
              , CBC_CONN_TYPE_CD  TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(DEVICE_BARCODE)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_LIS_CONN_PATH ON TB_LIS_CONN_PATH (
              DEVICE_BARCODE
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_LIS_TEST_CODE (
              IA_CD               TEXT
              , LIS_CD            TEXT
              , CD_NM             TEXT
              , MIN_COUNT         TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(IA_CD)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_LIS_TEST_CODE ON TB_LIS_TEST_CODE (
              IA_CD
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_LIS_TEST_CODE_RBC (
              IA_CATEGORY_CD      TEXT
              , IA_CLASS_CD       TEXT
              , LIS_CD            TEXT
              , CATEGORY_NM       TEXT
              , CLASS_NM          TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(IA_CATEGORY_CD, IA_CLASS_CD)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_LIS_TEST_CODE_RBC ON TB_LIS_TEST_CODE_RBC (
              IA_CATEGORY_CD
              , IA_CLASS_CD
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_CBC_TEST_CODE (
              IA_CD               TEXT
              , CBC_CD            TEXT
              , CD_NM             TEXT
              , IS_SELECTED       TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(IA_CD)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_CBC_TEST_CODE ON TB_CBC_TEST_CODE (
              IA_CD
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_BACKUP_HIST (
              BACKUP_SEQ_ID       INTEGER
              , CASSET_ID         TEXT
              , SLOT_ID           TEXT
              , IS_BACKUP         TEXT
              , BACKUP_DTTM       TEXT
              , RESTORE_DTTM      TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(BACKUP_SEQ_ID AUTOINCREMENT)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_BACKUP_HIST ON TB_BACKUP_HIST (
              BACKUP_SEQ_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_VIEWER_LOCK_INFO (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , USER_ID           TEXT
              , MACHINE_ID        TEXT
              , HOST_IP           TEXT
              , LOCAL_IP          TEXT
              , LOCK_STATE        TEXT
              , LOCK_DTTM         TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_VIEWER_LOCK_INFO ON TB_VIEWER_LOCK_INFO (
              CASSET_ID
              , SLOT_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_NORMAL_RANGE (
              ANALYSIS_TYPE       TEXT
              , CLASS_ID          TEXT
              , CLASS_TITLE       TEXT
              , CLASS_NM          TEXT
              , MIN               TEXT
              , MAX               TEXT
              , UNIT              TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(ANALYSIS_TYPE, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_SKMC_RESULT_CD (
              RESULT_CD           TEXT
              , RESULT_CD_NM      TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(RESULT_CD)
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_SKMC_RESULT_FAVORITE_RBC (
              RESULT_CD              TEXT
              , SIZE_CD              TEXT
              , CHROMICITY_CD        TEXT
              , ANISOCYTOSIS_CD      TEXT
              , POIKILOCYTOSIS_CD    TEXT
              , ELLIPTOCYTE_CD       TEXT
              , BURRCELL_CD          TEXT
              , TARGET_CELL_CD       TEXT
              , SPHEROCYTE_CD        TEXT
              , SCHISTOCYTE_CD       TEXT
              , DIMORPHISM_CD        TEXT
              , ROULEAUX_CD          TEXT
              , POLYCHROMASIA_CD     TEXT
              , BASO_CD              TEXT
              , H_J_BODY_CD          TEXT
              , NRBC_CD              TEXT
              , OTHER_CD             TEXT
              , CREATE_DTTM          TEXT
              , CREATE_ID            TEXT
              , MODIFY_DTTM          TEXT
              , MODIFY_ID            TEXT
              , PRIMARY KEY(RESULT_CD)
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_SKMC_RESULT_FAVORITE_WBC (
              RESULT_CD              TEXT
              , NUMBER_CD            TEXT
              , TOXIC_GRANULE_CD     TEXT
              , TOXIC_VACUOLE_CD     TEXT
              , DOHLE_BODY_CD        TEXT
              , L_S_MATURATION_CD    TEXT
              , N_SEGMENTATION_CD    TEXT
              , OTHER_CD             TEXT
              , CREATE_DTTM          TEXT
              , CREATE_ID            TEXT
              , MODIFY_DTTM          TEXT
              , MODIFY_ID            TEXT
              , PRIMARY KEY(RESULT_CD)
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_SKMC_RESULT_FAVORITE_PLT (
              RESULT_CD              TEXT
              , NUMBER_CD            TEXT
              , SIZE_CD              TEXT
              , CLUMPING_CD          TEXT
              , CREATE_DTTM          TEXT
              , CREATE_ID            TEXT
              , MODIFY_DTTM          TEXT
              , MODIFY_ID            TEXT
              , PRIMARY KEY(RESULT_CD)
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_SKMC_REMARK (
              REMARK_CD              TEXT
              , REMARK_CONTENTS      TEXT
              , CREATE_DTTM          TEXT
              , CREATE_ID            TEXT
              , MODIFY_DTTM          TEXT
              , MODIFY_ID            TEXT
              , PRIMARY KEY(REMARK_CD)
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_SKMC_MAPPING_REMARK (
              RESULT_CD              TEXT
              , REMARK_CD            TEXT
              , CREATE_DTTM          TEXT
              , CREATE_ID            TEXT
              , MODIFY_DTTM          TEXT
              , MODIFY_ID            TEXT
              , PRIMARY KEY(RESULT_CD, REMARK_CD)
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_SKMC_FAVORITE_REMARK (
              RESULT_CD              TEXT
              , REMARK_CD            TEXT
              , SEQ_NO               TEXT
              , REMARK_CONTENTS      TEXT
              , CREATE_DTTM          TEXT
              , CREATE_ID            TEXT
              , MODIFY_DTTM          TEXT
              , MODIFY_ID            TEXT
              , PRIMARY KEY(RESULT_CD, REMARK_CD, SEQ_NO)
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_RUNNING_COUNT (
              ID                     TEXT
              , MIN                  TEXT
              , MAX                  TEXT
              , COUNT                TEXT
              , CREATE_DTTM          TEXT
              , CREATE_ID            TEXT
              , MODIFY_DTTM          TEXT
              , MODIFY_ID            TEXT
              , PRIMARY KEY(ID)
            )`, [], arg => {
        })
      }
    })

    db.configure('busyTimeout', 5000)
  }

  return db
}

async function init (path) {
  log.info('dbRootPath : ' + path)

  dbRootPath = path
  let db = await connect()

  return new Promise(function(succ, fail) {
    try {
      if (db || db.open) {
        succ('init success')
      } else {
        fail(new Error('init failed'))
      }

    } catch (err) {
      log.info(err.message)
      fail(err)

    }
  })

}

async function insert (sql, args) {
  let db = await connect()

  return new Promise(function(succ, fail) {
    try {
      if(args == undefined || args == null) {
        args = []
      }

      log.info(sql)
      log.info(args)

      db.run(sql, args, function(err, arg) {
        if (err) {
          log.info(err.message)
          fail(err)
        } else {
          succ('insert success')
        }
      })
    } catch (err) {
      log.info(err.message)
      fail(err)
    }
  })
}

async function select (sql, args) {
  let db = await connect()

  return new Promise(function(succ, fail) {
    try {
      if(args == undefined || args == null) {
        args = []
      }

      log.info(sql)
      log.info(args)

      db.get(sql, args, function(err, row) {
        if (err) {
          log.info(err.message)
          fail(err)
        } else {
          succ(row)
        }
      })
    } catch (err) {
      log.info(err.message)
      fail(err)
    }
  })
}

async function selectAll (sql, args) {
  var db = await connect()

  return new Promise(function(succ, fail) {
    try {
      if(args == undefined || args == null) {
        args = []
      }

      log.info(sql)
      log.info(args)
      log.info(db)

      db.all(sql, args, function (err, rows) {
        if (err) {
          log.info(err.message)
          fail(err)
        } else {
          succ(rows)
        }
      })

    } catch (err) {
      log.info(err.message)
      fail(err)
    }
  })
}

async function deleteRows(sql, args) {
  let db = await connect()

  return new Promise(function(succ, fail) {
    try {

      log.info(sql)
      log.info(args)

      if(args == undefined || args == null) {
        args = []
      }

      db.run(sql, args, function (err, arg) {
        if (err) {
          log.info(err.message)
          fail(err)
        } else {
          succ('delete success')
        }
      })
    } catch (err) {
      log.info(err.message)
      fail(err)
    }
  })
}

async function update(sql, args) {
  let db = await connect()

  return new Promise(function(succ, fail) {
    try {
      log.info(sql)
      log.info(args)

      if(args == undefined || args == null) {
        args = []
      }

      db.run(sql, args, function (err, arg) {
        if (err) {
          log.info(err.message)
          fail(err)
        } else {
          succ('update success')
        }
      })
    } catch (err) {
      log.info(err.message)
      fail(err)
    }
  })
}

async function alterTable(sql, args, table, column) {
  let db = await connect()

  return new Promise(function(succ, fail) {
    try {
      var columnCheckSql = "SELECT (CASE WHEN COUNT(*) > 0 THEN 'Y'\n" +
                                		 "ELSE 'N'\n" +
                                		"END) AS IS_ADDED\n" +
                            "FROM sqlite_master\n" +
                           "WHERE name=" + '\'' + table + '\'\n' +
                           "AND sql LIKE "  + '\'%' + column + '%\''

      log.info(columnCheckSql)
      db.get(columnCheckSql, {}, function (err, arg) {
        log.info(err)
        if (!err) {
          log.info('arg.IS_ADDED : ' + arg.IS_ADDED)

          if (arg.IS_ADDED === 'N') {
            log.info(sql)
            log.info(args)

            if(args == undefined || args == null) {
              args = []
            }

            db.run(sql, args, function (err, arg) {
              if (err) {
                log.info(err.message)
                fail(err)
              } else {
                succ('alter table success')
              }
            })
          }
        }
      })
    } catch (err) {
      log.info(err.message)
      fail(err)
    }
  })
}

async function dbClose() {
  if (db || db.open) {
    db.close( function (err) {
      log.info(err)
    })

    db = null
  }
}

export default {
  async INIT_DATABASE (path) {
    return await init(path)
  },
  async INSERT (sql, args) {
    return await insert(sql, args)
  },
  async SELECT (sql, args) {
    return await select(sql, args)
  },
  async SELECT_ALL (sql, args) {
    return await selectAll(sql, args)
  },
  async DELETE (sql, args) {
    return await deleteRows(sql, args)
  },
  async UPDATE (sql, args) {
    return await update(sql, args)
  },
  async ALTER_TABLE (sql, args, table, column) {
    return await alterTable(sql, args, table, column)
  },
  async SHUTDOWN () {
    return await dbClose()
  }
}

// process.on('message', (message) => {
//   try {
//     switch (message.msg) {
//       case 'INIT': {
//         try {
//           dbRootPath = message.path
//           log.info('dbRootPath : ' + dbRootPath)
//
//           let db = connect()
//           if (!db || !db.open) {
//             process.send({msg: 'INIT_SUCCESS'})
//           } else {
//             process.send({msg: 'INIT FAILED'})
//           }
//         } catch (err) {
//           log.info(err.message)
//           process.send({msg: 'INIT FAILED : ' + err.message})
//         }
//         break
//       }
//       case 'INSERT': {
//         try {
//           let db = connect()
//
//           log.info(message.sql)
//           log.info(message.args)
//
//           db.run(message.sql, message.args, (err, arg) => {
//             if (err) {
//               process.send({msg: 'INSERT FAILED : ' + err.message})
//               // db.run('ROLLBACK')
//             } else {
//               process.send({msg: 'INSERT_SUCCESS', succMsg: message.succMsg, rows: arg})
//             }
//           })
//         } catch (err) {
//           process.send({msg: 'INSERT FAILED : ' + err.message})
//         }
//         break
//       }
//       case 'SELECT': {
//         try {
//           let db = connect()
//           if(message.args == undefined || message.args == null) {
//             message.args = []
//           }
//
//           log.info(message.sql)
//           log.info(message.args)
//           db.get(message.sql, message.args, (err, arg) => {
//             if (err) {
//               process.send({msg: 'SELECT FAILED : ' + err.message})
//             } else {
//               process.send({msg: 'SELECT_SUCCESS', succMsg: message.succMsg, rows: arg})
//             }
//           })
//         } catch (err) {
//           process.send({msg: 'SELECT FAILED : ' + err.message})
//         }
//         break
//       }
//       case 'SELECT_ALL': {
//         try {
//           let db = connect()
//           if(message.args == undefined || message.args == null) {
//             message.args = []
//           }
//
//           log.info(message.sql)
//           log.info(message.args)
//           db.all(message.sql, message.args, (err, arg) => {
//             if (err) {
//               process.send({msg: 'SELECT_ALL FAILED : ' + err.message})
//             } else {
//               process.send({msg: 'SELECT_ALL_SUCCESS', succMsg: message.succMsg, rows: arg})
//             }
//           })
//         } catch (err) {
//           process.send({msg: 'SELECT_ALL FAILED : ' + err.message})
//         }
//         break
//       }
//       case 'DELETE': {
//         try {
//           let db = connect()
//
//           log.info(message.sql)
//           log.info(message.args)
//           db.run(message.sql, message.args, (err, arg) => {
//             if (err) {
//               process.send({msg: 'DELETE FAILED : ' + err.message})
//             } else {
//               process.send({msg: 'DELETE_SUCCESS'})
//             }
//           })
//         } catch (err) {
//           process.send({msg: 'DELETE FAILED : ' + err.message})
//         }
//         break
//       }
//       case 'UPDATE': {
//         try {
//           let db = connect()
//
//           log.info(message.sql)
//           log.info(message.args)
//           log.info(message.isCommit)
//
//           db.run(message.sql, message.args, (err, arg) => {
//             if (err) {
//               process.send({msg: 'UPDATE FAILED : ' + err.message})
//             } else {
//               process.send({msg: 'UPDATE_SUCCESS', succMsg: message.succMsg, rows: arg, isCommit: message.isCommit})
//             }
//           })
//
//         } catch (err) {
//           process.send({msg: 'UPDATE FAILED : ' + err.message})
//         }
//         break
//       }
//       case 'ALTER_TABLE': {
//         try {
//           let db = connect()
//
//           var columnCheckSql = "SELECT (CASE WHEN COUNT(*) > 0 THEN 'Y'\n" +
//                                     		 "ELSE 'N'\n" +
//                                     		"END) AS IS_ADDED\n" +
//                                 "FROM sqlite_master\n" +
//                                "WHERE name=" + '\'' + message.table + '\'\n' +
//                                "AND sql LIKE "  + '\'%' + message.column + '%\''
//
//           log.info(columnCheckSql)
//           db.get(columnCheckSql, {}, (err, arg) => {
//             log.info(err)
//             if (!err) {
//               log.info('arg.IS_ADDED : ' + arg.IS_ADDED)
//
//               if (arg.IS_ADDED === 'N') {
//                 log.info(message.sql)
//                 log.info(message.args)
//
//                 db.run(message.sql, message.args, (err, arg) => {
//                   if (err) {
//                     process.send({msg: 'ALTER_TABLE FAILED : ' + err.message})
//                   } else {
//                     process.send({msg: 'ALTER_TABLE_SUCCESS'})
//                   }
//                 })
//               }
//             }
//           })
//         } catch (err) {
//           process.send({msg: 'ALTER_TABLE FAILED : ' + err.message})
//         }
//         break
//       }
//       case 'SHUTDOWN': {
//         process.exit(0)
//         break
//       }
//       case 'CLOSE': {
//         if (db || db.open) {
//           db.close((err) => {
//             log.info(err)
//           })
//
//           db = null
//         }
//         break
//       }
//       case 'BEGIN': {
//         db.run('BEGIN TRANSACTION', [], (err, arg) => {
//           if (err) {
//             log.info(err)
//           }
//         })
//         break
//       }
//       case 'COMMIT': {
//         db.run('END TRANSACTION', [], (err, arg) => {
//           if (err) {
//             log.info(err)
//           }
//         })
//         break
//       }
//       case 'ROLLBACK': {
//         db.run('ROLLBACK', [], (err, arg) => {
//           if (err) {
//             log.info(err)
//           }
//         })
//         break
//       }
//       default:
//         throw new Error('Unrecognized message received by sqlite3')
//     }
//   } catch (e) {
//     log.info(e)
//   }
// })

// module.exports = {}
