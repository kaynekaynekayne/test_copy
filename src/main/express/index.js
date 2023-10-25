import ImageRouter from './routes/image.js'
import ImagesRouter from './routes/images.js'
import CustomClass from './routes/custom_class.js'
import Classification from './routes/classification.js'
import XlsxData from './routes/xlsx_data.js'
import Slide from './routes/slide.js'
import Lock from './routes/lock.js'
import Class from './routes/class.js'
import HotKey from './routes/hotKey.js'
import Marker from './routes/marker.js'
import MainData from './routes/main_data.js'
import File from './routes/file.js'
import Directory from './routes/directory.js'

import Configs from '../../Configs.js'

const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const fs = require('fs')
const dotenv = require('dotenv')
const log = require('electron-log')

// const cors = require('cors')
// app.use(cors())

app.use(fileUpload())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ limit:'50mb', extended: false }))

app.use(Configs.API_VERSION + 'image', ImageRouter)
app.use(Configs.API_VERSION + 'images', ImagesRouter)
app.use(Configs.API_VERSION + 'customClass', CustomClass)
app.use(Configs.API_VERSION + 'classification', Classification)
app.use(Configs.API_VERSION + 'xlsx', XlsxData)
app.use(Configs.API_VERSION + 'slide', Slide)
app.use(Configs.API_VERSION + 'lockState', Lock)
app.use(Configs.API_VERSION + 'class', Class)
app.use(Configs.API_VERSION + 'hotKey', HotKey)
app.use(Configs.API_VERSION + 'marker', Marker)
app.use(Configs.API_VERSION + 'mainData', MainData)
app.use(Configs.API_VERSION + 'file', File)
app.use(Configs.API_VERSION + 'directory', Directory)

app.listen(18088, () => {
  log.info('server listen')
})
