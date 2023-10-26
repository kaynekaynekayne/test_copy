<template>
  <b-container id="resultClassification" class="pl-1 pt-0 pb-2" fluid>
    <b-row>
      <b-col class="p-0 pt-1 pb-1 pl-4">
        <div>
          <b-row>
            <b-col cols="1" class="pr-0">
              <img id="slideInfo" class="pointer" src="~@/assets/icon/slide_Information.png" style="width: 35px;"/>
              <b-popover
                target="slideInfo"
                placement="bottom"
                triggers="hover focus"
              >
                <img :src="barcodePath" style="width: 250px;" />
                <div class="mt-2">
                  <input type="hidden" id="barcodeNo" :value="selectedItem.BARCODE_NO">
                  <b-button variant="outline-primary" size="sm" @click="onBarcodeCopy">{{ selectedItem.BARCODE_NO }}</b-button>
                  <span class="float-right pt-1" style="font-size: 12px;">{{ $stringToDateTime(selectedItem.ANALYZE_DTTM) }}</span>
                </div>
              </b-popover>
            </b-col>
            <b-col cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ testTypeNm }} Smear
              </div>
            </b-col>
            <b-col cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ selectedItem.BARCODE_NO }}
              </div>
            </b-col>
            <b-col v-if="selectedItem.PATIENT_ID !== ''" cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ selectedItem.PATIENT_ID }}
              </div>
            </b-col>
            <b-col v-else-if="cbcPatientNo !== ''" cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ cbcPatientNo }}
              </div>
            </b-col>
            <b-col v-else cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                -
              </div>
            </b-col>

            <b-col v-if="selectedItem.PATIENT_NM !== ''" cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ selectedItem.PATIENT_NM }}
              </div>
            </b-col>
            <b-col v-else-if="cbcPatientNm !== ''" cols="2" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ cbcPatientNm }} ( {{ cbcSex }} ) ( {{ cbcAge }} )
              </div>
            </b-col>
            <b-col v-else cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                -
              </div>
            </b-col>

            <b-col cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ $stringToDateTime(selectedItem.ANALYZE_DTTM) }}
              </div>
            </b-col>
          </b-row>
        </div>

        <div style="width: 40px; float: left;">
          <div v-for="menu in menus" class="mt-2" v-bind:key="menu.id" @click="onClickMenu(menu)" style="font-size: 17px;">
            <b-row class="pointer mt-3">
              <b-col cols="2">
                <img v-if="menu.isSelect === true" :src="menu.iconOn" style="width: 35px;"/>
                <img v-else :src="menu.iconOff" style="width: 35px;"/>
                <div class="text-center mt-1" style="width: 35px; font-size: 8px;">{{ menu.name }}</div>
              </b-col>
            </b-row>
          </div>

          <img v-if="isCbcShow" class="pointer mt-5" src="~@/assets/icon/LIS_ON.png" @click="onClickCbc" style="width: 35px;"/>
          <img v-else="isCbcShow" class="pointer mt-5" src="~@/assets/icon/LIS_OFF.png" @click="onClickCbc" style="width: 35px;"/>
          <div class="text-center mt-1" style="width: 35px; font-size: 8px;">LIS-CBC</div>
        </div>

        <div v-if="isCbcShow" id="divCbcdiff" class="mt-0 p-2" style="width: 350px; float: left;">
          <b-card id="cbcDiffCard" class="cbcCard h-100" text-variant="white" no-body style="overflow-y: scroll; overflow-x: none;">
            <div class="panelTitle">
              <span>CBC + WBC Differential</span>
            </div>

            <div v-if="siteCd === '0002'">
              <b-row v-if="cbcWorkList !== null && typeof(cbcItem.inptrslt._cdata) !== 'undefined' && cbcItem.inptrslt._cdata > 0"
                class="mt-2 panelContent" v-for="(cbcItem, index) in cbcWorkList" :key="index">
                <b-col cols="8">
                  {{ cbcItem.tclsscrnnm._cdata }}
                </b-col>
                <b-col>
                  {{ cbcItem.inptrslt._cdata }}
                </b-col>
              </b-row>
            </div>
            <div v-if="siteCd === '0007'">
              <b-row v-if="cbcWorkList !== null" class="mt-2 panelContent" v-for="(cbcItem, index) in cbcWorkList" :key="index"
                style="font-size: 12px;">
                <b-col cols="5">
                  {{ cbcItem.testNm }}
                </b-col>
                <b-col>
                  {{ cbcItem.count }}
                  <span v-if="cbcItem.cham !==''" style="color: #2798DC;">
                    ({{ cbcItem.cham }})
                  </span>
                </b-col>
                <b-col class="text-right">
                  {{ cbcItem.unit }}
                </b-col>
              </b-row>
            </div>
            <div v-else>
              <b-row v-if="cbcWorkList !== null" class="mt-2 panelContent" v-for="(cbcItem, index) in cbcWorkList" :key="index">
                <b-col cols="8">
                  {{ cbcItem.testNm }}
                </b-col>
                <b-col>
                  {{ cbcItem.count }}
                </b-col>
                <b-col>
                  {{ cbcItem.unit }}
                </b-col>
              </b-row>
            </div>
          </b-card>
        </div>

        <div v-if="isCbcShow" class="p-1 pr-0 pl-3" style="width: 79%; float: left;">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
        <div v-else class="p-1 pr-0 pl-3" style="width: 97%; float: left;">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>

        <div class="ml-1" style="position: absolute; bottom: 40px;">
          <div>
            <b-icon v-if="isPrev" id="iconPrev" class="pointer" icon="arrow-up-square" font-scale="2" @click="onClickPrev"></b-icon>
            <b-icon v-else id="iconPrevDisabled" icon="arrow-up-square" font-scale="2"></b-icon>
          </div>
          <div class="mt-2">
            <b-icon v-if="isNext" id="iconNext" class="pointer" icon="arrow-down-square" font-scale="2" @click="onClickNext"></b-icon>
            <b-icon v-else id="iconNextDisabled" icon="arrow-down-square" font-scale="2"></b-icon>
          </div>
        </div>
      </b-col>
    </b-row>

  </b-container>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'
  import api from '@/service'
  import Configs from '../../../Configs'
  import ModalSkmcMorphology from '../Common/ModalSkmcMorphology'
  import ModalConfirm from '../Common/ModalConfirm'
  import {machineIdSync} from 'node-machine-id'
  import ModalReportSign from '../Common/ModalReportSign'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const convert = require('xml-js')
  const hl7 = require('simple-hl7')
  const log = require('electron-log')
  const ip = require('ip')

  export default {
    name: 'result-classification',
    computed: {
      ...mapGetters({
        // getTestHistory: Constant.GET_TEST_HISTORY,
        commonCode: Constant.GET_COMMON_CODE,
        settings: Constant.GET_SETTINGS,
        workList: Constant.GET_WORK_LIST,
        orderId: Constant.GET_SELECT_ORDER_ID,
        searchOptions: Constant.GET_SEARCH_OPTIONS,
        getClassificationItem: Constant.GET_CLASSIFICATION_ITEM,
        siteCd: Constant.GET_SITE_CD,
        deviceBarcode: Constant.GET_DEVICE_BARCODE,
        currentUser: Constant.GET_CURRENT_USER,
        getKumcCbcPath: Constant.GET_KUMC_CBC_PATH,
        dspList: Constant.GET_DSP_LIST
      })
    },
    beforeDestroy () {
      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      // ipcRenderer.removeAllListeners(Constant.ALL_TEST_HISTORY_LIST)
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY_PREV)
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY_NEXT)
      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CONN_PATH)
      ipcRenderer.removeAllListeners(Constant.SELECT_CBC_CODE)
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CODE)
      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CODE_RBC)
      ipcRenderer.removeAllListeners(Constant.SELECT_EMP_NO)
      ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT)
      ipcRenderer.removeAllListeners(Constant.GET_WBC_HIST_LIST)
      ipcRenderer.removeAllListeners(Constant.GET_LOCK_STATE)

      this.EventBus.$off('WBC_IMG_LOADED')
      this.EventBus.$off('UPLOAD_LIS')
      this.EventBus.$off('WBC_CLASSIFICATION_LOADED')
      this.EventBus.$off('ON_CLICK_LIS')
      this.EventBus.$off('UPLOAD_LIS_SKMC_SEND')
      this.EventBus.$off('ON_CLICK_REPORT_SIGN')
      this.EventBus.$off('REPORT_SIGN')

      ipcRenderer.send(Constant.SET_LOCK_SLIDE, JSON.stringify({
        cassetId: this.selectedItem.CASSET_ID,
        slotId: this.selectedItem.SLOT_ID,
        userId: this.currentUser.userId,
        machineId: this.machineId,
        hostIp: '',//self.settings.hostIp,
        localIp: this.localIp,
        lockState: 'N'
      }))

    },
    mounted () {
      var self = this
      var rootPath = this.settings.pbiaRootPath + '/' + this.orderId
      // console.log(rootPath)
      // D:/IA_Proc/20230201124922_00_20230201124929

      this.machineId = machineIdSync({original: true})
      this.localIp = ip.address()

      console.log(this.dspList)
      this.$nextTick(function() {
        ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.orderId}))
        //self.orderId=20230201124922_00_20230201124929
        ipcRenderer.send(Constant.SELECT_LIS_CONN_PATH, JSON.stringify({deviceBarcode: self.deviceBarcode}))
        ipcRenderer.send(Constant.SELECT_CBC_CODE, null)
        ipcRenderer.send(Constant.SELECT_EMP_NO, JSON.stringify({userId: self.currentUser.userId}))


        ipcRenderer.on(Constant.SET_LOCK_SLIDE, function (event, result) {
          console.log("$$$$$")
          console.log("$$$$$")
          console.log("$$$$$")
          console.log("$$$$$")
          console.log(result)
          console.log("$$$$$")
          console.log("$$$$$")
          console.log("$$$$$")
          console.log("$$$$$")

        })

        // before data
        ipcRenderer.on(Constant.GET_WBC_HIST_LIST, function (event, result) {
          console.log(result)
          self.beforeDataList = result
        })

        ipcRenderer.on(Constant.SELECT_EMP_NO, function (event, result) {
          console.log(result)
          self.empNo = result.EMP_NO
        })

        // search lis path
        ipcRenderer.on(Constant.SELECT_LIS_CONN_PATH, function (event, result) {
          if (result !== null) {
            self.lisConnObj = result
          }
        })

        // search cbc code
        ipcRenderer.on(Constant.SELECT_CBC_CODE, function (event, result) {
          self.cbcCodeList = result
        })

        // 이전 슬라이드 조회
        // ipcRenderer.on(Constant.GET_TEST_HISTORY_PREV, function (event, results) {
        //   self.prevItem = results
        //   console.log(self.prevItem)
        //   if (results !== null) {
        //     self.isPrev = true
        //   } else {
        //     self.isPrev = false
        //   }
        // })

        // 다음 슬라이드 조회
        // ipcRenderer.on(Constant.GET_TEST_HISTORY_NEXT, function (event, results) {
        //   self.nextItem = results
        //   console.log(self.nextItem)
        //   if (results !== null) {
        //     self.isNext = true
        //   } else {
        //     self.isNext = false
        //   }
        // })

        // 슬라이드 조회
        ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
          console.log('GET_TEST_HISTORY')
          // console.log(result)
          // {ANALYZE_DTTM: "20230821142500", BARCODE_NO: "barcode", BIRTHDAY: "", CASSET_ID: "cassetId", CREATE_DTTM: "20231024095956", …}

          // self.EventBus.$emit('OVERLAY', {state: false})
          self.selectedItem = result
          self.signedInfo.signedState = self.selectedItem.SIGNED_STATE  //"Ready"
          self.signedInfo.signedUserId = self.selectedItem.SIGNED_USER_ID  //""
          self.testTypeNm = self.commonCode(Constant.GET_CODE_LIST_TEST_TYPE, self.selectedItem.TEST_TYPE).cdNm

          // get prev, next item [
          var index = self.dspList.findIndex(function(item) {
            return self.selectedItem.SLOT_ID === item.SLOT_ID
          })

          self.isPrev = false
          self.isNext = false
          if (index !== 0) {
            self.isPrev = true
            self.prevItem = self.dspList[index - 1]
          }

          if ((index + 1) !== self.dspList.length) {
            self.isNext = true
            self.nextItem = self.dspList[index + 1]
          }
          // get prev, next item ]

          console.log(index)
          console.log(self.selectedItem)
          console.log(self.isRefreshMenu)

          self.getCbcResults(false)

          // left menu refresh
          if (self.isRefreshMenu) {
            self.createMenus()
          }
          // else {
          //   // RBC 조회
          //   ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: self.selectedItem.SLOT_ID}))
          // }
          ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: self.selectedItem.SLOT_ID}))
          ipcRenderer.send(Constant.GET_WBC_HIST_LIST, JSON.stringify({slotId: self.selectedItem.SLOT_ID}))

          fs.readdir(self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID + '/' + self.settings.barcodeDirName, function(err, files) {

            if (!err) {
              self.barcodePath = 'file://' + self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID + '/' + self.settings.barcodeDirName + '/' + files[0] + '?' + self.$getDateTimeStr()
              self.onClickList(self.selectedItem.SLOT_ID, self.isRefreshMenu)

              self.EventBus.$emit('OVERLAY', {state: true})

              setTimeout(function() {
                console.log('send UPDATE_WBC_REPORT')

                // wbc report
                self.EventBus.$emit('UPDATE_WBC_REPORT', self.selectedItem)

                // rbc report
                self.EventBus.$emit('UPDATE_RBC_REPORT', self.selectedItem)

                // wholeSlide report
                self.EventBus.$emit('UPDATE_WHOLE_SLIDE_REPORT', self.selectedItem)

                // final report
                self.EventBus.$emit('UPDATE_FINAL_REPORT', self.selectedItem)

                self.EventBus.$emit('OVERLAY', {state: false})
              }, 500)

            } else {
              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          })
        })

        ipcRenderer.on(Constant.SELECT_LIS_CODE_RBC, function (event, result) {
          self.lisCodeRbc = result
        })

        ipcRenderer.on(Constant.GET_RBC_COUNT, function (event, result) {
          console.log(result)
          self.rbcResults = result
          self.$store.dispatch(Constant.SET_CURRENT_RBC_RESULTS, result)
          self.EventBus.$emit('OVERLAY', {state: false})
        })

        // lis code
        ipcRenderer.on(Constant.SELECT_LIS_CODE, function (event, result) {
          console.log(result)
          console.log(self.wbcInfo)

          // 고대 안암
          if (self.siteCd === '0006') {
            if (self.lisConnObj !== null) {
              var data = 'H|\^&||||||||||P||' + self.selectedItem.BARCODE_NO + '\n'
              var seq = 0

              console.log(self.wbcInfo)
              console.log(result)

              var kumcMergePercent = 0
              var kumcBandPercent = 0

              // 고대 NE 병합 로직 (NB -> NS)
              // start [
              self.wbcInfo.forEach(function(wbcItem) {
                if (wbcItem.id === '02' || wbcItem.id === '03' ||
                    wbcItem.id === '04' || wbcItem.id === '10') {
                  kumcMergePercent += Number(wbcItem.percent)
                }

                if (wbcItem.id === '72') {
                  kumcBandPercent = Number(wbcItem.percent)
                }
              })

              console.log(kumcMergePercent)
              console.log(kumcBandPercent)

              if (kumcMergePercent > 0 && kumcBandPercent < 6) {
                // seg
                var segItem = self.wbcInfo.filter(function(item) {
                  return item.id === '71'
                })

                // band
                var bandItem = self.wbcInfo.filter(function(item) {
                  return item.id === '72'
                })

                segItem[0].percent = (Number(segItem[0].percent) + Number(kumcBandPercent)) + ''
                bandItem[0].percent = '0'
              }
              //  end ]

              console.log(self.wbcInfo)

              result.forEach(function(lisCode) {
                if (lisCode.LIS_CD !== '') {
                  self.wbcInfo.forEach(function(wbcItem) {
                    if (lisCode.IA_CD === wbcItem.id) {
                      // 5diff는 0이어도 데이터 올림
                      if (wbcItem.id === '01' || wbcItem.id === '71' || wbcItem.id === '05' ||
                          wbcItem.id === '07' || wbcItem.id === '08' || wbcItem.id === '09') {
                          // count
                          data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '|' + wbcItem.count + '|||||||^' + self.currentUser.userId + '\n'

                          // percent
                          data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '%|' + wbcItem.percent + '|%||||||^' + self.currentUser.userId + '\n'

                      } else {
                        if (Number(wbcItem.percent) > 0) {
                          // count
                          data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '|' + wbcItem.count + '|||||||^' + self.currentUser.userId + '\n'

                          // percent
                          data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '%|' + wbcItem.percent + '|%||||||^' + self.currentUser.userId + '\n'
                        }
                      }
                    }
                  })
                }
              })

              data += 'L|1|N'
              console.log(data)
              log.info(data)

              // file
              if (self.lisConnObj.LIS_CONN_TYPE_CD === '01') {
                // create directory
                !fs.existsSync(self.lisConnObj.LIS_FILE_PATH + '/') && fs.mkdirSync(self.lisConnObj.LIS_FILE_PATH)

                fs.writeFile(self.lisConnObj.LIS_FILE_PATH + '/' + self.selectedItem.BARCODE_NO + '.lst2msg', data, function(err) {
                  if (err) {
                    console.log(err)
                    self.$toasted.show(err.message, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  } else {
                    self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }

                  self.EventBus.$emit('OVERLAY', {state: false})
                })
              } else if (self.lisConnObj.LIS_CONN_TYPE_CD === '02') { // URL
                self.sendLisMessage(data)
              }

            } else {
              self.$toasted.show(Constant.IDS_MSG_FAILED, {
                position: 'bottom-center',
                duration: '2000'
              })

              self.EventBus.$emit('OVERLAY', {state: false})
            }
          } else if (self.siteCd === '0011') {
            console.log(self.wbcInfo)
            console.log(result)

            var resultStr = ''

            var testCodeList = self.inhaTestCode.split(',')
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

                // H1151, H1152, H1153, H1154, H1155, H1165, H1162
                // H9511, H9512, H9513, H9514, H9515, H9510, H9570

                // H1101, H1102, H1103, H1104, H1105, H1106, H1121, H1122, H1123
              }
            })

            self.inhaTestCode = ''
            tmpList.forEach(function(item) {
              self.inhaTestCode += item + ','
            })
            console.log(self.inhaTestCode)

            resultStr += self.inhaTestCode

            // wbc
            result.forEach(function(lisCode, index) {
              if (lisCode.LIS_CD !== '') {
                self.wbcInfo.forEach(function(wbcItem) {
                  if (lisCode.IA_CD === wbcItem.id) {
                    if (lisCode.LIS_CD === 'H9600' || lisCode.LIS_CD === 'H9365' ||
                        lisCode.LIS_CD === 'H9366') {
                          if (Number(wbcItem.count) > 0) {
                            resultStr += lisCode.LIS_CD + '|' + '1' + '|' + ','
                          } else {
                            resultStr += lisCode.LIS_CD + '|' + ' ' + '|' + ','
                            // resultStr += lisCode.LIS_CD + '|' + '0' + '|' + ','
                          }

                      // 2 -> 0 변경시 데이터 올리도록 before 조건 추가
                      // self.beforeDataList.forEach(function(beforeData) {
                      //   if (wbcItem.id === beforeData.CLASS_ID) {
                      //     if (Number(wbcItem.count) > 0 || Number(beforeData.COUNT) > 0 ) {
                      //       resultStr += lisCode.LIS_CD + '|' + '1' + '|' + ','
                      //     } else {
                      //       resultStr += lisCode.LIS_CD + '|' + ' ' + '|' + ','
                      //       // resultStr += lisCode.LIS_CD + '|' + '0' + '|' + ','
                      //     }
                      //   }
                      // })
                    } else {
                      // GP, PA
                      if (lisCode.IA_CD === '13' || lisCode.IA_CD === '14') {
                        if (Number(wbcItem.count) > Number(lisCode.MIN_COUNT)) {
                          resultStr += lisCode.LIS_CD + '|' + wbcItem.percent + '|' + ','
                        } else {
                          resultStr += lisCode.LIS_CD + '|' + ' ' + '|' + ','
                          // resultStr += lisCode.LIS_CD + '|' + '0' + '|' + ','
                        }
                      } else {
                        if (Number(wbcItem.percent) > 0) {
                          resultStr += lisCode.LIS_CD + '|' + wbcItem.percent + '|' + ','
                        } else {
                          resultStr += lisCode.LIS_CD + '|' + ' ' + '|' + ','
                        }
                      }

                      // if (Number(wbcItem.percent) > 0) {
                      //   // GP, PA
                      //   if (lisCode.IA_CD === '13' || lisCode.IA_CD === '14') {
                      //     if (Number(wbcItem.count) > Number(lisCode.MIN_COUNT)) {
                      //       resultStr += lisCode.LIS_CD + '|' + wbcItem.percent + '|' + ','
                      //     } else {
                      //       resultStr += lisCode.LIS_CD + '|' + ' ' + '|' + ','
                      //       // resultStr += lisCode.LIS_CD + '|' + '0' + '|' + ','
                      //     }
                      //   } else {
                      //     resultStr += lisCode.LIS_CD + '|' + wbcItem.percent + '|' + ','
                      //   }
                      // }

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

            console.log(rbcTmp)
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
              episode: self.selectedItem.BARCODE_NO,
              result: resultStr
            }

            log.info(params)

            self.EventBus.$emit('OVERLAY', {state: true})

            api.uploadReport_0011(params).then(function(result) {
              console.log(result)
              var ret = result.data[0]
              if (ret.returnCode === '0') {
                self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              } else {
                self.$toasted.show('return code : ' + ret.returnCode, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }

              self.EventBus.$emit('OVERLAY', {state: false})

            }).catch(function (err) {
              console.log('catch : ' + err.message)
              self.EventBus.$emit('OVERLAY', {state: false})

              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            })

          } else {
            if (self.lisConnObj !== null) {
              // create directory
              !fs.existsSync(self.lisConnObj.LIS_FILE_PATH) && fs.mkdirSync(self.lisConnObj.LIS_FILE_PATH)

              var client = hl7.Server.createFileClient(self.lisConnObj.LIS_FILE_PATH)

              var msg = new hl7.Message(
                'PBIA',                           // sending application
                'PBIA',                           // sending facility
                'LIS',                            // receiving application
                'LIS',                            // receiving facility
                self.$getDateTimeStr(),           // date/time of message
                '',                               // security
                ['ADT', 'R02'],                   // message type : This field has 2 components
                self.selectedItem.BARCODE_NO,     // message control ID : file name
                'P',                              // Processing ID
                '2.5\n'                             // HL7 version ID
                //Keep adding fields
              )

              var seq = 0
              result.forEach(function(lisCode) {
                if (lisCode.LIS_CD !== '') {
                  self.wbcInfo.forEach(function(wbcItem) {
                    if (wbcItem.id === lisCode.IA_CD) {
                      if (Number(wbcItem.percent) > 0 || Number(wbcItem.count)) {
                        msg.addSegment(
                          'OBX',                // ID
                          seq++,                // sequence
                          'NM',                 // value type
                          lisCode.LIS_CD,       // observation identifier
                          '',                   // observation Sub-ID
                          wbcItem.count,        // observation Value
                          '',                   // units
                          '',                   // references range
                          '',                   // abnormal flags
                          '',                   // probability
                          '',                   // nature of abnormal test
                          'P\n'                   // observation result status
                        )

                        // percent
                        msg.addSegment(
                          'OBX',                // ID
                          seq++,                // sequence
                          'NM',                 // value type
                          lisCode.LIS_CD + '%', // observation identifier
                          '',                   // observation Sub-ID
                          wbcItem.percent,      // observation Value
                          '%',                  // units
                          '',                   // references range
                          '',                   // abnormal flags
                          '',                   // probability
                          '',                   // nature of abnormal test
                          'P\n'                 // observation result status
                        )
                      }
                    }
                  })
                }
              })

              // file
              if (self.lisConnObj.LIS_CONN_TYPE_CD === '01') {
                console.log(msg.toString())
                client.send(msg, function(err) {
                  console.log('************sending message****************')
                  if (err) {
                    console.log("ERR: " + err.message)
                    self.$toasted.show(err.message, {
                      position: 'bottom-center',
                      duration: '2000'
                    })

                    self.EventBus.$emit('OVERLAY', {state: false})
                  } else {
                    self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                      position: 'bottom-center',
                      duration: '2000'
                    })

                    //NO ACK for File Client
                    self.EventBus.$emit('OVERLAY', {state: false})
                  }
                })
              } else {      // url
                self.sendLisMessage(msg.toString())
              }
            }
          }
        })

        this.EventBus.$on('REPORT_SIGN', function(params) {
          var obj = {}
          obj.state = 'Submit'
          obj.slotId = self.selectedItem.SLOT_ID
          obj.userId = self.currentUser.userId

          ipcRenderer.send(Constant.UPDATE_SIGNED_STATE, JSON.stringify(obj))

          self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            position: 'bottom-center',
            duration: '2000'
          })

          // 20230921_LBK : 인하대 요청 컨펌후 database탭으로 이동 삭제
          // self.$router.push({path: '/homePage/result'})
        })

        this.EventBus.$on('ON_CLICK_REPORT_SIGN', function(params) {
          self.$modal.show(ModalConfirm, {openType: 'reportSign', message: Constant.IDS_MSG_CONFIRM_SLIDE}, {
            height: 'auto',
            width: '350px'
          }, {
            'before-open': self.beforeConfirmOpen,
            'before-close': self.beforeConfirmClose
          })
        })

        this.EventBus.$on('WBC_IMG_LOADED', function(params) {
          console.log('WBC_IMG_LOADED')
          self.isLoadingImg = false
        })

        // lis upload
        this.EventBus.$on('UPLOAD_LIS', function(params) {
          console.log(params)
          self.uploadLis()
        })

        this.EventBus.$on('ON_CLICK_LIS', function(params) {
          console.log('ON_CLICK_LIS')

          if (!self.isShowModal) {
            if (self.siteCd === '0007') {
              self.$modal.show(ModalConfirm, {openType: 'lisUploadSkmc', message: Constant.IDS_MSG_UPLOAD_LIS}, {
                height: 'auto',
                width: '350px'
              }, {
                'before-open': self.beforeConfirmOpen,
                'before-close': self.beforeConfirmClose
              })
            } else {
              self.$modal.show(ModalConfirm, {openType: 'lisUpload', message: Constant.IDS_MSG_UPLOAD_LIS}, {
                height: 'auto',
                width: '350px'
              }, {
                'before-open': self.beforeConfirmOpen,
                'before-close': self.beforeConfirmClose
              })
            }

            // if (self.siteCd === '0007') {
            //   // 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동
            //   self.$modal.show(ModalSkmcMorphology, {selectedItem: self.selectedItem}, {
            //     height: '1000px',
            //     width: '800px',
            //     draggable: true
            //   }, {
            //     'before-open': self.beforeConfirmOpen,
            //     'before-close': self.beforeConfirmClose
            //   })
            // } else {
            //   self.$modal.show(ModalConfirm, {openType: 'lisUpload', message: Constant.IDS_MSG_UPLOAD_LIS}, {
            //     height: 'auto',
            //     width: '350px'
            //   }, {
            //     'before-open': self.beforeConfirmOpen,
            //     'before-close': self.beforeConfirmClose
            //   })
            // }
          }
        })

        this.EventBus.$on('UPLOAD_LIS_SKMC_SEND', function(params) {
          self.EventBus.$emit('OVERLAY', {state: true})

          params.remark.forEach(function(item) {
            item.remarkCd = item.remarkCd
            item.remarkContents = item.text
          })

          log.info(params)

          api.uploadReport_0007(params).then(function(result) {
            log.info(result)

            if (result.data.errorCode !== 'E0000') {
              self.$toasted.show(result.data.errorMessage, {
                position: 'bottom-center',
                duration: '2000'
              })
            } else {
              var commitParams = {
                barcodeNo: self.selectedItem.BARCODE_NO,
                resultCd: '',
                yyCd: params.yyCd
              }

              api.commitReport_0007(commitParams).then(function(result) {
                log.info(result)
                self.EventBus.$emit('OVERLAY', {state: false})

                if (result.data.errorCode !== 'E0000') {
                  self.$toasted.show(result.data.errorMessage, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                } else {
                  self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }

              }).catch(function (err) {
                console.log('catch : ' + err.message)
                self.EventBus.$emit('OVERLAY', {state: false})

                self.$toasted.show(err.message, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              })
            }
          }).catch(function (err) {
            console.log('catch : ' + err.message)
            self.EventBus.$emit('OVERLAY', {state: false})

            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })
          })
        })

        this.EventBus.$on('WBC_CLASSIFICATION_LOADED', function(params) {
          console.log(params)
          self.wbcInfo = params
        })

      })
    },
    data () {
      return {
        selectedItem: {},
        signedInfo: {},
        testTypeNm: null,
        menus: [],
        barcodePath: '',
        testList: [],
        isPrev: true,
        isNext: true,
        prevItem: null,
        nextItem: null,
        MAX_LOAD_SIZE: 25,
        isCbcShow: false,
        cbcWorkList: null,
        lisConnObj: null,
        cbcCodeList: null,
        isRefreshMenu: true,
        // 버튼 중복 입력 방지
        isLoadingImg: false,
        cbcPatientNm: '',
        cbcPatientNo: '',
        cbcSex: '',
        cbcAge: '',
        wbcInfo: [],
        isShowModal: false,
        empNo: '',
        inhaTestCode: '',
        lisCodeRbc: null,
        rbcResults: null,
        machineId: null,
        localIp: null,
        beforeDataList: []
      }
    },
    methods: {
      beforeConfirmOpen () {
        console.log('beforeConfirmOpen')
        this.isShowModal = true
      },
      beforeConfirmClose () {
        console.log('beforeConfirmClose')
        this.isShowModal = false
      },
      uploadLis () {
        var self = this

        console.log(self.selectedItem)
        console.log(self.currentUser)
        console.log(Configs.BUCKET_NAME)

        self.EventBus.$emit('OVERLAY', {state: true})

        if (self.siteCd === '0002') {
          var codeList = self.$store.getters.CbcWbcTestCdList_0002
          console.log(codeList)

          // cbc 결과 조회
          api.getCdcResults_0002(self.selectedItem.BARCODE_NO).then(function(result) {
            var xml = result.data
            var json = JSON.parse(convert.xml2json(xml, {compact: true}))
            var cbcWorkList = json.root.spcworklist.worklist

            console.log('-cbc work list start-')
            console.log(cbcWorkList)
            console.log('-cbc work list end-')

            // 5 diff (NE, NS, NB, LY, MO, EO, BA)
            // var fiveDiffWorkList = cbcWorkList.filter(function(item) {
            //   return (item.testcd._cdata === 'LHR10501' || item.testcd._cdata === 'LHR10502' ||
            //           item.testcd._cdata === 'LHR10503' || item.testcd._cdata === 'LHR10504' ||
            //           item.testcd._cdata === 'LHR10505' || item.testcd._cdata === 'LHR10506')
            // })

            var fiveDiffWorkList = ['LHR10501', 'LHR10502', 'LHR10503', 'LHR10504', 'LHR10505', 'LHR10506']

            console.log('-five diff list start-')
            console.log(fiveDiffWorkList)
            console.log('-five diff list end-')

            // Diff Count item
            var wbcDiffCountItem = cbcWorkList.filter(function(item) {
              return item.testcd._cdata === 'LHR100'
            })

            console.log('-LHR100 start-')
            console.log(wbcDiffCountItem)
            console.log('-LHR100 end-')

            // code copy
            self.wbcInfo.forEach(function(wbcItem) {
              wbcItem.testCd = ''

              codeList.forEach(function(code) {
                if (wbcItem.id === code.id) {
                  wbcItem.testCd = code.cd
                }
              })
            })

            var wbcTemp = []

            // five diff push
            self.wbcInfo.forEach (function(wbcItem) {
              fiveDiffWorkList.forEach (function (fiveDiffItem) {
                if (wbcItem.testCd === fiveDiffItem) {
                  wbcTemp.push(wbcItem)

                  // if ((wbcItem.count > 0 || Number(fiveDiffItem.inptrslt._cdata) > 0) && wbcItem.testCd !== '' ) {
                  //   wbcTemp.push(wbcItem)
                  // }
                } else {
                  if ((wbcItem.count > 0) && wbcItem.testCd !== '') {
                    wbcTemp.push(wbcItem)
                  }
                }
              })
            })

            console.log('-wbcInfo start-')
            console.log(self.wbcInfo)
            console.log('-wbcInfo end-')

            console.log('-wbcTemp start-')
            console.log(wbcTemp)
            console.log('-wbcTemp end-')

            // neutrophil-seg
            var nsPercentItem = wbcTemp.filter(function(item) {
              return item.testCd === 'LHR10501'
            })

            console.log(nsPercentItem)
            // ANC insert
            if ((nsPercentItem.length > 0) && (wbcDiffCountItem.length > 0)) {
              console.log('---CDC diff count--- : ' + Number(wbcDiffCountItem[0].inptrslt._cdata))
              console.log('IA NS percent : ' + nsPercentItem[0].percent)

              var ancResult = ((Number(wbcDiffCountItem[0].inptrslt._cdata) * nsPercentItem[0].percent) / 100).toFixed(2)

              wbcTemp.push({
                testCd: 'LHR10599',
                percent: ancResult
              })
            }

            self.checkUserAuth(self.empNo).then(function(isUserAuth) {
              console.log('isUserAuth : ' + isUserAuth)
              if (isUserAuth === 'succ') {
                // upload
                var params = {
                  empNo: self.empNo,
                  barcodeNo: self.selectedItem.BARCODE_NO,
                  wbcInfo: wbcTemp
                }

                api.uploadReport_0002(params).then(function(result) {
                  var xml = result.data
                  var json = JSON.parse(convert.xml2json(xml, {compact: true}))
                  console.log(json)
                  var resultFlag = json.root.ResultFlag.resultflag._text

                  if (resultFlag === 'Y') {
                    self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  } else {
                    self.$toasted.show(json.root.ResultFlag.error2._text, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }

                }).catch(function (err) {
                  console.log('catch : ' + err.message)
                  self.$toasted.show(err.message, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                })

              } else {
                self.$toasted.show(Constant.IDS_ERROR_PLEASE_CONFIRM_YOUR_USER_ID, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }

              self.EventBus.$emit('OVERLAY', {state: false})
            }).catch(function (err) {
              console.log(err.message)
              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })

              self.EventBus.$emit('OVERLAY', {state: false})
            })
          }).catch(function (err) {
            console.log(err.message)
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })

            self.EventBus.$emit('OVERLAY', {state: false})

          })
        } else {
          console.log('site : ' + self.siteCd)

          ipcRenderer.send(Constant.SELECT_LIS_CODE_RBC, null)
          ipcRenderer.send(Constant.SELECT_LIS_CODE, null)
        }
      },
      sendLisMessage (data) {
        var self = this

        var params = {
          url: self.lisConnObj.LIS_URL,
          barcodeNo: self.selectedItem.BARCODE_NO,
          userId: self.currentUser.userId,
          deviceBarcode: self.deviceBarcode,
          resultMsg: data
        }

        api.uploadReport(params).then(function(result) {
          console.log(result)
          if (result.data.errorCode === 'E000') {
            self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
              position: 'bottom-center',
              duration: '2000'
            })
          } else {
            self.$toasted.show(result.data.errorMessage, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
          self.EventBus.$emit('OVERLAY', {state: false})

        }).catch(function(err) {
          console.log(err)
          self.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })

          self.EventBus.$emit('OVERLAY', {state: false})
        })
      },
      // LIS 사용자 인증
      checkUserAuth(empNo) {
        return new Promise((succ, fail) => {
          console.log('checkUserAuth')
          console.log(Configs.BUCKET_NAME)

          if (this.siteCd === '0002') {
            api.checkUserAuth_0002(empNo).then(function(result) {
              console.log(result)
              var xml = result.data
              var json = JSON.parse(convert.xml2json(xml, {compact: true}))
              console.log(json)
              var userNm = json.root.getUsernm.usernm._text

              console.log(json.root.getUsernm.usernm._text)
              if (userNm === null || userNm === '') {
                succ('fail')
              } else {
                succ('succ')
              }

            }).catch(function (err) {
              console.log('checkUserAuth :' + err.message)
              fail(new Error(err.message))
            })
          }
        })
      },
      getCbcResults (isToast) {
        var self = this

        // 서울성모
        if (self.siteCd === '0002') {
          api.getCdcResults_0002(self.selectedItem.BARCODE_NO).then(function(result) {
            var xml = result.data
            var json = JSON.parse(convert.xml2json(xml, {compact: true}))
            self.cbcWorkList = json.root.spcworklist.worklist

          }).catch(function (err) {
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })
          })
        } else if (self.siteCd === '0006') {  // 고대 안암
          console.log(self.getKumcCbcPath)

          self.cbcWorkList = []
          fs.readFile(self.getKumcCbcPath + '/' + self.selectedItem.BARCODE_NO + '.txt', function(err, data) {
            if (err) {
              console.log(err)
              if (isToast) {
                self.$toasted.show(err.message, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }
            } else {
              var cbcData = data.toString()
              var cbcDataArray = cbcData.split('\n')

              cbcDataArray.forEach(function(cbcData) {
                var itemArray = cbcData.split('\t')
                console.log(itemArray)

                var title = itemArray[0].trim()
                var value = itemArray[1].trim()

                console.log(title)
                // 검체번호, 검사일시, 환자번호, 환자명, 성별, 나이, 그래프 데이터 제외
                if (title !== 'SPC_NO' && title !== 'BLCL_DT' &&
                    title !== 'PT_NO' && title !== 'PT_NM' &&
                    title !== 'SEX' && title !== 'AGE' &&
                    title !== 'SCAT_WDF' && title !== 'SCAT_WNR' &&
                    title !== 'DIST_RBC' && title !== 'DIST_WDF(FSC)' &&
                    title !== 'DIST_PLT') {

                  var unit = ''
                  if (title.indexOf('%') > 0) {
                    unit = '%'
                  }

                  var obj = {
                    testNm: title,
                    count: value,
                    unit: unit
                  }

                  self.cbcWorkList.push(obj)
                }

                if (title === 'PT_NO') {
                  self.cbcPatientNo = value
                }

                if (title === 'PT_NM') {
                  self.cbcPatientNm = value
                }

                if (title === 'SEX') {
                  self.cbcSex = value
                }

                if (title === 'AGE') {
                  self.cbcAge = value
                }
              })
            }
          })
        } else if (self.siteCd === '0007') { // 삼광의료재단
          params = {
            barcodeNo: self.selectedItem.BARCODE_NO,
            resultCd: ''
          }

          // LIS 주문데이터 생성
          api.createOrder_0007(params).then(function(result) {
            console.log(result)
            if (result.data.errorCode === 'E0000') {
              if (result.data.results.resultCd === 'N') {
                self.$toasted.show(Constant.IDS_MSG_FAILED, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              } else {
                console.log(result.data.results.resultCd)

                api.getCdcResults_0007(self.selectedItem.BARCODE_NO).then(function(result) {
                  console.log(result)
                  if (result.data.errorCode === 'E0000') {
                    self.cbcWorkList = []
                    var dataList = result.data.results
                    var firstList = []
                    var secodeList = []

                    firstList = dataList.filter(function(item) {
                      var yyCd = item.I01YYCD.trim()
                      var prefix = yyCd.substr(0, 1)

                      return prefix !== '0' && prefix !== '1' && prefix !== '2' && prefix !== ''
                    })

                    secodeList = dataList.filter(function(item) {
                      var yyCd = item.I01YYCD.trim()
                      var prefix = yyCd.substr(0, 1)

                      return prefix === '0' || prefix === '1' || prefix === '2'
                    })

                    console.log(firstList)
                    console.log(secodeList)
                    firstList.forEach(function(item) {
                      if (item.I01ATCD.trim() === '') {
                        var obj = {
                          testNm: item.I01GSNM.trim(),
                          count: item.I01NUM1,
                          unit: item.I01UNTA.trim(),
                          cham: item.I01CHAM.trim()
                        }

                        self.cbcWorkList.push(obj)

                        self.cbcPatientNm = item.I01PTNM.trim()
                        self.cbcSex = item.I01SEXX.trim()
                        self.cbcAge = item.I01AGEE
                      }
                    })

                    secodeList.forEach(function(item) {
                      if (item.I01ATCD.trim() === '') {
                        var obj = {
                          testNm: item.I01GSNM.trim(),
                          count: item.I01NUM1,
                          unit: item.I01UNTA.trim(),
                          cham: item.I01CHAM.trim()
                        }

                        self.cbcWorkList.push(obj)

                        self.cbcPatientNm = item.I01PTNM.trim()
                        self.cbcSex = item.I01SEXX.trim()
                        self.cbcAge = item.I01AGEE
                      }
                    })

                    self.$store.dispatch(Constant.SET_SKMC_LIS_RESULTS, firstList.concat(secodeList))
                    // self.$store.dispatch(Constant.SET_SKMC_LIS_RESULTS, result.data.results)

                  } else {
                    if (isToast) {
                      self.$toasted.show(result.data.errorMessage, {
                        position: 'bottom-center',
                        duration: '2000'
                      })
                    }
                  }

                }).catch(function (err) {
                  if (isToast) {
                    self.$toasted.show(err.message, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }
                })
              }
            } else {
              if (isToast) {
                self.$toasted.show(result.data.errorMessage, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }
            }
          })
        } else if (self.siteCd === '0011') {  // 인하대학교
          if (self.lisConnObj !== null) {
            if (self.lisConnObj.CBC_CONN_TYPE_CD === '02') { // URL
              var params = {
                url: self.lisConnObj.CBC_URL,
                machine: 'ADUIMD',
                episode: self.selectedItem.BARCODE_NO
              }

              console.log(params)
              api.getCdcResults_0011(params).then(function(result) {
                console.log(result)
                self.cbcWorkList = []

                var ret = result.data[0]

                if (ret.returnCode === '0') {
                  self.cbcPatientNo = ret.regNo
                  self.cbcPatientNm = ret.name
                  self.cbcSex = ret.sex
                  self.cbcAge = ret.age
                  self.inhaTestCode = ret.testCode

                  var testCodeList = ret.testCode.split(',')
                  testCodeList.forEach(function(codes) {
                    var codeArray = codes.split('|')
                    var code = codeArray[0]
                    var value = codeArray[1]
                    var unit = codeArray[2]

                    self.cbcCodeList.forEach(function(cbcCode) {
                      if (cbcCode.CBC_CD === code) {
                        var obj = {
                          testNm: cbcCode.CD_NM,
                          count: value,
                          unit: unit
                        }

                        self.cbcWorkList.push(obj)
                      }
                    })
                  })

                } else {
                  self.$toasted.show('return code : ' + ret.returnCode, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }

              }).catch(function (err) {
                if (isToast) {
                  self.$toasted.show(err.message + ' : no CBC result', {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }
              })

            }
          }
        } else {
          // LIS 공통
          if (self.lisConnObj !== null) {
            // file
            if (self.lisConnObj.CBC_CONN_TYPE_CD === '01') {
              fs.readFile(self.lisConnObj.CBC_FILE_PATH + '/' + this.selectedItem.BARCODE_NO + '.hl7', function(err, data) {
                if (err) {
                  if (isToast) {
                    self.$toasted.show(err.message, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }
                } else {
                  var parser = new hl7.Parser({segmentSeperator: '\n'})
                  var msg = parser.parse(data.toString())

                  console.log(msg)

                  self.cbcWorkList = []

                  msg.segments.forEach(function(cbcSegment) {
                    if (cbcSegment.name.trim() === 'OBX') {
                      self.cbcCodeList.forEach(function(cbcCode) {
                        if (cbcCode.CBC_CD === cbcSegment.getField(3)) {
                          var obj = {
                            testNm: cbcCode.CD_NM,
                            count: cbcSegment.getField(5),
                            unit: cbcSegment.getField(6)
                          }

                          self.cbcWorkList.push(obj)
                        }
                      })

                    } else if (cbcSegment.name.trim() === 'PID') {
                      self.cbcPatientNo = cbcSegment.getField(1)
                      self.cbcPatientNm = cbcSegment.getField(4)
                      self.cbcSex = cbcSegment.getField(6)
                      self.cbcAge = cbcSegment.getField(7)
                    }
                  })
                }
              })
            } else if (self.lisConnObj.CBC_CONN_TYPE_CD === '02') { // URL
              var params = {
                url: self.lisConnObj.CBC_URL,
                barcodeNo: self.selectedItem.BARCODE_NO,
                userId: self.currentUser.userId,
                deviceBarcode: self.deviceBarcode
              }

              api.getCdcResults(params).then(function(result) {
                var parser = new hl7.Parser({segmentSeperator: '\n'})
                var msg = parser.parse(result.data)

                self.cbcWorkList = []

                msg.segments.forEach(function(cbcSegment) {
                  if (cbcSegment.name.trim() === 'OBX') {
                    self.cbcCodeList.forEach(function(cbcCode) {
                      if (cbcCode.CBC_CD === cbcSegment.getField(3)) {
                        var obj = {
                          testNm: cbcCode.CD_NM,
                          count: cbcSegment.getField(5),
                          unit: cbcSegment.getField(6)
                        }

                        self.cbcWorkList.push(obj)
                      }
                    })

                  } else if (cbcSegment.name.trim() === 'PID') {
                    self.cbcPatientNo = cbcSegment.getField(1)
                    self.cbcPatientNm = cbcSegment.getField(4)
                    self.cbcSex = cbcSegment.getField(6)
                    self.cbcAge = cbcSegment.getField(7)
                  }
                })

              }).catch(function (err) {
                if (isToast) {
                  self.$toasted.show(err.message, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }
              })
            }
          }
        }
      },
      onClickCbc () {
        this.isCbcShow = !this.isCbcShow

        this.$store.dispatch(Constant.SET_IS_CBC_SHOW, this.isCbcShow)
        this.EventBus.$emit('SLIDE_STATE_CHANGE', this.isCbcShow)

        if (this.isCbcShow) {
          this.getCbcResults(true)
        }
      },
      onBarcodeCopy () {
        const copyText = document.getElementById('barcodeNo')
        copyText.setAttribute('type', 'text')
        copyText.select()

        try {
          var successful = document.execCommand('copy')
          var msg = successful ? 'successful' : 'unsuccessful'

          this.$toasted.show('barcode was copied ' + msg, {
            position: 'bottom-center',
            duration: '2000'
          })

        } catch (err) {
          this.$toasted.show('unable to copy', {
            position: 'bottom-center',
            duration: '2000'
          })
        }

        copyText.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
      },
      createMenus () {
        this.menus = []
        if (this.selectedItem.TEST_TYPE === '02') {
          var objTmp = {
            id: '1',
            title: 'Whole slide image',
            childrenPage: '/homePage/resultClassification/' + this.selectedItem.SLOT_ID + '/wholeSlideReport',
            iconOn: require('@/assets/icon/RBC_ON.png'),
            iconOff: require('@/assets/icon/RBC_OFF.png'),
            isSelect: false,
            name: 'WHOLE'
          }
          this.menus.push(objTmp)
        } else if (this.selectedItem.TEST_TYPE === '03') {
          var objTmp = {
            id: '1',
            title: 'Whole slide image',
            childrenPage: '/homePage/resultClassification/' + this.selectedItem.SLOT_ID + '/wholeSlideReport',
            iconOn: require('@/assets/icon/RBC_ON.png'),
            iconOff: require('@/assets/icon/RBC_OFF.png'),
            isSelect: false,
            name: 'WHOLE'
          }
          this.menus.push(objTmp)
        } else {
          var objTmp = {
            id: '1',
            title: 'RBC classification',
            childrenPage: '/homePage/resultClassification/' + this.selectedItem.SLOT_ID + '/rbcReport',
            iconOn: require('@/assets/icon/RBC_ON.png'),
            iconOff: require('@/assets/icon/RBC_OFF.png'),
            isSelect: false,
            name: 'RBC'
          }
          this.menus.push(objTmp)
        }

        // select mode도 감별결과 추가함
        this.menus.push({
          id: '2',
          title: 'WBC classification',
          childrenPage: '/homePage/resultClassification/' + this.selectedItem.SLOT_ID + '/wbcReport',
          iconOn: require('@/assets/icon/WBC_ON.png'),
          iconOff: require('@/assets/icon/WBC_OFF.png'),
          isSelect: true,
          name: 'WBC'
        })

        this.menus.push({
          id: '3',
          title: 'Report',
          childrenPage: '/homePage/resultClassification/' + this.selectedItem.SLOT_ID + '/finalReport',
          iconOn: require('@/assets/icon/REPORT_ON.png'),
          iconOff: require('@/assets/icon/REPORT_OFF.png'),
          isSelect: false,
          name: 'REPORT'
        })

        for (var i = 0; i < this.menus.length; i++) {
          if (this.menus[i].isSelect) {
            if (this.$route.path !== this.menus[i].childrenPage) {
              this.$router.push(this.menus[i].childrenPage)
            }
          }
        }
      },
      onClickMenu (menu) {
        console.log('onClickMenu : ' + JSON.stringify(menu))
        if (this.$route.path !== menu.childrenPage) {
          for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].id === menu.id) {
              this.menus[i].isSelect = true
            } else {
              this.menus[i].isSelect = false
            }
          }

          // this.EventBus.$emit('OVERLAY', {state: true})
          this.$router.push(menu.childrenPage)

          this.isRefreshMenu = false
          ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
        }
      },
      // select slide
      onClickList (slotId, isRefreshMenu) {
        var self = this

        // remove marker
        this.EventBus.$emit('REMOVE_MARKER')

        // update selected SLOT_ID
        this.$store.dispatch(Constant.UPDATE_SELECT_ORDER_ID, slotId)

        // select slide
        // this.getPrevNextItems(slotId, isRefreshMenu)
      },
      getPrevNextItems (slotId, isRefreshMenu) {
        var self = this


        // ipcRenderer.send(Constant.GET_TEST_HISTORY_PREV, JSON.stringify({
        //   limit: 0,
        //   size: self.getClassificationItem.limit,
        //   searchType: self.searchOptions.searchTypeCd,
        //   searchText: self.searchOptions.searchText,
        //   startDate: self.searchOptions.startDate,
        //   endDate: self.searchOptions.endDate,
        //   wbcClassList: self.searchOptions.wbcClassList,
        //   slotId: slotId,
        //   nrCount: self.searchOptions.nrCount,
        //   wbcTotalSortCd: self.searchOptions.wbcTotalSortCd
        // }))
        //
        // ipcRenderer.send(Constant.GET_TEST_HISTORY_NEXT, JSON.stringify({
        //   limit: 0,
        //   size: self.getClassificationItem.limit,
        //   searchType: self.searchOptions.searchTypeCd,
        //   searchText: self.searchOptions.searchText,
        //   startDate: self.searchOptions.startDate,
        //   endDate: self.searchOptions.endDate,
        //   wbcClassList: self.searchOptions.wbcClassList,
        //   slotId: slotId,
        //   nrCount: self.searchOptions.nrCount,
        //   wbcTotalSortCd: self.searchOptions.wbcTotalSortCd
        // }))

      },
      checkForItemIndex () {
        var self = this

        var index = this.testList.findIndex(function(item) {
          return item.SLOT_ID === self.selectedItem.SLOT_ID
        })

        return index
      },
      onClickPrev () {
        var self = this

        ipcRenderer.send(Constant.GET_LOCK_STATE, JSON.stringify({
          cassetId: self.prevItem.CASSET_ID,
          slotId: self.prevItem.SLOT_ID
        }))

        ipcRenderer.once(Constant.GET_LOCK_STATE, function (event, result) {
          // console.log(result)
          // {CASSET_ID: "20231011122141_", HOST_IP: "", LOCAL_IP: "192.168.0.15", LOCK_DTTM: "20231013163010", LOCK_STATE: "N", ...}

          if (result.LOCK_STATE === 'N' || result.USER_ID === self.currentUser.userId) {
            if (self.prevItem !== null) {

              // console.log(self.$route.path)
              // /homePage/resultClassification/20231005171717_09_20231005171904/wbcReport
              
              // console.log(self.isLoadingImg)
              // false
              
              // console.log(self.selectedItem.TEST_TYPE)
              // 04

              // console.log(self.selectedItem.TEST_TYPE_CD)
              // 04
              
              // console.log(self.prevItem.TEST_TYPE)
              // PB

              // console.log(self.prevItem.TEST_TYPE_CD)
              // 04

              if (self.$route.path.includes('wbcReport')) {
                if (!self.isLoadingImg) {
                  self.isLoadingImg = true
                }
              }

              if (self.selectedItem.TEST_TYPE !== self.prevItem.TEST_TYPE_CD) {
                self.onClickList(self.prevItem.SLOT_ID, true)
              } else {
                self.onClickList(self.prevItem.SLOT_ID, false)
              }

              if (self.isCbcShow) {
                self.getCbcResults(true)
              }
              self.$store.dispatch(Constant.SET_CLASSIFICATION_ITEM, { item: self.prevItem, limit: self.getClassificationItem.limit})

              // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.prevItem.SLOT_ID}))
              ipcRenderer.send(Constant.UPDATE_CHECKED_CELL, JSON.stringify({
                isChecked: 'Y',
                slotId: self.prevItem.SLOT_ID
              }))

              // 현재 슬라이드 잠금 해제
              ipcRenderer.send(Constant.SET_LOCK_SLIDE, JSON.stringify({
                cassetId: self.selectedItem.CASSET_ID,
                slotId: self.selectedItem.SLOT_ID,
                userId: self.currentUser.userId,
                machineId: self.machineId,
                hostIp: '',//self.settings.hostIp,
                localIp: self.localIp,
                lockState: 'N'
              }))

              // 이전 슬라이드 잠금
              ipcRenderer.send(Constant.SET_LOCK_SLIDE, JSON.stringify({
                cassetId: self.prevItem.CASSET_ID,
                slotId: self.prevItem.SLOT_ID,
                userId: self.currentUser.userId,
                machineId: self.machineId,
                hostIp: '',//self.settings.hostIp,
                localIp: self.localIp,
                lockState: 'Y'
              }))

              setTimeout(function() {
                ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.prevItem.SLOT_ID}))
              }, 300)

            }
          } else {
            self.$toasted.show('This is the slide locked by ' + result.USER_ID, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
         })
      },
      onClickNext () {
        var self = this

        //잠금 체크
        ipcRenderer.send(Constant.GET_LOCK_STATE, JSON.stringify({
          cassetId: self.nextItem.CASSET_ID,
          slotId: self.nextItem.SLOT_ID
        }))

        ipcRenderer.once(Constant.GET_LOCK_STATE, function (event, result) {
          console.log(result)
          if (result.LOCK_STATE === 'N' || result.USER_ID === self.currentUser.userId) {
            console.log('next')

            if (self.nextItem !== null) {
              if (self.$route.path.includes('wbcReport')) {
                if (!self.isLoadingImg) {
                  self.isLoadingImg = true
                }
              }

              if (self.selectedItem.TEST_TYPE !== self.nextItem.TEST_TYPE_CD) {
                self.onClickList(self.nextItem.SLOT_ID, true)
              } else {
                self.onClickList(self.nextItem.SLOT_ID, false)
              }

              if (self.isCbcShow) {
                self.getCbcResults(true)
              }
              self.$store.dispatch(Constant.SET_CLASSIFICATION_ITEM, { item: self.nextItem, limit: self.getClassificationItem.limit})

              // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.nextItem.SLOT_ID}))
              ipcRenderer.send(Constant.UPDATE_CHECKED_CELL, JSON.stringify({
                isChecked: 'Y',
                slotId: self.nextItem.SLOT_ID
              }))

              // 현재 슬라이드 잠금 해제
              ipcRenderer.send(Constant.SET_LOCK_SLIDE, JSON.stringify({
                cassetId: self.selectedItem.CASSET_ID,
                slotId: self.selectedItem.SLOT_ID,
                userId: self.currentUser.userId,
                machineId: self.machineId,
                hostIp: '',//self.settings.hostIp,
                localIp: self.localIp,
                lockState: 'N'
              }))

              // 다음 슬라이드 잠금
              ipcRenderer.send(Constant.SET_LOCK_SLIDE, JSON.stringify({
                cassetId: self.nextItem.CASSET_ID,
                slotId: self.nextItem.SLOT_ID,
                userId: self.currentUser.userId,
                machineId: self.machineId,
                hostIp: '',//self.settings.hostIp,
                localIp: self.localIp,
                lockState: 'Y'
              }))

              setTimeout(function() {
                ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.nextItem.SLOT_ID}))
              }, 300)
            }
          } else {
            self.$toasted.show('This is the slide locked by ' + result.USER_ID, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        })
      }
    }
  }
</script>

<style>
  #tabCard {
    height: 626px;
    position: relative;
  }
  #nameCard {
    height: 305px;
  }
  #listWrapper {
    height: 100%;
    overflow-y: scroll;
  }
  #iconPrev:hover {
    color: #3F628C;
  }
  #iconPrevDisabled {
    color: gray
  }
  #iconNext:hover {
    color: #3F628C;
  }
  #iconNextDisabled {
    color: gray;
  }
  #divCbcdiff {
    height: 903px;
  }
  .height532 {
    height: 532px;
  }
  .height485 {
    height: 485px;
  }
  .barcodeCopy {
    border: 1px solid;
    border-radius: 50px;
    padding: 5px;
    font-size: 12px;
  }
  .barcodeCopy:hover {
    background-color: #3F628C;
  }
</style>
