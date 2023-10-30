<template>
  <b-container id="report" class="pl-0 h-100" fluid>
    <b-row style="height: 4%; padding-bottom: 5px;">
      <b-col>
        <!-- 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 -->
        <b-icon v-if="siteCd !== '0007'" class="ml-2 pointer" icon="printer" font-scale="1.5" @click="onClickPrint"
          v-b-tooltip.hover title="print a report"></b-icon>
        <b-icon class="ml-2 pointer" icon="file-earmark-arrow-up" font-scale="1.5" @click="onClickLisUpload"
          v-b-tooltip.hover title="upload to lis (F9)"></b-icon>
      </b-col>
    </b-row>
    <!-- 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 -->
    <b-row v-if="siteCd !== '0007'" id="printRoot" style="height: 855px;">
      <b-col class="p-0 h-100">
        <b-card class="blackCard h-100 pl-3 pr-3" text-variant="white" no-body>
          <b-row style="border-bottom: 1px dashed gray;">
            <b-col class="p-0" cols="2">
              <span>&nbsp&nbsp&nbsp&nbsp &#60; Hospital &#62;</span>
            </b-col>
            <b-col class="p-0" style="text-align: center; margin-right: 100px;">
              <span>DM Serial Nbr : {{ serialNo }}</span>
            </b-col>
          </b-row>
          <div id="printSection">
            <b-row>
              <b-col id="reportBody" class="reportBody" style="overflow-y: auto; overflow-x: hidden; height: 730px;">
                <div id="reportTitle" class="pt-3 pb-5" style="text-align: center; color: white; font-size: 20px;">
                  <span>Analysis Report from UIMD PB system</span>
                </div>
                <div id="reportContent">
                  <b-row>
                    <b-col class="pl-4">
                      <span>Slot ID</span>
                    </b-col>
                    <b-col>
                      <span>{{ orderId }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="mt-4">
                    <b-col class="pl-4">
                      <span>Ordered date</span>
                    </b-col>
                    <b-col>
                      <span>{{$stringToDateTime(selectedItem.ORDER_DTTM)}}</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>Signed by ID</span>
                    </b-col>
                    <b-col>
                      <span> {{ selectedItem.SIGNED_USER_ID }} </span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>Signed date</span>
                    </b-col>
                    <b-col>
                      <span>{{$stringToDateTime(selectedItem.SIGNED_DTTM)}}</span>
                    </b-col>
                  </b-row>
                  <b-row class="mt-4">
                    <b-col class="pl-4">
                      <span>Patient ID</span>
                    </b-col>
                    <b-col>
                      <span> {{ selectedItem.PATIENT_ID }} </span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>>Ordered Classification</span>
                    </b-col>
                    <b-col>
                      <span v-if="selectedItem.TEST_TYPE === '01'">PB standard</span>
                      <span v-if="selectedItem.TEST_TYPE === '02'">Body fluid default</span>
                      <span v-if="selectedItem.TEST_TYPE === '03'">Body fluid select</span>
                      <span v-if="selectedItem.TEST_TYPE === '04'">PB premium</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>>Name</span>
                    </b-col>
                    <b-col>
                      <span>{{ selectedItem.PATIENT_NM }}</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>>Birth</span>
                    </b-col>
                    <b-col>
                      <span>{{ $stringToDate(selectedItem.BIRTHDAY) }}</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>>Gender</span>
                    </b-col>
                    <b-col>
                      <span v-if="selectedItem.GENDER === '01'">Male</span>
                      <span v-else-if="selectedItem.GENDER === '02'">Female</span>
                      <span v-else></span>
                    </b-col>
                  </b-row>
                  <b-row class="mt-3">
                    <b-col class="pl-4" v-if="selectedItem.TEST_TYPE === '01' || selectedItem.TEST_TYPE === '04'">
                      <div>RBC classification result</div>
                      <b-row v-if="item.CATEGORY_ID !== '04'" v-for="item in rbcInfo" :key="item.classId">
                        <b-col cols="3">>{{ item.CATEGORY_NM }}</b-col>
                        <b-col>{{ item.CLASS_NM }}</b-col>
                        <b-col class="text-right">
                          {{ item.DEGREE }}+
                        </b-col>
                      </b-row>
                      </br>
                      <b-row>
                        <b-col cols="3">>Others</b-col>
                        <b-col>Platelets</b-col>
                        <b-col cols="5" class="text-right">{{ selectedItem.PLT_COUNT }} PLT / 1000 RBC</b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="3"></b-col>
                        <b-col>Malaria</b-col>
                        <b-col class="text-right">{{ selectedItem.MALARIA_COUNT }} / {{selectedItem.MAX_RBC_COUNT}} RBC</b-col>
                      </b-row>
                      <b-row class="mt-2">
                        <b-col>
                          <div>Comment</div>
                          <div>>{{ selectedItem.RBC_COMMENT }}</div>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col>
                      <div>WBC classification result</div>
                      <b-row v-if="(item.id !== '12' && item.id !== '13' &&
                        item.id !== '14' && item.id !== '15' &&
                        item.id !== '16') && item.count > 0" v-for="item in wbcInfo" :key="item.id">
                        <b-col cols="5">>{{ item.name }}</b-col>
                        <b-col class="text-center">{{ item.count }}</b-col>
                        <b-col class="text-right">{{ item.percent }} %</b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="5">>Total count</b-col>
                        <b-col class="text-center">{{ wbcTotalCount }}</b-col>
                        <b-col class="text-right">100.00%</b-col>
                      </b-row>
                      <b-row class="mt-2" v-if="(item.id === '12' || item.id === '13' ||
                        item.id === '14' || item.id === '15' ||
                        item.id === '16') && item.count > 0" v-for="item in wbcInfo" :key="item.id">
                        <b-col cols="5">>{{ item.name }}</b-col>
                        <b-col class="text-center">
                          {{ item.count }}
                          <span v-if="item.id === '12' || item.id === '13'"> / {{ maxWbcCount }} WBC</span>
                        </b-col>
                        <b-col></b-col>
                      </b-row>
                      <b-row class="mt-2">
                        <b-col>
                          <div>Comment</div>
                          <div>>{{ selectedItem.WBC_COMMENT }}</div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </div>
                <div class="mt-3">
                  <b-button size="sm" class="w-100" id="btnCommit" variant="outline-light" @click="onCommit">Confirm</b-button>
                </div>

                <div class="mt-3" v-if="item.images.length > 0" v-for="item in drawClassList" :key=item.title>
                  <div class="colorWhite" style="font-size: 15px; width: 150px; border-bottom: 2px solid #09CBFC;">
                    {{ item.name }}
                  </div>
                  <b-row class="mt-2">
                    <b-col cols="3" class="mt-2" v-for="(image, index) in item.images" :key="index">
                      <img :src="image" style="width: 185px;">
                    </b-col>
                  </b-row>
                </div>
                <div class="mt-3" v-for="(item, index) in rbcImages" :key=index>
                  <img :src="item" style="width: 100%;">
                </div>
              </b-col>
            </b-row>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <!-- 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 -->
    <b-row v-else style="height: 855px;">
      <b-col class="p-0">
        <b-card class="blackCard h-100 pl-3 pr-3" text-variant="white" no-body>
          <b-row class="pt-3">
            <b-col cols="3">
              <strong>종합결과코드</strong>
            </b-col>
            <b-col>
              <b-input-group size="sm">
                <b-form-input
                  size="sm"
                  placeholder="search"
                  autocomplete="off"
                  v-model="searchText"
                  @focus="onFocusDataList"
                  @blur="onFocusOutDataList"
                  @keyup.enter="onEnterResultCd"
                  @keydown.up="onKeyUp"
                  @keydown.down="onKeyDown"
                ></b-form-input>
                <div class="searchFrame skmcSearch" v-show="inputFocus" ref="scrollCdContainer">
                  <div
                    class="dataOptions"
                    v-for="(resultItem, index) in overallResultCdOptions"
                    :key="index"
                    :value="resultItem.text"
                    :class="{active:index===selectedCd}"
                    @click="onChangeResultCd(resultItem)"
                    ref="cdOption"
                    >
                    {{resultItem.text}}
                  </div>
                </div>
                <!-- <template #append>
                  <b-dropdown size="sm"
                    ref="dropdown"
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
                </template> -->
              </b-input-group>
            </b-col>

            <b-col cols="1">
              <b-button class="custom-blue-btn" @click="onResultSave" size="sm">Save</b-button>
            </b-col>
            <b-col class="text-right pt-1" cols="2">
              <b-icon class="pointer" icon="plus-circle" @click="onAddResultCd"></b-icon>
              <b-icon class="pointer" icon="dash-circle" @click="onRemoveResultCd"></b-icon>
            </b-col>
          </b-row>

          <!-- RBC morphology -->
          <b-row class="mt-2 pl-2 pr-2">
            <b-col class="text-center colorWhite border">
              <strong>RBC morphology</strong>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col>
              <b-row>
                <b-col class="fontSize14 pt-1">
                  <div @click="onCopySize">Size</div>
                </b-col>
                <b-col>
                  <b-form-select class="inputCustom" v-model="rbcSize" size="sm" :options="rbcSizeOptions"
                  ></b-form-select>
                </b-col>
              </b-row>
              <b-row class="mt-1">
                <b-col class="fontSize14 pt-1">
                  <div @click="onCopyChrom">Chromicity</div>
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

          <!-- WBC morphology -->
          <b-row class="mt-2">
            <b-col>
              <b-row class="pl-2">
                <b-col class="text-center colorWhite border">
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
              <b-row class="pr-2">
                <b-col class="text-center colorWhite border">
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
                <!-- **************수정-->
              <b-row class="mt-4">
                <b-col>
                  <strong>리마크 선택</strong>
                </b-col>
                <b-col>
                  <b-input-group size="sm">
                    <b-form-input
                      size="sm"
                      placeholder="Remark"
                      autocomplete="off"
                      v-model="searchRemark"
                      @focus="onFocusDataRemark"
                      @blur="onFocusOutDataRemark"
                      @keyup.enter="onEnterRemark"
                      @keydown.up="onKeyUpRemark"
                      @keydown.down="onKeyDownRemark"
                      ref="remarkInput"
                    ></b-form-input>
                    <div class="searchFrame remarkSearch" v-show="inputFocusRemark" ref="scrollContainer">
                      <div
                        class="dataRemarkOptions"
                        v-for="(opt,i) in remarkOptions"
                        :key="i"
                        :value="opt.title"
                        :class="{active:i===selectedOption}"
                        @mouseenter="onMouseEnter(i)"
                        @click="onChangeRemarkCd(opt)"
                        ref="option"
                      >
                        {{opt.title}}
                      </div>
                    </div>
                  </b-input-group>

                  <!-- <b-button class="custom-blue-btn w-100 mt-2" @click="onSelectRemark" size="sm">Select remark</b-button>
                  <b-button class="custom-blue-btn w-100 mt-2" @click="onDeleteRemark" size="sm">Delete remark</b-button> -->

                </b-col>
                <b-col class="text-left pt-1" cols="2">
                  <b-icon class="pointer" icon="folder2-open" @click="onSelectRemark"></b-icon>
                  <!-- <b-icon class="pointer" icon="dash-circle" @click="onDeleteRemark"></b-icon> -->
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <!-- remark -->
          <b-row class="mt-2 pl-2 pr-2">
            <b-col class="text-center colorWhite border">
              <strong>Remark</strong>
            </b-col>
          </b-row>
          <b-row style="height: 165px; overflow-y: scroll;" ref="remarkContainer">
            <b-col class="pointer pl-2 pr-2">
              <b-form-input type="text"
                :id="'remark' + index"
                v-for="remarkItem, index in remarkContents" :key="keyIndex + index"
                v-model="remarkItem.text" @input="onChangeInput(remarkItem)"
                size="sm"
                @keyup="onClickInput($event, index)"
                @focus="onFocusInput($event, index)"
                @select="onSelectText"
                style="font-size: 12px;"
                @keydown="onPaste($event, index)"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <input type="hidden" id="focusRemark" :value="focusRemark">
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
  import ModalPrint from '../../../Common/ModalPrint.vue'
  import ModalConfirm from '../../../Common/ModalConfirm'
  import ModalReportSign from '../../../Common/ModalReportSign'
  import Constant from '../../../../../Constant'
  import { mapGetters } from 'vuex'
  import api from '@/service'
  import Configs from '../../../../../Configs'
  // import ModalSkmcMorphology from '../../../Common/ModalSkmcMorphology'
  import ModalSkmcAddResultCd from '../../../Common/ModalSkmcAddResultCd'
  import ModalSkmcModifyRemark from '../../../Common/ModalSkmcModifyRemark'
  import ModalSkmcRemark from '../../../Common/ModalSkmcRemark'
  import lodash from 'lodash'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')
  const convert = require('xml-js')
  const hl7 = require('simple-hl7')
  // const hl7Tcp = hl7.tcp()
  // const hl7File = hl7.file()

  export default {
    name: 'report',
    computed: {
      ...mapGetters({
        orderId: Constant.GET_SELECT_ORDER_ID,
        settings: Constant.GET_SETTINGS,
        classList: Constant.GET_WBC_CLASS_LIST,
        bfClassList: Constant.GET_BF_WBC_CLASS_LIST,
        currentUser: Constant.GET_CURRENT_USER,
        siteCd: Constant.GET_SITE_CD,
        deviceBarcode: Constant.GET_DEVICE_BARCODE,
        rbcPrintState: Constant.GET_RBC_REPORT_PRINT,
        rbcInfo: Constant.GET_CURRENT_RBC_RESULTS,
        skmcLisResult: Constant.GET_SKMC_LIS_RESULTS
      })
    },
    props: ['paramItem'],
    watch: {
      // mapping IA data
      rbcInfo: function(newVal, oldVal) {
        console.log('change rbcInfo')
        console.log(newVal)
        var self = this

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

        self.rbcInfo.forEach(function(rbcItem) {
          var degree = '00'

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
      },
      // 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동
      searchText: function(newVal, oldVal) {
        console.log(newVal, oldVal)
        var self = this

        console.log(self.overallResultCdOptions)
        self.overallResultCdOptions = self.overallResultCdOptionsOrg.filter(function(codeItem) {
          return codeItem.text.substr(0, newVal.length).toLowerCase() === newVal.toLowerCase()
        })

        if (self.overallResultCdOptions.length > 0) {
          self.selectedCd = 0;
          self.onScrollCdOption();
        } else {
          self.selectedCd = -1;
        }

        self.inputFocus = true
      },
      //리마크
      searchRemark:function(newVal, oldVal){
        console.log(newVal,oldVal)

        var self = this
        console.log(self.remarkOptions)

        self.remarkOptions=self.remarkOptionsOrg.filter(function(codeItem){
          return codeItem.title.substr(0, newVal.length).toLowerCase() === newVal.toLowerCase()
        })

        if (self.remarkOptions.length > 0) {
          self.selectedOption = 0;
          self.onScrollOption();
        } else {
          self.selectedOption = -1;
        }

        self.inputFocusRemark = true

      },
      orderId: function (newVal, oldVal) {
        console.log(newVal, oldVal)
      },
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        this.serialNo = this.selectedItem.SERIAL_NO
        this.maxWbcCount = this.selectedItem.MAX_WBC_COUNT

        ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
      }
    },
    beforeDestroy () {
      this.EventBus.$off('WBC_CLASSIFICATION_LOADED')
      // this.EventBus.$off('UPLOAD_LIS')
      this.EventBus.$off(Constant.UPDATE_RBC_COMMENT)
      this.EventBus.$off(Constant.UPDATE_WBC_COMMENT)

      // ipcRenderer.removeAllListeners(Constant.SELECT_EMP_NO)
      // ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)
      // ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CONN_PATH)

      // 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 [
      ipcRenderer.removeAllListeners(Constant.GET_SKMC_RESULT_CD)
      ipcRenderer.removeAllListeners(Constant.GET_SKMC_FAVORITE)
      ipcRenderer.removeAllListeners(Constant.GET_SKMC_REMARK)

      this.EventBus.$off('REMOVE_SKMC_RESULT_CD')
      this.EventBus.$off('REMARK_SELECTED')
      this.EventBus.$off('UPLOAD_LIS_SKMC')
      // 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 ]

    },
    data () {
      return {
        copied:'',
        pasted:'',
        selectedItem: [],
        // rbcInfo: [],
        wbcInfo: [],
        wbcTotalCount: 0,
        serialNo: '',
        reportPrintList: [],
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        drawClassList: [],
        maxWbcCount: 0,
        wbcCustomClass: [],
        empNo: '',
        lisConnObj: null,
        rbcImages: [],
        // 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 [
        wbcOthers: '',
        rbcOthers: '',
        nucleatedRbc: 0,
        overallResultCd: '00',
        overallResultCdOptions: [],
        overallResultCdOptionsOrg: [],
        remarkOptions:[],
        remarkOptionsOrg:[],
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
        searchRemark:'',
        focusRemark: '',
        isSelectText: false,
        inputFocus: false,
        inputFocusRemark : false,
        // 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 ]
        selectedCd:-1,
        selectedOption:-1,
      }
    },
    mounted () {
      var self = this
      console.log('report mount-')
      this.reportPrintList = this.settings.modelWbcReportPrint

      console.log(this.rbcPrintState)


      // 밑의 코드 추가 안 하면 안 뜸
      ipcRenderer.send(Constant.GET_SKMC_REMARK, null)

      ipcRenderer.send(Constant.GET_SKMC_RESULT_CD, null)

      // 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 [
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

      this.EventBus.$on('REMARK_SELECTED', function(selectedRemarkList) {
        console.log(selectedRemarkList)

        selectedRemarkList.forEach(function(selectItem) {
          var contents = selectItem.REMARK_CONTENTS.split('\n')

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
      })

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

        if (self.remarkContents) {
          self.remarkContents.sort(function(a, b) {
            return Number(a.seqNo) - Number(b.seqNo)
          })
        }
      })

      //******db에서 데이터 받아오려고 추가 */
      ipcRenderer.on(Constant.GET_SKMC_REMARK, function(event,results){
        console.log("-----------------------")
        console.log("-----------------------")
        console.log("-----------------------")
        console.log(results);

        if (results) {
          // 초기화 목적 -> 이거 아니면 데이터 중복돼서 쌓임
          self.remarkOptions=[]

          results.forEach(function(item) {
            self.remarkOptions.push({title:item.REMARK_CD, content:item.REMARK_CONTENTS})
          })

          self.remarkOptionsOrg = self.remarkOptions
        }
      })

      ipcRenderer.on(Constant.GET_SKMC_RESULT_CD, function (event, result) {
        console.log(result)

        self.overallResultCdOptions = []

        result.forEach(function(item) {
          self.overallResultCdOptions.push({value: item.RESULT_CD, text: item.RESULT_CD_NM})
        })

        self.overallResultCdOptionsOrg = self.overallResultCdOptions

        console.log(self.overallResultCdOptions)
      })
      // 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 ]

      // custom class
      ipcRenderer.on(Constant.SELECT_WBC_CUSTOM_CLASS, function (event, result) {
        self.wbcCustomClass = result
      })

      // lis code
      // ipcRenderer.on(Constant.SELECT_LIS_CODE, function (event, result) {
      //   console.log(result)
      //   console.log(self.wbcInfo)
      //
      //   // 고대 안암
      //   if (self.siteCd === '0006') {
      //     if (self.lisConnObj !== null) {
      //       var data = 'H|\^&||||||||||P||' + self.selectedItem.BARCODE_NO + '\n'
      //
      //       var seq = 0
      //       result.forEach(function(lisCode) {
      //         if (lisCode.LIS_CD !== '') {
      //           self.wbcInfo.forEach(function(wbcItem) {
      //             if (wbcItem.id === lisCode.IA_CD) {
      //               if (Number(wbcItem.percent) > 0 || Number(wbcItem.count) > 0) {
      //                 // count
      //                 data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '|' + wbcItem.count + '|||||||^' + self.currentUser.userId + '\n'
      //
      //                 // percent
      //                 data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '%|' + wbcItem.percent + '|%||||||^' + self.currentUser.userId + '\n'
      //               }
      //             }
      //           })
      //         }
      //       })
      //
      //       data += 'L|1|N'
      //       console.log(data)
      //       console.log(self.lisConnObj)
      //
      //       // file
      //       if (self.lisConnObj.LIS_CONN_TYPE_CD === '01') {
      //         // create directory
      //         !fs.existsSync(self.lisConnObj.LIS_FILE_PATH + '/') && fs.mkdirSync(self.lisConnObj.LIS_FILE_PATH)
      //
      //         fs.writeFile(self.lisConnObj.LIS_FILE_PATH + '/' + self.selectedItem.BARCODE_NO + '.lst2msg', data, function(err) {
      //           if (err) {
      //             console.log(err)
      //             self.$toasted.show(err.message, {
      //               position: 'bottom-center',
      //               duration: '2000'
      //             })
      //           } else {
      //             self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
      //               position: 'bottom-center',
      //               duration: '2000'
      //             })
      //           }
      //
      //           self.EventBus.$emit('OVERLAY', {state: false})
      //         })
      //       } else if (self.lisConnObj.LIS_CONN_TYPE_CD === '02') { // URL
      //         self.sendLisMessage(data)
      //       }
      //
      //     } else {
      //       self.$toasted.show(Constant.IDS_MSG_FAILED, {
      //         position: 'bottom-center',
      //         duration: '2000'
      //       })
      //
      //       self.EventBus.$emit('OVERLAY', {state: false})
      //     }
      //   } else {
      //     if (self.lisConnObj !== null) {
      //       // create directory
      //       !fs.existsSync(self.lisConnObj.LIS_FILE_PATH) && fs.mkdirSync(self.lisConnObj.LIS_FILE_PATH)
      //
      //       var client = hl7.Server.createFileClient(self.lisConnObj.LIS_FILE_PATH)
      //       // var parser = new hl7.Parser({segmentSeperator: '\n'})
      //       // var msg = parser.parseFileSync('test/samples/adt.hl7')
      //
      //       var msg = new hl7.Message(
      //         'PBIA',                           // sending application
      //         'PBIA',                           // sending facility
      //         'LIS',                            // receiving application
      //         'LIS',                            // receiving facility
      //         self.$getDateTimeStr(),           // date/time of message
      //         '',                               // security
      //         ['ADT', 'R02'],                   // message type : This field has 2 components
      //         self.selectedItem.BARCODE_NO,     // message control ID : file name
      //         'P',                              // Processing ID
      //         '2.5\n'                             // HL7 version ID
      //         //Keep adding fields
      //       )
      //
      //       var seq = 0
      //       result.forEach(function(lisCode) {
      //         if (lisCode.LIS_CD !== '') {
      //           self.wbcInfo.forEach(function(wbcItem) {
      //             if (wbcItem.id === lisCode.IA_CD) {
      //               if (Number(wbcItem.percent) > 0 || Number(wbcItem.count)) {
      //                 msg.addSegment(
      //                   'OBX',                // ID
      //                   seq++,                // sequence
      //                   'NM',                 // value type
      //                   lisCode.LIS_CD,       // observation identifier
      //                   '',                   // observation Sub-ID
      //                   wbcItem.count,        // observation Value
      //                   '',                   // units
      //                   '',                   // references range
      //                   '',                   // abnormal flags
      //                   '',                   // probability
      //                   '',                   // nature of abnormal test
      //                   'P\n'                   // observation result status
      //                 )
      //
      //                 // percent
      //                 msg.addSegment(
      //                   'OBX',                // ID
      //                   seq++,                // sequence
      //                   'NM',                 // value type
      //                   lisCode.LIS_CD + '%', // observation identifier
      //                   '',                   // observation Sub-ID
      //                   wbcItem.percent,      // observation Value
      //                   '%',                  // units
      //                   '',                   // references range
      //                   '',                   // abnormal flags
      //                   '',                   // probability
      //                   '',                   // nature of abnormal test
      //                   'P\n'                 // observation result status
      //                 )
      //               }
      //             }
      //           })
      //         }
      //       })
      //
      //       // file
      //       if (self.lisConnObj.LIS_CONN_TYPE_CD === '01') {
      //         console.log(msg.toString())
      //         client.send(msg, function(err) {
      //           console.log('************sending message****************')
      //           if (err) {
      //             console.log("ERR: " + err.message)
      //             self.$toasted.show(err.message, {
      //               position: 'bottom-center',
      //               duration: '2000'
      //             })
      //
      //             self.EventBus.$emit('OVERLAY', {state: false})
      //           } else {
      //             self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
      //               position: 'bottom-center',
      //               duration: '2000'
      //             })
      //
      //             //NO ACK for File Client
      //             self.EventBus.$emit('OVERLAY', {state: false})
      //           }
      //         })
      //       } else {      // url
      //         self.sendLisMessage(msg.toString())
      //       }
      //     }
      //   }
      // })

      this.EventBus.$on('WBC_CLASSIFICATION_LOADED', function(params) {
        console.log(params)
        self.wbcInfo = params
        self.wbcTotalCount = 0

        self.wbcInfo.forEach(function (item, index) {
          if (item.id !== '12' && item.id !== '13' &&
            item.id !== '14' && item.id !== '15' &&
            item.id !== '16') {
            self.wbcTotalCount += Number(item.count)
          }
        })

        self.wbcInfo.sort(function(a, b) {
          return a.order - b.order
        })
        self.drawWbcImages()

        self.drawRbcImages()
      })

      // update comment [
      this.EventBus.$on(Constant.UPDATE_RBC_COMMENT, function(params) {
        self.selectedItem.RBC_COMMENT = params
      })
      this.EventBus.$on(Constant.UPDATE_WBC_COMMENT, function(params) {
        self.selectedItem.WBC_COMMENT = params
      })
      // update comment ]
    },
    methods: {
      onCopySize (evt) {
        if (evt.ctrlKey) {
          console.log("복사")
          this.copied = this.rbcSizeOptions.find(opt => opt.value === this.rbcSize).text;
          console.log(this.copied)
        }
      },
      onCopyChrom (evt) {
        if (evt.ctrlKey) {
          console.log("복사")
          this.copied = this.rbcChromiaOptions.find(opt => opt.value === this.rbcChromia).text;
          console.log(this.copied)
        }
      },
      onPaste (evt, index) {
        if (evt.ctrlKey && evt.key === "v") {
          console.log("붙여넣기")
          evt.preventDefault();
          console.log(this.copied)
          this.remarkContents[index].text = this.remarkContents[index].text + " " +this.copied
        }
      },
      onFocusDataList (evt) {
        this.inputFocus = true
      },
      onFocusDataRemark(evt){
        this.inputFocusRemark=true
      },
      onFocusOutDataList (evt) {
        var self = this
        setTimeout(function() {
          self.inputFocus = false
        }, 300)
      },
      onFocusOutDataRemark(evt) {
        var self = this
        setTimeout(function() {
          self.inputFocusRemark = false
        }, 300)
      },
      // 인풋 엔터치면 종합코드 업뎃
      onEnterResultCd() {
        this.overallResultCd = this.overallResultCdOptions[this.selectedCd].value
        this.searchText = this.overallResultCdOptions[this.selectedCd].text

        ipcRenderer.send(Constant.GET_SKMC_FAVORITE, JSON.stringify({resultCd: this.overallResultCd}))
        this.onFocusOutDataList()
      },
      // 인풋 엔터치면 리마크 업뎃
      onEnterRemark () {
        if (this.selectedOption >= 0 && this.selectedOption < this.remarkOptions.length) {
          this.searchRemark = this.remarkOptions[this.selectedOption].title
        }

        if (this.remarkContents === null) {
          this.remarkContents = []
        }

        this.remarkOptions.forEach( opt => {
          if (opt.title === this.searchRemark) {
            // var obj={
            //   remarkCd:opt.title,
            //   text:opt.content
            // }

            // this.remarkContents.push(obj)

            // contents 개행 처리
            var contents = opt.content.split('\n')
            for (var i = 0; i < contents.length; i++) {
              if (contents[i] !== '') {
                var obj = {
                  remarkCd: opt.title,
                  text: contents[i]
                }

                this.remarkContents.push(obj)
              }
            }
          }
        })

        this.$nextTick(this.scrollToBottom)

        this.onFocusOutDataRemark()
      },
      scrollToBottom () {
        var container = this.$refs.remarkContainer
        container.scrollTop = container.scrollHeight
      },
      onMouseEnter(index) {
        this.selectedOption = index
      },
      onKeyUp () {
        if (this.selectedCd > 0) {
          this.selectedCd--
          this.onScrollCdOption()
        }
      },
      onKeyDown () {
        if (this.selectedCd < this.overallResultCdOptions.length-1) {
          this.selectedCd++
          this.onScrollCdOption()
        }
      },
      onScrollCdOption () {
        var container=this.$refs.scrollCdContainer;
        var option=this.$refs.cdOption[this.selectedCd];
        if(container && option){
          var containerRect=container.getBoundingClientRect();
          var optionRect=option.getBoundingClientRect();
          if(optionRect.bottom>containerRect.bottom){
            container.scrollTop+=optionRect.bottom-containerRect.bottom;
          } else if (optionRect.top<containerRect.top){
            container.scrollTop-=containerRect.top-optionRect.top
          }
        }
      },
      onKeyUpRemark () {
        if (this.selectedOption > 0) {
          this.selectedOption--
          this.onScrollOption()
        }
      },
      onKeyDownRemark () {
        if (this.selectedOption < this.remarkOptions.length-1) {
          this.selectedOption++
          this.onScrollOption()
        }
      },
      onScrollOption () {
        var container=this.$refs.scrollContainer;
        var option=this.$refs.option[this.selectedOption];
        if(container && option){
          var containerRect=container.getBoundingClientRect();
          var optionRect=option.getBoundingClientRect();
          if(optionRect.bottom>containerRect.bottom){
            container.scrollTop+=optionRect.bottom-containerRect.bottom;
          } else if (optionRect.top<containerRect.top){
            container.scrollTop-=containerRect.top-optionRect.top
          }
        }
      },
      // 20230904_LBK : 삼광 결과 입력 팝업 -> report 창으로 이동 [
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
              }

              console.log(copyText)
            }
          } else {
            self.isSelectText = false
          }
        } else if (evt.code === 'ArrowDown') {
          var element = document.getElementById('remark' + (index + 1))
          if (element) {
            element.focus()
          }
        } else if (evt.code === 'ArrowUp') {
          var element = document.getElementById('remark' + (index - 1))
          if (element) {
            element.focus()
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
      onDeleteRemark (evt) {
        this.remarkContents = []
      },
      onSelectRemark (evt) {
        this.$modal.show(ModalSkmcRemark, {}, {
          height: '900',
          width: '800px'
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
      onAddResultCd () {
        console.log('onAddResultCd')
        this.$modal.show(ModalSkmcAddResultCd, {codes: this.overallResultCdOptions}, {
          height: 'auto',
          width: '350px'
        })
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
      onChangeResultCd (item) {
        console.log('onChangeResultCd')
        this.overallResultCd = item.value
        this.searchText = item.text

        ipcRenderer.send(Constant.GET_SKMC_FAVORITE, JSON.stringify({resultCd: this.overallResultCd}))
      },
      // 리마크 코드 변경 추가
      onChangeRemarkCd(item){
        this.searchRemark=item.title;
        this.$refs.remarkInput.focus();
      },
      onCommit () {
        this.EventBus.$emit('ON_CLICK_REPORT_SIGN', null)
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
      onClickLisUpload () {
        this.EventBus.$emit('ON_CLICK_LIS', null)
      },
      onClickPrint () {
        var self = this
        var classDir = ''

        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          classDir = this.settings.wbcClassDirName
        } else {
          classDir = this.settings.bfClassDirName
        }

        var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
        var dirPath = rootPath + '/' + classDir
        // this.wbcInfo.forEach(function(item) {
        //   var filePath = dirPath + '/' + item.id + '_' + item.title
        //   item.images.forEach(function(image, index) {
        //     item.images[index] = 'file://' + filePath + '/' + image
        //   })
        // })

        console.log(this.wbcInfo)
        var html = this.$makePrintHtml(this.selectedItem, this.wbcInfo, this.rbcInfo, this.wbcTotalCount, this.rbcImages)
        this.$modal.show(ModalPrint, {item: html}, {
          width: '900',
          height: 'auto',
          scrollable: true
        })

        // var serial = this.serialNo
        // var testType = ''
        // var gender = ''
        //
        // if (this.selectedItem.TEST_TYPE === '01') {
        //   testType = 'Peripheral blood'
        // } else if (this.selectedItem.TEST_TYPE === '02') {
        //   testType = 'Body fluid default'
        // } else if (this.selectedItem.TEST_TYPE === '03') {
        //   testType = 'Body fluid select'
        // } else {
        //   testType = 'Manual'
        // }
        //
        // if (this.selectedItem.GENDER === '01') {
        //   gender = 'Male'
        // } else if (this.selectedItem.GENDER === '02') {
        //   gender = 'Female'
        // } else {
        //   gender = ''
        // }
        //
        // const html = `<span>&#60; Hospital &#62; &nbsp;&nbsp;</span>` +
        //   `<span> DM Serial Nbr : ` + serial + `</span>` +
        //   `<hr style="border-top: 1px dashed" />` +
        //   `<div style="text-align: center; font-size: 19px;"> Analysis Report from UIMD PB system</div>` +
        //   `<div class="userContainer" style="display: flex; flex-wrap: wrap; margin-top: 40px; font-size: 15px;">` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       `Slot ID` +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       this.selectedItem.SLOT_ID +
        //     `</div><br /><br />` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       `Ordered date` +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       this.$stringToDateTime(this.selectedItem.ORDER_DTTM) +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       `Signed by ID` +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       this.selectedItem.SIGNED_USER_ID +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       `Signed date` +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       this.$stringToDateTime(this.selectedItem.SIGNED_DTTM) +
        //     `</div><br /><br />` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       `Patient ID` +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       this.selectedItem.PATIENT_ID +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       `Ordered Classification` +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       testType +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       `Name` +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       this.selectedItem.PATIENT_NM +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       `Birth` +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       this.$stringToDate(this.selectedItem.BIRTHDAY) +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       `Gender` +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       gender +
        //     `</div><br /><br />` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       this.createRbcClassification() +
        //     `</div>` +
        //     `<div class="item" style="flex-basis: 50%;">` +
        //       this.createWbcClassification() +
        //     `</div>` +
        //     `<div class="item">` +
        //       this.drawWbcPrintImages() +
        //     `</div>` +
        //   `</div>`
        //
        // this.$modal.show(ModalPrint, {item: html}, {
        //   width: '900',
        //   height: 'auto',
        //   scrollable: true
        // })
      },
      // drawWbcPrintImages () {
      //   var result = '<div class="wbcImagePrintContainer" style="display: flex; flex-wrap: wrap;">'
      //
      //   for (var i = 0; i < this.drawClassList.length; i++) {
      //     if (this.drawClassList[i].images.length > 0) {
      //       result += `<div style="flex-basis: 100%; margin-top: 10px;">` +
      //                   `<div style="width: 180px; border-bottom: 2px solid #09CBFC;">` +
      //                     this.drawClassList[i].name +
      //                   `</div>` +
      //                 `</div>`
      //       for (var j = 0; j < this.drawClassList[i].images.length; j++) {
      //         result += `<div class="item" style="flex-basis: 10%; margin-top: 10px; padding: 10px;">` +
      //                     `<img src=` + '"'+ this.drawClassList[i].images[j] + '"' + `style="width: 185px;" />` +
      //                   `</div>`
      //
      //                   // <b-col>
      //                   //   <img :src="image" v-for="image in item.images" style="width: 80px;">
      //                   // </b-col>
      //       }
      //     }
      //   }
      //
      //   result += '</div>'
      //
      //   return result
      // },
      // createWbcClassification () {
      //   var result = '<div class="wbcContainer" style="display: flex; flex-wrap: wrap;">'
      //   result += `<div class="item" style="flex-basis: 100%;">WBC classification result` + `</div><br /><br />`
      //
      //   console.log(this.wbcInfo)
      //   for (var i = 0; i < this.wbcInfo.length; i++) {
      //     if ((this.wbcInfo[i].id !== '12' &&
      //          this.wbcInfo[i].id !== '13' &&
      //          this.wbcInfo[i].id !== '14' &&
      //          this.wbcInfo[i].id !== '15' &&
      //          this.wbcInfo[i].id !== '16') && (this.wbcInfo[i].count > 0)) {
      //       result += `<div class="item" style="flex-basis: 40%;">` + this.wbcInfo[i].name + `</div>`
      //       result += `<div class="item" style="flex-basis: 30%;">` + this.wbcInfo[i].count + `</div>`
      //       result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + this.wbcInfo[i].percent + `%</div>`
      //     }
      //
      //     // if (i === (this.wbcInfo.length - 1)) {
      //     //   result += `<div class="item" style="flex-basis: 40%;">` + 'Total count' + `</div>`
      //     //   result += `<div class="item" style="flex-basis: 30%;">` + this.wbcTotalCount + `</div>`
      //     //   result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + '100.00%' + `</div>`
      //     // }
      //   }
      //
      //   result += `<div class="item" style="flex-basis: 40%;">` + 'Total count' + `</div>`
      //   result += `<div class="item" style="flex-basis: 30%;">` + this.wbcTotalCount + `</div>`
      //   result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + '100.00%' + `</div>`
      //
      //   for (var j = 0; j < this.wbcInfo.length; j++) {
      //     if ((this.wbcInfo[j].id === '12' ||
      //          this.wbcInfo[j].id === '13' ||
      //          this.wbcInfo[j].id === '14' ||
      //          this.wbcInfo[j].id === '15' ||
      //          this.wbcInfo[j].id === '16') && (this.wbcInfo[j].count > 0)) {
      //       result += `<div class="item" style="flex-basis: 40%;">` + this.wbcInfo[j].name + `</div>`
      //       if (this.wbcInfo[j].id === '12') {
      //         result += `<div class="item" style="flex-basis: 30%;">` + this.wbcInfo[j].count + '/ 100 WBC' + `</div>`
      //       } else {
      //         result += `<div class="item" style="flex-basis: 30%;">` + this.wbcInfo[j].count + `</div>`
      //       }
      //       result += `<div class="item" style="flex-basis: 30%;">` + `</div>`
      //     }
      //   }
      //
      //   result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
      //   result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + this.selectedItem.WBC_COMMENT + `</div>`
      //
      //   result += '</div>'
      //   return result
      // },
      // createRbcClassification() {
      //   var result = '<div class="rbcContainer" style="display: flex; flex-wrap: wrap;">'
      //   result += `<div class="item" style="flex-basis: 100%;">RBC classification result` + `</div><br /><br />`
      //
      //   for (var i = 0; i < this.rbcInfo.length; i++) {
      //     result += `<div class="item" style="flex-basis: 30%;">` + this.rbcInfo[i].CATEGORY_NM + `</div>`
      //     result += `<div class="item" style="flex-basis: 30%;">` + this.rbcInfo[i].CLASS_NM + `</div>`
      //
      //     result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + Number(this.rbcInfo[i].DEGREE) + `+</div>`
      //
      //     // if ((this.rbcInfo[i].CATEGORY_ID === '01' ||
      //     //      this.rbcInfo[i].CATEGORY_ID === '02' ||
      //     //      this.rbcInfo[i].CATEGORY_ID === '03') && this.rbcInfo[i].CLASS_ID === '01') {
      //     //   result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + Number(this.rbcInfo[i].DEGREE) + `+</div>`
      //     // } else {
      //     //   result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + (Number(this.rbcInfo[i].DEGREE) - 1) + `+</div>`
      //     // }
      //
      //     // if (i === (this.rbcInfo.length - 1)) {
      //     //   result += `<br /><br /><br /><div class="item" style="flex-basis: 30%;">` + 'Malaria' + `</div>`
      //     //   result += `<div class="item" style="flex-basis: 30%;"></div>`
      //     //   result += `<div class="item" style="flex-basis: 30%;">` + this.selectedItem.MALARIA_COUNT + '/' + this.selectedItem.MAX_RBC_COUNT + `RBC</div>`
      //     //
      //     //   result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
      //     //   result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + this.selectedItem.RBC_COMMENT + `</div>`
      //     // }
      //   }
      //
      //   result += `<br /><br /><div class="item" style="flex-basis: 30%;">` + 'Platelets' + `</div>`
      //   result += `<div class="item" style="flex-basis: 20%;"></div>`
      //   result += `<div class="item" style="flex-basis: 40%; text-align: right;">` + this.selectedItem.PLT_COUNT + ` PLT / 1000 RBC</div>`
      //
      //   result += `<div class="item" style="flex-basis: 30%;">` + 'Malaria' + `</div>`
      //   result += `<div class="item" style="flex-basis: 30%;"></div>`
      //   result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + this.selectedItem.MALARIA_COUNT + '/' + this.selectedItem.MAX_RBC_COUNT + `RBC</div>`
      //
      //   result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
      //   result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + this.selectedItem.RBC_COMMENT + `</div>`
      //
      //   result += '</div>'
      //   return result
      // },
      onSign () {
        this.$modal.show(ModalReportSign, {slotId: this.orderId}, {
          height: 'auto',
          width: '700px'
        })
      },
      drawWbcImages () {

        var self = this
        var classDir = ''

        this.drawClassList = []

        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          classDir = this.settings.wbcClassDirName
        } else {
          classDir = this.settings.bfClassDirName
        }

        var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
        for (var i = 0; i < this.wbcInfo.length; i++) {
          for (var j = 0; j < this.reportPrintList.length; j++) {
            if (this.wbcInfo[i].id === this.reportPrintList[j]) {
              var filePath = rootPath + '/' + classDir + '/' + this.wbcInfo[i].id + '_' + this.wbcInfo[i].title
              var files = fs.readdirSync(filePath).filter(function (file) {
                return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
              })

              for (var k = 0; k < files.length; k++) {
                files[k] = 'file://' + filePath + '/' + files[k]
              }

              var obj = {
                title: this.wbcInfo[i].title,
                images: files,
                id: this.wbcInfo[i].id,
                name: this.wbcInfo[i].name,
                order: this.wbcInfo[i].order
              }

              this.drawClassList.push(obj)
            }
          }
        }

        console.log(this.wbcInfo)
        console.log(this.drawClassList)
      },
      drawRbcImages () {
        var self = this

        if (this.rbcPrintState === 'Y') {
          var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
          var rbcPath = rootPath + '/' + this.settings.rbcImageDirName

          console.log(rbcPath)

          var files = fs.readdirSync(rbcPath).filter(function (file) {
            return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
          })

          self.rbcImages = []
          files.forEach(function(item) {
            self.rbcImages.push('file://' + rbcPath + '/' + item)
          })

          console.log(self.rbcImages)
        }
      }
    }
  }
</script>
<style scoped>
  .searchFrame{
    position: absolute;
    background-color: white;
    border-top: none;
    top: 30px;
    padding: 5px;
    height: 100px;
    max-height: 200px;
    overflow-y: scroll;
    z-index: 100;
  }
  .skmcSearch{
    width: 430px;
  }
  .remarkSearch{
    width:162px;
  }
  .dataOptions,.dataRemarkOptions {
    color: black;
    cursor: pointer;
    z-index: 200;
  }
  .dataOptions:hover, .dataRemarkOptions.active, .dataOptions.active {
    background-color: lightblue;
  }
</style>