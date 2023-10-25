import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()

router.use(function(req, res, next) {
  console.log('middleware for custom class!')
  next()
})

router.get('/', async function (req, res) {
  try {
    var retObj = {}
    var customClassList = await MySql.SELECT(query.SELECT_WBC_CUSTOM_CLASS)

    retObj.errorCode = 'E0000'
    retObj.errorMessage = ''
    retObj.results = customClassList
    res.status(201).send(retObj)

  } catch (err) {
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []
    res.status(201).send(retObj)
  }
})

export default router
