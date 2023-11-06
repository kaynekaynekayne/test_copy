<template>
  <b-container id="resultPage" class="pl-2 pt-2 pb-2" fluid>
    <b-row style="height: 913px;">
      <b-col class="h-100 pr-1" cols="7">
        <b-card class="blackCard h-100" text-variant="white" no-body @keyup.enter="onSearch()">
          <div style="height: 8%;">
            <div id="title" class="panelTitle pl-3">
              <span>Classification List</span>
              <b-icon class="ml-3 pointer"
                id="classFilter"
                icon="list-check"
                font-scale="1.0"
                v-b-tooltip.hover title="Class filter"
                style="color: white;"></b-icon>

              <b-popover
                target="classFilter"
                placement="bottom"
                title="Class filter"
                triggers="hover focus"
              >
                <div>
                  <b-row>
                    <b-col class="pt-1" cols="5">
                      NR count
                    </b-col>
                    <b-col>
                      <b-form-input type="number" v-model="nrCount" size="sm"></b-form-input>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pt-1" cols="5">
                      WBC total
                    </b-col>
                    <b-col>
                      <b-form-select v-model="wbcTotalSortCd" :options="searchOptions.wbcTotalSort" size="sm"></b-form-select>
                    </b-col>
                  </b-row>
                  <b-row class="mt-3">
                    <b-col v-if="selectItem.TEST_TYPE_CD === '01' || selectItem.TEST_TYPE_CD === '04'" class="pb-1 pl-4">
                      <b-form-group>
                        <b-form-checkbox-group
                          id="filterClassGroup"
                          v-model="wbcClassList"
                          :options="wbcOptions"
                          name="filterClassGroup"
                        ></b-form-checkbox-group>
                      </b-form-group>
                    </b-col>
                    <b-col v-else class="pb-1 pl-4">
                      <b-form-group>
                        <b-form-checkbox-group
                          id="filterClassGroup"
                          v-model="wbcClassList"
                          :options="bfWbcOptions"
                          name="filterClassGroup"
                        ></b-form-checkbox-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </div>
              </b-popover>
            </div>
            <b-row class="mt-2 mb-2 pl-3">
              <b-col cols="2" class="pl-3 pr-0">
                <b-form-select v-model="sSelected" :options="searchOptions.searchType" size="sm"></b-form-select>
              </b-col>
              <b-col cols="2" class="p-0">
                <b-form-input id="divSearchText" v-model="searchText" size="sm" style="border: none !important;"></b-form-input>
              </b-col>
              <b-col cols="2">
                <b-form-datepicker
                  id="startDate"
                  size="sm"
                  v-model="startDate"
                  placeholder="Start date"
                  :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                ></b-form-datepicker>
              </b-col>
              <span class="mt-1">~</span>
              <b-col cols="2">
                <b-form-datepicker
                  id="endDate"
                  size="sm"
                  v-model="endDate"
                  placeholder="End date"
                  :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                ></b-form-datepicker>
              </b-col>

              <b-col cols="1">
                <button type="button" id="btnSearch" class="btn btn-outline-light" @click="onSearch()">Search</button>
              </b-col>
              <b-col cols="1">
                <button type="button" id="btnClear" class="btn btn-outline-light" @click="onClearOption()">Clear</button>
              </b-col>
              <b-col>
                <b-icon v-if="siteCd === '0007'"
                  class="ml-2 mr-2 pointer"
                  @click="onClickSkmcWorkSheet"
                  icon="file-earmark-richtext" scale="1.7">
                </b-icon>

                <img class="pointer" src="~@/assets/result/excel.png"
                  @click="onDownloadData('database')"
                  v-b-tooltip.hover title="max 500 slides"
                  style="width: 30px;"/>

                <!-- <img class="pointer" src="~@/assets/result/excel.png"
                  @click="onDownloadDataMatrix('matrix')"
                  v-b-tooltip.hover title="matrix"
                  style="width: 30px;"/> -->

              </b-col>
            </b-row>
            <!-- <b-row>
              <b-col v-if="selectItem.TEST_TYPE_CD === '01' || selectItem.TEST_TYPE_CD === '04'" class="pb-1 pl-4">
                <b-form-group>
                  <b-form-checkbox-group
                    id="filterClassGroup"
                    v-model="wbcClassList"
                    :options="wbcOptions"
                    name="filterClassGroup"
                  ></b-form-checkbox-group>
                </b-form-group>
              </b-col>
              <b-col v-else class="pb-1 pl-4">
                <b-form-group>
                  <b-form-checkbox-group
                    id="filterClassGroup"
                    v-model="wbcClassList"
                    :options="bfWbcOptions"
                    name="filterClassGroup"
                  ></b-form-checkbox-group>
                </b-form-group>
              </b-col>
            </b-row> -->
          </div>
          <div class="mt-2" style="height: 90%;">
            <b-row>
              <b-col>
                <div id="tableResultList" style="overflow-y: auto;">
                  <!-- <th>
                    <input class="commonInput" type="checkbox" id="customCheck">
                    <label for="customCheck" style="background-img: url('~@/assets/icon/ic_check_box_white_24dp.png')"></label>
                  </th> -->
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>
                          <b-form-checkbox
                            id="selectAll"
                            v-model="isSelectAll"
                            name="selectAll"
                            value="Y"
                            unchecked-value="N"
                            @change="onChangeAll"
                          >
                          </b-form-checkbox>
                        </th>
                        <!-- <th>Work list</th> -->
                        <th>PB/BF</th>
                        <th>State</th>
                        <th>Tray slot</th>
                        <th v-if="siteCd === '0007'">
                          <span>Barcode ID</span>
                          <b-icon v-if="isBarcodeDesc" class="pointer"
                            icon="caret-down"
                            @click="onClickDesc"
                          >
                          </b-icon>
                          <b-icon v-else class="pointer"
                            icon="caret-up"
                            @click="onClickAsc"
                          >
                          </b-icon>
                        </th>
                        <th v-else>
                          <span>Barcode ID</span>
                        </th>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th v-if="siteCd === '0007'">
                          <span>Analyzed Date</span>
                          <b-icon v-if="isAnalyDesc" class="pointer"
                            icon="caret-down"
                            @click="onClickDescAnaly"
                          >
                          </b-icon>
                          <b-icon v-else class="pointer"
                            icon="caret-up"
                            @click="onClickAscAnaly"
                          >
                          </b-icon>
                        </th>
                        <th v-else>
                          <span>Analyzed Date</span>
                        </th>
                        <th>Tact time(s)</th>
                        <th>Submit</th>
                        <th>Submit Date</th>
                        <th>Edit</th>
                        <!-- <th>State</th> -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        tabindex="0"
                        :id="item.SLOT_ID"
                        class="pointer"
                        v-for="(item, index) in dspTestList"
                        :key="index"
                        @keyup="onKeyup($event, item)"
                        @focus="onFocusRow(item, $event)"
                        @dblclick="onDbClick(item)"
                        @contextmenu.prevent="$refs.ctxMenu.open">
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }">
                          <span style="float: left;">{{index + 1}}</span>

                          <b-icon v-if="item.IS_NORMAL === 'N'"
                            icon="exclamation-circle-fill"
                            variant="danger"
                            :id="'abnormalTarget_' + index">
                          </b-icon>

                          <b-popover v-if="item.IS_NORMAL === 'N'" :target="'abnormalTarget_' + index" triggers="hover" placement="right">
                            <b-row v-for="(abItem, index) in item.ABNORMAL" :key="index">
                              <b-col>
                                {{abItem}}
                              </b-col>
                            </b-row>
                          </b-popover>

                          <span v-if="item.IS_CHECKED === 'Y'" style="float: right;">
                            <b-icon v-if="item.SIGNED_STATE !== 'Submit'"
                              icon="check-circle" variant="success">
                            </b-icon>
                            <b-icon v-else
                              icon="check-circle" variant="primary">
                            </b-icon>
                          </span>

                        </td>
                        <td>
                          <b-form-checkbox
                            v-model="item.isSelected"
                            value="Y"
                            unchecked-value="N"
                          >
                          </b-form-checkbox>
                        </td>
                        <!-- <td>
                          <div v-if="checkWorkList(item.SLOT_ID) >= 0">Y</div>
                          <div v-else>N</div>
                        </td> -->
                        <td>
                          <span v-if="item.TEST_TYPE_CD === '01'">
                            PB(S)
                          </span>
                          <span v-else-if="item.TEST_TYPE_CD === '04'">
                            PB(P)
                          </span>
                          <span v-else>
                            {{ item.TEST_TYPE }}
                          </span>
                        </td>
                        <td v-if="item.LOCK_STATE === 'Y'" class="pointer">
                          <b-icon icon="lock" variant="danger" aria-hidden="true"></b-icon>
                          <span style="color: red;">{{item.USER_ID}}</span>
                        </td>
                        <td v-else class="pointer">
                          <b-icon icon="unlock" aria-hidden="true"></b-icon>
                        </td>
                        <td>
                          1-{{ item.SLOT_NO }}
                        </td>
                        <td>
                          <span v-if="siteCd === '0007'">
                            <strong v-if="item.IS_WORK_SHEET === 'N'" style="color: #2798DC;">{{ item.BARCODE_NO }}</strong>
                            <span v-else>{{ item.BARCODE_NO }}</span>
                          </span>
                          <span v-else>
                            <span v-if="item.IS_CHECKED === 'Y'">
                              <span v-if="item.SIGNED_STATE === 'Submit'" class="colorBlueTitle">{{ item.BARCODE_NO }}</span>
                              <span v-else class="colorGreen">{{ item.BARCODE_NO }}</span>
                            </span>
                            <span v-else>
                              <span>{{ item.BARCODE_NO }}</span>
                            </span>
                          </span>
                        </td>
                        <td>
                          <span> {{ item.PATIENT_ID }} </span>
                        </td>
                        <td>
                          <span> {{ item.PATIENT_NM }} </span>
                        </td>
                        <td>
                          <span> {{ $stringToDateTime(item.ANALYZE_DTTM) }} </span>
                        </td>
                        <td>
                          <span> {{ item.TACT_TIME }} </span>
                        </td>
                        <td>
                          <span> {{ item.SIGNED_STATE }}</span>
                          <span v-if="item.SIGNED_STATE === 'Submit'">({{ item.SIGNED_USER_ID }})</span>
                        </td>
                        <td>
                          <span> {{ $stringToDateTime(item.SIGNED_DTTM) }}</span>
                        </td>

                        <td v-if="item.SIGNED_STATE !== 'Submit'" class="pointer" @click="onClickEdit(item)">
                          <b-icon icon="pencil-square"></b-icon>
                        </td>
                        <td v-else>
                        </td>
                        <!-- <td v-if="item.LOCK_STATE === 'Y'" class="pointer">
                          <b-icon icon="lock" variant="danger" aria-hidden="true"></b-icon>
                          <span style="color: red;">{{item.USER_ID}}</span>
                        </td>
                        <td v-else class="pointer">
                          <b-icon icon="unlock" aria-hidden="true"></b-icon>
                        </td> -->
                      </tr>
                    </tbody>
                  </table>
                  <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading" spinner="waveDots"></infinite-loading>
                </div>
              </b-col>
            </b-row>
          </div>
        </b-card>
      </b-col>
      <b-col class="pl-2">
        <b-row style="height: 40%;">
          <b-col>
            <b-card class="blackCard h-100" text-variant="white" no-body style="overflow-y: scroll; overflow-x: hidden;">
              <div id="title" class="panelTitle">Information</div>
              <b-row class="mt-3">
                <b-col class="pl-4">
                  <div>Order information</div>
                  <div id="divContents">
                    <span>Order ID :</span>
                    <span>{{ selectItem.SLOT_ID }}</span></br>
                    <span>Ordered by known</span></br>
                    <span>Date :</span>
                    <span>{{ $stringToDateTime(selectItem.ORDER_DTTM) }}</span></br>
                    <span>LIS status : </span>
                    <span>No data sent or receuved from LIS</span></br>
                    <span>Type of order : </span>
                    <span v-if="selectItem.TEST_TYPE_CD === '01' || selectItem.TEST_TYPE_CD === '04'">WBC + RBC </br></span>
                    <span v-else>{{ selectItem.TEST_TYPE }} </br></span>
                    <span>NS, NB Integration : {{ selectItem.IS_NS_NB_INTEGRATION}} </br></br></span>

                    <span>Patient ID : </span>
                    <span>{{ selectItem.PATIENT_ID }}</span></br>
                    <span>Patient name : </span>
                    <span>{{ selectItem.PATIENT_NM }}</span></br>
                  </div>
                  <div class="p-2">
                    <img :src="barcodePath" style="width: 300px;" />
                  </div>
                </b-col>
                <b-col>
                  <b-row>
                    <b-col>
                      <div>Result information</div>
                      <div id="divContents">
                        <span>Analyzed date :</span>
                        <span>{{ $stringToDateTime(selectItem.ANALYZE_DTTM) }}</span></br>
                        <span>Signed state :</span>
                        <span>{{ selectItem.SIGNED_STATE }}</span></br>
                        <span>Signed of date :</span>
                        <span>{{ $stringToDateTime(selectItem.SIGNED_DTTM) }}</span></br>
                        <span>Signed user ID :</span>
                        <span>{{ selectItem.SIGNED_USER_ID }}</span>
                        <div v-if="selectItem.TEST_TYPE_CD === '01' || selectItem.TEST_TYPE_CD === '04'">
                          <div v-for="result in classificationResult"
                            v-if="result.count > 0 &&
                            (result.dirName !== '12_NR' &&
                             result.dirName !== '13_GP' &&
                             result.dirName !== '14_PA' &&
                             result.dirName !== '15_AR' &&
                             result.dirName !== '16_MA')">
                            <b-row>
                              <b-col cols="3">
                                {{ result.title }} :
                              </b-col>
                              <b-col cols="3" class="text-right">
                                {{ result.count }}
                              </b-col>
                              <b-col cols="4" class="text-right">
                                {{ result.percent }}%
                              </b-col>
                            </b-row>
                          </div>
                          <div>
                            <b-row>
                              <b-col cols="3">
                                Total :
                              </b-col>
                              <b-col cols="3" class="text-right">
                                {{ imgCount }}
                              </b-col>
                              <b-col cols="4" class="text-right">
                                100.00%
                              </b-col>
                            </b-row>
                          </div>
                          <br />
                          <div v-for="result in classificationResult"
                            v-if="result.count > 0 &&
                            (result.dirName === '12_NR' ||
                             result.dirName === '13_GP' ||
                             result.dirName === '14_PA' ||
                             result.dirName === '15_AR' ||
                             result.dirName === '16_MA')">
                            <b-row>
                              <b-col cols="3">
                                {{ result.title }} :
                              </b-col>
                              <b-col cols="3" class="text-right">
                                {{ result.count }}
                              </b-col>
                              <b-col cols="3"></b-col>
                            </b-row>
                          </div>
                        </div>
                        <div v-else style="height: 200px; overflow-y: scroll; overflow-x: hidden;">
                          <div v-for="result in classificationResult"
                            v-if="result.count > 0 &&
                            (result.dirName !== '08_NR' &&
                             result.dirName !== '09_AR' &&
                             result.dirName !== '10_MC')">
                            <b-row>
                              <b-col cols="3">
                                {{ result.title }} :
                              </b-col>
                              <b-col cols="3" class="text-right">
                                {{ result.count }}
                              </b-col>
                              <b-col cols="3" class="text-right">
                                {{ result.percent }}%
                              </b-col>
                            </b-row>
                          </div>
                          <div>
                            <b-row>
                              <b-col cols="3">
                                Total :
                              </b-col>
                              <b-col cols="3" class="text-right">
                                {{ imgCount }}
                              </b-col>
                              <b-col cols="3" class="text-right">
                                100.00%
                              </b-col>
                            </b-row>
                          </div>
                          <br />
                          <div v-for="result in classificationResult"
                            v-if="result.count > 0 &&
                            (result.dirName === '08_NR' ||
                             result.dirName === '09_AR' ||
                             result.dirName === '10_MC')">
                            <b-row>
                              <b-col cols="3">
                                {{ result.title }} :
                              </b-col>
                              <b-col cols="3" class="text-right">
                                {{ result.count }}
                              </b-col>
                              <b-col cols="3"></b-col>
                            </b-row>
                          </div>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                  <!-- <b-row class="mt-5">
                    <b-col>
                      <div>Error message information</div>
                      <div id="error">
                        <span> {{ selectItem }} </span>
                      </div>
                    </b-col>
                  </b-row> -->
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
        <b-card class="blackCard mt-2" text-variant="white" no-body style="overflow-y: scroll; overflow-x: hidden; height: 540px;">
          <b-row class="mt-2 pb-2">
            <b-col>
              <b-row class="pl-3">
                <div id="title" class="panelTitle">WBC Images</div>
                <button type="button" id="btnExport" class="btn btn-outline-light" @click="onExport('wbcImages')">Export</button>
              </b-row>
              <div v-if="loadErrorMessage === ''" class="p-1">
                <viewer :images="wbcImages" :options="viwerOptions" style="text-align: left;">
                  <vue-load-image v-if="wbcImages.length > 0" @onLoad="onLoadImg">
                    <img slot="image" class="wbcImage p-1" v-for="(image, index) in wbcImages" :src="image" :key="index" style="width: 100px; "/>
                    <img slot="preloader" src="~@/assets/icon/loading-buffering.gif" style="padding: 15px; width: 50px;"/>
                  </vue-load-image>
                </viewer>
              </div>
              <div v-else class="p-1" style="height: 80%;">
                <div>{{ loadErrorMessage }}</div>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <context-menu id="context-menu" ref="ctxMenu">
      <li id="menuOptions" @click="onClickClass(item)" v-for="item in contextMenuItems">
        <div class="p-2">
          <div>{{ item }}</div>
        </div>
      </li>
    </context-menu>
  </b-container>
