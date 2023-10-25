<template>
  <div class="container">
    <div class="modalContent pb-3 pl-3 pr-3 border">
      <!-- RBC morphology -->
      <b-card class="mt-2">
        <b-row>
          <b-col cols="3">
            <strong>종합결과코드</strong>
          </b-col>
          <b-col>
            <b-input-group size="sm">
              <b-form-input size="sm" v-model="searchText" placeholder="search"></b-form-input>
              <template #append>
                <b-dropdown size="sm"
                  class="dropDownStyle"
                  toggle-class="text-decoration-none">
                  <b-dropdown-item href="#"
                    v-for="(resultItem, index) in overallResultCdOptions"
                    :key="index"
                    @click="onChangeResultCd(resultItem)"
                  >
                    <span>{{resultItem.text}}</span>
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-input-group>
          </b-col>
          <!-- <b-col cols="3">
            <b-form-select v-model="overallResultCd" size="sm"
              :options="overallResultCdOptions"
              @change="onChangeResultCd"
              ></b-form-select>
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="searchText" placeholder="search"></b-form-input>
          </b-col> -->

          <b-col cols="1">
            <b-button class="custom-blue-btn" @click="onResultSave" size="sm">Save</b-button>
          </b-col>
          <b-col class="text-right pt-1" cols="2">
            <b-icon class="pointer" icon="plus-circle" @click="onAddResultCd"></b-icon>
            <b-icon class="pointer" icon="dash-circle" @click="onRemoveResultCd"></b-icon>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col class="text-center colorWhite" style="background-color: #282828;">
            <strong>RBC morphology</strong>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col>
            <b-row>
              <b-col class="fontSize14 pt-1">
                <div>Size</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="rbcSize" size="sm" :options="rbcSizeOptions"
                ></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Chromicity</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="rbcChromia" size="sm" :options="rbcChromiaOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Anisocytosis</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="anisocytosis" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Poikilocytosis</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="poikilocytosis" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>elliptocyte</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="elliptocyte" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>burr cell</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="buurCell" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>target cell</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="targetCell" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>spherocyte</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="spherocyte" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
          </b-col>

          <b-col>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Schistocyte</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="schistocyte" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>dimorphism</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="dimorphism" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>rouleaux</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="rouleaux" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>polychromasia</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="polychromasia" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>baso</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="baso" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>H - J body</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="hjBody" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Nucleated RBC</div>
              </b-col>
              <b-col>
                <b-row>
                  <b-col class="pr-0">
                    <b-form-input class="inputCustom" type="number" size="sm" v-model="nucleatedRbc"></b-form-input>
                  </b-col>
                  <b-col>
                    <span style="font-size: 12px;">/ 100WBC'S</span>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>기타</div>
              </b-col>
              <b-col>
                <b-row>
                  <b-col>
                    <b-form-input class="inputCustom" size="sm" v-model="rbcOthers"></b-form-input>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row>
          <!-- WBC morphology -->
          <b-col>
            <b-row class="mt-1">
              <b-col class="text-center colorWhite" style="background-color: #282828;">
                <strong>WBC morphology</strong>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Number</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="wbcNumber" size="sm" :options="wbcNumberOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Toxic granule</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="wbcTocxicgranule" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Toxic vacuole</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="wbcTocxicVacuole" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Dohle body</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="wbcDohleBody" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>L-S maturation</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="wbcLsMaturation" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>N-segmentation</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="nSegmentation" size="sm" :options="nSegmentationOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>기타</div>
              </b-col>
              <b-col>
                <b-form-input class="inputCustom" size="sm" v-model="wbcOthers"></b-form-input>
              </b-col>
            </b-row>
          </b-col>

          <!-- Platelet morphology -->
          <b-col>
            <b-row class="mt-1">
              <b-col class="text-center colorWhite" style="background-color: #282828;">
                <strong>Platelet morphology</strong>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Number</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="plateletNumber" size="sm" :options="plateletNumberOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="fontSize14 pt-1">
                <div>Size</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="plateletSize" size="sm" :options="pltDegreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="fontSize14 pt-1">
                <div>Clumping</div>
              </b-col>
              <b-col>
                <b-form-select class="inputCustom" v-model="clumping" size="sm" :options="pltDegreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col>
                <b-button class="custom-blue-btn w-100" @click="onSelectRemark" size="sm">Select remark</b-button>
                <b-button class="custom-blue-btn w-100 mt-2" @click="onDeleteRemark" size="sm">Delete remark</b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <!-- remark -->
        <b-row class="mt-1">
          <b-col class="text-center colorWhite" style="background-color: #282828;">
            <strong>Remark</strong>
          </b-col>
        </b-row>
        <b-row style="height: 330px;">
          <b-col class="p-2 colorBlack pointer" style="height: 330px; overflow-y: scroll;">
            <b-form-input type="text"
              v-for="remarkItem, index in remarkContents" :key="keyIndex + index"
              v-model="remarkItem.text" @input="onChangeInput(remarkItem)"
              size="sm"
              @keyup="onClickInput($event, index)"
              @focus="onFocusInput($event, index)"
              @select="onSelectText">
            </b-form-input>
          </b-col>
        </b-row>
        <input type="hidden" id="focusRemark" :value="focusRemark">
        <!-- <b-row>
          <b-col>
            <b-button class="custom-blue-btn w-100" @click="onAddRemarkRow" size="sm">ADD</b-button>
          </b-col>
        </b-row> -->
      </b-card>

      <div class="text-right mt-2">
        <b-button class="custom-blue-btn" @click="onOk" size="sm">OK</b-button>
        <b-button class="custom-blue-btn" @click="onCancel" size="sm">CANCEL</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Constant from '../../../Constant'
  import worker from '../../workers/promise'
  import ModalSkmcRemark from './ModalSkmcRemark'
  import ModalConfirm from './ModalConfirm'
  import ModalSkmcAddResultCd from './ModalSkmcAddResultCd'
  import ModalSkmcModifyRemark from './ModalSkmcModifyRemark'
  import { mapGetters } from 'vuex'
  import api from '@/service'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-skmc-morphology',
    props: ['selectedItem'],
    computed: {
      ...mapGetters({
        currentUser: Constant.GET_CURRENT_USER,
        skmcLisResult: Constant.GET_SKMC_LIS_RESULTS
      })
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_SKMC_RESULT_CD)
      ipcRenderer.removeAllListeners(Constant.GET_SKMC_FAVORITE)
      ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT_SKMC)

      this.EventBus.$off('REMOVE_SKMC_RESULT_CD')
      this.EventBus.$off('REMARK_SELECTED')
      this.EventBus.$off('UPLOAD_LIS_SKMC')

    },
    watch: {
      searchText: function(newVal, oldVal) {
        console.log(newVal, oldVal)
        var self = this

        console.log(self.overallResultCdOptions)
        self.overallResultCdOptions = self.overallResultCdOptionsOrg.filter(function(codeItem) {
          return codeItem.text.substr(0, newVal.length).toLowerCase() === newVal.toLowerCase()
        })
      }
    },
    mounted () {
      var self = this

      console.log(this.skmcLisResult)
      console.log(this.selectedItem)

      ipcRenderer.send(Constant.GET_SKMC_RESULT_CD, null)
      ipcRenderer.send(Constant.GET_RBC_COUNT_SKMC, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))

      ipcRenderer.on(Constant.GET_RBC_COUNT_SKMC, function (event, result) {
        console.log(result)
        self.skmcLisResult.forEach(function(item) {
          // MCV
          if (item.I01GSNM.trim() === 'MCV') {
            var mcvValue = item.I01NUM1
            console.log('mcvValue : ' + mcvValue)
            if (mcvValue < 80.0) {
              self.rbcSize = '01'
            } else if (mcvValue >= 80.0 && mcvValue <= 100.0) {
              self.rbcSize = '02'
            } else {
              self.rbcSize = '03'
            }
          }

          // MCH
          if (item.I01GSNM.trim() === 'MCH') {
            var mchValue = item.I01NUM1
            console.log('mchValue : ' + mchValue)
            if (mchValue < 27.0) {
              self.rbcChromia = '01'
            } else if (mchValue >= 27.0) {
              self.rbcChromia = '02'
            }
          }

          // WBC
          if (item.I01GSNM.trim() === 'WBC') {
            var wbcCham = item.I01CHAM.trim()
            console.log('wbcCham : ' + wbcCham)

            if (wbcCham === 'L') {
              self.wbcNumber = '02'
            } else if (wbcCham === 'H') {
              self.wbcNumber = '03'
            } else {
              self.wbcNumber = '01'
            }
          }

          // PLT
          if (item.I01GSNM.trim() === 'Platelet') {
            var pltCham = item.I01CHAM.trim()
            console.log('pltCham : ' + pltCham)

            if (pltCham === 'L') {
              self.plateletNumber = '02'
            } else if (pltCham === 'H') {
              self.plateletNumber = '03'
            } else {
              self.plateletNumber = '01'
            }
          }
        })

        result.forEach(function(rbcItem) {
          var degree = '00'

          console.log(rbcItem)
          if (Number(rbcItem.DEGREE) > 0) {
            degree = '0' + Number(rbcItem.DEGREE)
          }

          // size
          if (rbcItem.CATEGORY_ID === '01') {
            if (rbcItem.CLASS_ID === '04') {
              self.anisocytosis = degree
            }
          }

          // chromia
          if (rbcItem.CATEGORY_ID === '02') {
            if (rbcItem.CLASS_ID === '04') {
              self.polychromasia = degree
            }
          }

          // shape
          if (rbcItem.CATEGORY_ID === '03') {
            if (rbcItem.CLASS_ID === '02') {
              self.poikilocytosis = degree
            } else if (rbcItem.CLASS_ID === '03') {
              self.targetCell = degree
            } else if (rbcItem.CLASS_ID === '04') {
              self.buurCell = degree
            } else if (rbcItem.CLASS_ID === '06') { // 20230623 삼광요청 Ovalocyte -> elliptocyte로
              self.elliptocyte = degree
            } else if (rbcItem.CLASS_ID === '07') {
              self.schistocyte = degree
            } else if (rbcItem.CLASS_ID === '11') {
              self.spherocyte = degree
            }
          }

          // inclusion body
          if (rbcItem.CATEGORY_ID === '05') {
            if (rbcItem.CLASS_ID === '01') {
              self.hjBody = degree
            } else if (rbcItem.CLASS_ID === '02') {
              self.baso = degree
            }
          }
        })
      })

      ipcRenderer.on(Constant.GET_SKMC_RESULT_CD, function (event, result) {
        console.log(result)
        // self.overallResultCdOptions = []
        // self.overallResultCdOptions.push({value: '00', text: '-'})
        // self.overallResultCd = '00'

        result.forEach(function(item) {
          self.overallResultCdOptions.push({value: item.RESULT_CD, text: item.RESULT_CD_NM})
        })

        self.overallResultCdOptionsOrg = self.overallResultCdOptions

        console.log(self.overallResultCdOptions)
      })

      ipcRenderer.on(Constant.GET_SKMC_FAVORITE, function (event, result) {
        console.log(result)
        console.log(self.remarkContents)

        self.remarkContents = []

        if (result !== null) {
          self.rbcSize = result.RBC_SIZE_CD
          self.rbcChromia = result.RBC_CHROMICITY_CD
          self.anisocytosis = result.RBC_ANISOCYTOSIS_CD
          self.poikilocytosis = result.RBC_POIKILOCYTOSIS_CD
          self.elliptocyte = result.RBC_ELLIPTOCYTE_CD
          self.buurCell = result.RBC_BURRCELL_CD
          self.targetCell = result.RBC_TARGET_CELL_CD
          self.spherocyte = result.RBC_SPHEROCYTE_CD
          self.schistocyte = result.RBC_SCHISTOCYTE_CD
          self.dimorphism = result.RBC_DIMORPHISM_CD
          self.rouleaux = result.RBC_ROULEAUX_CD
          self.polychromasia = result.RBC_POLYCHROMASIA_CD
          self.baso = result.RBC_BASO_CD
          self.hjBody = result.RBC_H_J_BODY_CD
          self.nucleatedRbc = result.RBC_NRBC_CD
          self.rbcOthers = result.RBC_OTHER_CD
          self.wbcNumber = result.WBC_NUMBER_CD
          self.wbcTocxicgranule = result.WBC_TOXIC_GRANULE_CD
          self.wbcTocxicVacuole = result.WBC_TOXIC_VACUOLE_CD
          self.wbcDohleBody = result.WBC_DOHLE_BODY_CD
          self.wbcLsMaturation = result.WBC_L_S_MATURATION_CD
          self.nSegmentation = result.WBC_N_S_MATURATION_CD
          self.wbcOthers = result.WBC_OTHER_CD
          self.plateletNumber = result.PLT_NUMBER_CD
          self.plateletSize = result.PLT_SIZE_CD
          self.clumping = result.PLT_CLUMPING_CD
          self.remarkContents = JSON.parse(result.JSON_REMARKS)
        }

        self.remarkContents.sort(function(a, b) {
          return Number(a.seqNo) - Number(b.seqNo)
        })

        // console.log(self.remark)
        console.log(self.remarkContents)

        // self.remark.forEach(function(remark, index) {
        //   var contents = remark.REMARK_CONTENTS.split('\n')
        //
        //   for (var i = 0; i < contents.length; i++) {
        //     if (contents[i] !== '') {
        //       var obj = {
        //         remarkCd: remark.REMARK_CD,
        //         text: contents[i]
        //       }
        //
        //       self.remarkContents.push(obj)
        //     }
        //   }
        // })

      })

      // this.EventBus.$on('MODIFY_REMARK', function(params) {
      //   console.log(params)
      //
      //   var remark = self.remark.filter(function(item) {
      //     return params.remarkCd === item.REMARK_CD
      //   })
      //
      //   console.log(remark)
      //   if (remark.length > 0) {
      //     remark[0].REMARK_CONTENTS = params.remarkContent
      //   } else {
      //     var obj = {
      //       REMARK_CD: params.remarkCd,
      //       REMARK_CONTENTS: params.remarkContent
      //     }
      //     self.remark.push(obj)
      //   }
      // })

      this.EventBus.$on('REMOVE_SKMC_RESULT_CD', function() {
        console.log('REMOVE_SKMC_RESULT_CD')
        console.log(self.overallResultCd)

        ipcRenderer.send(Constant.REMOVE_SKMC_RESULT_CD, JSON.stringify({resultCd: self.overallResultCd}))
        self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })
        setTimeout(function() {
          ipcRenderer.send(Constant.GET_SKMC_RESULT_CD, null)
        }, 300)
      })

      this.EventBus.$on('REMARK_SELECTED', function(selectedRemarkList) {
        console.log(selectedRemarkList)
        console.log(self.remarkContents)

        selectedRemarkList.forEach(function(selectItem) {
          var contents = selectItem.REMARK_CONTENTS.split('\n')
          console.log(contents)

          for (var i = 0; i < contents.length; i++) {
            if (contents[i] !== '') {
              var obj = {
                remarkCd: selectItem.REMARK_CD,
                text: contents[i]
              }

              self.remarkContents.push(obj)
            }
          }
        })

        console.log(self.remarkContents)

      })

      this.EventBus.$on('UPLOAD_LIS_SKMC', function(params) {
        console.log('UPLOAD_LIS_SKMC')
        console.log(self.remarkContents)

        // rbc
        var rbcSize = self.rbcSizeOptions.filter(function(item) {
          return self.rbcSize === item.value
        })

        var rbcChromia = self.rbcChromiaOptions.filter(function(item) {
          return self.rbcChromia === item.value
        })

        // wbc
        var wbcNumber = self.wbcNumberOptions.filter(function(item) {
          return self.wbcNumber === item.value
        })

        var nSegmentation = self.nSegmentationOptions.filter(function(item) {
          return self.nSegmentation === item.value
        })

        // plt
        var plateletNumber = self.plateletNumberOptions.filter(function(item) {
          return self.plateletNumber === item.value
        })

        console.log(self.skmcLisResult)

        var morphologys = self.skmcLisResult.filter(function(item) {
          return item.I01ATCD.trim() !== '' && item.I01YYCD.trim() !== ''
        })

        console.log(morphologys)
        if (morphologys.length > 0) {
          var tmplist = []
          morphologys.forEach(function(item) {
            var tmpObj = {}

            if (item.I01ATCD.trim() === '00') {
              tmpObj.gsCd = item.I01GSCD
              tmpObj.atCd = item.I01ATCD
              tmpObj.morphologyData = []

              tmplist.push(tmpObj)
            }
          })

          // rbc morphology
          tmplist[0].morphologyData[0] = { atCd: '01', value: rbcSize[0].text }
          tmplist[0].morphologyData[1] = { atCd: '02', value: rbcChromia[0].text }
          tmplist[0].morphologyData[2] = { atCd: '03', value: self.getDegreeText(self.anisocytosis) }
          tmplist[0].morphologyData[3] = { atCd: '04', value: self.getDegreeText(self.poikilocytosis) }
          tmplist[0].morphologyData[4] = { atCd: '05', value: self.getDegreeText(self.elliptocyte) }
          tmplist[0].morphologyData[5] = { atCd: '06', value: self.getDegreeText(self.buurCell) }
          tmplist[0].morphologyData[6] = { atCd: '07', value: self.getDegreeText(self.targetCell) }
          tmplist[0].morphologyData[7] = { atCd: '08', value: self.getDegreeText(self.spherocyte) }
          tmplist[0].morphologyData[8] = { atCd: '09', value: self.getDegreeText(self.schistocyte) }
          tmplist[0].morphologyData[9] = { atCd: '10', value: self.getDegreeText(self.dimorphism) }
          tmplist[0].morphologyData[10] = { atCd: '11', value: self.getDegreeText(self.rouleaux) }
          tmplist[0].morphologyData[11] = { atCd: '12', value: self.getDegreeText(self.polychromasia) }
          tmplist[0].morphologyData[12] = { atCd: '13', value: self.getDegreeText(self.baso) }
          tmplist[0].morphologyData[13] = { atCd: '14', value: self.getDegreeText(self.hjBody) }
          tmplist[0].morphologyData[14] = { atCd: '15', value: self.nucleatedRbc }
          tmplist[0].morphologyData[15] = { atCd: '16', value: self.rbcOthers }

          // wbc morphology
          tmplist[1].morphologyData[0] = { atCd: '01', value: wbcNumber[0].text }
          tmplist[1].morphologyData[1] = { atCd: '02', value: self.getDegreeText(self.wbcTocxicgranule) }
          tmplist[1].morphologyData[2] = { atCd: '03', value: self.getDegreeText(self.wbcTocxicVacuole) }
          tmplist[1].morphologyData[3] = { atCd: '04', value: self.getDegreeText(self.wbcDohleBody) }
          tmplist[1].morphologyData[4] = { atCd: '05', value: self.getDegreeText(self.wbcLsMaturation) }
          tmplist[1].morphologyData[5] = { atCd: '06', value: nSegmentation[0].text }
          tmplist[1].morphologyData[6] = { atCd: '07', value: self.wbcOthers }

          // plt morphology
          tmplist[2].morphologyData[0] = { atCd: '01', value: plateletNumber[0].text }
          tmplist[2].morphologyData[1] = { atCd: '02', value: self.getDegreeTextPlt(self.plateletSize) }
          tmplist[2].morphologyData[2] = { atCd: '03', value: self.getDegreeTextPlt(self.clumping) }

          console.log(tmplist)

          var params = {
            barcodeNo: self.selectedItem.BARCODE_NO,
            remark: self.remarkContents,
            yyCd: morphologys[0].I01YYCD,
            morphologys: tmplist
          }

          console.log(self.remarkContents)
          self.EventBus.$emit('UPLOAD_LIS_SKMC_SEND', params)
          self.$emit('close')
        } else {
          self.$toasted.show('morphologys not found.', {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      })
    },
    data () {
      return {
        wbcOthers: '',
        rbcOthers: '',
        nucleatedRbc: 0,
        overallResultCd: '00',
        overallResultCdOptions: [],
        overallResultCdOptionsOrg: [],
        rbcSize: '01',
        rbcSizeOptions: [
          { value: '01', text: 'microcytic' },
          { value: '02', text: 'normocytic' },
          { value: '03', text: 'macrocytic' }
        ],
        rbcChromia: '01',
        rbcChromiaOptions: [
          { value: '01', text: 'hypochromic' },
          { value: '02', text: 'normochromic' },
          { value: '03', text: 'hyperchromic' }
        ],
        anisocytosis: '00',
        poikilocytosis: '00',
        elliptocyte: '00',
        buurCell: '00',
        targetCell: '00',
        spherocyte: '00',
        schistocyte: '00',
        dimorphism: '00',
        rouleaux: '00',
        polychromasia: '00',
        baso: '00',
        hjBody: '00',
        wbcNumber: '01',
        wbcNumberOptions: [
          { value: '01', text: 'normal' },
          { value: '02', text: 'decreased' },
          { value: '03', text: 'increased' }
        ],
        wbcTocxicgranule: '00',
        wbcTocxicVacuole: '00',
        wbcDohleBody: '00',
        wbcLsMaturation: '00',
        nSegmentation: '01',
        nSegmentationOptions: [
          { value: '01', text: 'normal' },
          { value: '02', text: 'hypersegmented' },
          { value: '03', text: 'hyposegmented' }
        ],
        plateletNumber: '01',
        plateletNumberOptions: [
          { value: '01', text: 'normal' },
          { value: '02', text: 'decreased' },
          { value: '03', text: 'increased' }
        ],
        plateletSize: '00',
        clumping: '00',
        degreeOptions: [
          { value: '00', text: '-' },
          { value: '01', text: 'trace' },
          { value: '02', text: '1+' },
          { value: '03', text: '2+' },
          { value: '04', text: '3+' },
          { value: '05', text: '4+' }
        ],
        pltDegreeOptions: [
          { value: '00', text: '-'},
          { value: '01', text: '1+'},
          { value: '02', text: '2+'},
          { value: '03', text: '3+'}
        ],
        remarkContents: [],
        inputMaxByte: 80,
        keyIndex: 0,
        addRemarkCd: 'ADD',
        searchText: '',
        focusRemark: '',
        isSelectText: false
      }
    },
    methods: {
      onSelectText (evt) {
        console.log(evt)
        this.isSelectText = true
      },
      onFocusInput (evt, index) {
        console.log(evt)
        console.log(this.remarkContents[index])

        this.focusRemark = this.remarkContents[index].text
      },
      onClickInput (evt, index) {
        console.log(evt)
        console.log(this.remarkContents)
        console.log(index)

        var self = this

        if (evt.code === 'Insert') {
          var obj = {
            remarkCd: this.remarkContents[index].remarkCd,
            seqNo: '',
            text: ''
          }
          self.remarkContents.splice(index + 1, 0, obj)

        } else if (evt.ctrlKey && evt.code === 'KeyD') {
          self.remarkContents.splice(index, 1)

        } else if (evt.code === 'KeyC') {
          if (!self.isSelectText) {
            if (evt.ctrlKey) {
              const copyText = document.getElementById('focusRemark')
              copyText.setAttribute('type', 'text')
              copyText.select()

              try {
                var successful = document.execCommand('copy')
                copyText.setAttribute('type', 'hidden')
                var msg = successful ? 'successful' : 'unsuccessful'

                self.$toasted.show('remark was copied ' + msg, {
                  position: 'bottom-center',
                  duration: '2000'
                })

              } catch (err) {
                copyText.setAttribute('type', 'hidden')
                // self.$toasted.show('unable to copy', {
                //   position: 'bottom-center',
                //   duration: '2000'
                // })
              }

              console.log(copyText)
            }
          } else {
            self.isSelectText = false
          }
        }

        self.remarkContents.forEach(function(item, index) {
          item.seqNo = '' + (index + 1)
        })

        console.log(self.remarkContents)
      },
      onChangeInput (remark) {
        console.log(remark)
        console.log(this.remarkContents)
        var result = this.$getLimitedByteText(remark.text, this.inputMaxByte)

        remark.text = result.validText
        if (result.totalByte >= 80) {
          this.keyIndex = (this.keyIndex + 1) * this.remarkContents.length
          this.$toasted.show('max row data', {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      },
      onAddRemarkRow () {
        var obj = {
          remarkCd: this.addRemarkCd,
          text: ''
        }

        this.remarkContents.push(obj)

        // this.$modal.show(ModalSkmcModifyRemark, {}, {
        //   height: '400px',
        //   width: '500px'
        // })
      },
      onEditRemark (remarkItem) {
        console.log('onEditRemark')
        console.log(remarkItem)

        this.$modal.show(ModalSkmcModifyRemark, {remark: remarkItem}, {
          height: '400px',
          width: '500px'
        })
      },
      onChangeResultCd (item) {
        console.log('onChangeResultCd')

        this.overallResultCd = item.value
        this.searchText = item.text

        ipcRenderer.send(Constant.GET_SKMC_FAVORITE, JSON.stringify({resultCd: this.overallResultCd}))

      },
      onAddResultCd () {
        console.log('onAddResultCd')
        this.$modal.show(ModalSkmcAddResultCd, {codes: this.overallResultCdOptions}, {
          height: 'auto',
          width: '350px'
        })

      },
      onRemoveResultCd () {
        console.log('onRemoveResultCd')
        if (this.overallResultCd === '00') {
          this.$toasted.show('Please select a result code.', {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          this.$modal.show(ModalConfirm, {openType: 'removeSkmcResultCd', message: 'Do you want to delete the overall result code?'}, {
            height: 'auto',
            width: '350px'
          })
        }
      },
      groupBy (data, key) {
        return data.reduce(function (carry, el) {
          var group = el[key]

          if (carry[group] === undefined) {
            carry[group] = []
          }

          carry[group].push(el)
          return carry
        }, {})
      },
      onResultSave () {
        console.log('onResultSave')
        var self = this

        if (this.overallResultCd === '00') {
          this.$toasted.show('Please select a result code.', {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          console.log(self.remarkContents)

          // self.remark.forEach(function(remarkItem) {
          //   var tmpObj = {}
          //   tmpObj.REMARK_CD = remarkItem.REMARK_CD
          //
          //   var listTmp = self.remarkContents.filter(function(contentsItem) {
          //     return remarkItem.REMARK_CD === contentsItem.remarkCd
          //   })
          //
          //   var text = ''
          //   console.log(listTmp)
          //   if (typeof(listTmp) !== 'undefined') {
          //     listTmp.forEach(function(tmpItem) {
          //       text += tmpItem.text + '\n'
          //     })
          //   }
          //   tmpObj.REMARK_CONTENTS = text
          //   remarkList.push(tmpObj)
          // })

          // var groupList = []
          // groupList = this.groupBy(this.remarkContents, 'remarkCd')
          //
          // var remarkCdTmp = ''
          // var remarkTextTmp = ''
          // var resultList = []
          // var obj = {}
          //
          // this.remarkContents.forEach(function(contentItem, index) {
          //   if (remarkCdTmp !== contentItem.remarkCd) {
          //     remarkCdTmp = contentItem.remarkCd
          //     remarkTextTmp += contentItem.text + '\n'
          //
          //     if (remarkCdTmp !== '') {
          //
          //     }
          //   } else {
          //     remarkTextTmp += contentItem.text + '\n'
          //   }
          // })
          //
          // console.log(groupList)
          // var remarkList = []

          var params = {
            resultCd: this.overallResultCd,
            rbcSize: this.rbcSize,
            rbcChromia: this.rbcChromia,
            anisocytosis: this.anisocytosis,
            poikilocytosis: this.poikilocytosis,
            elliptocyte: this.elliptocyte,
            buurCell: this.buurCell,
            targetCell: this.targetCell,
            spherocyte: this.spherocyte,
            schistocyte: this.schistocyte,
            dimorphism: this.dimorphism,
            rouleaux: this.rouleaux,
            polychromasia: this.polychromasia,
            baso: this.baso,
            hjBody: this.hjBody,
            nucleatedRbc: this.nucleatedRbc,
            rbcOthers: this.rbcOthers,
            wbcNumber: this.wbcNumber,
            wbcTocxicgranule: this.wbcTocxicgranule,
            wbcTocxicVacuole: this.wbcTocxicVacuole,
            wbcDohleBody: this.wbcDohleBody,
            wbcLsMaturation: this.wbcLsMaturation,
            nSegmentation: this.nSegmentation,
            wbcOthers: this.wbcOthers,
            plateletNumber: this.plateletNumber,
            plateletSize: this.plateletSize,
            clumping: this.clumping,
            remark: this.remarkContents,
            userId: this.currentUser.userId
          }

          console.log(params)
          console.log(this.remarkContents)

          ipcRenderer.send(Constant.SET_SKMC_FAVORITE, JSON.stringify(params))
          setTimeout(function() {
            self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
              position: 'bottom-center',
              duration: '2000'
            })
          }, 500)
        }
      },
      getDegreeText(srcData) {
        var result = this.degreeOptions.filter(function(item) {
          return srcData === item.value
        })

        return result[0].text
      },
      getDegreeTextPlt(srcData) {
        var result = this.pltDegreeOptions.filter(function(item) {
          return srcData === item.value
        })

        return result[0].text
      },
      onOk (evt) {
        var self = this
        this.$modal.show(ModalConfirm, {openType: 'lisUploadSkmc', message: Constant.IDS_MSG_UPLOAD_LIS}, {
          height: 'auto',
          width: '350px'
        })

        // this.$emit('close')
      },
      onCancel (evt) {
        this.$emit('close')
      },
      onSelectRemark (evt) {
        this.$modal.show(ModalSkmcRemark, {}, {
          height: '900',
          width: '800px'
        })
      },
      onDeleteRemark (evt) {
        this.remarkContents = []
      }
    }
  }
</script>

<style>
  .modalTitle {
    padding: 10px;
  }
</style>
