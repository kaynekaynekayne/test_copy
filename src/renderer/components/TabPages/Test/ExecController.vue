<template>
  <div id="execController">
    <b-card class="blackCard h-100 pb-0" text-variant="white" no-body>
      <b-row>
        <b-col class="pb-2" cols="7">
          <b-form-select class="custonSelectWhite" v-model="rSelected" :options="testTypeList" @change="onChangeTestType"></b-form-select>
        </b-col>
        <b-col class="p-0 pl-2">
          <b-form-select class="custonSelectWhite" v-model="sSelected" :options="wbcCountList"></b-form-select>
        </b-col>
        <b-col class="p-0 pl-2 pr-3">
          <b-form-select id="selectStitchCount" class="custonSelectWhite" v-model="stitchCount" :options="stitchCountList"></b-form-select>
        </b-col>
      </b-row>
      <b-row class="text-center">
        <b-col cols="7" class="pl-2 pr-2 pb-1">
          <div id="startWrapper">
            <img v-if="isPause" class="w-100 pointer" src="~@/assets/test/btn_start_on.png" @click="reStart"/>
            <img v-else-if="isRunningState" class="w-100 pointer" src="~@/assets/test/btn_stop_on.png" @click="stop"/>
            <img v-else-if="userStop && !isRecoveryRun" class="w-100 pointer" src="~@/assets/test/btn_start_on_recover.png" @click="start" />
            <img v-else-if="userStop && isRecoveryRun" class="w-100 pointer" src="~@/assets/test/btn_start_on_recover_off.png" />
            <img v-else-if="isInit === 'N'" class="w-100" src="~@/assets/test/btn_start_off_large.png" />
            <img v-else class="w-100 pointer" src="~@/assets/test/btn_start_on.png" @click="start" />
          </div>
        </b-col>
        <b-col class="pl-2 pr-2 pb-1">
          <div id="stopWrapper" class="pt-1 pr-1">
            <img v-if="isInit === 'N'" class="float-right w-100 pr-1 pointer" src="~@/assets/test/btn_init_on.png" @click="sendIntialize" />
            <img v-else class="float-right w-100 pr-1" src="~@/assets/test/btn_init_off.png" />
            <img v-if="isPause" class="w-100 mt-2 pr-1" src="~@/assets/test/btn_stop_off.png"/>
            <img v-else-if="isRunningState" class="w-100 mt-2 pr-1" src="~@/assets/test/btn_start_off.png" />
            <img v-else class="w-100 mt-2 pr-1" src="~@/assets/test/btn_stop_off.png" />
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  import fs from 'fs'
  import worker from '../../../workers/promise'
  import lodash from 'lodash'
  import ModalConfirm from '../../Common/ModalConfirm'

  // const ipcRenderer = require('electron').ipcRenderer

  export default {
    socket: null,
    name: 'exec-controller',
    computed: {
      ...mapGetters({
        testTypeList: Constant.GET_TEST_TYPE,
        stitchCountList: Constant.GET_STITCH_COUNT,
        wbcCountList: Constant.GET_WBC_COUNT,
        currentUser: Constant.GET_CURRENT_USER,
        runningIntervalId: Constant.GET_RUNNING_INTERVAL_ID,
        isRunningState: Constant.GET_RUNNING_STATE,
        settings: Constant.GET_SETTINGS,
        userStop: Constant.GET_USER_STOP,
        isPause: Constant.GET_PAUSE_STATE,
        isRecoveryRun: Constant.GET_IS_RECOVERY_RUN,
        sysInfo: Constant.GET_SYS_INFO,
        backendData: Constant.GET_BACKEND_DATA
      })
    },
    watch: {
      isRecoveryRun: function(newVal, oldVal) {
        console.log(newVal)
      },
      sysInfo: function(newVal, oldVal) {
        this.isInit = this.sysInfo.isInit
      },
      backendData: function(newVal, oldVal) {
        if (this.backendData.jobCmd === 'INIT') {
          this.isInit = 'Y'
        }
      }
    },
    data () {
      return {
        rSelected: '01',
        sSelected: '100',
        stitchCount: '1',
        // 초기화 여부 체크
        isInit: 'N',
        intervalId: null,
        // eqStatCd: '01',
        bfSelectFiles: []
      }
    },
    beforeDestroy () {
      // remove EventBus
      // this.EventBus.$off('RECEIVE_DATA_SYSINFO')
      // this.EventBus.$off('RECEIVE_DATA')
      this.EventBus.$off('CHANGE_USER')
      // this.EventBus.$off('RECOVER_GRIPPER')
      this.EventBus.$off('SELECT_BF_IMG')
    },
    mounted () {
      var self = this
      this.intervalId = lodash.cloneDeep(this.runningIntervalId)

      if (this.isRunningState) {
        this.isInit = 'Y'
      }

      // stitch count
      this.stitchCount = this.settings.stitchCount

      // test type
      this.rSelected = this.settings.testTypeCd

      // wbc count
      if (this.rSelected === '01' || this.rSelected === '04') {
        this.sSelected = this.settings.pbAnalysisType
      } else {
        this.sSelected = this.settings.bfAnalysisType
      }

      if (this.rSelected !== '04') {
        document.getElementById('selectStitchCount').disabled = true
      } else {
        document.getElementById('selectStitchCount').disabled = false
      }

      // this.EventBus.$on('RECOVER_GRIPPER', function(params) {
      //   console.log('RECOVER_GRIPPER')
      //   self.sendRecover()
      // })

      this.sendSearchCardCount()

      this.EventBus.$on('CHANGE_USER', function(params) {
        self.sSelected = self.settings.pbAnalysisType
        // stitch count
        self.stitchCount = self.settings.stitchCount

        // wbc count
        if (self.rSelected === '01' || self.rSelected === '04') {
          self.sSelected = self.settings.pbAnalysisType
        } else {
          self.sSelected = self.settings.bfAnalysisType
        }

        if (self.rSelected !== '04') {
          document.getElementById('selectStitchCount').disabled = true
        } else {
          document.getElementById('selectStitchCount').disabled = false
        }

        // self.$store.dispatch(Constant.UPDATE_TEST_TYPE, '01')
      })

      // this.EventBus.$on('RECEIVE_DATA_SYSINFO', function(params) {
      //   self.isInit = params.isInit
      // })

      // this.EventBus.$on('RECEIVE_DATA', function(params) {
      //   var jobCmd = params.jobCmd
      //   if (jobCmd === 'INIT') {
      //     self.isInit = 'Y'
      //   }
      // })

      // select bf image
      this.EventBus.$on('SELECT_BF_IMG', function(params) {
        self.bfSelectFiles = params
      })

    },
    methods: {
      // 초기화
      sendIntialize () {
        var params = {
          jobCmd: 'INIT',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        console.log('--init--')
        console.log(params)
        worker.sendDataToServer(this, JSON.stringify(params))
        // overlay off
        // this.EventBus.$emit('OVERLAY', {state: true})
      },
      // 재실행
      sendReStart() {
        var params = {
          jobCmd: 'RESTART',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          bfSelectFiles: this.bfSelectFiles
        }

        console.log(params)
        worker.sendDataToServer(this, JSON.stringify(params))
      },
      // 실행
      sendStart () {
        var params = {
          jobCmd: 'START',
          reqUserId: this.currentUser.userId,
          testType: this.rSelected,
          wbcCount: this.sSelected,
          stitchCount: this.stitchCount,
          runningMode: this.settings.runningMode,
          positionMargin: this.settings.positionMargin,
          wbcPositionMargin: this.settings.wbcPositionMargin,
          pltPositionMargin: this.settings.pltPositionMargin,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))

        var logObj = {}
        logObj.userId = this.currentUser.userId
        logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        logObj.logDttm = this.$getDateTimeStr()
        logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
                            '[Send : START]' +
                            '[' + this.currentUser.userId + ']'
        this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      // 검사 실행 정보 수신
      sendRunningInfo () {
        var params = {
          jobCmd: 'RUNNING_INFO',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      // 실행 완료
      sendRunningComp () {
        var params = {
          jobCmd: 'RUNNING_COMP',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      reStart (evt) {
        this.sendReStart()
      },
      start (evt) {
        var self = this

        // 실행 여부 체크
        if (self.isRunningState) {
          self.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        // recovery필요 여부 체크
        if (self.userStop) {
          self.$modal.show(ModalConfirm, {openType: 'userStop', message: Constant.IDS_RECOVER_GRIPPER_CONDITION}, {
            height: 'auto',
            width: '350px'
          })

          return
        }

        // 초기화 여부 체크
        setTimeout(function() {
          if (self.isInit === 'Y') {
            self.$store.dispatch(Constant.INIT_ORDER_LIST, null)
            self.sendStart()
          } else {
            // self.sendIntialize()
            self.$toasted.show(Constant.IDS_MSG_INITALIZE, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        }, 0)
      },
      stop (evt) {
        var self = this

        if (!self.isRunningState) {
          self.$toasted.show(Constant.IDS_ERROR_STOP_PROCESS, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        // 종료
        var params = {
          jobCmd: 'STOP',
          reqUserId: self.currentUser.userId,
          reqDttm: self.$getDateTimeStr(),
          isEmergency: 'N',
          isUserStop: 'Y'
        }

        worker.sendDataToServer(this, JSON.stringify(params))
        self.$store.dispatch(Constant.SET_USER_STOP, true)

        // seve logs
        var logObj = {}
        logObj.userId = this.currentUser.userId
        logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        logObj.logDttm = this.$getDateTimeStr()
        logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
                            '[Send : STOP]' +
                            '[' + this.currentUser.userId + ']'
        this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      // sendRecover () {
      //   var self = this
      //
      //   // 종료
      //   var params = {
      //     jobCmd: 'RECOVERY',
      //     reqUserId: self.currentUser.userId,
      //     reqDttm: self.$getDateTimeStr()
      //   }
      //
      //   worker.sendDataToServer(this, JSON.stringify(params))
      //   self.EventBus.$emit('OVERLAY', {state: true})
      // },
      onChangeRadio (value) {
        if (value === '01') {
          this.sSelected = this.settings.pbAnalysisType
        } else {
          this.sSelected = this.settings.bfAnalysisType
        }
      },
      onChangeTestType (value) {
        if (this.rSelected !== '04') {
          document.getElementById('selectStitchCount').disabled = true
        } else {
          document.getElementById('selectStitchCount').disabled = false
        }

        // default value 적용
        if (this.rSelected === '01' || this.rSelected === '04') {
          this.sSelected = this.settings.pbAnalysisType
        } else {
          this.sSelected = this.settings.bfAnalysisType
        }

        this.sendSearchCardCount()
        // this.$store.dispatch(Constant.UPDATE_TEST_TYPE, value)
        this.EventBus.$emit('CHANGE_TEST_TYPE', {testType: value})
      },
      // 카드 횟수 조회
      sendSearchCardCount () {
        console.log('sendSearchCardCount')

        var params = {
          jobCmd: 'SEARCH_CARD_COUNT',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          testType: this.rSelected
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      }
    }
  }
</script>
<style>
.imgSelect {
  -webkit-filter: opacity(.8) drop-shadow(0 0 0 white) !important;
  filter: opacity(.8) drop-shadow(0 0 0 white) !important;
}
</style>
