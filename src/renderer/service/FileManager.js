import axios from 'axios'

const fs = require('fs')
const fse = require('fs-extra')
const ncp = require('ncp').ncp
const path = require('path')
const filterExp = /^.png|.jpg|.bmp$/
const filterKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
const log = require('electron-log')
const cp = require('child_process')

async function getWbcFiles(params) {
  var wbcImages = []
  var classificationResult = []
  var imgCount = 0

  return new Promise(function(resolve, reject) {
    log.info('getWbcFiles')

    var accCount = 0

    // 클래스 디렉토리 순회
    params.classList.forEach(function(diffClass, index) {
      var dirName = diffClass.id + '_' + diffClass.title
      var classPath = params.classDir + '/' + dirName

      // 디렉터리 존재 여부 체크
      fs.access(classPath, fs.constants.F_OK, function(err) {
        if (!err) {
          // WBC 결과 폴더 탐색
          fs.readdir(classPath, function(err, files) {
            if (!err) {
              if (files) {
                var wbcFiles = files.filter(function(file) {
                  // console.log(file)
                  return filterExp.test(path.extname(file).toLowerCase()) && !filterKor.test(file)
                })

                var wbcFilesArray = []
                wbcFiles.forEach(function(wbcFile) {
                  wbcImages.push('file://' + classPath + '/' + wbcFile)
                  wbcFilesArray.push('file://' + classPath + '/' + wbcFile)
                })

                classificationResult.push({
                  id: diffClass.id,
                  title: diffClass.title,
                  name: diffClass.name,
                  images: wbcFilesArray,
                  dirName: dirName,
                  count: wbcFiles.length,
                  order: diffClass.order
                })

                // standard, primium
                if (params.selectItem.TEST_TYPE_CD === '01' || params.selectItem.TEST_TYPE_CD === '04') {
                  if (dirName !== '12_NR' && dirName !== '13_GP' &&
                    dirName !== '14_PA' && dirName !== '15_AR' &&
                    dirName !== '16_MA') {
                    imgCount += wbcFiles.length
                  }
                } else {
                  if (dirName !== '08_NR' && dirName !== '10_MC' && dirName !== '09_AR') {
                    imgCount += wbcFiles.length
                  }
                }

                if (accCount + 1 === params.classList.length) {
                  var res = {
                    classificationResult: classificationResult,
                    wbcImages: wbcImages,
                    imgCount: imgCount
                  }

                  resolve(res)
                }
              }

              accCount++

            } else {
              reject(err)
            }
          })
        } else {
          console.log(err.code)
          console.log(err.message)
          console.log(diffClass.id)

          if (err.code === 'ENOENT') {
            if (diffClass.id === '90' || diffClass.id === '91' ||
                diffClass.id === '92' || diffClass.id === '93' ||
                diffClass.id === '94') {
              createDir({path: classPath})
            }
          }

          var error = { err: err, classId: diffClass.id }
          reject(error)
        }
      })
    })
  })
}

async function getRbcFiles(params) {
  var rowImages = []

  log.info('getRbcFiles')

  return new Promise(function(resolve, reject) {
    fs.readdir(params.rbcImagePath, function(err, files) {
      if (!err) {
        if (files) {
          var rbcFiles = files.filter(function(file) {
            return filterExp.test(path.extname(file).toLowerCase()) && !filterKor.test(file)
          })

          rbcFiles.forEach(function(item) {
            rowImages.push('file://' + params.rbcImagePath + '/' + item)
          })

          resolve(rowImages)
        }
      } else {
        reject(err)
      }
    })
  })
}

