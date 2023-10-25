import express from 'express'
import MySql from '../../mysql'
import query from '../../mysql/mysql_query.js'

const router = express.Router()
const fs = require('fs')

router.use(function(req, res, next) {
  console.log('middleware for slide!')
  next()
})

router.get('/', async function (req, res) {
  try {
    var retObj = {}
    var args = []
    var searchQuery = query.SEARCH_TEST_HISTORY_LIST

    console.log('get slide')
    console.log(req)
    args.push(Number(req.query.limit))
    args.push(Number(req.query.size))

    if (req.query.searchText !== '') {
      if (req.query.searchType === '01') {
        searchQuery += '\n AND PATIENT_ID LIKE ' + `'%` + req.query.searchText + `%'`
      } else if (req.query.searchType === '02') {
        searchQuery += '\n AND BARCODE_NO LIKE ' + `'%` + req.query.searchText + `%'`
      } else if (req.query.searchType === '03') {
        searchQuery += '\n AND PATIENT_NM LIKE ' + `'%` + req.query.searchText + `%'`
      }
    }

    if (req.query.startDate !== '' && req.query.endDate !== '') {
      searchQuery += `\n AND SUBSTR(ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')`

      args.push(req.query.startDate)
      args.push(req.query.endDate)
    }

    if (Number(req.query.nrCount) > 0) {
      searchQuery += `\n AND NR_COUNT <= ?`
      args.push(req.query.nrCount)
    }

    var tmpStr = ''
    var wbcClassList = JSON.parse(req.query.wbcClassList)
    if (wbcClassList.length > 0) {
      wbcClassList.forEach(function(value, index, array) {
        tmpStr += `'` + value + `'`

        if ((array.length - 1) !== (index)) {
          tmpStr += ','
        }
      })

      searchQuery += `\n AND SLOT_ID IN (SELECT IFNULL(MIN(SLOT_ID), 0) AS SLOT_ID
                                            FROM TB_WBC_CLASSIFICATION SB
                                           WHERE CASSET_ID = SB.CASSET_ID
                                             AND SLOT_ID = SB.SLOT_ID
                                             AND COUNT > 0
                                             AND CLASS_ID IN (%s)
                                            GROUP BY SB.SLOT_ID)`
      searchQuery = searchQuery.replace('%s', tmpStr)
    }

    if (req.query.wbcTotalSortCd === '01') {
      searchQuery += `\n ORDER BY WBC_TOTAL DESC`
    } else if (req.query.wbcTotalSortCd === '02') {
      searchQuery += `\n ORDER BY WBC_TOTAL ASC`
    } else {
      searchQuery += `\n ORDER BY ANALYZE_DTTM DESC`
    }

    console.log(searchQuery)

    var results = await MySql.SELECT(searchQuery, args)

    retObj.errorCode = 'E0000'
    retObj.errorMessage = ''
    retObj.results = results

    res.status(201).send(retObj)

  } catch (err) {
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = searchQuery

    res.status(201).send(retObj)
  }
})

router.post('/', async function (req, res) {
  res.status(201).send('POST: ')
})

export default router
