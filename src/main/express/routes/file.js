import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()
const fs = require('fs')

router.use(function(req, res, next) {
  console.log('middleware for file!')
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

router.post('/', function (req, res) {
  var destPath = req.body.destPath
  var rbcPosition = req.body.rbcPosition
  var rbcPositionPath = req.body.rbcPositionPath
  var retObj = {}

  try {
    console.log(req.files.image)
    console.log(destPath)
    console.log(rbcPositionPath)
    console.log(rbcPosition)

    destPath += '/' + req.body.fileName
    fs.writeFile(destPath, req.files.image.data, function(err) {
      if (!err) {
        if (rbcPositionPath && rbcPosition) {
          // write json file
          fs.writeFile(rbcPositionPath, rbcPosition, function(err) {
            if (!err) {
              retObj.errorCode = 'E0000'
              retObj.errorMessage = ''
              retObj.results = destPath
              res.status(201).send(retObj)
            } else {
              retObj.errorCode = err.code
              retObj.errorMessage = err.message
              retObj.results = destPath
              res.status(201).send(retObj)
            }
          })
        } else {
          retObj.errorCode = 'E0000'
          retObj.errorMessage = ''
          retObj.results = destPath
          res.status(201).send(retObj)
        }
      } else {
        retObj.errorCode = err.code
        retObj.errorMessage = err.message
        retObj.results = destPath
        res.status(201).send(retObj)
      }
    })
  } catch (err) {
    console.log(retObj)
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = destPath
    res.status(201).send(retObj)
  }

})

router.put('/:id', async function (req, res) {
  res.status(201).send('PUT: /file/:id');
})

router.delete('/', async function (req, res) {
  var path = req.query.path
  var retObj = {}

  console.log('delete file : ' + path)

  fs.access(path, fs.constants.F_OK, function(err) {
    if (!err) {
      fs.unlink(path, function(err) {
        if (!err) {
          retObj.errorCode = 'E0000'
          retObj.errorMessage = ''
          retObj.results = path
          res.status(201).send(retObj)
        } else {
          retObj.errorCode = err.code
          retObj.errorMessage = err.message
          retObj.results = path
          res.status(201).send(retObj)
        }
      })
    } else {
      retObj.errorCode = err.code
      retObj.errorMessage = err.message
      retObj.results = path
      res.status(201).send(retObj)
    }
  })
})

export default router
