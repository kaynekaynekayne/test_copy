import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()

router.use(function(req, res, next) {
  console.log('middleware for xlsx data!')
  next()
})

router.get('/:type', async function (req, res) {
  try {
    var retObj = {}
    var type = req.params.type
    var args = req.query.slotIds

    if (type === 'matrix') {
      var ret = await MySql.SELECT(query.SELECT_WBC_MODIFY_LIST_ALL, args)
      retObj.errorCode = 'E0000'
      retObj.errorMessage = ''
      retObj.results = ret

      res.status(201).send(retObj)
    }

  } catch (err) {
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []

    res.status(201).send(retObj)
  }
})

export default router
