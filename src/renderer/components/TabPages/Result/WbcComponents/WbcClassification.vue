<template>
  <b-container id="wbcClassification" fluid>
    <b-row>
      <b-col class="p-0 pt-1">
        <b-card id="wbcInfoCard" class="blackCard" text-variant="white" no-body>
          <div class="panelTitle w-100 pr-2">
            <span>
              WBC Classification
            </span>
            <b-icon v-if="isLisShow && siteCd !== '0007'" class="ml-2 pointer"
              icon="file-earmark-arrow-up"
              font-scale="1.1"
              @click="onClickLisUpload"
              v-b-tooltip.hover title="upload to lis (F9)"
              style="color: white;"></b-icon>

            <b-icon v-if="isLisShow" class="ml-2 pointer"
              icon="check-square"
              font-scale="1.1"
              @click="onCommit"
              v-b-tooltip.hover title="submit"
              style="color: #82FA58;"></b-icon>

            <b-icon v-if="isLock" class="mt-2 pointer float-right"
              icon="lock-fill"
              font-scale="0.8"
              @click="isLock = !isLock"
              v-b-tooltip.hover title="class draggable"
              style="color: white;">
            </b-icon>
            <b-icon v-else class="mt-2 pointer float-right"
              icon="unlock-fill"
              font-scale="0.8"
              @click="isLock = !isLock"
              v-b-tooltip.hover title="class draggable"
              style="color: white;">
            </b-icon>
          </div>
          <div id="divWbcWrapper">
            <b-row class="mt-2">
              <b-col cols="5">
                Class
              </b-col>
              <b-col class="text-center">
                Count
              </b-col>
              <b-col class="text-center">
                %
              </b-col>
            </b-row>

            <draggable v-if="!isLock" v-model="wbcClassList" group="wbc" @start="drag=true" @end="onListDragEnd">
               <div v-if="(wbc.title !== 'NR' && wbc.title !== 'AR' &&
                          wbc.title !== 'GP' && wbc.title !== 'PA' &&
                          wbc.title !== 'MC' && wbc.title !== 'MA' &&
                          wbc.id !== '90' && wbc.id !== '91' &&
                          wbc.id !== '92' && wbc.id !== '93' && wbc.id !== '94')"
                 v-for="wbc in wbcClassList" class="panelContent mt-2" :key="wbc.id">
                 <b-row>
                   <b-col cols="5">
                     {{ wbc.name }}
                   </b-col>
                   <b-col class="text-center">
                     {{ wbc.count }}
                   </b-col>
                   <b-col class="text-center">
                     {{ wbc.percent }}
                   </b-col>
                 </b-row>
               </div>
            </draggable>
            <div v-else>
              <div v-if="(wbc.title !== 'NR' && wbc.title !== 'AR' &&
                         wbc.title !== 'GP' && wbc.title !== 'PA' &&
                         wbc.title !== 'MC' && wbc.title !== 'MA' &&
                         wbc.id !== '90' && wbc.id !== '91' &&
                         wbc.id !== '92' && wbc.id !== '93' && wbc.id !== '94')"
                v-for="wbc in wbcClassList" class="panelContent mt-2" :key="wbc.id">
                <b-row>
                  <b-col cols="5">
                    {{ wbc.name }}
                  </b-col>
                  <b-col class="text-center">
                    {{ wbc.count }}
                  </b-col>
                  <b-col class="text-center">
                    {{ wbc.percent }}
                  </b-col>
                </b-row>
              </div>
            </div>
            <div v-if="(wbc.id === '90' || wbc.id === '91' || wbc.id === '92' || wbc.id === '93' || wbc.id === '94')"
              v-for="wbc in wbcClassList" class="panelContent mt-2" :key="wbc.id">
              <b-row>
                <b-col cols="5">
                  {{ wbc.name }}
                </b-col>
                <b-col class="text-center">
                  {{ wbc.count }}
                </b-col>
                <b-col class="text-center">
                  {{ wbc.percent }}
                </b-col>
              </b-row>
            </div>

            <div class="panelContent mt-2">
              <b-row>
                <b-col cols="5">
                  Total
                </b-col>
                <b-col class="text-center">
                  {{ totalCount }}
                </b-col>
                <b-col class="text-center">
                  100.00
                </b-col>
              </b-row>
            </div>

            <div class="mt-3">
              non-WBC
            </div>
            <div v-if="(wbc.title === 'NR' || wbc.title === 'AR' ||
              wbc.title === 'GP' || wbc.title === 'PA' ||
              wbc.title === 'MC' || wbc.title === 'MA')"
              v-for="wbc in wbcClassList" class="panelContent mt-2" :key="wbc.id">
              <b-row class="p-0">
                <b-col cols="5">
                  {{ wbc.name }}
                </b-col>
                <b-col class="text-center">
                  {{ wbc.count }} <span v-if="wbc.title === 'NR' || wbc.title === 'GP'"> / {{ maxWbcCount }} WBC</span>
                </b-col>
                <b-col class="text-center">
                  <span v-if="wbc.title === 'NR'">{{ wbc.percent }}</span>
                  <span v-else>-</span>
                </b-col>
              </b-row>
            </div>
          </div>
          <b-row v-if="!isReportPage">
            <b-col class="pointer" @click="onClickBefore">
              <div id="divWbcBefore">Before</div>
            </b-col>
            <b-col class="pointer" @click="onClickAfter">
              <div id="divWbcAfter">After</div>
            </b-col>
          </b-row>
        </b-card>
        <b-card class="blackCard mt-2 pt-3" text-variant="white" no-body>
          <b-row class="commentWrapper">
            <b-col cols="3">
              <img src="~@/assets/icon/Comment.png"/>
            </b-col>
            <b-col>
              <div class="input-group"
                style="background-color: #313131;
                border-radius: 10px;">
                <textarea id="inputWbcComment"
                  class="form-control"
                  rows="4"
                  aria-label="With textarea"
                  v-model="modelData.wbcComment"
                  @change="onChangeComment"
                  style="resize: none;"></textarea>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import lodash from 'lodash'
  import draggable from 'vuedraggable'
  import api from '@/service'
  import ModalReportSign from '../../../Common/ModalReportSign'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')
  const log = require('electron-log')

  export default {
    name: 'wbc-classification',
    components: { draggable },
    computed: {
      ...mapGetters({
        // getTestHistory: Constant.GET_TEST_HISTORY,
        commonCode: Constant.GET_COMMON_CODE,
        currentUser: Constant.GET_CURRENT_USER,
        classList: Constant.GET_WBC_CLASS_LIST,
        bfClassList: Constant.GET_BF_WBC_CLASS_LIST,
        settings: Constant.GET_SETTINGS,
        orderId: Constant.GET_SELECT_ORDER_ID,
        siteCd: Constant.GET_SITE_CD
      })
    },
    props: ['paramItem'],
    watch: {
      orderId: function(newVal, oldVal) {
        // console.log(newVal, oldVal)
      },
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        this.maxWbcCount = this.selectedItem.MAX_WBC_COUNT
        // 커스텀 클래스 최초 로딩시 D/P되지 않는 문제로
        // init 타이밍을 커스텀 클래스 로딩 이후로 변경
        ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)

      }
    },
    data () {
      return {
        totalCount: 0,
        selectedItem: null,
        wbcClassList: null,
        isNonWbc: false,
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        isBefore: false,
        modelData: {
          wbcComment: ''
        },
        wbcCustomClass: [],
        maxWbcCount: 0,
        isReportPage: false,
        isLisShow: false,
        isLock: true
      }
    },
    beforeDestroy () {
      this.EventBus.$off('UPDATE_HIST_LIST')

      ipcRenderer.removeAllListeners(Constant.UPDATE_WBC_COMMENT)
      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      // ipcRenderer.removeAllListeners(Constant.GET_WBC_HIST_LIST)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)

    },
    mounted () {
      var self = this

      log.info('wbc mount-')
      log.info(this.$route.path)

      this.$nextTick(function () {
        console.log(this.$route.path)
        if (this.$route.path.includes('finalReport')) {
          self.isReportPage = true
        }

        if (this.$route.path.includes('wbcReport')) {
          self.isLisShow = true
        }

        // custom class
        ipcRenderer.on(Constant.SELECT_WBC_CUSTOM_CLASS, function (event, results) {
          console.log(results)
          self.wbcCustomClass = results

          self.initElement()
          self.modelData.wbcComment = self.selectedItem.WBC_COMMENT

          // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.orderId}))
        })

        // ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
        //   self.selectedItem = result
        //   self.modelData.wbcComment = self.selectedItem.WBC_COMMENT
        //   self.maxWbcCount = self.selectedItem.MAX_WBC_COUNT
        //
        //   self.initElement(self.orderId)
        //
        //   if (self.selectedItem.SIGNED_STATE === self.commonCode(Constant.GET_CODE_SIGNED_STATE, '01').cdNm) {
        //     document.getElementById('inputWbcComment').disabled = true
        //   } else {
        //     document.getElementById('inputWbcComment').disabled = false
        //   }
        // })

        ipcRenderer.on(Constant.GET_WBC_HIST_LIST, function (event, result) {
          console.log(result)
          console.log(self.wbcClassList)

          if (self.wbcClassList !== null) {
            // self.wbcClassList = []
            self.totalCount = 0

            var tmpClass = []

            result.forEach(function (item, index) {
              self.wbcClassList.forEach(function(wbcItem) {
                if (item.CLASS_ID === wbcItem.id) {
                  var obj = {
                    title: item.CLASS_TITLE,
                    images: [],
                    count: item.COUNT,
                    id: item.CLASS_ID,
                    name: item.CLASS_NM,
                    order: wbcItem.order
                  }

                  tmpClass.push(obj)

                  if ((obj.title === 'NR' || obj.title === 'AR' ||
                      obj.title === 'GP' || obj.title === 'PA' ||
                      obj.title === 'MC' || obj.title === 'MA') && obj.count > 0) {
                    self.isNonWbc = true
                  } else {
                    self.isNonWbc = false
                    self.totalCount += Number(obj.count)
                  }
                }
              })
            })

            // custom class append
            self.wbcCustomClass.forEach(function(wbcCustom) {
              if (wbcCustom.CLASS_TITLE !== '') {
                var obj = {
                  count: 0,
                  id: wbcCustom.CLASS_ID,
                  key: '',
                  name: wbcCustom.CLASS_NM,
                  title: wbcCustom.CLASS_TITLE,
                  order: Number(wbcCustom.CLASS_ID)
                }
                tmpClass.push(obj)
              }
            })

            self.wbcClassList = tmpClass
            self.wbcClassList.sort(function(a, b) {
              return a.order - b.order
            })

            // 퍼센트
            var percentTotal = 0
            var maxItem = null

            self.wbcClassList.forEach(function (item, index) {
              self.wbcClassList[index].percent = self.getPercent(item.count)
              // nrbc
              if (item.title === 'NR') {
                self.wbcClassList[index].percent = Number(((Number(self.wbcClassList[index].count) / self.totalCount) * 100).toFixed(0))
              }

              // blast 조정
              if (item.title === 'BL') {
                if (self.wbcClassList[index].count > 0) {
                  if (Number(self.wbcClassList[index].percent) >= 0 && Number(self.wbcClassList[index].percent) <= 1) {
                    self.wbcClassList[index].percent = 1
                  }
                }
              }

              // 인하대
              if (self.siteCd === '0011') {
                if (item.title === 'LA' || item.title === 'IM' || item.title === 'MB' || item.title === 'AM') {
                  if (self.wbcClassList[index].count > 0) {
                    if (Number(self.wbcClassList[index].percent) >= 0 && Number(self.wbcClassList[index].percent) <= 1) {
                      self.wbcClassList[index].percent = 1
                    }
                  }
                }
              }

              if ((item.title !== 'NR' && item.title !== 'AR' &&
                    item.title !== 'GP' && item.title !== 'PA' &&
                    item.title !== 'MC' && item.title !== 'MA')) {
                percentTotal += Number(self.wbcClassList[index].percent)
                if (maxItem === null) {
                  maxItem = self.wbcClassList[index]
                } else {
                  if (Number(maxItem.count) < Number(item.count)) {
                    maxItem = self.wbcClassList[index]
                  }
                }
              }

            })

            console.log('percentTotal ---- ' + percentTotal)
            console.log(maxItem)

            if (maxItem !== null) {
              // 백분율 오차 보정
              maxItem.percent = Number(maxItem.percent) + (100 - percentTotal)
            }
          }
        })

        this.EventBus.$on('UPDATE_HIST_LIST', function(params) {
          console.log('recv UPDATE_HIST_LIST')
          self.initElement(self.orderId)

          // 파일 이동시에만 [UPDATE_HIST_LIST] insert or replace
          // if (self.selectedItem !== null) {
          //   // image path의 파일명만 저장
          //   var tmpClassList = lodash.cloneDeep(self.wbcClassList)
          //
          //   tmpClassList.forEach(function(wbc) {
          //     wbc.images.forEach(function(image, index) {
          //       var splitArray = image.split('/')
          //       wbc.images[index] = splitArray[splitArray.length - 1]
          //     })
          //   })
          //
          //   var params = {
          //     cassetId: self.selectedItem.CASSET_ID,
          //     slotId: self.selectedItem.SLOT_ID,
          //     wbcInfo: tmpClassList,
          //     userId: self.currentUser.userId,
          //     // PB 비정상 클래스 체크
          //     isNormal: self.$checkPbNormalCell(tmpClassList)
          //   }
          //
          //   console.log(params)
          //   ipcRenderer.send(Constant.INSERT_WBC_CLASSIFICATION, JSON.stringify(params))
          // }
        })
      })

    },
    methods: {
      onCommit () {
        this.EventBus.$emit('ON_CLICK_REPORT_SIGN', null)
      },
      onClickLisUpload () {
        // var self = this
        //
        // if (self.siteCd === '0007') {
        //   self.$modal.show(ModalSkmcMorphology, {}, {
        //     height: 'auto',
        //     width: '800px'
        //   })
        // } else {
        //   self.$modal.show(ModalConfirm, {openType: 'lisUpload', message: Constant.IDS_MSG_UPLOAD_LIS}, {
        //     height: 'auto',
        //     width: '350px'
        //   })
        // }

        this.EventBus.$emit('ON_CLICK_LIS', null)
      },
      onListDragEnd () {
        console.log('onListDragEnd')
        console.log(this.wbcClassList)
        var self = this

        this.wbcClassList.forEach(function(wbcClass, index) {
          wbcClass.order = index + 1
        })

        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          this.$store.dispatch(Constant.UPDATE_ORDER, this.wbcClassList)
        } else {
          this.$store.dispatch(Constant.UPDATE_ORDER_BF, this.wbcClassList)
        }

        console.log(this.$route.path)
        if (this.$route.path.indexOf('wbcReport') > 0) {
          this.EventBus.$emit('UPDATE_WBC_IMAGES', null)
        } else if (this.$route.path.indexOf('finalReport') > 0) {
          this.EventBus.$emit('WBC_CLASSIFICATION_LOADED', lodash.cloneDeep(this.wbcClassList))
        }
      },
      loadBeforeWbcClassification () {
        ipcRenderer.send(Constant.GET_WBC_HIST_LIST, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
      },
      loadDirWbcImages () {
        var self = this
        var classDir = ''
        var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID

        console.log('loadDirWbcImages')

        var classList = []
        if (self.selectedItem.TEST_TYPE === '01' || self.selectedItem.TEST_TYPE === '04') {
          classList = self.classList(self.selectedItem.IS_NS_NB_INTEGRATION)
          classDir = rootPath + '/' + self.settings.wbcClassDirName

          // custom class append
          self.wbcCustomClass.forEach(function(wbcCustom) {
            if (wbcCustom.CLASS_TITLE !== '') {
              var obj = {
                count: 0,
                id: wbcCustom.CLASS_ID,
                key: '',
                name: wbcCustom.CLASS_NM,
                title: wbcCustom.CLASS_TITLE,
                order: Number(wbcCustom.CLASS_ID)
              }
              classList.push(obj)
            }
          })

        } else {
          classList = self.bfClassList
          classDir = rootPath + '/' + self.settings.bfClassDirName
        }

        var self = this

        // wbc file load
        var params = {
          classList: classList,
          classDir: classDir,
          selectItem: this.selectedItem
        }

        api.getWbcFiles(params)
        .then(function (res) {
          console.log(res)
          console.log(self.wbcClassList)
          // self.wbcClassList = res.classificationResult
          self.totalCount = res.imgCount

          // 정렬 오류
          setTimeout(function () {
            // order
            res.classificationResult.sort(function(a, b) {
              return a.order - b.order
            })

            if (self.wbcClassList === null || self.wbcClassList.length <= 0) {
              self.wbcClassList = res.classificationResult
            }

            self.wbcClassList.forEach(function(wbcItem) {
              res.classificationResult.forEach(function(result) {
                if (wbcItem.id === result.id) {
                  wbcItem.count = result.count
                }

                if ((wbcItem.title === 'NR' || wbcItem.title === 'AR' ||
                    wbcItem.title === 'GP' || wbcItem.title === 'PA' ||
                    wbcItem.title === 'MC' || wbcItem.title === 'MA') && wbcItem.count > 0) {
                  self.isNonWbc = true
                } else {
                  self.isNonWbc = false
                }
              })
            })

            var params = {
              classificationResult: self.wbcClassList,
              imgCount: self.totalCount,
              siteCd: self.siteCd
            }

            console.log(params)
            api.getWbcClassification(params)
            .then(function (res) {
              console.log(res)
              self.insertSlideInfo()

            }).catch(function (err) {
              console.log(err.message)
            })
          }, 100)

        }).catch(function (err) {
          console.log(err.message)
          if (err.err.code === 'ENOENT') {
            if (err.classId === '90' || err.classId === '91' ||
                err.classId === '92' || err.classId === '93' ||
                err.classId === '94') {
              self.loadDirWbcImages()
            }
          }
        })
      },
      insertSlideInfo() {
        var self = this
        self.EventBus.$emit('WBC_CLASSIFICATION_LOADED', lodash.cloneDeep(self.wbcClassList))

        if (document.getElementById('divWbcBefore')) {
          document.getElementById('divWbcBefore').style.color = ''
        }

        if (document.getElementById('divWbcAfter')) {
          document.getElementById('divWbcAfter').style.color = 'red'
        }

        // 파일 이동시에만 [UPDATE_HIST_LIST] insert or replace
        if (self.selectedItem !== null) {
          // image path의 파일명만 저장
          var tmpClassList = lodash.cloneDeep(self.wbcClassList)

          tmpClassList.forEach(function(wbc) {
            wbc.images.forEach(function(image, index) {
              var splitArray = image.split('/')
              wbc.images[index] = splitArray[splitArray.length - 1]
            })
          })

          var params = {
            cassetId: self.selectedItem.CASSET_ID,
            slotId: self.selectedItem.SLOT_ID,
            wbcInfo: tmpClassList,
            userId: self.currentUser.userId,
            // PB 비정상 클래스 체크
            isNormal: self.$checkPbNormalCell(tmpClassList).isNormal
          }

          console.log(params)
          ipcRenderer.send(Constant.INSERT_WBC_CLASSIFICATION, JSON.stringify(params))
        }
      },
      initElement(slotId) {
        var self = this

        self.loadDirWbcImages()
      },
      getPercent (count) {
        return ((Number(count) / this.totalCount) * 100).toFixed(0)
      },
      onChangeComment (evt) {
        var obj = {
          slotId: this.selectedItem.SLOT_ID,
          wbcComment: this.modelData.wbcComment
        }

        log.info('update comment : ' + JSON.stringify(obj))

        ipcRenderer.send(Constant.UPDATE_WBC_COMMENT, JSON.stringify({obj}))
        this.EventBus.$emit(Constant.UPDATE_WBC_COMMENT, this.modelData.wbcComment)

        this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })

      },
      onClickBefore (evt) {
        console.log('onClickBefore')
        this.loadBeforeWbcClassification()

        document.getElementById('divWbcBefore').style.color = 'red'
        document.getElementById('divWbcAfter').style.color = ''

        this.isBefore = true
      },
      onClickAfter (evt) {
        console.log('onClickAfter')
        this.loadDirWbcImages()

        document.getElementById('divWbcAfter').style.color = 'red'
        document.getElementById('divWbcBefore').style.color = ''

        this.isBefore = false
      }
    }
  }
</script>

<style>
  #wbcInfoCard {
    height: 733px;
  }
  #divWbcWrapper {
    height: 755px;
    padding-bottom: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
