<template>
  <b-overlay :show="overlayShow" variant="dark" opacity="0.5" rounded="sm" style="color:white;">
    <template v-slot:overlay>
      <div class="text-center">
        <b-icon icon="arrow-clockwise" font-scale="3" animation="spin"></b-icon>
        <p id="cancel-label">Please wait...</p>
      </div>
    </template>
  <div class="navHome">
    <!-- <b-row id="tabNav" class="colorWhite border borderColorGray" style="-webkit-app-region: drag;"> -->
    <b-row id="tabNav" class="colorWhite border borderColorGray">
      <b-col cols="4" class="pt-2 pb-1">
        <b-row style="-webkit-app-region: no-drag;">
          <b-col cols="3" id="mainTab" v-for="page in pages" :key="page.id" class="pointer text-center" @click="onClickTab(page)">
            <img v-if="page.isSelect" class="imgSelect" :src="page.imgPath" style="width: 50px;"/>
            <img v-else class="imgNonSelect" :src="page.imgPath" style="width: 50px;"/>
            <div :class="{labelSelect : page.isSelect}" style="font-size: 13px;">{{ page.text }}</div>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="3" class="p-0">
        <progress-bar></progress-bar>
      </b-col>
      <b-col class="pt-2 text-right">
        <div id="wrapper" style="-webkit-app-region: no-drag;">
          <!-- alarm -->
          <img v-if="isAlarmFlick" src="~@/assets/test/menu03_on.png" class="pl-3 pt-2 pb-2 pointer" @click="onClickAlarm" />
          <img v-else src="~@/assets/test/menu03_off.png" class="pl-3 pt-2 pb-2 pointer" @click="onClickAlarm" />

          <img v-if="oilCount >= 0 && oilCount <= 100" id="oilState" src="~@/assets/icon/oil10.png" class="pl-2 pt-2 pb-2 pointer" @click="onImmersionOil" />
          <img v-else-if="oilCount > 100 && oilCount <= 250" id="oilState" src="~@/assets/icon/oil25.png" class="pl-2 pt-2 pb-2 pointer" @click="onImmersionOil" />
          <img v-else-if="oilCount > 250 && oilCount <= 500" id="oilState" src="~@/assets/icon/oil50.png" class="pl-2 pt-2 pb-2 pointer" @click="onImmersionOil" />
          <img v-else-if="oilCount > 500 && oilCount <= 750" id="oilState" src="~@/assets/icon/oil75.png" class="pl-2 pt-2 pb-2 pointer" @click="onImmersionOil" />
          <img v-else id="oilState" src="~@/assets/icon/oil100.png" class="pl-2 pt-2 pb-2 pointer" @click="onImmersionOil" />

          <img v-if="storagePercent >= 0 && storagePercent <= 30" id="storageState" src="~@/assets/icon/storage30.png" class="pl-2 pt-2 pb-2 pointer" />
          <img v-else-if="storagePercent > 30 && storagePercent <= 60" id="storageState" src="~@/assets/icon/storage60.png" class="pl-2 pt-2 pb-2 pointer" />
          <img v-else-if="storagePercent > 60 && storagePercent <= 90" id="storageState" src="~@/assets/icon/storage90.png" class="pl-2 pt-2 pb-2 pointer" />
          <img v-else-if="storagePercent > 90 && storagePercent <= 100" id="storageState" src="~@/assets/icon/storage100.png" class="pl-2 pt-2 pb-2 pointer" />
          <img v-else id="storageState" src="~@/assets/icon/storage100.png" class="pl-2 pt-2 pb-2 pointer" />

          <img v-if="isDoorOpen" src="~@/assets/test/menu01_off.png" class="pl-2 pt-2 pb-2"/>
          <img v-else src="~@/assets/test/menu01_on.png" class="pl-2 pt-2 pb-2"/>

          <!-- <img v-if="eqStatCd === '03'" id="errState" src="~@/assets/test/menu03_off.png" class="pl-3 pt-2 pb-2 pointer" @click="errorClear"/>
          <img v-else src="~@/assets/test/menu03_on.png" class="pl-3 pt-2 pb-2" /> -->
          <img v-if="eqStatCd == '01'" src="~@/assets/test/menu01_idle.png" class="pl-2 pt-2 pb-2 pr-3" />
          <img v-else-if="eqStatCd == '02'" src="~@/assets/test/menu05_ready.png" class="pl-2 pt-2 pb-2 pr-3" />
          <img v-else-if="eqStatCd == '03'" src="~@/assets/test/menu05_off.png" id="errState" @click="errorClear" class="pl-2 pt-2 pb-2 pr-3" />
          <img v-else-if="eqStatCd == '04'" src="~@/assets/test/menu05_on.png" class="pl-2 pt-2 pb-2 pr-3"/>
          <img v-else-if="eqStatCd == '05'" src="~@/assets/test/menu05_on.png" class="pl-2 pt-2 pb-2 pr-3"/>
          <img v-else src="~@/assets/test/menu01_idle.png" class="pl-2 pt-2 pb-2 pr-3"/>
        </div>

        <b-popover target="oilState" triggers="hover" placement="bottom">
          Immersion Oil {{ oilCount }} Count
        </b-popover>
        <b-popover target="errState" triggers="hover" placement="bottom">
          {{ errMessage }}
        </b-popover>
        <b-popover target="storageState" triggers="hover" placement="bottom">
          Storage {{ storagePercent }} % used
        </b-popover>
      </b-col>
      <b-col class="pt-3 pr-5 text-right" cols="2 p-0">
        <div style="letter-spacing: 1px;">Logged : {{ modelData.loginTime }}</div>
        <b-row>
          <b-col class="text-right pt-1" cols="6">
            <p class="h3"><b-icon icon="person-circle"></b-icon></p>
          </b-col>
          <b-col class="pt-1" style="-webkit-app-region: no-drag;">
            <b-dropdown block right :text="modelData.userId" @show="onDropdownShow" ref="dropdown">
              <b-dropdown-form style="width: 400px;">
                <div style="color: #999999;">
                  Current account
                </div>
                <b-card>
                  <b-row>
                    <b-col cols="2" class="pt-3">
                      <img src="~@/assets/test/checkOn.png" />
                    </b-col>
                    <b-col>
                      <div>
                        <strong>{{ modelData.userId }}</strong>
                      </div>
                      <div style="font-size: 13px; color: #999999;">
                        {{ modelData.empNo }}
                      </div>
                      <div>
                        {{ modelData.userNm }}&nbsp&nbsp&nbsp {{ modelData.loginTime }}
                      </div>
                    </b-col>
                  </b-row>
                </b-card>
                <br/>
                <b-dropdown-divider></b-dropdown-divider>
                <br/>
                <b-card
                  id="accountCard"
                  class="mt-1 pointer"
                  v-for="(item, index) in changeUserList"
                  :key="index"
                  @click="onClickAccount($event, item)">
                  <b-row>
                    <b-col cols="2" class="pt-3">
                      <img v-if="item.isSelected" src="~@/assets/test/checkOn.png" />
                      <img v-else src="~@/assets/test/checkOff.png" />
                    </b-col>
                    <b-col>
                      <div>
                        <strong>{{ item.userId }}</strong>
                      </div>
                      <div style="font-size: 13px; color: #999999;">
                        {{ item.empNo }}
                      </div>
                      <div>
                        {{ item.userName }}&nbsp&nbsp&nbsp {{ $stringToLoginTime(item.loginTime) }}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row v-if="item.isSelected" class="mt-2">
                    <b-col cols="2"></b-col>
                    <b-col cols="7">
                      <b-form-input
                        id="input-live"
                        type="password"
                        placeholder="paswsword"
                        v-model="item.password"
                      ></b-form-input>
                    </b-col>
                    <b-col class="pt-1">
                      <b-button variant="primary" @click="onLogin(item)" size="sm">Login</b-button>
                    </b-col>
                  </b-row>
                </b-card>
                <div class="text-right">
                  <b-button class="mt-2" variant="outline-dark" @click="onModalLogout" size="sm">Logout</b-button>
                  <!-- <b-button class="mt-4" variant="outline-dark" @click="onTest" size="sm">test</b-button> -->
                </div>
              </b-dropdown-form>
            </b-dropdown>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
  </b-overlay>
</template>

