import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()

router.use(function(req, res, next) {
  console.log('middleware for hotkey!')
  next()
})

router.get('/', async function (req, res) {
  try {
    var type = req.params.type
    var retObj = {}
    var args = []
    var sql = query.SELECT_HOT_KEY

    var results = await MySql.SELECT(sql, args)

    retObj.errorCode = 'E0000'
    retObj.errorMessage = ''
    retObj.results = results
    res.status(201).send(retObj)

  } catch (err) {
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []
    res.status(201).send(retObj)
  }
})

router.get('/:type', async function (req, res) {
  try {
    var type = req.params.type
    var retObj = {}
    var args = []
    var sql = query.SELECT_HOT_KEY

    if (req.params.type) {
      sql += `AND HOT_KEY_TYPE = ?`
      args.push(req.params.type)
    }

    var results = await MySql.SELECT(sql, args)

    retObj.errorCode = 'E0000'
    retObj.errorMessage = ''
    retObj.results = results
    res.status(201).send(retObj)

  } catch (err) {
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []
    res.status(201).send(retObj)
  }
})

export default router
