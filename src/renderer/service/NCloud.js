import Configs from '../../Configs'
const fs = require('fs')
const path = require("path")
const aws = require('aws-sdk')
const ep = new aws.Endpoint(Configs.N_CLOUD_BASE_URL)
const s3 = new aws.S3({
  endpoint: ep,
  region: Configs.REGION,
  credentials: {
    accessKeyId: Configs.NACCESS_KEY,
    secretAccessKey: Configs.NSECRET_KEY
  }
})

async function createBucket(params) {
  var bucketName = params.bucketName

  return new Promise(function(resolve, reject) {
    s3.listBuckets({}, function(err, data) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log(data)
        var bucket = data.Buckets.filter(function(item) {
          return item.Name === bucketName
        })

        console.log(bucket)
        if (bucket.length <= 0) {
          var params = {
            Bucket: bucketName,
            CreateBucketConfiguration: {}
          }

          s3.createBucket(params, function(err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(bucketName)
            }
          })
        } else {
          resolve(bucketName)
        }
      }
    })
  })
}

async function uploadStorage(params, options) {
  return new Promise(function(resolve, reject) {
    s3.upload(params, options, function(err, data) {
      console.log(err)
      console.log(data)

      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function putObject(params) {
  return new Promise(function(resolve, reject) {
    s3.putObject(params, function(err, data) {
      console.log(err)
      console.log(data)

      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function uploadDirectory(params) {
  console.log(params)
  var srcPath = params.srcPath
  var bucketName = params.bucketName
  var slotId = params.slotId
  var rootPath = params.rootPath
  var siteCd = params.siteCd

  // var stat = fs.statSync(srcPath)
  // if (stat.isDirectory()) {
  //   let params = {Bucket: bucketName, Key: siteCd + '/' }
  //   s3.putObject(params, function(err, data) {
  //     if (err) {
  //       console.log(err)
  //     } else {
  //       console.log('Create directory '+ srcPath +' to ' + bucketName)
  //     }
  //   })
  // }

  s3.putObject({Bucket: bucketName, Key: siteCd + '/' }, function(err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log('Create directory '+ siteCd +' to ' + bucketName)
    }
  })

  function walkSync(srcPath, callback) {
    fs.readdirSync(srcPath).forEach(function (name) {
      if (name !== '22_HIGH_Detection') {
        var filePath = srcPath + '/' + name //path.join(srcPath, name)
        var stat = fs.statSync(filePath)
        var s3Key = siteCd + '/' + filePath.replace(rootPath + '/', '') + '/'

        if (stat.isFile()) {
          callback(filePath, stat)
        } else if (stat.isDirectory()) {
          var params = {Bucket: bucketName, Key: s3Key }
          s3.putObject(params, function(err, data) {
            if (err) {
              console.log(err)
            } else {
              walkSync(filePath, callback)
              console.log('Create directory '+ filePath +' to ' + bucketName)
            }
          })
        }
      }
    })
  }

  walkSync(params.srcPath, function(filePath, stat) {
    // let bucketPath = filePath.substring(s3Path.length+1)
    var s3Key = siteCd + '/' + filePath.replace(rootPath + '/', '')
    var params = {Bucket: bucketName, Key: s3Key, Body: fs.createReadStream(filePath) }
    var options = {partSize: 5 * 1024 * 1024}

    console.log(params)

    s3.upload(params, options, function(err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log(data)
        console.log('Successfully uploaded '+ filePath +' to ' + bucketName)
      }
    })

    // s3.putObject(params, function(err, data) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log(data)
    //     console.log('Successfully uploaded '+ filePath +' to ' + bucketName)
    //   }
    // })
  })
}

/**
  멀티파트 업로드 데이터 조회 및 삭제
*/
async function removeMultipartUploads (params) {
  var bucketName = params.bucketName
  var slotId = params.slotId

  return new Promise(function(resolve, reject) {
    var params = {Bucket: bucketName}
    s3.listMultipartUploads(params, function(err, data) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log(data)
        if (data.Uploads.length > 0) {
          data.Uploads.forEach(function(item, index) {
            var params = { Bucket: bucketName, Key: item.Key, UploadId: item.UploadId }

            s3.abortMultipartUpload(params, function(err, data) {
              if (err) {
                console.log(err)
              } else {
                console.log(data)
              }
            })
          })
          if (data.Uploads.length === index + 1) {
            resolve('OK')
          }
        } else {
          resolve('OK')
        }
      }
    })
  })
}

async function listBuckets(params) {
  return s3.listBuckets(params)
}

export default {
  async createBucket (params) {
    return await createBucket(params)
  },
  async listBuckets (params) {
    return await listBuckets(params)
  },
  async uploadStorage (params) {
    return await uploadStorage(params)
  },
  async putObject (params) {
    return await putObject(params)
  },
  async uploadDirectory (params) {
    return await uploadDirectory(params)
  },
  async removeMultipartUploads (params) {
    return await removeMultipartUploads(params)
  }
}
