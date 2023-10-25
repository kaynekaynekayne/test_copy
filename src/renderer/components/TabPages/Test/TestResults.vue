<template>
  <div id="testResults">
    <b-card class="blackCard h-100 pr-3" text-variant="white" no-body>
      <b-row>
        <!-- whole slide start -->
        <b-col v-if="testType !== '01' && testType !== '04'" style="overflow-y: scroll; overflow-x: hidden;">
          <div class="panelTitle">Whole Slide Image</div>
          <b-row class="pl-2">
            <b-col v-if="index < 6" cols="2" v-for="(lowPower, index) in lowPowerPath" class="p-1" :key="lowPower.seqNo">
              <img :src="lowPower.path" :id="lowPower.seqNo" class="wholeSlideImg" @click="onClickBfImg" style="width: 75px;" />
            </b-col>
          </b-row>
          <b-row class="pl-2">
            <b-col v-if="(index >= 6) && (index < 12)" cols="2" v-for="(lowPower, index) in lowPowerPath" class="p-1" :key="lowPower.seqNo">
              <img :src="lowPower.path" :id="lowPower.seqNo" class="wholeSlideImg" @click="onClickBfImg" style="width: 75px;" />
            </b-col>
          </b-row>
          <b-row class="pl-2">
            <b-col v-if="(index >= 12) && (index < 18)" cols="2" v-for="(lowPower, index) in lowPowerPath" class="p-1" :key="lowPower.seqNo">
              <img :src="lowPower.path" :id="lowPower.seqNo" class="wholeSlideImg" @click="onClickBfImg" :key="index" style="width: 75px;" />
            </b-col>
          </b-row>
          <b-row class="pl-2">
            <b-col v-if="(index >= 18) && (index < 24)" cols="2" v-for="(lowPower, index) in lowPowerPath" class="p-1" :key="lowPower.seqNo">
              <img :src="lowPower.path" :id="lowPower.seqNo" class="wholeSlideImg" @click="onClickBfImg" :key="index" style="width: 75px;" />
            </b-col>
          </b-row>
          <b-row class="pl-2">
            <b-col v-if="(index >= 24) && (index < 30)" cols="2" v-for="(lowPower, index) in lowPowerPath" class="p-1" :key="lowPower.seqNo">
              <img :src="lowPower.path" :id="lowPower.seqNo" class="wholeSlideImg" @click="onClickBfImg" :key="index" style="width: 75px;" />
            </b-col>
          </b-row>
          <b-row class="pl-2">
            <b-col v-if="(index >= 30) && (index < 36)" cols="2" v-for="(lowPower, index) in lowPowerPath" class="p-1" :key="lowPower.seqNo">
              <img :src="lowPower.path" :id="lowPower.seqNo" class="wholeSlideImg" @click="onClickBfImg" :key="index" style="width: 75px;" />
            </b-col>
          </b-row>
          <b-row v-if="testType === '03'" class="mt-3">
            <b-col>
              <div style="color: #2798DC">Select Interest Area</div>
            </b-col>
            <b-col>
              <div>{{ bfSelectModeList.length }}</div>
            </b-col>
          </b-row>
        </b-col>
        <!-- whole slide end -->

        <!-- RBC start -->
        <b-col v-else style="overflow-y: scroll;">
          <div class="panelTitle">RBC Classification</div>
          <b-row class="mt-3">
            <b-col v-for="field in rbcFields" :key="field">
              {{ field }}
            </b-col>
          </b-row>
          <div v-for="rbc in dspRbcClassList" class="mt-3 panelContent" :key="rbc.categoryId">
            <b-row v-for="(rbcClass, index) in rbc.classInfo" :key="rbc.categoryId + '_' + rbcClass.classId">
              <b-col>
                <div v-if="index === 0">{{ rbc.categoryNm }}</div>
              </b-col>
              <b-col>
                {{ rbcClass.classNm }}
              </b-col>
              <b-col v-if="rbcClass.classId !== '01' || rbc.categoryId === '05'">
                <div v-if="rbcClass.degree === '1'">
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree0.png" />
                  <img src="~@/assets/test/degree0.png" />
                </div>
                <div v-else-if="rbcClass.degree === '2'">
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree0.png" />
                </div>
                <div v-else-if="rbcClass.degree === '3'">
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                </div>
                <div v-else>
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree0.png" />
                  <img src="~@/assets/test/degree0.png" />
                  <img src="~@/assets/test/degree0.png" />
                </div>
              </b-col>
              <b-col v-else>
                <div v-if="rbcClass.degree === '0'">
                  <img src="~@/assets/test/degree0.png" />
                </div>
                <div v-else>
                  <img src="~@/assets/test/degree2.png" />
                </div>
              </b-col>
            </b-row>
          </div>

          <b-row class="mt-3 panelContent">
            <b-col>
              Others
            </b-col>
            <b-col>
              Platelets
            </b-col>
            <b-col>
              {{ pltCount }} PLT / 1000 RBC
            </b-col>
          </b-row>

          <b-row class="mt-3 panelContent">
            <b-col>
            </b-col>
            <b-col>
              Malaria
            </b-col>
            <b-col>
              {{ malariaCount }} / {{ maxRbcCount }} RBC
            </b-col>
          </b-row>
        </b-col>
        <!-- RBC end -->

        <!-- WBC start -->
        <b-col v-if="testType !== '01' && testType !== '04'" style="overflow-y: scroll;">
          <div class="panelTitle">WBC Classification</div>
          <b-row class="mt-3 mb-3">
            <b-col cols="5">
              Class
            </b-col>
            <b-col>
              Count
            </b-col>
            <b-col>
              %
            </b-col>
          </b-row>
          <div v-if="(wbc.title !== 'NR' && wbc.title !== 'AR' &&
            wbc.title !== 'MC' && wbc.title !== 'MA')" v-for="wbc in dspBfClassList" class="panelContent mt-2" :key="wbc.type">
            <b-row>
              <b-col cols="5">
                {{ wbc.name }}
              </b-col>
              <b-col>
                {{ wbc.count }}
              </b-col>
              <b-col v-if="wbc.percent !== 'NaN'">
                {{ wbc.percent }}
              </b-col>
              <b-col v-else>
                0
              </b-col>
            </b-row>
          </div>
          <div class="panelContent mt-2">
            <b-row>
              <b-col cols="5">
                Total
              </b-col>
              <b-col>
                {{ totalCount }}
              </b-col>
              <b-col>
                100.00
              </b-col>
            </b-row>
          </div>
          <div class="mt-3">
            non-WBC
          </div>
          <div v-if="(wbc.title === 'NR' || wbc.title === 'AR' ||
            wbc.title === 'MC' || wbc.title === 'MA')" v-for="wbc in dspBfClassList" class="panelContent mt-2" :key="wbc.type">
            <b-row>
              <b-col cols="5">
                {{ wbc.name }}
              </b-col>
              <b-col>
                {{ wbc.count }} <span v-if="wbc.title === 'NR' || wbc.title === 'GP'"> / {{ maxWbcCount }} WBC</span>
              </b-col>
              <b-col>
                -
              </b-col>
            </b-row>
          </div>
        </b-col>

        <b-col v-else style="overflow-y: scroll;">
          <div class="panelTitle">WBC Classification</div>
          <b-row class="mt-3 mb-3">
            <b-col cols="5">
              Class
            </b-col>
            <b-col>
              Count
            </b-col>
            <b-col>
              %
            </b-col>
          </b-row>
          <div v-if="(wbc.title !== 'NR' && wbc.title !== 'AR' &&
              wbc.title !== 'GP' && wbc.title !== 'PA' &&
              wbc.title !== 'MC' && wbc.title !== 'MA')" v-for="wbc in dspWbcClassList" class="panelContent mt-2" :key="wbc.type">
            <b-row>
              <b-col cols="5">
                {{ wbc.name }}
              </b-col>
              <b-col>
                {{ wbc.count }}
              </b-col>
              <b-col v-if="wbc.percent !== 'NaN'">
                {{ wbc.percent }}
              </b-col>
              <b-col v-else>
                0
              </b-col>
            </b-row>
          </div>
          <div class="panelContent mt-2">
            <b-row>
              <b-col cols="5">
                Total
              </b-col>
              <b-col>
                {{ totalCount }}
              </b-col>
              <b-col>
                100.00
              </b-col>
            </b-row>
          </div>
          <div class="mt-3">
            non-WBC
          </div>
          <div v-if="(wbc.title === 'NR' || wbc.title === 'AR' ||
            wbc.title === 'GP' || wbc.title === 'PA' ||
            wbc.title === 'MC' || wbc.title === 'MA')" v-for="wbc in dspWbcClassList" class="panelContent mt-2" :key="wbc.type">
            <b-row>
              <b-col cols="5">
                {{ wbc.name }}
              </b-col>
              <b-col>
                {{ wbc.count }} <span v-if="wbc.title === 'NR' || wbc.title === 'GP'"> / {{ maxWbcCount }} WBC</span>
              </b-col>
              <b-col>
                -
              </b-col>
            </b-row>
          </div>
        </b-col>
        <!-- WBC end -->
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  import lodash from 'lodash'
  import Package from '../../../../../package.json'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'test-result-page',
    computed: {
      ...mapGetters({
        rbcFields: Constant.GET_RBC_FIELDS,
        wbcClassList: Constant.GET_WBC_CLASS_LIST,
        rbcClassList: Constant.GET_RBC_CLASS_LIST,
        bfClassList: Constant.GET_BF_WBC_CLASS_LIST,
        settings: Constant.GET_SETTINGS,
        backendData: Constant.GET_BACKEND_DATA
      })
    },
    data () {
      return {
        totalCount: 0,
        malariaCount: 0,
        pltCount: 0,
        dspWbcClassList: null,
        dspRbcClassList: null,
        dspBfClassList: null,
        maxRbcCount: 0,
        maxWbcCount: 0,
        testType: '01',
        lowPowerPath: null,
        bfSelectModeList: [],
        rbcDegreeStandard: null
      }
    },
    beforeDestroy () {
      // this.EventBus.$off('RECEIVE_DATA')
      this.EventBus.$off('CHANGE_USER')
      this.EventBus.$off('CHANGE_SLIDE')
      this.EventBus.$off('CHANGE_TEST_TYPE')
      ipcRenderer.removeAllListeners(Constant.SELECT_RBC_DEGREE)
    },
    watch: {
      backendData: function(newVal, oldVal) {
        var self = this

        if (self.backendData.jobCmd === 'RUNNING_INFO') {
          var currentSlot = self.backendData.slotInfo.find(function (item) {
            return item.stateCd === '03'
          })

          if (typeof(currentSlot) !== 'undefined') {
            // test type
            self.testType = currentSlot.testType

            // RBC
            self.maxRbcCount = currentSlot.maxRbcCount
            self.maxWbcCount = currentSlot.maxWbcCount

            // malaria
            self.malariaCount = currentSlot.malariaCount

            // PLT
            self.pltCount = currentSlot.pltCount

            // wbc total
            self.totalCount = 0

            // rbc
            var version = Number(self.$replaceAll(Package.version, '.', ''))

            if (version <= 155) {
              self.calcRbc(currentSlot.rbcInfo)
            } else {
              self.calcRbcDegree(currentSlot.rbcInfo)
            }

            // WBC PB
            if (self.testType === '01' || self.testType === '04') {
              self.calcWbc(currentSlot.wbcInfo).then(function (totalCount) {
                for (var i = 0; i < self.dspWbcClassList.length; i++) {
                  self.dspWbcClassList[i].percent = ((Number(self.dspWbcClassList[i].count) / self.totalCount) * 100).toFixed(0)
                }
              })
            } else {  // BF
              self.calcWbc(currentSlot.wbcInfo).then(function (totalCount) {
                for (var i = 0; i < self.dspBfClassList.length; i++) {
                  self.dspBfClassList[i].percent = ((Number(self.dspBfClassList[i].count) / self.totalCount) * 100).toFixed(0)
                }
              })

              self.lowPowerPath = currentSlot.lowPowerPath
              self.lowPowerPath.sort(function (a, b) {
                return a.seqNo - b.seqNo
              })

              self.lowPowerPath.forEach(function(item) {
                item.path = item.path + '?' + self.$getDateTimeStr()
              })

              console.log(self.lowPowerPath)
            }
          }
        }
      }
    },
    mounted () {
      var self = this

      this.dspWbcClassList = lodash.cloneDeep(this.wbcClassList(this.settings.isNsNbIntegration))
      this.dspRbcClassList = lodash.cloneDeep(this.rbcClassList)
      this.dspBfClassList = lodash.cloneDeep(this.bfClassList)
      this.testType = this.settings.testTypeCd

      console.log(this.dspRbcClassList)

      // classification 초기화
      // self.$store.dispatch(Constant.INIT_WBC_COUNT, null)
      // self.$store.dispatch(Constant.INIT_RBC_DEGREE, null)
      // self.$store.dispatch(Constant.UPDATE_MALARIA_COUNT, 0)
      // self.totalCount = self.getTotalCount()

      ipcRenderer.send(Constant.SELECT_RBC_DEGREE)

      ipcRenderer.on(Constant.SELECT_RBC_DEGREE, function (event, results) {
        console.log(results)

        self.rbcDegreeStandard = results
      })

      this.EventBus.$on('CHANGE_TEST_TYPE', function(params) {
        console.log(params.testType)
        self.testType = params.testType
      })

      this.EventBus.$on('CHANGE_USER', function(params) {
        self.totalCount = 0
        self.malariaCount = 0
        self.pltCount = 0
        self.maxRbcCount = 0
        self.maxWbcCount = 0
        self.dspWbcClassList = lodash.cloneDeep(self.wbcClassList(self.settings.isNsNbIntegration))
        self.dspRbcClassList = lodash.cloneDeep(self.rbcClassList)
        self.dspBfClassList = lodash.cloneDeep(self.bfClassList)
        // self.testType = '01'
        self.bfSelectModeList = []
      })

      this.EventBus.$on('CHANGE_SLIDE', function(params) {
        self.bfSelectModeList = []

        var images = document.getElementsByClassName('wholeSlideImg')
        for (var i = 0; i < images.length; i++) {
          images[i].classList.remove('wholeSlideSelect')
        }

        self.EventBus.$emit('SELECT_BF_IMG', self.bfSelectModeList)
      })

      // this.EventBus.$on('RECEIVE_DATA', function(params) {
      //   var jobCmd = params.jobCmd
      //
      //   if (jobCmd === 'RUNNING_INFO') {
      //     var currentSlot = params.slotInfo.find(function (item) {
      //       return item.stateCd === '03'
      //     })
      //
      //     console.log(currentSlot)
      //     if (typeof(currentSlot) !== 'undefined') {
      //       // test type
      //       self.testType = currentSlot.testType
      //
      //       console.log(self.testType)
      //
      //       // RBC
      //       self.maxRbcCount = currentSlot.maxRbcCount
      //
      //       self.maxWbcCount = currentSlot.maxWbcCount
      //
      //       // malaria
      //       self.malariaCount = currentSlot.malariaCount
      //
      //       // PLT
      //       self.pltCount = currentSlot.pltCount
      //
      //       // wbc total
      //       self.totalCount = 0
      //
      //       // rbc
      //       var version = Number(self.$replaceAll(Package.version, '.', ''))
      //
      //       if (version <= 155) {
      //         self.calcRbc(currentSlot.rbcInfo)
      //       } else {
      //         self.calcRbcDegree(currentSlot.rbcInfo)
      //       }
      //
      //       // WBC PB
      //       if (self.testType === '01' || self.testType === '04') {
      //         self.calcWbc(currentSlot.wbcInfo).then(function (totalCount) {
      //           for (var i = 0; i < self.dspWbcClassList.length; i++) {
      //             self.dspWbcClassList[i].percent = ((Number(self.dspWbcClassList[i].count) / self.totalCount) * 100).toFixed(0)
      //           }
      //         })
      //       } else {  // BF
      //         self.calcWbc(currentSlot.wbcInfo).then(function (totalCount) {
      //           for (var i = 0; i < self.dspBfClassList.length; i++) {
      //             self.dspBfClassList[i].percent = ((Number(self.dspBfClassList[i].count) / self.totalCount) * 100).toFixed(0)
      //           }
      //         })
      //
      //         self.lowPowerPath = currentSlot.lowPowerPath
      //         self.lowPowerPath.sort(function (a, b) {
      //           return a.seqNo - b.seqNo
      //         })
      //
      //         self.lowPowerPath.forEach(function(item) {
      //           item.path = item.path + '?' + self.$getDateTimeStr()
      //         })
      //
      //         console.log(self.lowPowerPath)
      //       }
      //     }
      //   }
      // })
    },
    methods: {
      calcRbcDegree: function (rbcInfo) {
        var self = this
        var totalCount = 0
        var sizeTotal = 0
        var chromiaTotal = 0

        // degree
        rbcInfo.forEach(function (rbcCategory, catIndex) {
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
            // shape, inclusion body total
            else {
              totalCount += Number(rbcClass.degree)
            }
          })
        })

        rbcInfo.forEach(function (rbcCategory, catIndex) {
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
                }
              }
            })
          })
        })

        rbcInfo.forEach(function (rbcCategory, catIndex) {
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

            // display rbc info
            self.dspRbcClassList.forEach(function (dspRbcCategory) {
              dspRbcCategory.classInfo.forEach(function(dspRbcClass) {
                rbcCategory.classInfo.forEach(function(rbcClassInfo) {
                  if ((dspRbcCategory.categoryId === rbcCategory.categoryId) &&
                      (dspRbcClass.classId === rbcClassInfo.classId)) {
                    dspRbcClass.degree = rbcClassInfo.degree
                  }
                })
              })
            })
          })
        })

      },
      onClickBfImg: function(evt) {
        if (this.testType === '03') {
          this.bfSelectModeList = []

          var clickImg = document.getElementById(evt.target.id)
          clickImg.classList.toggle('wholeSlideSelect')

          var images = document.getElementsByClassName('wholeSlideImg')
          for (var i = 0; i < images.length; i++) {
            if (images[i].classList.contains('wholeSlideSelect')) {
              this.bfSelectModeList.push(images[i].id)
            }
          }
          console.log(this.bfSelectModeList)
          this.EventBus.$emit('SELECT_BF_IMG', this.bfSelectModeList)
        }
      },
      calcWbc: function(wbcList) {
        return new Promise((succ, fail) => {
          try {
            var classList = []

            if (this.testType === '01' || this.testType === '04') {
              classList = this.dspWbcClassList
            } else {
              classList = this.dspBfClassList
            }

            for (var i = 0; i < classList.length; i++) {
              for (var j = 0; j < wbcList.length; j++) {
                if (classList[i].id === wbcList[j].id) {
                  // AR, NR, GP, PA, MC total 제외
                  if (classList[i].title !== 'AR' &&
                      classList[i].title !== 'NR' &&
                      classList[i].title !== 'GP' &&
                      classList[i].title !== 'PA' &&
                      classList[i].title !== 'MC' &&
                      classList[i].title !== 'MA') {
                    this.totalCount += Number(wbcList[j].count)
                  }
                  classList[i].count = wbcList[j].count
                }
              }
            }
            succ(this.totalCount)
          } catch (error) {
            fail(error)
          }
        })
      },
      calcRbc: function(rbcList) {
        return new Promise((succ, fail) => {
          try {
            for (var i = 0; i < this.dspRbcClassList.length; i++) {
              for (var j = 0; j < rbcList.length; j++) {
                if (this.dspRbcClassList[i].categoryId === rbcList[j].categoryId) {
                  for (var k = 0; k < this.dspRbcClassList[i].classInfo.length; k++) {
                    for (var l = 0; l < rbcList[j].classInfo.length; l++) {
                      if (this.dspRbcClassList[i].classInfo[k].classId === rbcList[j].classInfo[l].classId) {
                        this.dspRbcClassList[i].classInfo[k].degree = rbcList[j].classInfo[l].degree
                      }
                    }
                  }
                }
              }
            }
            succ()
          } catch (error) {
            fail(error)
          }
        })
      }
    }
  }
</script>
<style>
  #testResults{
    height: 784px;
  }
</style>
