import express from 'express'
import Configs from '../../../Configs.js'

const router = express.Router()
const fs = require('fs')

function getDirectoryFiles(path, req, imgResults) {
  fs.accessSync(path, fs.constants.F_OK)
  var files = fs.readdirSync(path)
  files.forEach(function(file, index) {
    var curPath = path + "/" + file
    var stats = fs.lstatSync(curPath)
    if (stats.isDirectory()) {
      getDirectoryFiles(curPath, req, imgResults)
    } else {
      var url = 'http://' + req.headers.host + Configs.API_VERSION + 'image?path=' + curPath
      imgResults.push(url)
    }
  })
}

router.use(function(req, res, next) {
  console.log('middleware for images!')
  next()
})

router.get('/', async function (req, res) {
  try {
    var path = req.query.path
    var retObj = {}

    console.log(path)
    var imgResults = []
    getDirectoryFiles(path, req, imgResults)

    retObj.errorCode = 'E0000'
    retObj.errorMessage = ''
    retObj.results = imgResults

    res.status(201).send(retObj)
  } catch (err) {
    console.log(err)
    retObj.errorCode = err.code
    retObj.errorMessage = err.message
    retObj.results = []

    res.status(201).send(retObj)
  }
})

export default router
