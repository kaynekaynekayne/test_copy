const CommonUtils = {}

CommonUtils.install = function (Vue, options) {
  Vue.prototype.$getTabBodyHeight = function () {
    return (window.innerHeight - document.getElementById('tabNav').offsetHeight)
  }
  Vue.prototype.$getTabBodyWidth = function () {
    return (window.innerWidth)
  }
  Vue.prototype.$getByteLength = function (decimal) {
    const LINE_FEED = 10 // '\n'
    return (decimal >> 7) || (LINE_FEED === decimal) ? 2 : 1
  },
  Vue.prototype.$getLimitedByteText = function (inputText, maxByte) {
    const characters = inputText.split('')
    var validText = ''
    var totalByte = 0

    for (var i = 0; i < characters.length; i += 1) {
      const character = characters[i]
      const decimal = character.charCodeAt(0)
      const byte = this.$getByteLength(decimal) // 글자 한 개가 몇 바이트 길이인지 구해주기

      // 현재까지의 바이트 길이와 더해 최대 바이트 길이를 넘지 않으면
      if (totalByte + byte <= maxByte) {
        totalByte += byte      // 바이트 길이 값을 더해 현재까지의 총 바이트 길이 값을 구함
        validText += character // 글자를 더해 현재까지의 총 문자열 값을 구함
      } else {                 // 최대 바이트 길이를 넘으면
        break                  // for 루프 종료
      }
    }

    console.log(totalByte)
    console.log(validText)
    var obj = {
      totalByte: totalByte,
      validText: validText
    }
    return obj
  },
  Vue.prototype.$getFileNameDateTime = function () {
    var now = new Date()
    var year = "" + now.getFullYear()
    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
    var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
    var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
    var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }

    return year + month + day + hour + minute + second
  }
  Vue.prototype.$getDateTime = function () {
    var now = new Date()
    var year = "" + now.getFullYear()
    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
    var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
    var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
    var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  }
  Vue.prototype.$getDateTimeStr = function () {
    var now = new Date()
    var year = "" + now.getFullYear()
    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
    var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
    var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
    var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }
    return year + month + day + hour + minute + second
  }
  Vue.prototype.$getOrderNo = function () {
    var now = new Date()
    var year = "" + now.getFullYear()
    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
    var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
    var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
    var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }
    var milliSecond = "" + now.getMilliseconds()

    if (milliSecond.length == 1) {
      milliSecond = "00" + milliSecond
    }
    if (milliSecond.length == 2) {
      milliSecond = "0" + milliSecond
    }
    return 'ORD' + year + month + day + hour + minute + second + milliSecond
  }
  Vue.prototype.$getUuid = function () {
    var now = new Date()
    var year = "" + now.getFullYear()
    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
    var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
    var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
    var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }
    var milliSecond = "" + now.getMilliseconds()

    if (milliSecond.length == 1) {
      milliSecond = "00" + milliSecond
    }
    if (milliSecond.length == 2) {
      milliSecond = "0" + milliSecond
    }
    return year + month + day + hour + minute + second + milliSecond
  }
  Vue.prototype.$checkUserId = function (id) {
    var pattern = /^[a-zA-Z][a-zA-Z0-9]{4,19}$/

    if (!pattern.test(id)) {
      return false
    }

    return true
  }
  Vue.prototype.$checkPassword = function (pwd) {
    // var pattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,30}$/
    var pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,30}$/

    if (!pattern.test(pwd)) {
      return false
    }

    return true
  }
  Vue.prototype.$replaceAll = function (str, org, dest) {
    return str.split(org).join(dest)
  }
  Vue.prototype.$stringToDate = function(str) {
    if (typeof(str) === 'undefined' || str === '' || str === null) {
      return ''
    }

    var year = str.substring(0, 4)
    var month = str.substring(4, 6)
    var day = str.substring(6, 8)

    return year + '-' + month + '-' + day
  }
  Vue.prototype.$stringToDateTime = function(str) {
    if (typeof(str) === 'undefined' || str === '' || str === null) {
      return ''
    }

    var year = str.substring(0, 4)
    var month = str.substring(4, 6)
    var day = str.substring(6, 8)
    var hour = str.substring(8, 10)
    var minute = str.substring(10, 12)
    var second = str.substring(12, 14)

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  }
  Vue.prototype.$stringToLoginTime = function(str) {
    if (typeof(str) === 'undefined' || str === '' || str === null) {
      return ''
    }
    var loginDate = new Date(str.replace(' ', 'T'))
    var hour = "" + loginDate.getHours(); if (hour.length == 1) { hour = "0" + hour }
    var minute = "" + loginDate.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
    var second = "" + loginDate.getSeconds(); if (second.length == 1) { second = "0" + second }
    var date = loginDate.toLocaleString('en-us', {month: 'long', year: 'numeric', day: 'numeric'})

    return date + ' ' + hour + ':' + minute + ':' + second
  }
  Vue.prototype.$hexToString = function(hexStr) {
    var string = ''
    for (var i = 0; i < hexStr.length; i += 2) {
      string += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
    }
    return string
  }
  Vue.prototype.$jsonToXml = function(obj) {
    var xml = ''
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : "<" + prop + ">"
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">"
          xml += OBJtoXML(new Object(obj[prop][array]))
          xml += "</" + prop + ">"
        }
      } else if (typeof obj[prop] == "object") {
        xml += OBJtoXML(new Object(obj[prop]))
      } else {
        xml += obj[prop]
      }
      xml += obj[prop] instanceof Array ? '' : "</" + prop + ">"
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '')
    return xml
  }

  Vue.prototype.$getWbcPercent = function(wbcList, totalCount, siteCd) {
    // 퍼센트
    var percentTotal = 0
    var maxItem = null

    console.log(wbcList)
    console.log(totalCount)

    wbcList.forEach(function(item, index) {
      item.PERCENT = Number(((Number(item.COUNT) / totalCount) * 100).toFixed(0))
      console.log(item.CLASS_TITLE + ':' + item.COUNT + ':' + item.PERCENT)

      // nRBC
      // if (item.CLASS_TITLE === 'NR') {
      //   item.PERCENT = Number(((Number(item.count) / self.totalCount) * 100).toFixed(0))
      // }

      // blast 조정
      if (item.CLASS_TITLE === 'BL') {
        if (Number(item.COUNT) > 0) {
          if (Number(item.PERCENT) >= 0 && Number(item.PERCENT) <= 1) {
            item.PERCENT = 1
          }
        }
      }

      // 인하대 (LA, MB, IM, AM)
      if (siteCd === '0011') {
        if (item.CLASS_TITLE === 'LA' || item.CLASS_TITLE === 'IM' ||
            item.CLASS_TITLE === 'MB' || item.CLASS_TITLE === 'AM') {
          if (Number(item.COUNT) > 0) {
            if (Number(item.PERCENT) >= 0 && Number(item.PERCENT) <= 1) {
              item.PERCENT = 1
            }
          }
        }
      }

      if ((item.CLASS_TITLE !== 'NR' && item.CLASS_TITLE !== 'AR' &&
            item.CLASS_TITLE !== 'GP' && item.CLASS_TITLE !== 'PA' &&
            item.CLASS_TITLE !== 'MC' && item.CLASS_TITLE !== 'MA')) {
              percentTotal += Number(item.PERCENT)
      if (maxItem === null) {
        maxItem = item
      } else {
          if (Number(maxItem.COUNT) < Number(item.COUNT)) {
            maxItem = item
          }
        }
      }
    })

    if (maxItem !== null) {
      // 백분율 오차 보정
      maxItem.PERCENT = Number(maxItem.PERCENT) + (100 - percentTotal)
    }
  }

  Vue.prototype.$getWbcTotalCount = function(wbcList) {
    var totalCount = 0

    wbcList.forEach(function(item) {
      if (item.CLASS_TITLE !== 'NR' && item.CLASS_TITLE !== 'AR' &&
          item.CLASS_TITLE !== 'GP' && item.CLASS_TITLE !== 'PA' &&
          item.CLASS_TITLE !== 'MC' && item.CLASS_TITLE !== 'MA') {
        totalCount += Number(item.COUNT)
      }
    })
    return totalCount
  }

  Vue.prototype.$getClassificationPercent = function(resultList, total) {
    resultList.forEach(function(item) {
      item.percent = ((Number(item.count) / total) * 100).toFixed(0)
    })
  }

  Vue.prototype.$checkPbNormalCell = function(wbcInfo) {
    var norMalRange = this.$store.getters.getWbcNormalRange
    var totalCount = 0
    var neutrophilCount = 0
    var resultObj = {
      'isNormal': 'Y',
      'class': []
    }

    if (wbcInfo) {
      wbcInfo.forEach(function(wbcItem) {
        if (wbcItem.title !== 'NR' && wbcItem.title !== 'AR' &&
            wbcItem.title !== 'GP' && wbcItem.title !== 'PA' &&
            wbcItem.title !== 'MC' && wbcItem.title !== 'MA') {
          totalCount += Number(wbcItem.count)
        }

        if (wbcItem.title === 'NE' ||
            wbcItem.title === 'NS' ||
            wbcItem.title === 'NB') {
          neutrophilCount += Number(wbcItem.count)
        }
      })

      console.log(norMalRange)
      wbcInfo.forEach(function(wbcItem) {
        norMalRange.forEach(function (range) {
          // neutrophils
          if (range.classId === '01') {
            var percent = 0

            if (wbcItem.id === '01' ||
                wbcItem.id === '71') {
              percent = (neutrophilCount / totalCount) * 100

              console.log(neutrophilCount + ':' + totalCount + ':' + percent)
              if (percent < range.min || percent > range.max) {
                console.log('SET [NE] Abnormal : ' + wbcItem.title)
                resultObj.isNormal = 'N'
                resultObj.class.push('[NE]' + ' : [' + percent.toFixed(2) + ']' + '%')
              } else {
                console.log('SET [NE] NORMAL : ' + wbcItem.title)
              }
            }
          } else {
            if (wbcItem.id === range.classId) {
              if (range.unit === 'Count') {
                if (Number(wbcItem.count) < range.min || Number(wbcItem.count) > range.max ) {
                  // console.log('SET Abnormal : ' + wbcItem.title)
                  resultObj.isNormal = 'N'
                  resultObj.class.push(wbcItem.title + ' : [' + wbcItem.count + ']' + 'Count')
                } else {
                  // console.log('SET NORMAL : ' + wbcItem.title)
                }
              } else {
                var percent = 0

                percent = (Number(wbcItem.count) / totalCount) * 100

                if (percent < range.min || percent > range.max) {
                  console.log('SET Abnormal : ' + wbcItem.title)
                  resultObj.isNormal = 'N'
                  resultObj.class.push(wbcItem.title + ' : [' + percent.toFixed(2) + ']' + '%')
                } else {
                  console.log('SET NORMAL : ' + wbcItem.title)
                }
              }
            }
          }
        })
      })
    }

    return resultObj
  }

  Vue.prototype.$makePrintHtml = function (resultItem, wbcList, rbcList, totalCount, rbcImages) {
    var serial = resultItem.SLOT_ID
    var testType = ''
    var gender = ''

    console.log(resultItem)
    console.log(wbcList)
    console.log(rbcList)
    console.log(totalCount)
    console.log(rbcImages)

    if (resultItem.TEST_TYPE_CD === '01') {
      testType = 'PB standard'
    } else if (resultItem.TEST_TYPE_CD === '02') {
      testType = 'Body fluid default'
    } else if (resultItem.TEST_TYPE_CD === '03') {
      testType = 'Body fluid select'
    } else if (resultItem.TEST_TYPE_CD === '04') {
      testType = 'PB premium'
    }

    if (resultItem.GENDER_CD === '01') {
      gender = 'Male'
    } else {
      gender = 'Female'
    }
    const html = `<span>&#60; Hospital &#62; &nbsp;&nbsp;</span>` +
                  `<span> DM Serial Nbr : ` + serial + `</span>` +
                  `<hr style="border-top: 1px dashed" />` +
                  `<div style="text-align: center; font-size: 19px;"> Analysis Report from UIMD PB system</div>` +
                  `<div class="userContainer" style="display: flex; flex-wrap: wrap; margin-top: 40px; font-size: 15px;">` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      `Slot ID` +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      resultItem.SLOT_ID +
                    `</div><br /><br />` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      `Ordered date` +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      this.$stringToDateTime(resultItem.ORDER_DTTM) +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      `Signed by ID` +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      resultItem.SIGNED_USER_ID +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      `Signed date` +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      this.$stringToDateTime(resultItem.SIGNED_DTTM) +
                    `</div><br /><br />` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      `Patient ID` +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      resultItem.PATIENT_ID +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      `Ordered Classification` +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      testType +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      `Name` +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      resultItem.PATIENT_NM +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      `Birth` +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      this.$stringToDate(resultItem.BIRTHDAY) +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      `Gender` +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      gender +
                    `</div><br /><br />` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      createRbcClassification(resultItem, rbcList) +
                    `</div>` +
                    `<div class="item" style="flex-basis: 50%;">` +
                      createWbcClassification(resultItem, wbcList, totalCount) +
                    `</div>` +
                    `<div class="item">` +
                      drawWbcPrintImages(resultItem, wbcList, this.$store.getters.getSettings) +
                    `</div>` +
                    `<div class="item">` +
                      drawRbcPrintImages(rbcImages) +
                    `</div>` +
                  `</div>`

    return html
  }

  var createRbcClassification = function (resultItem, rbcList) {
    var result = '<div class="rbcContainer" style="display: flex; flex-wrap: wrap;">'
    result += `<div class="item" style="flex-basis: 100%;">RBC classification result` + `</div><br /><br />`

    for (var i = 0; i < rbcList.length; i++) {
      if (rbcList[i].CATEGORY_ID !== '04') {
        result += `<div class="item" style="flex-basis: 30%;">` + rbcList[i].CATEGORY_NM + `</div>`
        result += `<div class="item" style="flex-basis: 30%;">` + rbcList[i].CLASS_NM + `</div>`

        result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + Number(rbcList[i].DEGREE) + `+</div>`
      }
    }

    result += `<br /><br /><div class="item" style="flex-basis: 30%;">` + `Others` + `</div>`
    result += `<div class="item" style="flex-basis: 25%;">` + 'Platelets' + `</div>`
    result += `<div class="item" style="flex-basis: 35%; text-align: right;">` + resultItem.PLT_COUNT + ` PLT / 1000 RBC</div>`

    result += `<div class="item" style="flex-basis: 30%;"></div>`
    result += `<div class="item" style="flex-basis: 25%;">` + 'Malaria' + `</div>`
    result += `<div class="item" style="flex-basis: 35%; text-align: right;">` + resultItem.MALARIA_COUNT + '/' + resultItem.MAX_RBC_COUNT + `RBC</div>`

    result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
    result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + resultItem.RBC_COMMENT + `</div>`

    result += '</div>'
    return result
  }
  var createWbcClassification = function (resultItem, wbcList, totalCount) {
    var result = '<div class="wbcContainer" style="display: flex; flex-wrap: wrap;">'
    if (resultItem.TEST_TYPE_CD === '01' || resultItem.TEST_TYPE_CD === '04') {
      result += `<div class="item" style="flex-basis: 100%;">WBC classification result` + `</div><br /><br />`
    } else {
      result += `<div class="item" style="flex-basis: 100%;">BF classification result` + `</div><br /><br />`
    }

    console.log(wbcList)
    for (var i = 0; i < wbcList.length; i++) {
      if (resultItem.TEST_TYPE_CD === '01' || resultItem.TEST_TYPE_CD === '04') {
        if ((wbcList[i].id !== '12' &&
             wbcList[i].id !== '13' &&
             wbcList[i].id !== '14' &&
             wbcList[i].id !== '15' &&
             wbcList[i].id !== '16') && (wbcList[i].count > 0)) {
          result += `<div class="item" style="flex-basis: 40%;">` + wbcList[i].name + `</div>`
          result += `<div class="item" style="flex-basis: 30%;">` + wbcList[i].count + `</div>`
          result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + wbcList[i].percent + `%</div>`
        }
      } else {
        if ((wbcList[i].id !== '08' &&
             wbcList[i].id !== '09' &&
             wbcList[i].id !== '10') && (wbcList[i].count > 0)) {
          result += `<div class="item" style="flex-basis: 40%;">` + wbcList[i].name + `</div>`
          result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + wbcList[i].count + `</div>`
          result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + wbcList[i].percent + `%</div>`
        }
      }
    }

    result += `<div class="item" style="flex-basis: 40%;">` + 'Total count' + `</div>`
    result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + totalCount + `</div>`
    result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + '100.00%' + `</div>`

    for (var j = 0; j < wbcList.length; j++) {
      if (resultItem.TEST_TYPE_CD === '01' || resultItem.TEST_TYPE_CD === '04') {
        if ((wbcList[j].id === '12' ||
             wbcList[j].id === '13' ||
             wbcList[j].id === '14' ||
             wbcList[j].id === '15' ||
             wbcList[j].id === '16') && (wbcList[j].count > 0)) {
          result += `<div class="item" style="flex-basis: 40%;">` + wbcList[j].name + `</div>`
          if (wbcList[j].id === '12' || wbcList[j].id === '13') {
            result += `<div class="item" style="flex-basis: 30%;">` + wbcList[j].count + '/' +  resultItem.MAX_WBC_COUNT + 'WBC' + `</div>`
          } else {
            result += `<div class="item" style="flex-basis: 30%;">` + wbcList[j].count + `</div>`
          }
          result += `<div class="item" style="flex-basis: 30%;">` + `</div>`
        }
      } else {
        if ((wbcList[j].id === '08' ||
             wbcList[j].id === '09' ||
             wbcList[j].id === '10') && (wbcList[j].count > 0)) {
          result += `<div class="item" style="flex-basis: 40%;">` + wbcList[j].name + `</div>`
          if (wbcList[j].id === '08') {
            result += `<div class="item" style="flex-basis: 30%;">` + wbcList[j].count + '/' +  resultItem.MAX_WBC_COUNT + 'WBC' + `</div>`
          } else {
            result += `<div class="item" style="flex-basis: 30%;">` + wbcList[j].count + `</div>`
          }
          result += `<div class="item" style="flex-basis: 30%;">` + `</div>`
        }
      }
    }

    result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
    result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + resultItem.WBC_COMMENT + `</div>`

    result += '</div>'
    return result
  }

  var drawRbcPrintImages = function (rbcImages) {
    console.log(rbcImages)

    if (rbcImages) {
      var result = '<div class="rbcImagePrintContainer" style="display: flex; flex-wrap: wrap;">'

      for (var i = 0; i < rbcImages.length; i++) {
        result += `<div class="item" style="flex-basis: 100%; margin-top: 10px; padding: 10px;">` +
                    `<img src=` + '"'+ rbcImages[i] + '"' + `style="width: 100%;" />` +
                  `</div>`
      }

      result += '</div>'
      return result
    } else {
      return ''
    }
  }

  var drawWbcPrintImages = function (resultItem, wbcList, settings) {
    if (settings.modelWbcReportPrint.length > 0) {
      var rootPath = settings.pbiaRootPath + '/' + resultItem.SLOT_ID
      var classDir = ''

      if (resultItem.TEST_TYPE_CD === '01' || resultItem.TEST_TYPE_CD === '04') {
        classDir = rootPath + '/' + settings.wbcClassDirName
      } else {
        classDir = rootPath + '/' + settings.bfClassDirName
      }

      console.log(settings.modelWbcReportPrint)
      console.log(wbcList)

      var result = '<div class="wbcImagePrintContainer" style="display: flex; flex-wrap: wrap;">'
      for (var i = 0; i < wbcList.length; i++) {
        for (var j = 0; j < settings.modelWbcReportPrint.length; j++) {
          if (wbcList[i].id === settings.modelWbcReportPrint[j]) {
            if (wbcList[i].images.length > 0) {
              result += `<div style="flex-basis: 100%; margin-top: 10px;">` +
                          `<div style="width: 180px; border-bottom: 2px solid #09CBFC;">` +
                            wbcList[i].name +
                          `</div>` +
                        `</div>`
              for (var k = 0; k < wbcList[i].images.length; k++) {
                result += `<div class="item" style="flex-basis: 10%; margin-top: 10px; padding: 10px;">` +
                            `<img src=` + '"'+ wbcList[i].images[k] + '"' + `style="width: 185px;" />` +
                          `</div>`
              }
            }
          }
        }
      }

      result += '</div>'
      return result
    }

    return ''
  }

}

export default CommonUtils
