import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()

router.use(function(req, res, next) {
  console.log('middleware for lock!')
  next()
})

router.get('/', async function (req, res) {
  try {
    var retObj = {}
    var args = []

    args.push(req.query.cassetId)
    args.push(req.query.slotId)

    var lockInfo = await MySql.SELECT(query.CHECK_SLIDE_LOCK_STATE, args)

    retObj.errorCode = 'E0000'
    retObj.errorMessage = ''
    retObj.results = lockInfo
    res.status(201).send(retObj)

  } catch (err) {
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []
    res.status(201).send(retObj)
  }
})

router.post('/', async function (req, res) {
  try {
    var retObj = {}
    var args = []

    args.push(req.body.lockState)
    // args.push(req.body.유저아이디)
    args.push(req.body.cassetId)
    args.push(req.body.slotId)

    await MySql.UPDATE(query.UPDATE_SLIDE_LOCK_STATE, args)

    retObj.errorCode = 'E0000'
    retObj.errorMessage = ''
    retObj.results = []
    res.status(201).send(retObj)

  } catch (err) {
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []
    res.status(201).send(retObj)
  }
})

export default router