function getWbcClassification (params) {
  log.info('getWbcClassification')

  return new Promise(function(resolve, reject) {
    // 퍼센트
    var percentTotal = 0
    var maxItem = null
    var siteCd = params.siteCd

    if (params.classificationResult !== '' && typeof(params.classificationResult) !== 'undefined') {
      params.classificationResult.forEach(function (item, index) {
        params.classificationResult[index].percent = ((params.classificationResult[index].count / params.imgCount) * 100).toFixed(0)

        // blast 조정
        if (item.title === 'BL') {
          if (Number(params.classificationResult[index].count) > 0) {
            if (Number(params.classificationResult[index].percent) >= 0 && Number(params.classificationResult[index].percent) <= 1) {
              params.classificationResult[index].percent = 1
            }
          }
        }

        // 인하대
        if (siteCd === '0011') {
          if (item.title === 'LA' || item.title === 'IM' || item.title === 'MB' || item.title === 'AM') {
            if (Number(params.classificationResult[index].count) > 0) {
              if (Number(params.classificationResult[index].percent) >= 0 && Number(params.classificationResult[index].percent) <= 1) {
                params.classificationResult[index].percent = 1
              }
            }
          }
        }

        if ((item.title !== 'NR' && item.title !== 'AR' &&
              item.title !== 'GP' && item.title !== 'PA' &&
              item.title !== 'MC' && item.title !== 'MA')) {
          percentTotal += Number(params.classificationResult[index].percent)
          if (maxItem === null) {
            maxItem = params.classificationResult[index]
          } else {
            if (Number(maxItem.count) < Number(item.count)) {
              maxItem = params.classificationResult[index]
            }
          }
        }
      })

      console.log(percentTotal)
      console.log(maxItem)
      log.info(maxItem)

      if (maxItem !== null) {
        // 백분율 오차 보정
        maxItem.percent = Number(maxItem.percent) + (100 - percentTotal)

        resolve(maxItem)
      }
    } else {
      reject(new Error('classificationResult not found'))
    }

  })
}

function moveFile (params) {
  log.info('moveFile')

  return new Promise(function(resolve, reject) {
    var srcPath = params.srcPath
    var destPath = params.destPath

    log.info(srcPath)
    log.info(destPath)

    fs.rename(srcPath, destPath, function(err) {
      if (!err) {
        var ret = {
          srcPath: srcPath,
          destPath: destPath
        }
        resolve(ret)
      } else {
        reject(err)
      }
    })
  })
}

function createDir(params) {
  console.log('createDir')

  return new Promise(function(resolve, reject) {
    var path = params.path

    console.log(path)
    fs.access(path, fs.constants.F_OK, function(err) {
      if (err) {
        fs.mkdir(path, function(err) {
          if (!err) {
            resolve('mkdir : ' + path)
          } else {
            reject(err)
          }
        })
      } else {
        resolve('already create dir')
      }
    })
  })
}

function copyDir(params) {
  return new Promise(function(resolve, reject) {
    createDir({path: params.destPath}).then(function (res) {
      console.log(res)

      var srcPath = params.srcPath
      var destPath = params.destPath

      log.info(srcPath)
      log.info(destPath)

      ncp(srcPath, destPath, function (err) {
        if (err) {
          reject(err)
        }
        resolve(srcPath)
      })

      // cp.exec('xcopy ' + srcPath + ' ' + destPath + ' /E', {}, function(err, stdout, stderr) {
      //   log.info(err)
      //   log.info(stdout)
      //   log.info(stderr)
      // })

      // rename으로 파일 이동시 권한 에러난다잉

      // fs.readdir(srcPath, function(err, files) {
      //   if (!err) {
      //     files.forEach(function(file) {
      //       fs.lstat(path.join(srcPath, file), function(err, stat) {
      //         if (stat.isFile()) {
      //           fs.copyFile(path.join(srcPath, file), path.join(destPath, file), function(err) {
      //             if (!err) {
      //               console.log('copy : ' + path.join(srcPath, file) + '->' + path.join(destPath, file))
      //             } else {
      //               console.log(err)
      //             }
      //           })
      //         } else {
      //           var params = {
      //             srcPath: path.join(srcPath, file),
      //             destPath: path.join(destPath, file)
      //           }
      //           moveDir(params)
      //         }
      //       })
      //     })
      //   }
      // })
    }).catch(function (err) {
      reject(err)
    })
  })
}

export default {
  async getWbcFiles (params) {
    return await getWbcFiles(params)
  },
  async getRbcFiles (params) {
    return await getRbcFiles(params)
  },
  async getWbcClassification (params) {
    return await getWbcClassification(params)
  },
  async moveFile (params) {
    return await moveFile(params)
  },
  async createDir (params) {
    return await createDir(params)
  },
  async copyDir (params) {
    return await copyDir(params)
  }
}
