import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const fs = require('fs')
const router = express.Router()

router.use(function(req, res, next) {
  console.log('middleware for marker!')
  next()
})

router.get('/:fileName', async function (req, res) {
  try {
    var fileName = req.params.fileName
    var path = req.query.path + '/' + fileName
    var retObj = {}
    var args = []

    console.log("[marker] : " + path)

    fs.readFile(path, 'utf8', function(err, data) {
      if (err) {
        retObj.errorCode = err.code
        retObj.errorMessage = err.message
        retObj.results = []

        res.status(201).send(retObj)
      } else {
        retObj.errorCode = 'E0000'
        retObj.errorMessage = ''
        retObj.results = JSON.parse(data)

        res.status(201).send(retObj)
      }
    })

  } catch (err) {
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []
    res.status(201).send(retObj)
  }
})

export default router
