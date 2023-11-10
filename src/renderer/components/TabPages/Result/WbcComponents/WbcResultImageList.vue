<template>
  <b-container id="wbcResultImageList" fluid @keyup="onKeyUp">
    <b-row>
      <b-col cols="3" class="ml-4">
        <b-form-checkbox v-model="isMarker" switch size="lg" @change="onChangeMarker">
          Cell marking
        </b-form-checkbox>
      </b-col>
      <b-col>
        <b-row>
          <!-- size -->
          <b-col cols="1">
            <img id="popoverSize" class="pointer mt-1 ml-3" src="~@/assets/result/size.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverSize"
              placement="bottom"
              title="Size"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="sliderValue"
                @drag-start="onSliderDragStart"
                @drag-end="onSliderDragEnd"
                :min="30"
                :width="150"
                :process-style="{ backgroundColor: '#20968E' }" />
            </b-popover>
          </b-col>
          <!-- <b-col>
            <vue-slider
              class="mt-2 mr-3"
              v-model="sliderValue"
              @drag-start="onSliderDragStart"
              @drag-end="onSliderDragEnd"
              :min="30"
              :width="150"
              :process-style="{ backgroundColor: '#20968E' }" />
          </b-col>
          <b-col class="float-left">
            <span class="border pl-3 pr-3 pt-1 pb-1"
              style="border-radius: 5px; background-color: #E2E2E2; color: black; font-size: 12px;">
              size {{ sliderValue }}%
            </span>
          </b-col> -->
          <!-- brightness -->
          <b-col cols="1">
            <img id="popoverBrightness" class="pointer mt-1 ml-3" src="~@/assets/result/brightness.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverBrightness"
              placement="bottom"
              title="Brightness"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="brightnessValue"
                :min="80"
                :max="150"
                :width="150"
                :process-style="{ backgroundColor: '#20968E' }" />
            </b-popover>
          </b-col>
          <!-- <b-col>
            <vue-slider
              class="mt-2 mr-3"
              v-model="brightnessValue"
              :min="80"
              :max="120"
              :width="150"
              :process-style="{ backgroundColor: '#20968E' }" />
          </b-col>
          <b-col class="float-left">
            <span class="border pl-3 pr-3 pt-1 pb-1"
              style="border-radius: 5px; background-color: #E2E2E2; color: black; font-size: 12px;">
              brightness {{ brightnessValue }}%
            </span>
          </b-col> -->

          <!-- RGB -->
          <b-col cols="1">
            <img id="popoverRGB" class="pointer mt-1 ml-3" src="~@/assets/result/rgb.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverRGB"
              placement="bottom"
              title="RGB"
              triggers="hover focus"
            >
              <vue-slider
                v-if="this.rgbClassSelected !== null"
                class="mt-2 mr-3"
                v-model="redValue"
                :min="0"
                :max="255"
                :width="180"
                :process-style="{ backgroundColor: 'red' }" />
              <vue-slider
                v-else
                disabled
                class="mt-2 mr-3"
                v-model="redValue"
                :min="0"
                :max="255"
                :width="180"
                :process-style="{ backgroundColor: 'red' }" />
              <vue-slider
                v-if="this.rgbClassSelected !== null"
                class="mt-2 mr-3"
                v-model="greenValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'green' }" />
              <vue-slider
                v-else
                disabled
                class="mt-2 mr-3"
                v-model="greenValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'green' }" />
              <vue-slider
                v-if="this.rgbClassSelected !== null"
                class="mt-2 mr-3"
                v-model="blueValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'blue' }" />
              <vue-slider
                v-else
                disabled
                class="mt-2 mr-3"
                v-model="blueValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'blue' }" />

              <b-form-select class="mt-2" v-model="rgbClassSelected">
                <b-form-select-option :value="null">Select a class</b-form-select-option>
                <b-form-select-option v-if="item.count > 0" v-for="item, index in drawClassList" :value="item" :key="index">
                  {{ item.title }}
                </b-form-select-option>
              </b-form-select>
              <b-button class="w-100 mt-2" variant="outline-primary" size="sm" @click="onRgbReset">Reset</b-button>
            </b-popover>
          </b-col>
          <b-col>
            <img class="pointer" src="~@/assets/result/excel.png"
              @click="onExport"
              style="width: 30px;"/>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="1">
        <span>
          <img class="pointer mt-1 ml-3" src="~@/assets/result/ic_circle_arrow.png" @click="onClickRollback" style="width: 25px; height: 25px;"/>
        </span>
      </b-col>
    </b-row>
    <b-row class="text-center mt-3" style="user-select: none;">
      <b-col class="pl-1 pb-2" v-for="item in drawClassList" :key="item.title" style="width: 50px;">
        <div v-if="item.count > 0" v-drag-target
          class="data-draggable-target position-relative pointer"
          :id="item.id + '_' + item.title"
          @click="onClickTab(item)"
          style="width: 50px; height: 50px;">
          <img src="~@/assets/result/class-tab-on.png" style="width: 50px; height: 50px;"/>
          <div class="classTab">
            <div style="font-size: 13px; line-height: 12px;">{{ item.title }}</div>
            <div style="font-size: 10px; line-height: 12px; color: #39F6CA;">{{ item.count }}</div>
          </div>
        </div>
        <div v-else v-drag-target
          class="data-draggable-target position-relative"
          :id="item.id + '_' + item.title"
          style="width: 50px; height: 50px;">
          <img src="~@/assets/result/class-tab-off.png" style="width: 50px; height: 50px;"/>
          <div class="classTab">
            <div id="title" style="font-size: 13px; line-height: 12px;">{{ item.title }}</div>
            <div style="font-size: 10px; line-height: 12px;"> - </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="pl-0 pr-0">
        <b-card id="wbcImageCard" class="blackCard" text-variant="white" no-body>
          <div id="wbcImageCardWrapper">
            <b-row v-if="item.count > 0" :id="item.name" v-for="item in drawClassList" :key="item.name">
              <b-col>
                <div id="imgTitle" class="userSelectNone pl-3" style="width: 220px;">
                  <b-form-checkbox
                    :id="'check' + item.name"
                    v-model="item.isSelectAll"
                    name="selectAll"
                    value="true"
                    unchecked-value="false"
                    @change="onChangeAll($event, item.name)"
                  >
                    <span id="imgClassName">{{ item.name }} ( {{ item.count }} )</span>
                  </b-form-checkbox>
                </div>
                <div v-if="selectedItem.SIGNED_STATE !== 'Signed'" v-drag-target :id="'area_' + item.id + '_' + item.title" class="data-draggable-target text-left mt-2" @wheel.ctrl="zoom">
                  <img @contextmenu.prevent="$refs.ctxMenu.open" class="pointer data-draggable-item" data-draggable="item"
                    v-for="image, index in item.images"
                    :id="'img' + item.title + index"
                    :key="index"
                    :src="image"
                    VLazyImage
                    @dragstart="onDragStart"
                    @dragend="onDragEnd"
                    @dblclick="onDbClick"
                    @load="onImgLoad"
                    signed="false"
                  />
                </div>
                <div v-else v-drag-target :id="'area_' + item.id + '_' + item.title" class="data-draggable-target text-left mt-2" @wheel.ctrl="zoom">
                  <img @contextmenu.prevent="$refs.ctxMenu.open" class="pointer data-draggable-item" data-draggable="item"
                    v-for="image, index in item.images"
                    :id="'img' + item.title + index"
                    :src="image"
                    :key="index"
                    @dragstart="onDragStart"
                    @dragend="onDragEnd"
                    @dblclick="onDbClick"
                    @load="onImgLoad"
                    signed="true"
                    style="width: 180px;" />
                </div>
              </b-col>
            </b-row>
          </div>

          <context-menu id="context-menu" ref="ctxMenu">
            <div style="font-size: 12px;">
              <li id="menuOptions" @click="onClickClass(item)" v-for="(item, index) in drawClassList" :key="item.id + '_' + item.title">
                <div class="p-2">
                  <div v-if="index < 9"> 0{{ index + 1 }}. {{ item.title }} </div>
                  <div v-else> {{ index + 1 }}. {{ item.title }} </div>
                </div>
              </li>
              <li id="menuOptions" @click="onExportImage">
                <div class="p-2">
                  <div>10. Export image</div>
                </div>
              </li>
            </div>
          </context-menu>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import contextMenu from 'vue-context-menu'
  import lodash from 'lodash'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/antd.css'
  // import worker from '../../../../workers/promise'
  import XLSX from 'xlsx'
  import Viewer from 'viewerjs'
  import api from '@/service'
  import VLazyImage from 'v-lazy-image/v2'

  // import { longClickDirective } from 'vue-long-click'
  // const longClickInstance = longClickDirective({delay: 400, interval: 50})
  // Vue.directive('longclick', longClickInstance)

  const ipcRenderer = require('electron').ipcRenderer

  const fs = require('fs')
  const path = require('path')
  const log = require('electron-log')

  export default {
    name: 'wbc-result-image-list',
    components: { contextMenu, VueSlider, VLazyImage },
    computed: {
      ...mapGetters({
        classList: Constant.GET_WBC_CLASS_LIST,
        bfClassList: Constant.GET_BF_WBC_CLASS_LIST,
        settings: Constant.GET_SETTINGS,
        commonCode: Constant.GET_COMMON_CODE,
        currentUser: Constant.GET_CURRENT_USER,
        getWbcImageHist: Constant.GET_WBC_IMAGE_HIST,
        orderId: Constant.GET_SELECT_ORDER_ID,
        getRgbValue: Constant.GET_RGB_VALUE,
      })
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        // 커스텀 클래스 최초 로딩시 D/P되지 않는 문제로
        // init 타이밍을 커스텀 클래스 로딩 이후로 변경
        ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)

        // 변경이력 다운로드
        ipcRenderer.send(Constant.GET_WBC_MODIFY_LIST, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
        ipcRenderer.send(Constant.GET_BF_MODIFY_LIST, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
      },
      sliderValue: function(newVal, oldVal) {
        var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
        var maxWidth = 360
        var offsetWidth = (maxWidth * (newVal / 100)).toFixed(0)

        for (var i = 0; i < images.length; i++) {
          if (offsetWidth >= 120) {
            images[i].style.width = offsetWidth + 'px'
            this.imgWidth = offsetWidth + 'px'
          } else {
            images[i].style.width = '120px'
            this.imgWidth = '120px'
          }
        }

        if (this.isMarker) {
          this.drawCellMarker()
        }

        this.$store.dispatch(Constant.SET_SIZE_SLIDE_VALUE, newVal)
      },
      orderId: function(newVal, oldVal) {
        this.$store.dispatch(Constant.INIT_WBC_IMAGE_HIST, null)
      },
      rgbClassSelected: function(newVal, oldVal) {
        var self = this

        if (self.rgbClassSelected !== null) {
          const rgbValue = this.getRgbValue.find(function(item) {
            return item.id === self.rgbClassSelected.id
          })

          console.log(rgbValue)

          if (typeof(rgbValue) !== 'undefined') {
            this.redValue = rgbValue.redValue
            this.greenValue = rgbValue.greenValue
            this.blueValue = rgbValue.blueValue
          } else {
            this.redValue = 0
            this.greenValue = 0
            this.blueValue = 0
          }
        }
      },
      brightnessValue: function(newVal, oldVal) {
        // var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
        //
        // for (var i = 0; i < images.length; i++) {
        //   images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
        // }

        this.$store.dispatch(Constant.SET_BRIGHTNESS_SLIDE_VALUE, newVal)
        this.setRgbColor()
      },
      redValue: function(newVal, oldVal) {
        if (this.rgbClassSelected !== null) {
          // var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
          var images = document.getElementById('area_' + this.rgbClassSelected.id + '_' + this.rgbClassSelected.title).querySelectorAll('img')
          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = newVal
          rgbItem.greenValue = this.greenValue
          rgbItem.blueValue = this.blueValue
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)
        }
        // else {
        //   this.$toasted.show(Constant.IDS_PLEASE_SELECT_A_CLASS, {
        //     position: 'bottom-center',
        //     duration: '2000'
        //   })
        // }

      },
      greenValue: function(newVal, oldVal) {
        if (this.rgbClassSelected !== null) {
          // var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
          var images = document.getElementById('area_' + this.rgbClassSelected.id + '_' + this.rgbClassSelected.title).querySelectorAll('img')
          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = this.redValue
          rgbItem.greenValue = newVal
          rgbItem.blueValue = this.blueValue
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)
          // this.$store.dispatch(Constant.SET_GREEN_VALUE, newVal)
        }
        // else {
        //   this.$toasted.show(Constant.IDS_PLEASE_SELECT_A_CLASS, {
        //     position: 'bottom-center',
        //     duration: '2000'
        //   })
        // }
      },
      blueValue: function(newVal, oldVal) {
        if (this.rgbClassSelected !== null) {
          // var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
          var images = document.getElementById('area_' + this.rgbClassSelected.id + '_' + this.rgbClassSelected.title).querySelectorAll('img')
          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = this.redValue
          rgbItem.greenValue = this.greenValue
          rgbItem.blueValue = newVal
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)
          // this.$store.dispatch(Constant.SET_BLUE_VALUE, newVal)
        }
        // else {
        //   this.$toasted.show(Constant.IDS_PLEASE_SELECT_A_CLASS, {
        //     position: 'bottom-center',
        //     duration: '2000'
        //   })
        // }
      }
    },
    data () {
      return {
        mousePosition: [],
        drawClassList: [],
        totalCount: 0,
        selectedItem: {},
        signedState: '',
        isSlidShow: true,
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        sliderValue: 50,
        brightnessValue: 100,
        redValue: 0,
        greenValue: 0,
        blueValue: 0,
        imgWidth: 180,
        // 되돌리기 position
        curPos: 0,
        // 세포 마킹 영역 표시
        isMarker: false,
        markerPosition: null,
        moveCnt: 0,
        // 최초 분석결과 저장
        // firstClassList: null,

        // 변경 이력 집계
        modifyClassificationList: null,
        modifyBfClassificationList: null,

        wbcCustomClass: [],
        wbcHotKey: [],
        bfHotKey: [],
        rgbClassSelected: null,
        imgLoadCount: 0
      }
    },
    beforeDestroy () {
      this.$off('APPEND_CHILD')
      this.$off('APPEND_TAB')
      this.EventBus.$off('SLIDE_STATE_CHANGE')
      this.EventBus.$off('REMOVE_MARKER')
      this.EventBus.$off('UPDATE_REPORT')
      this.EventBus.$off('UPDATE_WBC_IMAGES')

      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      ipcRenderer.removeAllListeners(Constant.GET_WBC_MODIFY_LIST)
      ipcRenderer.removeAllListeners(Constant.GET_BF_MODIFY_LIST)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_HOT_KEY)
      ipcRenderer.removeAllListeners(Constant.SELECT_BF_HOT_KEY)

      // ipcRenderer.removeAllListeners(Constant.GET_WBC_CELL_POSITION)
      // ipcRenderer.removeAllListeners('selected-dir')
    },
    mounted () {
      var self = this

      log.info('wbcResultImageList mounted')

      this.$nextTick(function () {
        // 이미지 변경 내역 초기화
        this.$store.dispatch(Constant.INIT_WBC_IMAGE_HIST, null)

        // 세포 영역 표시
        this.isMarker = this.settings.isMarker
        this.sliderValue = this.settings.sizeSildeValue
        this.brightnessValue = this.settings.brightnessSlideValue

        log.info(this.isMarker)

        // ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)
        ipcRenderer.send(Constant.SELECT_WBC_HOT_KEY)
        ipcRenderer.send(Constant.SELECT_BF_HOT_KEY)

        // custom class
        ipcRenderer.on(Constant.SELECT_WBC_CUSTOM_CLASS, function (event, results) {
          self.wbcCustomClass = results
          self.initElement()
        })

        ipcRenderer.on(Constant.SELECT_WBC_HOT_KEY, function (event, results) {
          self.wbcHotKey = results
        })

        ipcRenderer.on(Constant.SELECT_BF_HOT_KEY, function (event, results) {
          self.bfHotKey = results
        })

        // WBC 변경 이력 집계
        ipcRenderer.on(Constant.GET_WBC_MODIFY_LIST, function (event, result) {
          self.modifyClassificationList = result
          console.log(self.modifyClassificationList)
        })

        // BF 변경 이력 집계
        ipcRenderer.on(Constant.GET_BF_MODIFY_LIST, function (event, result) {
          self.modifyBfClassificationList = result
          console.log(self.modifyBfClassificationList)
        })

        // ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
        //   self.selectedItem = result
        //   console.log(self.selectedItem)
        //
        //   self.loadClassificationImages()
        //   self.markerPosition = self.loadMarkerPosition()
        //   // 스크롤 위치 초기화
        //   document.getElementById('wbcImageCardWrapper').scrollTo(0, 0)
        //   // rgb select 초기화
        //   self.rgbClassSelected = null
        //   self.redValue = 0
        //   self.greenValue = 0
        //   self.blueValue = 0
        //
        // })

        ipcRenderer.on('selected-dir', function (event, results) {
          log.info('selected-dir')
          log.info(results)

          if (results.pathType === 'exportResult') {
            self.onDownloadData(self.$replaceAll(results.path, '\\', '/'))

          } else if (results.pathType === 'wbcClassificationImage') {

            for (var len = self.$getSelectrions().items.length, i = 0; i < len; i++) {
              if (self.$getSelectrions().owner !== null) {
                var src = self.$getSelectrions().items[i].currentSrc
                var url = src.split('/')
                var targetFileName = url[url.length - 1]
                var path = src.replace('file:///', '')

                fs.copyFile(path, results.path + '/' + targetFileName, function(err) {
                  if (!err) {
                    self.$toasted.show(Constant.IDS_DOWNLOAD_COMPLETE, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }
                })
              }
            }
          }
        })

        this.$on('APPEND_CHILD', function(fileParams) {
          log.info(fileParams)

          var maxSize = fileParams.data.maxSize
          var url = fileParams.data.image.currentSrc.split('/')
          var fileName = url[url.length - 1]
          var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
          var classDirName = null

          if (self.selectedItem.TEST_TYPE === '01' || self.selectedItem.TEST_TYPE === '04') {
            classDirName = self.settings.wbcClassDirName
          } else {
            classDirName = self.settings.bfClassDirName
          }

          var srcId = fileParams.data.srcId.replace('area_', '')
          var targetId = fileParams.data.targetId.replace('area_', '')

          var srcPath = rootPath + '/' + classDirName + '/' + srcId + '/' + fileName
          var destPath = rootPath + '/' + classDirName + '/' + targetId + '/' + fileName

          // 파일 폴더 이동
          var params = {
            srcPath: srcPath,
            destPath: destPath
          }

          self.EventBus.$emit('OVERLAY', {state: true})
          api.moveFile(params).then(function (res) {
             log.info(res)
             self.moveCnt++

             var targetSectionName = ''

             // change models
             self.drawClassList.forEach(function(item) {
               // delete
               if (srcId.includes(item.id)) {
                 item.count--
                 item.images.splice(item.images.indexOf('file://' + srcPath), 1)
               }

               // insert
               if (targetId.includes(item.id)) {
                 item.count++
                 item.images.splice(fileParams.data.index, 0, 'file://' + destPath)
                 targetSectionName = item.name
               }
             })

             // WBC 이미지 변경 로그 저장 (rollback)
             var histObj = {}
             histObj.userId = self.currentUser.userId
             histObj.modifyDttm = self.$getDateTime()
             histObj.seqNo = self.$getUuid()
             histObj.srcPath = srcPath
             histObj.destPath = destPath
             histObj.groupId = fileParams.data.groupId

             self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)

             // LBK_20230202 : update image hist [
             // var srcClassId = srcId.substr(0, 2)
             var destClassId = targetId.substr(0, 2)

             log.info(self.selectedItem)
             ipcRenderer.send(Constant.UPDATE_IMAGE_HIST, JSON.stringify({
               cassetId: self.selectedItem.CASSET_ID,
               slotId: self.selectedItem.SLOT_ID,
               destClassId: destClassId,
               fileName: fileName
             }))
             // update image hist ]

             // complete move files
             if (self.moveCnt === maxSize) {
               self.$nextTick(function () {
                 setTimeout(function() {
                   self.moveCnt = 0

                   // 이미지 조정후 이동시 사이즈 동일하게 조정
                   // 2021_09_02_LBK : brightness 조정
                   var images = document.getElementById(targetSectionName).querySelectorAll('img')

                   self.drawClassList.forEach(function(classItem) {
                     if (classItem.name === targetSectionName) {
                       for (var i = 0; i < images.length; i++) {
                         if (typeof(classItem.imgWidth) !== 'undefined') {
                           images[i].style.width = classItem.imgWidth
                         } else {
                           images[i].style.width = self.imgWidth
                         }
                       }
                     }
                   })

                   // marker
                   if (self.isMarker) {
                     self.drawCellMarker()
                   }

                   // update hist
                   self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(self.drawClassList))
                   self.EventBus.$emit('OVERLAY', {state: false})

                   // drag 활성화
                   self.$initDrag()
                   self.setRgbColor()
                 })
               })
             }
           }).catch(function (err) {
             log.info(err.message)

             // draw cell marker
             setTimeout(function() {
               if (self.isMarker) {
                 self.drawCellMarker()
                 self.moveCnt = 0
               }
               self.EventBus.$emit('OVERLAY', {state: false})
               self.$toasted.show(err.message, {
                 position: 'bottom-center',
                 duration: '2000'
               })
             }, 0)

           })
        })

        this.$on('APPEND_TAB', function(fileParams) {
          var maxSize = fileParams.data.maxSize
          var url = fileParams.data.image.currentSrc.split('/')
          var fileName = url[url.length - 1]
          var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
          var classDirName = null

          if (self.selectedItem.TEST_TYPE === '01' || self.selectedItem.TEST_TYPE === '04') {
            classDirName = self.settings.wbcClassDirName
          } else {
            classDirName = self.settings.bfClassDirName
          }

          var srcId = fileParams.data.srcId.replace('area_', '')
          var targetId = fileParams.data.targetId.replace('area_', '')

          var srcPath = rootPath + '/' + classDirName + '/' + srcId + '/' + fileName
          var destPath = rootPath + '/' + classDirName + '/' + targetId + '/' + fileName

          // 파일 폴더 이동
          var params = {
            srcPath: srcPath,
            destPath: destPath
          }

          self.EventBus.$emit('OVERLAY', {state: true})
          api.moveFile(params).then(function (res) {
             log.info(res)
             self.moveCnt++

             var targetSectionName = ''

             // change models
             self.drawClassList.forEach(function(item) {
               // delete
               if (srcId.includes(item.id)) {
                 item.count--
                 item.images.splice(item.images.indexOf('file://' + srcPath), 1)
               }

               // insert
               if (targetId.includes(item.id)) {
                 item.count++
                 item.images.splice(fileParams.data.index, 0, 'file://' + destPath)
                 targetSectionName = item.name
               }
             })

             // WBC 이미지 변경 로그 저장 (rollback)
             var histObj = {}
             histObj.userId = self.currentUser.userId
             histObj.modifyDttm = self.$getDateTime()
             histObj.seqNo = self.$getUuid()
             histObj.srcPath = srcPath
             histObj.destPath = destPath
             histObj.groupId = fileParams.data.groupId

             self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)

             // LBK_20230202 : update image hist [
             // var srcClassId = srcId.substr(0, 2)
             var destClassId = targetId.substr(0, 2)

             log.info(self.selectedItem)
             ipcRenderer.send(Constant.UPDATE_IMAGE_HIST, JSON.stringify({
               cassetId: self.selectedItem.CASSET_ID,
               slotId: self.selectedItem.SLOT_ID,
               destClassId: destClassId,
               fileName: fileName
             }))
             // update image hist ]

             // complete move files
             if (self.moveCnt === maxSize) {
               self.$nextTick(function () {
                 setTimeout(function() {
                   self.moveCnt = 0

                   // 이미지 조정후 이동시 사이즈 동일하게 조정
                   // 2021_09_02_LBK : brightness 조정
                   var images = document.getElementById(targetSectionName).querySelectorAll('img')

                   self.drawClassList.forEach(function(classItem) {
                     if (classItem.name === targetSectionName) {
                       for (var i = 0; i < images.length; i++) {
                         if (typeof(classItem.imgWidth) !== 'undefined') {
                           images[i].style.width = classItem.imgWidth
                         } else {
                           images[i].style.width = self.imgWidth
                         }
                       }
                     }
                   })

                   // marker
                   if (self.isMarker) {
                     self.drawCellMarker()
                   }

                   // update hist
                   self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(self.drawClassList))
                   self.EventBus.$emit('OVERLAY', {state: false})

                   // drag 활성화
                   self.$initDrag()
                   self.setRgbColor()
                 })
               })
             }
           }).catch(function (err) {
             log.info(err.message)

             // draw cell marker
             setTimeout(function() {
               if (self.isMarker) {
                 self.drawCellMarker()
                 self.moveCnt = 0
               }
               self.EventBus.$emit('OVERLAY', {state: false})
               self.$toasted.show(err.message, {
                 position: 'bottom-center',
                 duration: '2000'
               })
             }, 0)

           })

          // self.moveFile(params, targetFileName, 'APPEND_TAB').then(function(ret) {
          //   self.moveCnt++
          //   if (self.moveCnt === params.data.maxSize) {
          //     self.$nextTick(function () {
          //       // draw cell marker
          //       setTimeout(function() {
          //         if (self.isMarker) {
          //           self.drawCellMarker()
          //           self.moveCnt = 0
          //         }
          //         self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(ret))
          //         self.moveCnt = 0
          //         self.EventBus.$emit('OVERLAY', {state: false})
          //       }, 0)
          //     })
          //   }
          // }).catch(function (err) {
          //   console.log(err)
          //   self.$nextTick(function () {
          //     // draw cell marker
          //     setTimeout(function() {
          //       if (self.isMarker) {
          //         self.drawCellMarker()
          //         self.moveCnt = 0
          //       }
          //     }, 0)
          //     self.EventBus.$emit('OVERLAY', {state: false})
          //   })
          // })

        })

        this.EventBus.$on('SLIDE_STATE_CHANGE', function(state) {
          setTimeout(function () {
            self.isSlidShow = state
            if (self.isMarker) {
              self.drawCellMarker()
            }

            // classification 숨기기시 스크롤 동작 오류 수정
            window.dispatchEvent(new Event('resize'))
          }, 10)
        })

        this.EventBus.$on('REMOVE_MARKER', function(state) {
          self.removeMarker()
        })

        this.EventBus.$on('UPDATE_WBC_IMAGES', function(state) {
          self.loadClassificationImages()

          setTimeout(function () {
            if (self.isMarker) {
              self.drawCellMarker()
            }
          }, 100)
        })
      })
    },
    methods: {
      initElement () {
        var self = this

        this.loadClassificationImages()

        // this.firstClassList = this.loadClassificationImages()
        // this.markerPosition = this.loadMarkerPosition()

        // 스크롤 위치 초기화
        document.getElementById('wbcImageCardWrapper').scrollTo(0, 0)

        // rgb select 초기화
        this.rgbClassSelected = null
        this.redValue = 0
        this.greenValue = 0
        this.blueValue = 0

        // this.EventBus.$emit('OVERLAY', {state: true})
      },
      createMatrix () {
        var self = this

        log.info('createMatrix')
        log.info(this.selectedItem)
        log.info(this.drawClassList)
      },
      onImgLoad (evt) {
        var self = this
        this.imgLoadCount++

        if (this.totalCount <= this.imgLoadCount) {
          this.imgLoadCount = 0
          if (this.isMarker) {
            this.drawCellMarker()
          }

          // this.EventBus.$emit('OVERLAY', {state: false})
          this.EventBus.$emit('WBC_IMG_LOADED')
        }
      },
      onExport () {
        ipcRenderer.send(Constant.GET_WBC_MODIFY_LIST, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
        ipcRenderer.send(Constant.GET_BF_MODIFY_LIST, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))

        setTimeout(function () {
          ipcRenderer.send('open-file-dialog-for-dir', 'exportResult')
        }, 500)
      },
      onDownloadData (path) {
        console.log('onDownloadData')
        var self = this
        var xlsxArr = []
        var classList = null
        var modifyList = null

        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          classList = this.classList(this.selectedItem.IS_NS_NB_INTEGRATION)
          modifyList = this.modifyClassificationList
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
          classList = this.bfClassList
          modifyList = this.modifyBfClassificationList
        }

        console.log(classList)
        console.log(modifyList)

        // title line
        var titleArr = []
        titleArr.push(this.selectedItem.BARCODE_NO)

        classList.forEach(function (item, index) {
          titleArr.push(item.id + '_' + item.title)
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

              // 데이터 있는 row
              modifyList.forEach(function (modifyItem) {
                log.info(titleData)
                log.info( modifyItem.CLASS_ID + '_' + modifyItem.CLASS_TITLE)

                if (titleData === modifyItem.CLASS_ID + '_' + modifyItem.CLASS_TITLE) {
                  isPush = true

                  classList.forEach(function (row) {
                    log.info(row)
                    log.info(modifyItem)

                    dataArr.push(modifyItem[row.id])
                    totalCnt += modifyItem[row.id]
                    totalSum += modifyItem[row.id]

                    if (modifyItem.CLASS_ID !== row.id) {
                      inAccuracyCnt += modifyItem[row.id]
                      inaccuracySum += modifyItem[row.id]
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

              log.info(dataArr)
              xlsxArr.push(dataArr)
            }
          })
        })

        // total line
        var totalArr = []
        totalArr.push('Count')

        classList.forEach(function(classItem) {
          var classCount = 0
          modifyList.forEach(function(modifyItem) {
            classCount += modifyItem[classItem.id]
          })

          totalArr.push(classCount)
        })

        totalArr.push(totalSum)
        totalArr.push(inaccuracySum)
        totalArr.push(totalSum - inaccuracySum)
        totalArr.push((((totalSum - inaccuracySum) / totalSum) * 100).toFixed(2))

        xlsxArr.push(totalArr)

        try {
          var dataWS = XLSX.utils.aoa_to_sheet(xlsxArr)
          // dataWS['C3'].s = {'border': '1px'}
          dataWS['!cols'] = [{wpx: 100}]
          // dataWS.cell(1, 1).string('cell conte').style = {
          //   fill: {
          //     patternType: "solid",
          //     bgColor: { rgb : "C6EFCE" },
          //     fgColor: { rgb : "C6EFCE" }
          //   }
          // }

          // 엑셀의 workbook을 만든다
          var wb = XLSX.utils.book_new()

          // workbook에 워크시트 추가
          XLSX.utils.book_append_sheet(wb, dataWS, '')

          // 엑셀 파일을 내보낸다.
          XLSX.writeFile(wb, path + '/' + self.$getFileNameDateTime() + '_aggr' + '.xlsx')

          this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            position: 'bottom-center',
            duration: '2000'
          })
        } catch (err) {
          log.info(err)
          this.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      },
      onRgbReset () {
        // this.redValue = 0
        // this.greenValue = 0
        // this.blueValue = 0
        //
        // this.$store.dispatch(Constant.SET_RED_VALUE, 0)
        // this.$store.dispatch(Constant.SET_GREEN_VALUE, 0)
        // this.$store.dispatch(Constant.SET_BLUE_VALUE, 0)
        if (this.rgbClassSelected !== null) {

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = 0
          rgbItem.greenValue = 0
          rgbItem.blueValue = 0

          this.redValue = 0
          this.greenValue = 0
          this.blueValue = 0
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)

        } else {
          this.$toasted.show(Constant.IDS_PLEASE_SELECT_A_CLASS, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      },
      onDbClick (evt) {
        var divNode = document.createElement('div')

        this.$getSelectrions().items.forEach(function (item) {
          var clone = item.cloneNode(false)
          divNode.appendChild(clone)
        })

        const viewer = new Viewer(divNode, {maxZoomRatio: 2})
        viewer.show()

        viewer.options.hide = function(e) {
          this.viewer.destroy()
          divNode = null
        }
      },
      onKeyUp (evt) {
        log.info(evt)
        log.info(evt.key.toLowerCase())
        var self = this
        var key = evt.key.toLowerCase()
        // var classList = null
        var targetItem = null
        var hotKey = null

        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          hotKey = this.wbcHotKey
        } else {
          hotKey = this.bfHotKey
        }

        hotKey.forEach(function (item, index) {
          if (item.HOT_KEY === evt.key.toLowerCase()) {
            self.removeMarker()
            targetItem = item
          }
        })

        log.info(targetItem)
        if (targetItem !== null) {
          for (var len = self.$getSelectrions().items.length, i = 0; i < len; i++) {
            if (self.$getSelectrions().owner !== null) {

              var maxSize = len
              var url = self.$getSelectrions().items[i].currentSrc.split('/')
              var fileName = url[url.length - 1]
              var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
              var classDirName = null

              if (self.selectedItem.TEST_TYPE === '01' || self.selectedItem.TEST_TYPE === '04') {
                classDirName = self.settings.wbcClassDirName
              } else {
                classDirName = self.settings.bfClassDirName
              }

              var srcId = (this.$getSelectrions().owner.id).replace('area_', '')
              var targetId = (targetItem.CLASS_ID + '_' + targetItem.CLASS_TITLE).replace('area_', '')
              var srcPath = rootPath + '/' + classDirName + '/' + srcId + '/' + fileName
              var destPath = rootPath + '/' + classDirName + '/' + targetId + '/' + fileName

              self.EventBus.$emit('OVERLAY', {state: true})

              // 파일 폴더 이동
              var params = {
                srcPath: srcPath,
                destPath: destPath
              }

              api.moveFile(params).then(function(ret) {
                self.moveCnt++

                var targetSectionName = ''

                // change models
                self.drawClassList.forEach(function(item) {
                  // delete
                  if (srcId.includes(item.id)) {
                    item.count--
                    item.images.splice(item.images.indexOf('file://' + ret.srcPath), 1)
                  }

                  // insert
                  if (targetId.includes(item.id)) {
                    item.count++
                    item.images.splice(0, 0, 'file://' + ret.destPath)
                    targetSectionName = item.name
                  }
                })

                // WBC 이미지 변경 로그 저장 (rollback)
                var histObj = {}
                histObj.userId = self.currentUser.userId
                histObj.modifyDttm = self.$getDateTime()
                histObj.seqNo = self.$getUuid()
                histObj.srcPath = srcPath
                histObj.destPath = destPath
                histObj.groupId = self.$getUuid()

                self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)

                // LBK_20230202 : update image hist [
                // var srcClassId = srcId.substr(0, 2)
                var destClassId = targetId.substr(0, 2)

                log.info(self.selectedItem)
                ipcRenderer.send(Constant.UPDATE_IMAGE_HIST, JSON.stringify({
                  cassetId: self.selectedItem.CASSET_ID,
                  slotId: self.selectedItem.SLOT_ID,
                  destClassId: destClassId,
                  fileName: fileName
                }))
                // update image hist ]

                // complete move files
                if (self.moveCnt === maxSize) {
                  self.$nextTick(function () {
                    setTimeout(function() {
                      self.moveCnt = 0

                      // 이미지 조정후 이동시 사이즈 동일하게 조정
                      // 2021_09_02_LBK : brightness 조정
                      var images = document.getElementById(targetSectionName).querySelectorAll('img')

                      self.drawClassList.forEach(function(classItem) {
                         if (classItem.name === targetSectionName) {
                           for (var i = 0; i < images.length; i++) {
                             if (typeof(classItem.imgWidth) !== 'undefined') {
                               images[i].style.width = classItem.imgWidth
                             } else {
                               images[i].style.width = self.imgWidth
                             }
                           }
                         }
                       })

                       // marker
                       if (self.isMarker) {
                         self.drawCellMarker()
                       }

                       // update hist
                       self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(self.drawClassList))
                       self.EventBus.$emit('OVERLAY', {state: false})

                       // drag 활성화
                       self.$initDrag()
                       self.setRgbColor()
                    })
                  })
                }

              }).catch(function (err) {
                log.info(err)

                // draw cell marker
                setTimeout(function() {
                  if (self.isMarker) {
                    self.drawCellMarker()
                    self.moveCnt = 0
                  }
                  self.EventBus.$emit('OVERLAY', {state: false})
                  self.$toasted.show(err.message, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }, 0)

              })
            } else {
              self.$toasted.show(Constant.IDS_ERROR_SELECT_A_TARGET_ITEM, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          }
        }
      },
      onChangeAll (state, id) {
        log.info('onChangeAll')
        var images = document.getElementById(id).querySelectorAll('img')
        var parent = images[0].parentNode

        log.info(this.drawClassList)
        log.info(id)

        for (var i = 0; i < this.drawClassList.length; i++) {
          if (this.drawClassList[i].name !== id) {
            this.drawClassList[i].isSelectAll = false
          }
        }

        // 전체 해제
        const mousedownEvent = new MouseEvent('mousedown', {bubbles: true, cancelable: true, shiftKey: false})
        const mouseupEvent = new MouseEvent('mouseup', {bubbles: true, cancelable: true, shiftKey: false})

        parent.dispatchEvent(mousedownEvent)
        parent.dispatchEvent(mouseupEvent)

        // shift + mousedown + mouseup
        if (state === 'true') {
          log.info('state true')
          for (var i = 0; i < images.length; i++) {
            const mousedownEvent = new MouseEvent('mousedown', {bubbles: true, cancelable: true, shiftKey: true})
            const mouseupEvent = new MouseEvent('mouseup', {bubbles: true, cancelable: true, shiftKey: true})

            images[i].dispatchEvent(mousedownEvent)
            images[i].dispatchEvent(mouseupEvent)
          }
        }
      },
      loadMarkerPosition (evt) {
        var rootPath = this.settings.pbiaRootPath + '/' + this.orderId

        log.info(this.selectedItem)
        log.info('loadMarkerPosition-----------------')
        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          var filePath = rootPath + '/' + this.settings.wbcClassDirName + '/' + this.orderId + '.json'
        } else {
          var filePath = rootPath + '/' + this.settings.bfClassDirName + '/' + this.orderId + '.json'
        }

        log.info(filePath)
        try {
          var jsonFile = fs.readFileSync(filePath, 'utf-8')
          return JSON.parse(jsonFile)

        } catch (err) {
          log.info(err.message)
          return null
        }
      },
      onKeyupDelete (evt) {
        // delete key
        if (evt.keyCode === 46) {
          log.info(this.$getSelectrions())
          var items = this.$getSelectrions().items
          items.forEach(function (item, index) {
            var path = item.currentSrc.replace('file:///', '')
            // 파일 or 폴더 존재 여부 체크
            if (fs.existsSync(path)) {
              // 파일 삭제
              fs.unlinkSync(path)
            }
          })

          this.loadClassificationImages()
        }
      },
      // onExport (evt) {
      //   var modifyList = lodash.cloneDeep(this.classList)
      //   modifyList.forEach(function(item) {
      //     item.targets = []
      //   })
      //
      //   for (var i = 0; i < this.classList.length; i++) {
      //     var parentNode = document.getElementById(this.classList[i].name)
      //     if (parentNode) {
      //       var images = parentNode.querySelectorAll('img')
      //       for (var j = 0; j < images.length; j++) {
      //         var divLabel = document.getElementById('testTextArea' + images[j].id)
      //         if (divLabel) {
      //           var srcId = this.classList[i].title
      //           var destId = divLabel.innerHTML
      //
      //           for (var k = 0; k < modifyList.length; k++) {
      //             if (modifyList[k].title === srcId) {
      //               modifyList[k].count--
      //               modifyList[k].targets.push({destId: destId})
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      //
      //   for (var i = 0; i < this.firstClassList.length; i++) {
      //     for (var j = 0; j < modifyList.length; j++) {
      //       if (this.firstClassList[i].id === modifyList[j].id) {
      //         this.firstClassList[i].count = this.drawClassList[i].count + modifyList[j].count
      //         this.firstClassList[i].targets = modifyList[j].targets
      //       }
      //     }
      //   }
      //
      //   ipcRenderer.send('open-file-dialog-for-dir', 'exportResult')
      //   console.log(this.firstClassList)
      // },
      // onDownloadXlsx (path) {
      //   console.log('onDownloadXlsx')
      //   var xlsxArr = [
      //     [this.selectedItem.BARCODE_NO, 'UNID', 'NE', 'ME', 'MY', 'PR', 'LY', 'LR', 'LA', 'MO', 'EO', 'BA', 'BL', 'PC', 'NR', 'AR', 'Count', 'Incorrect'],
      //     ['UNID', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0]
      //   ]
      //
      //   var incorrectCnt = 0
      //   var answerList = []
      //
      //   for (var i = 0; i < xlsxArr[0].length; i++) {
      //     var row = []
      //     // row title
      //     row.push(xlsxArr[0][i])
      //     // UNID
      //     row.push('')
      //
      //     for (var j = 0; j < this.firstClassList.length; j++) {
      //       if (xlsxArr[0][i] === this.firstClassList[j].title) {
      //         var rowtotCnt = 0
      //         var rowExCnt = 0
      //
      //         var targetsTmp = [
      //           {title: 'NE', count: 0},
      //           {title: 'ME', count: 0},
      //           {title: 'MY', count: 0},
      //           {title: 'PR', count: 0},
      //           {title: 'LY', count: 0},
      //           {title: 'LR', count: 0},
      //           {title: 'LA', count: 0},
      //           {title: 'MO', count: 0},
      //           {title: 'EO', count: 0},
      //           {title: 'BA', count: 0},
      //           {title: 'BL', count: 0},
      //           {title: 'PC', count: 0},
      //           {title: 'NR', count: 0},
      //           {title: 'AR', count: 0}
      //         ]
      //
      //         // 변경 데이터
      //         for (var k = 0; k < this.firstClassList[j].targets.length; k++) {
      //           for (var l = 0; l < targetsTmp.length; l++) {
      //             if (this.firstClassList[j].targets[k].destId === targetsTmp[l].title) {
      //               targetsTmp[l].count++
      //             }
      //           }
      //         }
      //         // 검출 데이터
      //         for (var l = 0; l < targetsTmp.length; l++) {
      //           if (targetsTmp[l].title === this.firstClassList[j].title) {
      //             targetsTmp[l].count = this.firstClassList[j].count
      //             answerList.push(this.firstClassList[j].count)
      //           }
      //
      //           if (targetsTmp[l].count > 0) {
      //             if (targetsTmp[l].title !== this.firstClassList[j].title) {
      //               rowExCnt += targetsTmp[l].count
      //             }
      //             rowtotCnt += targetsTmp[l].count
      //             row.push(targetsTmp[l].count)
      //           } else {
      //             row.push('')
      //           }
      //         }
      //
      //         row.push(rowtotCnt)
      //         row.push(rowExCnt)
      //
      //         incorrectCnt += rowExCnt
      //
      //         xlsxArr.push(row)
      //       }
      //     }
      //   }
      //
      //   // total row [
      //   var row = []
      //   var rowTotCnt = 0
      //
      //   row.push('Count')
      //   row.push(0)
      //
      //   var targetsTmp = [
      //     {title: 'NE', count: 0},
      //     {title: 'ME', count: 0},
      //     {title: 'MY', count: 0},
      //     {title: 'PR', count: 0},
      //     {title: 'LY', count: 0},
      //     {title: 'LR', count: 0},
      //     {title: 'LA', count: 0},
      //     {title: 'MO', count: 0},
      //     {title: 'EO', count: 0},
      //     {title: 'BA', count: 0},
      //     {title: 'BL', count: 0},
      //     {title: 'PC', count: 0},
      //     {title: 'NR', count: 0},
      //     {title: 'AR', count: 0}
      //   ]
      //
      //   xlsxArr.forEach(function (rows, index) {
      //     if (index > 1) {
      //       targetsTmp.forEach(function (target, targetIndex) {
      //         target.count += Number(rows[targetIndex + 2])
      //       })
      //     }
      //   })
      //
      //   targetsTmp.forEach(function(item) {
      //     row.push(item.count)
      //     rowTotCnt += item.count
      //   })
      //
      //   row.push(rowTotCnt)
      //   row.push(incorrectCnt)
      //   xlsxArr.push(row)
      //   // total row ]
      //
      //   console.log(answerList)
      //   console.log(rowTotCnt)
      //   var answerCnt = 0
      //   answerList.forEach(function(item) {
      //     answerCnt += item
      //   })
      //   var percent = Number(((answerCnt / rowTotCnt) * 100).toFixed(2))
      //   row = []
      //   row.push('Result')
      //   row.push(percent)
      //   xlsxArr.push(row)
      //
      //   try {
      //     var dataWS = XLSX.utils.aoa_to_sheet(xlsxArr)
      //     // dataWS['C3'].s = {'border': '1px'}
      //     dataWS['!cols'] = [{wpx: 100}]
      //     console.log(dataWS['C3'])
      //     // 엑셀의 workbook을 만든다
      //     var wb = XLSX.utils.book_new()
      //
      //     // workbook에 워크시트 추가
      //     XLSX.utils.book_append_sheet(wb, dataWS, '')
      //
      //     // 엑셀 파일을 내보낸다.
      //     XLSX.writeFile(wb, path + '/' + this.selectedItem.SLOT_ID + '.xlsx')
      //
      //     this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
      //       position: 'bottom-center',
      //       duration: '2000'
      //     })
      //   } catch (err) {
      //     console.log(err)
      //     this.$toasted.show(err.message, {
      //       position: 'bottom-center',
      //       duration: '2000'
      //     })
      //   }
      // },
      onSliderDragStart (evt) {
        log.info('onSliderDragStart')

        this.removeMarker()
      },
      onSliderDragEnd (evt) {
        log.info('onSliderDragEnd')
      },
      onDragStart (evt) {
        log.info('drag start')
        if (this.selectedItem.SIGNED_STATE !== this.commonCode(Constant.GET_CODE_SIGNED_STATE, '01').cdNm) {
          this.removeMarker()
        }
      },
      onDragEnd (evt) {
        log.info('drag end')
        if (this.isMarker) {
          this.drawCellMarker()
        }
      },
      // 스타고 검증으로 텍스트 박스 표기 (임시)
      modifyClassLabel (item) {
        var self = this

        // 기존 marker 삭제
        self.removeMarker()
        for (var len = this.$getSelectrions().items.length, i = 0; i < len; i++) {
          var divNode = document.createElement('div')
          divNode.id = 'testTextArea' + this.$getSelectrions().items[i].id
          divNode.className = 'testTextArea' + this.$getSelectrions().items[i].id
          divNode.style.width = '50px'
          divNode.style.height = '20px'
          divNode.style.border = '1px solid white'
          divNode.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'
          divNode.style.fontSize = '14px'
          divNode.style.fontWeight = '700'
          divNode.style.position = 'absolute'
          divNode.style.color = 'green'
          divNode.style.textAlign = 'center'
          divNode.style.left = this.$getSelectrions().items[i].offsetLeft + 'px'
          divNode.style.top = this.$getSelectrions().items[i].offsetTop + 'px'
          divNode.innerHTML = item.title

          var node = this.$getSelectrions().items[i].parentNode.getElementsByClassName('testTextArea' + this.$getSelectrions().items[i].id)
          var srcId = this.$getSelectrions().items[i].parentNode.id
          var destId = item.id + '_' + item.title

          if (node.length > 0) {
            this.$getSelectrions().items[i].parentNode.removeChild(node[0])
          }

          if (srcId === destId) {
            continue
          } else {
            this.$getSelectrions().items[i].parentNode.appendChild(divNode)
          }
        }
      },
      onClickClassTest (item) {
        this.modifyClassLabel(item)
      },
      onExportImage () {
        log.info(this.$getSelectrions().items)
        var length = this.$getSelectrions().items.length

        if (length !== 1) {
          this.$toasted.show(Constant.IDS_ERROR_PLEASE_SELECT_AN_IMAGE, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          ipcRenderer.send('open-file-dialog-for-dir', 'wbcClassificationImage')
        }
      },
      onClickClass (item) {
        var self = this
        log.info(item)
        log.info(this.$getSelectrions().items)
        // 기존 marker 삭제
        self.removeMarker()

        for (var len = this.$getSelectrions().items.length, i = 0; i < len; i++) {
          if (this.$getSelectrions().owner !== null) {
            // var url = this.$getSelectrions().items[i].currentSrc.split('/')
            // var targetFileName = url[url.length - 1]
            // var params = {}
            // params.data = {}
            // params.data.image = this.$getSelectrions().items[i],
            // params.data.srcId = this.$getSelectrions().owner.id,
            // params.data.targetId = item.id + '_' + item.title,
            // params.data.index = 0
            // params.data.curIndex = i
            // params.data.maxSize = len
            // params.data.groupId = this.$getUuid()

            var maxSize = len
            var url = this.$getSelectrions().items[i].currentSrc.split('/')
            var fileName = url[url.length - 1]
            var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
            var classDirName = null

            if (self.selectedItem.TEST_TYPE === '01' || self.selectedItem.TEST_TYPE === '04') {
              classDirName = self.settings.wbcClassDirName
            } else {
              classDirName = self.settings.bfClassDirName
            }

            // 파일 폴더 이동
            self.EventBus.$emit('OVERLAY', {state: true})

            var srcId = (this.$getSelectrions().owner.id).replace('area_', '')
            var targetId = (item.id + '_' + item.title).replace('area_', '')
            var srcPath = rootPath + '/' + classDirName + '/' + srcId + '/' + fileName
            var destPath = rootPath + '/' + classDirName + '/' + targetId + '/' + fileName

            var params = {
              srcPath: srcPath,
              destPath: destPath
            }

            log.info(params)

            api.moveFile(params).then(function(ret) {
              self.moveCnt++

              var targetSectionName = ''

              // change models
              self.drawClassList.forEach(function(item) {
                // delete
                if (srcId.includes(item.id)) {
                  item.count--
                  item.images.splice(item.images.indexOf('file://' + ret.srcPath), 1)

                  log.info(ret.srcPath)
                }

                // insert
                if (targetId.includes(item.id)) {
                  item.count++
                  item.images.splice(0, 0, 'file://' + ret.destPath)
                  targetSectionName = item.name

                  log.info(ret.destPath)
                }
              })

              // WBC 이미지 변경 로그 저장 (rollback)
              var histObj = {}
              histObj.userId = self.currentUser.userId
              histObj.modifyDttm = self.$getDateTime()
              histObj.seqNo = self.$getUuid()
              histObj.srcPath = srcPath
              histObj.destPath = destPath
              histObj.groupId = self.$getUuid()

              self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)

              // LBK_20230202 : update image hist [
              // var srcClassId = srcId.substr(0, 2)
              var destClassId = targetId.substr(0, 2)

              log.info(self.selectedItem)
              ipcRenderer.send(Constant.UPDATE_IMAGE_HIST, JSON.stringify({
                cassetId: self.selectedItem.CASSET_ID,
                slotId: self.selectedItem.SLOT_ID,
                destClassId: destClassId,
                fileName: fileName
              }))
              // update image hist ]

              // complete move files
              if (self.moveCnt === maxSize) {
                self.$nextTick(function () {
                  setTimeout(function() {
                    self.moveCnt = 0

                    // 이미지 조정후 이동시 사이즈 동일하게 조정
                    // 2021_09_02_LBK : brightness 조정
                    var images = document.getElementById(targetSectionName).querySelectorAll('img')

                    self.drawClassList.forEach(function(classItem) {
                      if (classItem.name === targetSectionName) {
                        for (var i = 0; i < images.length; i++) {
                          if (typeof(classItem.imgWidth) !== 'undefined') {
                            images[i].style.width = classItem.imgWidth
                          } else {
                            images[i].style.width = self.imgWidth
                          }
                        }
                      }
                    })

                    // marker
                    if (self.isMarker) {
                      self.drawCellMarker()
                    }

                    // update hist
                    self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(self.drawClassList))
                    self.EventBus.$emit('OVERLAY', {state: false})

                    // drag 활성화
                    self.$initDrag()
                    self.setRgbColor()
                  })
                })
              }

            }).catch(function (err) {
              log.info(err)

              // draw cell marker
              setTimeout(function() {
                if (self.isMarker) {
                  self.drawCellMarker()
                  self.moveCnt = 0
                }
                self.EventBus.$emit('OVERLAY', {state: false})
                self.$toasted.show(err.message, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }, 0)
            })
          } else {
            self.$toasted.show(Constant.IDS_ERROR_SELECT_A_TARGET_ITEM, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        }
      },
      onClickRollback () {
        log.info('onClickRollback')
        log.info(this.getWbcImageHist(this.currentUser.userId))
        var self = this

        var wbcModifyList = self.getWbcImageHist(self.currentUser.userId)
        // userId: "cccccc", modifyDttm: "2023-11-07 17:13:15", seqNo: "20231107171315987", srcPath: "D:/IA_Proc/20230824150758_00_20230824150806/01_WBC…assification/71_NS/NES_20231016150116_011_000.bmp", destPath: "D:/IA_Proc/20230824150758_00_20230824150806/01_WBC…assification/13_GP/NES_20231016150116_011_000.bmp", …}
        console.log('💫')
        console.log('💫')
        console.log('💫')
        console.log('💫')
        console.log(wbcModifyList)
        
        if ((wbcModifyList.length) > 0 && (self.curPos < wbcModifyList.length)) {
          var curGroupId = wbcModifyList[self.curPos].groupId

          wbcModifyList.forEach(function (item, index) {
            if (item.groupId === curGroupId) {
              fs.rename(item.destPath, item.srcPath, (err) => {
                if (!err) {
                  curGroupId = item.groupId
                  self.curPos++

                  self.loadClassificationImages()
                  setTimeout(function() {
                    if (self.isMarker) {
                      self.drawCellMarker()
                    }
                    self.EventBus.$emit('UPDATE_HIST_LIST', null)
                  }, 0)
                  if (self.curPos >= wbcModifyList.length) {
                    self.curPos = 0

                    // 이미지 변경 내역 초기화
                    self.$store.dispatch(Constant.INIT_WBC_IMAGE_HIST, null)
                  }

                } else {
                  log.info(err.message)
                  self.$toasted.show(Constant.IDS_ERROR_FILE_CLISSIFICATION, {
                    position: 'bottom-center',
                    duration: '2000'
                  })

                  return
                }
              })
            }
          })
        }
      },
      setRgbColor () {
        var self = this

        var classTemp = this.drawClassList.filter(function(item) {
          return item.count > 0
        })

        log.info(classTemp)

        var setRgbIds = []

        // rgb
        classTemp.forEach(function(drawClass) {
          self.getRgbValue.forEach(function(rgbClass) {
            if (drawClass.id === rgbClass.id) {
              setRgbIds.push(rgbClass.id)
              var element = document.getElementById('area_' + rgbClass.id + '_' + rgbClass.title)
              if (element !== null) {
                var images = element.querySelectorAll('img')
                for (var i = 0; i < images.length; i++) {
                  images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + rgbClass.redValue + ',' + rgbClass.greenValue + ',' + rgbClass.blueValue + ')) brightness(' + self.brightnessValue + '%)'
                }
              }
            } else {
              if (setRgbIds.indexOf(drawClass.id) < 0) {
                var element = document.getElementById('area_' + drawClass.id + '_' + drawClass.title)
                if (element !== null) {
                  var images = element.querySelectorAll('img')
                  for (var i = 0; i < images.length; i++) {
                    images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(0, 0, 0)) brightness(' + self.brightnessValue + '%)'
                  }
                }
              }
            }
          })
        })

        this.getRgbValue.forEach(function(item) {
          var element = document.getElementById('area_' + item.id + '_' + item.title)
          if (element !== null) {
            var images = element.querySelectorAll('img')
            for (var i = 0; i < images.length; i++) {
              images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + item.redValue + ',' + item.greenValue + ',' + item.blueValue + ')) brightness(' + self.brightnessValue + '%)'
            }
          }
        })
      },
      setImageStyle () {
        var self = this
        this.$nextTick(function () {
          // size
          var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
          var maxWidth = 360
          var offsetWidth = (maxWidth * (this.sliderValue / 100)).toFixed(0)

          for (var i = 0; i < images.length; i++) {
            if (offsetWidth >= 120) {
              images[i].style.width = offsetWidth + 'px'
              this.imgWidth = offsetWidth + 'px'
            } else {
              images[i].style.width = '120px'
              this.imgWidth = '120px'
            }
          }

          this.setRgbColor()

        })
      },
      loadClassificationImages () {
        var self = this
        var classList = []
        var classDir = ''
        var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID

        this.drawClassList = []

        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          classList = this.classList(this.selectedItem.IS_NS_NB_INTEGRATION)
          classDir = rootPath + '/' + this.settings.wbcClassDirName

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
          classList = this.bfClassList
          classDir = rootPath + '/' + this.settings.bfClassDirName
        }

        // wbc file load
        var params = {
          classList: classList,
          classDir: classDir,
          selectItem: this.selectedItem
        }

        console.log(params)
        api.getWbcFiles(params)
        .then(function (res) {
          console.log(res)

          self.drawClassList = res.classificationResult
          self.totalCount = res.imgCount

          self.drawClassList.sort(function(a, b) {
            return a.order - b.order
          })

          self.$initDrag()
          self.setImageStyle()
          // self.createMatrix()

        }).catch(function (err) {
          console.log(err.message)
          if (err.err.code === 'ENOENT') {
            if (err.classId === '90' || err.classId === '91' ||
                err.classId === '92' || err.classId === '93' ||
                err.classId === '94') {
              self.loadClassificationImages()
            }
          }
        })

      },
      drawCellMarker () {
        log.info('draw cell marker')
        var self = this
        this.removeMarker()
        this.markerPosition = this.loadMarkerPosition()
        log.info(this.markerPosition)

        var classList = []
        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          classList = this.classList(this.selectedItem.IS_NS_NB_INTEGRATION)

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
          classList = this.bfClassList
        }

        log.info(classList)

        self.$nextTick(function () {
          for (var i = 0; i < classList.length; i++) {
            var parentNode = document.getElementById(classList[i].name)

            if (parentNode !== null) {
              var images = parentNode.querySelectorAll('img')

              images.forEach(function(item) {
                var divNode = document.createElement('div')
                divNode.className = 'cellMarker'
                divNode.id = 'div' + item.id
                divNode.style.width = '5px'
                divNode.style.height = '5px'
                divNode.style.border = '2px solid #00FF00'
                divNode.style.position = 'absolute'
                divNode.style.left = item.offsetLeft + 'px'
                divNode.style.top = item.offsetTop + 'px'

                // var divNode = new Image()
                // divNode.src = require('@/assets/result/rbc_point.png')
                // divNode.className = 'cellMarker'
                // divNode.id = 'div' + item.id
                // divNode.width = 6
                // divNode.height = 6
                // divNode.style.position = 'absolute'
                // divNode.style.left = item.offsetLeft + 'px'
                // divNode.style.top = item.offsetTop + 'px'
                // divNode.style.zIndex = '1'

                item.parentNode.appendChild(divNode)

                var url = item.currentSrc.split('/')
                var srcFileName = url[url.length - 1]

                if (self.markerPosition !== null) {
                  self.markerPosition.forEach(function (position) {
                    if (position.FILE_NM === srcFileName) {
                      if (position.POSX1 !== 0 && position.POSX2 !== 0) {
                        var widthRatio = (item.offsetWidth / Number(position.ORG_WIDTH) * 100).toFixed(0)
                        var heightRatio = (item.offsetHeight / Number(position.ORG_HEIGHT) * 100).toFixed(0)

                        var rectWidth = (Number(position.POSX2) - Number(position.POSX1)) * (widthRatio / 100)
                        var rectHeight = (Number(position.POSY2) - Number(position.POSY1)) * (heightRatio / 100)

                        divNode.style.left = item.offsetLeft + (Number(position.POSX1) * (widthRatio / 100)) + (rectWidth / 2) + 'px'
                        divNode.style.top = item.offsetTop + (Number(position.POSY1) * (heightRatio / 100)) + (rectHeight / 2) + 'px'

                        item.parentNode.appendChild(divNode)

                      } else {
                        divNode.style.display = 'none'
                      }
                    }
                  })
                }
              })
            }
          }
        })
      },
      removeMarker () {
        var self = this
        var classList = []

        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          classList = this.classList(this.selectedItem.IS_NS_NB_INTEGRATION)

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
          classList = this.bfClassList
        }

        classList.forEach(function(item) {
          var parentNode = document.getElementById(item.name)
          if (parentNode !== null) {
            var markers = parentNode.getElementsByClassName('cellMarker')
            while(markers.length > 0) {
              markers[0].parentNode.removeChild(markers[0])
            }
          }
        })
      },
      zoom (evt) {
        var targetElement = null

        if (evt.target.querySelectorAll('img').length <= 0) {
          targetElement = evt.target.parentElement
        } else {
          targetElement = evt.target
        }

        var targetDirName = targetElement.id.replace('area_', '')
        var images = targetElement.querySelectorAll('img')

        if (evt.deltaY < 0) {
          var width = (images[0].offsetWidth + 1) + 'px'
          // this.imgWidth = width

          this.drawClassList.forEach(function(classItem) {
            if (classItem.dirName === targetDirName) {
              classItem.imgWidth = width
            }
          })

          if ((images[0].offsetWidth + 1) <= 360) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        } else {
          var width = (images[0].offsetWidth - 1) + 'px'
          // this.imgWidth = width

          this.drawClassList.forEach(function(classItem) {
            if (classItem.dirName === targetDirName) {
              classItem.imgWidth = width
            }
          })

          if ((images[0].offsetWidth - 1) >= 120) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        }

        if (this.isMarker) {
          this.drawCellMarker()
        }
      },
      // change scroll position
      onClickTab (item) {
        document.getElementById('wbcImageCardWrapper').scrollTop = document.getElementById(item.name).offsetTop - 60
      },
      onChangeMarker (value) {
        this.$store.dispatch(Constant.UPDATE_MARKER_STATE, value)
        if (value) {
          this.drawCellMarker()
        } else {
          this.removeMarker()
        }
      },
      // moveFile (params, targetFileName, evt) {
      //   return new Promise((succ, fail) => {
      //     var self = this
      //     var url = params.data.image.currentSrc.split('/')
      //     var srcFileName = url[url.length - 1]
      //     var srcId = params.data.srcId.replace('area_', '')
      //     var targetId = params.data.targetId.replace('area_', '')
      //     var classDirName = ''
      //
      //     // 대상 폴더에 동일 파일명 체크
      //     var rootPath = self.settings.pbiaRootPath + '/' + self.orderId
      //
      //     if (self.selectedItem.TEST_TYPE === '01' || self.selectedItem.TEST_TYPE === '04') {
      //       classDirName = self.settings.wbcClassDirName
      //     } else {
      //       classDirName = self.settings.bfClassDirName
      //     }
      //
      //     var targetPath = rootPath + '/' + classDirName + '/' + targetId
      //
      //     fs.access(targetPath + '/' + targetFileName, fs.F_OK, (err) => {
      //       if (err) {
      //         if (err.code === 'ENOENT') {
      //           var srcPath = rootPath + '/' + classDirName + '/' + srcId + '/' + srcFileName
      //           var destPath = rootPath + '/' + classDirName + '/' + targetId + '/' + targetFileName
      //
      //           // 현재 탭으로 이동 제외 (파일명에 _ 계속 추가 되는 문제 생김)
      //           if (srcId === targetId) {
      //             fail('current tab')
      //           }
      //
      //           // move
      //           fs.stat(targetPath, (err) => {
      //             if (!err) {
      //               fs.rename(srcPath, destPath, (err) => {
      //                 if (!err) {
      //                   var targetSectionName = ''
      //
      //                   var beforeObj = lodash.cloneDeep(self.drawClassList)
      //
      //                   // change models
      //                   for (var i = 0; i < self.drawClassList.length; i++) {
      //                     // delete
      //                     if (srcId.includes(self.drawClassList[i].id)) {
      //                       self.drawClassList[i].count--
      //                       self.drawClassList[i].images.splice(self.drawClassList[i].images.indexOf('file://' + srcPath), 1)
      //                     }
      //                     // insert
      //                     if (targetId.includes(self.drawClassList[i].id)) {
      //                       self.drawClassList[i].count++
      //                       self.drawClassList[i].images.splice(params.data.index, 0, 'file://' + destPath)
      //                       targetSectionName = self.drawClassList[i].name
      //                     }
      //                   }
      //
      //                   // 로그 저장
      //                   // var logObj = {}
      //                   // logObj.userId = self.currentUser.userId
      //                   // logObj.eventTypeCd = Constant.EVENT_TYPE_USER
      //                   // logObj.logDttm = self.$getDateTimeStr()
      //                   // logObj.logMessage = '[' + Constant.EVENT_TYPE_USER + ']  ' +
      //                   //                     'src : [' + srcPath + ']' + '\n' + 'dest : [' + destPath + ']'
      //                   // self.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      //
      //                   // WBC 이미지 변경 로그 저장 (rollback)
      //                   var histObj = {}
      //                   histObj.userId = self.currentUser.userId
      //                   histObj.modifyDttm = self.$getDateTime()
      //                   histObj.seqNo = self.$getUuid()
      //                   histObj.srcPath = srcPath
      //                   histObj.destPath = destPath
      //                   histObj.groupId = params.data.groupId
      //
      //                   self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)
      //
      //                   // 이미지 조정후 이동시 사이즈 동일하게 조정
      //                   // 2021_09_02_LBK : brightness 조정
      //                   self.$nextTick(function () {
      //                     var images = document.getElementById(targetSectionName).querySelectorAll('img')
      //
      //                     for (var i = 0; i < images.length; i++) {
      //                       images[i].style.width = self.imgWidth
      //                       images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + self.brightnessValue + '%)'
      //                     }
      //
      //                     self.$initDrag()
      //                     succ(self.drawClassList)
      //                   })
      //
      //                 } else {
      //                   console.log(err.message)
      //                   self.$toasted.show(Constant.IDS_ERROR_FILE_CLISSIFICATION, {
      //                     position: 'bottom-center',
      //                     duration: '2000'
      //                   })
      //
      //                   fail(err.message)
      //                 }
      //               })
      //             } else {
      //               console.log(err.message)
      //               self.$toasted.show(Constant.IDS_ERROR_FILE_CLISSIFICATION, {
      //                 position: 'bottom-center',
      //                 duration: '2000'
      //               })
      //
      //               fail(err.message)
      //             }
      //             // else if (err.code === 'ENOENT') {
      //             //   // 디렉토리 없으면 생성
      //             //   fs.mkdirSync(targetPath)
      //             //   self.moveFile(params, targetFileName, evt)
      //             // }
      //           })
      //         }
      //       } else {
      //         fail('')
      //         // 동일 파일명 존재하면 _추가
      //         // targetFileName = '_' + targetFileName
      //         // self.moveFile(params, targetFileName, evt).then(function(ret) {
      //         //   succ(ret)
      //         // }).catch(function (err) {
      //         //   fail(err.message)
      //         // })
      //       }
      //     })
      //   })
      // }
    }
  }
</script>

<style>
  .tabBorderOn {
    border-bottom: 2px solid;
    border-color: #2A9284;
    text-align: center;
    width: 100%;
  }
  .tabBorderOff {
    border-bottom: 2px solid;
    border-color: gray;
    text-align: center;
  }
  #cls {
    color: white;
  }
  #tabCount {
    color: #2A9284;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 15px;
    font-size: 12px;
  }
  #imgClassName {
    font-size: 13px;
    margin-left: 5px;
    /* position: absolute; */
    top: 7px;
  }
  #imgTitle {
    border-bottom: 2px solid #09CBFC;
  }
  #menuOptions:hover {
    background-color: #3F628C;
    color: white;
  }
  #wbcImageCard {
    height: 786px;
  }
  #wbcImageCardWrapper {
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .classTab {
    color: white;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }

  /* .maskImg {
    background-image: -webkit-linear-gradient(270deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 95% );
	  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 95% );
  } */
  /*
  .clipImg::before {
    content: 'ddasd';
    clip-path: circle(50px at center);
    position: absolute;
    background: green;
    display: block;
    top: 1px;
    left: 1px;
  } */
</style>
