import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'
import store from '../../../renderer/store'

const router = express.Router()
const fs = require('fs')

router.use(function(req, res, next) {
  console.log('middleware for main_data!')
  next()
})

router.get('/', async function (req, res) {
  var retObj = {}
  var sysInfo = store.getters.getSysInfo
  var backendData = store.getters.getBackendData

  retObj.errorCode = 'E0000'
  retObj.errorMessage = ''
  retObj.results = {sysInfo: sysInfo, backendData: backendData}
  
  res.status(201).send(retObj)
})

router.post('/', async function (req, res) {
  res.status(201).send('POST: ')
})

export default router