<script>
  import ResultPage from './TabPages/ResultPage.vue'
  import SettingsPage from './TabPages/SettingsPage.vue'
  import TestPage from './TabPages/TestPage.vue'
  import { mapGetters } from 'vuex'
  import Constant from '../../Constant'
  import ModalInfo from './Common/ModalInfo'
  import ModalConfirm from './Common/ModalConfirm'
  import worker from '../workers/promise'
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
  import ProgressBar from './ProgressBar.vue'
  import ModalImmersionOil from './Common/ModalImmersionOil'
  import Configs from '../../Configs'
  import Package from '../../../package.json'
  import api from '@/service'

  const fs = require('fs')
  const path = require('path')
  const log = require('electron-log')

  // import Store from 'electron-store';
  // const store = new Store({ name: 'vuex' });
  // store.clear();

  // console.log(store)

  const ipcRenderer = require('electron').ipcRenderer
  // const hl7 = require('simple-hl7')
  // const hl7Tcp = hl7.tcp()
  // const hl7File = hl7.file()
  // ///////////////////SERVER/////////////////////
  //
  // ////////////////////SERVER///////////////////
  // hl7File.use(function(req, res, next) {
  //   console.log('Message Recieved From ' + req.facility);
  //   console.log('Message Event: ' + req.event);
  //   console.log('Message Type: ' + req.type);
  //   next();
  // });
  //
  // //create middleware
  // hl7File.use(function(req, res, next) {
  //   //create middleware for certain message types
  //   if (req.type != 'ADT' || req.event != 'A04') {
  //     return next();
  //   }
  //
  //   var pid = req.msg.getSegment('PID');
  //   var patient = pid.getComponent(5, 2) + ' ' + pid.getComponent(5, 1);
  //
  //   console.log('Patient Info Is ' + patient);
  //   next();
  // });

  //No ACK with FileClient
  // app.use(function(req, res, next) {
  //   console.log('************sending ack****************')
  //   res.end();
  // })

  //Error Handler
  // hl7File.use(function(err, req, res, next) {
  //   console.log(err);
  // });
  //
  // hl7File.start('D:/hl7test/test-import');

  // var hl7 = require('simple-hl7');
  // var app = hl7.tcp();
  //
  // app.use(function(req, res, next) {
  //   //req.msg is the HL7 message
  //   console.log('******message received*****')
  //   console.log(req.msg.log());
  //   next();
  // })
  //
  // app.use(function(req, res, next){
  //   //res.ack is the ACK
  //   //acks are created automatically
  //
  //   //send the res.ack back
  //   console.log('******sending ack*****')
  //   res.end()
  // })
  //
  // app.use(function(err, req, res, next) {
  //   //error handler
  //   //standard error middleware would be
  //   console.log('******ERROR*****')
  //   console.log(err);
  //   var msa = res.ack.getSegment('MSA');
  //   msa.setField(1, 'AR');
  //   res.ack.addSegment('ERR', err.message);
  //   res.end();
  // });
  // app.start(7777);
  //
  // var tcpClient = hl7.Server.createTcpClient({host: 'localhost', port: 7777, keepalive: true});
  //


  export default {
    name: 'home-page',
    components: { ResultPage, SettingsPage, TestPage, ProgressBar },
    computed: {
      ...mapGetters([Constant.GET_CURRENT_USER,
        Constant.GET_SETTINGS,
        Constant.GET_COMMON_CODE,
        Constant.GET_RUNNING_INTERVAL_ID,
        Constant.GET_LOGIN_HISTORY,
        Constant.GET_USER,
        Constant.GET_WORKING_INTERVAL_ID,
        Constant.GET_PAUSE_STATE,
        Constant.GET_DEVICE_BARCODE,
        Constant.GET_WBC_CLASS_LIST,
        Constant.GET_BF_WBC_CLASS_LIST,
        Constant.GET_SYS_INFO
        // Constant.GET_WBC_CLASS_LIST
        // Constant.GET_SYSTEM_TIME_ID,
      ])
    },
    mounted () {
      var self = this

      console.log('mount home --' + this.runningSlotId)
      this.initElement()
      // this.sendSystemInfo()

      ipcRenderer.send(Constant.SELECT_RBC_DEGREE)
      ipcRenderer.send(Constant.GET_NORMAL_RANGE)

      ipcRenderer.send(Constant.SELECT_CBC_CODE_INHA, null)
      ipcRenderer.send(Constant.SELECT_LIS_CODE_INHA, null)
      ipcRenderer.send(Constant.SELECT_LIS_CODE_RBC_INHA, null)
      ipcRenderer.send(Constant.SELECT_LIS_CONN_PATH_INHA, JSON.stringify({deviceBarcode: self.getDeviceBarcode}))
      ipcRenderer.send(Constant.SELECT_WBC_RUNNING_COUNT)

      // ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: completeSlot.slotId}))

      ipcRenderer.on(Constant.SELECT_WBC_RUNNING_COUNT, function (event, result) {
        self.wbcRunningCount = result
        console.log(self.wbcRunningCount)
      })

      ipcRenderer.on(Constant.GET_RBC_COUNT_INHA, function (event, result) {
        self.rbcResults = result

        console.log(self.completeSlotTmp)
        if (self.completeSlotTmp.testType !== '04') {
          var wbcTotal = 0
          self.completeSlotTmp.wbcInfo.forEach(function(wbcItem) {
            if (Number(wbcItem.count) > 0) {
              if ((wbcItem.title !== 'NR' && wbcItem.title !== 'AR' &&
                    wbcItem.title !== 'GP' && wbcItem.title !== 'PA' &&
                    wbcItem.title !== 'MC' && wbcItem.title !== 'MA')) {
                wbcTotal += Number(wbcItem.count)
              }
            }
          })

          console.log('wbcTotal : ' + wbcTotal)
          var maxItem = null
          // 퍼센트
          var percentTotal = 0

          self.completeSlotTmp.wbcInfo.forEach(function(wbcItem, index) {
            wbcItem.percent = Number(((Number(wbcItem.count) / wbcTotal) * 100).toFixed(0))
            var percentN2 = Number(((Number(wbcItem.count) / wbcTotal) * 100).toFixed(2))

            console.log(percentN2)

            // blast 조정
            if (wbcItem.title === 'BL') {
              if (Number(wbcItem.count) > 0) {
                if (percentN2 >= 0 && percentN2 <= 1) {
                  wbcItem.percent = 1
                }
              }
            }

            if (wbcItem.title === 'LA' || wbcItem.title === 'IM' ||
                wbcItem.title === 'MB' || wbcItem.title === 'AM') {
              if (Number(wbcItem.count) > 0) {
                if (percentN2 >= 0 && percentN2 <= 1) {
                  wbcItem.percent = 1
                }
              }
            }

            console.log(wbcItem.title + ':' + wbcItem.percent)

            if ((wbcItem.title !== 'NR' && wbcItem.title !== 'AR' &&
                  wbcItem.title !== 'GP' && wbcItem.title !== 'PA' &&
                  wbcItem.title !== 'MC' && wbcItem.title !== 'MA')) {
              percentTotal += Number(wbcItem.percent)
              if (maxItem === null) {
                maxItem = wbcItem
              } else {
                if (Number(maxItem.count) < Number(wbcItem.count)) {
                  maxItem = wbcItem
                }
              }
            }

            console.log('maxItem : ' + maxItem.title)
            console.log(percentTotal)

            if (maxItem !== null && (index + 1) === self.completeSlotTmp.wbcInfo.length) {
              // 백분율 오차 보정
              console.log(Number(maxItem.percent))
              console.log(100 - percentTotal)

              maxItem.percent = Number(maxItem.percent) + (100 - percentTotal)
              console.log(maxItem.percent)
            }
          })

          // 인하대학교
          if (self.lisConnObj !== null) {
            if (self.lisConnObj.CBC_CONN_TYPE_CD === '02') { // URL
              var params = {
                url: self.lisConnObj.CBC_URL,
                machine: 'ADUIMD',
                episode: self.completeSlotTmp.barcodeNo
              }

              console.log(params)
              // cbc
              api.getCdcResults_0011(params).then(function(cbcResult) {
                console.log('get cbc succ')
                console.log(cbcResult)
                var resultStr = ''
                var wbcInfo = self.completeSlotTmp.wbcInfo

                console.log('[')
                console.log(self.lisCode)
                console.log(wbcInfo)
                console.log(']')

                var testCodeList = cbcResult.data[0].testCode.split(',')
                var tmpList = []

                testCodeList.forEach(function(codes) {
                  if (codes.length > 0) {
                    var codeArray = codes.split('|')
                    var code = codeArray[0]
                    var value = codeArray[1]
                    var unit = codeArray[2]
                    var type = codeArray[3]
                    var tmpStr = ''

                    if (code === 'L0210') {
                      value = value + '5'
                    }

                    if (code === 'H1151') {
                      tmpStr += 'H9511' + '|' + value + '|' //+ unit // + '\\' + type
                      tmpList.push(tmpStr)
                    } else if (code === 'H1152') {
                      tmpStr += 'H9512' + '|' + value + '|' //+ unit // + '\\' + type
                      tmpList.push(tmpStr)
                    } else if (code === 'H1153') {
                      tmpStr += 'H9513' + '|' + value + '|' //+ unit // + '\\' + type
                      tmpList.push(tmpStr)
                    } else if (code === 'H1154') {
                      tmpStr += 'H9514' + '|' + value + '|' //+ unit // + '\\' + type
                      tmpList.push(tmpStr)
                    } else if (code === 'H1155') {
                      tmpStr += 'H9515' + '|' + value + '|' //+ unit // + '\\' + type
                      tmpList.push(tmpStr)
                    } else if (code === 'H1165') {
                      tmpStr += 'H9510' + '|' + value + '|' //+ unit // + '\\' + type
                      tmpList.push(tmpStr)
                    } else if (code === 'H1162') {
                      tmpStr += 'H9570' + '|' + value + '|' //+ unit // + '\\' + type
                      tmpList.push(tmpStr)
                    } else if (code === 'H1101' || code === 'H1102' || code === 'H1103' ||
                               code === 'H1104' || code === 'H1105' || code === 'H1106' ||
                               code === 'H1121' || code === 'H1122' || code === 'H1123') {
                      tmpStr += code + '|' + value + '|' //+ unit // + '\\' + type
                      tmpList.push(tmpStr)
                    }
                  }
                })

                var inhaTestCode = ''
                tmpList.forEach(function(item) {
                  inhaTestCode += item + ','
                })

                resultStr += inhaTestCode

                self.lisCode.forEach(function(lisCode, index) {
                  if (lisCode.LIS_CD !== '') {
                    wbcInfo.forEach(function(wbcItem) {
                      if (lisCode.IA_CD === wbcItem.id) {
                        if (lisCode.LIS_CD === 'H9600' || lisCode.LIS_CD === 'H9365' ||
                            lisCode.LIS_CD === 'H9366') {
                          if (Number(wbcItem.count > 0)) {
                            resultStr += lisCode.LIS_CD + '|' + '1' + '|' + ','
                          } else {
                            resultStr += lisCode.LIS_CD + '|' + ' ' + '|' + ','
                            // resultStr += lisCode.LIS_CD + '|' + '0' + '|' + ','
                          }
                        } else {
                          if (Number(wbcItem.percent) > 0) {
                            // GP, PA
                            if (lisCode.IA_CD === '13' || lisCode.IA_CD === '14') {
                              if (Number(wbcItem.count) > Number(lisCode.MIN_COUNT)) {
                                resultStr += lisCode.LIS_CD + '|' + wbcItem.percent + '|' + ','
                              } else {
                                resultStr += lisCode.LIS_CD + '|' + ' ' + '|' + ','
                                // resultStr += lisCode.LIS_CD + '|' + '0' + '|' + ','
                              }
                            } else {
                              resultStr += lisCode.LIS_CD + '|' + wbcItem.percent + '|' + ','
                            }
                          }
                        }
                      }
                    })
                  }
                })

                // RBC
                var rbcTmp = ''
                self.lisCodeRbc.forEach(function(lisCode) {
                  if (lisCode.LIS_CD !== '') {
                    self.rbcResults.forEach(function(rbcItem) {
                      if (lisCode.IA_CATEGORY_CD === rbcItem.CATEGORY_ID &&
                          lisCode.IA_CLASS_CD === rbcItem.CLASS_ID) {
                        if (lisCode.LIS_CD === 'H9531' || lisCode.LIS_CD === 'H9535' ||
                            lisCode.LIS_CD === 'H9594' || lisCode.LIS_CD === 'H9571' ||
                            lisCode.LIS_CD === 'H9574' || lisCode.LIS_CD === 'H9595') {
                          if (Number(rbcItem.DEGREE) === 0) {
                            rbcItem.DEGREE = ' '
                          } else {
                            rbcItem.DEGREE = '0'
                          }

                          rbcTmp += lisCode.LIS_CD + '|' + rbcItem.DEGREE + '|' + ','
                          resultStr += lisCode.LIS_CD + '|' + rbcItem.DEGREE + '|' + ','

                        } else {
                          if (Number(rbcItem.DEGREE) === 0) {
                            rbcItem.DEGREE = ' '
                          }
                          rbcTmp += lisCode.LIS_CD + '|' + rbcItem.DEGREE + '|' + ','
                          resultStr += lisCode.LIS_CD + '|' + rbcItem.DEGREE + '|' + ','

                          // if (Number(rbcItem.DEGREE) > 0) {
                          //   rbcTmp += lisCode.LIS_CD + '|' + rbcItem.DEGREE + '|' + ','
                          //   resultStr += lisCode.LIS_CD + '|' + rbcItem.DEGREE + '|' + ','
                          // }
                        }
                      }
                    })
                  }
                })

                var rbcTmp2 = rbcTmp
                rbcTmp2 = rbcTmp2.replace('H9531', 'H9571')
                rbcTmp2 = rbcTmp2.replace('H9532', 'H9572')
                rbcTmp2 = rbcTmp2.replace('H9533', 'H9573')
                rbcTmp2 = rbcTmp2.replace('H9535', 'H9574')
                rbcTmp2 = rbcTmp2.replace('H9536', 'H9575')
                rbcTmp2 = rbcTmp2.replace('H9537', 'H9576')
                rbcTmp2 = rbcTmp2.replace('H9534', 'H9577')
                rbcTmp2 = rbcTmp2.replace('H9538', 'H9578')
                rbcTmp2 = rbcTmp2.replace('H9542', 'H9518')
                rbcTmp2 = rbcTmp2.replace('H9544', 'H9520')
                rbcTmp2 = rbcTmp2.replace('H9546', 'H9517')
                rbcTmp2 = rbcTmp2.replace('H9548', 'H9519')
                rbcTmp2 = rbcTmp2.replace('H9550', 'H9522')
                rbcTmp2 = rbcTmp2.replace('H9552', 'H9521')
                rbcTmp2 = rbcTmp2.replace('H9554', 'H9525')
                rbcTmp2 = rbcTmp2.replace('H9556', 'H9524')
                rbcTmp2 = rbcTmp2.replace('H9558', 'H9526')
                rbcTmp2 = rbcTmp2.replace('H9560', 'H9523')
                rbcTmp2 = rbcTmp2.replace('H9562', 'H9528')
                rbcTmp2 = rbcTmp2.replace('H9564', 'H9530')
                rbcTmp2 = rbcTmp2.replace('H9594', 'H9595')

                resultStr += rbcTmp
                resultStr += rbcTmp2

                console.log(resultStr)

                var params = {
                  url: self.lisConnObj.LIS_URL,
                  machine: 'ADUIMD',
                  episode: self.completeSlotTmp.barcodeNo,
                  result: resultStr
                }

                api.uploadReport_0011(params).then(function(result) {
                  console.log(result)
                  log.info(result)
                }).catch(function (err) {
                  console.log('catch : ' + err.message)
                  log.info(err)
                  self.$toasted.show('report upload : ' + err.message, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                })

              }).catch(function (err) {
                console.log(err)
                self.$toasted.show(err.message + ' : no CBC result', {
                  position: 'bottom-center',
                  duration: '2000'
                })
              })
            }
          }
        }

      })

      ipcRenderer.on(Constant.SELECT_LIS_CODE_INHA, function (event, result) {
        self.lisCode = result
        console.log(self.lisCode)
      })

      ipcRenderer.on(Constant.SELECT_LIS_CODE_RBC_INHA, function (event, result) {
        console.log(result)
        self.lisCodeRbc = result
      })

      // search lis path
      ipcRenderer.on(Constant.SELECT_LIS_CONN_PATH_INHA, function (event, result) {
        console.log(result)
        if (result !== null) {
          self.lisConnObj = result
        }
      })

      // search cbc code
      ipcRenderer.on(Constant.SELECT_CBC_CODE_INHA, function (event, result) {
        console.log(result)
        self.cbcCodeList = result
      })

      // custom class
      ipcRenderer.on(Constant.GET_NORMAL_RANGE, function (event, results) {
        console.log(results)

        self.normalRange = results

        var wbcNormalRange = []

        self.normalRange.forEach(function(item) {
          var obj = {
            analysisType: item.ANALYSIS_TYPE,
            classId: item.CLASS_ID,
            classTitle: item.CLASS_TITLE,
            classNm: item.CLASS_NM,
            min: item.MIN,
            max: item.MAX,
            unit: item.UNIT
          }

          wbcNormalRange.push(obj)
        })

        self.$store.dispatch(Constant.SET_WBC_NORMAL_RANGE, wbcNormalRange)
      })

      ipcRenderer.on(Constant.SELECT_RBC_DEGREE, function (event, results) {
        self.rbcDegreeStandard = results
      })

      worker.norWorker.onmessage = function (event) {
        console.log('<<< onmessage normal >>>')
        console.log(event.data.params)

        // self.EventBus.$emit('RECEIVE_DATA_BARCODE', event.data.params)
        if (event.data.params.resultCd === '00000') {
          // 시스템 정보 요청 재실행
          var timeId = self.systemTimeId
          if (timeId === null) {
            self.sendSystemInfo()
          }
          self.commonReceive(event.data.params)
          self.EventBus.$emit('RECEIVE_DATA', event.data.params)
          // self.EventBus.$emit('RECEIVE_DATA_PROGRESS', event.data.params)

          self.$store.dispatch(Constant.SET_BACKEND_DATA, event.data.params)
        } else {
          if (!self.isModalShow) {
            self.$modal.show(ModalInfo, {code: event.data.params.resultCd, message: event.data.params.resultMsg, level: event.data.params.errorLevel}, {
              height: 'auto',
              width: '500px'
            }, {
              'before-open': self.beforeOpen,
              'before-close': self.beforeClose
            })
          }

          // load 카세트 없음, unload 카세트 없음
          // if (event.data.params.resultCd === '00501' || event.data.params.resultCd === '00502') {
          //   self.commonReceive(event.data.params)
          // }

          console.log(event.data.params.errorLevel)
          if (event.data.params.errorLevel === '2') {
            // running info 종료
            if (self.runningIntervalId !== null) {
              clearInterval(self.runningIntervalId)
              self.runningIntervalId = null
            }

            // 슬라이드 타이머 종료
            if (typeof(self.getWorkingIntervalId) !== 'undefined' && self.getWorkingIntervalId !== null) {
              clearInterval(JSON.parse(JSON.stringify(self.getWorkingIntervalId)))
            }
            self.$store.dispatch(Constant.SET_WORKING_INTERVAL_ID, null)
          }

          self.EventBus.$emit('OVERLAY', {state: false})

          // 에러 전송
          // self.sendErrorLog(event.data.params)
        }
      }

      // worker.sysWorker.onmessage = function (event) {
      //   console.log('<<< onmessage sysinfo >>>')
      //   console.log(event.data.params)
      //
      //   if (event.data.params.resultCd === '00000') {
      //     if (event.data.params.isDoorOpen === 'Y') {
      //       self.isDoorOpen = true
      //     } else {
      //       self.isDoorOpen = false
      //     }
      //
      //     self.eqStatCd = event.data.params.eqStatCd
      //     self.oilCount = event.data.params.oilCount
      //     self.storagePercent = event.data.params.storageSize
      //
      //     self.$store.dispatch(Constant.UPDATE_OIL_COUNT, self.oilCount)
      //     self.$store.dispatch(Constant.SET_SITE_CD, event.data.params.siteCd)
      //     self.$store.dispatch(Constant.SET_DEVICE_BARCODE, event.data.params.deviceBarcode)
      //
      //     // isRecovery 추가
      //     if (event.data.params.isRecovery === 'Y') {
      //       self.$store.dispatch(Constant.SET_USER_STOP, true)
      //     } else {
      //       self.$store.dispatch(Constant.SET_USER_STOP, false)
      //     }
      //
      //     self.sysInfo = event.data.params
      //     self.EventBus.$emit('RECEIVE_DATA_SYSINFO', event.data.params)
      //     self.EventBus.$emit('RECEIVE_DATA_PROGRESS_SYSINFO', event.data.params)
      //     self.EventBus.$emit('RECEIVE_DATA_BARCODE_SYSINFO', event.data.params)
      //   } else {
      //     if (!self.isModalShow) {
      //       self.$modal.show(ModalInfo, {code: event.data.params.resultCd, message: event.data.params.resultMsg, level: event.data.params.errorLevel}, {
      //         height: 'auto',
      //         width: '500px'
      //       }, {
      //         'before-open': self.beforeOpen,
      //         'before-close': self.beforeClose
      //       })
      //     }
      //
      //     if (event.data.params.errorLevel === '2') {
      //       self.clearTimer()
      //     }
      //
      //     self.EventBus.$emit('OVERLAY', {state: false})
      //
      //     // 에러 전송
      //     // self.sendErrorLog(event.data.params)
      //   }
      // }

      // overlay on, off
      self.EventBus.$on('OVERLAY', function(params) {
        self.overlayShow = params.state

        if (self.overlayShow) {
          setTimeout(function() {
            console.log('Loading timeout : ' + self.overlayShow)
            if (self.overlayShow) {
              // self.$toasted.show('Loading timeout', {
              //   position: 'bottom-center',
              //   duration: '2000'
              // })

              self.EventBus.$emit('OVERLAY', {state: false})
            }
          }, 20000)
        }
      })

      self.EventBus.$on('CHANGE_USER', function(params) {
        // 로그인 유저 정보 저장
        self.$store.dispatch(Constant.SET_CURRENT_USER, params)
        self.initElement()
      })

      // oil count 초기화
      self.EventBus.$on('INIT_OIL_COUNT', function(params) {
        self.sendSettingInfo('Y')
      })

      // setInterval(function () {
      //   console.log('----tcp test----')
      //   console.log(tcpClient)
      //   tcpClient.send('test message', function(err, ack) {
      //     console.log('******ack received*****')
      //     console.log(ack.log());
      //
      //     console.log(err)
      //     console.log(ack)
      //   })
      // }, 500)
    },
    data () {
      return {
        client: null,
        sysInfo: null,
        modelData: {
          userId: '',
          loginTime: '',
          userNm: '',
          empNo: ''
        },
        pages: [{
          id: 1, text: 'Setting', imgPath: require('@/assets/test/ic_settings_white_48dp.png'), childrenPage: '/homePage/settings', isSelect: false
        }, {
          id: 2, text: 'Analysis', imgPath: require('@/assets/test/ic_camera_white_48dp.png'), childrenPage: '/homePage/test', isSelect: true
        }, {
          id: 3, text: 'Database', imgPath: require('@/assets/test/ic_chrome_reader_mode_white_48dp.png'), childrenPage: '/homePage/result', isSelect: false
        }],
        oilCount: 0,
        isDoorOpen: false,
        eqStatCd: '01',
        overlayShow: false,
        changeUserList: [],
        isModalShow: false,
        runningSlotId: '',
        errMessage: '',
        runningIntervalId: null,
        systemTimeId: null,
        // 재시작
        isRestart: false,
        storagePercent: '0',
        rbcDegreeStandard: null,
        normalRange: null,
        alarmFile: '',
        isAlarmFlick: true,
        alarmIntervalId: null,
        alarmFlickId: null,
        cbcCodeList: null,
        lisConnObj: null,
        lisCodeRbc: null,
        lisCode: null,
        rbcResults: null,
        completeSlotTmp: null,
        wbcRunningCount: []
      }
    },
    beforeDestroy () {
      // remove EventBus
      this.EventBus.$off()

      // stop interval
      this.clearTimer()

      // worker.norWorker.terminate()
      // worker.sysWorker.terminate()
      ipcRenderer.removeAllListeners(Constant.SELECT_RBC_DEGREE)
      ipcRenderer.removeAllListeners(Constant.GET_NORMAL_RANGE)

      ipcRenderer.removeAllListeners(Constant.SELECT_CBC_CODE_INHA)
      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CODE_RBC_INHA)
      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CONN_PATH_INHA)
      ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT_INHA)
      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CODE_INHA)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_RUNNING_COUNT)

    },
    methods: {
      // ncloud에 영상 데이터 저장
      saveObjcetStorage (completeSlot) {
        var self = this

        var params = {
          bucketName: Configs.BUCKET_RESULT,
          slotId: completeSlot.slotId,
          srcPath: self.getSettings.pbiaRootPath + '/' + completeSlot.slotId,
          rootPath: self.getSettings.pbiaRootPath,
          siteCd: self.sysInfo.siteCd
        }

        // 불완전하게 남은 멀티파트 데이터 삭제
        api.removeMultipartUploads(params).then(function(ret) {
          console.log(ret)
          // 영상 데이터 upload
          api.uploadDirectory(params, function(ret) {
            console.log(ret)

          }).catch(function(err) {
            console.log(err)
          })

        }).catch(function(err) {
          console.log(err)
        })

        // var params = {
        //   bucketName: 'bucket-' + self.sysInfo.siteCd,
        //   slotId: completeSlot.slotId,
        //   srcPath: self.getSettings.pbiaRootPath + '/' + completeSlot.slotId,
        //   rootPath: self.getSettings.pbiaRootPath
        // }
        // 버킷 생성
        // api.createBucket(params).then(function(bucketName) {
        //   console.log(bucketName)
        //   // 불완전하게 남은 멀티파트 데이터 삭제
        //   api.removeMultipartUploads(params).then(function(ret) {
        //     console.log(ret)
        //     // 영상 데이터 upload
        //     api.uploadDirectory(params, function(ret) {
        //       console.log(ret)
        //
        //     }).catch(function(err) {
        //       console.log(err)
        //     })
        //
        //   }).catch(function(err) {
        //     console.log(err)
        //   })
        //
        // }).catch(function(err) {
        //   console.log(err)
        // })
      },
      sendWbcRunningCount (runningCount) {
        var params = {
          jobCmd: 'RUNNING_COUNT_REG',
          reqUserId: this.modelData.userId,
          reqDttm: this.$getDateTimeStr(),
          wbcRunningCount: runningCount
        }

        console.log('sendWbcRunningCount -')
        console.log(params)
        worker.sendDataToServer(this, JSON.stringify(params))
      },
      getCbc0011 (currentSlot) {
        console.log('getCbc0011 start [')
        console.log(currentSlot)
        console.log(self.lisConnObj)

        var self = this

        var params = {
          url: self.lisConnObj.CBC_URL,
          machine: 'ADUIMD',
          episode: self.currentSlot.barcodeNo
        }

        console.log(params)

        api.getCdcResults_0011(params).then(function(cbcResult) {
          console.log(cbcResult)
          var testCodeList = cbcResult.data[0].testCode.split(',')
          var tmpList = []

          console.log(testCodeList)
          testCodeList.forEach(function(codes) {
            if (codes.length > 0) {
              var codeArray = codes.split('|')
              var code = codeArray[0]
              var value = codeArray[1]

              if (code === 'H1101') {
                var wbcCount = Number(value) * 1000
                var runningCount = 100

                console.log('wbcCount : ' + wbcCount)
                self.wbcRunningCount.forEach(function(runningCount) {
                  if (Number(runningCount.MIN) <= wbcCount && Number(runningCount.MAX) >= wbcCount ) {
                    runningCount = runningCount.COUNT
                  }
                })

                console.log('runningCount : ' + runningCount)
                self.sendWbcRunningCount(runningCount)
              }
            }
          })
        }).catch(function (err) {
          console.log(err)
          self.$toasted.show(err.message + ' : no CBC result', {
            position: 'bottom-center',
            duration: '2000'
          })
        })
        console.log('getCbc0011 end ]')
      },
      sendLis0011 (completeSlot) {
        console.log('sendLis0011')
        console.log(completeSlot)

        var self = this
        self.completeSlotTmp = completeSlot
        ipcRenderer.send(Constant.GET_RBC_COUNT_INHA, JSON.stringify({slotId: self.completeSlotTmp.slotId}))

      },
      onClickAlarm () {
        if (this.alarmIntervalId !== null) {
          clearInterval(this.alarmIntervalId)
          this.alarmIntervalId = null
        }
        if (this.alarmFlickId !== null) {
          clearInterval(this.alarmFlickId)
          this.alarmFlickId = null
        }

        this.isAlarmFlick = true
      },
      saveTestHistory (params) {
        var self = this

        var completeSlot = params.slotInfo.find(function (item) {
          return item.slotId === self.runningSlotId && item.stateCd === '04'
        })

        var isNsNbIntegration = 'N'
        if (self.getSettings.isNsNbIntegration) {
          isNsNbIntegration = 'Y'
        }

        console.log(completeSlot)
        if (typeof(completeSlot) !== 'undefined') {
          completeSlot.userId = self.modelData.userId
          completeSlot.cassetId = params.cassetId
          completeSlot.isNsNbIntegration = isNsNbIntegration

          // PB 비정상 클래스 체크
          completeSlot.isNormal = 'Y'

          if (completeSlot.analysisType === '01') {
            completeSlot.isNormal = self.$checkPbNormalCell(completeSlot.wbcInfo).isNormal
          }

          // database 내역 저장
          ipcRenderer.send(Constant.SET_TEST_HISTORY, JSON.stringify(completeSlot))

          var version = Number(self.$replaceAll(Package.version, '.', ''))
          if (version > 155) {
            self.calcRbcDegree(completeSlot)
          }

          // WBC, RBC 처리 정보 저장
          ipcRenderer.send(Constant.SET_CLASSIFICATION, JSON.stringify(completeSlot))

          self.isRestart = false

          // 삼광 LIS 주문데이터 생성
          if (self.sysInfo.siteCd === '0007') {
            var params = {
              barcodeNo: completeSlot.barcodeNo,
              resultCd: ''
            }

            api.createOrder_0007(params).then(function(result) {
              console.log(result.data.results.resultCd)
            }).catch(function (err) {
              console.log(err)
            })
          } else if (self.sysInfo.siteCd === '0011') { // 인하대 검사후 즉시 업로드
            self.sendLis0011(completeSlot)
          }

          // self.saveObjcetStorage(completeSlot)

          // 분석 이력 서버 전송 API
          // self.sendDeviceUse(completeSlot)
        }

        // 슬라이드 타이머 초기화
        self.$store.dispatch(Constant.SET_SLIDE_TIMER, 0)

      },
      sendErrorLog (params) {
        var self = this

        var params = {
          siteCd: this.sysInfo.siteCd,
          deviceBarcode: this.sysInfo.deviceBarcode,
          errorCd: params.resultCode,
          errorMsg: params.errorMsg,
          errorLevelCd: params.errorLevel,
          userId: this.getCurrentUser.userId
        }

        // 정책조회
        api.getPolicy(params, 'policy').then(function(result) {
          if (result.data.errorCode === 'E0000') {
            var policy = result.data.results

            if (policy[0].PY_ERROR === 'Y') {
              api.sendErrorCode(params, 'error').then(function(result) {
                console.log(result)
              })
            }
          }
        })
      },
      sendDeviceUse (slide) {
        console.log('sendDeviceUse')
        var self = this
        var cards = []

        this.sysInfo.activationCards.forEach(function(activationCard) {
          cards.push(activationCard.card)
        })

        var params = {
          trId: this.$getUuid(),
          deviceBarcode: this.sysInfo.deviceBarcode,
          serialNo: this.sysInfo.deviceBarcode,
          tactTime: slide.tactTime,
          runningTime: "" + this.$store.getters.getWorkingTimer,
          siteCd: this.sysInfo.siteCd,
          deviceTypeCd: '01',
          currentCardName: this.sysInfo.currentCardName,
          currentSerialNo: this.sysInfo.currentSerialNo,
          currentCardCount: this.sysInfo.currentCardCount,
          userId: this.getCurrentUser.userId,
          cassetId: slide.cassetId,
          slotId: slide.slotId,
          cards: cards,
          wbcInfo: slide.wbcInfo,
          rbcInfo: slide.rbcInfo
        }

        console.log(params)

        // 정책조회
        api.getPolicy(params, 'policy').then(function(result) {
          console.log(result)

          if (result.data.errorCode === 'E0000') {
            var policy = result.data.results

            if (policy[0].PY_TACT_TIME === 'N') {
              params.tactTime = ''
            }

            if (policy[0].PY_RUNNING_TIME === 'N') {
              params.runningTime = ''
            }

            if (policy[0].PY_DEVICE_USE_COUNT === 'N' ||
              policy[0].PY_CARD_REMAIN_COUNT === 'N') {
              params.currentCardCount = ''
            }

            if (policy[0].PY_WBC_RESULT === 'N') {
              params.wbcInfo = []
            }

            if (policy[0].PY_RBC_RESULT === 'N') {
              params.rbcInfo = []
            }

          } else {
            self.saveHistoryFile(params)
          }
          // 장비 사용 이력 저장
          api.sendDeviceUse(params, 'card').then(function(result) {
            console.log('sendDeviceUse success')

          }).catch(function (err) {
            console.log('sendDeviceUse failed')
            console.log(err.message)
            self.saveHistoryFile(params)
          })

        }).catch(function (err) {
          console.log(err.message)
          self.saveHistoryFile(params)
        })
      },
      saveHistoryFile (params) {
        var self = this

        console.log('--saveHistoryFile--')

        params.createDttm = self.$getDateTime()
        var fileText = JSON.stringify(params) + '\n'
        var filePath = self.getSettings.pbiaRootPath + '/HIST_TMP'

        // 폴더 없으면 생성
        fs.access(filePath, function(err) {
          if (err) {
            fs.mkdirSync(filePath)
          }
        })

        fs.appendFile(filePath + '/' + self.sysInfo.deviceBarcode + '.json', fileText, function(err) {
          console.log('save : ' + self.sysInfo.deviceBarcode + '.json')
          if (!err) {
            console.log('save success')
          } else {
            console.log('save error : ' + err.message)
          }
        })
      },
      calcRbcDegree (completeSlot) {
        var self = this
        var totalCount = 0
        var sizeTotal = 0
        var chromiaTotal = 0

        console.log('calcRbcDegree')
        console.log(completeSlot)

        // shape, inclusion body total
        totalCount = Number(completeSlot.maxRbcCount)

        // degree
        completeSlot.rbcInfo.forEach(function (rbcCategory, catIndex) {
          rbcCategory.classInfo.forEach(function (rbcClass, clsIndex) {

            // size total
            if (rbcCategory.categoryId === '01') {
              if (rbcClass.classId !== '04') {
                sizeTotal += Number(rbcClass.degree)
              }
            }

            // chromia total
            else if (rbcCategory.categoryId === '02') {
              if (rbcClass.classId !== '04') {
                chromiaTotal += Number(rbcClass.degree)
              }
            }

            // size, chromia total [shape normal]
            // if (rbcCategory.categoryId === '03') {
            //   if (rbcClass.classId === '01') {
            //     sizeTotal = Number(rbcClass.degree)
            //     chromiaTotal = Number(rbcClass.degree)
            //   }
            // }
          })
        })

        console.log('sizeTotal : ' + sizeTotal)
        console.log('chromiaTotal : ' + chromiaTotal)
        console.log('totalCount : ' + totalCount)
        console.log(self.rbcDegreeStandard)

        completeSlot.rbcInfo.forEach(function (rbcCategory, catIndex) {
          rbcCategory.classInfo.forEach(function (rbcClass, clsIndex) {
            self.rbcDegreeStandard.forEach(function(degreeStandard) {
              if ((degreeStandard.CATEGORY_ID === rbcCategory.categoryId) &&
                  (degreeStandard.CLASS_ID === rbcClass.classId)) {
                var degreeCount = Number(rbcClass.degree)
                var percent = 0

                if (degreeStandard.CATEGORY_ID === '01') {
                  percent = ((degreeCount / sizeTotal) * 100).toFixed(2)
                } else if (degreeStandard.CATEGORY_ID === '02') {
                  percent = ((degreeCount / chromiaTotal) * 100).toFixed(2)
                } else {
                  percent = ((degreeCount / totalCount) * 100).toFixed(2)
                }

                console.log(degreeCount)
                console.log('rbc category : ' + rbcCategory.categoryId)
                console.log('rbc class : ' + rbcClass.classId)
                console.log('percent : ' + percent)

                // 0
                if (percent < degreeStandard.DEGREE_1) {
                  rbcClass.degree = '0'
                }
                // 1
                else if (percent >= degreeStandard.DEGREE_1 && percent < degreeStandard.DEGREE_2) {
                  rbcClass.degree = '1'
                }
                // 2
                else if (percent >= degreeStandard.DEGREE_2 && percent < degreeStandard.DEGREE_3) {
                  rbcClass.degree = '2'
                }
                // 3
                else if (percent >= degreeStandard.DEGREE_3) {
                  rbcClass.degree = '3'
                } else {
                  rbcClass.degree = '0'
                }
              }
            })
          })
        })

        completeSlot.rbcInfo.forEach(function (rbcCategory, catIndex) {
          rbcCategory.classInfo.forEach(function (rbcClass, clsIndex) {
            // size
            if (rbcCategory.categoryId === '01') {
              if (rbcClass.classId === '01') {
                rbcCategory.classInfo[0].degree = '1'
              }
              if (rbcClass.classId === '02' || rbcClass.classId === '03') {
                if (Number(rbcClass.degree) > 0) {
                  rbcCategory.classInfo[0].degree = '0'
                }
              }
            }

            // chromia
            if (rbcCategory.categoryId === '02') {
              if (rbcClass.classId === '01') {
                rbcCategory.classInfo[0].degree = '1'
              }

              if (rbcClass.classId === '02' || rbcClass.classId === '03') {
                if (Number(rbcClass.degree) > 0) {
                  rbcCategory.classInfo[0].degree = '0'
                }
              }
            }

            // Poikilocytosis
            if (rbcCategory.categoryId === '03') {
              if (rbcClass.classId === '01') {
                // normal
                rbcCategory.classInfo[0].degree = '1'
                // poikilo
                rbcCategory.classInfo[1].degree = '0'
              }

              if (rbcClass.classId !== '01' && rbcClass.classId !== '02') {
                var poikiloDegree = Number(rbcCategory.classInfo[1].degree)
                if (Number(rbcClass.degree) > poikiloDegree) {
                  rbcCategory.classInfo[0].degree = '0'
                  rbcCategory.classInfo[1].degree = rbcClass.degree
                }
              }
            }

          })
        })
      },
      onImmersionOil (evt) {
        this.$modal.show(ModalImmersionOil, {oilCount: this.oilCount}, {
          height: 'auto',
        })
      },
      initElement () {
        var self = this
        var userInfo = this.getUser(this.getCurrentUser.userId)
        this.modelData.userId = userInfo.userId
        this.modelData.userNm = userInfo.userName
        this.modelData.empNo = userInfo.empNo
        this.modelData.loginTime = this.$stringToLoginTime(this.getCurrentUser.loginTime)
        this.oilCount = this.getSettings.currentOilCount.toString()
        this.sysInfo = this.getSysInfo

        console.log(this.sysInfo)

        var tmpArray = []
        var loginHistList = []

        // 활성화된 계정만
        for (var i = 0; i < this.getLoginHistory.length; i++) {
          var userInfo = this.getUser(this.getLoginHistory[i].userId)
          if (userInfo !== null && userInfo.isAvailable === 'Y') {
            loginHistList.push(this.getLoginHistory[i])
          }
        }

        if (loginHistList.length > 4) {
          tmpArray = loginHistList.slice(1, 4)

        } else {
          tmpArray = loginHistList.slice(1, loginHistList.length + 1)
        }

        this.changeUserList = []
        for (var i = 0; i < tmpArray.length; i++) {
          var obj = JSON.parse(JSON.stringify(this.getUser(tmpArray[i].userId)))
          obj.loginTime = tmpArray[i].loginTime
          obj.isSelected = false
          obj.password = ''
          this.changeUserList.push(obj)
        }

        this.alarmFile = new Audio(require('@/assets/sound/alarm.mp3'))

      },
      sendSettingInfo (isOilReset) {
        var isNsNbIntegration = 'N'
        if (this.getSettings.isNsNbIntegration) {
          isNsNbIntegration = 'Y'
        }

        // 설정 정보 등록
        var params = {
          jobCmd: 'SETTINGS',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          pbiaRootDir: this.getSettings.pbiaRootPath,
          oilCount: this.getSettings.currentOilCount.toString(),
          isOilReset: isOilReset,
          deviceType: '01',
          uiVersion: Configs.BUCKET_NAME + '_v' + Package.version,
          isNsNbIntegration: isNsNbIntegration
        }

        console.log(params)
        worker.sendDataToServer(this, JSON.stringify(params))
      },
      sendSystemInfo () {
        // 시스템 정보 요청
        this.systemTimeId = setInterval(function() {
          var params = {
            jobCmd: 'SYSINFO',
            reqUserId: this.modelData.userId,
            reqDttm: this.$getDateTimeStr()
          }

          worker.sendDataToServer(this, JSON.stringify(params))
        }.bind(this), 500)
      },
      onClickTab (page) {
        var self = this

        if (this.$store.getters.getRunningState && (page.childrenPage !== '/homePage/result' && page.childrenPage !== '/homePage/test')) {
          this.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        if (this.$route.path !== page.childrenPage) {
          for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].isSelect = false
          }
          page.isSelect = true

          console.log(page.id)
          console.log(this.getPauseState)
          // tab 변경후 재진입시 화면 load
          if (page.id === 2 && this.getPauseState) {
            this.runningIntervalId = setInterval(function() {
              self.sendRunningInfo()
            }, 500)
          }
          this.$router.push(page.childrenPage)
        }
      },
      onModalLogout (evt) {
        if (this.$store.getters.getRunningState) {
          this.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        // var obj = {}
        // obj.isRememberMe = false
        // obj.isAutoLogin = false
        // obj.saveId = ''
        // obj.savePassword = ''
        //
        // this.$store.dispatch(Constant.UPDATE_REMEMBER_STATE, obj)

        var logObj = {}
        logObj.userId = this.modelData.userId
        logObj.eventTypeCd = Constant.EVENT_TYPE_USER
        logObj.logDttm = this.$getDateTimeStr()
        logObj.logMessage = '[' + Constant.EVENT_TYPE_USER + ']' + 'Logout'

        this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
        this.$router.push('/loginPage')
      },
      // onTest (evt) {
      //   console.log(evt)
      //   var parser = new hl7.Parser({segmentSeperator: '\n'});
      //   var client = hl7.Server.createFileClient('D:/hl7test/test-import');
      //   var msg = parser.parseFileSync('D:/hl7test/adt.hl7');
      //   // var msg = new hl7.Message(
      //   //             "EPIC",
      //   //             "EPICADT",
      //   //             "SMS",
      //   //             "SMSADT",
      //   //             "199912271408",
      //   //             "CHARRIS",
      //   //             ["ADT", "A04"], //This field has 2 components
      //   //             "1817457",
      //   //             "D",
      //   //             "2.5"
      //   //         );
      //
      //   console.log(msg)
      //
      //   client.send(msg, function(err) {
      //     console.log('************sending message****************');
      //     if (err) {
      //       console.log("ERR: " + err.message);
      //     } else {
      //       //NO ACK for File Client
      //     }
      //   })
      // },
      onDropdownShow (evt) {
        this.initElement()
      },
      // onImmersionOil (evt) {
      //   this.$modal.show(ModalConfirm, {openType: 'immersionOil', message: Constant.IDS_MSG_OIL_REMAIN_COUNTER}, {
      //     height: 'auto',
      //     width: '350px'
      //   })
      // },
      clearTimer () {
        if (this.systemTimeId !== null) {
          clearInterval(this.systemTimeId)
          this.systemTimeId = null
          // this.$store.dispatch(Constant.SET_SYSTEM_TIME_ID, null)
        }
      },
      // 실행 완료
      sendRunningComp () {
        var params = {
          jobCmd: 'RUNNING_COMP',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
        console.log('[Send : RUNNING_COMP]' + '[' + params + ']')
        // var logObj = {}
        // logObj.userId = this.modelData.userId
        // logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        // logObj.logDttm = this.$getDateTimeStr()
        // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
        //                     '[Send : RUNNING_COMP]'
        // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      pause () {
        // 일시정지
        var params = {
          jobCmd: 'PAUSE',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      stop () {
        // 종료
        var params = {
          jobCmd: 'STOP',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          isEmergency: 'N',
          isUserStop: 'N'
        }

        worker.sendDataToServer(this, JSON.stringify(params))
        console.log('[' + Constant.EVENT_TYPE_SYSTEM + ']' + '[Send : STOP]')
        // var logObj = {}
        // logObj.userId = this.modelData.userId
        // logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        // logObj.logDttm = this.$getDateTimeStr()
        // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
        //                     '[Send : STOP]'
        // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      errorClear () {
        console.log('error clear')
        var params = {
          jobCmd: 'ERROR_CLEAR',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          pbiaRootDir: this.getSettings.pbiaRootPath,
          oilCount: this.getSettings.currentOilCount.toString(),
          isOilReset: 'N',
          deviceType: '01',
          uiVersion: Configs.BUCKET_NAME + '_v' + Package.version
        }

        worker.sendDataToServer(this, JSON.stringify(params))

        // var logObj = {}
        // logObj.userId = this.modelData.userId
        // logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        // logObj.logDttm = this.$getDateTimeStr()
        // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
        //                     '[Send : ERROR_CLEAR]'
        // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      beforeOpen () {
        this.isModalShow = true
      },
      beforeClose () {
        this.isModalShow = false
        this.errorClear()

        if (this.systemTimeId === null) {
          this.sendSystemInfo()
        }
      },
      onClickAccount (evt, item) {
        for (var i = 0; i < this.changeUserList.length; i++) {
          if (this.changeUserList[i].userId === item.userId && this.changeUserList[i].loginTime === item.loginTime) {
            this.changeUserList[i].isSelected = true
          } else {
            this.changeUserList[i].isSelected = false
            this.changeUserList[i].password = ''
          }
        }
      },
      onLogin (item) {
        var self = this
        if (this.$store.getters.getRunningState) {
          this.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        for (var i = 0; i < this.changeUserList.length; i++) {
          if (this.changeUserList[i].userId === item.userId && this.changeUserList[i].loginTime === item.loginTime) {
            if (this.changeUserList[i].password !== null && this.changeUserList[i].password !== '') {
              var decPassword = this.$CryptoJS.AES.decrypt(this.changeUserList[i].encPassword, this.changeUserList[i].password).toString(this.$CryptoJS.enc.Utf8)

              if (decPassword !== this.changeUserList[i].password) {
                this.$toasted.show(Constant.IDS_ERROR_NOT_MATCHED_PASSWORD, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              } else {
                self.EventBus.$emit('OVERLAY', {state: true})

                setTimeout(function() {
                  self.EventBus.$emit('OVERLAY', {state: false})

                  var loginObj = {
                    userId: item.userId,
                    loginTime: self.$getDateTime()
                  }
                  self.EventBus.$emit('CHANGE_USER', loginObj)
                  self.$refs.dropdown.hide(true)

                  self.$toasted.show(Constant.IDS_MSG_ACCOUNT_CHANGED, {
                    position: 'bottom-center',
                    duration: '2000'
                  })

                  // var logObj = {}
                  // logObj.userId = self.modelData.userId
                  // logObj.eventTypeCd = Constant.EVENT_TYPE_USER
                  // logObj.logDttm = self.$getDateTimeStr()
                  // logObj.logMessage = '[' + Constant.EVENT_TYPE_USER + '[' + self.modelData.userId + ']->' + '[' + item.userId + ']' + ']'
                  // self.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
                  console.log('[' + Constant.EVENT_TYPE_USER + '[' + self.modelData.userId + ']->' + '[' + item.userId + ']' + ']')
                }, 2000)
              }
            } else {
              this.$toasted.show(Constant.IDS_ERROR_NOT_MATCHED_PASSWORD, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          }
        }
      },
      // 검사 실행 정보 수신
      sendRunningInfo () {
        var params = {
          jobCmd: 'RUNNING_INFO',
          reqUserId: this.modelData.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      // 공통 처리
      commonReceive (params) {
        var self = this
        var jobCmd = params.jobCmd

        var logObj = {}
        logObj.userId = this.modelData.userId
        logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        logObj.logDttm = this.$getDateTimeStr()

        if (jobCmd === 'INIT') {
          self.EventBus.$emit('OVERLAY', {state: false})
          self.sendSettingInfo('N')

        } else if (jobCmd === 'BARCODE_REG') {
            self.$toasted.show(Constant.IDS_BARCODE_REGISTRATION_SUCCESSFUL, {
              position: 'bottom-center',
              duration: '2000'
            })
            
        } else if (jobCmd === 'START') {
          self.$store.dispatch(Constant.UPDATE_RUNNING_STATE, true)
          self.runningIntervalId = setInterval(function() {
            self.sendRunningInfo()
          }, 500)

          // 2022_12_12_LBK : 다른 페이지에서 상단 프로그래스로 동작하지
          // 않는 문제로 처리를 processingPanel에서 home으로 옮김
          var timerId = null

          self.$store.dispatch(Constant.SET_TIMER, 0)
          self.$store.dispatch(Constant.SET_SLIDE_TIMER, 0)

          timerId = setInterval(function() {
            self.$store.dispatch(Constant.UPDATE_TIMER)
            self.$store.dispatch(Constant.UPDATE_SLIDE_TIMER)
            self.$store.dispatch(Constant.SET_WORKING_INTERVAL_ID, timerId)

            self.EventBus.$emit('DRAW_TIMER')
          }, 1000)

          // console.log('[Receive : ' + jobCmd + ']')
          // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
          //                     '[Receive : ' + jobCmd + ']'
          // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)

        } else if (jobCmd === 'RECOVERY') {
          console.log('recovery---')
          self.$store.dispatch(Constant.SET_USER_STOP, false)
          self.EventBus.$emit('OVERLAY', {state: false})

        } else if (jobCmd === 'RUNNING_INFO') {
          // 스캔중일때는 pass
          if (params.iCasStat !== '999999999999') {
            var currentSlot = params.slotInfo.find(function (item) {
              return item.stateCd === '03'
            })

            // 슬라이드 변경시 데이터 저장
            if (typeof(currentSlot) !== 'undefined') {
              // 일시 정지 (BF)
              if (currentSlot.isLowPowerScan === 'Y' && currentSlot.testType === '03') {
                // running info 종료
                // clearInterval(self.runningIntervalId)
                // send pause
                self.pause()

              } else {
                if (currentSlot.slotId !== self.runningSlotId) {
                  // 인하대 wbc count 자동 입력
                  // if (self.sysInfo.siteCd === '0011') {
                  //   self.getCbc0011(currentSlot)
                  // }
                  self.saveTestHistory(params)

                  // 실행중인 슬롯ID 변경
                  self.runningSlotId = currentSlot.slotId
                  self.EventBus.$emit('CHANGE_SLIDE', params)
                }
              }
            }

            // if (params.resultCd === '00000') {
            // 주문 내역 및 처리 결과 저장 -start
            // iCasStat (0 - 없음, 1 - 있음, 2 - 진행중, 3 - 완료, 4 - 에러, 9 - 스캔)
            const regex = /[1,2,9]/g
            if ((params.iCasStat.search(regex) < 0) || params.oCasStat === '111111111111') {
              // 최종 슬라이드 내역 저장
              self.saveTestHistory(params)

              // send running comp
              self.sendRunningComp()
            }
          }

        } else if (jobCmd === 'RUNNING_COMP') {
          console.log('[Receive : ' + jobCmd + ']')

          if (self.getSettings.isAlarm) {
            setTimeout(function() {
              self.alarmIntervalId = setInterval(function() {
                self.alarmFile.play()
              }, 6000)
              self.alarmFlickId = setInterval(function() {
                self.isAlarmFlick = !self.isAlarmFlick
              }, 1000)
            }, Number(self.getSettings.alarmCount) * 1000)
          }

          this.stop()
          // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
          //                     '[Receive : ' + jobCmd + ']'
          // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)

        } else if (jobCmd === 'STOP') {
          console.log('[Receive : ' + jobCmd + ']')

          // 실행 상태 변경
          this.$store.dispatch(Constant.UPDATE_RUNNING_STATE, false)

          // running info 종료
          clearInterval(self.runningIntervalId)
          this.runningIntervalId = null

          // 슬라이드 타이머 종료
          clearInterval(JSON.parse(JSON.stringify(this.getWorkingIntervalId)))
          // 슬라이드 타이머 초기화
          this.$store.dispatch(Constant.SET_WORKING_INTERVAL_ID, null)
          this.runningSlotId = ''

          // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
          //                     '[Receive : ' + jobCmd + ']'
          // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)

        } else if (jobCmd === 'PAUSE') {
          this.$store.dispatch(Constant.SET_PAUSE_STATE, true)
          clearInterval(self.runningIntervalId)
          self.runningIntervalId = null

        } else if (jobCmd === 'RESTART') {
          this.isRestart = true
          this.$store.dispatch(Constant.SET_PAUSE_STATE, false)

          console.log(this.runningIntervalId)
          if (this.runningIntervalId === null) {
            this.runningIntervalId = setInterval(function() {
              self.sendRunningInfo()
            }, 500)
          }
        } else if (jobCmd === 'ERROR_CLEAR') {
          if (params.resultCd === '00000') {
            // this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            //   position: 'bottom-center',
            //   duration: '2000'
            // })
          } else {
            this.$toasted.show(Constant.IDS_MSG_FAILED, {
              position: 'bottom-center',
              duration: '2000'
            })
          }

          // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
          //                     '[Receive : ' + jobCmd + ']' + '[' + params.resultCd + '-' + params.resultMsg + ']'
          // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)

          this.errMessage = params.resultMsg
        } else if (jobCmd === 'SYSINFO') {
          if (params.resultCd === '00000') {
            if (params.isDoorOpen === 'Y') {
              self.isDoorOpen = true
            } else {
              self.isDoorOpen = false
            }

            self.eqStatCd = params.eqStatCd
            self.oilCount = params.oilCount
            self.storagePercent = params.storageSize

            self.$store.dispatch(Constant.UPDATE_OIL_COUNT, self.oilCount)
            self.$store.dispatch(Constant.SET_SITE_CD, params.siteCd)
            self.$store.dispatch(Constant.SET_DEVICE_BARCODE, params.deviceBarcode)

            // isRecovery 추가
            if (params.isRecovery === 'Y') {
              self.$store.dispatch(Constant.SET_USER_STOP, true)
            } else {
              self.$store.dispatch(Constant.SET_USER_STOP, false)
            }

            // self.sysInfo = params
            self.$store.dispatch(Constant.SET_SYS_INFO, params)
            // self.EventBus.$emit('RECEIVE_DATA_SYSINFO', params)
            // self.EventBus.$emit('RECEIVE_DATA_PROGRESS_SYSINFO', params)
            // self.EventBus.$emit('RECEIVE_DATA_BARCODE_SYSINFO', params)
          } else {
            if (!self.isModalShow) {
              self.$modal.show(ModalInfo, {code: params.resultCd, message: params.resultMsg, level: params.errorLevel}, {
                height: 'auto',
                width: '500px'
              }, {
                'before-open': self.beforeOpen,
                'before-close': self.beforeClose
              })
            }

            if (params.errorLevel === '2') {
              self.clearTimer()
            }

            self.EventBus.$emit('OVERLAY', {state: false})
          }
        }
      }
    }
  }
</script>

<style>
  #mainTab div {
    color: gray;
  }
  #mainTab:hover div {
    color: white;
  }
  #mainTab:hover img {
    -webkit-filter: opacity(.8) drop-shadow(0 0 0 white) !important;
    filter: opacity(.8) drop-shadow(0 0 0 white) !important;
  }
  #wrapper {
    /* border: 1px solid #303744;
    border-radius: 5px; */
    margin-top: 5px;
  }
  #accountCard:hover {
    background-color: #EEEEEE;
  }
  .imgSelect {
    -webkit-filter: opacity(.8) drop-shadow(0 0 0 white) !important;
    filter: opacity(.8) drop-shadow(0 0 0 white) !important;
  }
  .imgNonSelect {
    -webkit-filter: opacity(.5) drop-shadow(0 0 0 gray) !important;
    filter: opacity(.5) drop-shadow(0 0 0 gray) !important;
  }
  .labelSelect {
    color: white !important;
  }
  .dropdown-toggle {
    background-color: #1C283E !important;
    border: none !important;
  }
</style>