</template>
<script>
  import ModalEditOrder from '../Common/ModalEditOrder.vue'
  import ModalSkmcWorkSheet from '../Common/ModalSkmcWorkSheet.vue'
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'
  import ModalInfo from '../Common/ModalInfo'
  import ModalConfirm from '../Common/ModalConfirm'
  import ModalPrint from '../Common/ModalPrint'
  import contextMenu from 'vue-context-menu'
  import XLSX from 'xlsx'
  import VueLoadImage from 'vue-load-image'
  import api from '@/service'
  import {machineIdSync} from 'node-machine-id'
  import Configs from '../../../Configs'
  import lodash from 'lodash'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')
  const log = require('electron-log')
  const ip = require('ip')

  // win API
  // const ffi = require('ffi-napi')
  // const ref = require('ref-napi')

  // typedef
  // const voidPtr = ref.refType(ref.types.void)
  // const stringPtr = ref.refType(ref.types.CString)

  // binding lib
  // const user32 = ffi.Library('user32.dll', {
  //   EnumWindows: ['bool', [voidPtr, 'int32']],
  //   GetWindowTextA: ['long', ['long', stringPtr, 'long']],
  //   SendMessageA: ['int32', ['long', 'int32', 'uint32', 'long']]
  // })

  export default {
    name: 'result-page',
    components: { contextMenu, XLSX, VueLoadImage },
    computed: {
      ...mapGetters({
        searchOptions: Constant.GET_SEARCH_OPTIONS,
        settings: Constant.GET_SETTINGS,
        // testHistoryList: Constant.GET_TEST_HISTORY_LIST,
        getCommonCode: Constant.GET_COMMON_CODE,
        getClassificationItem: Constant.GET_CLASSIFICATION_ITEM,
        classList: Constant.GET_WBC_CLASS_LIST,
        bfClassList: Constant.GET_BF_WBC_CLASS_LIST,
        workList: Constant.GET_WORK_LIST,
        userId: Constant.GET_CURRENT_USER,
        siteCd: Constant.GET_SITE_CD,
        rbcPrintState: Constant.GET_RBC_REPORT_PRINT,
        sortType: Constant.GET_SORT_TYPE
      })
    },
    data () {
      return {
        limit: 0,
        MAX_LOAD_SIZE: 25,
        isSelectAll: 'N',
        selectItem: {},
        searchText: '',
        dspTestList: [],
        searchList: [],
        sSelected: '02',
        wbcTotalSortCd: '00',
        startDate: '',
        endDate: '',
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        wbcImages: [],
        rowImages: [],
        loadErrorMessage: '',
        classificationResult: [],
        imgCount: 0,
        barcodePath: '',
        viwerOptions: {
          toolbar: {
            zoomIn: 4,
            zoomOut: 4,
            oneToOne: 4,
            reset: 4,
            prev: 4,
            play: false,
            next: 4,
            rotateLeft: 4,
            rotateRight: 4,
            flipHorizontal: 4,
            flipVertical: 4
          },
          maxZoomRatio: 2,
          minZoomRatio: 0.5
        },
        wbcClassList: [],
        wbcOptions: [
          { text: 'NE', value: '01', minCount: 0, maxCount: 0 },
          { text: 'NS', value: '71', minCount: 0, maxCount: 0 },
          { text: 'NB', value: '72', minCount: 0, maxCount: 0 },
          { text: 'ME', value: '02', minCount: 0, maxCount: 0 },
          { text: 'MY', value: '03', minCount: 0, maxCount: 0 },
          { text: 'PR', value: '04', minCount: 0, maxCount: 0 },
          { text: 'LY', value: '05', minCount: 0, maxCount: 0 },
          { text: 'LR', value: '61', minCount: 0, maxCount: 0 },
          { text: 'LA', value: '62', minCount: 0, maxCount: 0 },
          { text: 'MO', value: '07', minCount: 0, maxCount: 0 },
          { text: 'EO', value: '08', minCount: 0, maxCount: 0 },
          { text: 'BA', value: '09', minCount: 0, maxCount: 0 },
          { text: 'BL', value: '10', minCount: 0, maxCount: 0 },
          { text: 'PC', value: '11', minCount: 0, maxCount: 0 },
          { text: 'NR', value: '12', minCount: 0, maxCount: 0 },
          { text: 'GP', value: '13', minCount: 0, maxCount: 0 },
          { text: 'PA', value: '14', minCount: 0, maxCount: 0 },
          { text: 'MA', value: '16', minCount: 0, maxCount: 0 },
          { text: 'AR', value: '15', minCount: 0, maxCount: 0 }
        ],
        bfWbcOptions: [
          { text: 'NE', value: '01', minCount: 0, maxCount: 0 },
          { text: 'LY', value: '02', minCount: 0, maxCount: 0 },
          { text: 'MO', value: '03', minCount: 0, maxCount: 0 },
          { text: 'EO', value: '04', minCount: 0, maxCount: 0 },
          { text: 'BA', value: '05', minCount: 0, maxCount: 0 },
          { text: 'BL', value: '06', minCount: 0, maxCount: 0 },
          { text: 'PC', value: '07', minCount: 0, maxCount: 0 },
          { text: 'NR', value: '08', minCount: 0, maxCount: 0 },
          { text: 'AR', value: '09', minCount: 0, maxCount: 0 },
          { text: 'MC', value: '10', minCount: 0, maxCount: 0 },
          { text: 'MT', value: '11', minCount: 0, maxCount: 0 }
        ],
        contextMenuItems: ['Print', 'Classification', 'Edit order data', 'Delete', 'export XLSX'],
        scrollCnt: 0,
        rbcInfo: [],
        isBarcodeScan: false,
        wbcCustomClass: [],
        imgLoadCount: 0,
        machineId: null,
        localIp: null,
        isSlideLockError: false,
        searchClassCount: 0,
        nrCount: 0,
        wbcTotal: false,
        isBarcodeDesc: true,
        isAnalyDesc: true
      }
    },
    beforeDestroy () {
      this.EventBus.$off('EDIT_OK')
      this.EventBus.$off(Constant.DELETE_TEST_HISTORY)
      this.$barcodeScanner.destroy()

      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY_LIST)
      ipcRenderer.removeAllListeners(Constant.ALL_TEST_HISTORY_LIST)
      ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)
      ipcRenderer.removeAllListeners(Constant.GET_LOCK_STATE)
      ipcRenderer.removeAllListeners(Constant.GET_WBC_MODIFY_LIST_ALL)

      ipcRenderer.removeAllListeners('selected-dir')
    },
    mounted () {
      var self = this

      log.info('resultPage mounted')
      console.log(this.$getUuid())
      console.log(this.classList)
      this.sSelected = this.searchOptions.searchTypeCd
      this.searchText = this.searchOptions.searchText
      this.wbcClassList = this.searchOptions.wbcClassList
      this.startDate = this.searchOptions.startDate
      this.endDate = this.searchOptions.endDate
      this.nrCount = this.searchOptions.nrCount
      this.wbcTotalSortCd = this.searchOptions.wbcTotalSortCd
      this.$barcodeScanner.init(this.onBarcodeScanned)
      this.machineId = machineIdSync({original: true})
      this.localIp = ip.address()

      console.log(this.wbcClassList)
      // var audio = new Audio(require('@/assets/sound/alarm.mp3'))
      // audio.play()

      ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)

      // WBC 변경 이력 집계
      ipcRenderer.on(Constant.GET_WBC_MODIFY_LIST_ALL, function (event, result) {
        console.log(result)

        self.onDownloadDataMatrixXlsx(self.resultPath, result)
        self.EventBus.$emit('OVERLAY', {state: false})
      })

      ipcRenderer.on(Constant.GET_WBC_MODIFY_LIST, function (event, result) {
        console.log(result)

        self.EventBus.$emit('OVERLAY', {state: false})
      })

      // custom class
      ipcRenderer.on(Constant.SELECT_WBC_CUSTOM_CLASS, function (event, results) {
        console.log(results)
        self.wbcCustomClass = results
      })

      // 전체 이력 조회 (max : 500)
      ipcRenderer.on(Constant.ALL_TEST_HISTORY_LIST, function (event, results) {
        console.log(results)
        if (results) {
          self.onDownloadXlsx(self.resultPath, results, self.$getFileNameDateTime() + '_resultData.xlsx')

          self.$toasted.show(Constant.IDS_DOWNLOAD_COMPLETE, {
            position: 'bottom-center',
            duration: '2000'
          })
        }

        self.EventBus.$emit('OVERLAY', {state: false})
      })

      ipcRenderer.on(Constant.GET_RBC_COUNT, function (event, result) {
        self.rbcInfo = result
      })

      // ipcRenderer.on('VIEWER_TCP_SEND', function (event, result) {
      //   console.log(result)
      //
      //   if (!self.isSlideLockError) {
      //     var workItem = self.workList.filter(function(listItem) {
      //       return listItem.SLOT_ID === self.selectItem.SLOT_ID
      //     })
      //
      //     console.log(workItem)
      //     // work list에 추가
      //     if (workItem.length <= 0) {
      //       self.$store.dispatch(Constant.ADD_WORK_LIST, self.selectItem)
      //     }
      //
      //     self.$router.push({path: '/homePage/resultClassification/' + self.selectItem.SLOT_ID})
      //
      //     ipcRenderer.send(Constant.UPDATE_CHECKED_CELL, JSON.stringify({
      //       isChecked: 'Y',
      //       slotId: self.selectItem.SLOT_ID
      //     }))
      //   }
      //
      //   self.EventBus.$emit('OVERLAY', {state: false})
      // })
      //
      // ipcRenderer.on('VIEWER_TCP_ERROR', function (event, result) {
      //   console.log(result)
      //   self.EventBus.$emit('OVERLAY', {state: false})
      // })

      // 슬라이드 잠금 상태 조회
      ipcRenderer.on(Constant.GET_LOCK_STATE, function (event, result) {
        console.log(result)
        if (result.LOCK_STATE === 'N' || result.USER_ID === self.userId.userId) {

          ipcRenderer.send(Constant.UPDATE_CHECKED_CELL, JSON.stringify({
            isChecked: 'Y',
            slotId: self.selectItem.SLOT_ID
          }))

          ipcRenderer.send(Constant.SET_LOCK_SLIDE, JSON.stringify({
            cassetId: self.selectItem.CASSET_ID,
            slotId: self.selectItem.SLOT_ID,
            userId: self.userId.userId,
            machineId: self.machineId,
            hostIp: '',//self.settings.hostIp,
            localIp: self.localIp,
            lockState: 'Y'
          }))

          self.$store.dispatch(Constant.ADD_DSP_LIST, self.dspTestList)
          self.$router.push({path: '/homePage/resultClassification/' + self.selectItem.SLOT_ID })
        }
        else {
          self.$toasted.show('This is the slide locked by ' + result.USER_ID, {
            position: 'bottom-center',
            duration: '2000'
          })
        }

        // setTimeout(function() {
        //   if (!self.isSlideLockError) {
        //     var workItem = self.workList.filter(function(listItem) {
        //       return listItem.SLOT_ID === self.selectItem.SLOT_ID
        //     })

        //     console.log(workItem)
        //     console.log(self.workList)
        //     // work list에 추가
        //     if (workItem.length <= 0) {
        //       self.$store.dispatch(Constant.ADD_WORK_LIST, self.selectItem)
        //     }

        //     // 여기다 저장
        //     self.$store.dispatch(Constant.ADD_DSP_LIST, self.dspTestList)
        //     self.$router.push({path: '/homePage/resultClassification/' + self.selectItem.SLOT_ID })

        //     ipcRenderer.send(Constant.UPDATE_CHECKED_CELL, JSON.stringify({
        //       isChecked: 'Y',
        //       slotId: self.selectItem.SLOT_ID
        //     }))
        //   }

        //   self.EventBus.$emit('OVERLAY', {state: false})
        // }, 300)
      })

      // 디렉터리 선택
      ipcRenderer.on('selected-dir', function (event, results) {
        self.EventBus.$emit('OVERLAY', {state: true})

        self.resultPath = self.$replaceAll(results.path, '\\', '/')
        if (results.pathType === 'database') {
          ipcRenderer.send(Constant.ALL_TEST_HISTORY_LIST, JSON.stringify({
            limit: 0,
            searchType: self.sSelected,
            searchText: self.searchText.replace(/ /g, ''),
            startDate: self.startDate,
            endDate: self.endDate,
            wbcClassList: self.wbcClassList,
            jsonList: [],
            nrCount: self.nrCount,
            wbcTotalSortCd: self.wbcTotalSortCd
          }))
        } else if (results.pathType === 'wbcImages') {
          // wbc
          console.log(self.wbcImages)

          fs.access(results.path + '/' + self.selectItem.SLOT_ID, function(err) {
            // 폴더 없으면 생성
            if (err) {
              fs.mkdir(results.path + '/' + self.selectItem.SLOT_ID, {recursive: true}, function(err) {
                if (!err) {
                  console.log('mkdir : success ' )

                  self.wbcImages.forEach(function (item, index) {
                    var path = item.replace('file://', '')
                    var url = path.split('/')
                    var fileName = url[url.length - 1]

                    console.log(path)
                    console.log(results.path + '/' + fileName)
                    console.log(self.selectItem)

                    fs.copyFile(path, results.path + '/' + self.selectItem.SLOT_ID + '/' + fileName, function(err) {
                      if (!err) {
                        if (index === (self.wbcImages.length - 1)) {
                          self.EventBus.$emit('OVERLAY', {state: false})
                          self.$toasted.show(Constant.IDS_DOWNLOAD_COMPLETE, {
                            position: 'bottom-center',
                            duration: '2000'
                          })
                        }
                      } else {
                        console.log(err)

                        self.EventBus.$emit('OVERLAY', {state: false})
                        self.$toasted.show(err.message, {
                          position: 'bottom-center',
                          duration: '2000'
                        })
                      }
                    })

                    // row
                    self.rowImages.forEach(function (item, index) {
                      var path = item.replace('file://', '')
                      var url = path.split('/')
                      var fileName = url[url.length - 1]

                      fs.copyFile(path, results.path + '/' + fileName, function(err) {
                        console.log(err)
                      })
                    })
                  })
                } else {
                  console.log('mkdir : error ' + err.message)
                }
              })
            }
          })

        } else if (results.pathType === 'exportXlsx') {
          var jsonList = self.dspTestList.filter(function(item, index) {
            return item.isSelected === 'Y'
          })

          ipcRenderer.send(Constant.ALL_TEST_HISTORY_LIST, JSON.stringify({
            limit: 0,
            searchType: self.sSelected,
            searchText: self.searchText.replace(/ /g, ''),
            startDate: self.startDate,
            endDate: self.endDate,
            wbcClassList: self.wbcClassList,
            jsonList: jsonList,
            nrCount: self.nrCount,
            wbcTotalSortCd: self.wbcTotalSortCd
          }))
        } else if (results.pathType === 'matrix') {
          console.log(results)
          var jsonList = self.dspTestList.filter(function(item, index) {
            return item.isSelected === 'Y'
          })
          console.log(jsonList)

          if (jsonList.length > 0) {
            ipcRenderer.send(Constant.GET_WBC_MODIFY_LIST_ALL, JSON.stringify(jsonList))
          } else {
            self.$toasted.show(Constant.IDS_SELECT_SLIDE, {
              position: 'bottom-center',
              duration: '2000'
            })
            self.EventBus.$emit('OVERLAY', {state: false})
          }
        }
      })

      this.EventBus.$on('EDIT_OK', function(params) {
        console.log(self.$refs.infiniteLoading)
        self.limit = 0
        self.dspTestList = []
        self.$refs.infiniteLoading.stateChanger.reset()
      })

      this.EventBus.$on(Constant.DELETE_TEST_HISTORY, function(params) {
        var items = []
        for (var i = 0; i < self.dspTestList.length; i++) {
          if (self.dspTestList[i].isSelected === 'Y') {
            items.push(self.dspTestList[i])
          }
        }

        // 2020_09_17_LBK : 디렉터리 삭제
        for (var i = 0; i < items.length; i++) {
          var path = self.settings.pbiaRootPath + '/' + items[i].SLOT_ID
          self.deleteDirectory(path)

          // 2021_05_28_LBK : work list 삭제
          self.$store.dispatch(Constant.DELETE_WORK_LIST, items[i])
        }

        ipcRenderer.send(Constant.DELETE_TEST_HISTORY, JSON.stringify(items))
        self.limit = 0
        self.dspTestList = []
        self.$store.dispatch(Constant.SET_CLASSIFICATION_ITEM, { item: null, limit: 0 })
        self.selectItem = {}
        self.loadErrorMessage = ''
        self.$refs.infiniteLoading.stateChanger.reset()
      })
    },
    methods: {
      onClickDesc () {
        console.log(this.dspTestList)
        this.isBarcodeDesc = false
        this.dspTestList.sort(function(a, b) {
          return a.BARCODE_NO - b.BARCODE_NO
        })

        this.$store.dispatch(Constant.SET_SORT_TYPE, 'barcode')

      },
      onClickAsc () {
        this.isBarcodeDesc = true
        this.dspTestList.sort(function(a, b) {
          return b.BARCODE_NO - a.BARCODE_NO
        })

        this.$store.dispatch(Constant.SET_SORT_TYPE, 'barcode')
      },
      onClickDescAnaly () {
        this.isAnalyDesc = false
        this.dspTestList.sort(function(a, b) {
          return a.ANALYZE_DTTM - b.ANALYZE_DTTM
        })

        this.$store.dispatch(Constant.SET_SORT_TYPE, 'analysis')
      },
      onClickAscAnaly () {
        this.isAnalyDesc = true
        this.dspTestList.sort(function(a, b) {
          return b.ANALYZE_DTTM - a.ANALYZE_DTTM
        })

        this.$store.dispatch(Constant.SET_SORT_TYPE, 'analysis')
      },
      onClickSkmcWorkSheet () {
        console.log('onClickSkmcWorkSheet')
        console.log(this.dspTestList)

        this.$modal.show(ModalSkmcWorkSheet, { 'testList': this.dspTestList }, {
          width: '750px',
          height: 'auto'
        })
      },
      onKeyup (evt, item) {
        console.log(evt)
        console.log(item)

      },
      onLoadImg () {
        console.log('onLoadImg')
      },
      onImgLoad (evt) {
        var self = this
        this.imgLoadCount++

        if (this.imgCount <= this.imgLoadCount) {
          this.imgLoadCount = 0
          this.EventBus.$emit('OVERLAY', {state: false})
        }
      },
      onClearOption () {
        console.log('onClearOption')
        this.sSelected = '02'
        this.searchText = ''
        this.wbcClassList = []
        this.startDate = ''
        this.endDate = ''
        this.nrCount = 0
        this.wbcTotalSortCd = '00'

        this.wbcOptions.forEach(function(item) {
          item.count = 0
        })

        this.bfWbcOptions.forEach(function(item) {
          item.count = 0
        })

        this.updateSearchOption()
        this.$store.dispatch(Constant.INIT_WORK_LIST)
      },
      updateSearchOption () {
        var self = this
        // if (self.selectItem.TEST_TYPE_CD === '01' || self.selectItem.TEST_TYPE_CD === '04') {
        //   self.wbcClassList = lodash.cloneDeep(self.wbcOptions)
        // } else {
        //   self.wbcClassList = lodash.cloneDeep(self.bfWbcOptions)
        // }
        //
        // console.log(self.wbcClassList)

        var obj = {
          searchTypeCd: this.sSelected,
          searchText: this.searchText.replace(/ /g, ''),
          startDate: this.startDate,
          endDate: this.endDate,
          wbcClassList: this.wbcClassList,
          nrCount: this.nrCount,
          wbcTotalSortCd: this.wbcTotalSortCd
        }

        console.log(obj)
        this.$store.dispatch(Constant.UPDATE_SEARCH_OPTIONS, obj)
      },
      beforeOpen () {
        console.log('beforeOpen')
      },
      beforeClose () {
        console.log('beforeClose')
        console.log(this.getClassificationItem)

        if (this.getClassificationItem.item !== null) {
          this.onFocusRow(this.getClassificationItem.item)
          var row = document.getElementById(this.getClassificationItem.item.SLOT_ID)
          if (row !== null) {
            document.getElementById(this.getClassificationItem.item.SLOT_ID).focus()
          }
        }
      },
      // 2020_09_17_LBK : 디렉터리 삭제
      deleteDirectory (path) {
        var self = this

        // 파일 or 폴더 존재 여부 체크
        try {
          fs.access(path, fs.constants.F_OK, function(err) {
            if (!err) {
              fs.rmdirSync(path, { recursive: true })
            } else {
              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          })
        } catch (err) {
          self.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })
        }

        // fs.access(path, fs.constants.F_OK, function(err) {
        //   if (!err) {
        //     fs.readdir(path, function(err, files) {
        //       if (!err) {
        //         files.forEach(function(file, index) {
        //           var curPath = path + "/" + file
        //           fs.lstat(curPath, function(err, stats) {
        //             if (!err) {
        //               if (stats.isDirectory()) {
        //                 self.deleteDirectory(curPath)
        //               } else {
        //                 // 파일 삭제
        //                 fs.unlink(curPath, (err) => {
        //                   if (err) {
        //                     console.log('delete : ' + curPath)
        //                   } else {
        //                     console.log('delete error : ' + curPath)
        //                   }
        //                 })
        //               }
        //             } else {
        //               self.$toasted.show(err.message, {
        //                 position: 'bottom-center',
        //                 duration: '2000'
        //               })
        //             }
        //           })
        //         })
        //       } else {
        //         self.$toasted.show(err.message, {
        //           position: 'bottom-center',
        //           duration: '2000'
        //         })
        //       }
        //     })
        //   } else {
        //     self.$toasted.show(err.message, {
        //       position: 'bottom-center',
        //       duration: '2000'
        //     })
        //   }
        // })
      },
      onSearch () {
        console.log('search-----------------------')
        // 입력 날짜 체크 [
        if (this.startDate !== '' && this.endDate !== '') {
          var start = new Date(this.startDate)
          var end = new Date(this.endDate)
          var diff = end - start
          var currDay = 24 * 60 * 60 * 1000
          var dayDiff = parseInt(diff/currDay)

          if (dayDiff > 31) {
            this.$toasted.show(Constant.IDS_THE_MAXIMUM_INQUIRY_DATE_IS_31_DAYS, {
              position: 'bottom-center',
              duration: '2000'
            })

            return
          } else if (dayDiff < 0) {
            this.$toasted.show(Constant.IDS_START_DATE_IS_NOT_GREATER_THEN_END_DATE, {
              position: 'bottom-center',
              duration: '2000'
            })

            return
          }

        } else {
          if (this.startDate === '') {
            if (this.endDate !== '') {
              this.$toasted.show(Constant.IDS_PLEASE_ENTER_START_DATE, {
                position: 'bottom-center',
                duration: '2000'
              })

              return
            }
          }

          if (this.endDate === '') {
            if (this.startDate !== '') {
              this.$toasted.show(Constant.IDS_PLEASE_ENTER_END_DATE, {
                position: 'bottom-center',
                duration: '2000'
              })

              return
            }
          }
        }
        // 입력 날짜 체크 ]

        // 연속 검색시 중복데이터 load 오류 수정 (!isShowSpinner)
        if (!this.$refs.infiniteLoading.isShowSpinner) {
          this.limit = 0
          this.dspTestList = []
          this.$refs.infiniteLoading.stateChanger.reset()

          this.updateSearchOption()
        }
      },
      onExport (path) {
        if (this.wbcImages.length <= 0) {
          this.$toasted.show(Constant.IDS_SELECT_SLIDE, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          ipcRenderer.send('open-file-dialog-for-dir', path)
        }
      },
      onStartDateContext (ctx) {
        // The date formatted in the locale, or the `label-no-date-selected` string
        this.formatted = ctx.selectedFormatted
        // The following will be an empty string until a valid date is entered
        this.selected = ctx.selectedYMD
      },
      onEndDateContext (ctx) {
        // The date formatted in the locale, or the `label-no-date-selected` string
        this.formatted = ctx.selectedFormatted
        // The following will be an empty string until a valid date is entered
        this.selected = ctx.selectedYMD
      },
      onClickEdit (item) {
        this.$modal.show(ModalEditOrder, {item: item}, {
          height: 'auto'
        }, {
          'before-open': this.beforeOpen,
          'before-close': this.beforeClose
        })
      },
      createCustomDirs (classList) {
        var self = this
        console.log(classList)

        return new Promise((succ, fail) => {
          var wbcPath = self.settings.pbiaRootPath + '/' + self.selectItem.SLOT_ID + '/' + self.settings.wbcClassDirName
          var customClass = classList.filter(function(item) {
            return (item.id === '90' || item.id === '91' ||
                    item.id === '92' || item.id === '93' || item.id === '94')
          })

          console.log(customClass)
          if (customClass.length > 0) {
            customClass.forEach(function(customItem, index) {
              var dirPath = wbcPath + '/' + customItem.id + '_' + customItem.title

              fs.access(dirPath, function(err) {
                // 폴더 없으면 생성
                if (err) {
                  fs.mkdir(dirPath, {recursive: true}, function(err) {
                    if (!err) {
                      console.log('mkdir : ' + dirPath)
                    } else {
                      console.log('mkdir : error ' + err.message)
                    }
                  })
                }

                if ((index + 1) === customClass.length) {
                  succ('OK')
                }
              })
            })
          } else {
            succ('OK')
          }
        })
      },
      // createCustomDirs (path) {
      //   var self = this
      //
      //   console.log('createCustomDirs')
      //   console.log(path)
      //   var dirList = null
      //
      //   fs.readdir(path, function(err, file) {
      //     if (!err) {
      //       dirList = file.filter(function(item) {
      //         return (item.indexOf('.') < 0)
      //       })
      //
      //       console.log(dirList)
      //
      //       // 현재 생성되어 있는 커스텀 dir
      //       var customDir = dirList.filter(function(item) {
      //         return (item.includes('90') || item.includes('91') ||
      //                 item.includes('92') || item.includes('93') || item.includes('94'))
      //       })
      //
      //       // directory 삭제 [start]
      //       var rmList = []
      //
      //       customDir.forEach(function(item) {
      //         var list = self.wbcCustomClass.filter(function(mkItem) {
      //           var id = item.split('_')[0]
      //           return (id === mkItem.CLASS_ID)
      //         })
      //
      //         if (list.length <= 0) {
      //           rmList.push(item)
      //         }
      //       })
      //
      //       console.log(rmList)
      //
      //       // delete
      //       rmList.forEach(function(item) {
      //         self.deleteDirectory(path + '/' + item)
      //       })
      //       // directory 삭제 [end]
      //
      //       // create
      //       self.wbcCustomClass.forEach(function(mkItem) {
      //         var updateList = customDir.filter(function(customItem) {
      //           var id = customItem.split('_')[0]
      //           return (mkItem.CLASS_ID === id)
      //         })
      //
      //         try {
      //           if (updateList.length > 0) {
      //             // update
      //             updateList.forEach(function(item) {
      //               fs.rename(path + '/' + item, path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE, function(err) {
      //                 if (!err) {
      //                   console.log('update : ' + path + '/' + item + ' to ' + path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE)
      //                 } else {
      //                   console.log('update error : ' + err.message)
      //                 }
      //               })
      //             })
      //           } else {
      //             // create
      //             if (mkItem.CLASS_TITLE !== '') {
      //               fs.access(path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE, function(err) {
      //                 // 폴더 없으면 생성
      //                 if (err) {
      //                   fs.mkdir(path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE, {recursive: true}, function(err) {
      //                     if (!err) {
      //                       console.log('mkdir : ' + path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE)
      //                     } else {
      //                       console.log('mkdir : error ' + err.message)
      //                     }
      //                   })
      //                 }
      //               })
      //             }
      //           }
      //         } catch (err) {
      //           console.log(err.message)
      //         }
      //       })
      //     }
      //   })
      // },
      loadClassificationImages() {
        var self = this
        var rootPath = self.settings.pbiaRootPath + '/' + self.selectItem.SLOT_ID
        var rbcImagePath = rootPath + '/' + self.settings.rbcImageDirName
        var classDir = ''
        var classList = []

        self.loadErrorMessage = ''
        if (self.selectItem.TEST_TYPE_CD === '01' || self.selectItem.TEST_TYPE_CD === '04') {
          classList = self.classList(self.selectItem.IS_NS_NB_INTEGRATION)
          classDir = rootPath + '/' + self.settings.wbcClassDirName

          // custom class append
          self.wbcCustomClass.forEach(function(wbcCustom) {
            if (wbcCustom.CLASS_TITLE !== '') {
              var obj = {
                count: 0,
                id: wbcCustom.CLASS_ID,
                key: '',
                name: wbcCustom.CLASS_NM,
                title: wbcCustom.CLASS_TITLE
              }
              classList.push(obj)
            }
          })

        } else {
          classList = self.bfClassList
          classDir = rootPath + '/' + self.settings.bfClassDirName

          // bf, mc폴더 생성
          var params = {
            path: classDir + '/' + '10_MC'
          }
          api.createDir(params)
          .then(function (res) {
            console.log(res)
          }).catch(function (err) {
            console.log(err.message)
          })
        }

        // wbc file load
        var params = {
          classList: classList,
          classDir: classDir,
          selectItem: self.selectItem
        }

        console.log(params)
        api.getWbcFiles(params)
        .then(function (res) {
          console.log(res)
          self.imgCount = res.imgCount
          self.wbcImages = res.wbcImages

          // 2023_02_22_LBK : sorting [서울성모 요청]
          setTimeout(function () {
            // order
            res.classificationResult.sort(function(a, b) {
              return a.order - b.order
            })

            self.classificationResult = res.classificationResult

            var params = {
              classificationResult: self.classificationResult,
              imgCount: self.imgCount,
              siteCd: self.siteCd
            }

            console.log(params)

            api.getWbcClassification(params)
            .then(function (res) {
              console.log(res)
            }).catch(function (err) {
              console.log(err.message)
              self.loadErrorMessage = err.message
            })
          }, 100)

        }).catch(function (err) {
          if (err.err.code === 'ENOENT') {
            if (err.classId === '90' || err.classId === '91' ||
                err.classId === '92' || err.classId === '93' ||
                err.classId === '94') {
              self.loadClassificationImages()
            }
          }
        })

        // rbc file load
        console.log(rbcImagePath)
        if (self.selectItem.TEST_TYPE_CD === '02' && self.selectItem.TEST_TYPE_CD === '03') {
          var params = {
            rbcImagePath: rbcImagePath
          }

          api.getRbcFiles(params)
          .then(function (res) {
            // rbc count
            ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({slotId: self.selectItem.SLOT_ID}))

          }).catch(function (err) {
            console.log(err.message)

            self.loadErrorMessage = err.message
          })
        }
      },
      onFocusRow (item, evt) {
        var self = this

        // self.EventBus.$emit('OVERLAY', {state: true})

        console.log(this.$getDateTime())
        console.log(item)
        self.selectItem = item
        self.wbcImages = []
        self.rowImages = []
        self.classificationResult = []
        self.imgCount = 0
        self.$store.dispatch(Constant.UPDATE_SELECT_ORDER_ID, item.SLOT_ID)
        self.$store.dispatch(Constant.SET_CLASSIFICATION_ITEM, { item: item, limit: self.limit })

        try {
          var rootPath = self.settings.pbiaRootPath + '/' + item.SLOT_ID
          var barcodePath = rootPath + '/' + self.settings.barcodeDirName

          // barcode path
          console.log(this.$getDateTime())
          fs.readdir(barcodePath, function(err, file) {
            if (!err) {
              self.barcodePath = 'file://' + barcodePath + '/' + file[0]
            } else {
              self.barcodePath = null
            }
          })

          self.loadClassificationImages()

          console.log(self.wbcClassList)

        } catch (err) {
          console.log(err.message)
          self.barcodePath = ''
          self.loadErrorMessage = err.message

        }

        console.log(self.$getDateTime())
      },
      onDbClick (item) {
        ipcRenderer.send(Constant.GET_LOCK_STATE, JSON.stringify({
          cassetId: this.selectItem.CASSET_ID,
          slotId: this.selectItem.SLOT_ID
        }))

        // if (this.loadErrorMessage === '') {
        //   console.log(this.workList)
        //   console.log(item)
        //   var workItem = this.workList.filter(function(listItem) {
        //     return listItem.SLOT_ID === item.SLOT_ID
        //   })
        //
        //   console.log(workItem)
        //   // work list에 추가
        //   if (workItem.length <= 0) {
        //     this.$store.dispatch(Constant.ADD_WORK_LIST, item)
        //   }
        //
        //   this.$router.push({path: '/homePage/resultClassification/' + item.SLOT_ID})
        //
        //   ipcRenderer.send(Constant.UPDATE_CHECKED_CELL, JSON.stringify({
        //     isChecked: 'Y',
        //     slotId: item.SLOT_ID
        //   }))
        //
        // } else {
        //   this.$modal.show(ModalInfo, {code: '99999', message: this.loadErrorMessage}, {
        //     height: 'auto',
        //     width: '550px'
        //   })
        // }
      },
      onClickClass (item) {
        var self = this
        var items = []
        items = this.dspTestList.filter(function(item, index) {
          return item.isSelected === 'Y'
        })

        console.log(items)
        if (items.length <= 0 && (item === 'Delete' || item === 'export XLSX' || item === 'Add to worklist')) {
          this.$modal.show(ModalInfo, {code: '99999', message: Constant.IDS_ERROR_SELECT_A_TARGET_ITEM}, {
            height: 'auto',
            width: '550px'
          })

          return
        }

        if (item === 'Classification') {
          if (this.loadErrorMessage === '') {
            this.$router.push({path: '/homePage/resultClassification/' + this.selectItem.SLOT_ID})
          } else {
            this.$modal.show(ModalInfo, {code: '99999', message: this.loadErrorMessage}, {
              height: 'auto',
              width: '550px'
            })
          }

        } else if (item === 'Delete') {
          this.$modal.show(ModalConfirm, {openType: Constant.DELETE_TEST_HISTORY, message: Constant.IDS_MSG_DELETE_THE_SELECTED_ITEMS}, {
            height: 'auto',
            width: '350px'
          })
        } else if (item === 'Add to worklist') {
          var isSaveWorkList = false

          console.log(items)
          console.log(this.workList)

          for (var i = 0; i < this.workList.length; i++) {
            for (var j = 0; j < items.length; j++) {
              if (this.workList[i].SLOT_ID === items[j].SLOT_ID) {
                isSaveWorkList = true
                break
              }
            }
          }

          if (isSaveWorkList) {
            this.$modal.show(ModalInfo, {code: '99999', message: Constant.IDS_ERROR_ALREADY_ADDED}, {
              height: 'auto',
              width: '550px'
            })

            return

          } else {
            this.$store.dispatch(Constant.ADD_WORK_LIST, items)

            this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        } else if (item === 'Edit order data') {
          console.log(this.selectItem)
          if (this.selectItem.SIGNED_STATE !== 'Signed') {
            this.$modal.show(ModalEditOrder, {item: this.selectItem}, {
              height: 'auto'
            }, {
              'before-open': this.beforeOpen,
              'before-close': this.beforeClose
            })

          } else {
            this.$toasted.show(Constant.IDS_SIGNED_ITEMS_CANNOT_BE_MODIFIED, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        } else if (item === 'Print') {
          if (this.loadErrorMessage === '') {
            if (this.rbcPrintState === 'Y') {
              var rootPath = this.settings.pbiaRootPath + '/' + this.selectItem.SLOT_ID
              var rbcPath = rootPath + '/' + this.settings.rbcImageDirName

              console.log(rbcPath)

              var files = fs.readdirSync(rbcPath).filter(function (file) {
                return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
              })

              var rbcImages = []
              files.forEach(function(item) {
                rbcImages.push('file://' + rbcPath + '/' + item)
              })

              console.log(rbcImages)
            }

            var html = this.$makePrintHtml(this.selectItem, this.classificationResult, this.rbcInfo, this.imgCount, rbcImages)
            this.$modal.show(ModalPrint, {item: html}, {
              width: '900',
              height: 'auto',
              scrollable: true
            })
            // this.drawPreview()
          } else {
            this.$modal.show(ModalInfo, {code: '99999', message: this.loadErrorMessage}, {
              height: 'auto',
              width: '550px'
            })
          }
        } else if (item === 'export XLSX') {
          this.onDownloadData('exportXlsx')
        }
      },
      // drawPreview () {
      //   console.log(this.selectItem)
      //   var self = this
      //   var serial = this.selectItem.SLOT_ID
      //   var testType = ''
      //   var gender = ''
      //
      //   if (this.selectItem.TEST_TYPE_CD === '01') {
      //     testType = 'Peripheral blood'
      //   } else if (this.selectItem.TEST_TYPE_CD === '02') {
      //     testType = 'Body fluid default'
      //   } else if (this.selectItem.TEST_TYPE_CD === '03') {
      //     testType = 'Body fluid select'
      //   } else if (this.selectItem.TEST_TYPE_CD === '04') {
      //     testType = 'Manual'
      //   }
      //
      //   if (this.selectItem.GENDER_CD === '01') {
      //     gender = 'Male'
      //   } else {
      //     gender = 'Female'
      //   }
      //   const html = `<span>&#60; Hospital &#62; &nbsp;&nbsp;</span>` +
      //                 `<span> DM Serial Nbr : ` + serial + `</span>` +
      //                 `<hr style="border-top: 1px dashed" />` +
      //                 `<div style="text-align: center; font-size: 19px;"> Analysis Report from UIMD PB system</div>` +
      //                 `<div class="userContainer" style="display: flex; flex-wrap: wrap; margin-top: 40px; font-size: 15px;">` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     `Slot ID` +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     this.selectItem.SLOT_ID +
      //                   `</div><br /><br />` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     `Ordered date` +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     this.$stringToDateTime(this.selectItem.ORDER_DTTM) +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     `Signed by ID` +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     this.selectItem.SIGNED_USER_ID +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     `Signed date` +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     this.$stringToDateTime(this.selectItem.SIGNED_DTTM) +
      //                   `</div><br /><br />` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     `Patient ID` +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     this.selectItem.PATIENT_ID +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     `Ordered Classification` +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     testType +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     `Name` +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     this.selectItem.PATIENT_NM +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     `Birth` +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     this.$stringToDate(this.selectItem.BIRTHDAY) +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     `Gender` +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     gender +
      //                   `</div><br /><br />` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     this.createRbcClassification() +
      //                   `</div>` +
      //                   `<div class="item" style="flex-basis: 50%;">` +
      //                     this.createWbcClassification() +
      //                   `</div>` +
      //                   `<div class="item">` +
      //                     this.drawWbcPrintImages() +
      //                   `</div>` +
      //                 `</div>`
      //
      //   this.$modal.show(ModalPrint, {item: html}, {
      //     width: '900',
      //     height: 'auto',
      //     scrollable: true
      //   })
      // },
      infiniteHandler($state) {
        var self = this
        var loadSize = self.MAX_LOAD_SIZE

        console.log('infiniteHandler')
        console.log(self.getClassificationItem)
        console.log(self.scrollCnt)

        if (self.getClassificationItem.item !== null && self.scrollCnt <= 0 ) {
          if (self.getClassificationItem.limit > 0) {
            loadSize = self.getClassificationItem.limit
          }
        }

        console.log(self.limit + ':' + loadSize)

        ipcRenderer.send(Constant.GET_TEST_HISTORY_LIST, JSON.stringify({
          limit: self.limit,
          size: loadSize,
          searchType: self.sSelected,
          searchText: self.searchText.replace(/ /g, ''),
          startDate: self.startDate,
          endDate: self.endDate,
          wbcClassList: self.wbcClassList,
          nrCount: self.nrCount,
          wbcTotalSortCd: self.wbcTotalSortCd
        }))

        // 주문내역 조회
        ipcRenderer.on(Constant.GET_TEST_HISTORY_LIST, function (event, result, err) {
          console.log(result)
          console.log(err)
          if (err) {
            self.$toasted.show(err.sqlMessage, {
              position: 'bottom-center',
              duration: '2000'
            })
            return
          }
          var barcodeList = []

          // normal 체크 조회시 하도록 수정
          result.forEach(function(slide) {
            if (slide.TEST_TYPE === 'PB') {
              var obj = self.$checkPbNormalCell(JSON.parse(slide.WBC_INFO))
              slide.IS_NORMAL = obj.isNormal
              slide.ABNORMAL = obj.class
            }

            barcodeList.push(slide.BARCODE_NO)
          })

          if (self.siteCd === '0007' && barcodeList.length > 0) {
            var params = {
              barcodeList: barcodeList
            }

            api.getWorkList_0007(params)
            .then(function (res) {
              console.log(res)
              if (res.data.errorCode === 'E0000') {
                var worksheet = res.data.results
                result.forEach(function(slide) {
                  var sheetItem = worksheet.find(function(sheet) {
                    return slide.BARCODE_NO === sheet.I01BARC
                  })

                  console.log(sheetItem)
                  if (typeof(sheetItem) !== 'undefined') {
                    slide.IS_WORK_SHEET = 'Y'
                    slide.JSDT = sheetItem.I03JSDT.trim()
                    slide.JSNO = sheetItem.I03JSNO.trim()
                    slide.KSDT = sheetItem.I03KSDT.trim()
                  } else {
                    slide.IS_WORK_SHEET = 'N'
                    slide.JSDT = ''
                    slide.JSNO = ''
                    slide.KSDT = ''
                  }
                })
              }

              console.log(result)

            }).catch(function (err) {
              console.log(err.message)
              // self.loadErrorMessage = err.message
            })
          }

          setTimeout(function() {
            if (self.isBarcodeScan) {
              self.isBarcodeScan = false

              $state.complete()
              self.onSearch()
            } else {
              if (result.length > 0) {
                self.scrollCnt++
                self.dspTestList = self.dspTestList.concat(result)
                self.limit += loadSize

                $state.loaded()
              } else {
                console.log('complete----------')
                $state.complete()
              }

              if (self.siteCd === '0007') {
                if (self.sortType === 'analysis') {
                  if (!self.isAnalyDesc) {
                    self.dspTestList.sort(function(a, b) {
                      return a.ANALYZE_DTTM - b.ANALYZE_DTTM
                    })
                  } else {
                    self.dspTestList.sort(function(a, b) {
                      return b.ANALYZE_DTTM - a.ANALYZE_DTTM
                    })
                  }
                } else {
                  if (!self.isBarcodeDesc) {
                    self.dspTestList.sort(function(a, b) {
                      return a.BARCODE_NO - b.BARCODE_NO
                    })
                  } else {
                    self.dspTestList.sort(function(a, b) {
                      return b.BARCODE_NO - a.BARCODE_NO
                    })
                  }
                }
              }

              // 이전 선택한 항목 포커싱
              self.$nextTick(function() {
                self.dspTestList.forEach(function(item, index) {
                  item.isSelected = 'N'
                })

                if (self.getClassificationItem.item !== null) {
                  var row = document.getElementById(self.getClassificationItem.item.SLOT_ID)

                  if (row !== null) {
                    self.onFocusRow(self.getClassificationItem.item)
                    row.focus()
                  } else {
                    // 검색 후 이전 선택한 항목 존재 하지 않으면 첫번째 row 포커스함
                    if (self.dspTestList.length > 0) {
                      self.onFocusRow(self.dspTestList[0])
                      var firstRow = document.getElementById(self.dspTestList[0].SLOT_ID)
                      if (firstRow) {
                        firstRow.focus()
                      }
                    }
                  }
                } else {
                  // 검색 후 이전 선택한 항목 존재 하지 않으면 첫번째 row 포커스함
                  if (self.dspTestList.length > 0) {
                    self.onFocusRow(self.dspTestList[0])
                    var firstRow = document.getElementById(self.dspTestList[0].SLOT_ID)
                    if (firstRow) {
                      firstRow.focus()
                    }
                  }
                }
              })
            }

          }, 500)

          ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY_LIST)
        })
      },
      onChangeAll (isSelect) {
        this.dspTestList.forEach(function(item, index) {
          item.isSelected = isSelect
        })

        this.$forceUpdate()
      },
      onDownloadData (path) {
        ipcRenderer.send('open-file-dialog-for-dir', path)
      },
      onDownloadDataMatrix (path) {
        ipcRenderer.send('open-file-dialog-for-dir', path)
      },
      onDownloadDataMatrixXlsx (path, modifyList) {
        console.log('onDownloadDataMatrixXlsx')
        var self = this
        var classList = []

        console.log(modifyList)

        // 엑셀의 workbook을 만든다
        var wb = XLSX.utils.book_new()

        modifyList.forEach(function(item, modifyIndex) {
          var xlsxArr = []
          var jsonResults = JSON.parse(item.Results)

          classList = self.classList(item.IS_NS_NB_INTEGRATION)

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

          // title line
          var titleArr = []
          titleArr.push(item.BARCODE_NO)

          classList.forEach(function (wbcClass, index) {
            titleArr.push(wbcClass.id + '_' + wbcClass.title)
          })

          titleArr.push('Total count')
          titleArr.push('Inaccuracy')
          titleArr.push('Accuracy')
          titleArr.push('Accuracy %')

          xlsxArr.push(titleArr)

          // data line
          var totalSum = 0
          var inaccuracySum = 0

          titleArr.forEach(function (titleData) {
            var dataArr = []

            classList.forEach(function (wbcClass) {
              if (titleData === (wbcClass.id + '_' + wbcClass.title)) {
                var isPush = false
                var totalCnt = 0
                var inAccuracyCnt = 0

                // left title
                dataArr.push(titleData)

                console.log(jsonResults)

                // 데이터 있는 row
                jsonResults.forEach(function (jsonResult) {
                  console.log(titleData.split('_')[0])
                  console.log(jsonResult.before)

                  var clsId = titleData.split('_')[0]
                  if (clsId === jsonResult.before) {
                    isPush = true

                    console.log('push')

                    classList.forEach(function (row) {
                      console.log(jsonResult[row.id])

                      dataArr.push(jsonResult[row.id])
                      totalCnt += jsonResult[row.id]
                      totalSum += jsonResult[row.id]

                      if (jsonResult.before !== row.id) {
                        inAccuracyCnt += jsonResult[row.id]
                        inaccuracySum += jsonResult[row.id]
                      }
                    })
                  }
                })

                if (isPush) {
                  dataArr.push(totalCnt)
                  dataArr.push(inAccuracyCnt)
                  dataArr.push(totalCnt - inAccuracyCnt)
                  dataArr.push((((totalCnt - inAccuracyCnt) / totalCnt) * 100).toFixed(2))

                  totalCnt = 0
                  inAccuracyCnt = 0
                } else {
                  // 데이터 없는 row
                  for (var i = 0; i < classList.length + 4; i++) {
                    dataArr.push(0)
                  }
                }

                xlsxArr.push(dataArr)

              }
            })
          })

          // total line
          var totalArr = []
          totalArr.push('Count')

          classList.forEach(function(classItem) {
            var classCount = 0
            jsonResults.forEach(function(jsonResult) {
              classCount += jsonResult[classItem.id]
            })

            totalArr.push(classCount)
          })

          totalArr.push(totalSum)
          totalArr.push(inaccuracySum)
          totalArr.push(totalSum - inaccuracySum)
          totalArr.push((((totalSum - inaccuracySum) / totalSum) * 100).toFixed(2))

          xlsxArr.push(totalArr)

          console.log(xlsxArr)

          try {

            var dataWS = XLSX.utils.aoa_to_sheet(xlsxArr)
            dataWS['!cols'] = [{wpx: 100}]

            // workbook에 워크시트 추가
            XLSX.utils.book_append_sheet(wb, dataWS, item.BARCODE_NO)

            if (modifyList.length === modifyIndex + 1) {
              // 엑셀 파일을 내보낸다.
              XLSX.writeFile(wb, path + '/' + self.$getFileNameDateTime() + '_aggr' + '.xlsx')

              self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                position: 'bottom-center',
                duration: '2000'
              })
            }

          } catch (err) {
            log.info(err)
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        })
      },
      onDownloadXlsx (path, arrayData, fileName) {
        console.log(arrayData)
        var self = this
        // console.log(this.classificationResult)
        var resultData = []

        arrayData.forEach(function(item, index) {
          var obj = {
            // 'CASSET_ID': item.CASSET_ID,
            'SERIAL_NO': item.SERIAL_NO,
            'BARCODE_NO': item.BARCODE_NO,
            'PATIENT_ID': item.PATIENT_ID,
            'PATIENT_NM': item.PATIENT_NM,
            // 'ORDER_DTTM': item.ORDER_DTTM,
            'MALARIA_COUNT': item.MALARIA_COUNT,
            'ANALYZE_DTTM': item.ANALYZE_DTTM,
            'TACT_TIME': item.TACT_TIME,
            'BIRTHDAY': item.BIRTHDAY,
            'GENDER': item.GENDER,
            // 'TEST_TYPE': item.TEST_TYPE,
            // 'SIGNED_STATE': item.SIGNED_STATE,
            // 'SIGNED_DTTM': item.SIGNED_DTTM,
            // 'SIGNED_USER_ID': item.SIGNED_USER_ID,
            'WBC_COMMENT': item.WBC_COMMENT,
            'RBC_COMMENT': item.RBC_COMMENT,
            'A_Neutrophil': item.A_Neutrophil,
            'B_Neutrophil': item.B_Neutrophil,
            'A_Neutrophil-Segmented': item.A_NeutrophilS,
            'B_Neutrophil-Segmented': item.B_NeutrophilS,
            'A_Neutrophil-Band': item.A_NeutrophilB,
            'B_Neutrophil-Band': item.B_NeutrophilB,
            'A_Metamyelocyte': item.A_Metamyelocyte,
            'B_Metamyelocyte': item.B_Metamyelocyte,
            'A_Myelocyte': item.A_Myelocyte,
            'B_Myelocyte': item.B_Myelocyte,
            'A_Promyelocyte': item.A_Promyelocyte,
            'B_Promyelocyte': item.B_Promyelocyte,
            'A_Lymphocyte': item.A_Lymphocyte,
            'B_Lymphocyte': item.B_Lymphocyte,
            'A_Reactive lymphocyte': item.A_Reactive_lymphocyte,
            'B_Reactive lymphocyte': item.B_Reactive_lymphocyte,
            'A_Abnormal lymphocyte': item.A_Abnormal_lymphocyte,
            'B_Abnormal lymphocyte': item.B_Abnormal_lymphocyte,
            'A_Monocyte': item.A_Monocyte,
            'B_Monocyte': item.B_Monocyte,
            'A_Eosinophil': item.A_Eosinophil,
            'B_Eosinophil': item.B_Eosinophil,
            'A_Basophil': item.A_Basophil,
            'B_Basophil': item.B_Basophil,
            'A_Blast': item.A_Blast,
            'B_Blast': item.B_Blast,
            'A_Plasma cell': item.A_Plasma_cell,
            'B_Plasma cell': item.B_Plasma_cell,
            'A_nRBC': item.A_nRBC,
            'B_nRBC': item.B_nRBC,
            'A_Giant platelet': item.A_Giant_platelet,
            'B_Giant platelet': item.B_Giant_platelet,
            'A_Platelet aggregation': item.A_Platelet_aggregation,
            'B_Platelet aggregation': item.B_Platelet_aggregation,
            'A_Artifact': item.A_Artifact,
            'B_Artifact': item.B_Artifact,
            'A_Malignant cell': item.A_Malignant_cell,
            'B_Malignant cell': item.B_Malignant_cell,
            'A_Mesothelial cell': item.A_Mesothelial_cell,
            'B_Mesothelial cell': item.B_Mesothelial_cell,
            // 'A_TOTAL': item.A_TOTAL,
            // 'B_TOTAL': item.B_TOTAL,
            'Size_Normal': item.Size_Normal,
            'Size_Macrocyte': item.Size_Macrocyte,
            'Size_Microcyte': item.Size_Microcyte,
            'Size_Anisocytosis': item.Size_Anisocytosis,
            'Chromia_Normal': item.Chromia_Normal,
            'Chromia_Hyperchromic': item.Chromia_Hyperchromic,
            'Chromia_Hypochromic': item.Chromia_Hypochromic,
            'Chromia_Polychromia': item.Chromia_Polychromia,
            'Shape_Normal': item.Shape_Normal,
            'Shape_Poikilocytosis': item.Shape_Poikilocytosis,
            'Shape_Target_Cell': item.Shape_Target_Cell,
            'Shape_Burr_Cell': item.Shape_Burr_Cell,
            'Shape_Acanthocyte': item.Shape_Acanthocyte,
            'Shape_Ovalocyte': item.Shape_Ovalocyte,
            'Shape_Schistocyte': item.Shape_Schistocyte,
            'Shape_Sickle_Cell': item.Shape_Sickle_Cell,
            'Shape_Stomatocyte': item.Shape_Stomatocyte,
            'Shape_Tear_Drop_cell': item.Shape_Tear_Drop_cell,
            'Shape_Spherocyte': item.Shape_Spherocyte,
            'Howell_Jolly_Body': item.Howell_Jolly_Body,
            'Basophilic_Stippling': item.Basophilic_Stippling
          }

          if (item.A_CUSTOM_90_NM !== '0') {
            obj[item.A_CUSTOM_90_NM] = item.A_CUSTOM_90_CNT
          }

          if (item.A_CUSTOM_91_NM !== '0') {
            obj[item.A_CUSTOM_91_NM] = item.A_CUSTOM_91_CNT
          }

          if (item.A_CUSTOM_92_NM !== '0') {
            obj[item.A_CUSTOM_92_NM] = item.A_CUSTOM_92_CNT
          }

          if (item.A_CUSTOM_93_NM !== '0') {
            obj[item.A_CUSTOM_93_NM] = item.A_CUSTOM_93_CNT
          }

          if (item.A_CUSTOM_94_NM !== '0') {
            obj[item.A_CUSTOM_94_NM] = item.A_CUSTOM_94_CNT
          }

          if (item.B_CUSTOM_90_NM !== '0') {
            obj[item.B_CUSTOM_90_NM] = item.B_CUSTOM_90_CNT
          }

          if (item.B_CUSTOM_91_NM !== '0') {
            obj[item.B_CUSTOM_91_NM] = item.B_CUSTOM_91_CNT
          }

          if (item.B_CUSTOM_92_NM !== '0') {
            obj[item.B_CUSTOM_92_NM] = item.B_CUSTOM_92_CNT
          }

          if (item.B_CUSTOM_93_NM !== '0') {
            obj[item.B_CUSTOM_93_NM] = item.B_CUSTOM_93_CNT
          }

          if (item.B_CUSTOM_94_NM !== '0') {
            obj[item.B_CUSTOM_94_NM] = item.B_CUSTOM_94_CNT
          }

          console.log(item)

          obj['A_TOTAL'] = Number(item.A_Neutrophil) + Number(item.A_NeutrophilS) + Number(item.A_NeutrophilB) +
            Number(item.A_Metamyelocyte) + Number(item.A_Myelocyte) + Number(item.A_Promyelocyte) + Number(item.A_Lymphocyte) +
            Number(item.A_Reactive_lymphocyte) + Number(item.A_Abnormal_lymphocyte) + Number(item.A_Monocyte) + Number(item.A_Eosinophil) +
            Number(item.A_Basophil) + Number(item.A_Blast) + Number(item.A_Plasma_cell) +
            Number(item.A_CUSTOM_90_CNT) + Number(item.A_CUSTOM_91_CNT) + Number(item.A_CUSTOM_92_CNT) +
            Number(item.A_CUSTOM_93_CNT) + Number(item.A_CUSTOM_94_CNT)

          obj['B_TOTAL'] = Number(item.B_Neutrophil) + Number(item.B_NeutrophilS) + Number(item.B_NeutrophilB) +
            Number(item.B_Metamyelocyte) + Number(item.B_Myelocyte) + Number(item.B_Promyelocyte) + Number(item.B_Lymphocyte) +
            Number(item.B_Reactive_lymphocyte) + Number(item.B_Abnormal_lymphocyte) + Number(item.B_Monocyte) + Number(item.B_Eosinophil) +
            Number(item.B_Basophil) + Number(item.B_Blast) + Number(item.B_Plasma_cell) +
            Number(item.B_CUSTOM_90_CNT) + Number(item.B_CUSTOM_91_CNT) + Number(item.B_CUSTOM_92_CNT) +
            Number(item.B_CUSTOM_93_CNT) + Number(item.B_CUSTOM_94_CNT)

          obj['A_Neutrophil_P'] = ((Number(item.A_Neutrophil) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Neutrophil_P'] = ((Number(item.B_Neutrophil) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_NeutrophilS_P'] = ((Number(item.A_NeutrophilS) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_NeutrophilS_P'] = ((Number(item.B_NeutrophilS) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_NeutrophilB_P'] = ((Number(item.A_NeutrophilB) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_NeutrophilB_P'] = ((Number(item.B_NeutrophilB) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Metamyelocyte_P'] = ((Number(item.A_Metamyelocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Metamyelocyte_P'] = ((Number(item.B_Metamyelocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Myelocyte_P'] = ((Number(item.A_Myelocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Myelocyte_P'] = ((Number(item.B_Myelocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Promyelocyte_P'] = ((Number(item.A_Promyelocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Promyelocyte_P'] = ((Number(item.B_Promyelocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Lymphocyte_P'] = ((Number(item.A_Lymphocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Lymphocyte_P'] = ((Number(item.B_Lymphocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Reactive_lymphocyte_P'] = ((Number(item.A_Reactive_lymphocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Reactive_lymphocyte_P'] = ((Number(item.B_Reactive_lymphocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Abnormal_lymphocyte_P'] = ((Number(item.A_Abnormal_lymphocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Abnormal_lymphocyte_P'] = ((Number(item.B_Abnormal_lymphocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Monocyte_P'] = ((Number(item.A_Monocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Monocyte_P'] = ((Number(item.B_Monocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Eosinophil_P'] = ((Number(item.A_Eosinophil) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Eosinophil_P'] = ((Number(item.B_Eosinophil) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Basophil_P'] = ((Number(item.A_Basophil) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Basophil_P'] = ((Number(item.B_Basophil) / obj['B_TOTAL']) * 100).toFixed(0)

          // after blast
          var aBlastPercent = ((Number(item.A_Blast) / obj['A_TOTAL']) * 100)
          if (aBlastPercent > 0 && aBlastPercent <= 1) {
            obj['A_Blast_P'] = 1
          } else {
            obj['A_Blast_P'] = ((Number(item.A_Blast) / obj['A_TOTAL']) * 100).toFixed(0)
          }
          // before blast
          var bBlastPercent = ((Number(item.B_Blast) / obj['B_TOTAL']) * 100)
          if (bBlastPercent > 0 && bBlastPercent <= 1) {
            obj['B_Blast_P'] = 1
          } else {
            obj['B_Blast_P'] = ((Number(item.B_Blast) / obj['B_TOTAL']) * 100).toFixed(0)
          }

          obj['A_Plasma_cell_P'] = ((Number(item.A_Plasma_cell) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Plasma_cell_P'] = ((Number(item.B_Plasma_cell) / obj['B_TOTAL']) * 100).toFixed(0)

          // after
          var aPercentArray = [
            {name: 'A_Neutrophil_P', percent: Number(obj['A_Neutrophil_P'])},
            {name: 'A_NeutrophilS_P', percent: Number(obj['A_NeutrophilS_P'])},
            {name: 'A_NeutrophilB_P', percent: Number(obj['A_NeutrophilB_P'])},
            {name: 'A_Metamyelocyte_P', percent: Number(obj['A_Metamyelocyte_P'])},
            {name: 'A_Myelocyte_P', percent: Number(obj['A_Myelocyte_P'])},
            {name: 'A_Promyelocyte_P', percent: Number(obj['A_Promyelocyte_P'])},
            {name: 'A_Lymphocyte_P', percent: Number(obj['A_Lymphocyte_P'])},
            {name: 'A_Reactive_lymphocyte_P', percent: Number(obj['A_Reactive_lymphocyte_P'])},
            {name: 'A_Abnormal_lymphocyte_P', percent: Number(obj['A_Abnormal_lymphocyte_P'])},
            {name: 'A_Monocyte_P', percent: Number(obj['A_Monocyte_P'])},
            {name: 'A_Eosinophil_P', percent: Number(obj['A_Eosinophil_P'])},
            {name: 'A_Basophil_P', percent: Number(obj['A_Basophil_P'])},
            {name: 'A_Plasma_cell_P', percent: Number(obj['A_Plasma_cell_P'])}
          ]

          var aPercentTotal = Number(obj['A_Neutrophil_P']) + Number(obj['A_NeutrophilS_P']) + Number(obj['A_NeutrophilB_P']) +
            Number(obj['A_Metamyelocyte_P']) + Number(obj['A_Myelocyte_P']) + Number(obj['A_Promyelocyte_P']) +
            Number(obj['A_Lymphocyte_P']) + Number(obj['A_Reactive_lymphocyte_P']) + Number(obj['A_Abnormal_lymphocyte_P']) +
            Number(obj['A_Monocyte_P']) + Number(obj['A_Eosinophil_P']) + Number(obj['A_Basophil_P']) + Number(obj['A_Blast_P']) +
            Number(obj['A_Plasma_cell_P'])

          if (item.A_CUSTOM_90_NM !== '0') {
            obj[item.A_CUSTOM_90_NM + '_P'] = ((item.A_CUSTOM_90_CNT) * 100).toFixed(0)
            aPercentArray.push({name: obj[item.A_CUSTOM_90_NM + '_P'], percent: Number(item.A_CUSTOM_90_CNT)})
            aPercentTotal += Number(obj[item.A_CUSTOM_90_NM + '_P'])
          }

          if (item.A_CUSTOM_91_NM !== '0') {
            obj[item.A_CUSTOM_91_NM + '_P'] = ((item.A_CUSTOM_91_CNT) * 100).toFixed(0)
            aPercentArray.push({name: obj[item.A_CUSTOM_91_NM + '_P'], percent: Number(item.A_CUSTOM_91_CNT)})
            aPercentTotal += Number(obj[item.A_CUSTOM_91_NM + '_P'])
          }

          if (item.A_CUSTOM_92_NM !== '0') {
            obj[item.A_CUSTOM_92_NM + '_P'] = ((item.A_CUSTOM_92_CNT) * 100).toFixed(0)
            aPercentArray.push({name: obj[item.A_CUSTOM_92_NM + '_P'], percent: Number(item.A_CUSTOM_92_CNT)})
            aPercentTotal += Number(obj[item.A_CUSTOM_92_NM + '_P'])
          }

          if (item.A_CUSTOM_93_NM !== '0') {
            obj[item.A_CUSTOM_93_NM + '_P'] = ((item.A_CUSTOM_93_CNT) * 100).toFixed(0)
            aPercentArray.push({name: obj[item.A_CUSTOM_93_NM + '_P'], percent: Number(item.A_CUSTOM_93_CNT)})
            aPercentTotal += Number(obj[item.A_CUSTOM_93_NM + '_P'])
          }

          if (item.A_CUSTOM_94_NM !== '0') {
            obj[item.A_CUSTOM_94_NM + '_P'] = ((item.A_CUSTOM_94_CNT) * 100).toFixed(0)
            aPercentArray.push({name: obj[item.A_CUSTOM_94_NM + '_P'], percent: Number(item.A_CUSTOM_94_CNT)})
            aPercentTotal += Number(obj[item.A_CUSTOM_94_NM + '_P'])
          }

          console.log(aPercentArray)
          console.log(aPercentTotal)

          var aMaxItem = null
          aPercentArray.forEach(function(afterItem) {
            if (aMaxItem === null) {
              aMaxItem = afterItem
            } else {
              if (aMaxItem.percent < afterItem.percent) {
                aMaxItem = afterItem
              }
            }
          })
          // 백분율 사사오입
          if (aMaxItem !== null) {
            obj[aMaxItem.name] = Number(aMaxItem.percent) + (100 - aPercentTotal)
          }

          // before
          var bPercentArray = [
            {name: 'B_Neutrophil_P', percent: Number(obj['B_Neutrophil_P'])},
            {name: 'B_NeutrophilS_P', percent: Number(obj['B_NeutrophilS_P'])},
            {name: 'B_NeutrophilB_P', percent: Number(obj['B_NeutrophilB_P'])},
            {name: 'B_Metamyelocyte_P', percent: Number(obj['B_Metamyelocyte_P'])},
            {name: 'B_Myelocyte_P', percent: Number(obj['B_Myelocyte_P'])},
            {name: 'B_Promyelocyte_P', percent: Number(obj['B_Promyelocyte_P'])},
            {name: 'B_Lymphocyte_P', percent: Number(obj['B_Lymphocyte_P'])},
            {name: 'B_Reactive_lymphocyte_P', percent: Number(obj['B_Reactive_lymphocyte_P'])},
            {name: 'B_Abnormal_lymphocyte_P', percent: Number(obj['B_Abnormal_lymphocyte_P'])},
            {name: 'B_Monocyte_P', percent: Number(obj['B_Monocyte_P'])},
            {name: 'B_Eosinophil_P', percent: Number(obj['B_Eosinophil_P'])},
            {name: 'B_Basophil_P', percent: Number(obj['B_Basophil_P'])},
            {name: 'B_Plasma_cell_P', percent: Number(obj['B_Plasma_cell_P'])}
          ]

          var bPercentTotal = Number(obj['B_Neutrophil_P']) + Number(obj['B_NeutrophilS_P']) + Number(obj['B_NeutrophilB_P']) +
            Number(obj['B_Metamyelocyte_P']) + Number(obj['B_Myelocyte_P']) + Number(obj['B_Promyelocyte_P']) +
            Number(obj['B_Lymphocyte_P']) + Number(obj['B_Reactive_lymphocyte_P']) + Number(obj['B_Abnormal_lymphocyte_P']) +
            Number(obj['B_Monocyte_P']) + Number(obj['B_Eosinophil_P']) + Number(obj['B_Basophil_P']) + Number(obj['B_Blast_P']) +
            Number(obj['B_Plasma_cell_P'])

          if (item.B_CUSTOM_90_NM !== '0') {
            obj[item.B_CUSTOM_90_NM + '_P'] = ((item.B_CUSTOM_90_CNT) * 100).toFixed(0)
            bPercentArray.push({name: obj[item.B_CUSTOM_90_NM + '_P'], percent: Number(item.B_CUSTOM_90_CNT)})
            bPercentTotal += Number(obj[item.B_CUSTOM_90_NM + '_P'])
          }

          if (item.B_CUSTOM_91_NM !== '0') {
            obj[item.B_CUSTOM_91_NM + '_P'] = ((item.B_CUSTOM_91_CNT) * 100).toFixed(0)
            bPercentArray.push({name: obj[item.B_CUSTOM_91_NM + '_P'], percent: Number(item.B_CUSTOM_91_CNT)})
            bPercentTotal += Number(obj[item.B_CUSTOM_91_NM + '_P'])
          }

          if (item.B_CUSTOM_92_NM !== '0') {
            obj[item.B_CUSTOM_92_NM + '_P'] = ((item.B_CUSTOM_92_CNT) * 100).toFixed(0)
            bPercentArray.push({name: obj[item.B_CUSTOM_92_NM + '_P'], percent: Number(item.B_CUSTOM_92_CNT)})
            bPercentTotal += Number(obj[item.B_CUSTOM_92_NM + '_P'])
          }

          if (item.B_CUSTOM_93_NM !== '0') {
            obj[item.B_CUSTOM_93_NM + '_P'] = ((item.B_CUSTOM_93_CNT) * 100).toFixed(0)
            bPercentArray.push({name: obj[item.B_CUSTOM_93_NM + '_P'], percent: Number(item.B_CUSTOM_93_CNT)})
            bPercentTotal += Number(obj[item.B_CUSTOM_93_NM + '_P'])
          }

          if (item.B_CUSTOM_94_NM !== '0') {
            obj[item.B_CUSTOM_94_NM + '_P'] = ((item.B_CUSTOM_94_CNT) * 100).toFixed(0)
            bPercentArray.push({name: obj[item.B_CUSTOM_94_NM + '_P'], percent: Number(item.B_CUSTOM_94_CNT)})
            bPercentTotal += Number(obj[item.B_CUSTOM_94_NM + '_P'])
          }

          console.log(bPercentArray)
          console.log(bPercentTotal)

          var bMaxItem = null
          bPercentArray.forEach(function(beforeItem) {
            if (bMaxItem === null) {
              bMaxItem = beforeItem
            } else {
              if (bMaxItem.percent < beforeItem.percent) {
                bMaxItem = beforeItem
              }
            }
          })
          // 백분율 사사오입
          if (bMaxItem !== null) {
            obj[bMaxItem.name] = Number(bMaxItem.percent) + (100 - bPercentTotal)
          }

          resultData.push(obj)

        })

        console.log(resultData)

        var dataWS = XLSX.utils.json_to_sheet(resultData)

        // 엑셀의 workbook을 만든다
        // workbook은 엑셀파일에 지정된 이름이다.
        var wb = XLSX.utils.book_new()
        // workbook에 워크시트 추가
        // 시트명은 'nameData'
        // XLSX.utils.book_append_sheet(wb, dataWS, '')
        XLSX.utils.book_append_sheet(wb, dataWS, '')
        // XLSX.utils.book_append_sheet(wb, wbcWS, '')
        // 엑셀 파일을 내보낸다.
        XLSX.writeFile(wb, path + '/' + fileName)
      },
      // Create callback function to receive barcode when the scanner is already done
      onBarcodeScanned (barcode) {
        console.log('onBarcodeScanned : ' + barcode)

        var self = this
        console.log(document.activeElement.id)

        // edit창에서 타이핑 search되는 이슈 수정
        if ((document.activeElement.id !== 'divSearchText') &&
            (document.activeElement.id !== 'barcodeNo') &&
            (document.activeElement.id !== 'patientId') &&
            (document.activeElement.id !== 'patientNm')) {
          this.sSelected = '02'
          this.searchText = barcode.replace('Enter', '')
          this.searchText = this.searchText.replace('Tab', '')
          this.searchText = this.searchText.replace(/ /g, '')
          this.isBarcodeScan = true

          this.onSearch()
        }
      },
      // Reset to the last barcode before hitting enter (whatever anything in the input box)
      resetBarcode () {
        let barcode = this.$barcodeScanner.getPreviousCode()
        console.log(barcode)
      },
      checkWorkList (slotId) {
        return this.workList.findIndex(function (lstItem) {
          return lstItem.SLOT_ID === slotId
        })
      }
    }
  }
</script>
<style>
  #resultPage {
    color: white;
  }
  #inputSearch {
    background-color: #333E52;
    height: 30px;
    color: white;
  }
  #btnSearch {
    height: 30px;
    font-size: 13px !important;
    line-height: 10px;
    width: 70px;
  }
  #btnClear {
    height: 30px;
    font-size: 13px !important;
    line-height: 10px;
    width: 70px;
  }
  #btnExport {
    height: 30px;
    font-size: 13px !important;
    line-height: 10px;
    width: 70px;
  }
  #tableResultList {
    margin-top: 5px;
    height: 815px;
    text-align: center;
    overflow: auto;
  }
  #tableResultList > table > tbody > tr:hover {
    background-color: #3F628C;
  }
  #tableResultList > table > tbody > tr:focus {
    background-color: #3F628C;
    outline: 0; /*remove outline*/
  }
  #tableResultList > table > thead > tr {
    color: white;
    font-size: 15px;
  }
  #tableResultList > table > tbody > tr {
    color: white;
    font-size: 15px;
  }
  #tableResultList > table > thead > tr > th {
    padding-bottom: 5px;
    padding-top: 5px;
    border-bottom: 1px solid;
    border-color: #2B455C;
  }
  #tableResultList > table > tbody > tr > td {
    padding-bottom: 5px;
    padding-top: 5px;
    font-size: 13px;
  }
  #error {
    color: red;
  }
  #divContents {
    font-size: 12px;
    color: gray;
  }
</style>
