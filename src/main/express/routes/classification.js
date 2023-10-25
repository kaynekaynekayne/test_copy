import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()
const fs = require('fs')

router.use(function(req, res, next) {
  console.log('middleware for classification!')
  next()
})

router.get('/:type', async function (req, res) {
  console.log(req.params.type)
    try {
      var retObj = {}

      var type = req.params.type

      if (type === 'wbc') {
        var args = []
        args.push(req.query.cassetId)
        args.push(req.query.slotId)
        if (req.query.testType === '01' || req.query.testType === '04') {
          args.push('01')
        } else {
          args.push('02')
        }

        var wbcResults = await MySql.SELECT(query.SELECT_WBC_CLASSIFICATION_SLIDE, args)

        retObj.errorCode = 'E0000'
        retObj.errorMessage = ''
        retObj.results = {wbcResults: wbcResults,
                          rbcResults: []}

        res.status(201).send(retObj)
      } else if (type === 'rbc') {
        var args = []
        args.push(req.query.cassetId)
        args.push(req.query.slotId)
        var rbcResults = await MySql.SELECT(query.SELECT_RBC_CLASSIFICATION_SLIDE, args)

        retObj.errorCode = 'E0000'
        retObj.errorMessage = ''
        retObj.results = {wbcResults: [],
                          rbcResults: rbcResults}

        res.status(201).send(retObj)
      } else {
        var argsWbc = []
        argsWbc.push(req.query.cassetId)
        argsWbc.push(req.query.slotId)
        if (req.query.testType === '01' || req.query.testType === '04') {
          argsWbc.push('01')
        } else {
          argsWbc.push('02')
        }

        var argsRbc = []
        argsRbc.push(req.query.cassetId)
        argsRbc.push(req.query.slotId)

        var wbcResults = await MySql.SELECT(query.SELECT_WBC_CLASSIFICATION_SLIDE, argsWbc)
        var rbcResults = await MySql.SELECT(query.SELECT_RBC_CLASSIFICATION_SLIDE, argsRbc)

        retObj.errorCode = 'E0000'
        retObj.errorMessage = ''
        retObj.results = {wbcResults: wbcResults,
                          rbcResults: rbcResults}

        res.status(201).send(retObj)
      }
    } catch (err) {
      retObj.errorCode = err.code
      retObj.errorMessage = err.message
      retObj.results = []

      res.status(201).send(retObj)
    }
})

router.post('/', async function (req, res) {
  res.status(201).send('POST: /image')
})

export default router
