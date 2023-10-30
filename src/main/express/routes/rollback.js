import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()
const fs = require('fs')

router.use(function(req, res, next) {
  console.log('middleware for rollback!')
  next()
})

router.post('/', async function (req, res) {
  try {
    console.log('rollback')
    var retObj = {}

    var cassetId = req.body.cassetId
    var slotId = req.body.slotId
    var srcPath = req.body.srcPath
    var srcArray = srcPath.split('/')
    var srcClassId = srcArray[srcArray.length - 2].split('_')[0]
    var destPath = req.body.destPath
    var destArray = destPath.split('/')
    var destClassId = destArray[destArray.length - 2].split('_')[0]
    var fileName = destArray[destArray.length - 1]

    var connection = null
    connection = await MySql.GET_CONNECTION()

    await MySql.BEGIN_TRANSACTION()

    // update wbc classification
    var wbcArgs = []
    wbcArgs.push(srcClassId)
    wbcArgs.push(1)
    wbcArgs.push(destClassId)
    wbcArgs.push(1)
    wbcArgs.push(req.body.userId)
    wbcArgs.push(req.body.cassetId)
    wbcArgs.push(req.body.slotId)
    wbcArgs.push(srcClassId)
    wbcArgs.push(destClassId)

    await MySql.UPDATE(query.UPDATE_WBC_CLASSIFICATION, wbcArgs)

    // update image hist
    var updateImageArgs = []
    updateImageArgs.push(srcClassId)
    updateImageArgs.push(req.body.userId)
    updateImageArgs.push(req.body.cassetId)
    updateImageArgs.push(req.body.slotId)
    updateImageArgs.push(fileName)

    await MySql.UPDATE(query.UPDATE_WBC_IMAGE_HIST, updateImageArgs)

    // update tb_rollback
    var updateRollbackArgs = []
    updateRollbackArgs.push('Y')
    updateRollbackArgs.push(req.body.userId)
    updateRollbackArgs.push(req.body.cassetId)
    updateRollbackArgs.push(req.body.slotId)
    updateRollbackArgs.push(srcPath)
    updateRollbackArgs.push(destPath)

    await MySql.UPDATE(query.UPDATE_IMAGE_ROLLBACK, updateRollbackArgs)

    fs.rename(destPath, srcPath, async function(err) {
      console.log(err)
      if (err) {
        await MySql.ROLLBACK()
        if (connection) {
          connection.release()
        }

        retObj.errorCode = err.code
        retObj.errorMessage = err.message
        retObj.results = []

        res.status(201).send(retObj)
      } else {
        await MySql.COMMIT()

        if (connection) {
          connection.release()
        }

        retObj.errorCode = 'E0000'
        retObj.errorMessage = ''
        retObj.results = []

        res.status(201).send(retObj)
      }
    })

  } catch (err) {
    console.log(err)

    await MySql.ROLLBACK()

    if (connection) {
      connection.release()
    }

    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []

    res.status(201).send(retObj)
  }
})

export default router
