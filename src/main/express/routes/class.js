import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()

router.use(function(req, res, next) {
  console.log('middleware for class!')
  next()
})

router.post('/count', async function (req, res) {
  try {
    var retObj = {}
    var classList = req.body.classList

    classList.forEach(async function(classItem) {
      var args = []
      args.push(classItem.count)
      args.push(req.body.cassetId)
      args.push(req.body.slotId)
      args.push(classItem.id)

      await MySql.UPDATE(query.UPDATE_CLASS_COUNT, args)
    })

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
