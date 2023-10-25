import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()
const fs = require('fs')

router.use(function(req, res, next) {
  console.log('middleware for directory!')
  next()
})

router.get('/', async function (req, res) {
  res.status(201).send('POST: /directory/:id')
})

router.post('/', async function (req, res) {
  var path = req.body.path
  var retObj = {}

  console.log('delete directory : ' + path)
  if (path) {
    fs.access(path, function(err) {
      // 폴더 없으면 생성
      if (err) {
        fs.mkdir(path, {recursive: true}, function(err) {
          if (err) {
            retObj.errorCode = err.code
            retObj.errorMessage = err.message
            retObj.results = path
            res.status(201).send(retObj)
          } else {
            retObj.errorCode = 'E0000'
            retObj.errorMessage = ''
            retObj.results = path
            res.status(201).send(retObj)
          }
        })
      } else {
        retObj.errorCode = 'E0000'
        retObj.errorMessage = ''
        retObj.results = path
        res.status(201).send(retObj)
      }
    })
  } else {
    retObj.errorCode = 'E9999'
    retObj.errorMessage = ''
    retObj.results = null
    res.status(201).send(retObj)
  }
})

router.put('/:id', async function (req, res) {
  res.status(201).send('PUT: /directory/:id');
})

router.delete('/:id', async function (req, res) {
  res.status(201).send('DELETE: /directory/:id')
})

export default router
