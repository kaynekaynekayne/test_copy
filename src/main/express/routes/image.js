import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()
const fs = require('fs')

router.use(function(req, res, next) {
  console.log('middleware for image!')
  next()
})

router.get('/', async function (req, res) {
  var path = req.query.path

  fs.access(path, fs.constants.F_OK, function(err) {
    if (err) {
      res.status(404).send('not found')
    } else {
      res.sendFile(path)
    }
  })
})

router.post('/:type', async function (req, res) {
  try {
    var type = req.params.type

    if (type === 'malaria') {
      var retObj = {}
      var path = req.body.path
      var fileList = req.body.fileList
      var args = []

      var connection = null
      connection = await MySql.GET_CONNECTION()

      await MySql.BEGIN_TRANSACTION()

      fileList.forEach(async function(file) {
        // move file
        var srcPath = path + '/' + file.srcId + '/' + file.fileName
        var destPath = path + '/' + file.targetId + '/' + file.fileName

        console.log(srcPath)
        console.log(destPath)

        fs.rename(srcPath, destPath, async function(err) {
          console.log(err)
          if (err) {
            await MySql.ROLLBACK()

            retObj.errorCode = err.code
            retObj.errorMessage = err.message
            retObj.results = []

            res.status(201).send(retObj)
          } else {
            var updataMalaArgs = []
            updataMalaArgs.push(Number(req.body.malariaCount))
            updataMalaArgs.push(req.body.userId)
            updataMalaArgs.push(req.body.slotId)

            await MySql.UPDATE(query.UPDATE_MALARIA_COUNT, updataMalaArgs)
            await MySql.COMMIT()

            retObj.errorCode = 'E0000'
            retObj.errorMessage = ''
            retObj.results = []
            res.status(201).send(retObj)
          }
        })
      })
    } else {
      var retObj = {}
      var path = req.body.path
      var fileList = req.body.fileList
      var sql = query.IS_WBC_CLASSIFICATION
      var args = []

      console.log(req.body)
      var connection = null
      connection = await MySql.GET_CONNECTION()

      await MySql.BEGIN_TRANSACTION()

      if (fileList[0].targetClassId) {
        args.push(req.body.slotId)
        sql += `\n AND CLASS_ID = ` + fileList[0].targetClassId

        var isInsert = await MySql.SELECT(sql, args)
        if (isInsert === 'N') {
          var insertArgs = []
          insertArgs.push(req.body.cassetId)
          insertArgs.push(req.body.slotId)
          insertArgs.push(fileList[0].targetClassId)
          insertArgs.push(fileList[0].targetTitle)
          insertArgs.push(fileList[0].targetTitle)
          insertArgs.push(req.body.userId)
          insertArgs.push(req.body.userId)

          await MySql.INSERT(query.INSERT_WBC_CLASSIFICATION, insertArgs)
        }

        var updateArgs = []
        updateArgs.push(fileList[0].srcClassId)
        updateArgs.push(req.body.length)
        updateArgs.push(fileList[0].targetClassId)
        updateArgs.push(req.body.length)
        updateArgs.push(req.body.userId)
        updateArgs.push(req.body.cassetId)
        updateArgs.push(req.body.slotId)
        updateArgs.push(fileList[0].srcClassId)
        updateArgs.push(fileList[0].targetClassId)

        await MySql.UPDATE(query.UPDATE_WBC_CLASSIFICATION, updateArgs)

        fileList.forEach(async function(file) {
          // move file
          var srcPath = path + '/' + file.srcClassId + '_' + file.srcTitle + '/' + file.fileName
          var destPath = path + '/' + file.targetClassId + '_' + file.targetTitle + '/' + file.fileName

          console.log(srcPath)
          console.log(destPath)

          fs.rename(srcPath, destPath, async function(err) {
            console.log(err)
            if (err) {
              await MySql.ROLLBACK()

              retObj.errorCode = err.code
              retObj.errorMessage = err.message
              retObj.results = []

              res.status(201).send(retObj)
            } else {
              var insertHistArgs = []
              insertHistArgs.push(req.body.cassetId)
              insertHistArgs.push(req.body.slotId)
              insertHistArgs.push(file.srcClassId)
              insertHistArgs.push(file.fileName)
              insertHistArgs.push(file.targetClassId)
              insertHistArgs.push(req.body.userId)
              insertHistArgs.push(req.body.userId)
              // update params
              insertHistArgs.push(file.targetClassId)
              insertHistArgs.push(req.body.userId)

              await MySql.INSERT(query.INSERT_WBC_IMAGE_HIST, insertHistArgs)
            }
          })
        })

        var selectArgs = []
        selectArgs.push(req.body.cassetId)
        selectArgs.push(req.body.slotId)
        selectArgs.push(fileList[0].srcClassId)
        selectArgs.push(fileList[0].targetClassId)

        var results = await MySql.SELECT(query.SELECT_WBC_CLASSIFICATION, selectArgs)

        await MySql.COMMIT()

        retObj.errorCode = 'E0000'
        retObj.errorMessage = ''
        retObj.results = results
        res.status(201).send(retObj)
      }
    }
  } catch (err) {
    console.log('catch err')
    console.log(err)

    await MySql.ROLLBACK()

    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []

    res.status(201).send(retObj)
  }
})

router.put('/:id', async function (req, res) {
  res.status(201).send('PUT: /image/:id');
})

router.delete('/:id', async function (req, res) {
  res.status(201).send('DELETE: /image/:id')
})

export default router
