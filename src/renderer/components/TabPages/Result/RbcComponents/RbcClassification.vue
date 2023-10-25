<template>
  <b-container id="rbcClassification" fluid>
    <b-row>
      <b-col class="p-0 pt-1">
        <b-card id="rbcInfoCard" class="blackCard" text-variant="white" no-body>
          <div class="panelTitle w-100 pr-2">
            <span>RBC Classification</span>
            <b-icon v-if="isLisShow && siteCd !== '0007'" class="ml-2 pointer"
              icon="file-earmark-arrow-up"
              font-scale="1.1"
              @click="onClickLisUpload"
              v-b-tooltip.hover title="upload to lis (F9)"
              style="color: white;"></b-icon>
          </div>

          <div id="rbcWrapper">
            <b-row class="mt-3">
              <b-col>
                {{ rbcFields[0] }}
              </b-col>
              <b-col>
                {{ rbcFields[1] }}
              </b-col>
              <b-col>
                {{ rbcFields[2] }}
              </b-col>
            </b-row>
            <b-row>
              <b-col></b-col>
              <b-col></b-col>
              <b-col style="font-size: 11px;">0+ 1+ 2+ 3+</b-col>
            </b-row>
            <div>
              <b-row v-for="(rbc, index) in rbcClassList" class="mt-2 panelContent" :key="index">
                <b-col>
                  <div v-if="rbc.CATEGORY_ID === '01' && index === 0">{{ rbc.CATEGORY_NM }}</div>
                  <div v-if="rbc.CATEGORY_ID === '02' && index === 4">{{ rbc.CATEGORY_NM }}</div>
                  <div v-if="rbc.CATEGORY_ID === '03' && index === 8">{{ rbc.CATEGORY_NM }}</div>
                  <div v-if="rbc.CATEGORY_ID === '05' && index === 19">{{ rbc.CATEGORY_NM }}</div>
                </b-col>
                <b-col>
                  <div v-if="rbc.CATEGORY_ID === '03' || rbc.CATEGORY_ID === '05'">
                    <b-form-checkbox
                      :value="rbc.CATEGORY_ID + rbc.CLASS_ID + 'Y'"
                      :unchecked-value="rbc.CATEGORY_ID + rbc.CLASS_ID + 'N'"
                      @change="onChangeCheck">
                      <span>{{ rbc.CLASS_NM }}</span>
                    </b-form-checkbox>
                  </div>
                  <div v-else>
                    <span>{{ rbc.CLASS_NM }}</span>
                  </div>
                </b-col>
                <b-col v-if="((rbc.CATEGORY_ID === '01' || rbc.CATEGORY_ID === '02' || rbc.CATEGORY_ID === '03') && rbc.CLASS_ID !== '01') || (rbc.CATEGORY_ID === '05')"
                  class="pointer"
                  @click="onClickDegree($event, rbc)">
                  <div v-if="rbc.DEGREE === '1'">
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 2" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 3" />
                  </div>
                  <div v-else-if="rbc.DEGREE === '2'">
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 2" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 3" />
                  </div>
                  <div v-else-if="rbc.DEGREE === '3'">
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 2" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 3" />
                  </div>
                  <!-- <div v-else-if="rbc.DEGREE === '4'">
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 2" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 3" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 4" />
                  </div> -->
                  <div v-else>
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 2" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 3" />
                  </div>
                </b-col>
                <b-col v-else class="pointer" @click="onClickDegree($event, rbc)">
                  <div v-if="rbc.DEGREE === '0'">
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                  </div>
                  <div v-else>
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                  </div>
                </b-col>
              </b-row>
            </div>
            <b-row class="mt-2 panelContent">
              <b-col>
                Others
              </b-col>
              <b-col>
                <b-form-checkbox
                  value="0401Y"
                  unchecked-value="0401N"
                  @change="onChangeCheck">
                  <span>Platelets</span>
                </b-form-checkbox>
              </b-col>
              <b-col>
                <span v-if="selectedItem">{{ selectedItem.PLT_COUNT }} PLT / 1000 RBC</span>
              </b-col>
            </b-row>
            <b-row class="mt-2 panelContent">
              <b-col></b-col>
              <b-col>
                <b-form-checkbox
                  value="0503Y"
                  unchecked-value="0503N"
                  @change="onChangeCheck">
                  <span>Malaria</span>
                </b-form-checkbox>
              </b-col>
              <b-col>
                <span v-if="selectedItem">{{ selectedItem.MALARIA_COUNT }} / {{ selectedItem.MAX_RBC_COUNT }} RBC</span>
              </b-col>
            </b-row>
          </div>
          <b-row v-if="!isReportPage">
            <b-col class="pointer" @click="onClickBefore">
              <div id="divRbcBefore">Before</div>
            </b-col>
            <b-col class="pointer" @click="onClickAfter">
              <div id="divRbcAfter">After</div>
            </b-col>
          </b-row>
          <!-- <div id="markerWrapper">
            <div>[ Shape ]</div>
            <b-form-group>
              <b-form-checkbox-group
                id="rbcShapeGroup"
                v-model="shapeClassList"
                :options="shapeOptions"
                name="rbcShapeGroup"
                @change="onChangeShape"
                stacked
              ></b-form-checkbox-group>
            </b-form-group>

            <div class="mt-3">
              <div>[ Platelet ]</div>
              <b-form-group>
                <b-form-checkbox-group
                  id="rbcPlateGroup"
                  v-model="plateletClassList"
                  :options="plateletOptions"
                  name="rbcPlateGroup"
                  @change="onChangePlatelet"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>

            <div class="mt-3">
              <div>[ Inclusion Body ]</div>
              <b-form-group>
                <b-form-checkbox-group
                  id="rbcInclusionGroup"
                  v-model="inclusionBodyClassList"
                  :options="inclusionBodyOptions"
                  name="rbcInclusionGroup"
                  @change="onChangeInclusion"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>
            <div class="pb-4">
              <b-form-checkbox
                id="rbcSelectAll"
                value="Y"
                unchecked-value="N"
                v-model="selectAll"
                @change="onRbcSelectAll">
                Select All
              </b-form-checkbox>
            </div>
          </div> -->
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
                <textarea id="inputRbcComment"
                  class="form-control"
                  rows="4"
                  aria-label="With textarea"
                  v-model="modelData.rbcComment"
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
  import Package from '../../../../../../package.json'
  import lodash from 'lodash'
  // import colorPicker from '@caohenghu/vue-colorpicker'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'rbc-classification',
    computed: {
      ...mapGetters({
        rbcFields: Constant.GET_RBC_FIELDS,
        commonCode: Constant.GET_COMMON_CODE,
        currentUser: Constant.GET_CURRENT_USER,
        orderId: Constant.GET_SELECT_ORDER_ID,
        settings: Constant.GET_SETTINGS,
        rbcClassList: Constant.GET_CURRENT_RBC_RESULTS,
        skmcLisResult: Constant.GET_SKMC_LIS_RESULTS,
        siteCd: Constant.GET_SITE_CD
      })
    },
    props: ['paramItem'],
    watch: {
      rbcClassList: function(newObj, oldObj) {
        console.log(newObj)
        var self = this
        var findItem = newObj.find(function (item) {
          item.CATEGORY_ID === '05'
        })

        if (findItem) {
          self.isInclusion = true
        }

        // update skmc rbc result
        if (self.siteCd === '0007' && self.skmcLisResult.length > 0) {
          var categoryList = ['01', '02']
          var classList = ['01', '02', '03', '04']
          var degList = ['0', '0', '0', '0']

          console.log(self.skmcLisResult)
          self.skmcLisResult.forEach(function(item) {
            // MCV
            if (item.I01GSNM.trim() === 'MCV') {
              var mcvValue = item.I01NUM1
              console.log('mcvValue : ' + mcvValue)
              if (mcvValue < 80.0) {
                degList[0] = '0'
                degList[1] = '0'
                degList[2] = '3'
                degList[3] = '0'

              } else if (mcvValue >= 80.0 && mcvValue <= 100.0) {
                degList[0] = '1'
                degList[1] = '0'
                degList[2] = '0'
                degList[3] = '0'
              } else {
                degList[0] = '0'
                degList[1] = '3'
                degList[2] = '0'
                degList[3] = '0'
              }
            }

            // MCH
            if (item.I01GSNM.trim() === 'MCH') {
              var mchValue = item.I01NUM1
              console.log('mchValue : ' + mchValue)
              if (mchValue < 27.0) {
                degList[0] = '0'
                degList[1] = '0'
                degList[2] = '3'
                degList[3] = '0'
              } else if (mchValue >= 27.0) {
                degList[0] = '1'
                degList[1] = '0'
                degList[2] = '0'
                degList[3] = '0'
              }
            }
          })

          var params = []
          categoryList.forEach(function(categoryItem) {
            classList.forEach(function(classItem, index) {
              var obj = {
                degree: degList[index],
                cassetId: newObj[0].CASSET_ID,
                slotId: newObj[0].SLOT_ID,
                categoryId: categoryItem,
                classId: classItem
              }

              params.push(obj)
            })
          })

          console.log(params)
          ipcRenderer.send(Constant.UPDATE_RBC_CLASSIFICATION_SKMC, JSON.stringify(params))
        }

      },
      paramItem: function(newObj, oldObj) {
        console.log(newObj)

        this.selectedItem = newObj
        this.modelData.rbcComment = this.selectedItem.RBC_COMMENT

        // init checkbox
        this.shapeClassList = []
        this.plateletClassList = []
        this.inclusionBodyClassList = []
        this.selectAll = 'N'

        this.$store.dispatch(Constant.SET_RBC_SHAPE, this.shapeClassList)
        this.$store.dispatch(Constant.SET_RBC_PLATELET, this.plateletClassList)
        this.$store.dispatch(Constant.SET_RBC_INCLUSION, this.inclusionBodyClassList)

        if (document.getElementById('divRbcBefore')) {
          document.getElementById('divRbcBefore').style.color = ''
        }

        if (document.getElementById('divRbcAfter')) {
          document.getElementById('divRbcAfter').style.color = 'red'
        }

        if (this.selectedItem.SIGNED_STATE === this.commonCode(Constant.GET_CODE_SIGNED_STATE, '01').cdNm) {
          document.getElementById('inputRbcComment').disabled = true
        } else {
          document.getElementById('inputRbcComment').disabled = false
        }

        ipcRenderer.send(Constant.SELECT_RBC_DEGREE)
        ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
      }
    },
    data () {
      return {
        modelData: {
          rbcComment: ''
        },
        // rbcClassList: null,
        selectedItem: null,
        isInclusion: false,
        isBefore: false,
        shapeClassList: [],
        shapeOptions: [
          { text: 'Normal', value: '01' },
          // { text: 'Poikilocytosis', value: '02' },
          { text: 'Target Cell', value: '03' },
          { text: 'Burr Cell', value: '04' },
          { text: 'Acanthocyte', value: '05' },
          { text: 'Ovalocyte', value: '06' },
          { text: 'Schistocyte', value: '07' },
          { text: 'Sickle Cell', value: '08' },
          { text: 'Stomatocyte', value: '09' },
          { text: 'Tear Drop Cell', value: '10' },
          { text: 'Spherocyte', value: '11' }
        ],
        plateletClassList: [],
        plateletOptions: [
          { text: 'Platelet', value: '01' }
        ],
        inclusionBodyClassList: [],
        inclusionBodyOptions: [
          { text: 'Howell-Jolly Body', value: '01' },
          { text: 'Malaria', value: '02' }
        ],
        rbcDegreeStandard: null,
        uiVersion: 0,
        isReportPage: false,
        selectAll: 'N',
        isLisShow: false,
        checkGroup: []
      }
    },
    beforeDestroy () {
      // ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT)
      ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT_HIST)
      ipcRenderer.removeAllListeners(Constant.UPDATE_RBC_COMMENT)
      ipcRenderer.removeAllListeners(Constant.UPDATE_RBC_CLASSIFICATION)
      // ipcRenderer.removeAllListeners(Constant.UPDATE_RBC_CLASSIFICATION_SKMC)

      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      ipcRenderer.removeAllListeners(Constant.SELECT_RBC_DEGREE)

      this.EventBus.$off('MALARIA_MOVE_COMPLETE')
    },
    mounted () {
      var self = this
      console.log('rbc mount-')
      this.uiVersion = Number(self.$replaceAll(Package.version, '.', ''))

      // this.selectedItem = this.getTestHistory(this.$route.params.orderNo)
      // this.rbcClassList = this.selectedItem.rbcInfo
      // this.modelData.rbcComment = this.selectedItem.rbcComment

      // if (this.selectedItem.signedState === this.commonCode(Constant.GET_CODE_SIGNED_STATE, '01').cdNm) {
      //   document.getElementById('inputRbcComment').disabled = true
      // } else {
      //   document.getElementById('inputRbcComment').disabled = false
      // }
      // var findItem = this.selectedItem.rbcInfo.find(function (item) {
      //   item.categoryId === '05'
      // })
      // if (findItem) {
      //   this.isInclusion = true
      // }

      this.shapeClassList = this.settings.rbcShape
      this.plateletClassList = this.settings.rbcPlatelet
      this.inclusionBodyClassList = this.settings.rbcInclusion

      if (this.$route.path.includes('finalReport')) {
        self.isReportPage = true
      }

      if (this.$route.path.includes('rbcReport')) {
        self.isLisShow = true
      }

      // ipcRenderer.send(Constant.SELECT_RBC_DEGREE)
      // ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: this.orderId}))
      // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: this.orderId}))

      ipcRenderer.on(Constant.SELECT_RBC_DEGREE, function (event, results) {
        console.log(results)

        self.rbcDegreeStandard = results
      })

      // RBC Count
      // ipcRenderer.on(Constant.GET_RBC_COUNT, function (event, result) {
      //   console.log(result)
      //   console.log(self.selectedItem)
      //
      //   self.rbcClassList = result
      //   var findItem = result.find(function (item) {
      //     item.CATEGORY_ID === '05'
      //   })
      //
      //   if (findItem) {
      //     self.isInclusion = true
      //   }
      //
      //   self.EventBus.$emit('OVERLAY', {state: false})
      // })

      ipcRenderer.on(Constant.GET_RBC_COUNT_HIST, function (event, result) {
        console.log(result)
        self.$store.dispatch(Constant.SET_CURRENT_RBC_RESULTS, result)

        // self.rbcClassList = result
        // var findItem = result.find(function (item) {
        //   item.CATEGORY_ID === '05'
        // })
        //
        // if (findItem) {
        //   self.isInclusion = true
        // }
        //
        // self.EventBus.$emit('OVERLAY', {state: false})
      })

      ipcRenderer.on(Constant.UPDATE_RBC_CLASSIFICATION, function (event, result) {
        console.log(self.selectedItem)
        ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: self.selectedItem.SLOT_ID}))
      })

      // ipcRenderer.on(Constant.UPDATE_RBC_CLASSIFICATION_SKMC, function (event, result) {
      //   console.log(self.selectedItem)
      //   ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: self.orderId}))
      // })

      // malaria count update
      this.EventBus.$on('MALARIA_MOVE_COMPLETE', function(params) {
        self.selectedItem.MALARIA_COUNT = params
        console.log(self.selectedItem)
        var obj = {
          malariaCount: self.selectedItem.MALARIA_COUNT,
          userId: self.currentUser.userId,
          slotId: self.selectedItem.SLOT_ID
        }
        ipcRenderer.send(Constant.UPDATE_MALARIA_COUNT, JSON.stringify(obj))
      })
    },
    methods: {
      onChangeCheck (value) {
        console.log(value)
        var categoryId = value.substring(0, 2)
        var classId = value.substring(2, 4)
        var isChecked = value.substring(4, 5)

        if (categoryId === '03') {
          if (isChecked === 'Y') {
            this.$store.dispatch(Constant.PUSH_RBC_SHAPE, classId)
          } else {
            this.$store.dispatch(Constant.POP_RBC_SHAPE, classId)
          }
        } else if (categoryId === '04') {
          if (isChecked === 'Y') {
            this.$store.dispatch(Constant.PUSH_RBC_PLATELET, classId)
          } else {
            this.$store.dispatch(Constant.POP_RBC_PLATELET, classId)
          }
        } else if (categoryId === '05') {
          if (isChecked === 'Y') {
            this.$store.dispatch(Constant.PUSH_RBC_INCLUSION, classId)
          } else {
            this.$store.dispatch(Constant.POP_RBC_INCLUSION, classId)
          }
        }

        this.EventBus.$emit('UPDATE_RBC_MARKER', true)
      },
      onClickLisUpload () {
        this.EventBus.$emit('ON_CLICK_LIS', null)
      },
      onRbcSelectAll (value) {
        var self = this
        if (value === 'Y') {
          this.shapeClassList = []
          this.plateletClassList = []
          this.inclusionBodyClassList = []

          this.shapeOptions.forEach(function(item) {
            self.shapeClassList.push(item.value)
          })

          this.plateletOptions.forEach(function(item) {
            self.plateletClassList.push(item.value)
          })

          this.inclusionBodyOptions.forEach(function(item) {
            self.inclusionBodyClassList.push(item.value)
          })

          this.$store.dispatch(Constant.SET_RBC_SHAPE, this.shapeClassList)
          this.$store.dispatch(Constant.SET_RBC_PLATELET, this.plateletClassList)
          this.$store.dispatch(Constant.SET_RBC_INCLUSION, this.inclusionBodyClassList)
        } else {
          this.shapeClassList = []
          this.plateletClassList = []
          this.inclusionBodyClassList = []

          this.$store.dispatch(Constant.SET_RBC_SHAPE, this.shapeClassList)
          this.$store.dispatch(Constant.SET_RBC_PLATELET, this.plateletClassList)
          this.$store.dispatch(Constant.SET_RBC_INCLUSION, this.inclusionBodyClassList)
        }

        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: this.orderId}))
        this.EventBus.$emit('UPDATE_RBC_MARKER', true)
      },
      onChangeShape (value) {
        console.log(value)
        this.$store.dispatch(Constant.SET_RBC_SHAPE, value)
        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: this.orderId}))
        this.EventBus.$emit('UPDATE_RBC_MARKER', true)
      },
      onChangePlatelet (value) {
        console.log(value)
        this.$store.dispatch(Constant.SET_RBC_PLATELET, value)
        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: this.orderId}))
        this.EventBus.$emit('UPDATE_RBC_MARKER', true)
      },
      onChangeInclusion (value) {
        this.$store.dispatch(Constant.SET_RBC_INCLUSION, value)
        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: this.orderId}))
        this.EventBus.$emit('UPDATE_RBC_MARKER', true)
      },
      onClickDegree (evt, rbc) {
        console.log(evt)
        console.log(rbc)
        var self = this

        if (!self.isBefore) {
          if (evt.target.id !== '' && evt.target.id.length === 5) {
            var categoryId = evt.target.id.slice(0, 2)
            var classId = evt.target.id.slice(2, 4)
            var degree = evt.target.id.slice(4)

            if (self.siteCd === '0007' && (categoryId === '01' || categoryId === '02')) {
              self.$toasted.show('Size and Chromia values are mapped to MCV and MCH.', {
                position: 'bottom-center',
                duration: '2000'
              })
            } else {
              var params = {
                degree: degree,
                cassetId: rbc.CASSET_ID,
                slotId: rbc.SLOT_ID,
                categoryId: rbc.CATEGORY_ID,
                classId: rbc.CLASS_ID
              }

              if (categoryId === '01' || categoryId === '02' || categoryId === '03') {
                if (classId === '01') {
                  var normalDegree = '0'
                  if (degree === '0') {
                    normalDegree = '1'
                  }

                  params.degree = normalDegree
                }
              }
              console.log(params)

              this.EventBus.$emit('OVERLAY', {state: true})
              ipcRenderer.send(Constant.UPDATE_RBC_CLASSIFICATION, JSON.stringify(params))
            }
          }
        }
      },
      onChangeComment (evt) {
        var obj = {
          slotId: this.selectedItem.SLOT_ID,
          rbcComment: this.modelData.rbcComment
        }

        ipcRenderer.send(Constant.UPDATE_RBC_COMMENT, JSON.stringify({obj}))
        this.EventBus.$emit(Constant.UPDATE_RBC_COMMENT, this.modelData.rbcComment)

        this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })
      },
      onClickBefore (evt) {
        console.log('onClickBefore')
        ipcRenderer.send(Constant.GET_RBC_COUNT_HIST, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))

        document.getElementById('divRbcBefore').style.color = 'red'
        document.getElementById('divRbcAfter').style.color = ''

        this.isBefore = true
      },
      onClickAfter (evt) {
        console.log('onClickAfter')
        ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))

        document.getElementById('divRbcAfter').style.color = 'red'
        document.getElementById('divRbcBefore').style.color = ''

        this.isBefore = false
      }
    }
  }
</script>

<style>
  #rbcInfoCard {
    height: 733px;
  }
  #rbcWrapper {
    height: 755px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  #markerWrapper {
    height: 230px;
    padding-top: 10px;
    border-top: 1px solid #2B455C;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
